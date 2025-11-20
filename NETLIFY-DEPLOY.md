# Netlify Deployment Guide

## Quick Setup

### 1. Deploy to Netlify

**Option A: Via Netlify UI**
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub: `Maxnate-Africa/website`
4. Build settings are auto-detected from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `.` (root)
5. Click "Deploy site"

**Option B: Via Netlify CLI**
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
1. Visit `https://maxnate.com/cms-admin/`
2. Login with Netlify Identity
3. Create/edit news, projects, websites
4. Click "Publish" → Commits to GitHub

### Auto-Deploy
1. CMS commits trigger Netlify build
2. `npm run build` generates JSON
3. Site updates in ~30 seconds

### Local Development
```bash
# Install dependencies
npm install

# Run local CMS backend
npx decap-server

# Visit admin
http://localhost:3000/cms-admin/

# Build content
npm run build:content

# Serve locally
npx http-server -p 8080
```

## Troubleshooting

**"Error loading config"**
- Check `cms-admin/config.yml` syntax
- Ensure `backend: name: git-gateway` is set

**"Failed to load entries"**
- Verify Git Gateway is enabled
- Check user has admin/write access in Identity

**"Authentication failed"**
- Disable browser extensions (ad blockers)
- Clear cookies and try again
- Check invitation email was accepted

**Content not updating**
- Check Netlify build logs
- Verify `npm run build` succeeds
- Look for errors in deploy log

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

- **Netlify Docs**: https://docs.netlify.com/
- **Decap CMS Docs**: https://decapcms.org/docs/
- **Community**: https://answers.netlify.com/
