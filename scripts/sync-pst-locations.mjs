import { readFile, writeFile } from 'node:fs/promises';

const DEFAULT_SPREADSHEET_ID = '1ApfnLS5npNMBW3YYI9_d94yyWwbfv-Bpck_Hozjcl58';
const DEFAULT_SHEET_GID = '119754499';
const OUTPUT_PATH = new URL('../app/public/pst-locations.json', import.meta.url);

const spreadsheetId = process.env.PST_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
const sheetGid = process.env.PST_LOCATIONS_GID || DEFAULT_SHEET_GID;
const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=tsv&gid=${sheetGid}`;

const headerAliases = {
  id: ['POSTOMAT_ID', 'ID'],
  city: ['Город'],
  branch: ['Филиал'],
  address: ['Адрес'],
  lat: ['Широта'],
  lng: ['Долгота'],
  category: ['Категория точки'],
  routeText: ['ROUTE_TEXT'],
  surfaceType: ['Тип покрытия'],
  installPlace: ['Место установки'],
  cellsCount: ['Кол-во ячеек'],
  comment: ['Комментарий'],
};

function normalizeHeader(value) {
  return String(value || '')
    .replace(/\uFEFF/g, '')
    .trim()
    .toLowerCase();
}

function findHeaderIndex(headers, aliases) {
  const normalizedHeaders = headers.map(normalizeHeader);
  return aliases
    .map((alias) => normalizedHeaders.indexOf(normalizeHeader(alias)))
    .find((index) => index !== -1) ?? -1;
}

function decodeSheetPayload(buffer) {
  const utf8 = new TextDecoder('utf-8').decode(buffer);
  if (utf8.includes('POSTOMAT_ID\tГород\tФилиал\tАдрес')) {
    return utf8;
  }

  return new TextDecoder('windows-1251').decode(buffer);
}

function parseTsv(content) {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('\t').map((cell) => cell.trim()));
}

function normalizeNumber(value) {
  const prepared = String(value || '')
    .replace(/\s+/g, '')
    .replace(',', '.');
  const parsed = Number(prepared);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeText(value) {
  return String(value || '').replace(/\u200B/g, '').trim();
}

function buildHint(comment, routeText) {
  const source = normalizeText(comment) || normalizeText(routeText);
  if (!source) return '';

  return source
    .replace(/^Kaspi Postomat\s*/i, '')
    .replace(/^Уличный\s+/i, '')
    .replace(/^Postomat\s*/i, '')
    .replace(/^расположен\s+/i, '')
    .trim()
    .replace(/^[,.:\-\s]+/, '');
}

function stringifyCellsCount(value) {
  const text = normalizeText(value);
  if (!text) return '';
  const normalized = text.replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? String(parsed) : text;
}

function createLocationFromRow(row, headerMap, existingById) {
  const get = (key) => {
    const index = headerMap[key];
    return index === -1 ? '' : row[index] ?? '';
  };

  const id = normalizeText(get('id'));
  if (!id) return null;

  const existing = existingById.get(id);
  const routeText = normalizeText(get('routeText'));
  const comment = normalizeText(get('comment'));

  return {
    id,
    city: normalizeText(get('city')),
    branch: normalizeText(get('branch')),
    address: normalizeText(get('address')),
    lat: normalizeNumber(get('lat')) ?? existing?.lat ?? 0,
    lng: normalizeNumber(get('lng')) ?? existing?.lng ?? 0,
    category: normalizeText(get('category')),
    routeText,
    surfaceType: normalizeText(get('surfaceType')),
    installPlace: normalizeText(get('installPlace')),
    cellsCount: stringifyCellsCount(get('cellsCount')),
    comment: comment || existing?.comment || routeText,
    hint: buildHint(comment || existing?.comment || routeText, routeText) || existing?.hint || '',
  };
}

async function main() {
  const response = await fetch(exportUrl, {
    headers: {
      'user-agent': 'icwebsite-pst-sync/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet export: HTTP ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const content = decodeSheetPayload(buffer);
  const rows = parseTsv(content);

  if (rows.length < 2) {
    throw new Error('Sheet export does not contain data rows');
  }

  const headers = rows[0];
  const headerMap = Object.fromEntries(
    Object.entries(headerAliases).map(([key, aliases]) => [key, findHeaderIndex(headers, aliases)])
  );

  const requiredHeaders = ['id', 'city', 'branch', 'address', 'lat', 'lng'];
  const missingHeaders = requiredHeaders.filter((key) => headerMap[key] === -1);
  if (missingHeaders.length > 0) {
    throw new Error(`Required sheet headers not found: ${missingHeaders.join(', ')}`);
  }

  const existingLocations = JSON.parse(await readFile(OUTPUT_PATH, 'utf8')).map((item) => ({
    ...item,
    id: String(item.id),
  }));
  const existingById = new Map(existingLocations.map((item) => [item.id, item]));

  const nextLocations = rows
    .slice(1)
    .map((row) => createLocationFromRow(row, headerMap, existingById))
    .filter(Boolean);

  if (nextLocations.length === 0) {
    throw new Error('No PST locations were built from the sheet export');
  }

  const nextJson = `${JSON.stringify(nextLocations, null, 2)}\n`;
  const currentJson = await readFile(OUTPUT_PATH, 'utf8');

  if (currentJson === nextJson) {
    console.log(`PST locations are already up to date (${nextLocations.length} rows).`);
    return;
  }

  await writeFile(OUTPUT_PATH, nextJson, 'utf8');
  console.log(`Updated pst-locations.json from Google Sheets (${nextLocations.length} rows).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
