(function() {
  // Configure beacon endpoint for analytics (Netlify Function)
  if (typeof window !== 'undefined') {
    window.FLOATING_OFFER_BEACON_URL = '/.netlify/functions/analytics';
  }
  // Skip on offers listing page to avoid duplication
  if (typeof location !== 'undefined' && /\/pages\/offers\.html$/i.test(location.pathname)) {
    return;
  }

  let WHATSAPP_NUMBER = '255746662612';
  // 24h suppression logic
  const CLOSED_KEY = 'floatingOfferClosedAt';
  const EVENTS_KEY = 'floatingOfferEvents';
  const SUPPRESSION_MS = 24 * 60 * 60 * 1000;
  const closedAt = localStorage.getItem(CLOSED_KEY);
  const nowTs = Date.now();
  const isSuppressed = closedAt && (nowTs - parseInt(closedAt, 10) < SUPPRESSION_MS);

  function logOfferEvent(type, data = {}) {
    try {
      const payload = { type, ts: Date.now(), ...data };
      const existing = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
      existing.push(payload);
      // keep last 100 events
      const trimmed = existing.slice(-100);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(trimmed));
      // Optional beacon endpoint (configure later)
      if (window.navigator && navigator.sendBeacon && window.FLOATING_OFFER_BEACON_URL) {
        try {
          navigator.sendBeacon(window.FLOATING_OFFER_BEACON_URL, JSON.stringify(payload));
        } catch (_) {}
      }
    } catch (e) {
      console.warn('Offer event logging failed:', e);
    }
  }
  
  function generateOfferCode(id) {
    const date = new Date();
    const base = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    const short = id.slice(-5).toUpperCase();
    return `OFF-${base}-${short}`;
  }
  
  function buildWhatsAppLink(offer) {
    const code = generateOfferCode(offer.id);
    const msg = `Hello Maxnate Team,%0A%0AI would like to claim offer ${code}.%0AOffer: ${offer.title}%0ADiscount: ${offer.discount || offer.value || ''}%0AService Category: ${offer.category || ''}%0AStatus: Requesting validation.%0A%0AThank you.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  }
  
  function createFloatingOffer(offer) {
    if (!offer || isSuppressed) return;
    
    const code = generateOfferCode(offer.id);
    const expiryTxt = offer.expiry ? new Date(offer.expiry).toLocaleDateString() : '';
    
    const floatingOffer = document.createElement('div');
    floatingOffer.className = 'floating-offer-card';
    floatingOffer.setAttribute('role', 'dialog');
    floatingOffer.setAttribute('aria-modal', 'true');
    floatingOffer.setAttribute('aria-live', 'polite');
    floatingOffer.setAttribute('tabindex', '-1');
    const titleId = `floating-offer-title-${offer.id}`;
    floatingOffer.setAttribute('aria-labelledby', titleId);
    floatingOffer.innerHTML = `
      <button class="floating-offer-minimize" aria-label="Minimize offer" aria-expanded="true">_</button>
      <button class="floating-offer-close" aria-label="Close promotional offer" data-action="close">&times;</button>
      <div class="floating-offer-content">
        <div class="floating-offer-badge">LIMITED OFFER</div>
        <h4 class="floating-offer-title" id="${titleId}">${offer.title}</h4>
        <p class="floating-offer-desc">${offer.description || ''}</p>
        <div class="floating-offer-discount">${offer.discount || offer.value || ''}</div>
        <div class="floating-offer-meta">
          <span class="floating-offer-code" aria-label="Offer code ${code}">${code}</span>
          ${expiryTxt ? `<span class="floating-offer-expiry" aria-label="Offer expires on ${expiryTxt}">Expires: ${expiryTxt}</span>` : ''}
        </div>
        <a class="floating-offer-claim" href="${buildWhatsAppLink(offer)}" target="_blank" rel="noopener" aria-label="Claim offer ${code} via WhatsApp">
          Claim Now via WhatsApp
        </a>
        <a class="floating-offer-viewall" href="/pages/offers.html" aria-label="View all current offers">
          See All Offers →
        </a>
      </div>
    `;
    
    document.body.appendChild(floatingOffer);
    
    // Animations
    setTimeout(() => floatingOffer.classList.add('show'), 100);
    setTimeout(() => floatingOffer.classList.add('pulse'), 2000);
    logOfferEvent('impression', { offerId: offer.id });
    
    // Event handlers
    const closeBtn = floatingOffer.querySelector('.floating-offer-close');
    closeBtn.addEventListener('click', () => {
      floatingOffer.classList.remove('show');
      setTimeout(() => floatingOffer.remove(), 300);
      localStorage.setItem(CLOSED_KEY, Date.now().toString());
      logOfferEvent('close', { offerId: offer.id });
    });
    
    const minimizeBtn = floatingOffer.querySelector('.floating-offer-minimize');
    minimizeBtn.addEventListener('click', () => {
      const minimized = floatingOffer.classList.toggle('minimized');
      minimizeBtn.setAttribute('aria-expanded', minimized ? 'false' : 'true');
      floatingOffer.querySelector('.floating-offer-content').setAttribute('aria-hidden', minimized ? 'true' : 'false');
      logOfferEvent('minimize', { offerId: offer.id, minimized });
    });

    const claimLink = floatingOffer.querySelector('.floating-offer-claim');
    claimLink.addEventListener('click', () => {
      logOfferEvent('click_claim', { offerId: offer.id });
    });
    // Focus management & keyboard accessibility
    const focusableSelectors = ['button', 'a', '[tabindex]:not([tabindex="-1"])'];
    const getFocusable = () => Array.from(floatingOffer.querySelectorAll(focusableSelectors.join(',')));
    function trapKey(e) {
      if (e.key === 'Escape') {
        closeBtn.click();
        return;
      }
      if (e.key === 'Tab') {
        const items = getFocusable();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    floatingOffer.addEventListener('keydown', trapKey);
    // Move initial focus to claim link for quick action
    setTimeout(() => {
      try { claimLink.focus(); } catch(_) {}
    }, 300);
    const viewAllLink = floatingOffer.querySelector('.floating-offer-viewall');
    if (viewAllLink) {
      viewAllLink.addEventListener('click', () => logOfferEvent('click_view_all', { offerId: offer.id }));
    }
  }
  
  async function loadFloatingOffer() {
    try {
      // Try to load optional page settings for WhatsApp number
      try {
        const settingsRes = await fetch('/assets/data/offers-page.json');
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          if (settings && settings.whatsappNumber) {
            WHATSAPP_NUMBER = settings.whatsappNumber;
          }
        }
      } catch (_) {}

      const response = await fetch('/assets/data/offers.json');
      if (!response.ok) return;
      
      const data = await response.json();
      const offers = Array.isArray(data)
        ? data
        : (data.offers || []);
      const now = Date.now();
      const activeOffer = offers.find(o => 
        (o.status === 'published') && 
        (!o.expiry || new Date(o.expiry).getTime() > now)
      );
      
      if (activeOffer) {
        createFloatingOffer(activeOffer);
      }
    } catch (error) {
      console.warn('Could not load floating offer:', error);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFloatingOffer);
  } else {
    loadFloatingOffer();
  }
})();
