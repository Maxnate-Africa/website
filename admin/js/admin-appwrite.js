/* MaxCMS - Appwrite Admin Logic */
(function(){
  'use strict';

  if (!window.Appwrite) {
    console.error('Appwrite SDK not loaded');
    return;
  }

  const cfg = window.APPWRITE_ADMIN || {};
  const requireCfg = ['endpoint','projectId','databaseId','websitesCollectionId','projectsCollectionId','newsCollectionId','bucketId'];
  const ok = requireCfg.every(k => cfg[k]);
  if (!ok) {
    console.warn('Appwrite admin config incomplete. Fill admin/js/appwrite-config.js');
  }

  const client = new Appwrite.Client();
  client.setEndpoint(cfg.endpoint || '').setProject(cfg.projectId || '');
  const account = new Appwrite.Account(client);
  const databases = new Appwrite.Databases(client);
  const storage = new Appwrite.Storage(client);
  const teams = new Appwrite.Teams(client);
  const Query = Appwrite.Query;
  const Permission = Appwrite.Permission;
  const Role = Appwrite.Role;

  let currentUser = null;
  let currentWebsite = 'maxnate';
  let currentContentType = 'projects';
  let currentStatusFilter = 'all';
  let availableWebsites = [];
  let currentContent = [];
  let selectedIds = new Set();
  let isEditMode = false;
  let editingContentId = null;

  const WEBSITE_STORAGE_KEY = 'maxnate.currentWebsite';

  // DOM
  const loginScreen = document.getElementById('login-screen');
  const adminDashboard = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const contentModal = document.getElementById('content-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const cancelBtn = document.getElementById('cancel-btn');
  const contentForm = document.getElementById('content-form');
  const toastContainer = document.getElementById('toast-container');
  const retryBtn = document.getElementById('upload-retry');
  let lastSelectedFile = null;

  const CONTENT_TYPES = {
    projects: {
      title: 'Manage Projects',
      singular: 'Project'
    },
    news: {
      title: 'Manage News & Events',
      singular: 'News/Event'
    }
  };

  function setDashboardVisible(visible){
    if (visible) {
      loginScreen.classList.remove('active');
      document.getElementById('unauthorized-screen').style.display = 'none';
      adminDashboard.classList.add('active');
    } else {
      loginScreen.classList.add('active');
      adminDashboard.classList.remove('active');
      document.getElementById('unauthorized-screen').style.display = 'none';
    }
  }

  async function hasAdminAccess(){
    if (!cfg.adminsTeamId) return true; // no team restriction configured
    try {
      // Check current user's memberships for the admins team
      const memberships = await account.listMemberships();
      const list = memberships.memberships || memberships.total ? memberships.memberships : (memberships?.data || []);
      return (list || []).some(m => m.teamId === cfg.adminsTeamId || m.team?.$id === cfg.adminsTeamId);
    } catch (e){
      console.warn('Unable to check team memberships', e);
      return false;
    }
  }

  async function refreshAuth(){
    try { const user = await account.get(); currentUser = user; }
    catch { currentUser = null; }
    if (currentUser) {
      const allowed = await hasAdminAccess();
      if (!allowed){
        loginScreen.classList.remove('active');
        adminDashboard.classList.remove('active');
        const unauth = document.getElementById('unauthorized-screen');
        if (unauth) {
          unauth.style.display = 'flex';
          const btn = document.getElementById('unauth-signout');
          if (btn && !btn.dataset.bound) {
            btn.addEventListener('click', async ()=>{ try { await account.deleteSessions(); } catch {}; location.reload(); });
            btn.dataset.bound = '1';
          }
        }
        return;
      }
      document.getElementById('user-email').textContent = currentUser.email || '';
      setDashboardVisible(true);
      await loadWebsites();
    } else {
      setDashboardVisible(false);
    }
  }

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const btn = loginForm.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    try {
      btn.textContent = 'Logging in...'; btn.disabled = true;
      // Create session
      await account.createEmailPasswordSession(email, password);
      await refreshAuth();
    } catch (err){
      console.error('Login failed', err);
      alert('Login failed. Check your credentials.');
    } finally {
      btn.textContent = txt; btn.disabled = false;
    }
  });

  // Logout
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try { await account.deleteSessions(); } catch {}
    await refreshAuth();
  });

  // Toggle password
  (function(){
    const toggleBtn = document.getElementById('toggle-password');
    const pwdInput = document.getElementById('password');
    if (!toggleBtn || !pwdInput) return;
    toggleBtn.addEventListener('click', () => {
      const isHidden = pwdInput.type === 'password';
      pwdInput.type = isHidden ? 'text' : 'password';
      toggleBtn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
      toggleBtn.title = isHidden ? 'Hide password' : 'Show password';
      const eye = toggleBtn.querySelector('.icon-eye');
      const eyeOff = toggleBtn.querySelector('.icon-eye-off');
      if (eye && eyeOff) { eye.style.display = isHidden ? 'none' : ''; eyeOff.style.display = isHidden ? '' : 'none'; }
    });
  })();

  // Navigation
  navItems.forEach(item => item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.getAttribute('data-section');
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    currentContentType = section;
    switchSection(section);
    if (section !== 'settings') loadContent();
  }));

  function switchSection(section){
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
    const config = CONTENT_TYPES[section];
    document.getElementById('section-title').textContent = config ? config.title : 'Settings';
    if (config){
      currentStatusFilter = 'all';
      ensureStatusFilters();
      selectedIds = new Set();
      ensureBulkToolbar();
      ensureWebsiteSwitcher();
      syncWebsiteUI();
    }
  }

  // Websites
  async function loadWebsites(){
    try {
      const res = await databases.listDocuments(cfg.databaseId, cfg.websitesCollectionId, [Query.orderAsc('name')]);
      availableWebsites = (res.documents||[]).map(d => ({ id: d.slug || d.$id, name: d.name || d.$id }));
      if (!availableWebsites.length) { await createDefaultWebsite(); return loadWebsites(); }
      const stored = localStorage.getItem(WEBSITE_STORAGE_KEY);
      const hasStored = stored && availableWebsites.some(w => w.id === stored);
      currentWebsite = hasStored ? stored : (availableWebsites.find(w=>w.id==='maxnate')?.id || availableWebsites[0].id);
      ensureWebsiteSwitcher();
      syncWebsiteUI();
      await loadContent();
    } catch (err){
      console.error('Websites load error', err);
      alert('Failed to load websites');
    }
  }

  async function createDefaultWebsite(){
    try {
      await databases.createDocument(cfg.databaseId, cfg.websitesCollectionId, 'unique()', {
        slug: 'maxnate', name: 'Maxnate Africa', domain: 'maxnate.com', createdAt: new Date().toISOString(), settings: { theme: 'teal', primaryColor: '#008080' }
      });
    } catch(err){ console.error('createDefaultWebsite error', err); }
  }

  // Content CRUD
  async function loadContent(){
    const listEl = document.getElementById(`${currentContentType}-list`);
    listEl.innerHTML = '<p style="text-align:center; padding:2rem; color:#6C757D;">Loading...</p>';
    try {
      const collectionId = currentContentType === 'projects' ? cfg.projectsCollectionId : cfg.newsCollectionId;
      const queries = [Query.equal('websiteId', currentWebsite), Query.orderDesc('$createdAt')];
      const res = await databases.listDocuments(cfg.databaseId, collectionId, queries);
      currentContent = (res.documents||[]).map(d => mapDoc(d));
      ensureStatusFilters();
      ensureBulkToolbar();
      updateStatusCounts();
      renderContent();
      updateBulkToolbar();
    } catch(err){
      console.error('loadContent error', err);
      currentContent = [];
      ensureStatusFilters();
      ensureBulkToolbar();
      updateStatusCounts();
      renderContent();
      updateBulkToolbar();
    }
  }

  function mapDoc(d){
    return {
      id: d.$id,
      title: d.title,
      description: d.description,
      status: d.status || 'draft',
      category: d.category,
      client: d.client,
      projectUrl: d.projectUrl,
      year: d.year,
      badge: d.badge,
      date: d.date,
      linkText: d.linkText,
      image: d.image
    };
  }

  function getFilteredContent(){
    return currentStatusFilter === 'all' ? currentContent : currentContent.filter(i => (i.status||'draft')===currentStatusFilter);
  }

  function renderContent(){
    const listContainer = document.getElementById(`${currentContentType}-list`);
    listContainer.innerHTML='';
    const items = getFilteredContent();
    if (!items.length){
      listContainer.innerHTML = `<p style="text-align:center; color:#6C757D; padding:3rem;">No ${currentContentType} yet. Click "Add New" to get started!</p>`;
      updateBulkToolbar();
      return;
    }
    items.forEach(item => listContainer.appendChild(createContentCard(item)));
    updateBulkToolbar();
  }

  function createContentCard(item){
    const card = document.createElement('div');
    card.className = 'content-item';
    let metaBadges = '';
    if (item.status) metaBadges += `<span class="status-${item.status}">${item.status}</span>`;
    if (item.category) metaBadges += `<span>${item.category}</span>`;
    if (item.badge) metaBadges += `<span class="badge-${String(item.badge).toLowerCase()}">${item.badge}</span>`;
    if (item.client) metaBadges += `<span>🤝 ${item.client}</span>`;
    if (item.year) metaBadges += `<span>📅 ${item.year}</span>`;
    if (item.date) metaBadges += `<span>📅 ${new Date(item.date).toLocaleDateString()}</span>`;
    if (item.projectUrl) metaBadges += `<span><a href="${item.projectUrl}" target="_blank">🔗 View Project</a></span>`;
    const imageHTML = item.image ? `<div class="content-item-image"><img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/600x400/1A1A2E/E63946?text=No+Image'"></div>` : '';
    const isChecked = selectedIds.has(item.id) ? 'checked' : '';
    card.innerHTML = `
      <div class="select-checkbox"><input type="checkbox" class="select-item" data-id="${item.id}" ${isChecked} /></div>
      ${imageHTML}
      <div class="content-item-content">
        <h3>${item.title}</h3>
        <p>${item.description || ''}</p>
        ${metaBadges ? `<div class="content-meta">${metaBadges}</div>` : ''}
        <div class="content-actions">
          <button class="btn-edit" data-action="edit">Edit</button>
          <button class="btn-delete" data-action="delete">Delete</button>
        </div>
      </div>`;
    const checkbox = card.querySelector('.select-item');
    checkbox.addEventListener('change', (e) => toggleItemSelection(item.id, e.target.checked));
    card.querySelector('[data-action="edit"]').addEventListener('click', ()=> editContent(item.id));
    card.querySelector('[data-action="delete"]').addEventListener('click', ()=> deleteContent(item.id));
    return card;
  }

  // Edit
  window.editContent = editContent;
  async function editContent(id){
    const item = currentContent.find(c => c.id === id);
    if (!item) return;
    isEditMode = true; editingContentId = id;
    const config = CONTENT_TYPES[currentContentType];
    document.getElementById('modal-title').textContent = `Edit ${config.singular}`;
    document.getElementById('content-type').value = currentContentType;
    document.getElementById('content-id').value = item.id;
    document.getElementById('content-title').value = item.title || '';
    document.getElementById('content-description').value = item.description || '';
    document.getElementById('content-status').value = item.status || 'published';
    if (item.category) document.getElementById('content-category').value = item.category;
    if (item.client) document.getElementById('project-client').value = item.client;
    if (item.projectUrl) document.getElementById('project-url').value = item.projectUrl;
    if (item.year) document.getElementById('project-year').value = item.year;
    if (item.badge) document.getElementById('news-badge').value = item.badge;
    if (item.date) document.getElementById('news-date').value = item.date.split('T')[0];
    if (item.linkText) document.getElementById('news-link-text').value = item.linkText;
    if (item.category && currentContentType==='news') document.getElementById('news-category').value = item.category;
    if (item.image) { document.getElementById('content-image').value = item.image; const preview = document.getElementById('image-preview'); document.getElementById('preview-img').src = item.image; preview.classList.add('active'); }
    updateConditionalFields();
    contentModal.classList.add('active');
  }

  // Delete
  window.deleteContent = deleteContent;
  async function deleteContent(id){
    if (!confirm(`Delete this ${currentContentType.slice(0,-1)}?`)) return;
    try {
      const collectionId = currentContentType === 'projects' ? cfg.projectsCollectionId : cfg.newsCollectionId;
      await databases.deleteDocument(cfg.databaseId, collectionId, id);
      await loadContent();
    } catch(err){ console.error('delete error', err); alert('Failed to delete.'); }
  }

  // Save
  contentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const contentData = {
      title: document.getElementById('content-title').value,
      description: document.getElementById('content-description').value,
      status: document.getElementById('content-status').value,
      updatedAt: new Date().toISOString(),
      websiteId: currentWebsite
    };
    if (currentContentType==='projects'){
      contentData.category = document.getElementById('content-category').value;
      contentData.client = document.getElementById('project-client').value;
      contentData.projectUrl = document.getElementById('project-url').value;
      contentData.year = document.getElementById('project-year').value;
    } else {
      contentData.badge = document.getElementById('news-badge').value;
      contentData.category = document.getElementById('news-category').value;
      contentData.date = document.getElementById('news-date').value ? new Date(document.getElementById('news-date').value).toISOString() : null;
      contentData.linkText = document.getElementById('news-link-text').value || 'Learn More →';
      if (!contentData.date){ alert('Please select a date'); return; }
    }
    const imageUrl = document.getElementById('content-image').value;
    if (imageUrl) contentData.image = imageUrl;

    const collectionId = currentContentType === 'projects' ? cfg.projectsCollectionId : cfg.newsCollectionId;
    try {
      // Default permissions: public read, admin team write/update/delete
      const perms = cfg.adminsTeamId ? [
        Permission.read(Role.any()),
        Permission.update(Role.team(cfg.adminsTeamId)),
        Permission.delete(Role.team(cfg.adminsTeamId)),
        Permission.write(Role.team(cfg.adminsTeamId))
      ] : [Permission.read(Role.any())];

      if (isEditMode){
        await databases.updateDocument(cfg.databaseId, collectionId, editingContentId, contentData, perms);
      } else {
        contentData.createdAt = new Date().toISOString();
        await databases.createDocument(cfg.databaseId, collectionId, 'unique()', contentData, perms);
      }
      closeModal();
      await loadContent();
    } catch(err){ console.error('save error', err); alert('Failed to save.'); }
  });

  // Conditional fields
  function updateConditionalFields(){
    document.querySelectorAll('.conditional-field').forEach(f => {
      const showFor = f.getAttribute('data-show-for');
      if (showFor === currentContentType) f.classList.add('visible'); else f.classList.remove('visible');
    });
  }

  // Image URL preview
  document.getElementById('content-image').addEventListener('input', (e)=>{
    const url = e.target.value; const preview = document.getElementById('image-preview'); const img = document.getElementById('preview-img');
    if (url){ img.src=url; preview.classList.add('active'); img.onerror=()=>{img.src='https://via.placeholder.com/600x400/1A1A2E/E63946?text=Invalid+URL'}; }
  });

  // File Upload
  document.getElementById('content-image-file').addEventListener('change', async (e)=>{
    const file = e.target.files[0]; if (!file) return;
    lastSelectedFile = file;
    handleFileUpload(file);
  });

  async function handleFileUpload(file){
    if (!file) return;
    try {
      showUploadProgress('Compressing image…', 10, true);
      const uploadURL = await uploadImageToAppwrite(file);
      document.getElementById('content-image').value = uploadURL;
      const preview = document.getElementById('image-preview'); const img = document.getElementById('preview-img'); img.src = uploadURL; preview.classList.add('active');
      hideUploadProgress();
      showToast('Image uploaded successfully.', 'success');
    } catch(err){
      console.error('upload error', err);
      showUploadFailureUI();
      showToast('Image upload failed.', 'error', 5000, 'Retry', ()=>{ if (lastSelectedFile) handleFileUpload(lastSelectedFile); });
    }
  }

  async function compressImage(file, maxW = 1600, maxH = 1600, quality = 0.82){
    const dataURL = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxW / width, maxH / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Compression failed'));
          resolve(blob);
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
      const reader = new FileReader();
      reader.onload = () => { img.src = reader.result; };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return dataURL;
  }

  async function uploadImageToAppwrite(file){
    let toUpload = file;
    try {
      const compressedBlob = await compressImage(file);
      toUpload = new File([compressedBlob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
    } catch (e){ console.warn('Image compression skipped', e); }
    showUploadProgress('Uploading image…', 70, false);
    let fake = 70;
    const tick = setInterval(()=>{ fake = Math.min(fake + 3, 95); updateUploadProgress(fake); if (fake>=95) clearInterval(tick); }, 200);
    const perms = cfg.adminsTeamId ? [
      Permission.read(Role.any()),
      Permission.update(Role.team(cfg.adminsTeamId)),
      Permission.delete(Role.team(cfg.adminsTeamId)),
      Permission.write(Role.team(cfg.adminsTeamId))
    ] : [Permission.read(Role.any())];
    const res = await storage.createFile(cfg.bucketId, 'unique()', toUpload, perms);
    clearInterval(tick);
    updateUploadProgress(100);
    return storage.getFileView(cfg.bucketId, res.$id).href;
  }

  // Upload progress UI helpers
  function showUploadProgress(label, percent = 0, indeterminate = false){
    const box = document.getElementById('upload-status');
    const bar = document.getElementById('upload-bar');
    const lbl = document.getElementById('upload-label');
    const pct = document.getElementById('upload-percent');
    const ind = document.getElementById('upload-indeterminate');
    if (!box || !bar || !lbl || !pct || !ind) return;
    box.style.display = '';
    lbl.textContent = label;
    pct.textContent = `${Math.round(percent)}%`;
    bar.style.width = `${Math.round(percent)}%`;
    bar.setAttribute('aria-valuenow', String(Math.round(percent)));
    ind.style.display = indeterminate ? '' : 'none';
  }
  function updateUploadProgress(percent){
    const bar = document.getElementById('upload-bar');
    const pct = document.getElementById('upload-percent');
    const ind = document.getElementById('upload-indeterminate');
    if (!bar || !pct || !ind) return;
    ind.style.display = 'none';
    pct.textContent = `${Math.round(percent)}%`;
    bar.style.width = `${Math.round(percent)}%`;
    bar.setAttribute('aria-valuenow', String(Math.round(percent)));
  }
  function hideUploadProgress(){
    const box = document.getElementById('upload-status');
    if (box) box.style.display = 'none';
    const bar = document.getElementById('upload-bar'); if (bar) bar.style.width = '0%';
    const pct = document.getElementById('upload-percent'); if (pct) pct.textContent = '0%';
    const ind = document.getElementById('upload-indeterminate'); if (ind) ind.style.display = 'none';
    if (retryBtn){ retryBtn.style.display = 'none'; retryBtn.disabled = false; retryBtn.onclick = null; }
  }

  function showUploadFailureUI(){
    const box = document.getElementById('upload-status');
    const lbl = document.getElementById('upload-label');
    const ind = document.getElementById('upload-indeterminate');
    const bar = document.getElementById('upload-bar');
    const pct = document.getElementById('upload-percent');
    if (box) box.style.display = '';
    if (lbl) lbl.textContent = 'Upload failed';
    if (ind) ind.style.display = 'none';
    if (bar) { bar.style.width = '0%'; bar.setAttribute('aria-valuenow','0'); }
    if (pct) pct.textContent = '0%';
    if (retryBtn){
      retryBtn.style.display = '';
      retryBtn.disabled = false;
      retryBtn.onclick = ()=>{
        retryBtn.disabled = true;
        if (lastSelectedFile) handleFileUpload(lastSelectedFile);
      };
    }
  }

  function showToast(message, type = 'info', duration = 3000, actionText, onAction){
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const msg = document.createElement('div'); msg.className = 'toast-message'; msg.textContent = message;
    const actions = document.createElement('div'); actions.className = 'toast-actions';
    if (actionText && typeof onAction === 'function'){
      const btn = document.createElement('button'); btn.className = 'toast-btn'; btn.textContent = actionText; btn.addEventListener('click', ()=>{ try { onAction(); } finally { remove(); } }); actions.appendChild(btn);
    }
    const close = document.createElement('button'); close.className = 'toast-btn'; close.setAttribute('aria-label','Dismiss'); close.textContent = 'Dismiss'; close.addEventListener('click', remove);
    actions.appendChild(close);
    toast.appendChild(msg); toast.appendChild(actions);
    toastContainer.appendChild(toast);
    let timer;
    if (duration && duration > 0){ timer = setTimeout(remove, duration); }
    function remove(){ if (timer) clearTimeout(timer); if (toast.parentNode) toast.parentNode.removeChild(toast); }
  }

  // Modal
  closeModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  function closeModal(){ contentModal.classList.remove('active'); contentForm.reset(); document.getElementById('image-preview').classList.remove('active'); }
  contentModal.addEventListener('click', (e)=>{ if (e.target===contentModal) closeModal(); });

  // Filters/toolbar/website switcher (minimal reuse of DOM API)
  function ensureStatusFilters(){
    const sectionEl = document.getElementById(`${currentContentType}-section`); if (!sectionEl) return;
    const listEl = document.getElementById(`${currentContentType}-list`); if (!listEl) return;
    let filtersEl = sectionEl.querySelector('.status-filters');
    if (!filtersEl){
      filtersEl = document.createElement('div'); filtersEl.className='status-filters';
      filtersEl.innerHTML = `
        <button class="status-tab" data-status="all">All <span class="badge" id="${currentContentType}-count-all">0</span></button>
        <button class="status-tab" data-status="published">Published <span class="badge" id="${currentContentType}-count-published">0</span></button>
        <button class="status-tab" data-status="draft">Draft <span class="badge" id="${currentContentType}-count-draft">0</span></button>
        <button id="add-content-btn" class="btn-primary">+ Add New</button>`;
      sectionEl.insertBefore(filtersEl, listEl);
      filtersEl.querySelectorAll('.status-tab').forEach(btn => btn.addEventListener('click', ()=>{ filtersEl.querySelectorAll('.status-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); currentStatusFilter = btn.getAttribute('data-status'); renderContent(); }));
      const addBtn = filtersEl.querySelector('#add-content-btn');
      addBtn.addEventListener('click', ()=>{
        isEditMode=false; editingContentId=null; const config=CONTENT_TYPES[currentContentType];
        document.getElementById('modal-title').textContent = `Add New ${config.singular}`;
        document.getElementById('content-type').value = currentContentType;
        contentForm.reset(); document.getElementById('image-preview').classList.remove('active'); updateConditionalFields(); contentModal.classList.add('active');
      });
    }
    filtersEl.querySelectorAll('.status-tab').forEach(btn => { if (btn.getAttribute('data-status')===currentStatusFilter) btn.classList.add('active'); else btn.classList.remove('active'); });
  }

  function updateStatusCounts(){
    const total = currentContent.length;
    const published = currentContent.filter(i => (i.status||'draft')==='published').length;
    const draft = currentContent.filter(i => (i.status||'draft')==='draft').length;
    const allEl = document.getElementById(`${currentContentType}-count-all`);
    const pubEl = document.getElementById(`${currentContentType}-count-published`);
    const draftEl = document.getElementById(`${currentContentType}-count-draft`);
    if (allEl) allEl.textContent = total; if (pubEl) pubEl.textContent = published; if (draftEl) draftEl.textContent = draft;
  }

  function ensureBulkToolbar(){
    const sectionEl = document.getElementById(`${currentContentType}-section`); if (!sectionEl) return;
    const listEl = document.getElementById(`${currentContentType}-list`); if (!listEl) return;
    let toolbar = sectionEl.querySelector('.bulk-toolbar');
    if (!toolbar){
      toolbar = document.createElement('div'); toolbar.className='bulk-toolbar';
      toolbar.innerHTML = `
        <label class="select-all"><input type="checkbox" id="${currentContentType}-select-all" /><span>Select all</span></label>
        <div class="bulk-actions">
          <button class="btn-secondary" id="${currentContentType}-bulk-publish" disabled>Publish</button>
          <button class="btn-secondary" id="${currentContentType}-bulk-unpublish" disabled>Unpublish</button>
          <button class="btn-delete" id="${currentContentType}-bulk-delete" disabled>Delete</button>
        </div>
        <div class="bulk-count"><span id="${currentContentType}-selected-count">0</span> selected</div>`;
      const filtersEl = sectionEl.querySelector('.status-filters');
      if (filtersEl && filtersEl.nextSibling) sectionEl.insertBefore(toolbar, filtersEl.nextSibling); else sectionEl.insertBefore(toolbar, listEl);
      const selectAll = toolbar.querySelector(`#${currentContentType}-select-all`);
      selectAll.addEventListener('change', (e)=>{ const items=getFilteredContent(); if (e.target.checked){ items.forEach(i=>selectedIds.add(i.id)); } else { items.forEach(i=>selectedIds.delete(i.id)); } renderContent(); });
      toolbar.querySelector(`#${currentContentType}-bulk-publish`).addEventListener('click', ()=>bulkUpdateStatus('published'));
      toolbar.querySelector(`#${currentContentType}-bulk-unpublish`).addEventListener('click', ()=>bulkUpdateStatus('draft'));
      toolbar.querySelector(`#${currentContentType}-bulk-delete`).addEventListener('click', ()=>bulkDelete());
    }
  }

  function updateBulkToolbar(){
    const sectionEl = document.getElementById(`${currentContentType}-section`); if (!sectionEl) return;
    const toolbar = sectionEl.querySelector('.bulk-toolbar'); if (!toolbar) return;
    const selectedCount = selectedIds.size; const countEl = toolbar.querySelector(`#${currentContentType}-selected-count`); if (countEl) countEl.textContent = selectedCount;
    const disabled = selectedCount===0;
    const publishBtn = toolbar.querySelector(`#${currentContentType}-bulk-publish`);
    const unpublishBtn = toolbar.querySelector(`#${currentContentType}-bulk-unpublish`);
    const deleteBtn = toolbar.querySelector(`#${currentContentType}-bulk-delete`);
    if (publishBtn) publishBtn.disabled = disabled; if (unpublishBtn) unpublishBtn.disabled = disabled; if (deleteBtn) deleteBtn.disabled = disabled;
    const items = getFilteredContent(); const allSelected = items.length>0 && items.every(i=>selectedIds.has(i.id)); const selectAll = toolbar.querySelector(`#${currentContentType}-select-all`); if (selectAll) selectAll.checked = allSelected;
  }

  function toggleItemSelection(id, checked){ if (checked) selectedIds.add(id); else selectedIds.delete(id); updateBulkToolbar(); }

  async function bulkUpdateStatus(newStatus){
    const ids = Array.from(selectedIds); if (!ids.length) return;
    if (!confirm(`Set status to "${newStatus}" for ${ids.length} item(s)?`)) return;
    try {
      const collectionId = currentContentType === 'projects' ? cfg.projectsCollectionId : cfg.newsCollectionId;
      for (const id of ids){ await databases.updateDocument(cfg.databaseId, collectionId, id, { status: newStatus, updatedAt: new Date().toISOString() }); }
      selectedIds = new Set(); await loadContent(); alert(`Updated ${ids.length} item(s).`);
    } catch(err){ console.error('bulk update error', err); alert('Failed to update items'); }
  }

  async function bulkDelete(){
    const ids = Array.from(selectedIds); if (!ids.length) return; if (!confirm(`Delete ${ids.length} item(s)? This cannot be undone.`)) return;
    try {
      const collectionId = currentContentType === 'projects' ? cfg.projectsCollectionId : cfg.newsCollectionId;
      for (const id of ids){ await databases.deleteDocument(cfg.databaseId, collectionId, id); }
      selectedIds = new Set(); await loadContent(); alert(`Deleted ${ids.length} item(s).`);
    } catch(err){ console.error('bulk delete error', err); alert('Failed to delete items'); }
  }

  function ensureWebsiteSwitcher(){
    const header = document.querySelector('.content-header'); if (!header) return;
    let switcher = header.querySelector('.website-switcher');
    if (!switcher){
      switcher = document.createElement('div'); switcher.className='website-switcher';
      switcher.innerHTML = `<label for="website-switcher-select">Website:</label><select id="website-switcher-select"></select>`;
      const filtersEl = document.querySelector('.status-filters'); header.insertBefore(switcher, filtersEl || header.firstChild);
    }
    const select = switcher.querySelector('#website-switcher-select'); select.innerHTML='';
    availableWebsites.forEach(w=>{ const opt=document.createElement('option'); opt.value=w.id; opt.textContent=w.name || w.id; select.appendChild(opt); });
    select.value = currentWebsite;
    if (!select.dataset.bound){ select.addEventListener('change', ()=>{ setCurrentWebsite(select.value); }); select.dataset.bound='1'; }
  }

  function syncWebsiteUI(){
    const select = document.getElementById('website-switcher-select'); if (select) select.value = currentWebsite;
    const info = document.getElementById('current-website'); if (info){ const w = availableWebsites.find(x=>x.id===currentWebsite); info.textContent = w ? (w.name || w.id) : currentWebsite; }
  }

  function setCurrentWebsite(websiteId){ if (!websiteId || websiteId===currentWebsite) return; currentWebsite = websiteId; try { localStorage.setItem(WEBSITE_STORAGE_KEY, currentWebsite); } catch {} selectedIds = new Set(); currentStatusFilter = 'all'; ensureStatusFilters(); ensureBulkToolbar(); syncWebsiteUI(); loadContent(); }

  // Start
  document.addEventListener('DOMContentLoaded', refreshAuth);
})();
