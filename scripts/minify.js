/* Guardian Motors Limited: minifies the hand-authored CSS/JS into the *.min.* files
   that the generated HTML pages reference. Source files stay readable for editing.
   Run with: node scripts/minify.js (also runs as part of `npm run build`) */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = path.join(__dirname, '..');

const CSS = [{ src: 'css/style.css', out: 'css/style.min.css' }];
const JS = [
  { src: 'js/data.js', out: 'js/data.min.js' },
  { src: 'js/shop.js', out: 'js/shop.min.js' },
  { src: 'js/app.js', out: 'js/app.min.js' },
];

async function run() {
  for (const { src, out } of CSS) {
    const result = await esbuild.build({
      entryPoints: [path.join(ROOT, src)], write: false, minify: true, loader: { '.css': 'css' },
    });
    fs.writeFileSync(path.join(ROOT, out), result.outputFiles[0].text);
    console.log(`${src} -> ${out}`);
  }
  for (const { src, out } of JS) {
    const result = await esbuild.build({
      entryPoints: [path.join(ROOT, src)], write: false, minify: true, bundle: false, target: 'es2018',
    });
    fs.writeFileSync(path.join(ROOT, out), result.outputFiles[0].text);
    console.log(`${src} -> ${out}`);
  }
  console.log('\nDone.');
}

run().catch((err) => { console.error(err); process.exit(1); });
