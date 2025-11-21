#!/usr/bin/env node
/**
 * Minify CSS and JS assets in-place for production build.
 * Keeps filenames the same to avoid HTML reference changes.
 */
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const glob = require('glob');

const projectRoot = path.resolve(__dirname, '..');
const assetsRoot = process.env.ASSETS_ROOT
  ? path.resolve(process.env.ASSETS_ROOT)
  : path.join(projectRoot, 'assets');
const jsDir = path.join(assetsRoot, 'js');
const cssDir = path.join(assetsRoot, 'css');

function log(msg) { console.log(`[minify:${assetsRoot.includes('dist') ? 'dist' : 'src'}] ${msg}`); }

async function minifyJsFiles() {
  const pattern = path.join(jsDir, '**', '*.js');
  const files = glob.sync(pattern, { nodir: true });
  for (const file of files) {
    try {
      const original = fs.readFileSync(file, 'utf8');
      // Skip already tiny files (< 200 chars) to preserve readability for potential config scripts.
      if (original.length < 200) { log(`skip(js): ${path.basename(file)} (tiny)`); continue; }
      const result = await minify(original, {
        compress: true,
        mangle: true,
        ecma: 2019,
      });
      if (result.code && result.code.length < original.length) {
        fs.writeFileSync(file, result.code, 'utf8');
        log(`minified(js): ${path.basename(file)} ${(original.length - result.code.length)} bytes saved`);
      } else {
        log(`skip(js): ${path.basename(file)} (no size gain)`);
      }
    } catch (e) {
      log(`error(js): ${path.basename(file)} -> ${e.message}`);
    }
  }
}

function minifyCssFiles() {
  const pattern = path.join(cssDir, '**', '*.css');
  const files = glob.sync(pattern, { nodir: true });
  for (const file of files) {
    try {
      const original = fs.readFileSync(file, 'utf8');
      if (original.length < 200) { log(`skip(css): ${path.basename(file)} (tiny)`); continue; }
      const output = new CleanCSS({ level: 2 }).minify(original);
      if (output.styles && output.styles.length < original.length) {
        fs.writeFileSync(file, output.styles, 'utf8');
        log(`minified(css): ${path.basename(file)} ${(original.length - output.styles.length)} bytes saved`);
      } else {
        log(`skip(css): ${path.basename(file)} (no size gain)`);
      }
    } catch (e) {
      log(`error(css): ${path.basename(file)} -> ${e.message}`);
    }
  }
}

(async function run() {
  log('Starting asset minification...');
  await minifyJsFiles();
  minifyCssFiles();
  log('Asset minification complete.');
})();
