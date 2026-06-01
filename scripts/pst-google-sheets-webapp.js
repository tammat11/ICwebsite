const SPREADSHEET_ID = '1ApfnLS5npNMBW3YYI9_d94yyWwbfv-Bpck_Hozjcl58';
const OBJECTS_SHEET_NAME = 'Объекты';
const DATA_START_ROW = 2;
const MONTH_BLOCK_WIDTH = 2;
const DATE_COLUMN_WIDTH = 170;
const PHOTO_COLUMN_WIDTH = 320;
const ROW_HEIGHT = 280;
const PHOTO_MAX_WIDTH = 260;
const PHOTO_MAX_HEIGHT = 240;
const MULTI_PHOTO_MAX_WIDTH = 220;
const MULTI_PHOTO_MAX_HEIGHT = 220;
const PHOTO_CELL_PADDING = 8;
const PHOTO_GAP = 12;
const PHOTOS_PER_ROW = 2;
const LEGACY_SUBHEADERS = ['дата уборки и время', 'фото'];
const LEGACY_STATUS_HEADERS = ['Помыли', 'Последняя уборка'];

function doGet() {
  return jsonResponse({ ok: true, service: 'pst-cleaning-webapp' });
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getObjectsSheet(spreadsheet);

    cleanupLegacySheetLayout(sheet);
    writeCleaningToObjectRow(sheet, payload);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function writeCleaningToObjectRow(sheet, payload) {
  const location = payload.location || {};
  if (!location.id) {
    throw new Error('POSTOMAT_ID is missing');
  }

  const objectRow = findObjectRow(sheet, location.id);
  if (!objectRow) {
    throw new Error(`POSTOMAT_ID ${location.id} not found`);
  }

  const submittedAt = payload.submittedAt ? new Date(payload.submittedAt) : new Date();
  const timezone = Session.getScriptTimeZone();
  const monthTitle = formatMonthTitle(submittedAt, timezone);
  const dateTime = Utilities.formatDate(submittedAt, timezone, 'dd.MM.yyyy HH:mm');
  const photos = Array.isArray(payload.photos) ? payload.photos : [];
  const photoLayout = getPhotosLayout(photos);
  const monthColumns = getWritableMonthColumns(sheet, objectRow, monthTitle);
  const dateColumn = monthColumns.dateColumn;
  const photoColumn = monthColumns.photoColumn;

  if (photoLayout.items.length === 0) {
    throw new Error('At least one photo is required');
  }

  sheet.setColumnWidth(dateColumn, DATE_COLUMN_WIDTH);
  sheet.getRange(objectRow, photoColumn).clearContent();
  sheet.setColumnWidth(photoColumn, photoLayout.columnWidth);
  sheet.setRowHeight(objectRow, photoLayout.rowHeight);
  insertPhotosIntoCell(sheet, objectRow, photoColumn, photoLayout);
  sheet
    .getRange(objectRow, dateColumn)
    .setValue(dateTime)
    .setVerticalAlignment('top')
    .setHorizontalAlignment('left')
    .setWrap(false);
}

function getObjectsSheet(spreadsheet) {
  return spreadsheet.getSheetByName(OBJECTS_SHEET_NAME) || spreadsheet.getSheets()[0];
}

function cleanupLegacySheetLayout(sheet) {
  deleteLegacySubheaderRow(sheet);
  deleteLegacyStatusColumns(sheet);
  sheet.setFrozenRows(1);
}

function deleteLegacySubheaderRow(sheet) {
  if (sheet.getLastRow() < 2) return;

  const secondRowValues = sheet.getRange(2, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  const legacySubheaderCount = secondRowValues.filter((value) =>
    LEGACY_SUBHEADERS.includes(String(value).trim().toLowerCase())
  ).length;

  if (legacySubheaderCount > 0) {
    sheet.deleteRow(2);
  }
}

function deleteLegacyStatusColumns(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  for (let index = headers.length - 1; index >= 0; index--) {
    if (LEGACY_STATUS_HEADERS.includes(String(headers[index]).trim())) {
      sheet.deleteColumn(index + 1);
    }
  }
}

function findObjectRow(sheet, postomatId) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idColumn = findHeaderIndex(headers, ['POSTOMAT_ID', 'ID', 'Postomat ID']);
  if (idColumn === -1) {
    throw new Error('POSTOMAT_ID column not found');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return null;

  const data = sheet
    .getRange(DATA_START_ROW, idColumn + 1, lastRow - DATA_START_ROW + 1, 1)
    .getValues();
  const rowOffset = data.findIndex((row) => String(row[0]) === String(postomatId));

  return rowOffset === -1 ? null : DATA_START_ROW + rowOffset;
}

function getWritableMonthColumns(sheet, objectRow, monthTitle) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const monthStarts = [];

  headers.forEach((header, index) => {
    if (String(header).trim() === monthTitle) {
      monthStarts.push(index + 1);
    }
  });

  for (const startColumn of monthStarts) {
    const dateColumn = startColumn;
    const photoColumn = startColumn + 1;
    const dateValue = sheet.getRange(objectRow, dateColumn).getValue();
    const images = sheet.getImages().filter((image) => {
      const anchor = image.getAnchorCell();
      return anchor.getRow() === objectRow && anchor.getColumn() === photoColumn;
    });

    if (!dateValue && images.length === 0) {
      return { dateColumn, photoColumn };
    }
  }

  const nextColumn = sheet.getLastColumn() + 1;
  setupMonthColumns(sheet, nextColumn, monthTitle);
  return { dateColumn: nextColumn, photoColumn: nextColumn + 1 };
}

function setupMonthColumns(sheet, startColumn, monthTitle) {
  sheet.getRange(1, startColumn, 1, MONTH_BLOCK_WIDTH).merge();
  sheet.getRange(1, startColumn).setValue(monthTitle);
  sheet.getRange(1, startColumn, 1, MONTH_BLOCK_WIDTH).setFontWeight('bold');
  sheet.getRange(1, startColumn, 1, MONTH_BLOCK_WIDTH).setHorizontalAlignment('center');
  sheet.setColumnWidth(startColumn, DATE_COLUMN_WIDTH);
  sheet.setColumnWidth(startColumn + 1, PHOTO_COLUMN_WIDTH);
}

function getPhotosLayout(photos) {
  const validPhotos = photos.filter((photo) => photo && photo.dataUrl);
  const photoCount = validPhotos.length;
  const maxWidth = photoCount > 1 ? MULTI_PHOTO_MAX_WIDTH : PHOTO_MAX_WIDTH;
  const maxHeight = photoCount > 1 ? MULTI_PHOTO_MAX_HEIGHT : PHOTO_MAX_HEIGHT;
  const columns = Math.max(1, Math.min(PHOTOS_PER_ROW, photoCount || 1));
  const items = validPhotos.map((photo, index) => {
    const size = fitImageIntoBox(photo.width, photo.height, maxWidth, maxHeight);
    const columnIndex = index % columns;
    const rowIndex = Math.floor(index / columns);

    return {
      photo,
      width: size.width,
      height: size.height,
      xOffset: PHOTO_CELL_PADDING + columnIndex * (maxWidth + PHOTO_GAP),
      yOffset: PHOTO_CELL_PADDING + rowIndex * (maxHeight + PHOTO_GAP),
    };
  });
  const rows = Math.max(1, Math.ceil(photoCount / columns));

  return {
    items,
    columnWidth:
      photoCount > 1
        ? PHOTO_CELL_PADDING * 2 + columns * maxWidth + (columns - 1) * PHOTO_GAP
        : PHOTO_COLUMN_WIDTH,
    rowHeight:
      photoCount > 1
        ? PHOTO_CELL_PADDING * 2 + rows * maxHeight + (rows - 1) * PHOTO_GAP
        : ROW_HEIGHT,
  };
}

function insertPhotosIntoCell(sheet, row, column, photoLayout) {
  removeImagesFromCell(sheet, row, column);

  try {
    photoLayout.items.forEach((item) => {
      insertPhotoIntoCell(sheet, row, column, item);
    });
  } catch (error) {
    removeImagesFromCell(sheet, row, column);
    throw error;
  }
}

function insertPhotoIntoCell(sheet, row, column, item) {
  const photo = item.photo;
  if (!photo || !photo.dataUrl) return;

  const base64 = String(photo.dataUrl).split(',')[1];
  if (!base64) return;

  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, photo.mimeType || 'image/jpeg', photo.fileName || 'photo.jpg');
  if (blob.getBytes().length > 2 * 1024 * 1024) {
    throw new Error(`Photo ${photo.fileName || 'photo.jpg'} exceeds the 2MB Google Sheets limit`);
  }

  const image = sheet.insertImage(blob, column, row, item.xOffset, item.yOffset);
  image.setWidth(item.width);
  image.setHeight(item.height);
}

function fitImageIntoBox(width, height, maxWidth, maxHeight) {
  const sourceWidth = Number(width) || maxWidth;
  const sourceHeight = Number(height) || Math.round(maxWidth * 0.75);
  const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight, 1);

  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
  };
}

function removeImagesFromCell(sheet, row, column) {
  sheet.getImages().forEach((image) => {
    const anchor = image.getAnchorCell();
    if (anchor.getRow() === row && anchor.getColumn() === column) {
      image.remove();
    }
  });
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
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
