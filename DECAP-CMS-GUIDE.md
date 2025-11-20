# Decap CMS Setup for Maxnate Website

## Overview

This project now uses **Decap CMS** (formerly Netlify CMS) for content management. Content is stored as markdown files in Git, eliminating the need for a database backend.

## Architecture

- **Content Storage**: Markdown files in `content/{collection}/`
- **Admin Interface**: `cms-admin/index.html` (Decap CMS UI)
- **Build Process**: `scripts/build-content.js` converts markdown → JSON
- **Public Site**: Reads JSON from `assets/data/`

## Directory Structure

```
content/
  ├── websites/          # Website definitions
  │   └── maxnate.md
  ├── news/              # News articles
  │   └── maxnate-2025-11-20-example.md
  └── projects/          # Portfolio projects
      └── maxnate-example.md

cms-admin/              # Decap CMS admin interface
  ├── index.html
  └── config.yml        # CMS configuration

assets/data/            # Generated JSON (build output)
  ├── websites.json
  ├── news.json
  └── projects.json

scripts/
  ├── build-content.js  # Markdown → JSON builder
  └── build-admin.js    # Admin dist builder
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Content

```bash
npm run build:content
```

This reads markdown files and generates JSON in `assets/data/`.

### 3. Access Admin Panel

**Local Development:**
1. Edit `cms-admin/config.yml` and uncomment `local_backend: true`
2. Run: `npx decap-server`
3. Visit: `http://localhost:3000/cms-admin/`

**Production (via GitHub):**
1. Visit: `https://yourdomain.com/cms-admin/`
2. Authenticate with GitHub OAuth
3. Create/edit content directly

### 4. GitHub OAuth Setup

For production admin access:

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App:
   - **Application name**: Maxnate CMS
   - **Homepage URL**: `https://maxnate.com`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
3. Note your Client ID and Client Secret
4. Configure in Netlify or your hosting provider

## Content Types

### Websites
- Slug, Name, Domain, URL, Theme
- Relation target for News/Projects

### News
- Title, Description, Status, Category, Badge
- Date, Link Text, Image
- Related to Website

### Projects
- Title, Description, Status, Category
- Client, Project URL, Year, Image
- Related to Website

## Workflow

1. **Edit Content**: Use CMS admin at `/cms-admin/`
2. **Commit**: Decap commits changes to Git
3. **Build**: CI/CD runs `npm run build`
4. **Deploy**: Static files served

## Multi-Tenant Support

Each content item has a `website` field referencing a website slug. The public site filters content by `website: 'maxnate'`.

To add a new website:
1. Create `content/websites/{slug}.md`
2. Reference it in news/projects with `website: {slug}`
3. Build and deploy

## Migration from Appwrite

Old Appwrite content has been migrated to markdown files. The public site now reads JSON instead of calling Appwrite APIs.

## Build Scripts

- `npm run build` - Build content + admin dist
- `npm run build:content` - Convert markdown to JSON
- `npm run build:admin` - Copy admin files to dist
- `npm run dev` - Build and serve locally

## Deployment

### GitHub Pages
Already configured. Just push to `main` branch.

### Vercel
Update `vercel.json` build command:
```json
{
  "buildCommand": "npm run build"
}
```

### Netlify
Add to `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "."
```

## Advantages Over Appwrite

✅ No database to manage  
✅ Content versioned in Git  
✅ No rate limits or schema friction  
✅ Instant rollback via Git history  
✅ Works offline (local markdown editing)  
✅ Zero backend infrastructure cost  

## Support

- **Decap CMS Docs**: https://decapcms.org/docs/
- **GitHub**: https://github.com/Maxnate-Africa/website
