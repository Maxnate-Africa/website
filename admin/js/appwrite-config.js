// Admin Appwrite config (no secrets); requires public rules for allowed operations
// For production, prefer session-based auth and restrict permissions to authenticated roles.
window.APPWRITE_ADMIN = {
  endpoint: "", // e.g. https://cloud.appwrite.io/v1
  projectId: "", // e.g. maxnate
  databaseId: "", // e.g. website_db
  websitesCollectionId: "", // e.g. websites
  projectsCollectionId: "", // e.g. projects
  newsCollectionId: "", // e.g. news
  bucketId: "", // e.g. uploads
  adminsTeamId: "" // e.g. team ID for CMS admins
};
