const SPREADSHEET_ID = '1ApfnLS5npNMBW3YYI9_d94yyWwbfv-Bpck_Hozjcl58';
const HISTORY_SHEET_NAME = 'История уборок';
const OBJECTS_SHEET_NAME = 'Объекты';

const HISTORY_HEADERS = [
  'Дата отправки',
  'Дата',
  'Время',
  'POSTOMAT_ID',
  'Название',
  'Адрес',
  'Категория',
  'Место установки',
  'Покрытие',
  'Ячеек',
  'Дистанция, м',
  'Координаты отправки',
  'Точность GPS, м',
  'Имя фото',
  'Тип фото',
  'Размер после сжатия, КБ',
  'Исходный размер, КБ',
  'Фото base64',
];

function doGet() {
  return jsonResponse({ ok: true, service: 'pst-cleaning-webapp' });
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const historySheet = getOrCreateSheet(spreadsheet, HISTORY_SHEET_NAME);

    ensureHeaders(historySheet, HISTORY_HEADERS);
    appendHistoryRows(historySheet, payload);
    updateObjectStatus(spreadsheet, payload);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function appendHistoryRows(sheet, payload) {
  const submittedAt = payload.submittedAt ? new Date(payload.submittedAt) : new Date();
  const timezone = Session.getScriptTimeZone();
  const date = Utilities.formatDate(submittedAt, timezone, 'yyyy-MM-dd');
  const time = Utilities.formatDate(submittedAt, timezone, 'HH:mm:ss');
  const location = payload.location || {};
  const userLocation = payload.userLocation || {};
  const photos = Array.isArray(payload.photos) ? payload.photos : [];
  const gps = userLocation.lat && userLocation.lng ? `${userLocation.lat}, ${userLocation.lng}` : '';

  if (photos.length === 0) {
    photos.push({});
  }

  const rows = photos.map((photo) => [
    submittedAt,
    date,
    time,
    location.id || '',
    location.title || '',
    location.address || '',
    location.category || '',
    location.installPlace || '',
    location.surfaceType || '',
    location.cellsCount || '',
    location.distanceMeters || '',
    gps,
    userLocation.accuracy || '',
    photo.fileName || '',
    photo.mimeType || '',
    bytesToKb(photo.sizeBytes),
    bytesToKb(photo.originalSizeBytes),
    photo.dataUrl || '',
  ]);

  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HISTORY_HEADERS.length).setValues(rows);
}

function updateObjectStatus(spreadsheet, payload) {
  const sheet = spreadsheet.getSheetByName(OBJECTS_SHEET_NAME);
  if (!sheet) return;

  const location = payload.location || {};
  if (!location.id) return;

  const headerValues = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idColumn = findHeaderIndex(headerValues, ['POSTOMAT_ID', 'ID', 'Postomat ID']);
  if (idColumn === -1) return;

  const washedColumn = getOrCreateHeader(sheet, headerValues, 'Помыли');
  const lastCleanedColumn = getOrCreateHeader(sheet, headerValues, 'Последняя уборка');
  const data = sheet.getRange(2, idColumn + 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  const rowOffset = data.findIndex((row) => String(row[0]) === String(location.id));

  if (rowOffset === -1) return;

  const rowNumber = rowOffset + 2;
  const washedCell = sheet.getRange(rowNumber, washedColumn + 1);
  washedCell.insertCheckboxes();
  washedCell.setValue(true);
  sheet.getRange(rowNumber, lastCleanedColumn + 1).setValue(new Date());
}

function getOrCreateSheet(spreadsheet, name) {
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function ensureHeaders(sheet, headers) {
  const currentHeaders = sheet.getLastColumn()
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    : [];

  headers.forEach((header, index) => {
    if (currentHeaders[index] !== header) {
      sheet.getRange(1, index + 1).setValue(header);
    }
  });
}

function getOrCreateHeader(sheet, headerValues, header) {
  const existingIndex = headerValues.indexOf(header);
  if (existingIndex !== -1) return existingIndex;

  const newIndex = sheet.getLastColumn();
  sheet.getRange(1, newIndex + 1).setValue(header);
  headerValues.push(header);
  return newIndex;
}

function findHeaderIndex(headers, candidates) {
  return headers.findIndex((header) => candidates.includes(String(header).trim()));
}

function bytesToKb(value) {
  return value ? Math.round(Number(value) / 1024) : '';
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
