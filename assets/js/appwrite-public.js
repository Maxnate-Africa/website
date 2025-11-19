(function(){
  'use strict';

  if (!window.Appwrite) {
    window.AppwriteFetch = { init: () => false };
    return;
  }

  function isConfigured(cfg){
    return cfg && cfg.endpoint && cfg.projectId && cfg.databaseId;
  }

  function createClient(cfg){
    const client = new window.Appwrite.Client();
    client.setEndpoint(cfg.endpoint).setProject(cfg.projectId);
    return {
      client,
      databases: new window.Appwrite.Databases(client),
      storage: new window.Appwrite.Storage(client),
      query: window.Appwrite.Query
    };
  }

  async function listDocumentsSafe(databases, databaseId, collectionId, queries){
    if (!collectionId) return { documents: [] };
    return databases.listDocuments(databaseId, collectionId, queries);
  }

  async function fetchOffers(cfg, limit=12){
    const { databases, query } = createClient(cfg);
    try {
      const res = await listDocumentsSafe(
        databases,
        cfg.databaseId,
        cfg.offersCollectionId,
        [query.equal('status','published'), query.orderDesc('$createdAt'), query.limit(limit)]
      );
      const docs = res.documents || [];
      return docs.map(d => ({
        id: d.$id,
        title: d.title || '',
        description: d.description || '',
        discount: d.discount || d.value || '',
        value: d.value || '',
        expiry: d.expiry || null,
        status: d.status || 'draft',
        createdAt: d.$createdAt
      }));
    } catch (err){ console.error('Appwrite fetchOffers error', err); return []; }
  }

  async function fetchProjects(cfg, limit=6){
    const { databases, query } = createClient(cfg);
    try {
      const res = await listDocumentsSafe(
        databases,
        cfg.databaseId,
        cfg.projectsCollectionId,
        [query.equal('status','published'), query.orderDesc('$createdAt'), query.limit(limit)]
      );
      const docs = res.documents || [];
      return docs.map(d => ({
        id: d.$id,
        title: d.title || '',
        description: d.description || '',
        category: d.category || '',
        client: d.client || '',
        projectUrl: d.projectUrl || '',
        year: d.year || '',
        image: d.image || ''
      }));
    } catch(err){ console.error('Appwrite fetchProjects error', err); return []; }
  }

  async function fetchNews(cfg, limit=6){
    const { databases, query } = createClient(cfg);
    try {
      const res = await listDocumentsSafe(
        databases,
        cfg.databaseId,
        cfg.newsCollectionId,
        [query.equal('status','published'), query.orderDesc('date'), query.limit(limit)]
      );
      const docs = res.documents || [];
      return docs.map(d => ({
        id: d.$id,
        title: d.title || '',
        description: d.description || '',
        badge: d.badge || '',
        category: d.category || '',
        date: d.date || d.$createdAt,
        linkText: d.linkText || 'Learn More →',
        image: d.image || ''
      }));
    } catch(err){ console.error('Appwrite fetchNews error', err); return []; }
  }

  window.AppwriteFetch = {
    init: function(){
      const cfg = window.APPWRITE_PUBLIC || {};
      return isConfigured(cfg);
    },
    getOffers: function(limit){
      const cfg = window.APPWRITE_PUBLIC || {};
      if (!isConfigured(cfg) || !cfg.offersCollectionId) return Promise.resolve([]);
      return fetchOffers(cfg, limit);
    },
    getProjects: function(limit){
      const cfg = window.APPWRITE_PUBLIC || {};
      if (!isConfigured(cfg) || !cfg.projectsCollectionId) return Promise.resolve([]);
      return fetchProjects(cfg, limit);
    },
    getNews: function(limit){
      const cfg = window.APPWRITE_PUBLIC || {};
      if (!isConfigured(cfg) || !cfg.newsCollectionId) return Promise.resolve([]);
      return fetchNews(cfg, limit);
    }
  };
})();
