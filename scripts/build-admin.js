#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = __dirname;
const dist = path.join(repoRoot, 'dist');
const distAdmin = path.join(dist, 'admin');
const adminSrc = path.join(repoRoot, 'admin');

console.log('Building dist/admin for Vercel...');

// Ensure dist/admin exists
if (!fs.existsSync(distAdmin)) {
  fs.mkdirSync(distAdmin, { recursive: true });
}

// Copy admin folder contents recursively
function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(adminSrc)) {
  copyRecursive(adminSrc, distAdmin);
  console.log('✓ Admin files copied to dist/admin');
} else {
  console.error('Error: admin folder not found');
  process.exit(1);
}

console.log('Build complete!');
