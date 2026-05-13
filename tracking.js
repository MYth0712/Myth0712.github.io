(() => {
  'use strict';

  const STORAGE_KEY = 'ae_tracking';
  let trackingUrl = '';
  let visitorInfo = {};

  function getSessionId() {
    let sid = sessionStorage.getItem('ae_sid');
    if (!sid) {
      sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem('ae_sid', sid);
    }
    return sid;
  }

  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Desktop';
    if (/Mobi|Android/i.test(ua)) device = 'Mobile';
    else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

    let browser = 'Unknown';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';

    return {
      device,
      browser,
      screen: window.innerWidth + 'x' + window.innerHeight,
      language: navigator.language,
      referrer: document.referrer || 'direct',
    };
  }

  async function getLocation() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      return {
        city: data.city || 'Unknown',
        region: data.region || '',
        country: data.country_name || 'Unknown',
        ip: data.ip || '',
      };
    } catch {
      return { city: 'Unknown', region: '', country: 'Unknown', ip: '' };
    }
  }

  function saveEvent(event) {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    events.push(event);
    if (events.length > 500) events.splice(0, events.length - 500);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

    if (trackingUrl) {
      fetch(trackingUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(() => {});
    }
  }

  function track(type, detail) {
    saveEvent({
      type,
      detail: { ...visitorInfo, ...detail },
      timestamp: new Date().toISOString(),
      session: getSessionId(),
      page: location.pathname,
    });
  }

  async function init() {
    try {
      const res = await fetch('data.json');
      const data = await res.json();
      trackingUrl = data.trackingUrl || '';
    } catch {}

    const info = getDeviceInfo();
    const loc = await getLocation();
    visitorInfo = { ...info, ...loc };

    track('pageview', {});

    document.addEventListener('click', (e) => {
      const social = e.target.closest('.social-link');
      if (social) {
        track('click', { element: 'social', label: social.title });
        return;
      }

      const tab = e.target.closest('.tab');
      if (tab) {
        track('click', { element: 'tab', label: tab.dataset.tab });
        return;
      }

      const toolCard = e.target.closest('.tool-card');
      if (toolCard) {
        const title = toolCard.querySelector('.tool-card-title');
        track('click', { element: 'tool', label: title ? title.textContent : '' });
        return;
      }

      const projectCard = e.target.closest('.project-card');
      if (projectCard) {
        const title = projectCard.querySelector('.project-card-title');
        track('click', { element: 'project', label: title ? title.textContent : '' });
        return;
      }

      const themeBtn = e.target.closest('#themeBtn');
      if (themeBtn) {
        track('click', { element: 'theme-toggle', label: document.documentElement.dataset.theme });
        return;
      }

      const copyBtn = e.target.closest('#contactCopyBtn');
      if (copyBtn) {
        track('click', { element: 'copy-email' });
        return;
      }

      const provider = e.target.closest('.contact-provider-btn');
      if (provider) {
        track('click', { element: 'email-provider', label: provider.title });
        return;
      }
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const q = searchInput.value.trim();
          if (q) track('search', { query: q });
        }, 1000);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
