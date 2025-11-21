#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const dist = path.join(repoRoot, 'dist');
const distAdmin = path.join(dist, 'cms-admin');
const adminSrc = path.join(repoRoot, 'cms-admin');

console.log('Building dist/admin...');

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
  console.log('✓ Admin files copied to dist/cms-admin');
} else {
  console.warn('Warning: cms-admin folder not found, skipping admin copy');
}

console.log('Build complete!');
