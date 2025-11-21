#!/usr/bin/env node
/**
 * Hash CSS & JS assets for cache busting
 * - Renames files to name.<hash>.ext (hash = first 10 chars of sha256)
 * - Generates manifest.json mapping original -> hashed
 * - Rewrites HTML references (including preload + stylesheet links and script src)
 * - Keeps original filenames removed (not duplicated)
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const distRoot = path.resolve(__dirname, '..', 'dist');
const assetsRoot = path.join(distRoot, 'assets');
const manifestPath = path.join(assetsRoot, 'manifest.json');

function log(msg){ console.log(`[hash] ${msg}`); }

function getFiles(dir, exts){
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })){
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...getFiles(full, exts));
    else if (exts.includes(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function hashContent(content){
  return crypto.createHash('sha256').update(content).digest('hex').slice(0,10);
}

function renameWithHash(file){
  const content = fs.readFileSync(file);
  const h = hashContent(content);
  const dir = path.dirname(file);
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  // If already hashed skip
  if (/\.[0-9a-f]{10}$/.test(base)) return null;
  const newName = `${base}.${h}${ext}`;
  const newPath = path.join(dir, newName);
  fs.renameSync(file, newPath);
  return { original: path.relative(assetsRoot, file).replace(/\\/g,'/'), hashed: path.relative(assetsRoot, newPath).replace(/\\/g,'/') };
}

function buildManifest(entries){
  const manifest = {};
  entries.forEach(e => { if (e) manifest['/' + e.original] = '/' + e.hashed; });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  log(`Manifest written with ${Object.keys(manifest).length} entries`);
  return manifest;
}

function rewriteHtml(manifest){
  function walk(dir){
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir,{withFileTypes:true})){
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && e.name.endsWith('.html')){
        let html = fs.readFileSync(full,'utf-8');
        let changed = false;
        for (const [orig, hashed] of Object.entries(manifest)){
          // Replace occurrences of original path in href/src (handle both with/without leading /assets)
          const regex = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g');
          if (regex.test(html)){
            html = html.replace(regex, hashed);
            changed = true;
          }
        }
        if (changed){
          fs.writeFileSync(full, html, 'utf-8');
          log(`Updated references in ${path.relative(distRoot, full)}`);
        }
      }
    }
  }
  walk(distRoot);
}

(function run(){
  log('Starting asset hashing');
  if (!fs.existsSync(assetsRoot)){ log('No assets root found, skipping'); return; }
  const targets = getFiles(assetsRoot, ['.css', '.js']);
  const entries = targets.map(renameWithHash).filter(Boolean);
  const manifest = buildManifest(entries);
  rewriteHtml(manifest);
  log('Asset hashing complete');
})();
