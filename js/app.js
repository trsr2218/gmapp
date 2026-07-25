/* Guardian Motors Limited: site interactions */
(() => {
  'use strict';

  /* ---------- Web3Forms (free serverless form backend, https://web3forms.com) ----------
     Each key is free and tied to one destination inbox. To go live:
       1. Visit https://web3forms.com, enter the destination email (e.g. sales@guardianmotors.co.zm)
          and it emails you an access key instantly, no account/login needed.
       2. Repeat for service@ and parts@ (or reuse one key for all three if you'd rather
          route everything to a single inbox).
       3. Paste each key below. Forms fall back to opening the visitor's email client
         (the old mailto: behaviour) until a real key replaces the "YOUR_..." placeholder. */
  const WEB3FORMS_KEYS = {
    sales: 'YOUR_WEB3FORMS_ACCESS_KEY_SALES',
    service: 'YOUR_WEB3FORMS_ACCESS_KEY_SERVICE',
    parts: 'YOUR_WEB3FORMS_ACCESS_KEY_PARTS',
  };
  async function submitFormToWeb3Forms(formData, accessKey, subject) {
    formData.set('access_key', accessKey);
    formData.set('subject', subject);
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });
    return res.json();
  }
  window.WEB3FORMS_KEYS = WEB3FORMS_KEYS;
  window.submitFormToWeb3Forms = submitFormToWeb3Forms;

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  navToggle?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ---------- Active nav link on scroll ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-desktop a')];
  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const isDecimal = !Number.isInteger(target);
      const val = isDecimal ? (target * eased).toFixed(1) : Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObserver.observe(el));
  }

  /* ---------- Showroom filtering (category + live search, combined) ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn:not(.faq-tag)');
  const vehicleCards = document.querySelectorAll('.vehicle-grid .vehicle-card');
  const showroomSearch = document.getElementById('showroomSearch');
  const showroomEmpty = document.getElementById('showroomEmpty');

  const applyShowroomFilter = () => {
    const activeBtn = document.querySelector('.filter-bar .filter-btn.active');
    const filter = activeBtn?.dataset.filter || 'all';
    const q = (showroomSearch?.value || '').toLowerCase().trim();
    let visible = 0;
    vehicleCards.forEach(card => {
      const cats = (card.dataset.category || '').split(' ');
      const name = card.dataset.name || '';
      const matchesFilter = filter === 'all' || cats.includes(filter);
      const matchesQuery = !q || name.includes(q);
      const show = matchesFilter && matchesQuery;
      card.hidden = !show;
      if (show) visible++;
    });
    showroomEmpty?.classList.toggle('show', visible === 0);
  };
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyShowroomFilter();
    });
  });
  showroomSearch?.addEventListener('input', applyShowroomFilter);
  if (vehicleCards.length) applyShowroomFilter();

  /* ---------- Vehicle detail: prefill workshop booking via query param ---------- */
  const vehicleParam = new URLSearchParams(window.location.search).get('vehicle');
  if (vehicleParam) {
    const bookVehicle = document.getElementById('bookVehicle');
    if (bookVehicle) bookVehicle.value = vehicleParam;
  }

  /* ---------- Parts category filter + live search ---------- */
  const partsCats = document.querySelectorAll('.parts-cat');
  const partsSearch = document.getElementById('partsSearchBox');
  const partCards = document.querySelectorAll('.parts-grid .part-card');
  const partsEmpty = document.getElementById('partsEmpty');

  const applyPartsFilter = () => {
    const activeCat = document.querySelector('.parts-cat.active')?.dataset.cat || 'all';
    const q = (partsSearch?.value || '').toLowerCase().trim();
    let visible = 0;
    partCards.forEach(card => {
      const matchesCat = activeCat === 'all' || card.dataset.category === activeCat;
      const matchesQuery = !q || card.dataset.name.includes(q);
      const show = matchesCat && matchesQuery;
      card.hidden = !show;
      if (show) visible++;
    });
    partsEmpty?.classList.toggle('show', visible === 0);
  };
  partsCats.forEach(cat => {
    cat.addEventListener('click', () => {
      partsCats.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      applyPartsFilter();
    });
  });
  partsSearch?.addEventListener('input', applyPartsFilter);
  if (partCards.length) applyPartsFilter();

  /* ---------- Cart / wishlist tabs (cart.html) ---------- */
  document.querySelectorAll('[data-cart-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-cart-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.cart-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(btn.dataset.cartTab)?.classList.add('active');
    });
  });
  if (window.location.hash === '#wishlist') {
    document.querySelector('[data-cart-tab="wishlistPanel"]')?.click();
  }

  /* ---------- FAQ search + tag filter ---------- */
  const faqSearch = document.getElementById('faqSearch');
  const faqItems = document.querySelectorAll('.faq-item');
  const faqTags = document.querySelectorAll('.faq-tag');
  const faqEmpty = document.getElementById('faqEmpty');

  const filterFaq = () => {
    const q = (faqSearch?.value || '').toLowerCase().trim();
    const activeTag = document.querySelector('.faq-tag.active')?.dataset.tag || 'all';
    let visible = 0;
    faqItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const tags = (item.dataset.tags || '').split(',');
      const matchesTag = activeTag === 'all' || tags.includes(activeTag);
      const matchesQuery = !q || text.includes(q);
      const show = matchesTag && matchesQuery;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    faqEmpty?.classList.toggle('show', visible === 0);
  };
  faqSearch?.addEventListener('input', filterFaq);
  faqTags.forEach(tag => tag.addEventListener('click', () => {
    faqTags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    filterFaq();
  }));

  /* ---------- Forms: submit to Web3Forms (falls back to mailto until access keys are set, see WEB3FORMS_KEYS) ---------- */
  const wireForm = (formId, toEmail, subjectPrefix, keyName) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const success = form.querySelector('.form-success');
      const subject = `${subjectPrefix}: ${data.get('name') || 'Website enquiry'}`;

      const accessKey = WEB3FORMS_KEYS[keyName];
      if (!accessKey || accessKey.startsWith('YOUR_')) {
        console.warn(`[Guardian Motors] Web3Forms access key for "${keyName}" is not configured yet; falling back to mailto. See js/app.js WEB3FORMS_KEYS.`);
        const lines = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join('\n');
        window.location.href = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
        success?.classList.add('show');
        showToast('Enquiry ready. Opening your email app to send it to Guardian Motors.');
        form.reset();
        setTimeout(() => success?.classList.remove('show'), 6000);
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.originalText = submitBtn.textContent; submitBtn.textContent = 'Sending...'; }
      try {
        const result = await submitFormToWeb3Forms(data, accessKey, subject);
        if (result.success) {
          success?.classList.add('show');
          showToast('Thanks! Your request has been sent to Guardian Motors.');
          form.reset();
          setTimeout(() => success?.classList.remove('show'), 6000);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('[Guardian Motors] Form submission failed:', err);
        showToast(`Couldn't send automatically. Please call ${'+260 211 228778'} or WhatsApp us instead.`);
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.originalText; }
      }
    });
  };
  wireForm('bookingForm', 'service@guardianmotors.co.zm', 'Service Booking', 'service');
  wireForm('partsForm', 'parts@guardianmotors.co.zm', 'Parts Order Request', 'parts');
  wireForm('contactForm', 'sales@guardianmotors.co.zm', 'Website Enquiry', 'sales');

  /* ---------- Toast ---------- */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 4200);
  }
  window.gmToast = showToast;

  /* ---------- PWA install ---------- */
  let deferredPrompt = null;
  const installBtn = document.getElementById('installBtn');
  const installBtnHero = document.getElementById('installBtnHero');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  const showInstallUI = () => {
    if (isStandalone) return;
    installBtn?.classList.add('show');
    installBtnHero?.removeAttribute('hidden');
  };

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallUI();
  });

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (outcome === 'accepted') {
        showToast('Guardian Motors app installed. Find it on your home screen.');
        installBtn?.classList.remove('show');
        installBtnHero?.setAttribute('hidden', '');
      }
    } else if (isIOS) {
      document.getElementById('iosModal')?.classList.add('open');
    } else {
      showToast('Open this site in Chrome or Edge, then use the browser menu to Install App.');
    }
  };
  installBtn?.addEventListener('click', triggerInstall);
  installBtnHero?.addEventListener('click', triggerInstall);
  document.getElementById('installBtnBanner')?.addEventListener('click', triggerInstall);

  document.getElementById('iosModalClose')?.addEventListener('click', () => {
    document.getElementById('iosModal')?.classList.remove('open');
  });
  document.getElementById('iosModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'iosModal') e.currentTarget.classList.remove('open');
  });

  window.addEventListener('appinstalled', () => {
    showToast('Installed! Guardian Motors is now on your home screen.');
    installBtn?.classList.remove('show');
    installBtnHero?.setAttribute('hidden', '');
  });

  // iOS never fires beforeinstallprompt, so show the button so users can get instructions.
  if (isIOS && !isStandalone) showInstallUI();

  /* ---------- Service worker registration ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
