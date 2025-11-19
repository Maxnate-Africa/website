# Maxnate Africa - Official Website

> **Software Development & Web Services** | Professional corporate website for Maxnate Africa

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmaxnate.com)](https://maxnate.com)
[![License](https://img.shields.io/badge/license-Proprietary-blue)](LICENSE)

---

## 🚀 About

Maxnate is a leading software development and web services company based in Tanzania, serving clients across Africa and beyond. This repository contains our official corporate website showcasing our services, technology stack, and client success stories.

**Core Services:**

- Custom Software Development
- Web Development & Design
- Cloud Hosting & Infrastructure
- Digital Transformation
- AgriTech Solutions
- 24/7 Maintenance & Support


---

## 📁 Project Structure

```text
website/
├── assets/
│   ├── css/
│   │   └── main.css              # Main stylesheet
│   ├── js/
│   │   └── main.js               # Main JavaScript
│   └── images/
│       ├── hero/                 # Hero carousel images
│       ├── team/                 # Team member photos
│       ├── authors/              # Testimonial photos
│       ├── services/             # Service icons
│       ├── tech-stack/           # Technology logos
│       ├── story/                # About section images
│       └── logo/                 # Company logo variants
├── pages/
│   └── thank-you.html            # Form submission thank you page
├── clients/                      # Client project subdirectories
│   ├── alamastudio/
│   ├── Comingsoon/
│   ├── meemahs/
│   └── prografiks/
├── index.html                    # Homepage
├── index.old.html                # Previous version (backup)
├── robots.txt                    # SEO crawler instructions
├── CNAME                         # Custom domain configuration
└── README.md                     # This file
```

---

## 🛠️ Technology Stack

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome 6.5** - Icon library

### Hosting & Deployment

- **GitHub Pages** - Static site hosting

### Performance

- Lazy loading images
- CSS/JS minification ready
- Optimized asset delivery
- Mobile-first responsive design

---

## 🎨 Design System

### Brand Colors

```css
--primary-teal: #008080      /* Main brand color */
--dark-charcoal: #1c1c1d     /* Secondary color */
--off-white: #f7f8f9         /* Background */
--accent-blue: #0066cc       /* Accents */
--success-green: #00a86b     /* Success states */
```

### Typography

- **Primary Font:** Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Heading Font:** Arial, system fonts

---

## 🚀 Quick Start

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/Maxnate-Africa/website.git
cd website
```

1. **Open in browser**

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve
```

1. **Visit** `http://localhost:8000`

### Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

**Manual deployment:**

```bash
git add .
git commit -m "Update website content"
git push origin main
```

## ☁️ Appwrite Integration (Dynamic Content)

This site uses Appwrite for dynamic Offers, Projects, and News content. There is no Firebase code or fallback remaining.

### Configure Appwrite (Frontend Public Reads)

1. Create an Appwrite Project and note:
    - Endpoint (e.g. `https://cloud.appwrite.io/v1`)
    - Project ID
2. Create a Database (e.g. `website_db`), then a Collection (e.g. `offers`).
3. Add attributes to `offers` (examples):
    - `title` (string)
    - `description` (string)
    - `discount` (string) or `value` (string)
    - `expiry` (datetime, optional)
    - `status` (string or enum: `draft` | `published`)
4. Permissions: allow anonymous read of published offers (or implement a rule to restrict to `status == "published"`).
5. Fill `assets/js/appwrite-config.js`:

```js
window.APPWRITE_PUBLIC = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "<PROJECT_ID>",
  databaseId: "website_db",
  offersCollectionId: "offers"
};
```

### How it works

- `pages/offers.html` includes Appwrite SDK via CDN and uses `assets/js/appwrite-public.js`.
- Homepage (`index.html`) loads Projects & News dynamically using Appwrite queries.

### Admin (CMS)

The admin dashboard uses Appwrite (Auth/Database/Storage). Role-based permissions can be extended using Appwrite Teams & document-level ACLs.

## 🏗️ Hosting Split: Website vs CMS (PWA)

- Website (`/`): host on GitHub Pages, Cloudflare Pages, or Netlify as a static site.
- CMS (`/admin`): deploy as a separate app on a subdomain (e.g., `https://admin.maxnate.com`). The admin is a PWA (installable) via `manifest.webmanifest` and `sw.js`.

### Recommended Setup

- DNS: point `maxnate.com` → website host; `admin.maxnate.com` → CMS host.
- Appwrite: allow CORS origins for both domains; set OAuth callback (if used) to `admin.maxnate.com`.
- Environment: fill `admin/js/appwrite-config.js` for CMS and `assets/js/appwrite-config.js` for public site.

### Deploy Steps (example: Cloudflare Pages)

1. Create two projects: `website` (root) and `maxcms` (`admin/` as root).
2. Build command: none; Output directory: respective roots.
3. Set custom domains: `maxnate.com` for website; `admin.maxnate.com` for CMS.
4. In Appwrite console: add both origins to CORS and set permissions for authenticated admin roles.

### PWA Install

- The CMS includes `manifest.webmanifest` and `sw.js`. Modern browsers will offer “Install App”.
- Update icons in `admin/manifest.webmanifest` for better OS integration.

---

## 📝 Content Management

### Adding New Services

Edit `index.html` in the **Services Section**:

```html
<div class="service-card">
    <div class="service-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3>Service Name</h3>
    <p>Service description...</p>
    <ul class="service-features">
        <li>Feature 1</li>
        <li>Feature 2</li>
    </ul>
    <a href="#contact" class="service-link">Learn More →</a>
</div>
```

### Adding Team Members

Edit the **Leadership Team** section:

```html
<div class="team-card">
    <div class="team-photo">
        <img src="assets/images/team/member-name.png" alt="Member Name" loading="lazy">
    </div>
    <h4>Member Name</h4>
    <p class="team-role">Job Title</p>
    <p class="team-bio">Bio description...</p>
</div>
```

### Adding Testimonials

Edit the **Testimonials Section**:

```html
<div class="testimonial-card">
    <div class="testimonial-content">
        <div class="quote-icon">"</div>
        <p class="testimonial-text">Testimonial quote...</p>
        <div class="testimonial-author">
            <img src="assets/images/authors/author.jpg" alt="Client Name" class="author-photo" loading="lazy">
            <div class="author-info">
                <h4>Client Name</h4>
                <p>Position, Company</p>
            </div>
        </div>
    </div>
</div>
```

---

## 🖼️ Image Guidelines

### Required Image Sizes

| Location | Size (px) | Format | Notes |
|----------|-----------|--------|-------|
| Hero Carousel | 1920×1080 | WebP, JPG | Landscape, high quality |
| Team Photos | 400×400 | PNG, JPG | Square, professional headshot |
| Author Photos | 200×200 | JPG | Circle crop, testimonials |
| Service Icons | 70×70 | SVG, PNG | Transparent background |
| Logo | 150×50 | SVG, PNG | Transparent background |

### Optimization

- Use **WebP** format for hero images (fallback to JPG)
- Compress images to < 200KB each
- Use lazy loading for below-fold images

---

## 🔧 Customization

### Changing Colors

Edit CSS variables in `assets/css/main.css`:

```css
:root {
    --primary-teal: #008080;
    --dark-charcoal: #1c1c1d;
    --off-white: #f7f8f9;
}
```

### WhatsApp Contact

The site uses WhatsApp deep links for inquiries. Replace the phone and prefilled text as needed:

```html
<a href="https://wa.me/255746662612?text=Hello%20Maxnate%2C%20I%27d%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener">Chat on WhatsApp</a>
```

### Google Maps Integration

Update the iframe `src` in the contact section with your location coordinates (optional).

---

## 📊 SEO Optimization

### Meta Tags

All essential meta tags are included in `<head>`:

- Open Graph tags for social sharing
- Twitter Card metadata
- Structured data ready

### Sitemap

Generate sitemap for better SEO when needed.

### robots.txt

Already configured to allow all crawlers

---

## 🧪 Testing

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility

- Semantic HTML5
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

### Performance Checklist

- [ ] Images optimized and compressed
- [ ] CSS/JS minified for production
- [ ] Lazy loading implemented
- [ ] Google PageSpeed score > 90

---

## 📞 Contact & Support

- 🌐 Website: [maxnate.com](https://maxnate.com)
- 📧 Email: [info@maxnate.com](mailto:info@maxnate.com)
- 📱 Phone: +255 746 662 612
- 📍 Location: Kisesa, Mwanza, Tanzania

### Development Team

- **Creative Director:** Dr. Godlove Mwalwisi
- **Digital Transformation Manager:** Rehema Njau
- **Market Intelligence Analyst:** Adam Mgaya

---

## 📜 License

© 2025 Maxnate Africa. All rights reserved.

This website and its content are proprietary to Maxnate Africa. Unauthorized use, reproduction, or distribution is prohibited.

---

## 🔄 Version History

### v2.0.0 (Current) - November 2025

- ✨ Complete redesign with professional software development focus
- 🎨 New brand-aligned color scheme and typography
- 📱 Enhanced mobile responsiveness
- 🚀 Improved performance and accessibility
- 📁 Reorganized folder structure
- 🛠️ Technology stack showcase section
- 💼 Expanded services section

### v1.0.0 - Previous

- Initial corporate website
- Basic services showcase
- Contact form integration

---

## 🤝 Contributing

For internal team members:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request with detailed description

---

## 🔗 Related Projects

- [Alamastudio](clients/alamastudio/) - Client website
- [Meemahs](clients/meemahs/) - Client website
- [Prografiks](clients/prografiks/) - Client website

---
 
## ☁️ Appwrite Hosting (Recommended)

For Appwrite Hosting, build two deployable folders and deploy them as separate Hosting instances in your Appwrite project.

1. Prepare `dist` folders

```powershell
./scripts/prepare-dist.ps1 -Clean
```

1. Deploy using Appwrite CLI

```powershell
appwrite login
appwrite client --endpoint https://cloud.appwrite.io/v1
appwrite client --project-id <PROJECT_ID>
appwrite push sites
```

See `deploy/appwrite/README.md` for details.

**Built with ❤️ by Maxnate Africa** | Innovating for a Smarter Future 🚀
