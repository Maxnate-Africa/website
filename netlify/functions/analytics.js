exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = event.body || '{}';
    const payload = JSON.parse(body);
    // Basic validation
    if (!payload.type || !payload.ts) {
      return { statusCode: 400, body: 'Invalid payload' };
    }
    // For now we just log to function output (visible in Netlify logs)
    console.log('OfferEvent', JSON.stringify({
      type: payload.type,
      ts: payload.ts,
      offerId: payload.offerId,
      minimized: payload.minimized,
      meta: payload.meta || null
    }));
    // Return no content to keep beacon fast
    return { statusCode: 204, body: '' };
  } catch (e) {
    return { statusCode: 400, body: 'Bad Request' };
  }
};
