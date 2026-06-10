const SPREADSHEET_ID = '1ApfnLS5npNMBW3YYI9_d94yyWwbfv-Bpck_Hozjcl58';
const OBJECTS_SHEET_CANDIDATES = [
  'Объекты',
  'Список постаматов (копия)',
  'Список постаматов',
  'Список уборки Kaspi Postomat',
];
const HISTORY_SHEET_NAME = 'История уборок';
const PLAN_SHEET_NAME = 'План уборок';
const SCRIPT_VERSION = '2026-06-10-pst-dashboard-v2';
const DASHBOARD_TOKEN = 'CHANGE_ME_PST_DASHBOARD_TOKEN';
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

const PLAN_HEADERS = [
  'Дата',
  'POSTOMAT_ID',
  'Город',
  'Филиал',
  'Адрес',
  'Категория точки',
  'План',
  'Комментарий',
];

function doGet(event) {
  try {
    assertToken(event);

    const action = String((event.parameter && event.parameter.action) || 'overview').trim();
    let payload;

    if (action === 'overview') {
      payload = handleOverview(event);
    } else if (action === 'object_history') {
      payload = handleObjectHistory(event);
    } else if (action === 'upsert_plan') {
      payload = handleUpsertPlan(event);
    } else if (action === 'remove_plan') {
      payload = handleRemovePlan(event);
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
  const planSheet = getOrCreatePlanSheet(spreadsheet);

  const page = Math.max(Number(event.parameter.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(event.parameter.pageSize || 25), 10), 100);
  const selectedDate = normalizeIsoDate(event.parameter.date) || getTodayIso();
  const selectedBranch = String(event.parameter.branch || '').trim();
  const query = normalizeSearch(String(event.parameter.query || ''));

  const objects = loadObjects(objectsSheet);
  const planRows = loadPlanRows(planSheet, selectedDate);
  const historyRows = loadHistoryRows(historySheet, selectedDate);

  const factsById = new Map();
  historyRows.forEach((row) => {
    if (!factsById.has(row.postomatId)) {
      factsById.set(row.postomatId, []);
    }
    factsById.get(row.postomatId).push(row);
  });

  const planById = new Map();
  planRows.forEach((row) => {
    planById.set(row.postomatId, row);
  });

  const mergedRows = Array.from(objects.values())
    .map((object) => {
      const plan = planById.get(object.postomatId) || null;
      const facts = factsById.get(object.postomatId) || [];
      const latestFact =
        facts
          .slice()
          .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))[0] || null;
      const planned = Boolean(plan);
      const completed = facts.length > 0;

      return {
        postomatId: object.postomatId,
        city: object.city,
        branch: object.branch,
        address: object.address,
        category: object.category,
        planned: planned,
        completed: completed,
        planComment: plan ? plan.comment : '',
        factCount: facts.length,
        factDate: latestFact ? latestFact.date : '',
        factTime: latestFact ? latestFact.time : '',
        folderLinkText: latestFact ? latestFact.folderLinkText : '',
        status: getDashboardStatus(selectedDate, planned, completed),
        searchIndex: normalizeSearch(
          [
            object.postomatId,
            object.city,
            object.branch,
            object.address,
            object.category,
            plan ? plan.comment : '',
          ].join(' ')
        ),
      };
    })
    .filter((row) => (!selectedBranch ? true : row.branch === selectedBranch))
    .filter((row) => (!query ? true : row.searchIndex.indexOf(query) !== -1))
    .sort((a, b) => {
      const statusRank = getStatusRank(a.status) - getStatusRank(b.status);
      if (statusRank !== 0) return statusRank;
      return a.address.localeCompare(b.address, 'ru');
    });

  const total = mergedRows.length;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const rows = mergedRows.slice(pageStart, pageStart + pageSize).map(stripSearchIndex);

  const plannedCount = mergedRows.filter((row) => row.planned).length;
  const completedCount = mergedRows.filter((row) => row.completed).length;

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
      plannedCount: plannedCount,
      completedCount: completedCount,
      overdueCount: mergedRows.filter((row) => row.status === 'Просрочено').length,
      completionRate: plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 0,
    },
    branches: Array.from(
      new Set(
        Array.from(objects.values())
          .map((item) => item.branch)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, 'ru')),
    rows: rows,
    recentHistory: historyRows
      .slice()
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
      .slice(0, 12),
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
  const historySheet = getSheetRequired(spreadsheet, HISTORY_SHEET_NAME);
  const historyRows = loadHistoryRows(historySheet);

  return {
    ok: true,
    version: SCRIPT_VERSION,
    postomatId: postomatId,
    items: historyRows
      .filter((row) => row.postomatId === postomatId)
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
      .slice(0, 50),
  };
}

function handleUpsertPlan(event) {
  const postomatId = String(event.parameter.postomatId || '').trim();
  const isoDate = normalizeIsoDate(event.parameter.date);
  const comment = String(event.parameter.comment || '').trim();

  if (!postomatId) throw new Error('postomatId is required');
  if (!isoDate) throw new Error('date is required');

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const objectsSheet = getObjectsSheet(spreadsheet);
  const planSheet = getOrCreatePlanSheet(spreadsheet);
  const objects = loadObjects(objectsSheet);
  const object = objects.get(postomatId);

  if (!object) {
    throw new Error(`Object not found by postomatId: ${postomatId}`);
  }

  const headers = getHeaderMap(planSheet, {
    date: ['Дата'],
    id: ['POSTOMAT_ID', 'ID'],
  });

  const existingRow = findPlanRow(planSheet, headers, isoDate, postomatId);
  const rowValues = [
    formatTableDate(isoDate),
    object.postomatId,
    object.city,
    object.branch,
    object.address,
    object.category,
    'Да',
    comment,
  ];

  if (existingRow) {
    planSheet.getRange(existingRow, 1, 1, PLAN_HEADERS.length).setValues([rowValues]);
  } else {
    planSheet.appendRow(rowValues);
  }

  return {
    ok: true,
    version: SCRIPT_VERSION,
    action: 'upsert_plan',
    postomatId: postomatId,
    date: isoDate,
  };
}

function handleRemovePlan(event) {
  const postomatId = String(event.parameter.postomatId || '').trim();
  const isoDate = normalizeIsoDate(event.parameter.date);

  if (!postomatId) throw new Error('postomatId is required');
  if (!isoDate) throw new Error('date is required');

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const planSheet = getOrCreatePlanSheet(spreadsheet);
  const headers = getHeaderMap(planSheet, {
    date: ['Дата'],
    id: ['POSTOMAT_ID', 'ID'],
  });

  const lastRow = planSheet.getLastRow();
  if (lastRow >= DATA_START_ROW) {
    const values = planSheet
      .getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, planSheet.getLastColumn())
      .getDisplayValues();

    for (let index = values.length - 1; index >= 0; index -= 1) {
      const row = values[index];
      const rowDate = normalizeTableDate(getValueByHeader(row, headers, 'date'));
      const rowId = getValueByHeader(row, headers, 'id');
      if (rowDate === isoDate && rowId === postomatId) {
        planSheet.deleteRow(DATA_START_ROW + index);
      }
    }
  }

  return {
    ok: true,
    version: SCRIPT_VERSION,
    action: 'remove_plan',
    postomatId: postomatId,
    date: isoDate,
  };
}

function getObjectsSheet(spreadsheet) {
  for (let index = 0; index < OBJECTS_SHEET_CANDIDATES.length; index += 1) {
    const candidate = spreadsheet.getSheetByName(OBJECTS_SHEET_CANDIDATES[index]);
    if (candidate) return candidate;
  }

  const fallback = spreadsheet
    .getSheets()
    .filter((sheet) => sheet.getName() !== HISTORY_SHEET_NAME && sheet.getName() !== PLAN_SHEET_NAME)[0];
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

function getOrCreatePlanSheet(spreadsheet) {
  const existingSheet = spreadsheet.getSheetByName(PLAN_SHEET_NAME);
  const planSheet = existingSheet || spreadsheet.insertSheet(PLAN_SHEET_NAME);
  ensurePlanHeaders(planSheet);
  return planSheet;
}

function ensurePlanHeaders(sheet) {
  if (sheet.getMaxColumns() < PLAN_HEADERS.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), PLAN_HEADERS.length - sheet.getMaxColumns());
  }
  sheet.getRange(1, 1, 1, PLAN_HEADERS.length).setValues([PLAN_HEADERS]);
  sheet.getRange(1, 1, 1, PLAN_HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
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

function loadPlanRows(sheet, selectedDate) {
  const headers = getHeaderMap(sheet, {
    date: ['Дата'],
    id: ['POSTOMAT_ID', 'ID'],
    city: ['Город'],
    branch: ['Филиал'],
    address: ['Адрес'],
    category: ['Категория точки'],
    plan: ['План'],
    comment: ['Комментарий'],
  });

  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return [];

  const values = sheet
    .getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, sheet.getLastColumn())
    .getDisplayValues();

  return values
    .map((row) => ({
      date: normalizeTableDate(getValueByHeader(row, headers, 'date')),
      postomatId: getValueByHeader(row, headers, 'id'),
      city: getValueByHeader(row, headers, 'city'),
      branch: getValueByHeader(row, headers, 'branch'),
      address: getValueByHeader(row, headers, 'address'),
      category: getValueByHeader(row, headers, 'category'),
      plan: getValueByHeader(row, headers, 'plan'),
      comment: getValueByHeader(row, headers, 'comment'),
    }))
    .filter((row) => row.postomatId)
    .filter((row) => (!selectedDate ? true : row.date === selectedDate));
}

function loadHistoryRows(sheet, selectedDate) {
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
    .filter((row) => (!selectedDate ? true : row.date === selectedDate));
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

function findPlanRow(sheet, headers, isoDate, postomatId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return 0;

  const values = sheet
    .getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, sheet.getLastColumn())
    .getDisplayValues();

  for (let index = 0; index < values.length; index += 1) {
    const row = values[index];
    const rowDate = normalizeTableDate(getValueByHeader(row, headers, 'date'));
    const rowId = getValueByHeader(row, headers, 'id');
    if (rowDate === isoDate && rowId === postomatId) {
      return DATA_START_ROW + index;
    }
  }

  return 0;
}

function getDashboardStatus(selectedDate, planned, completed) {
  const today = getTodayIso();
  if (planned && completed) return 'Выполнено';
  if (planned && !completed && selectedDate < today) return 'Просрочено';
  if (planned && !completed) return 'Запланировано';
  if (!planned && completed) return 'Выполнено вне плана';
  return 'Без статуса';
}

function getStatusRank(status) {
  const order = {
    'Просрочено': 0,
    'Запланировано': 1,
    'Выполнено': 2,
    'Выполнено вне плана': 3,
    'Без статуса': 4,
  };
  return order[status] !== undefined ? order[status] : 99;
}

function stripSearchIndex(row) {
  const clean = {};
  Object.keys(row).forEach((key) => {
    if (key !== 'searchIndex') clean[key] = row[key];
  });
  return clean;
}

function assertToken(event) {
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
  if (!match) return '';
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function formatTableDate(isoDate) {
  const match = normalizeIsoDate(isoDate).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;
  return `${match[3]}.${match[2]}.${match[1]}`;
}

function getTodayIso() {
  const timezone = Session.getScriptTimeZone();
  return Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd');
}

function respond(payload, event) {
  const callback = sanitizeCallbackName(String((event.parameter && event.parameter.callback) || '').trim());
  if (callback) {
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(payload)})`).setMimeType(
      ContentService.MimeType.JAVASCRIPT
    );
  }

  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function sanitizeCallbackName(value) {
  if (!value) return '';
  if (!/^[a-zA-Z_$][0-9a-zA-Z_$\.]*$/.test(value)) {
    throw new Error('Invalid callback name');
  }
  return value;
}
