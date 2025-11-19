# Website Restructuring - Migration Guide

## ✅ Completed Changes

### Folder Structure
- ✅ Created `assets/` directory with subdirectories
- ✅ Created `assets/css/` and moved styles
- ✅ Created `assets/js/` and moved scripts
- ✅ Created `assets/images/` with organized subdirectories
- ✅ Created `pages/` directory
- ✅ Moved `thank-you.html` to `pages/`

### Files Updated
- ✅ New professional `index.html` (old backed up as `index.old.html`)
- ✅ New `assets/css/main.css` (consolidated stylesheet)
- ✅ New `assets/js/main.js` (consolidated scripts)
- ✅ Updated `README.md` with comprehensive documentation

### Images Migrated
- ✅ Hero carousel images → `assets/images/hero/`
- ✅ Team photos → `assets/images/team/`
- ✅ Testimonial authors → `assets/images/authors/`
- ✅ Story images → `assets/images/story/`
- ✅ Logo files → `assets/images/logo/`

---

## 📋 Manual Steps Required

### 1. Verify Image Paths
Check that all images are correctly placed:

```powershell
# List hero images
Get-ChildItem "assets/images/hero/"

# List team images
Get-ChildItem "assets/images/team/"

# List author images
Get-ChildItem "assets/images/authors/"

# List logo files
Get-ChildItem "assets/images/logo/"
```

### 2. Image Optimization (Recommended)

**Hero Images** (should be 1920×1080):
- hero1.webp
- hero2.webp
- hero3.webp
- hero4.webp
- hero5.webp

**Team Photos** (should be 400×400):
- creativeDirector.png
- Digital Transformation Manager.png
- Market Intelligence Analyst.png

**Logo Files** (required):
- logo.png (150×50 for navbar)
- footer.svg (for footer)
- favicon.png (32×32 for browser tab)
- og-image.png (1200×630 for social media)

### 3. Update Social Media Links

Edit `index.html` and replace placeholder URLs:

```html
<!-- Find these lines in the footer -->
<a href="https://facebook.com/maxnateafrica">
<a href="https://x.com/maxnateafrica">
<a href="https://instagram.com/maxnateafrica">
<a href="https://linkedin.com/company/maxnate-africa">
```

### 4. Test Contact Form

The contact form currently points to:
```
https://formspree.io/f/xzzjeqzk
```

**Test submission:**
1. Fill out the form
2. Submit
3. Check email at the configured address
4. Verify thank-you page redirect

---

## 🔧 Optional Enhancements

### Add Service Images
Create icons for each service in `assets/images/services/`:
- custom-software.svg
- web-development.svg
- cloud-hosting.svg
- digital-transformation.svg
- agritech.svg
- maintenance.svg

### Add Technology Logos
Add tech stack logos to `assets/images/tech-stack/`:
- react-logo.svg
- nodejs-logo.svg
- python-logo.svg
- docker-logo.svg
- aws-logo.svg
- etc.

### Create Favicon Set
Generate multiple favicon sizes:
- favicon-16x16.png
- favicon-32x32.png
- favicon-96x96.png
- apple-touch-icon.png (180×180)

Add to `<head>` in index.html:
```html
<link rel="icon" type="image/png" sizes="32x32" href="assets/images/logo/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/images/logo/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/images/logo/apple-touch-icon.png">
```

---

## 🚀 Deployment Checklist

Before pushing to production:

- [ ] All images are in `assets/images/` subdirectories
- [ ] No broken image links (check browser console)
- [ ] Contact form tested and working
- [ ] Social media links updated
- [ ] Mobile responsiveness tested
- [ ] All pages load correctly
- [ ] Old files backed up (`index.old.html`, `styles.css`, `script.js`)
- [ ] README.md reviewed and accurate

---

## 📊 File Comparison

### Old Structure
```
website/
├── images/
│   ├── Hero/
│   ├── team/
│   ├── authors/
│   ├── Our Story/
│   └── uploads/
├── styles.css
├── script.js
├── index.html
└── thank-you.html
```

### New Structure
```
website/
├── assets/
│   ├── css/main.css
│   ├── js/main.js
│   └── images/
│       ├── hero/
│       ├── team/
│       ├── authors/
│       ├── services/
│       ├── tech-stack/
│       ├── story/
│       └── logo/
├── pages/
│   └── thank-you.html
├── index.html
├── index.old.html (backup)
├── styles.css (legacy, can remove)
└── script.js (legacy, can remove)
```

---

## 🧹 Cleanup (Optional)

Once everything is working, you can remove old files:

```powershell
# Remove old stylesheet and script
Remove-Item "styles.css"
Remove-Item "script.js"

# Archive old images folder
Move-Item "images" "images.old"
```

**⚠️ Warning:** Only do this after thoroughly testing the new site!

---

## 🆘 Rollback Instructions

If you need to revert to the old version:

```powershell
# Restore old index.html
Move-Item "index.html" "index.new.html" -Force
Move-Item "index.old.html" "index.html" -Force

# Restore old assets
Move-Item "images.old" "images" -Force
```

---

## 📝 Notes

### What Changed in the Redesign?

1. **Professional Focus**: Emphasizes software development and web services
2. **Modern Design**: Clean, tech-focused aesthetic with teal/charcoal palette
3. **Better Structure**: Organized assets, clearer navigation
4. **Enhanced Sections**:
   - Detailed services with features
   - Technology stack showcase
   - Better team presentation
   - Improved testimonials
5. **SEO Optimized**: Meta tags, semantic HTML, structured data
6. **Performance**: Lazy loading, optimized assets, mobile-first

### Client Sites Untouched
The following directories remain unchanged:
- `clients/alamastudio/`
- `clients/Comingsoon/`
- `clients/meemahs/`
- `clients/prografiks/`

These continue to work with their own assets and styles.

---

## ✅ Success Criteria

The migration is complete when:

1. ✅ Homepage loads without errors
2. ✅ All images display correctly
3. ✅ Navigation menu works (desktop & mobile)
4. ✅ Contact form submits successfully
5. ✅ Hero carousel auto-advances
6. ✅ Testimonial carousel works
7. ✅ All links are functional
8. ✅ Page is mobile-responsive
9. ✅ No console errors in browser DevTools
10. ✅ README.md is up-to-date

---

**Questions or issues?** Contact the development team.

**Dr. Godlove Mwalwisi** - Creative Director
📧 info@maxnate.com | 📱 +255 746 662 612
