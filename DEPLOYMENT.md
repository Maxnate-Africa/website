# Deployment Guide

This project uses a **dual deployment** strategy:

## 🌐 Main Website → GitHub Pages
- **URL**: `https://maxnate-africa.github.io/website/` (or custom domain)
- **Content**: Public-facing website (HTML, CSS, JS, images)
- **Build**: Automated via GitHub Actions on push to `main`
- **Excludes**: CMS admin interface

## 🔐 CMS Admin → Netlify
- **URL**: Your Netlify subdomain (e.g., `maxnate-cms.netlify.app`)
- **Content**: Decap CMS admin interface only
- **Authentication**: Netlify Identity
- **Build**: Automatic deployment from `cms-admin/` folder

---

## Setup Instructions

### 1. GitHub Pages (Main Website)

**Automatic Setup:**
- Push to `main` branch triggers deployment
- GitHub Actions workflow builds the site
- Deploys to GitHub Pages automatically

**Configuration:**
1. Go to repository Settings → Pages
2. Source: "GitHub Actions"
3. The workflow will build and deploy automatically

**Custom Domain (Optional):**
1. Add `CNAME` file with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings

### 2. Netlify (CMS Only)

**Initial Setup:**
1. Connect your repository to Netlify
2. Configure build settings:
   - **Build command**: `npm install`
   - **Publish directory**: `cms-admin`
   - **Branch**: `main`

**Enable Authentication:**
1. Go to Netlify dashboard → Identity
2. Enable Identity service
3. Set registration to "Invite only"
4. Configure external providers (optional: Google, GitHub, etc.)
5. Enable Git Gateway in Identity settings

**Invite Users:**
1. Go to Identity tab in Netlify
2. Click "Invite users"
3. Send invite emails to content editors
4. Users will receive email to set password

**Environment Variables (Optional):**
- None required for basic setup
- Add custom variables in Netlify dashboard if needed

---

## Local Development

### Main Website
```bash
# Install dependencies
npm install

# Build content from markdown files
npm run build:content

# Start local server
npm run dev

# Open http://localhost:8080
```

### CMS Admin
```bash
# Start CMS local server
npm run dev:cms

# Open http://localhost:8081
# Note: Netlify Identity won't work locally
# Deploy to Netlify for full authentication
```

---

## Build Commands

### Full Build (GitHub Pages)
```bash
# Build website without CMS
SKIP_ADMIN=1 npm run build

# Output: dist/ folder
```

### CMS Only (Netlify)
```bash
# CMS deploys directly from cms-admin/
# No build step needed on Netlify
```

---

## Content Workflow

### For Content Editors:
1. Go to your Netlify CMS URL (e.g., `maxnate-cms.netlify.app`)
2. Login with credentials (Netlify Identity)
3. Create/edit content through the CMS interface
4. Click "Publish" - commits to GitHub
5. GitHub Actions rebuilds main website automatically

### File Structure:
```
content/
├── news/          # Blog posts & news articles
├── offers/        # Special offers & promotions
├── projects/      # Project showcase
├── services/      # Service descriptions
└── settings/      # Site configuration
```

---

## Deployment Flow

```
Content Editor
     ↓
Netlify CMS (authentication)
     ↓
Commit to GitHub (content/*.md)
     ↓
GitHub Actions triggered
     ↓
Build website (npm run build)
     ↓
Deploy to GitHub Pages
```

---

## URLs

### Production
- **Main Website**: `https://maxnate-africa.github.io/website/`
- **CMS Admin**: `https://your-site.netlify.app/`

### Local Development
- **Main Website**: `http://localhost:8080`
- **CMS Admin**: `http://localhost:8081`

---

## Troubleshooting

### CMS Authentication Issues
- Ensure Netlify Identity is enabled
- Check Git Gateway is configured
- Verify invited users have accepted invites
- Clear browser cache and try again

### Build Failures
- Check GitHub Actions logs
- Verify all dependencies in package.json
- Ensure markdown frontmatter is valid YAML
- Check for syntax errors in content files

### Content Not Updating
- Wait 2-3 minutes for GitHub Actions to complete
- Check Actions tab for build status
- Clear browser cache
- Verify content was committed to GitHub

---

## Security Notes

- ✓ CMS has `X-Robots-Tag: noindex` (not indexed by search engines)
- ✓ Authentication required for CMS access
- ✓ Main website is public and SEO-optimized
- ✓ Content stored in Git (version control + backup)
- ✓ HTTPS enforced on both deployments

---

## Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Backup
- Content is in Git (automatic backup)
- Clone repository for local backup
- Export Netlify Identity users if needed

---

## Support

For issues or questions:
1. Check GitHub Issues
2. Review GitHub Actions logs
3. Check Netlify deployment logs
4. Consult Decap CMS documentation
