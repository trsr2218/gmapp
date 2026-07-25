/* Guardian Motors Limited: static multi-page site generator.
   Run with: node scripts/build.js
   Reads the shared catalog from js/data.js and writes real, separate
   HTML pages (not a single-page scroller) with a shared header/footer. */
const fs = require('fs');
const path = require('path');
const { VEHICLES, PART_CATEGORIES, PARTS } = require('../js/data.js');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://www.guardianmotors.co.zm';

/* ---------------------------------------------------------------- icons */
const ICON = {
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"/><path d="m9 12 2 2 4-4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.2 1.6 6.6 4.6 5.2c2.1-1 4.4-.3 5.9 1.4L12 8.2l1.5-1.6c1.5-1.7 3.8-2.4 5.9-1.4 3 1.4 3.8 5 1.9 7.7C18.7 16.65 12 21 12 21Z"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.3 11.4a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20.5 7H6"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="m4 4 8 8 8-8"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5 17V9l2-5h10l2 5v8"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 0-5.4 5.4L2 19l3 3 7.3-7.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z"/></svg>',
  parts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
  contact: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2"/><path d="M23 13v-2l-2-1"/></svg>',
  seat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
  moto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.29 4.93L2.05 22l5.32-1.39c1.4.77 3 1.2 4.67 1.2 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.02.24-3.43-.72-2.9-1.15-4.76-4.1-4.9-4.29-.14-.19-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.26-.28.57-.35.76-.35h.55c.18 0 .42-.02.64.5.24.57.82 1.98.9 2.12.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.16-.3.36-.42.48-.14.14-.29.29-.13.57.17.28.75 1.24 1.6 2.01 1.1 1 2.03 1.31 2.31 1.46.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.09 1.66.78 1.94.93.28.14.47.21.54.33.07.12.07.68-.17 1.36Z"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  install: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
};

/* ---------------------------------------------------------------- nav config */
const NAV = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'showroom', label: 'Showroom', href: '/showroom.html', mega: 'megaShowroom' },
  { key: 'workshop', label: 'Workshop', href: '/workshop.html' },
  { key: 'parts', label: 'Parts', href: '/parts.html' },
  { key: 'about', label: 'About', href: '/about.html' },
  { key: 'faq', label: 'FAQ', href: '/faq.html' },
  { key: 'contact', label: 'Contact', href: '/contact.html' },
];

const CAR_MODELS = VEHICLES.filter((v) => v.category.includes('car') || v.category.includes('suv') || v.category.includes('commercial'));
const MOTO_MODELS = VEHICLES.filter((v) => v.category.includes('moto'));

/* ---------------------------------------------------------------- head */
function head({ title, description, path: pagePath, jsonLd, ogImage }) {
  const canonical = `${SITE}${pagePath}`;
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Guardian Motors Limited">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${SITE}${ogImage || '/assets/img/vitara-hero.jpg'}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_ZM">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="theme-color" content="#0b0b0c">
<link rel="manifest" href="/manifest.json">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png">
<link rel="apple-touch-icon" href="/icons/icon-192-maskable.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Guardian Motors">
<meta name="mobile-web-app-capable" content="yes">
<meta name="robots" content="index, follow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}`;
}

/* ---------------------------------------------------------------- header/footer */
function megaShowroom() {
  const col = (title, list) => `<div><h4>${title}</h4><ul>${list.map((v) => `<li><a href="/cars/${v.id}.html">${v.name}</a></li>`).join('')}</ul></div>`;
  return `<div class="mega-menu" id="megaShowroom">
    ${col('Motor Vehicles', CAR_MODELS)}
    ${col('Motorcycles', MOTO_MODELS)}
    <div class="mega-menu__cta">
      <span>Browse the full range with filters</span>
      <a class="btn btn--red btn--sm" href="/showroom.html">View Showroom</a>
    </div>
  </div>`;
}

function header(active) {
  const navLinks = NAV.map((n) => {
    if (n.mega) {
      return `<div class="mega-menu-wrap">
        <button type="button" data-menu-toggle="${n.mega}" aria-expanded="false" class="${active === n.key ? 'active' : ''}">${n.label} ${ICON.chev}</button>
        ${megaShowroom()}
      </div>`;
    }
    return `<a href="${n.href}" class="${active === n.key ? 'active' : ''}">${n.label}</a>`;
  }).join('\n      ');

  return `<header class="site-header">
  <div class="container">
    <a href="/" class="brand" aria-label="Guardian Motors home">
      <span class="brand__mark">${ICON.shield}</span>
      <span class="brand__text"><strong>GUARDIAN MOTORS</strong><span>Authorised Suzuki Dealer</span></span>
    </a>

    <nav class="nav-desktop" aria-label="Primary">
      ${navLinks}
    </nav>

    <div class="header-search">
      <form role="search" action="/showroom.html" method="get">
        <button type="button" class="search-icon-btn" data-search-icon aria-label="Toggle search">${ICON.search}</button>
        <input type="search" name="q" placeholder="Search vehicles or parts..." data-search-input autocomplete="off">
      </form>
      <div class="search-panel" data-search-panel></div>
    </div>

    <div class="header-actions">
      <button id="installBtn" class="icon-btn" aria-label="Install Guardian Motors app" title="Install app">${ICON.install}</button>
      <a href="/cart.html#wishlist" class="icon-btn desktop-only" aria-label="Wishlist">${ICON.heart}<span class="badge-count" data-wishlist-count>0</span></a>
      <a href="/cart.html" class="icon-btn desktop-only" aria-label="Enquiry cart">${ICON.cart}<span class="badge-count" data-cart-count>0</span></a>
      <a class="btn btn--red btn--sm" href="/workshop.html#booking">Book a Service</a>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>

<nav class="mobile-nav" aria-label="Mobile">
  <a href="/">Home</a>
  <a href="/showroom.html">Showroom</a>
  <a href="/workshop.html">Workshop</a>
  <a href="/parts.html">Parts</a>
  <a href="/about.html">About</a>
  <a href="/faq.html">FAQ</a>
  <a href="/contact.html">Contact</a>
  <a href="/cart.html">Enquiry Cart (<span data-cart-count>0</span>)</a>
  <a href="/cart.html#wishlist">Wishlist (<span data-wishlist-count>0</span>)</a>
  <a href="tel:+260211228778">Call: 0211 228 778</a>
  <a class="btn btn--red btn--block" href="/workshop.html#booking">Book a Service</a>
</nav>`;
}

function pageBanner({ eyebrow, title, description, crumb }) {
  return `<section class="page-banner">
    <div class="container">
      <div class="breadcrumbs"><a href="/">Home</a><span>/</span><span>${crumb}</span></div>
      <p class="eyebrow" style="color:var(--gm-red-light)">${eyebrow}</p>
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
  </section>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="brand">
          <span class="brand__mark">${ICON.shield}</span>
          <span class="brand__text"><strong>GUARDIAN MOTORS</strong><span>Authorised Suzuki Dealer</span></span>
        </a>
        <p>Zambia's authorised Suzuki and Maruti Suzuki distributor since 1969. Showrooms and workshops in Lusaka and Ndola.</p>
        <div class="footer-social">
          <a class="icon-btn" href="https://wa.me/260777407110" aria-label="WhatsApp">${ICON.whatsapp}</a>
          <a class="icon-btn" href="tel:+260211228778" aria-label="Call">${ICON.phone}</a>
          <a class="icon-btn" href="mailto:guardian@iconnect.zm" aria-label="Email">${ICON.mail}</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <ul>
          <li><a href="/showroom.html">Showroom</a></li>
          <li><a href="/workshop.html">Workshop &amp; Booking</a></li>
          <li><a href="/parts.html">Genuine Parts</a></li>
          <li><a href="/about.html">About Us</a></li>
          <li><a href="/faq.html">FAQs</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Lusaka Showroom</h4>
        <ul>
          <li>Kabelenga Rd / Tuleteka Rd</li>
          <li><a href="tel:+260211228778">+260 211 228778</a></li>
          <li><a href="mailto:sales@guardianmotors.co.zm">sales@guardianmotors.co.zm</a></li>
          <li>Mon to Fri 08:00 to 17:00, Sat 08:00 to 13:00</li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Ndola Showroom</h4>
        <ul>
          <li>Broadway / Shinde Street</li>
          <li><a href="tel:+260212621012">+260 212 621012</a></li>
          <li><a href="mailto:smsndola@iconnect.zm">smsndola@iconnect.zm</a></li>
          <li>Mon to Fri 08:00 to 17:00, Sat 08:00 to 13:00</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="year"></span> Guardian Motors Limited. All rights reserved.</span>
      <span>Authorised distributor of Suzuki &amp; Maruti Suzuki in Zambia since 1969.</span>
    </div>
  </div>
</footer>

<a class="wa-float" href="https://wa.me/260777407110" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${ICON.whatsapp}</a>

<div class="toast" id="toast">${ICON.check}<span>Message</span></div>

<div class="modal-overlay" id="iosModal">
  <div class="modal">
    <button class="modal-close" id="iosModalClose" aria-label="Close">${ICON.close}</button>
    <h3>Install Guardian Motors</h3>
    <ol>
      <li>Tap the <strong>Share</strong> icon in Safari's toolbar.</li>
      <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
      <li>Tap <strong>Add</strong>. Guardian Motors is now on your home screen.</li>
    </ol>
  </div>
</div>

<script src="/js/data.js"></script>
<script src="/js/shop.js"></script>
<script src="/js/app.js"></script>`;
}

function page({ title, description, path: pagePath, active, content, jsonLd, ogImage, bodyId }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head({ title, description, path: pagePath, jsonLd, ogImage })}
</head>
<body${bodyId ? ` id="${bodyId}"` : ''}>
<a class="skip-link" href="#main">Skip to content</a>
${header(active)}
<main id="main">
${content}
</main>
${footer()}
</body>
</html>
`;
}

/* ---------------------------------------------------------------- shared bits */
function vehicleCard(v) {
  return `<article class="vehicle-card card" data-category="${v.category.join(' ')}" data-name="${v.name.toLowerCase()}">
    <div class="vehicle-card__media">
      <span class="vehicle-card__tag pill pill--red">${v.tag}</span>
      <button class="wish-btn" data-wishlist-toggle="${v.id}" aria-label="Save ${v.name} to wishlist" aria-pressed="false">${ICON.heart}</button>
      <a href="/cars/${v.id}.html"><img src="${v.thumb}" alt="${v.name}" loading="lazy" width="500" height="375"></a>
    </div>
    <div class="vehicle-card__body">
      <h3><a href="/cars/${v.id}.html">${v.name}</a></h3>
      <p>${v.blurb}</p>
      <div class="vehicle-card__meta">
        <span>${ICON.fuel}${v.fuel}</span>
        <span>${ICON.seat}${v.seats}-Seater</span>
      </div>
      <div class="vehicle-card__actions">
        <a class="btn btn--outline-dark btn--sm" href="/cars/${v.id}.html">Details</a>
        <button class="btn btn--dark btn--sm" data-cart-add="vehicle:${v.id}" data-default-label="Add to Enquiry">Add to Enquiry</button>
      </div>
    </div>
  </article>`;
}

function faqItem({ q, a, tags }) {
  return `<details class="faq-item" data-tags="${tags}">
    <summary>${q}<span class="plus"></span></summary>
    <div class="faq-item__content">${a}</div>
  </details>`;
}

const FAQS = [
  { q: 'Where are Guardian Motors showrooms located?', tags: 'general,sales', a: 'We have two showrooms: our head office in <strong>Lusaka</strong>, on the corner of Kabelenga Road and Tuleteka Road, and our <strong>Ndola</strong> branch, trading as Sundat Motor Sales, on the corner of Broadway and Shinde Street.' },
  { q: 'Can I buy a car on Nkongole (instalments)?', tags: 'sales', a: 'Yes. Guardian Motors offers Suzuki vehicles on Nkongole financing terms. Speak to our Lusaka sales desk for current requirements, deposit amounts and monthly instalment options.' },
  { q: 'Are your spare parts genuine?', tags: 'parts', a: 'Every part we sell and fit is 100% genuine Suzuki or Maruti Suzuki stock, sourced directly through the official distributor network, never aftermarket substitutes.' },
  { q: 'How do I book a service appointment?', tags: 'service', a: 'Use the <a href="/workshop.html#booking">Book a Service</a> form, call our Lusaka switchboard on 0211 228 778, or WhatsApp us on +260 777 407 110. Our service desk will confirm your slot by phone or email.' },
  { q: 'Do you service vehicles other than Suzuki?', tags: 'service', a: 'Our Lusaka workshop also provides fleet servicing for Nissan vehicles, alongside full servicing for the entire Suzuki car and motorcycle range.' },
  { q: 'What are your opening hours?', tags: 'general', a: 'Both showrooms are open Monday to Friday, 8:00am to 5:00pm, and Saturday, 8:00am to 1:00pm. Our Lusaka Parts &amp; Service counter opens slightly earlier, from 7:30am on weekdays.' },
  { q: "How do I order a part if I don't know the part number?", tags: 'parts', a: 'No problem. Browse the <a href="/parts.html">Genuine Parts</a> catalogue by category, add what you need to your enquiry list, or tell us your vehicle\'s chassis and engine number and describe the part. Our parts desk will identify and quote the correct genuine component.' },
  { q: 'Which brands does Guardian Motors distribute?', tags: 'sales', a: 'We are the authorised Zambian distributor for Suzuki Motor Corporation and Maruti Suzuki India Ltd, covering passenger cars, SUVs, commercial vehicles and motorcycles.' },
  { q: 'How long has Guardian Motors been in business?', tags: 'general', a: 'Guardian Motors Limited was established in 1969, over 55 years as a proudly Zambian-owned motor company.' },
  { q: 'Does servicing at Guardian Motors affect my warranty?', tags: 'service', a: 'No. Servicing with genuine parts at an authorised Guardian Motors workshop keeps your Suzuki manufacturer warranty fully valid.' },
  { q: 'Can I save vehicles to look at later?', tags: 'general,sales', a: 'Yes. Tap the heart icon on any vehicle to save it to your wishlist, or "Add to Enquiry" to build a list to send our sales team in one message. Find both on the <a href="/cart.html">enquiry cart</a> page.' },
];

module.exports = { ROOT, SITE, ICON, NAV, CAR_MODELS, MOTO_MODELS, head, header, footer, page, pageBanner, vehicleCard, faqItem, FAQS, VEHICLES, PART_CATEGORIES, PARTS };
