/* Extract the item/combo data from index.html into data/menu.json
   Run: node tools/export-data.js                                          */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// The last <script> block is the app; earlier blocks are the menu.json loader.
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (!blocks.length) throw new Error('no script block found in index.html');
const js = blocks[blocks.length - 1];

// Evaluate only the data half of the script (up to the "Code below" marker).
// Cut just before the "Code below does not need editing" banner comment.
const marker = js.indexOf('Code below does not need editing');
if (marker < 0) throw new Error('data marker not found');
const bannerStart = js.lastIndexOf('/*', marker);
const dataSrc = js.slice(0, bannerStart).replace(/\/\*[\s\S]*?\*\//g, '');
const sandbox = {};
const grab =
  'exports.SHOP=SHOP;exports.ITEMS=ITEMS;exports.COMBOS=COMBOS;exports.BREADS=BREADS;' +
  'exports.SAUCES=SAUCES;exports.FILLINGS=FILLINGS;exports.VEGGIES=VEGGIES;exports.TAGS=TAGS;';
new Function('exports', dataSrc + '\n' + grab)(sandbox);

const out = {
  shop: sandbox.SHOP,
  tags: sandbox.TAGS,
  breads: sandbox.BREADS,
  sauces: sandbox.SAUCES,
  fillings: sandbox.FILLINGS,
  veggies: sandbox.VEGGIES,
  items: sandbox.ITEMS.map((i) => ({
    id: i.id, cat: i.cat, en: i.en, ar: i.ar,
    dEn: i.dEn, dAr: i.dAr, tags: i.tags, bread: i.bread,
    price: i.price, macros: i.macros
  })),
  combos: sandbox.COMBOS
};

const dir = path.join(ROOT, 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'menu.json'), JSON.stringify(out, null, 2) + '\n');
console.log('wrote data/menu.json:', out.items.length, 'items,', out.combos.length, 'combos');