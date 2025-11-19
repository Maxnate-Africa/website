// Admin Appwrite config (no secrets); requires public rules for allowed operations
// For production, prefer session-based auth and restrict permissions to authenticated roles.
window.APPWRITE_ADMIN = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "691de2b2000699d6898f",
  databaseId: "website_db",
  websitesCollectionId: "websites",
  projectsCollectionId: "projects",
  newsCollectionId: "news",
  bucketId: "uploads",
  adminsTeamId: "" // Fill this after creating the admin team
};
