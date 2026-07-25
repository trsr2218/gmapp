/* Guardian Motors Limited: minifies the hand-authored CSS/JS into the *.min.* files
   that the generated HTML pages reference. Source files stay readable for editing.
   Run with: node scripts/minify.js (also runs as part of `npm run build`) */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const { ROOT, OUT_DIR } = require('./build.js');

const CSS = [{ src: 'css/style.css', out: 'css/style.min.css' }];
const JS = [
  { src: 'js/data.js', out: 'js/data.min.js' },
  { src: 'js/shop.js', out: 'js/shop.min.js' },
  { src: 'js/app.js', out: 'js/app.min.js' },
];

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const { src, out } of CSS) {
    const result = await esbuild.build({
      entryPoints: [path.join(ROOT, src)], write: false, minify: true, loader: { '.css': 'css' },
    });
    const dest = path.join(OUT_DIR, out);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, result.outputFiles[0].text);
    console.log(`${src} -> dist/${out}`);
  }
  for (const { src, out } of JS) {
    const result = await esbuild.build({
      entryPoints: [path.join(ROOT, src)], write: false, minify: true, bundle: false, target: 'es2018',
    });
    const dest = path.join(OUT_DIR, out);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, result.outputFiles[0].text);
    console.log(`${src} -> dist/${out}`);
  }
  console.log('\nDone.');
}

run().catch((err) => { console.error(err); process.exit(1); });
