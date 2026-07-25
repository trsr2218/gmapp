/* Guardian Motors Limited: cart, wishlist and search
   Requires js/data.js to be loaded first. */
(() => {
  'use strict';

  const CART_KEY = 'gm_cart';
  const WISHLIST_KEY = 'gm_wishlist';

  const readStore = (key) => {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  };
  const writeStore = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  const getCart = () => readStore(CART_KEY);
  const getWishlist = () => readStore(WISHLIST_KEY);

  function cartCount() {
    return getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
  }
  function wishlistCount() { return getWishlist().length; }

  function addToCart(type, id, qty = 1) {
    const cart = getCart();
    const existing = cart.find((i) => i.type === type && i.id === id);
    if (existing) existing.qty = (existing.qty || 1) + (type === 'part' ? qty : 0);
    else cart.push({ type, id, qty: type === 'part' ? qty : 1 });
    writeStore(CART_KEY, cart);
    renderBadges();
    return cart;
  }
  function removeFromCart(type, id) {
    writeStore(CART_KEY, getCart().filter((i) => !(i.type === type && i.id === id)));
    renderBadges();
  }
  function setCartQty(type, id, qty) {
    const cart = getCart();
    const item = cart.find((i) => i.type === type && i.id === id);
    if (item) item.qty = Math.max(1, qty);
    writeStore(CART_KEY, cart);
    renderBadges();
  }
  function clearCart() { writeStore(CART_KEY, []); renderBadges(); }

  function toggleWishlist(id) {
    const list = getWishlist();
    const idx = list.indexOf(id);
    if (idx > -1) list.splice(idx, 1);
    else list.push(id);
    writeStore(WISHLIST_KEY, list);
    renderBadges();
    return idx === -1;
  }
  function isWishlisted(id) { return getWishlist().includes(id); }

  function renderBadges() {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      const n = cartCount();
      el.textContent = n;
      el.classList.toggle('show', n > 0);
    });
    document.querySelectorAll('[data-wishlist-count]').forEach((el) => {
      const n = wishlistCount();
      el.textContent = n;
      el.classList.toggle('show', n > 0);
    });
    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      const id = btn.dataset.wishlistToggle;
      btn.classList.toggle('is-active', isWishlisted(id));
      btn.setAttribute('aria-pressed', isWishlisted(id));
    });
    document.querySelectorAll('[data-cart-add]').forEach((btn) => {
      const [type, id] = btn.dataset.cartAdd.split(':');
      const inCart = getCart().some((i) => i.type === type && i.id === id);
      if (btn.dataset.cartLabel !== 'false') {
        btn.textContent = inCart ? 'Added to Enquiry ✓' : (btn.dataset.defaultLabel || 'Add to Enquiry');
      }
    });
  }

  /* ---------- Delegated add-to-cart / wishlist buttons ---------- */
  document.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('[data-cart-add]');
    if (cartBtn) {
      const [type, id] = cartBtn.dataset.cartAdd.split(':');
      const qtyInput = cartBtn.closest('.qty-field, form')?.querySelector('[data-qty-input]');
      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      addToCart(type, id, qty);
      if (window.gmToast) window.gmToast(type === 'vehicle' ? 'Added to your enquiry list.' : 'Part added to your enquiry list.');
    }
    const wishBtn = e.target.closest('[data-wishlist-toggle]');
    if (wishBtn) {
      const id = wishBtn.dataset.wishlistToggle;
      const added = toggleWishlist(id);
      if (window.gmToast) window.gmToast(added ? 'Saved to your wishlist.' : 'Removed from your wishlist.');
    }
    const removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      const [type, id] = removeBtn.dataset.cartRemove.split(':');
      removeFromCart(type, id);
      renderCartPage();
    }
    const qtyBtn = e.target.closest('[data-qty-step]');
    if (qtyBtn) {
      const [type, id] = qtyBtn.dataset.qtyFor.split(':');
      const step = parseInt(qtyBtn.dataset.qtyStep, 10);
      const cart = getCart();
      const item = cart.find((i) => i.type === type && i.id === id);
      if (item) { setCartQty(type, id, (item.qty || 1) + step); renderCartPage(); }
    }
  });

  /* ---------- Cart page rendering ---------- */
  function renderCartPage() {
    const cartWrap = document.getElementById('cartItems');
    const wishWrap = document.getElementById('wishlistItems');
    if (!cartWrap && !wishWrap) return;

    if (cartWrap) {
      const cart = getCart();
      if (!cart.length) {
        cartWrap.innerHTML = '<p class="cart-empty">Your enquiry list is empty. Browse the <a href="/showroom.html">showroom</a> or <a href="/parts.html">genuine parts</a> to add items.</p>';
      } else {
        cartWrap.innerHTML = cart.map((item) => {
          if (item.type === 'vehicle') {
            const v = findVehicle(item.id);
            if (!v) return '';
            return `<div class="cart-row">
              <img src="${v.thumb}" alt="${v.name}" loading="lazy" width="90" height="68">
              <div class="cart-row__body"><strong>${v.name}</strong><span>${v.type}, vehicle enquiry</span></div>
              <button class="icon-btn icon-btn--ghost" data-cart-remove="vehicle:${v.id}" aria-label="Remove ${v.name}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>`;
          }
          const p = findPart(item.id);
          if (!p) return '';
          return `<div class="cart-row">
            <div class="cart-row__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8"/></svg></div>
            <div class="cart-row__body"><strong>${p.name}</strong><span>Fits: ${p.compatible}</span></div>
            <div class="qty-stepper">
              <button data-qty-step="-1" data-qty-for="part:${p.id}" aria-label="Decrease quantity">&minus;</button>
              <span>${item.qty || 1}</span>
              <button data-qty-step="1" data-qty-for="part:${p.id}" aria-label="Increase quantity">+</button>
            </div>
            <button class="icon-btn icon-btn--ghost" data-cart-remove="part:${p.id}" aria-label="Remove ${p.name}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>`;
        }).join('');
      }
    }

    if (wishWrap) {
      const list = getWishlist();
      if (!list.length) {
        wishWrap.innerHTML = '<p class="cart-empty">No saved vehicles yet. Tap the heart icon on any vehicle to save it here.</p>';
      } else {
        wishWrap.innerHTML = list.map((id) => {
          const v = findVehicle(id);
          if (!v) return '';
          return `<div class="cart-row">
            <img src="${v.thumb}" alt="${v.name}" loading="lazy" width="90" height="68">
            <div class="cart-row__body"><strong>${v.name}</strong><span>${v.type}</span></div>
            <a class="btn btn--ghost btn--sm" href="/cars/${v.id}.html">View</a>
            <button class="icon-btn icon-btn--ghost" data-wishlist-toggle="${v.id}" aria-label="Remove ${v.name} from wishlist">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.2 1.6 6.6 4.6 5.2c2.1-1 4.4-.3 5.9 1.4L12 8.2l1.5-1.6c1.5-1.7 3.8-2.4 5.9-1.4 3 1.4 3.8 5 1.9 7.7C18.7 16.65 12 21 12 21Z"/></svg>
            </button>
          </div>`;
        }).join('');
      }
    }

    const totalEl = document.getElementById('cartTotalCount');
    if (totalEl) totalEl.textContent = cartCount();
  }

  document.getElementById('cartEnquiryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cart = getCart();
    if (!cart.length) { if (window.gmToast) window.gmToast('Add at least one vehicle or part first.'); return; }
    const form = e.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const lines = cart.map((item) => {
      if (item.type === 'vehicle') { const v = findVehicle(item.id); return v ? `Vehicle: ${v.name}` : ''; }
      const p = findPart(item.id); return p ? `Part: ${p.name} x${item.qty || 1} (fits ${p.compatible})` : '';
    }).filter(Boolean).join('\n');
    const data = new FormData(form);
    const name = data.get('name') || 'website visitor';
    const subject = `Enquiry list from ${name}`;
    const submitBtn = form.querySelector('button[type="submit"]');
    const accessKey = window.WEB3FORMS_KEYS?.sales;

    if (!accessKey || accessKey.startsWith('YOUR_')) {
      console.warn('[Guardian Motors] Web3Forms access key for "sales" is not configured yet; falling back to mailto. See js/app.js WEB3FORMS_KEYS.');
      const body = encodeURIComponent(`Name: ${name}\nPhone: ${data.get('phone')}\nEmail: ${data.get('email')}\n\nItems:\n${lines}\n\nNotes:\n${data.get('notes') || ''}`);
      window.location.href = `mailto:sales@guardianmotors.co.zm?subject=${encodeURIComponent(subject)}&body=${body}`;
      if (window.gmToast) window.gmToast('Opening your email app with your full enquiry list.');
      return;
    }

    data.set('items', lines);
    if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.originalText = submitBtn.textContent; submitBtn.textContent = 'Sending...'; }
    try {
      const result = await window.submitFormToWeb3Forms(data, accessKey, subject);
      if (result.success) {
        if (window.gmToast) window.gmToast('Thanks! Your enquiry list has been sent to Guardian Motors.');
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('[Guardian Motors] Cart enquiry submission failed:', err);
      if (window.gmToast) window.gmToast("Couldn't send automatically. Please call +260 211 228778 or WhatsApp us instead.");
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.originalText; }
    }
  });

  /* ---------- Header live search ---------- */
  function buildSearchIndex() {
    const vehicles = (typeof VEHICLES !== 'undefined' ? VEHICLES : []).map((v) => ({
      type: 'vehicle', id: v.id, name: v.name, sub: v.type, img: v.thumb, url: `/cars/${v.id}.html`,
      haystack: `${v.name} ${v.type} ${v.category.join(' ')}`.toLowerCase(),
    }));
    const parts = (typeof PARTS !== 'undefined' ? PARTS : []).map((p) => ({
      type: 'part', id: p.id, name: p.name, sub: p.compatible, img: null, url: `/parts.html?cat=${p.category}&q=${encodeURIComponent(p.name)}`,
      haystack: `${p.name} ${p.compatible} ${p.category}`.toLowerCase(),
    }));
    return vehicles.concat(parts);
  }

  function wireHeaderSearch() {
    const input = document.querySelector('[data-search-input]');
    const panel = document.querySelector('[data-search-panel]');
    const wrap = document.querySelector('.header-search');
    const iconBtn = document.querySelector('[data-search-icon]');
    if (!input || !panel) return;
    const index = buildSearchIndex();

    iconBtn?.addEventListener('click', (e) => {
      const isExpanded = wrap.classList.contains('expanded');
      if (!isExpanded && getComputedStyle(iconBtn).pointerEvents !== 'none') {
        // Only intercept on breakpoints where the icon collapses the bar (checked via input visibility).
        const inputHidden = getComputedStyle(input).display === 'none';
        if (inputHidden) {
          e.preventDefault();
          wrap.classList.add('expanded');
          setTimeout(() => input.focus(), 50);
        }
      }
    });
    document.addEventListener('click', (e) => {
      if (wrap && !e.target.closest('.header-search')) wrap.classList.remove('expanded');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') wrap?.classList.remove('expanded');
    });

    const render = (q) => {
      const query = q.trim().toLowerCase();
      if (!query) { panel.innerHTML = ''; panel.classList.remove('open'); return; }
      const results = index.filter((item) => item.haystack.includes(query)).slice(0, 7);
      if (!results.length) {
        panel.innerHTML = '<div class="search-empty">No matches. Try "Vitara", "brake pads" or "Ertiga".</div>';
      } else {
        panel.innerHTML = results.map((r) => `
          <a class="search-result" href="${r.url}">
            ${r.img ? `<img src="${r.img}" alt="" loading="lazy" width="44" height="34">` : '<span class="search-result__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/></svg></span>'}
            <span><strong>${r.name}</strong><span>${r.sub}</span></span>
            <span class="pill ${r.type === 'vehicle' ? 'pill--red' : 'pill--blue'}">${r.type === 'vehicle' ? 'Vehicle' : 'Part'}</span>
          </a>`).join('');
      }
      panel.classList.add('open');
    };

    input.addEventListener('input', () => render(input.value));
    input.addEventListener('focus', () => { if (input.value) render(input.value); });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-search')) panel.classList.remove('open');
    });
    input.closest('form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (q) window.location.href = `/showroom.html?q=${encodeURIComponent(q)}`;
    });
  }

  /* ---------- Category mega-menu (mobile tap-to-open) ---------- */
  function wireCategoryMenu() {
    document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById(btn.dataset.menuToggle);
        const isOpen = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
      });
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mega-menu-wrap')) {
        document.querySelectorAll('.mega-menu.open').forEach((m) => m.classList.remove('open'));
      }
    });
  }

  /* ---------- Showroom / parts query param support (?cat=, ?q=) ---------- */
  function applyQueryFilters() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    const q = params.get('q');
    if (cat) {
      const btn = document.querySelector(`.filter-btn[data-filter="${cat}"], .parts-cat[data-cat="${cat}"]`);
      btn?.click();
    }
    if (q) {
      const search = document.getElementById('showroomSearch') || document.getElementById('partsSearchBox');
      if (search) { search.value = q; search.dispatchEvent(new Event('input')); }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderBadges();
    renderCartPage();
    wireHeaderSearch();
    wireCategoryMenu();
    applyQueryFilters();
  });

  window.gmShop = { addToCart, removeFromCart, setCartQty, clearCart, toggleWishlist, isWishlisted, getCart, getWishlist, cartCount, wishlistCount, renderBadges };
})();
