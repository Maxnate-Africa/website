#!/usr/bin/env node
/**
 * Optimize images in dist after initial copy.
 * - Generates resized variants (480, 768, 1200 widths) for JPEG/PNG
 * - Converts to WebP & AVIF
 * - Skips if source smaller than 5KB (likely already optimized or icon)
 * - Avoids reprocessing if target exists
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const distAssets = process.env.DIST_ASSETS || path.resolve(__dirname, '..', 'dist', 'assets');
const imageDirs = [path.join(distAssets, 'images'), path.resolve(__dirname, '..', 'images')]; // handle root images copy if present
const widths = [480, 768, 1200];
const supported = ['.jpg', '.jpeg', '.png'];

function log(msg){ console.log(`[images] ${msg}`); }

function walk(dir){
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })){
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walk(full));
    else results.push(full);
  }
  return results;
}

async function processImage(file){
  const ext = path.extname(file).toLowerCase();
  if (!supported.includes(ext)) return;
  const stat = fs.statSync(file);
  if (stat.size < 5 * 1024) return; // skip tiny
  const dir = path.dirname(file);
  const base = path.basename(file, ext);

  for (const w of widths){
    const variantBase = `${base}-${w}`;
    const webpTarget = path.join(dir, `${variantBase}.webp`);
    const avifTarget = path.join(dir, `${variantBase}.avif`);
    if (!fs.existsSync(webpTarget)){
      try {
        await sharp(file).resize({ width: w }).webp({ quality: 80 }).toFile(webpTarget);
        log(`Created ${path.relative(distAssets, webpTarget)}`);
      } catch(e){ log(`WebP fail ${file}: ${e.message}`); }
    }
    if (!fs.existsSync(avifTarget)){
      try {
        await sharp(file).resize({ width: w }).avif({ quality: 50 }).toFile(avifTarget);
        log(`Created ${path.relative(distAssets, avifTarget)}`);
      } catch(e){ log(`AVIF fail ${file}: ${e.message}`); }
    }
  }
}

(async function run(){
  log('Starting image optimization');
  for (const dir of imageDirs){
    const files = walk(dir);
    for (const f of files){
      // ensure only optimizing inside dist assets or root images if copied
      if (supported.includes(path.extname(f).toLowerCase())){
        await processImage(f);
      }
    }
  }
  log('Image optimization complete');
})();
