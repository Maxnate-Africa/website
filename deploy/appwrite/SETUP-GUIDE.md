# Appwrite Setup Guide

Complete guide to configure your Appwrite backend for Maxnate Africa website.

## Prerequisites

- Appwrite Cloud account
- Project ID: `691de2b2000699d6898f`
- Console URL: <https://cloud.appwrite.io/console>

## Step 1: Add Platform URLs (CORS)

**Note:** You are looking for the **"Platforms"** section, not "Custom Domains".

1. Go to <https://cloud.appwrite.io/console>
2. Select your project (Maxnate Africa)
3. Click on **"Overview"** in the left sidebar (the top item)
4. Look for the **"Platforms"** section on the main dashboard page
5. Click the **"Add Platform"** button
6. Select **"Web"** (if asked for a framework, choose **"Web"**, **"HTML"**, or **"Vanilla JS"**)
7. Add these three platforms (you'll need to do this 3 times):

## Step 2: Create Database

1. Go to **Databases** → **Create Database**
2. Database ID: `website_db`
3. Name: `Website Database`

## Step 3: Create Collections

### Collection 1: News Articles

**Collection Settings:**
- Collection ID: `news`
- Name: `News`
- Permissions:
  - Read: `Any`
  - Create: `Team:admins` (we'll create this team next)
  - Update: `Team:admins`
  - Delete: `Team:admins`

**Attributes:**
```
- title (string, 200, required)
- slug (string, 200, required, unique)
- excerpt (string, 500, required)
- content (string, 65535, required)
- featuredImage (string, 500, required) - Appwrite file ID
- author (string, 100, required)
- publishedAt (datetime, required)
- category (string, 50)
- tags (string, 500) - comma-separated
- isPublished (boolean, default: false)
```

**Indexes:**
- `slug_unique` on `slug` (unique)
- `published_date` on `publishedAt` (desc)

---

### Collection 2: Projects

**Collection Settings:**
- Collection ID: `projects`
- Name: `Projects`
- Permissions: Same as News

**Attributes:**
```
- title (string, 200, required)
- slug (string, 200, required, unique)
- description (string, 1000, required)
- clientName (string, 100)
- projectUrl (string, 500)
- featuredImage (string, 500, required) - Appwrite file ID
- gallery (string, 5000) - JSON array of file IDs
- technologies (string, 500) - comma-separated
- category (string, 50, required) - e.g., "web", "mobile", "branding"
- completedAt (datetime)
- isFeatured (boolean, default: false)
- isPublished (boolean, default: false)
```

**Indexes:**
- `slug_unique` on `slug` (unique)
- `category_idx` on `category`

---

### Collection 3: Offers

**Collection Settings:**
- Collection ID: `offers`
- Name: `Offers`
- Permissions: Same as News

**Attributes:**
```
- title (string, 200, required)
- description (string, 1000, required)
- price (string, 50)
- features (string, 5000) - JSON array of features
- icon (string, 100) - icon name or class
- isActive (boolean, default: true)
- displayOrder (integer, default: 0)
```

**Indexes:**
- `display_order` on `displayOrder` (asc)

---

### Collection 4: Websites (Client Portfolio)

**Collection Settings:**
- Collection ID: `websites`
- Name: `Client Websites`
- Permissions: Same as News

**Attributes:**
```
- name (string, 200, required)
- url (string, 500, required)
- screenshot (string, 500) - Appwrite file ID
- clientName (string, 100)
- category (string, 50)
- technologies (string, 500)
- description (string, 1000)
- launchedAt (datetime)
- isActive (boolean, default: true)
```

## Step 4: Create Storage Bucket

1. Go to **Storage** → **Create Bucket**
2. Bucket ID: `uploads`
3. Name: `Uploads`
4. Permissions:
   - Read: `Any`
   - Create: `Team:admins`
   - Update: `Team:admins`
   - Delete: `Team:admins`
5. File Security: Enable
6. Maximum File Size: `10MB` (or as needed)
7. Allowed File Extensions: `jpg, jpeg, png, gif, webp, svg, pdf`
8. Compression: `gzip` (optional)
9. Encryption: Enable (recommended)
10. Antivirus: Enable (if available)

## Step 5: Create Admin Team

1. Go to **Auth** → **Teams** → **Create Team**
2. Team Name: `CMS Admins`
3. After creation, note the **Team ID** (you'll need this)
4. Add team members:
   - Go to the team → **Add Member**
   - Enter email addresses of admin users
   - They'll receive invitations to join

## Step 6: Update Admin Config with Team ID

After creating the team, copy its ID and update:

**File:** `admin/js/appwrite-config.js`

```javascript
adminsTeamId: "YOUR_TEAM_ID_HERE"
```

Then commit and push:
```bash
git add admin/js/appwrite-config.js
git commit -m "Add Appwrite admin team ID"
git push
```

## Step 7: Test the Setup

### Test Public Website
1. Visit: https://maxnate-africa.github.io/website/
2. Open browser console (F12)
3. Check for Appwrite connection errors
4. Try loading news/projects (should show empty or data if you added any)

### Test Admin CMS
1. Visit: https://website-orpin-omega-56.vercel.app/
2. Click "Sign In"
3. Create an account or sign in
4. You should see the admin dashboard
5. Try uploading an image to test storage
6. Try creating a news article

## Step 8: Add Sample Data (Optional)

You can add sample data via the Appwrite Console:

1. Go to **Databases** → `website_db` → Collection
2. Click **Add Document**
3. Fill in the attributes
4. For images, upload to Storage first and use the file ID

## Security Best Practices

✅ **What's configured:**
- Team-based permissions for admin operations
- Public read access for website content
- CORS restricted to your domains
- File security enabled on bucket

⚠️ **Additional recommendations:**
- Enable 2FA for admin accounts
- Regularly review team members
- Set up rate limits in Appwrite settings
- Monitor usage in Appwrite dashboard
- Consider adding IP restrictions if available

## Troubleshooting

### CORS Errors
- Ensure all platform URLs are added without `https://` protocol
- Check that hostnames match exactly (no trailing slashes)

### Permission Errors
- Verify team permissions are set on collections
- Ensure user is a member of `CMS Admins` team
- Check that `adminsTeamId` is correct in config

### Storage Upload Fails
- Check file size limits
- Verify file extension is allowed
- Ensure user has create permission on bucket

### Cannot Create Documents
- Verify collection permissions include `Team:admins`
- Ensure user is authenticated and in admin team
- Check attribute requirements (required fields)

## Next Steps

1. ✅ Configure platforms (CORS)
2. ✅ Create database and collections
3. ✅ Set up storage bucket
4. ✅ Create admin team
5. ⬜ Add team ID to config
6. ⬜ Invite team members
7. ⬜ Test authentication
8. ⬜ Add sample content
9. ⬜ Launch! 🚀

## Support

- Appwrite Docs: <https://appwrite.io/docs>
- Appwrite Discord: <https://appwrite.io/discord>
- Project Console: <https://cloud.appwrite.io/console>
