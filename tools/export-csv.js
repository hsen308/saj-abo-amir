/* Turn data/menu.json into data/menu.csv, the layout the Google Sheet uses.
   Run: node tools/export-csv.js                                         */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'menu.json'), 'utf8'));

const COLUMNS = ['show', 'category', 'name_en', 'name_ar', 'price', 'desc_en', 'desc_ar', 'tags', 'id'];

function cell(v) {
  const s = v === undefined || v === null ? '' : String(v);
  // Quote when the value contains a delimiter, quote, or newline. Double any quotes.
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const rows = json.items.map((i) => [
  i.on === false ? 'no' : 'yes',
  i.cat,
  i.en,
  i.ar,
  i.price || '',
  i.dEn || '',
  i.dAr || '',
  (i.tags || []).join(' '),
  i.id
]);

const lines = [COLUMNS.join(',')];
for (const r of rows) lines.push(r.map(cell).join(','));

fs.writeFileSync(path.join(ROOT, 'data', 'menu.csv'), lines.join('\n') + '\n', 'utf8');
console.log('wrote data/menu.csv:', rows.length, 'rows,', COLUMNS.length, 'columns');