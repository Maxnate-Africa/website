#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, '..', 'content');
const outputDir = path.join(__dirname, '..', 'assets', 'data');

console.log('Building content data from markdown...');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read websites
function readWebsites() {
  const websitesDir = path.join(contentDir, 'websites');
  if (!fs.existsSync(websitesDir)) return [];
  
  const files = fs.readdirSync(websitesDir).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(websitesDir, file), 'utf8');
    const { data } = matter(content);
    return {
      slug: data.slug,
      name: data.name,
      domain: data.domain || '',
      url: data.url || '',
      theme: data.theme || 'teal',
      createdAt: data.createdAt
    };
  });
}

// Read news
function readNews() {
  const newsDir = path.join(contentDir, 'news');
  if (!fs.existsSync(newsDir)) return [];
  
  const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(newsDir, file), 'utf8');
    const { data } = matter(content);
    return {
      id: path.basename(file, '.md'),
      website: data.website,
      title: data.title,
      description: data.description,
      status: data.status || 'draft',
      category: data.category || '',
      badge: data.badge || '',
      date: data.date,
      linkText: data.linkText || 'Learn More →',
      image: data.image || '',
      createdAt: data.createdAt
    };
  });
}

// Read projects
function readProjects() {
  const projectsDir = path.join(contentDir, 'projects');
  if (!fs.existsSync(projectsDir)) return [];
  
  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(projectsDir, file), 'utf8');
    const { data } = matter(content);
    return {
      id: path.basename(file, '.md'),
      website: data.website,
      title: data.title,
      description: data.description,
      status: data.status || 'draft',
      category: data.category || '',
      client: data.client || '',
      projectUrl: data.projectUrl || '',
      year: data.year || null,
      image: data.image || '',
      createdAt: data.createdAt
    };
  });
}

// Build data
const websites = readWebsites();
const news = readNews();
const projects = readProjects();

// Filter published content for public site
const publishedNews = news.filter(n => n.status === 'published');
const publishedProjects = projects.filter(p => p.status === 'published');

// Write output files
fs.writeFileSync(
  path.join(outputDir, 'websites.json'),
  JSON.stringify(websites, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'news.json'),
  JSON.stringify(publishedNews, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'projects.json'),
  JSON.stringify(publishedProjects, null, 2)
);

console.log(`✓ Built ${websites.length} websites`);
console.log(`✓ Built ${publishedNews.length}/${news.length} news articles (published)`);
console.log(`✓ Built ${publishedProjects.length}/${projects.length} projects (published)`);
console.log('Content build complete!');
