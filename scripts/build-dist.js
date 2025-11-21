#!/usr/bin/env node
/**
 * Build distribution folder:
 * 1. Clean dist
 * 2. Copy static HTML & assets
 * 3. Run content build into dist assets/data
 * 4. Copy cms-admin into dist/cms-admin
 * 5. Minify dist assets
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const assetsSrc = path.join(root, 'assets');
const pagesSrc = path.join(root, 'pages');
const adminSrc = path.join(root, 'cms-admin');

function log(msg){ console.log(`[dist] ${msg}`); }

function cleanDist(){
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
  }
  fs.mkdirSync(dist, { recursive: true });
  log('Cleaned dist');
}

function copyRecursive(src, dest){
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  fs.mkdirSync(dest, { recursive: true });
  for (const e of entries){
    const sp = path.join(src, e.name);
    const dp = path.join(dest, e.name);
    if (e.isDirectory()) {
      copyRecursive(sp, dp);
    } else {
      fs.copyFileSync(sp, dp);
    }
  }
}

function copyStatic(){
  // Root HTML files
  ['index.html'].forEach(file => {
    const srcPath = path.join(root, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(dist, file));
      log(`Copied ${file}`);
    }
  });
  // Pages
  if (fs.existsSync(pagesSrc)) {
    copyRecursive(pagesSrc, path.join(dist, 'pages'));
    log('Copied pages');
  }
  // Assets (raw, will be minified later)
  if (fs.existsSync(assetsSrc)) {
    copyRecursive(assetsSrc, path.join(dist, 'assets'));
    log('Copied assets');
  }
  // CMS Admin
  if (fs.existsSync(adminSrc)) {
    copyRecursive(adminSrc, path.join(dist, 'cms-admin'));
    log('Copied cms-admin');
  }
}

function buildContent(){
  const outDir = path.join(dist, 'assets', 'data');
  process.env.BUILD_OUTPUT_DIR = outDir;
  execSync('node scripts/build-content.js', { stdio: 'inherit' });
}

function minifyAssets(){
  process.env.ASSETS_ROOT = path.join(dist, 'assets');
  execSync('node scripts/minify-assets.js', { stdio: 'inherit' });
}

(function run(){
  log('Starting dist build');
  cleanDist();
  copyStatic();
  // Optimize images after copy (generates WebP/AVIF variants)
  process.env.DIST_ASSETS = path.join(dist, 'assets');
  try {
    require('./optimize-images');
  } catch (e) {
    log(`Image optimization skipped: ${e.message}`);
  }
  // HTML critical CSS + minification before content build & asset minification
  try {
    require('./minify-html');
  } catch (e) {
    log(`HTML minification skipped: ${e.message}`);
  }
  buildContent();
  minifyAssets();
  // Hash assets and rewrite HTML references
  try {
    require('./hash-assets');
  } catch (e) {
    log(`Hashing skipped: ${e.message}`);
  }
  // Generate sitemap.xml and robots.txt
  try {
    require('./generate-sitemap');
  } catch (e) {
    log(`Sitemap generation skipped: ${e.message}`);
  }
  log('Dist build complete');
})();
