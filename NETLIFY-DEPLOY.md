# Netlify Deployment Guide

## Quick Setup

### 1. Deploy to Netlify

**Option A: Via Netlify UI**
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub: `Maxnate-Africa/website`
4. Build settings are auto-detected from `netlify.toml`:

   - **Build command**: `npm run build:content` (adjust to `npm run build` if you add bundling)
   - **Publish directory**: `.` (root — static HTML + generated JSON)
5. Click "Deploy site"

### Option B: Via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### 2. Enable Netlify Identity

1. In Netlify dashboard, go to your site
2. Click **"Site settings"** → **"Identity"**
3. Click **"Enable Identity"**
4. Under **"Registration preferences"**, select:
   - ✅ **Invite only** (recommended)
   - Or **Open** for public registration (not recommended for CMS)

### 3. Enable Git Gateway

1. Still in **Identity** settings
2. Scroll to **"Services"** section
3. Click **"Enable Git Gateway"**
4. This allows CMS to commit directly to GitHub

### 4. Invite Admin Users

1. Go to **"Identity"** tab
2. Click **"Invite users"**
3. Enter email addresses of CMS admins
4. They'll receive invitation emails

### 5. Access the CMS

1. Visit: `https://your-site.netlify.app/cms-admin/`
2. Click "Login with Netlify Identity"
3. Accept invitation email (first time only)
4. Set your password
5. You're in! Start editing content

## Custom Domain Setup

Once deployed, add your custom domain:

1. Go to **"Domain management"**
2. Click **"Add custom domain"**
3. Enter: `maxnate.com`
4. Update DNS at your domain provider:
   - Add NETLIFY DNS or
   - Point A record to Netlify's load balancer

## Workflow

### Edit Content

1. Visit `https://maxnate.com/cms-admin/`.
2. Login with Netlify Identity.
3. Create/edit news, projects, websites.
4. Click "Publish" → commits to GitHub.

### Auto-Deploy

1. Push or CMS publish commits to `main`.
2. Netlify detects change and runs `npm run build:content`.
3. Generated JSON written into `assets/data/*`.
4. Deploy is published; CDN invalidated (~10–40s).
5. If you introduce a bundler, switch build command and update `netlify.toml`.

### Redirect Behavior

The CMS is available only under `/cms-admin/` (see `netlify.toml`). Other routes serve the public site. This prevents accidental takeover of all paths by the admin interface.

### Local Development

```bash
# Install dependencies
npm install

# Run local CMS backend
npx decap-server   # optional local backend mock (if not using identity locally)

# Visit admin
http://localhost:3000/cms-admin/

# Build content
npm run build:content

# Serve locally
npx http-server -p 8080  # or any static server

### Identity & Git Gateway Checklist

| Step | Setting | Required |
|------|---------|----------|
| Enable Identity | Site Settings → Identity | Yes |
| Registration Pref | Invite Only | Recommended |
| Git Gateway | Identity → Services → Enable | Yes |
| Invite Users | Identity → Invite | Yes |
| Role-based Access | (Optional) Identity JWT roles | Optional |

### Environment Variables (Optional Future Expansion)

Add in Netlify UI → Site Settings → Build & Deploy → Environment:

| Variable | Purpose |
|----------|---------|
| `FLOATING_OFFER_BEACON_URL` | Endpoint for offer event beacon logging |
| `ANALYTICS_WRITE_KEY` | Future analytics integrations |
| `API_BASE_URL` | External API integrations |

### Hardening Recommendations

- Add `X-Robots-Tag: noindex` header (already applied) for `/cms-admin/*`.
- Enforce HTTPS (Netlify default).
- Enable form spam protection if adding forms.
- Consider Netlify Access (teams plan) for stricter admin gating.

### Future Scaling

- Move build to `npm run build` with asset optimization.
- Add deploy previews for PR branches (Netlify auto-detects).
- Introduce serverless functions (`netlify/functions/*`) for webhook/event logging.
```

## Troubleshooting

### Error loading config

- Check `cms-admin/config.yml` syntax.
- Ensure `backend: name: git-gateway` is set.

### Failed to load entries

- Verify Git Gateway is enabled.
- Check user has admin/write access in Identity.

### Authentication failed

- Disable browser extensions (ad blockers).
- Clear cookies and try again.
- Check invitation email was accepted.

### Content not updating

- Check Netlify build logs.
- Verify `npm run build` succeeds.
- Look for errors in deploy log.

## Benefits of Netlify + Decap CMS

✅ **One-click deploy** from GitHub  
✅ **Automatic HTTPS** and CDN  
✅ **Built-in authentication** (Netlify Identity)  
✅ **Form handling** and serverless functions  
✅ **Deploy previews** for branches  
✅ **Rollback** to any previous deploy  
✅ **Environment variables** for secrets  
✅ **Split testing** and A/B testing  

## Support

Resources:

- Netlify Docs: <https://docs.netlify.com/>
- Decap CMS Docs: <https://decapcms.org/docs/>
- Community: <https://answers.netlify.com/>
