/* Guardian Motors Limited: converts referenced photo assets to compressed WebP.
   Run with: node scripts/optimize-images.js
   Source PNG/JPG originals are kept in assets/img/originals/ (gitignored) as a backup. */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'assets', 'img');
const BACKUP_DIR = path.join(IMG_DIR, 'originals');

/* file (without extension) -> max width in px, used to pick a sane resize target per use case. */
const TARGETS = {
  'alto-k10': 600, 'altok10-hd': 1000,
  'alto800': 600, 'alto800-hd': 1000,
  spresso: 1000,
  vitara: 600, 'vitara-hd': 1000,
  ertiga: 600, 'ertiga-hd': 1000,
  'super-carry': 600, 'supercarry-hd': 1000,
  dr200se: 600, 'dr200se-hd': 1000,
  en125: 600, 'en125-huz': 600,
  'vitara-hero': 1600,
  slide1: 1600, slide2: 1600,
  'product-car': 1000,
};

async function run() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const entries = Object.entries(TARGETS);
  let savedTotal = 0;

  for (const [name, maxWidth] of entries) {
    const src = ['.png', '.jpg', '.jpeg'].map((ext) => path.join(IMG_DIR, name + ext)).find(fs.existsSync);
    if (!src) { console.warn('skip (not found):', name); continue; }

    const before = fs.statSync(src).size;
    const dest = path.join(IMG_DIR, name + '.webp');
    await sharp(src).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest);
    const after = fs.statSync(dest).size;
    savedTotal += before - after;

    const backupPath = path.join(BACKUP_DIR, path.basename(src));
    if (!fs.existsSync(backupPath)) fs.copyFileSync(src, backupPath);
    fs.unlinkSync(src);

    console.log(`${path.basename(src)} -> ${name}.webp  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
  }

  console.log(`\nDone. Saved ~${(savedTotal / 1024 / 1024).toFixed(2)}MB. Originals backed up to assets/img/originals/ (not committed).`);
}

run().catch((err) => { console.error(err); process.exit(1); });
