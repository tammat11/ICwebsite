const SPREADSHEET_ID = '1ApfnLS5npNMBW3YYI9_d94yyWwbfv-Bpck_Hozjcl58';
const OBJECTS_SHEET_NAME = 'Объекты';
const HISTORY_SHEET_NAME = 'История уборок';
const DRIVE_ROOT_FOLDER_NAME = 'PST уборки';
const SCRIPT_VERSION = '2026-06-25-pst-reliable-submit';
const ACCEPTED_PAYLOAD_VERSION = 2;
const DRIVE_PHOTO_SIZE_LIMIT_BYTES = 250 * 1024;
const DATA_START_ROW = 2;
const STATUS_HEADER = 'Помыли?';
const LAST_CLEANING_DATE_HEADER = 'Последняя дата уборки';
const HISTORY_LINKS_COLUMN = 10;
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
  'Ссылка на папку с фотографиями в Google Drive',
];

function doGet() {
  return jsonResponse({
    ok: true,
    service: 'pst-cleaning-webapp',
    version: SCRIPT_VERSION,
    acceptedPayloadVersion: ACCEPTED_PAYLOAD_VERSION,
  });
}

function authorizeDriveAccess() {
  const rootFolder = DriveApp.getRootFolder();
  const archiveFolder = getOrCreateFolder(rootFolder, DRIVE_ROOT_FOLDER_NAME);
  return archiveFolder.getUrl();
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  let debugId = getRequestDebugId(event);

  try {
    logPstEvent('doPost:start', {
      debugId,
      version: SCRIPT_VERSION,
      contentType: event.postData && event.postData.type,
      contentLength: event.postData && event.postData.length,
      query: event.parameter || {},
    });

    lock.waitLock(30000);

    const payload = JSON.parse((event.postData && event.postData.contents) || '{}');
    debugId = payload.submissionDebugId || debugId;
    const payloadVersion = Number(payload.payloadVersion || 0);
    const location = payload.location || {};
    const beforePhotos = Array.isArray(payload.beforePhotos) ? payload.beforePhotos : [];
    const afterPhotos = Array.isArray(payload.afterPhotos) ? payload.afterPhotos : [];
    const groupedPhotos = { before: beforePhotos, after: afterPhotos };

    logPstEvent('payload:parsed', {
      debugId,
      payloadVersion,
      clientBuildId: payload.clientBuildId || '',
      submittedAt: payload.submittedAt || '',
      postomatId: location.id || '',
      address: location.address || '',
      city: location.city || '',
      branch: location.branch || '',
      beforePhotosCount: beforePhotos.length,
      afterPhotosCount: afterPhotos.length,
      beforePhotoSizes: beforePhotos.map((photo) => photo.sizeBytes || 0),
      afterPhotoSizes: afterPhotos.map((photo) => photo.sizeBytes || 0),
    });

    if (payloadVersion !== ACCEPTED_PAYLOAD_VERSION) {
      throw new Error(
        `Unsupported payload version: ${payloadVersion || 'missing'}. Expected ${ACCEPTED_PAYLOAD_VERSION}. Please reload /pst and try again.`
      );
    }

    if (!location.id) {
      throw new Error('POSTOMAT_ID is missing');
    }

    if (groupedPhotos.before.length === 0 || groupedPhotos.after.length === 0) {
      throw new Error('Both beforePhotos and afterPhotos are required');
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const objectsSheet = getObjectsSheet(spreadsheet);
    const historySheet = getOrCreateHistorySheet(spreadsheet);
    logPstEvent('sheet:opened', {
      debugId,
      spreadsheetId: SPREADSHEET_ID,
      objectsSheet: objectsSheet.getName(),
      historySheet: historySheet.getName(),
      objectsRows: objectsSheet.getLastRow(),
      historyRows: historySheet.getLastRow(),
    });

    const objectRow = findObjectRow(objectsSheet, location.id);

    if (!objectRow) {
      throw new Error(`POSTOMAT_ID ${location.id} not found`);
    }
    logPstEvent('object:found', { debugId, postomatId: location.id, row: objectRow });

    const submittedAt = payload.submittedAt ? new Date(payload.submittedAt) : new Date();
    const timezone = Session.getScriptTimeZone();
    const monthTitle = formatMonthTitle(submittedAt, timezone);
    const submittedDate = Utilities.formatDate(submittedAt, timezone, 'dd.MM.yyyy');
    const submittedTime = Utilities.formatDate(submittedAt, timezone, 'HH:mm');
    const storedPhotos = savePhotosToDrive(groupedPhotos, location, submittedAt, monthTitle, timezone);
    logPstEvent('drive:saved', {
      debugId,
      folderUrl: storedPhotos.folderUrl,
      beforeFiles: storedPhotos.before.map((file) => file.fileName),
      afterFiles: storedPhotos.after.map((file) => file.fileName),
    });

    const historyRow = appendCleaningHistory(historySheet, location, submittedDate, submittedTime, storedPhotos);
    logPstEvent('history:appended', {
      debugId,
      historySheet: historySheet.getName(),
      row: historyRow,
      submittedDate,
      submittedTime,
    });

    updateObjectCleaningStatus(objectsSheet, objectRow, submittedDate);
    logPstEvent('status:updated', {
      debugId,
      objectsSheet: objectsSheet.getName(),
      row: objectRow,
      submittedDate,
    });

    SpreadsheetApp.flush();

    logPstEvent('doPost:success', {
      debugId,
      postomatId: location.id,
      saved: true,
      historyRow: historyRow,
      objectRow: objectRow,
    });
    return jsonResponse({
      ok: true,
      saved: true,
      service: 'pst-cleaning-webapp',
      version: SCRIPT_VERSION,
      debugId,
      historyRow: historyRow,
      objectRow: objectRow,
    });
  } catch (error) {
    logPstEvent('doPost:error', {
      debugId,
      message: String(error && error.message ? error.message : error),
      stack: String(error && error.stack ? error.stack : ''),
    });
    return jsonResponse({
      ok: false,
      service: 'pst-cleaning-webapp',
      version: SCRIPT_VERSION,
      debugId,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function getRequestDebugId(event) {
  const fromQuery = event && event.parameter && event.parameter.debugId;
  return String(fromQuery || `server-${Date.now()}`).trim();
}

function logPstEvent(stage, details) {
  const payload = Object.assign(
    {
      stage,
      timestamp: new Date().toISOString(),
    },
    details || {}
  );
  console.log(`PST_CLEANING_LOG ${JSON.stringify(payload)}`);
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
  const fallbackText = storedPhotos.folderUrl;

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
    fallbackText,
  ]);

  const row = sheet.getLastRow();
  const linksCell = sheet.getRange(row, HISTORY_LINKS_COLUMN);
  linksCell.setWrap(true).setVerticalAlignment('top');

  if (!tryApplyFolderChip(sheet, row, HISTORY_LINKS_COLUMN, storedPhotos.folderUrl)) {
    linksCell.setRichTextValue(buildFolderRichText(storedPhotos.folderUrl));
  }

  SpreadsheetApp.flush();
  return row;
}

function tryApplyFolderChip(sheet, row, column, folderUrl) {
  if (typeof Sheets === 'undefined' || !Sheets.Spreadsheets || !Sheets.Spreadsheets.batchUpdate) {
    console.warn('Advanced Sheets service is not enabled; falling back to rich text link.');
    return false;
  }

  try {
    Sheets.Spreadsheets.batchUpdate(
      {
        requests: [
          {
            updateCells: {
              range: {
                sheetId: sheet.getSheetId(),
                startRowIndex: row - 1,
                endRowIndex: row,
                startColumnIndex: column - 1,
                endColumnIndex: column,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredValue: {
                        stringValue: '@',
                      },
                      chipRuns: [
                        {
                          startIndex: 0,
                          chip: {
                            richLinkProperties: {
                              uri: folderUrl,
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
              fields: 'userEnteredValue,chipRuns',
            },
          },
        ],
      },
      SPREADSHEET_ID
    );

    return true;
  } catch (error) {
    console.error('Failed to apply folder chip to Google Sheets cell:', error);
    return false;
  }
}

function buildFolderRichText(folderUrl) {
  return SpreadsheetApp.newRichTextValue().setText('Папка с фото').setLinkUrl(folderUrl).build();
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

function savePhotosToDrive(groupedPhotos, location, submittedAt, monthTitle, timezone) {
  const rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), DRIVE_ROOT_FOLDER_NAME);
  const monthFolder = getOrCreateFolder(rootFolder, monthTitle);
  const branchFolder = getOrCreateFolder(
    monthFolder,
    sanitizeFolderName(location.branch || 'Без филиала')
  );
  const dateFolder = getOrCreateFolder(
    branchFolder,
    Utilities.formatDate(submittedAt, timezone, 'dd.MM.yyyy')
  );
  const addressFolder = getOrCreateFolder(
    dateFolder,
    sanitizeFolderName(location.address || 'Без адреса')
  );
  const createdFiles = [];

  try {
    const result = {
      folderUrl: addressFolder.getUrl(),
      before: savePhotoGroupToDrive(groupedPhotos.before || [], 'before', addressFolder, location, createdFiles),
      after: savePhotoGroupToDrive(groupedPhotos.after || [], 'after', addressFolder, location, createdFiles),
    };

    return result;
  } catch (error) {
    createdFiles.forEach((file) => file.setTrashed(true));
    throw error;
  }
}

function savePhotoGroupToDrive(photos, section, addressFolder, location, createdFiles) {
  return photos.map((photo, index) => {
    const base64 = String(photo.dataUrl || '').split(',')[1];
    if (!base64) {
      throw new Error(`Photo ${index + 1} has no image data`);
    }

    const extension = photo.mimeType === 'image/png' ? 'png' : 'jpg';
    const fileName = buildPhotoFileName(location, section, index + 1, extension);
    const bytes = Utilities.base64Decode(base64);
    if (bytes.length > DRIVE_PHOTO_SIZE_LIMIT_BYTES) {
      throw new Error(`Photo ${fileName} exceeds the 250KB Drive archive limit`);
    }

    const blob = Utilities.newBlob(bytes, photo.mimeType || 'image/jpeg', fileName);
    const driveFile = addressFolder.createFile(blob);
    createdFiles.push(driveFile);

    return {
      fileName,
      driveFileId: driveFile.getId(),
      driveUrl: driveFile.getUrl(),
      section,
    };
  });
}

function buildPhotoFileName(location, section, index, extension) {
  const postomatId = toAsciiSlug(location.id || 'unknown-id');
  const category = toAsciiSlug(location.category || 'bez-kategorii');
  const order = String(index).padStart(2, '0');
  return `${postomatId}__${category}__${section}__${order}.${extension}`;
}

function getOrCreateFolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : parentFolder.createFolder(folderName);
}

function sanitizeFolderName(value) {
  return String(value || 'Без адреса').replace(/[\\/:*?"<>|]/g, '_').trim() || 'Без адреса';
}

function toAsciiSlug(value) {
  const transliterationMap = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'e',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'y',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'ts',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sch',
    'ъ': '',
    'ы': 'y',
    'ь': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
  };

  return String(value || '')
    .toLowerCase()
    .split('')
    .map((symbol) => transliterationMap[symbol] ?? symbol)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80) || 'unknown';
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
