import { readFile } from 'node:fs/promises';

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += character;
    }
  }
  cells.push(cell);
  return cells;
}

const csv = await readFile(new URL('../docs/audio-upload-manifest.csv', import.meta.url), 'utf8');
const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
const headers = parseCsvLine(headerLine);
const rows = lines
  .filter(Boolean)
  .map((line) => Object.fromEntries(parseCsvLine(line).map((value, index) => [headers[index], value])));

const include = rows.map((row) => {
  const targetUrl = new URL(row.target_url);
  const target = targetUrl.pathname.replace(/^\/audio\//, '');
  if (!row.source_filename || !target || target === targetUrl.pathname) {
    throw new Error(`Invalid audio manifest row for ${row.source_filename || 'unknown file'}`);
  }
  return { source: row.source_filename, target };
});

process.stdout.write(JSON.stringify({ include }));
