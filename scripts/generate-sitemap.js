#!/usr/bin/env node
/**
 * Generate sitemap.xml and robots.txt
 * - Reads CNAME for primary domain if present, else uses BASE_URL env or fallback
 * - Enumerates all .html files in dist excluding cms-admin
 * - Produces <loc> entries; simple daily <changefreq>
 */
const fs = require('fs');
const path = require('path');

const distRoot = path.resolve(__dirname, '..', 'dist');
const cnamePath = path.resolve(__dirname, '..', 'CNAME');
const base = process.env.BASE_URL || (fs.existsSync(cnamePath) ? `https://${fs.readFileSync(cnamePath,'utf-8').trim()}` : 'https://www.example.com');

function log(msg){ console.log(`[sitemap] ${msg}`); }

function walk(dir){
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir,{withFileTypes:true})){
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(full));
    else if (e.isFile() && e.name.endsWith('.html') && !full.includes('cms-admin')) out.push(full);
  }
  return out;
}

function htmlPathToUrl(file){
  const rel = path.relative(distRoot, file).replace(/\\/g,'/');
  // index.html root or nested
  if (rel === 'index.html') return base + '/';
  // pages/offers.html -> /offers.html or consider pretty URL /offers
  if (rel.startsWith('pages/')){
    const pageName = rel.substring('pages/'.length);
    if (pageName.toLowerCase() === 'offers.html') return base + '/offers';
    return base + '/' + pageName;
  }
  return base + '/' + rel;
}

function buildSitemap(urls){
  const now = new Date().toISOString().split('T')[0];
  const body = urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <changefreq>daily</changefreq>\n    <lastmod>${now}</lastmod>\n    <priority>${u === base + '/' ? '1.0' : '0.7'}</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function buildRobots(){
  return `User-agent: *\nAllow: /\nDisallow: /cms-admin/\n\nSitemap: ${base}/sitemap.xml\n`;
}

(function run(){
  log('Generating sitemap & robots');
  const files = walk(distRoot);
  const urls = files.map(htmlPathToUrl);
  const sitemap = buildSitemap(urls);
  fs.writeFileSync(path.join(distRoot, 'sitemap.xml'), sitemap, 'utf-8');
  fs.writeFileSync(path.join(distRoot, 'robots.txt'), buildRobots(), 'utf-8');
  log(`Sitemap entries: ${urls.length}`);
})();
