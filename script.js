(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const state = {
    data: null,
    activeTab: 'portfolio',
    theme: localStorage.getItem('theme') || 'dark',
  };

  const el = {
    loader: $('#loader'),
    navbar: $('#navbar'),
    navAvatar: $('#navAvatar'),
    navName: $('#navName'),
    heroAvatar: $('#heroAvatar'),
    heroName: $('#heroName'),
    clockTime: $('#clockTime'),
    clockDate: $('#clockDate'),
    themeBtn: $('#themeBtn'),
    tabSlider: $('#tabSlider'),
    portfolioList: $('#portfolioList'),
    toolsGrid: $('#toolsGrid'),
    searchInput: $('#searchInput'),
    searchBar: $('#searchBar'),
    searchClear: $('#searchClear'),
    emptyState: $('#emptyState'),
    backToTop: $('#backToTop'),
    toastContainer: $('#toastContainer'),
    socialsRow: $('#socialsRow'),
    quoteText: $('#quoteText'),
    quoteAuthor: $('#quoteAuthor'),
    contactEmailDisplay: $('#contactEmailDisplay'),
    contactCopyBtn: $('#contactCopyBtn'),
    contactCopied: $('#contactCopied'),
    shortcutsModal: $('#shortcutsModal'),
    shortcutsBtn: $('#shortcutsBtn'),
    modalClose: $('#modalClose'),
    scrollProgress: $('#scrollProgress'),
  };

  // ---- Theme ----

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.classList.add('theme-shift');
    setTimeout(() => document.documentElement.classList.remove('theme-shift'), 600);
  }

  function toggleTheme() {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  // ---- Clock ----

  function updateClock() {
    const now = new Date();
    el.clockTime.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });
    el.clockDate.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  }

  // ---- Loader ----

  function hideLoader() {
    el.loader.classList.add('done');
    document.body.classList.add('loaded');
  }

  // ---- Data ----

  async function loadData() {
    try {
      const res = await fetch('data.json');
      state.data = await res.json();
      renderProfile();
      renderSocials();
      renderPortfolio();
      renderTools();
      renderQuotes();
      renderContact();
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }

  function renderProfile() {
    const { name, avatar } = state.data;
    el.heroName.textContent = name;
    el.heroAvatar.src = avatar;
    el.navAvatar.src = avatar;
    el.navName.textContent = name;
    document.title = name + ' — Portfolio';
  }

  // ---- Portfolio ----

  const socialIcons = {
    github: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
    discord: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>',
    twitter: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    snapchat: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.869-.214.11-.05.25-.096.393-.096a.614.614 0 01.58.41c.088.234-.019.47-.154.637-.176.216-.6.396-.91.47-.104.027-.2.052-.274.065-.534.1-.67.274-.707.415-.04.14-.014.291.082.472a15.5 15.5 0 002.157 2.616c.55.545 1.187.979 1.89 1.283.063.027.348.139.39.263.046.143-.06.28-.11.332a1.33 1.33 0 01-.152.137c-.31.222-.72.37-1.014.445-.159.04-.405.12-.462.32-.035.127.02.285.168.474-.236.51-.6.905-1.11 1.245-.53.345-1.21.525-1.92.648-.35.06-.52.107-.6.275-.134.292.07.58.088.613.025.045.048.087.048.131 0 .12-.066.233-.218.327-.266.17-.695.293-1.338.293-.473 0-.964-.067-1.226-.105a5.9 5.9 0 00-.57-.056c-.208 0-.38.024-.563.063-.555.12-1.003.39-1.487.676-.528.31-1.073.631-1.763.631-.032 0-.065 0-.096-.003a2.06 2.06 0 01-.096.003c-.69 0-1.235-.32-1.763-.63-.484-.288-.932-.557-1.487-.677a3.34 3.34 0 00-.563-.063c-.189 0-.395.02-.57.056-.262.038-.753.105-1.226.105-.643 0-1.072-.123-1.338-.293-.152-.094-.218-.207-.218-.327 0-.044.023-.086.048-.131.018-.033.222-.321.088-.613-.08-.168-.25-.216-.6-.275-.71-.123-1.39-.303-1.92-.648-.51-.34-.874-.735-1.11-1.245.148-.19.203-.347.168-.474-.057-.2-.303-.28-.462-.32-.294-.075-.704-.223-1.014-.445a1.35 1.35 0 01-.152-.137c-.05-.052-.156-.19-.11-.332.042-.124.327-.236.39-.263a8.22 8.22 0 001.89-1.283 15.5 15.5 0 002.157-2.616c.096-.181.122-.332.082-.472-.037-.141-.173-.315-.707-.415a3.49 3.49 0 01-.274-.065c-.31-.074-.734-.254-.91-.47-.135-.167-.242-.403-.154-.637a.614.614 0 01.58-.41c.143 0 .283.046.393.096.21.094.57.23.869.214.198 0 .326-.045.401-.09-.008-.165-.018-.33-.03-.51l-.003-.06c-.104-1.628-.23-3.654.3-4.847C7.86 1.069 11.216.793 12.206.793z"/></svg>',
    email: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  };

  function renderSocials() {
    const socials = state.data.socials;
    if (!socials || !socials.length) return;

    const frag = document.createDocumentFragment();
    socials.forEach((s) => {
      const a = document.createElement('a');
      a.className = 'social-link';
      a.title = s.platform;
      a.innerHTML = socialIcons[s.icon] || '';

      if (s.icon === 'email') {
        a.href = '#contactSection';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          document.getElementById('contactSection').scrollIntoView({ behavior: 'smooth' });
        });
      } else if (s.url) {
        a.href = s.url;
        if (!s.url.startsWith('mailto:')) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
      } else {
        a.href = '#';
        a.classList.add('no-link');
        a.addEventListener('click', (e) => e.preventDefault());
      }

      frag.appendChild(a);
    });
    el.socialsRow.textContent = '';
    el.socialsRow.appendChild(frag);
  }

  // ---- Quotes ----

  let quoteIndex = 0;

  function renderQuotes() {
    const quotes = state.data.quotes;
    if (!quotes || !quotes.length) return;
    showQuote(quotes, 0);
    setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      el.quoteText.classList.add('quote-fade');
      el.quoteAuthor.classList.add('quote-fade');
      setTimeout(() => {
        showQuote(quotes, quoteIndex);
        el.quoteText.classList.remove('quote-fade');
        el.quoteAuthor.classList.remove('quote-fade');
      }, 400);
    }, 6000);
  }

  function showQuote(quotes, i) {
    el.quoteText.textContent = '"' + quotes[i].text + '"';
    el.quoteAuthor.textContent = '— ' + quotes[i].author;
  }

  // ---- Contact ----

  function renderContact() {
    const email = state.data.email;
    if (!email) return;
    el.contactEmailDisplay.textContent = email;

    $('#contactGmail').href = 'https://mail.google.com/mail/?view=cm&to=' + encodeURIComponent(email) + '&su=Hello';
    $('#contactGmail').target = '_blank';
    $('#contactGmail').rel = 'noopener noreferrer';

    $('#contactOutlook').href = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + encodeURIComponent(email) + '&subject=Hello';
    $('#contactOutlook').target = '_blank';
    $('#contactOutlook').rel = 'noopener noreferrer';

    $('#contactYahoo').href = 'https://compose.mail.yahoo.com/?to=' + encodeURIComponent(email) + '&subject=Hello';
    $('#contactYahoo').target = '_blank';
    $('#contactYahoo').rel = 'noopener noreferrer';

    $('#contactMailto').href = 'mailto:' + email + '?subject=Hello';

    el.contactCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
        el.contactCopied.classList.remove('hidden');
        setTimeout(() => el.contactCopied.classList.add('hidden'), 2000);
      });
    });
  }

  // ---- Portfolio ----

  function renderPortfolio() {
    const projects = state.data.portfolio;
    if (!projects || !projects.length) {
      el.portfolioList.innerHTML =
        '<div class="portfolio-empty">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">' +
            '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>' +
          '</svg>' +
          '<p>Projects coming soon</p>' +
        '</div>';
      return;
    }

    const frag = document.createDocumentFragment();
    projects.forEach((item, i) => {
      const a = document.createElement('a');
      a.className = 'project-card';
      a.style.animationDelay = (i * 0.08) + 's';

      if (item.link) {
        a.href = item.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      } else {
        a.href = '#';
        a.classList.add('no-link');
        a.addEventListener('click', (e) => e.preventDefault());
      }

      a.innerHTML =
        '<div class="project-card-image">' +
          '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy">' +
        '</div>' +
        '<div class="project-card-body">' +
          '<h3 class="project-card-title">' + item.name + '</h3>' +
          (item.desc ? '<p class="project-card-desc">' + item.desc + '</p>' : '') +
        '</div>';

      frag.appendChild(a);
    });
    el.portfolioList.textContent = '';
    el.portfolioList.appendChild(frag);
  }

  // ---- Tools ----

  function renderTools(items) {
    const tools = items || state.data.tools;
    const frag = document.createDocumentFragment();

    tools.forEach((item, i) => {
      const a = document.createElement('a');
      a.className = 'tool-card';
      a.href = item.link;
      a.style.animationDelay = (i * 0.1) + 's';

      a.innerHTML =
        '<div class="tool-card-image">' +
          '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy">' +
        '</div>' +
        '<div class="tool-card-body">' +
          '<h3 class="tool-card-title">' + item.name + '</h3>' +
          '<p class="tool-card-desc">' + item.desc + '</p>' +
        '</div>' +
        '<div class="tool-card-footer">' +
          '<span class="tool-card-link">View ' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M5 12h14M12 5l7 7-7 7"/>' +
            '</svg>' +
          '</span>' +
        '</div>';

      frag.appendChild(a);
    });

    el.toolsGrid.textContent = '';
    el.toolsGrid.appendChild(frag);
    el.emptyState.classList.toggle('hidden', tools.length > 0);
    el.toolsGrid.classList.toggle('hidden', tools.length === 0);
  }

  // ---- Tabs ----

  function switchTab(tabId) {
    if (tabId === state.activeTab) return;

    const oldPanel = $('#' + state.activeTab);
    const newPanel = $('#' + tabId);

    oldPanel.classList.remove('active');
    newPanel.classList.add('active');

    $$('.tab').forEach((t) => {
      const active = t.dataset.tab === tabId;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });

    el.tabSlider.style.left = tabId === 'portfolio' ? '4px' : 'calc(50%)';
    state.activeTab = tabId;
  }

  // ---- Search ----

  function handleSearch() {
    const q = el.searchInput.value.toLowerCase().trim();
    el.searchClear.classList.toggle('hidden', !q);

    if (!q) {
      renderTools();
      return;
    }

    const filtered = state.data.tools.filter(
      (t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    );
    renderTools(filtered);
  }

  function clearSearch() {
    el.searchInput.value = '';
    el.searchClear.classList.add('hidden');
    renderTools();
    el.searchInput.focus();
  }

  // ---- Scroll ----

  function handleScroll() {
    const top = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    el.scrollProgress.style.width = docH > 0 ? (top / docH * 100) + '%' : '0%';
    el.backToTop.classList.toggle('visible', top > 300);
    el.navbar.classList.toggle('scrolled', top > 50);
  }

  // ---- Ripple ----

  function spawnRipple(e, host) {
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (e.clientX - rect.left - size / 2) + 'px';
    span.style.top = (e.clientY - rect.top - size / 2) + 'px';
    host.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  }

  // ---- Modal ----

  function toggleShortcuts() {
    el.shortcutsModal.classList.toggle('hidden');
  }

  // ---- Keyboard ----

  function handleKey(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape') {
        e.target.blur();
        if (e.target === el.searchInput) clearSearch();
      }
      return;
    }

    switch (e.key) {
      case 's':
      case 'S':
        e.preventDefault();
        switchTab('tools');
        setTimeout(() => el.searchInput.focus(), 350);
        break;
      case 't':
      case 'T':
        toggleTheme();
        break;
      case '1':
        switchTab('portfolio');
        break;
      case '2':
        switchTab('tools');
        break;
      case '?':
        toggleShortcuts();
        break;
      case 'Escape':
        if (!el.shortcutsModal.classList.contains('hidden')) toggleShortcuts();
        break;
    }
  }

  // ---- Init ----

  function init() {
    setTheme(state.theme);
    updateClock();
    setInterval(updateClock, 1000);

    const dataReady = loadData();
    const minWait = new Promise((r) => setTimeout(r, 1400));
    Promise.all([dataReady, minWait]).then(hideLoader);

    el.themeBtn.addEventListener('click', () => {
      toggleTheme();
    });

    $$('.tab').forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    el.searchInput.addEventListener('input', handleSearch);
    el.searchClear.addEventListener('click', clearSearch);
    el.searchInput.addEventListener('focus', () => el.searchBar.classList.add('focused'));
    el.searchInput.addEventListener('blur', () => el.searchBar.classList.remove('focused'));

    window.addEventListener('scroll', handleScroll, { passive: true });
    el.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    el.shortcutsBtn.addEventListener('click', toggleShortcuts);
    el.modalClose.addEventListener('click', toggleShortcuts);
    el.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === el.shortcutsModal) toggleShortcuts();
    });

    document.addEventListener('keydown', handleKey);

    document.addEventListener('click', (e) => {
      const target = e.target.closest('.project-card, .tool-card, .tab, .btn-icon, .contact-copy-btn, .contact-provider-btn');
      if (target) spawnRipple(e, target);
    });

    handleScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
