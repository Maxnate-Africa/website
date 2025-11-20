// Static data service - replaces Appwrite calls with JSON file fetching
// Content is built from markdown at build time by scripts/build-content.js

const DATA_BASE = '/assets/data';

class ContentService {
  constructor() {
    this.cache = {};
  }

  async fetchJSON(path) {
    if (this.cache[path]) {
      return this.cache[path];
    }
    
    try {
      const response = await fetch(`${DATA_BASE}/${path}`);
      if (!response.ok) {
        console.warn(`Failed to fetch ${path}:`, response.status);
        return null;
      }
      const data = await response.json();
      this.cache[path] = data;
      return data;
    } catch (err) {
      console.error(`Error fetching ${path}:`, err);
      return null;
    }
  }

  async getWebsites() {
    return await this.fetchJSON('websites.json') || [];
  }

  async getNews(filters = {}) {
    const allNews = await this.fetchJSON('news.json') || [];
    return this.filterContent(allNews, filters);
  }

  async getProjects(filters = {}) {
    const allProjects = await this.fetchJSON('projects.json') || [];
    return this.filterContent(allProjects, filters);
  }

  filterContent(items, filters) {
    let filtered = items;

    // Filter by website
    if (filters.website) {
      filtered = filtered.filter(item => item.website === filters.website);
    }

    // Filter by status (though public data should only have published)
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Sort by date (newest first)
    if (filters.sortByDate !== false) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt);
        const dateB = new Date(b.date || b.createdAt);
        return dateB - dateA;
      });
    }

    // Limit results
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  // Helper to get website by slug
  async getWebsite(slug) {
    const websites = await this.getWebsites();
    return websites.find(w => w.slug === slug);
  }
}

// Export singleton instance
window.contentService = new ContentService();
