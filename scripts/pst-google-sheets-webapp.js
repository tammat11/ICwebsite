const SPREADSHEET_ID = '1ApfnLS5npNMBW3YYI9_d94yyWwbfv-Bpck_Hozjcl58';
const HISTORY_SHEET_NAME = 'История уборок';
const OBJECTS_SHEET_NAME = 'Объекты';
const PHOTO_COLUMN = 14;
const ROW_HEIGHT = 140;
const PHOTO_COLUMN_WIDTH = 180;

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
  'Фото',
  'Имя фото',
  'Размер после сжатия, КБ',
  'Исходный размер, КБ',
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

  const startRow = sheet.getLastRow() + 1;
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
    '',
    photo.fileName || '',
    bytesToKb(photo.sizeBytes),
    bytesToKb(photo.originalSizeBytes),
  ]);

  sheet.getRange(startRow, 1, rows.length, HISTORY_HEADERS.length).setValues(rows);
  sheet.setColumnWidth(PHOTO_COLUMN, PHOTO_COLUMN_WIDTH);

  photos.forEach((photo, index) => {
    const row = startRow + index;
    sheet.setRowHeight(row, ROW_HEIGHT);
    insertPhotoIntoCell(sheet, row, PHOTO_COLUMN, photo);
  });
}

function insertPhotoIntoCell(sheet, row, column, photo) {
  if (!photo || !photo.dataUrl) return;

  const base64 = String(photo.dataUrl).split(',')[1];
  if (!base64) return;

  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, photo.mimeType || 'image/jpeg', photo.fileName || 'photo.jpg');
  const image = sheet.insertImage(blob, column, row);

  image.setAnchorCell(sheet.getRange(row, column));
  image.setWidth(150);
  image.setHeight(112);
  image.setAnchorCellXOffset(8);
  image.setAnchorCellYOffset(8);
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
  const historyColumn = getOrCreateHeader(sheet, headerValues, 'История уборок');
  const data = sheet.getRange(2, idColumn + 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  const rowOffset = data.findIndex((row) => String(row[0]) === String(location.id));

  if (rowOffset === -1) return;

  const rowNumber = rowOffset + 2;
  const washedCell = sheet.getRange(rowNumber, washedColumn + 1);
  washedCell.insertCheckboxes();
  washedCell.setValue(true);
  sheet.getRange(rowNumber, lastCleanedColumn + 1).setValue(new Date());
  setHistoryLink(sheet.getParent(), sheet.getRange(rowNumber, historyColumn + 1));
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

  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
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

function getSheetIdByName(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  return sheet ? sheet.getSheetId() : '';
}

function setHistoryLink(spreadsheet, range) {
  const sheetId = getSheetIdByName(spreadsheet, HISTORY_SHEET_NAME);
  if (!sheetId) return;

  const richText = SpreadsheetApp.newRichTextValue()
    .setText('Открыть историю')
    .setLinkUrl(`${spreadsheet.getUrl()}#gid=${sheetId}`)
    .build();

  range.setRichTextValue(richText);
}

function bytesToKb(value) {
  return value ? Math.round(Number(value) / 1024) : '';
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
