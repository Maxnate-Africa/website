# Vercel Deployment Guide (Admin CMS)

Deploy the Admin CMS to Vercel using the `dist/admin` folder.

## Prerequisites
- Vercel account (free): https://vercel.com/signup
- GitHub repository connected

## Deployment Steps

### Option 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
```powershell
npm install -g vercel
```

2. Login:
```powershell
vercel login
```

3. Build dist:
```powershell
./scripts/prepare-dist.ps1 -Clean
```

4. Deploy admin:
```powershell
cd dist/admin
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Framework Preset**: Other
4. **Root Directory**: Leave as root (vercel.json handles it)
5. **Build Command**: `pwsh -c './scripts/prepare-dist.ps1 -Clean'`
6. **Output Directory**: `dist/admin`
7. Click **Deploy**

## Post-Deployment

### 1. Get your Vercel URL
Example: `https://your-project.vercel.app` or `https://admin-yourdomain.vercel.app`

### 2. Update Appwrite CORS
In Appwrite Console → Your Project → Settings → Platforms:
- Add your Vercel domain: `https://your-project.vercel.app`
- Add custom domain if you set one: `https://admin.maxnate.com`

### 3. Update OAuth Redirects (if applicable)
If using OAuth login, add redirect URLs in Appwrite → Auth → Settings

### 4. Set Custom Domain (Optional)
In Vercel Dashboard → Project → Settings → Domains:
- Add `admin.maxnate.com`
- Follow DNS instructions

## Environment Variables (if needed)
Add in Vercel Dashboard → Project → Settings → Environment Variables:
- None needed for now (config is in `admin/js/appwrite-config.js`)

## Auto-Deploy
Vercel auto-deploys on push to `main` branch.

## Troubleshooting

**Issue**: Admin loads but can't connect to Appwrite
- **Fix**: Check CORS settings in Appwrite include your Vercel URL

**Issue**: 404 on routes
- **Fix**: Ensure `vercel.json` rewrites are set correctly (already configured)

**Issue**: Build fails
- **Fix**: Ensure PowerShell is available in Vercel build environment (it is by default)
