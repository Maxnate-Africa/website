# Hybrid Deployment: GitHub Pages + Netlify CMS

## Architecture Overview

```
┌─────────────────────┐
│  Public Visitors    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│   GitHub Pages              │
│   https://maxnate.com       │
│   - Serves public site      │
│   - Reads assets/data/*.json│
│   - Auto-deploys from main  │
└─────────────────────────────┘
           ▲
           │ (commits)
           │
┌─────────────────────────────┐
│   GitHub Repository         │
│   Maxnate-Africa/website    │
│   - Single source of truth  │
│   - Stores content/ markdown│
│   - Stores built JSON       │
└─────────────────────────────┘
           ▲
           │ (commits via Git Gateway)
           │
┌─────────────────────────────┐
│   Content Admins            │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   Netlify CMS Admin         │
│   https://cms.maxnate.com   │
│   - Netlify Identity auth   │
│   - Decap CMS interface     │
│   - Commits to GitHub       │
└─────────────────────────────┘
```

## Benefits

✅ **GitHub Pages (Public Site)**
- Free static hosting
- Fast CDN (GitHub's infrastructure)
- Custom domain support
- HTTPS automatically
- No build needed (JSON already committed)

✅ **Netlify (CMS Only)**
- Netlify Identity authentication
- Git Gateway integration
- Secure admin access
- Free tier sufficient for CMS
- Better CMS support than GitHub

✅ **Combined Advantages**
- Zero infrastructure cost
- Separate concerns (public vs admin)
- Each platform does what it's best at
- No vendor lock-in
- Easy rollback via Git

## Setup Instructions

### 1. GitHub Pages (Already Done)

Your public site is already live at:
- `https://maxnate-africa.github.io/website/`
- Custom domain: `https://maxnate.com` (via CNAME)

**If using automated build + hashing:** Enable workflow `.github/workflows/deploy-pages.yml` which:

```yaml
SKIP_ADMIN=1 npm run build
```

This excludes `cms-admin` from the public artifact to keep admin isolated on Netlify.

If you need the CMS available under the same domain (NOT recommended for separation), remove `SKIP_ADMIN=1`.

### 2. Deploy CMS to Netlify

**Step 1: Create Netlify Site**
```bash
# Option A: Netlify UI
# 1. Go to https://app.netlify.com/
# 2. "Add new site" → Import from GitHub
# 3. Select: Maxnate-Africa/website
# 4. Build settings auto-detected from netlify.toml
# 5. Deploy!

# Option B: Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**Step 2: Configure Custom Domain for CMS**
1. In Netlify dashboard → Domain settings
2. Add custom domain: `cms.maxnate.com` (or any subdomain)
3. Update DNS at your domain provider:
   ```
   Type: CNAME
   Name: cms
   Value: your-site.netlify.app
   ```

**Step 3: Enable Netlify Identity**
1. Site settings → Identity → Enable Identity
2. Registration: **Invite only**
3. Services → Enable Git Gateway

**Step 4: Invite Admin Users**
1. Identity tab → Invite users
2. Enter admin email addresses
3. They receive invitation emails

### 3. Workflow

**For Content Editors:**
1. Visit `https://cms.maxnate.com/cms-admin/`
2. Login with Netlify Identity
3. Edit content in CMS
4. Click "Publish"

**What Happens Behind the Scenes:**
1. CMS commits markdown to GitHub (via Git Gateway)
2. GitHub Actions runs `npm run build:content`
3. Generates updated JSON files
4. Commits JSON back to repo
5. GitHub Pages auto-deploys updated site
6. Public site updates in ~30 seconds

### 4. GitHub Actions Setup

Create `.github/workflows/build-content.yml`:
### 5. Dual Deployment Workflow

| Layer | Build Command | Target | Includes CMS? | Notes |
|-------|---------------|--------|---------------|-------|
| GitHub Pages | `SKIP_ADMIN=1 npm run build` | gh-pages (managed by Deploy Pages action) | No | Fast static delivery, hashed assets |
| Netlify CMS | `npm run build` (Netlify) | Netlify site | Yes | Identity + Git Gateway |

### 6. Linking CMS from Public Site

To avoid broken links, do **NOT** link to `/cms-admin/` on GitHub Pages. Instead provide a direct admin URL: `https://cms.maxnate.com/cms-admin/` to authorized users only (e.g. via email or internal docs). Keep hidden from public navigation to reduce crawl & attack surface.

### 7. Environment Variable Options

| Variable | Purpose | Where |
|----------|---------|-------|
| `SKIP_ADMIN=1` | Skip copying CMS admin for Pages build | GitHub Actions |
| `BUILD_OUTPUT_DIR` | Content JSON output path | Content build script |
| `ASSETS_ROOT` | Asset minification target | Minify script |

### 8. Hardening Checklist

- Ensure `robots.txt` disallows `/cms-admin/` (already configured in Netlify headers)
- Use invite-only Netlify Identity
- Rotate Identity tokens periodically
- Monitor Netlify function logs for analytics anomalies
- Set branch protection on `main` (require status checks, signed commits optional)

### 9. Rollback Procedure

GitHub Pages: revert commit or redeploy earlier SHA via `workflow_dispatch` → build artifact.

Netlify CMS: revert repo state; Netlify will redeploy automatically on push.

### 10. Future Enhancements

- Add Lighthouse CI report in GitHub Actions
- Add security headers (CSP, Permissions-Policy) via Netlify + GitHub Pages (using `_headers` file or meta tags)
- Introduce delta content builds to reduce action minutes.

```yaml
name: Build Content

on:
  push:
    branches: [main]
    paths:
      - 'content/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build:content
      
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'Auto-build: Update JSON data'
          file_pattern: 'assets/data/*.json'
```

This ensures JSON is always rebuilt when markdown changes.

## Cost Comparison

| Service | Public Site | CMS Admin | Total |
|---------|-------------|-----------|-------|
| GitHub Pages | Free | - | $0 |
| Netlify | - | Free tier | $0 |
| **Total** | | | **$0/month** |

## Alternative: All on Netlify

If you prefer everything on Netlify:

**Pros:**
- Single deployment platform
- Easier DNS management
- One dashboard

**Cons:**
- Monthly build minutes limit (300/month free)
- Bandwidth limit (100GB/month free)
- GitHub Pages has better uptime for static sites

**Recommendation:** 
Use the hybrid approach for best performance and reliability. GitHub Pages is excellent for static content, Netlify excels at CMS authentication.

## URLs After Setup

- **Public Site**: `https://maxnate.com` (GitHub Pages)
- **CMS Admin**: `https://cms.maxnate.com` (Netlify)
- **Repository**: `https://github.com/Maxnate-Africa/website`

## Troubleshooting

**JSON not updating on public site:**
- Ensure GitHub Actions workflow is enabled
- Check workflow runs in GitHub Actions tab
- Verify JSON files are committed after content changes

**CMS can't commit:**
- Check Git Gateway is enabled in Netlify
- Verify user has admin privileges
- Check repository permissions

**Authentication issues:**
- Clear browser cookies
- Try incognito mode
- Check Netlify Identity is enabled
- Verify invitation email was accepted

## Support

- GitHub Pages: https://docs.github.com/pages
- Netlify CMS: https://decapcms.org/docs/
- Netlify Identity: https://docs.netlify.com/identity/
