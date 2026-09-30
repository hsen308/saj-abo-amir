/* Read a CSV the way index.html reads it, so we can prove the round trip.
   Run: node tools/check-csv-roundtrip.js                                */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const csv = fs.readFileSync(path.join(ROOT, 'data', 'menu.csv'), 'utf8');

/* Parser mirroring the one in index.html. */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length && r.some(cell => cell.trim() !== ''));
}

const table = parseCSV(csv);
const head = table.shift();
console.log('columns:', head.join(' | '));
console.log('rows:', table.length);

const bad = table.filter(r => r.length !== head.length);
console.log('rows with wrong column count:', bad.length);
if (bad.length) { console.log(JSON.stringify(bad.slice(0, 3))); }

const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'menu.json'), 'utf8'));
const idx = Object.fromEntries(head.map((h, i) => [h, i]));

let mismatch = 0;
for (let r = 0; r < table.length; r++) {
  const cells = table[r];
  const id = cells[idx.id];
  const item = json.items.find(i => i.id === id);
  if (!item) { console.log('NO MATCH for id', id); mismatch++; continue; }

  const got = {
    show: cells[idx.show] !== 'no',
    cat: cells[idx.category],
    en: cells[idx.name_en],
    ar: cells[idx.name_ar],
    price: cells[idx.price],
    dEn: cells[idx.desc_en],
    dAr: cells[idx.desc_ar],
    tags: cells[idx.tags] ? cells[idx.tags].split(/\s+/).filter(Boolean) : []
  };

  for (const k of ['cat', 'en', 'ar', 'price', 'dEn', 'dAr']) {
    if (got[k] !== item[k]) {
      console.log('DIFF', id, k, JSON.stringify(got[k]), '!=', JSON.stringify(item[k]));
      mismatch++;
    }
  }
  if (got.tags.join(' ') !== (item.tags || []).join(' ')) {
    console.log('DIFF', id, 'tags', JSON.stringify(got.tags), '!=', JSON.stringify(item.tags));
    mismatch++;
  }
}

console.log(mismatch === 0
  ? 'round trip clean: every field survives csv -> json'
  : mismatch + ' mismatches');

/* Now the case that actually bites: a value with a comma AND a quote. */
const nasty = 'Halloum, pesto + "special"';
const quoted = /[",\r\n]/.test(nasty) ? '"' + nasty.replace(/"/g, '""') + '"' : nasty;
const back = parseCSV('a\n' + quoted + '\n');
console.log('nasty value round trip:', JSON.stringify(back[1][0]),
  back[1][0] === nasty ? 'OK' : 'BROKEN');