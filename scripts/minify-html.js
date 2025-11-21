#!/usr/bin/env node
/**
 * HTML Minification + Critical CSS inlining.
 * Steps:
 * 1. Extract critical CSS between markers: [CRITICAL-START] and [CRITICAL-END] in main.css.
 * 2. Inline that CSS into the <head> of each HTML file (excluding cms-admin).
 * 3. Replace the stylesheet link with a preload link + noscript fallback, improving render performance.
 * 4. Minify the resulting HTML (collapse whitespace, remove comments, minify inline CSS & JS).
 */
const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const distRoot = path.resolve(__dirname, '..', 'dist');
const cssPath = path.join(distRoot, 'assets', 'css', 'main.css');

function log(msg){ console.log(`[html] ${msg}`); }

function getCriticalCss(){
  if (!fs.existsSync(cssPath)) { log('main.css not found for critical extraction'); return ''; }
  const css = fs.readFileSync(cssPath, 'utf-8');
  const start = css.indexOf('/* CRITICAL-START */');
  const end = css.indexOf('/* CRITICAL-END */');
  if (start !== -1 && end !== -1 && end > start){
    return css.substring(start + '/* CRITICAL-START */'.length, end).trim();
  }
  // Fallback: first 3000 chars
  log('Critical markers missing; using fallback slice');
  return css.slice(0, 3000);
}

function walk(dir){
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })){
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (/\.html$/i.test(e.name) && !full.includes('cms-admin')) out.push(full);
  }
  return out;
}

function transformHtml(html, critical){
  // Inject critical style before closing head
  const hasHead = html.includes('</head>');
  if (!hasHead) return html; // skip malformed

  // Replace link to main.css
  const linkRegex = /<link[^>]+href=["'][^"'>]*assets\/css\/main\.css["'][^>]*>/i;
  const preloadBlock = `<link rel="preload" href="/assets/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">\n<noscript><link rel="stylesheet" href="/assets/css/main.css"></noscript>`;
  let replaced = html.replace(linkRegex, preloadBlock);

  // Insert critical style at the top of head (after <head ...>)
  const headOpenRegex = /<head[^>]*>/i;
  replaced = replaced.replace(headOpenRegex, match => `${match}\n<style id="critical-css">${critical}</style>`);
  return replaced;
}

async function run(){
  log('Starting HTML transform');
  const critical = getCriticalCss();
  const files = walk(distRoot).filter(f => !f.endsWith('cms-admin/index.html'));
  for (const file of files){
    let html = fs.readFileSync(file, 'utf-8');
    html = transformHtml(html, critical);
    try {
      html = await minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true
      });
    } catch(e){
      log(`Minify error ${path.relative(distRoot, file)}: ${e.message}`);
    }
    fs.writeFileSync(file, html, 'utf-8');
    log(`Processed ${path.relative(distRoot, file)}`);
  }
  log('HTML transform complete');
}
run();
