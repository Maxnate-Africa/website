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
  - Create: `Team:admins` (Team ID: 691ebb420001973a90a4)
  - Update: `Team:admins`
  - Delete: `Team:admins`

**Attributes:**
```
- title (string, 200, required)
- description (string, 1000, required)
- status (string, 50, default: "draft")
- category (string, 100)
- badge (string, 50)
- date (datetime, required)
- linkText (string, 100)
- image (string, 500)
- websiteId (string, 100, required)
- createdAt (datetime, required)
- updatedAt (datetime)
```

**Indexes:**
- `website_status` on `websiteId` and `status`
- `date_desc` on `date` (desc)

---

### Collection 2: Projects

**Collection Settings:**
- Collection ID: `projects`
- Name: `Projects`
- Permissions: Same as News

**Attributes:**
```
- title (string, 200, required)
- description (string, 1000, required)
- status (string, 50, default: "draft")
- category (string, 100)
- client (string, 200)
- projectUrl (string, 500)
- year (string, 4)
- image (string, 500)
- websiteId (string, 100, required)
- createdAt (datetime, required)
- updatedAt (datetime)
```

**Indexes:**
- `website_status` on `websiteId` and `status`
- `category_idx` on `category`

---

### Collection 3: Websites (Multi-Tenant Management)

**Collection Settings:**
- Collection ID: `websites`
- Name: `Websites`
- Permissions: Same as News

**Attributes:**
```
- name (string, 200, required)
- slug (string, 100) - URL-friendly identifier (optional, uses $id if empty)
- domain (string, 200)
- url (string, 500)
- settings (string, 5000) - JSON settings object
- createdAt (datetime)
- updatedAt (datetime)
```

**Indexes:**
- `name_idx` on `name`

**Create Your First Website:**
After creating the collection, add a document:
```
name: Maxnate Africa
slug: maxnate
domain: maxnate.com
url: https://maxnate.com
createdAt: (today's date)
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
3. After creation, note the **Team ID**
   - Your Team ID: `691ebb420001973a90a4`
4. Add team members:
   - Go to the team → **Add Member**
   - Enter email addresses of admin users
   - They'll receive invitations to join
5. **Important:** Members of this team are **Super Admins** with full access to ALL websites in the CMS

## Step 6: Create User-Website Access Collection (Multi-Tenant Support)

This collection allows you to assign specific websites to users, enabling you to manage multiple client websites with different users having access to only their assigned sites.

**Collection Settings:**
- Collection ID: `user_website_access`
- Name: `User Website Access`
- Permissions:
  - Read: `Users` (authenticated users can read their own access)
  - Create: `Team:admins` (only admins can assign access)
  - Update: `Team:admins`
  - Delete: `Team:admins`

**Attributes:**
```
- userId (string, 100, required) - User's Appwrite user ID
- userEmail (string, 200, required) - For easy reference
- websiteId (string, 100, required) - Website slug
- role (string, 50, default: "editor") - "editor" or "viewer"
- createdAt (datetime, required)
- createdBy (string, 100) - Admin who granted access
```

**Indexes:**
- `user_website` on `userId` and `websiteId` (unique)
- `user_idx` on `userId`

**Special Users:**
- Users who are members of the `CMS Admins` team are **Super Admins** and automatically have access to ALL websites
- Other users only see websites they've been explicitly granted access to

## Step 7: Verify Admin Config

The configuration has been pre-set for your project:

**File:** `admin/js/appwrite-config.js`

```javascript
projectId: "691de2b2000699d6898f",
adminsTeamId: "691ebb420001973a90a4",
userWebsiteAccessCollectionId: "user_website_access",
databaseId: "website_db",
newsCollectionId: "news",
projectsCollectionId: "projects",
websitesCollectionId: "websites"
```

✅ Configuration is already complete and pushed to GitHub/Vercel.

## Step 8: Test the Setup

### Test Admin CMS

1. Visit: <https://website-orpin-omega-56.vercel.app/>
2. Click "Sign In"
3. Sign in with your admin account
4. Accept the team invitation email if you haven't already
5. You should see the admin dashboard with all sections:
   - Projects
   - News
   - Websites (manage multiple sites)
   - Users (assign website access to users)
   - Settings
6. Test creating content in each section

### Test Public Website

1. Visit: <https://maxnate-africa.github.io/website/>
2. Open browser console (F12)
3. Check for Appwrite connection errors
4. News and projects should load from Appwrite

## Step 9: Add Sample Data (Optional)

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
3. ✅ Create admin team (ID: 691ebb420001973a90a4)
4. ✅ Update config files
5. ✅ Create first website document
6. ⬜ Set up storage bucket (optional)
7. ⬜ Create `user_website_access` collection (for multi-tenant access control)
8. ⬜ Invite additional team members
9. ⬜ Add sample content (news, projects)
10. ⬜ Launch! 🚀

## Support

- Appwrite Docs: <https://appwrite.io/docs>
- Appwrite Discord: <https://appwrite.io/discord>
- Project Console: <https://cloud.appwrite.io/console>
