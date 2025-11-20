#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const yaml = require('js-yaml');

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
      badgeAnimation: data.badgeAnimation || 'none',
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

// Read hero content
function readHero() {
  const heroFile = path.join(contentDir, 'settings', 'hero.yml');
  if (!fs.existsSync(heroFile)) return null;
  
  const content = fs.readFileSync(heroFile, 'utf8');
  return yaml.load(content);
}

// Read services
function readServices() {
  const servicesDir = path.join(contentDir, 'services');
  if (!fs.existsSync(servicesDir)) return [];
  
  const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.md'));
  const services = files.map(file => {
    const content = fs.readFileSync(path.join(servicesDir, file), 'utf8');
    const { data } = matter(content);
    return {
      id: path.basename(file, '.md'),
      name: data.name,
      icon: data.icon || 'fa-cogs',
      description: data.description,
      order: data.order || 0,
      status: data.status || 'active'
    };
  });
  
  // Sort by order
  return services.sort((a, b) => a.order - b.order);
}

// Read contact info
function readContact() {
  const contactFile = path.join(contentDir, 'settings', 'contact.yml');
  if (!fs.existsSync(contactFile)) return null;
  
  const content = fs.readFileSync(contactFile, 'utf8');
  return yaml.load(content);
}

// Read offers page settings
function readOffersPage() {
  const offersPageFile = path.join(contentDir, 'settings', 'offers-page.yml');
  if (!fs.existsSync(offersPageFile)) return null;
  
  const content = fs.readFileSync(offersPageFile, 'utf8');
  return yaml.load(content);
}

// Read offers
function readOffers() {
  const offersDir = path.join(contentDir, 'offers');
  if (!fs.existsSync(offersDir)) return [];
  
  const files = fs.readdirSync(offersDir).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(offersDir, file), 'utf8');
    const { data } = matter(content);
    return {
      id: path.basename(file, '.md'),
      title: data.title,
      description: data.description,
      discount: data.discount || '',
      icon: data.icon || '🔥',
      iconAnimation: data.iconAnimation || 'bounce',
      category: data.category || '',
      expiry: data.expiry || null,
      status: data.status || 'draft',
      createdAt: data.createdAt
    };
  });
}

// Build data
const websites = readWebsites();
const news = readNews();
const projects = readProjects();
const hero = readHero();
const services = readServices();
const contact = readContact();
const offersPage = readOffersPage();
const offers = readOffers();

// Filter published content for public site
const publishedNews = news.filter(n => n.status === 'published');
const publishedProjects = projects.filter(p => p.status === 'published');
const activeServices = services.filter(s => s.status === 'active');
const publishedOffers = offers.filter(o => o.status === 'published');

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

if (hero) {
  fs.writeFileSync(
    path.join(outputDir, 'hero.json'),
    JSON.stringify(hero, null, 2)
  );
}

fs.writeFileSync(
  path.join(outputDir, 'services.json'),
  JSON.stringify(activeServices, null, 2)
);

if (contact) {
  fs.writeFileSync(
    path.join(outputDir, 'contact.json'),
    JSON.stringify(contact, null, 2)
  );
}

if (offersPage) {
  fs.writeFileSync(
    path.join(outputDir, 'offers-page.json'),
    JSON.stringify(offersPage, null, 2)
  );
}

fs.writeFileSync(
  path.join(outputDir, 'offers.json'),
  JSON.stringify(publishedOffers, null, 2)
);

console.log(`✓ Built ${websites.length} websites`);
console.log(`✓ Built ${publishedNews.length}/${news.length} news articles (published)`);
console.log(`✓ Built ${publishedProjects.length}/${projects.length} projects (published)`);
console.log(`✓ Built hero content: ${hero ? 'yes' : 'no'}`);
console.log(`✓ Built ${activeServices.length}/${services.length} services (active)`);
console.log(`✓ Built contact info: ${contact ? 'yes' : 'no'}`);
console.log(`✓ Built offers page settings: ${offersPage ? 'yes' : 'no'}`);
console.log(`✓ Built ${publishedOffers.length}/${offers.length} offers (published)`);
console.log('Content build complete!');
