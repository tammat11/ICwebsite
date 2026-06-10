const SPREADSHEET_ID = '1ApfnLS5npNMBW3YYI9_d94yyWwbfv-Bpck_Hozjcl58';
const OBJECTS_SHEET_CANDIDATES = [
  'Объекты',
  'Список постаматов (копия)',
  'Список постаматов',
  'Список уборки Kaspi Postomat',
];
const HISTORY_SHEET_NAME = 'История уборок';
const SCRIPT_VERSION = '2026-06-10-pst-dashboard-lite-v1';
const DASHBOARD_TOKEN = '';
const DATA_START_ROW = 2;

const OBJECT_HEADER_CANDIDATES = {
  id: ['POSTOMAT_ID', 'ID', 'Postomat ID'],
  city: ['Город'],
  branch: ['Филиал'],
  address: ['Адрес'],
  category: ['Категория точки'],
};

const HISTORY_HEADER_CANDIDATES = {
  id: ['POSTOMAT_ID', 'ID'],
  city: ['Город'],
  branch: ['Филиал'],
  address: ['Адрес'],
  category: ['Категория точки'],
  date: ['Дата отправки', 'Дата уборки', 'Дата'],
  time: ['Время'],
  folder: [
    'Ссылка на папку с фотографиями в Google Drive',
    'Ссылки на фотографии в Google Drive',
  ],
};

function doGet(event) {
  try {
    assertToken(event);

    const action = String((event.parameter && event.parameter.action) || 'overview').trim();
    let payload;

    if (action === 'overview') {
      payload = handleOverview(event);
    } else if (action === 'object_history') {
      payload = handleObjectHistory(event);
    } else if (action === 'health') {
      payload = { ok: true, version: SCRIPT_VERSION, action: 'health' };
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    return respond(payload, event);
  } catch (error) {
    return respond(
      {
        ok: false,
        version: SCRIPT_VERSION,
        error: String(error && error.message ? error.message : error),
      },
      event
    );
  }
}

function handleOverview(event) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const objectsSheet = getObjectsSheet(spreadsheet);
  const historySheet = getSheetRequired(spreadsheet, HISTORY_SHEET_NAME);

  const page = Math.max(Number(event.parameter.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(event.parameter.pageSize || 25), 10), 100);
  const selectedDate = normalizeIsoDate(event.parameter.date) || getTodayIso();
  const selectedBranch = String(event.parameter.branch || '').trim();
  const query = normalizeSearch(String(event.parameter.query || ''));

  const objects = loadObjects(objectsSheet);
  const allHistoryRows = enrichHistoryRows(loadHistoryRows(historySheet), objects);

  const selectedDateRows = allHistoryRows
    .filter((row) => row.date === selectedDate)
    .filter((row) => (!selectedBranch ? true : row.branch === selectedBranch))
    .filter((row) => historyMatchesQuery(row, query))
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  const total = selectedDateRows.length;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pagedRows = selectedDateRows.slice(pageStart, pageStart + pageSize);

  const weekRange = getWeekRange(selectedDate);
  const weeklyFactCount = countUniquePostomats(
    allHistoryRows
      .filter((row) => row.date >= weekRange.start && row.date <= weekRange.end)
      .filter((row) => (!selectedBranch ? true : row.branch === selectedBranch))
      .filter((row) => historyMatchesQuery(row, query))
  );

  return {
    ok: true,
    version: SCRIPT_VERSION,
    filters: {
      date: selectedDate,
      branch: selectedBranch,
      query: String(event.parameter.query || ''),
      page: safePage,
      pageSize: pageSize,
    },
    summary: {
      factOnDate: countUniquePostomats(selectedDateRows),
      weeklyFactCount: weeklyFactCount,
    },
    branches: Array.from(
      new Set(
        Array.from(objects.values())
          .map((item) => item.branch)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, 'ru')),
    rows: pagedRows,
    recentHistory: pagedRows,
    pagination: {
      page: safePage,
      pageSize: pageSize,
      total: total,
      totalPages: totalPages,
    },
  };
}

function handleObjectHistory(event) {
  const postomatId = String(event.parameter.postomatId || '').trim();
  if (!postomatId) {
    throw new Error('postomatId is required');
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const objectsSheet = getObjectsSheet(spreadsheet);
  const historySheet = getSheetRequired(spreadsheet, HISTORY_SHEET_NAME);
  const objects = loadObjects(objectsSheet);
  const historyRows = enrichHistoryRows(loadHistoryRows(historySheet), objects);

  return {
    ok: true,
    version: SCRIPT_VERSION,
    postomatId: postomatId,
    items: historyRows
      .filter((row) => row.postomatId === postomatId)
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
      .slice(0, 100),
  };
}

function getObjectsSheet(spreadsheet) {
  for (let index = 0; index < OBJECTS_SHEET_CANDIDATES.length; index += 1) {
    const candidate = spreadsheet.getSheetByName(OBJECTS_SHEET_CANDIDATES[index]);
    if (candidate) return candidate;
  }

  const fallback = spreadsheet
    .getSheets()
    .filter((sheet) => sheet.getName() !== HISTORY_SHEET_NAME)[0];
  if (!fallback) {
    throw new Error('Objects sheet not found');
  }
  return fallback;
}

function getSheetRequired(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet not found: ${sheetName}`);
  }
  return sheet;
}

function loadObjects(sheet) {
  const headers = getHeaderMap(sheet, OBJECT_HEADER_CANDIDATES);
  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return new Map();

  const values = sheet
    .getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, sheet.getLastColumn())
    .getDisplayValues();
  const objects = new Map();

  values.forEach((row) => {
    const postomatId = getValueByHeader(row, headers, 'id');
    if (!postomatId) return;
    objects.set(postomatId, {
      postomatId: postomatId,
      city: getValueByHeader(row, headers, 'city'),
      branch: getValueByHeader(row, headers, 'branch'),
      address: getValueByHeader(row, headers, 'address'),
      category: getValueByHeader(row, headers, 'category'),
    });
  });

  return objects;
}

function loadHistoryRows(sheet) {
  const headers = getHeaderMap(sheet, HISTORY_HEADER_CANDIDATES);
  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return [];

  const values = sheet
    .getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, sheet.getLastColumn())
    .getDisplayValues();

  return values
    .map((row) => ({
      postomatId: getValueByHeader(row, headers, 'id'),
      city: getValueByHeader(row, headers, 'city'),
      branch: getValueByHeader(row, headers, 'branch'),
      address: getValueByHeader(row, headers, 'address'),
      category: getValueByHeader(row, headers, 'category'),
      date: normalizeTableDate(getValueByHeader(row, headers, 'date')),
      time: getValueByHeader(row, headers, 'time'),
      folderLinkText: getValueByHeader(row, headers, 'folder'),
    }))
    .filter((row) => row.postomatId)
    .filter((row) => row.date);
}

function enrichHistoryRows(rows, objects) {
  return rows.map((row) => {
    const object = objects.get(row.postomatId);
    return {
      postomatId: row.postomatId,
      city: row.city || (object ? object.city : ''),
      branch: row.branch || (object ? object.branch : ''),
      address: row.address || (object ? object.address : ''),
      category: row.category || (object ? object.category : ''),
      date: row.date,
      time: row.time,
      folderLinkText: row.folderLinkText,
    };
  });
}

function historyMatchesQuery(row, query) {
  if (!query) return true;
  return normalizeSearch(
    [
      row.postomatId,
      row.city,
      row.branch,
      row.address,
      row.category,
      row.date,
      row.time,
    ].join(' ')
  ).indexOf(query) !== -1;
}

function countUniquePostomats(rows) {
  return new Set(
    rows
      .map((row) => row.postomatId)
      .filter(Boolean)
  ).size;
}

function getWeekRange(isoDate) {
  const parts = String(isoDate || '')
    .split('-')
    .map(Number);
  const date = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
  const weekday = date.getDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;

  const start = new Date(date);
  start.setDate(date.getDate() + mondayOffset);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    start: formatIsoDate(start),
    end: formatIsoDate(end),
  };
}

function formatIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

function getHeaderMap(sheet, candidatesByKey) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const map = {};
  Object.keys(candidatesByKey).forEach((key) => {
    map[key] = headers.findIndex((header) => candidatesByKey[key].indexOf(String(header).trim()) !== -1);
  });
  return map;
}

function getValueByHeader(row, headerMap, key) {
  const index = headerMap[key];
  if (index === undefined || index === -1) return '';
  return String(row[index] || '').trim();
}

function assertToken(event) {
  if (!DASHBOARD_TOKEN) return;
  const token = String((event.parameter && event.parameter.token) || '').trim();
  if (!token || token !== DASHBOARD_TOKEN) {
    throw new Error('Unauthorized');
  }
}

function normalizeSearch(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()"'[\]\\+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeIsoDate(value) {
  if (!value) return '';
  const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function normalizeTableDate(value) {
  const trimmed = String(value || '').trim();
  const match = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  return '';
}

function getTodayIso() {
  return formatIsoDate(new Date());
}

function respond(payload, event) {
  const callback = String((event.parameter && event.parameter.callback) || '').trim();
  const response = callback ? `${callback}(${JSON.stringify(payload)});` : JSON.stringify(payload);
  return ContentService.createTextOutput(response).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
