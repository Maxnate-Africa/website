# Maxnate Africa Website

Modern, content-managed website with dual deployment architecture.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build and run locally
npm run dev
# Open http://localhost:8080

# Test CMS locally
npm run dev:cms
# Open http://localhost:8081
```

## 🏗️ Architecture

### Dual Deployment Strategy
- **Main Website** → GitHub Pages (public site)
- **CMS Admin** → Netlify (authenticated content management)

### Technology Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **CMS**: Decap CMS (formerly Netlify CMS)
- **Authentication**: Netlify Identity
- **Deployment**: GitHub Actions + Netlify
- **Content**: Markdown files with YAML frontmatter

## 📁 Project Structure

```
.
├── assets/              # CSS, JS, images
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript
│   ├── images/         # Static images
│   └── data/           # Generated JSON from markdown
├── cms-admin/          # CMS interface (Netlify)
│   ├── config.yml      # CMS configuration
│   └── index.html      # CMS entry point
├── content/            # Markdown content
│   ├── news/          # Blog posts
│   ├── offers/        # Promotions
│   ├── projects/      # Portfolio
│   ├── services/      # Service pages
│   └── settings/      # Site config
├── pages/             # Additional HTML pages
├── scripts/           # Build scripts
├── dist/              # Build output (generated)
└── netlify.toml       # Netlify config
```

## 🛠️ Development

### Build Commands
```bash
# Full website build
npm run build

# Build content only (markdown → JSON)
npm run build:content

# Build CMS admin
npm run build:admin
```

### Environment Variables
```bash
# Skip CMS in build (for GitHub Pages)
SKIP_ADMIN=1 npm run build
```

## 📝 Content Management

### Adding Content
1. Go to your Netlify CMS URL
2. Login with Netlify Identity
3. Create/edit content in the CMS
4. Publish changes (commits to GitHub)
5. GitHub Actions rebuilds the site

### Content Types
- **News**: Blog posts and announcements
- **Offers**: Promotions and special deals
- **Projects**: Portfolio showcase
- **Services**: Service descriptions
- **Settings**: Global site configuration

## 🚢 Deployment

### GitHub Pages (Automatic)
- Triggered on push to `main` branch
- Builds in GitHub Actions
- Deploys to GitHub Pages
- Excludes CMS admin interface

### Netlify (Automatic)
- Monitors `cms-admin/` folder
- Deploys CMS interface only
- Enables Netlify Identity authentication
- No build step required

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

## 🔒 Security

- ✓ CMS protected by Netlify Identity
- ✓ Invite-only user registration
- ✓ HTTPS enforced on all deployments
- ✓ Content versioned in Git
- ✓ No sensitive data in repository

## 📄 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [DECAP-CMS-GUIDE.md](DECAP-CMS-GUIDE.md) - CMS setup and usage
- [HYBRID-DEPLOYMENT.md](HYBRID-DEPLOYMENT.md) - Architecture details

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check [GitHub Issues](../../issues)
- Review documentation
- Contact development team

## 📜 License

Proprietary - Maxnate Africa

---

**Built with ❤️ by Maxnate Africa**
