(function() {
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
    floatingOffer.innerHTML = `
      <button class="floating-offer-minimize" aria-label="Minimize offer">_</button>
      <button class="floating-offer-close" aria-label="Close offer">&times;</button>
      <div class="floating-offer-content">
        <div class="floating-offer-badge">LIMITED OFFER</div>
        <h4 class="floating-offer-title">${offer.title}</h4>
        <p class="floating-offer-desc">${offer.description || ''}</p>
        <div class="floating-offer-discount">${offer.discount || offer.value || ''}</div>
        <div class="floating-offer-meta">
          <span class="floating-offer-code">${code}</span>
          ${expiryTxt ? `<span class="floating-offer-expiry">Expires: ${expiryTxt}</span>` : ''}
        </div>
        <a class="floating-offer-claim" href="${buildWhatsAppLink(offer)}" target="_blank" rel="noopener">
          Claim Now via WhatsApp
        </a>
        <a class="floating-offer-viewall" href="/offers" aria-label="View all current offers">
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
    floatingOffer.querySelector('.floating-offer-close').addEventListener('click', () => {
      floatingOffer.classList.remove('show');
      setTimeout(() => floatingOffer.remove(), 300);
      localStorage.setItem(CLOSED_KEY, Date.now().toString());
      logOfferEvent('close', { offerId: offer.id });
    });
    
    floatingOffer.querySelector('.floating-offer-minimize').addEventListener('click', () => {
      floatingOffer.classList.toggle('minimized');
      logOfferEvent('minimize', { offerId: offer.id, minimized: floatingOffer.classList.contains('minimized') });
    });

    const claimLink = floatingOffer.querySelector('.floating-offer-claim');
    claimLink.addEventListener('click', () => {
      logOfferEvent('click_claim', { offerId: offer.id });
    });
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
