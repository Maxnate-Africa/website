# Appwrite Hosting Deployment

This project has two static apps:

- Website (public site): project root
- Admin (CMS PWA): `admin/`

Use Appwrite Hosting to deploy them as two hosting instances (two sites) under the same Appwrite project.

## Prerequisites

- Appwrite Cloud project ready
- Appwrite CLI installed
- Custom domains (optional): `maxnate.com` (website), `admin.maxnate.com` (CMS)

## Prepare build folders

Run the script to produce a clean `dist/` for both apps:

```powershell
# From repo root (Windows PowerShell 5.1)
./scripts/prepare-dist.ps1 -Clean
```

This creates:

- `dist/website` — static assets for the public site
- `dist/admin` — static assets for the CMS

## Create Hosting instances (one-time)

In the Appwrite Console → Your Project → Hosting:

- Create Hosting "Website" with publish directory `dist/website`
- Create Hosting "Admin" with publish directory `dist/admin`
- Add custom domains if desired

Alternatively using CLI:

```powershell
# Log in (opens browser for OAuth)
appwrite login

# Set project
appwrite client --endpoint https://cloud.appwrite.io/v1
appwrite client --project-id <PROJECT_ID>

# Push both sites (defined in appwrite.json)
appwrite push sites
```

The `appwrite.json` file defines your hosting targets. It should already exist in the repo root with both "website" and "admin" configured.

Notes:

- The first push creates the hosting instances automatically.
- Later pushes will update the existing deployments.

## CORS & Security

- Add both origins (website and admin domains) to Appwrite CORS settings
- Admin uses Appwrite Auth; ensure correct redirect URLs are configured if using OAuth
- Storage rules: public read; writes restricted to Admin Team (as implemented in admin)

## Updating

After any changes:

```powershell
./scripts/prepare-dist.ps1
appwrite deploy hosting --path "dist/website"
appwrite deploy hosting --path "dist/admin"
```

## Troubleshooting

- If paths resolve incorrectly in Admin after deploy, confirm the site is served from `/` and not a sub-path. All links in Admin are relative to `admin/` root which is preserved in `dist/admin`.
- If images don’t load on the public site, verify files exist in `dist/website/assets/images/` and the case-sensitive paths match.
