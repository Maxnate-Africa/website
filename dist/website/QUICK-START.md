# 🚀 Quick Start - Testing Your New Website

## View the Website Locally

### Option 1: Using Python (Recommended)

```powershell
# Navigate to the website directory
cd "d:\MAXNATE\DEVELOPMENT\Websites\Maxnate Africa\Website\Official Website\website"

# Start a local server on port 8000
python -m http.server 8000
```

Then open your browser and visit:
```
http://localhost:8000
```

### Option 2: Using Node.js

```powershell
# Install serve globally (one time only)
npm install -g serve

# Navigate to the website directory
cd "d:\MAXNATE\DEVELOPMENT\Websites\Maxnate Africa\Website\Official Website\website"

# Start the server
serve
```

### Option 3: Double-Click Method

Simply double-click `index.html` to open in your default browser.

**Note:** Some features (like contact form submission) work best with a local server.

---

## 🧪 Quick Visual Check

### What to Look For

1. **Homepage Loads** ✅
   - Hero carousel with 5 rotating images
   - Teal/charcoal color scheme
   - Professional layout

2. **Navigation Menu** ✅
   - Click each link: Home, Services, Technology, About, Testimonials, Contact
   - On mobile (resize browser): hamburger menu appears

3. **Services Section** ✅
   - 6 service cards with icons
   - Hover effects work
   - "Learn More" links go to contact

4. **Technology Stack** ✅
   - Frontend, Backend, DevOps categories
   - Icons for React, Node.js, AWS, etc.
   - Hover effects change colors

5. **About Section** ✅
   - Company stats (500+ projects, 3 countries, 98% satisfaction)
   - 3 team member cards with photos
   - Story image displays

6. **Testimonials** ✅
   - 3 testimonial cards
   - Previous/Next buttons work
   - Dot indicators at bottom
   - Auto-advances every 6 seconds

7. **Contact Form** ✅
   - All fields present
   - Service dropdown works
   - Submit button ready

---

## 📱 Mobile Testing

### Using Browser DevTools

**Chrome/Edge:**
1. Press `F12` or `Ctrl+Shift+I`
2. Click the device toggle icon (or press `Ctrl+Shift+M`)
3. Select "iPhone 12 Pro" or "iPad"
4. Test navigation and scrolling

**Breakpoints to Test:**
- **Desktop:** 1920px, 1440px, 1024px
- **Tablet:** 768px
- **Mobile:** 480px, 375px, 320px

---

## ✅ Checklist: What Should Work

### Navigation
- [x] Logo clickable (goes to #home)
- [x] Menu links scroll smoothly to sections
- [x] Mobile hamburger menu toggles
- [x] Menu closes when link is clicked

### Hero Section
- [x] Background images display
- [x] Carousel auto-advances every 5 seconds
- [x] Previous/Next buttons work
- [x] Overlay is semi-transparent teal/charcoal
- [x] Text is readable

### Services Section
- [x] 6 service cards visible
- [x] Cards lift on hover
- [x] Icons display correctly
- [x] Feature lists formatted properly

### Technology Section
- [x] Tech icons visible in 3 categories
- [x] Hover changes background to teal
- [x] Icons change to white on hover

### About Section
- [x] Stats display (500+, 3, 98%)
- [x] Team photos load
- [x] Story image displays

### Testimonials
- [x] Only one testimonial visible at a time
- [x] Previous/Next buttons cycle through
- [x] Dot indicators show current slide
- [x] Auto-advances

### Contact Section
- [x] Form fields accept input
- [x] Service dropdown shows options
- [x] Map iframe loads
- [x] Contact info displays

### Footer
- [x] Logo and tagline display
- [x] All link columns visible
- [x] Social media icons present
- [x] Copyright year is 2025

---

## 🐛 Common Issues & Fixes

### Issue: Images Not Loading
**Problem:** Path incorrect or images not copied  
**Fix:** Check console for 404 errors. Ensure images are in `assets/images/` subdirectories

### Issue: Styles Look Broken
**Problem:** CSS not loading  
**Fix:** Verify `assets/css/main.css` exists. Check browser console for errors

### Issue: Carousel Not Working
**Problem:** JavaScript not loading  
**Fix:** Verify `assets/js/main.js` exists. Check console for JavaScript errors

### Issue: Mobile Menu Not Opening
**Problem:** JavaScript click handler not attached  
**Fix:** Ensure page fully loaded. Check console for errors

### Issue: Contact Form Doesn't Submit
**Problem:** Formspree endpoint not configured  
**Fix:** Update form action to correct Formspree URL

---

## 🎯 Key Features to Demonstrate

### For Stakeholders
1. **Professional Design** - Modern, clean, tech-focused
2. **Clear Services** - 6 offerings with detailed features
3. **Technology Credibility** - Showcases technical expertise
4. **Team Presentation** - Professional team member cards
5. **Client Proof** - Real testimonials with photos
6. **Easy Contact** - Service-specific inquiry form

### For Developers
1. **Clean Code** - Semantic HTML5
2. **Organized Assets** - Logical folder structure
3. **Responsive Design** - Mobile-first approach
4. **Performance** - Lazy loading, optimized images
5. **Maintainable** - Well-documented, modular CSS/JS
6. **Accessible** - ARIA labels, keyboard navigation

---

## 📸 Screenshot Testing

Take screenshots at these breakpoints for documentation:

```powershell
# Desktop (1920x1080)
# - Hero section
# - Services grid
# - Technology stack
# - Full page scroll

# Tablet (768x1024)
# - Navigation (collapsed menu)
# - Services (2 columns)
# - Contact form

# Mobile (375x667)
# - Hero (vertical)
# - Services (1 column)
# - Mobile menu open
```

---

## 🚀 Next: Deploy to GitHub Pages

Once testing is complete:

```powershell
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Restructure: Professional redesign v2.0 - Software Dev focus"

# Push to main branch
git push origin main
```

GitHub Pages will automatically deploy (may take 1-2 minutes).

---

## 📞 Need Help?

**Check these resources:**
1. [RESTRUCTURE-SUMMARY.md](RESTRUCTURE-SUMMARY.md) - Complete overview
2. [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md) - Detailed migration steps
3. [README.md](README.md) - Full documentation

**Contact:**
- Dr. Godlove Mwalwisi
- Email: info@maxnate.com
- Phone: +255 746 662 612

---

**Happy Testing! 🎉**

Your website is now professional, modern, and ready to showcase Maxnate's software development expertise.
