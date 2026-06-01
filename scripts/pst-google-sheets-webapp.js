const SPREADSHEET_ID = '1ApfnLS5npNMBW3YYI9_d94yyWwbfv-Bpck_Hozjcl58';
const OBJECTS_SHEET_NAME = 'Объекты';
const HISTORY_SHEET_NAME = 'История уборок';
const DRIVE_ROOT_FOLDER_NAME = 'PST уборки';
const SCRIPT_VERSION = '2026-06-01-history-sheet-v6';
const DRIVE_PHOTO_SIZE_LIMIT_BYTES = 250 * 1024;
const DATA_START_ROW = 2;
const STATUS_HEADER = 'Помыли?';
const LAST_CLEANING_DATE_HEADER = 'Последняя дата уборки';
const HISTORY_HEADERS = [
  'POSTOMAT_ID',
  'Город',
  'Филиал',
  'Адрес',
  'Широта',
  'Долгота',
  'Категория точки',
  'Дата отправки',
  'Время',
  'Ссылки на фотографии в Google Drive',
];

function doGet() {
  return jsonResponse({ ok: true, service: 'pst-cleaning-webapp', version: SCRIPT_VERSION });
}

function authorizeDriveAccess() {
  const rootFolder = DriveApp.getRootFolder();
  const archiveFolder = getOrCreateFolder(rootFolder, DRIVE_ROOT_FOLDER_NAME);

  return archiveFolder.getUrl();
}

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);

    const payload = JSON.parse((event.postData && event.postData.contents) || '{}');
    const location = payload.location || {};
    const photos = Array.isArray(payload.photos) ? payload.photos : [];

    if (!location.id) {
      throw new Error('POSTOMAT_ID is missing');
    }

    if (photos.length === 0) {
      throw new Error('At least one photo is required');
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const objectsSheet = getObjectsSheet(spreadsheet);
    const historySheet = getOrCreateHistorySheet(spreadsheet);
    const objectRow = findObjectRow(objectsSheet, location.id);

    if (!objectRow) {
      throw new Error(`POSTOMAT_ID ${location.id} not found`);
    }

    const submittedAt = payload.submittedAt ? new Date(payload.submittedAt) : new Date();
    const timezone = Session.getScriptTimeZone();
    const monthTitle = formatMonthTitle(submittedAt, timezone);
    const submittedDate = Utilities.formatDate(submittedAt, timezone, 'dd.MM.yyyy');
    const submittedTime = Utilities.formatDate(submittedAt, timezone, 'HH:mm');
    const storedPhotos = savePhotosToDrive(photos, location, submittedAt, monthTitle, timezone);

    appendCleaningHistory(historySheet, location, submittedDate, submittedTime, storedPhotos);
    updateObjectCleaningStatus(objectsSheet, objectRow, submittedDate);

    return jsonResponse({ ok: true, version: SCRIPT_VERSION });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonResponse({
      ok: false,
      version: SCRIPT_VERSION,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function getObjectsSheet(spreadsheet) {
  const directMatch = spreadsheet.getSheetByName(OBJECTS_SHEET_NAME);
  if (directMatch) return directMatch;

  const nonHistorySheet = spreadsheet
    .getSheets()
    .find((sheet) => sheet.getName().trim() !== HISTORY_SHEET_NAME);
  return nonHistorySheet || spreadsheet.getSheets()[0];
}

function getOrCreateHistorySheet(spreadsheet) {
  const existingSheet = spreadsheet.getSheetByName(HISTORY_SHEET_NAME);
  const historySheet = existingSheet || spreadsheet.insertSheet(HISTORY_SHEET_NAME);

  ensureHistoryHeaders(historySheet);
  return historySheet;
}

function ensureHistoryHeaders(sheet) {
  const requiredWidth = HISTORY_HEADERS.length;
  if (sheet.getMaxColumns() < requiredWidth) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), requiredWidth - sheet.getMaxColumns());
  }

  sheet.getRange(1, 1, 1, requiredWidth).setValues([HISTORY_HEADERS]);
  sheet.getRange(1, 1, 1, requiredWidth).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function appendCleaningHistory(sheet, location, submittedDate, submittedTime, storedPhotos) {
  const photoLinks = storedPhotos.map((photo) => photo.driveUrl).join('\n');

  sheet.appendRow([
    stringifyCell(location.id),
    stringifyCell(location.city),
    stringifyCell(location.branch),
    stringifyCell(location.address),
    stringifyCell(location.lat),
    stringifyCell(location.lng),
    stringifyCell(location.category),
    submittedDate,
    submittedTime,
    photoLinks,
  ]);

  const row = sheet.getLastRow();
  sheet.getRange(row, 10).setWrap(true).setVerticalAlignment('top');
}

function updateObjectCleaningStatus(sheet, objectRow, submittedDate) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const statusColumn = ensureColumn(sheet, headers, STATUS_HEADER);
  const lastCleaningDateColumn = ensureColumn(sheet, headers, LAST_CLEANING_DATE_HEADER);

  const dataRowCount = Math.max(sheet.getLastRow() - DATA_START_ROW + 1, 1);
  const statusRange = sheet.getRange(DATA_START_ROW, statusColumn, dataRowCount, 1);
  statusRange.insertCheckboxes();

  const statusValues = statusRange.getValues().map((row) => {
    if (row[0] === '' || row[0] === null) {
      return [false];
    }

    return row;
  });

  statusRange.setValues(statusValues);
  sheet.getRange(objectRow, statusColumn).setValue(true);
  sheet.getRange(objectRow, lastCleaningDateColumn).setValue(submittedDate);
}

function ensureColumn(sheet, headers, headerName) {
  let columnIndex = findHeaderIndex(headers, [headerName]);
  if (columnIndex !== -1) {
    return columnIndex + 1;
  }

  const newColumn = sheet.getLastColumn() + 1;
  sheet.getRange(1, newColumn).setValue(headerName).setFontWeight('bold');
  return newColumn;
}

function findObjectRow(sheet, postomatId) {
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  const idColumn = findHeaderIndex(headers, ['POSTOMAT_ID', 'ID', 'Postomat ID']);
  if (idColumn === -1) {
    throw new Error('POSTOMAT_ID column not found');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return null;

  const values = sheet
    .getRange(DATA_START_ROW, idColumn + 1, lastRow - DATA_START_ROW + 1, 1)
    .getDisplayValues();
  const rowOffset = values.findIndex((row) => String(row[0]).trim() === String(postomatId).trim());

  return rowOffset === -1 ? null : DATA_START_ROW + rowOffset;
}

function savePhotosToDrive(photos, location, submittedAt, monthTitle, timezone) {
  const rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), DRIVE_ROOT_FOLDER_NAME);
  const monthFolder = getOrCreateFolder(rootFolder, monthTitle);
  const branchFolder = getOrCreateFolder(monthFolder, sanitizeFolderName(location.branch || 'Без филиала'));
  const dateFolder = getOrCreateFolder(
    branchFolder,
    Utilities.formatDate(submittedAt, timezone, 'dd.MM.yyyy')
  );
  const timestamp = Utilities.formatDate(submittedAt, timezone, 'yyyy-MM-dd_HH-mm-ss');
  const createdFiles = [];

  try {
    return photos.map((photo, index) => {
      const base64 = String(photo.dataUrl || '').split(',')[1];
      if (!base64) {
        throw new Error(`Photo ${index + 1} has no image data`);
      }

      const extension = photo.mimeType === 'image/png' ? 'png' : 'jpg';
      const fileName = `${timestamp}_PST-${sanitizeFileName(location.id)}_${index + 1}.${extension}`;
      const bytes = Utilities.base64Decode(base64);
      if (bytes.length > DRIVE_PHOTO_SIZE_LIMIT_BYTES) {
        throw new Error(`Photo ${fileName} exceeds the 250KB Drive archive limit`);
      }

      const blob = Utilities.newBlob(bytes, photo.mimeType || 'image/jpeg', fileName);
      const driveFile = dateFolder.createFile(blob);
      createdFiles.push(driveFile);

      return {
        fileName,
        driveFileId: driveFile.getId(),
        driveUrl: driveFile.getUrl(),
      };
    });
  } catch (error) {
    createdFiles.forEach((file) => file.setTrashed(true));
    throw error;
  }
}

function getOrCreateFolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : parentFolder.createFolder(folderName);
}

function sanitizeFolderName(value) {
  return String(value || 'Без филиала').replace(/[\\/:*?"<>|]/g, '_').trim() || 'Без филиала';
}

function sanitizeFileName(value) {
  return String(value || 'unknown').replace(/[\\/:*?"<>|]/g, '_');
}

function stringifyCell(value) {
  return value === undefined || value === null ? '' : String(value);
}

function findHeaderIndex(headers, candidates) {
  return headers.findIndex((header) => candidates.includes(String(header).trim()));
}

function formatMonthTitle(date, timezone) {
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
  const monthIndex = Number(Utilities.formatDate(date, timezone, 'M')) - 1;
  const year = Utilities.formatDate(date, timezone, 'yyyy');

  return `${months[monthIndex]} ${year}`;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
