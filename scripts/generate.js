/* Guardian Motors Limited: writes every static page using build.js helpers. */
const fs = require('fs');
const path = require('path');
const {
  ROOT, SITE, ICON, VEHICLES, PART_CATEGORIES, PARTS,
  page, pageBanner, vehicleCard, faqItem, FAQS,
} = require('./build.js');

const write = (rel, html) => {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  console.log('wrote', rel);
};

/* ================================================================== HOME */
const FEATURED_IDS = ['new-vitara', 'suzuki-ertiga', 'alto-k10', 'suzuki-dr-200se'];
const featured = FEATURED_IDS.map((id) => VEHICLES.find((v) => v.id === id));

const homeContent = `
<section id="home" class="hero">
  <div class="hero__bg" style="background-image:url('/assets/img/vitara-hero.webp')" role="img" aria-label="Suzuki Vitara on an open road at sunset"></div>
  <div class="hero__scrim"></div>
  <div class="container hero__content">
    <div class="hero__badges">
      <span class="pill pill--light">Authorised Suzuki &amp; Maruti Suzuki Distributor</span>
      <span class="pill pill--light">Zambian-owned since 1969</span>
    </div>
    <h1>Drive with a <em>Guardian</em>.<br>Zambia's home of Suzuki.</h1>
    <p class="lead">New vehicles and motorcycles, manufacturer-trained servicing and 100% genuine parts. From Lusaka to Ndola, for over 55 years.</p>
    <div class="hero__cta">
      <a href="/showroom.html" class="btn btn--red">Browse the Showroom</a>
      <a href="/workshop.html#booking" class="btn btn--outline">Book a Service</a>
      <button id="installBtnHero" class="btn btn--outline" hidden>${ICON.install} Install App</button>
    </div>
    <div class="hero__stats">
      <div><strong class="count-up" data-count="55" data-suffix="+">0</strong><span>Years in Zambia</span></div>
      <div><strong class="count-up" data-count="2" data-suffix="">0</strong><span>Showrooms</span></div>
      <div><strong class="count-up" data-count="100" data-suffix="%">0</strong><span>Genuine Parts</span></div>
      <div><strong class="count-up" data-count="9" data-suffix="+">0</strong><span>Models Available</span></div>
    </div>
  </div>
  <a href="#quick" class="scroll-cue" aria-hidden="true"><span></span>Scroll</a>
</section>

<div id="quick" class="container quick-actions reveal">
  <div class="quick-actions__grid">
    <a href="/showroom.html" class="quick-actions__item">
      <span class="quick-actions__icon">${ICON.car}</span>
      <span><strong>Our Showroom</strong><span>New Suzuki cars &amp; bikes</span></span>
    </a>
    <a href="/workshop.html#booking" class="quick-actions__item">
      <span class="quick-actions__icon">${ICON.wrench}</span>
      <span><strong>Book a Service</strong><span>Lusaka or Ndola workshop</span></span>
    </a>
    <a href="/parts.html" class="quick-actions__item">
      <span class="quick-actions__icon">${ICON.parts}</span>
      <span><strong>Order Parts</strong><span>Genuine Suzuki spares</span></span>
    </a>
    <a href="/contact.html" class="quick-actions__item">
      <span class="quick-actions__icon">${ICON.contact}</span>
      <span><strong>Contact Us</strong><span>Talk to our team</span></span>
    </a>
  </div>
</div>

<div class="container" style="margin-top:56px;">
  <div class="promo reveal">
    <div class="promo__text">
      <strong>100% Genuine Suzuki Parts, Fitted by Trained Technicians</strong>
      <span>Nissan fleet servicing also available at our Lusaka workshop.</span>
    </div>
    <div class="promo__actions"><a href="/parts.html" class="btn btn--dark">Order Genuine Parts</a></div>
  </div>
</div>

<section class="section">
  <div class="container about-grid">
    <div class="about-media reveal">
      <img src="/assets/img/slide1.webp" alt="Guardian Motors showroom forecourt in Lusaka, Zambia" loading="lazy" width="1200" height="800">
      <div class="about-media__badge"><strong class="count-up" data-count="55" data-suffix="+">0</strong><span>Years serving<br>Zambian drivers</span></div>
    </div>
    <div class="about-copy reveal">
      <p class="eyebrow">About Guardian Motors</p>
      <h2>A Zambian-owned name drivers have trusted since 1969</h2>
      <p>Guardian Motors Limited is a proudly Zambian-owned company and the official distributor of new Suzuki vehicles and Suzuki motorcycles, alongside genuine Maruti Suzuki India Ltd models. For more than five decades we've helped customers across Zambia drive away in a prestigious new vehicle they can enjoy for years to come.</p>
      <p>Beyond sales, our fully equipped workshops in Lusaka and Ndola provide manufacturer-standard after-sales service for individual owners and corporate fleets alike, including Nissan fleet servicing, backed by genuine spare parts for every vehicle and motorcycle we sell.</p>
      <a href="/about.html" class="btn btn--outline-dark">Read Our Story</a>
    </div>
  </div>
</section>

<section class="section section--gray">
  <div class="container">
    <div class="section-head center reveal">
      <p class="eyebrow" style="justify-content:center">Featured Models</p>
      <h2>A taste of the range</h2>
      <p>From city runabouts to family SUVs and rugged motorcycles. Explore the full Suzuki lineup in our showroom.</p>
    </div>
    <div class="vehicle-grid reveal-stagger">
      ${featured.map(vehicleCard).join('\n      ')}
    </div>
    <div style="text-align:center;margin-top:40px;"><a href="/showroom.html" class="btn btn--dark">View Full Showroom</a></div>
  </div>
</section>

<section class="section--tight">
  <div class="container">
    <div class="install-banner reveal">
      <div class="install-banner__icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg></div>
      <div>
        <h3>Take Guardian Motors with you</h3>
        <p>Install the app for one-tap access to the showroom, service booking and parts requests, even with a weak signal. No app store needed.</p>
      </div>
      <button id="installBtnBanner" class="btn btn--red">${ICON.install} Install App</button>
    </div>
  </div>
</section>
`;

write('index.html', page({
  title: "Guardian Motors Limited | Authorised Suzuki Dealer, Sales, Service & Genuine Parts, Zambia",
  description: "Guardian Motors Limited: Zambia's authorised Suzuki & Maruti Suzuki distributor since 1969. New vehicles & motorcycles, expert workshop servicing and genuine spare parts in Lusaka and Ndola.",
  path: '/',
  active: 'home',
  content: homeContent,
  jsonLd: {
    '@context': 'https://schema.org', '@type': 'AutoDealer', name: 'Guardian Motors Limited',
    image: `${SITE}/assets/img/vitara-hero.webp`, url: SITE, telephone: '+260211228778',
    foundingDate: '1969', brand: [{ '@type': 'Brand', name: 'Suzuki' }, { '@type': 'Brand', name: 'Maruti Suzuki' }],
    address: { '@type': 'PostalAddress', streetAddress: 'Emray House, Stand 6247, Kabelenga Road / Tuleteka Road', addressLocality: 'Lusaka', addressCountry: 'ZM' },
  },
}));

/* ================================================================== SHOWROOM */
const showroomContent = `
${pageBanner({ eyebrow: 'Our Showroom', title: 'Discover the full Suzuki range', description: 'New cars, SUVs, commercial vehicles and motorcycles. Every unit is brand new and backed by genuine Guardian Motors after-sales support.', crumb: 'Showroom' })}
<section class="section">
  <div class="container">
    <div class="search-row reveal">
      <input type="search" id="showroomSearch" placeholder="Search by model name, e.g. Vitara, Ertiga...">
    </div>
    <div class="filter-bar reveal" role="tablist" aria-label="Filter showroom">
      <button class="filter-btn active" data-filter="all">All Models</button>
      <button class="filter-btn" data-filter="car">Cars</button>
      <button class="filter-btn" data-filter="suv">SUVs</button>
      <button class="filter-btn" data-filter="commercial">Commercial</button>
      <button class="filter-btn" data-filter="moto">Motorcycles</button>
    </div>
    <div class="vehicle-grid reveal-stagger">
      ${VEHICLES.map(vehicleCard).join('\n      ')}
    </div>
    <p id="showroomEmpty" class="faq-empty">No models match your search. Try a different term or <a href="/contact.html">ask our sales team</a>.</p>
  </div>
</section>
`;

write('showroom.html', page({
  title: 'Showroom | New Suzuki Cars, SUVs & Motorcycles | Guardian Motors Zambia',
  description: 'Browse the full new Suzuki and Maruti Suzuki range at Guardian Motors: Alto K10, Alto 800, S-Presso, Vitara, Ertiga, Super Carry, and Suzuki motorcycles.',
  path: '/showroom.html', active: 'showroom', content: showroomContent,
}));

/* ================================================================== VEHICLE DETAIL PAGES */
const fuelIcon = ICON.fuel, seatIcon = ICON.seat;
VEHICLES.forEach((v) => {
  const related = VEHICLES.filter((o) => o.id !== v.id && o.category.some((c) => v.category.includes(c))).slice(0, 3);
  const relatedFallback = related.length ? related : VEHICLES.filter((o) => o.id !== v.id).slice(0, 3);

  const content = `
${pageBanner({ eyebrow: v.type, title: v.name, description: v.blurb, crumb: v.name })}
<section class="section">
  <div class="container vehicle-hero">
    <div class="vehicle-hero__media reveal">
      <img src="${v.img}" alt="${v.name}" width="900" height="675">
    </div>
    <div class="reveal">
      <span class="pill pill--red">${v.tag}</span>
      <h2 style="margin-top:14px;">${v.name}</h2>
      <p style="color:var(--gm-text-soft);margin-top:10px;">${v.description}</p>
      <div class="spec-grid">
        <div class="spec-item"><span>Seats</span><strong>${v.seats}</strong></div>
        <div class="spec-item"><span>Engine</span><strong>${v.engine}</strong></div>
        <div class="spec-item"><span>Fuel</span><strong>${v.fuel}</strong></div>
        <div class="spec-item"><span>Economy</span><strong>${v.economy}</strong></div>
      </div>
      <ul class="about-list">
        ${v.features.map((f) => `<li>${ICON.check}${f}</li>`).join('\n        ')}
      </ul>
      <div class="vehicle-actions">
        <button class="btn btn--red" data-cart-add="vehicle:${v.id}" data-default-label="Add to Enquiry">Add to Enquiry</button>
        <button class="btn btn--outline-dark wish-btn-inline" data-wishlist-toggle="${v.id}" aria-pressed="false">${ICON.heart} Save to Wishlist</button>
        <a class="btn btn--ghost" href="/workshop.html?vehicle=${encodeURIComponent(v.name)}#booking">Book a Test Drive</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--gray">
  <div class="container">
    <div class="section-head center reveal">
      <p class="eyebrow" style="justify-content:center">You Might Also Like</p>
      <h2>Related models</h2>
    </div>
    <div class="related-grid reveal-stagger">
      ${relatedFallback.map(vehicleCard).join('\n      ')}
    </div>
  </div>
</section>
`;

  write(`cars/${v.id}.html`, page({
    title: `${v.name} | New ${v.type} in Zambia | Guardian Motors`,
    description: `${v.blurb} Authorised Suzuki dealer, Lusaka and Ndola, Zambia.`,
    path: `/cars/${v.id}.html`, active: 'showroom', content,
    ogImage: v.img,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Vehicle', name: v.name, description: v.description,
      vehicleSeatingCapacity: v.seats, fuelType: v.fuel, image: `${SITE}${v.img}`,
      brand: { '@type': 'Brand', name: 'Suzuki' }, url: `${SITE}/cars/${v.id}.html`,
    },
  }));
});

/* ================================================================== WORKSHOP */
const workshopContent = `
${pageBanner({ eyebrow: 'Workshop & Servicing', title: 'Manufacturer-standard care for every vehicle', description: 'Fully equipped workshops in Lusaka and Ndola, staffed by specialised, experienced mechanics using modern diagnostic machinery.', crumb: 'Workshop' })}
<section class="section">
  <div class="container">
    <div class="services-grid reveal-stagger">
      <div class="service-card card"><div class="service-card__icon">${ICON.wrench}</div><h3>Scheduled Maintenance</h3><p>Comprehensive servicing at manufacturer-recommended time or distance intervals, for cars and motorcycles alike.</p></div>
      <div class="service-card card"><div class="service-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 21h10M9 8h6M9 12h6M9 16h3"/></svg></div><h3>Modern Diagnostics</h3><p>Computerised diagnostic equipment identifies issues accurately, so repairs are right the first time.</p></div>
      <div class="service-card card"><div class="service-card__icon">${ICON.parts}</div><h3>Genuine Parts Fitting</h3><p>Every repair uses 100% genuine Suzuki parts, protecting your warranty and your vehicle's resale value.</p></div>
      <div class="service-card card"><div class="service-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13h2l2-6h10l2 6h2M5 13v5h14v-5M5 18H3M21 18h-2"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/></svg></div><h3>Nissan Fleet Servicing</h3><p>Beyond Suzuki, our Lusaka workshop also services Nissan fleet vehicles for corporate clients.</p></div>
      <div class="service-card card"><div class="service-card__icon">${ICON.moto}</div><h3>Motorcycle Servicing</h3><p>Dedicated servicing for the full Suzuki motorcycle range, from commuter bikes to trail machines.</p></div>
      <div class="service-card card"><div class="service-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg></div><h3>Experienced Technicians</h3><p>Specialised, factory-trained mechanics who know Suzuki vehicles and motorcycles inside out.</p></div>
    </div>

    <div id="booking" class="booking-wrap">
      <div class="booking-info reveal">
        <h3>Book your service in three steps</h3>
        <p>Reserve a slot online and our service team will confirm by phone or email before your appointment.</p>
        <ol class="booking-steps">
          <li><span class="num">1</span><div><strong>Tell us about your vehicle</strong><span>Make, model and the service you need.</span></div></li>
          <li><span class="num">2</span><div><strong>Pick a branch &amp; date</strong><span>Lusaka or Ndola, whichever suits you.</span></div></li>
          <li><span class="num">3</span><div><strong>We confirm your slot</strong><span>Our service desk calls or emails to lock it in.</span></div></li>
        </ol>
      </div>
      <form id="bookingForm" class="form-card card reveal" novalidate>
        <div class="form-grid">
          <div class="field"><label for="bkName">Full name</label><input id="bkName" name="name" type="text" required autocomplete="name"></div>
          <div class="field"><label for="bkPhone">Phone number</label><input id="bkPhone" name="phone" type="tel" required autocomplete="tel" placeholder="+260 9xx xxx xxx"></div>
          <div class="field"><label for="bkEmail">Email address</label><input id="bkEmail" name="email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="bookVehicle">Vehicle make &amp; model</label><input id="bookVehicle" name="vehicle" type="text" placeholder="e.g. Suzuki Ertiga" required></div>
          <div class="field"><label for="bkService">Service needed</label>
            <select id="bkService" name="service_type" required>
              <option value="">Select a service</option>
              <option>Scheduled maintenance</option><option>Diagnostics / warning light</option>
              <option>Genuine parts fitting</option><option>Motorcycle servicing</option>
              <option>Nissan fleet servicing</option><option>Other / not sure</option>
            </select>
          </div>
          <div class="field"><label for="bkBranch">Preferred branch</label>
            <select id="bkBranch" name="branch" required>
              <option value="">Select branch</option><option>Lusaka Showroom</option>
              <option>Ndola Showroom (Sundat Motor Sales)</option>
            </select>
          </div>
          <div class="field"><label for="bkDate">Preferred date</label><input id="bkDate" name="preferred_date" type="date"></div>
          <div class="field"><label for="bkTime">Preferred time</label><input id="bkTime" name="preferred_time" type="time"></div>
          <div class="field full"><label for="bkNotes">Notes for our service team</label><textarea id="bkNotes" name="notes" placeholder="Anything else we should know?"></textarea></div>
        </div>
        <button type="submit" class="btn btn--red btn--block" style="margin-top:22px;">Request Booking</button>
        <p class="form-note">Your request goes straight to our Lusaka service desk. We'll confirm your slot by phone or email.</p>
        <div class="form-success">${ICON.check}Thanks. Your request is ready to send.</div>
      </form>
    </div>
  </div>
</section>
`;

write('workshop.html', page({
  title: 'Book a Service | Suzuki Workshop, Lusaka & Ndola | Guardian Motors',
  description: 'Book scheduled maintenance, diagnostics or genuine parts fitting at our Lusaka or Ndola Suzuki workshop. Nissan fleet servicing also available.',
  path: '/workshop.html', active: 'workshop', content: workshopContent,
}));

/* ================================================================== PARTS */
function partCard(p) {
  return `<article class="part-card card" data-category="${p.category}" data-name="${p.name.toLowerCase()}" hidden>
    <div class="part-card__icon">${ICON.parts}</div>
    <h4>${p.name}</h4>
    <p>${p.desc}</p>
    <span class="fit">Fits: ${p.compatible}</span>
    <div class="qty-field">
      <input type="number" min="1" value="1" data-qty-input aria-label="Quantity">
      <button class="btn btn--dark btn--sm" data-cart-add="part:${p.id}" data-default-label="Add to Enquiry" style="flex:1;">Add to Enquiry</button>
    </div>
  </article>`;
}

const partsContent = `
${pageBanner({ eyebrow: 'Genuine Parts', title: 'Official genuine parts for every model we sell', description: 'Protect your vehicle’s performance, safety and resale value with 100% genuine Suzuki parts, sourced directly through Guardian Motors.', crumb: 'Parts' })}
<section class="section">
  <div class="container">
    <div class="parts-layout reveal">
      <div class="parts-media"><img src="/assets/img/product-car.webp" alt="Genuine Suzuki spare parts including engines, spark plugs and water pumps" loading="lazy" width="900" height="720"></div>
      <div class="parts-copy">
        <ul class="about-list">
          <li>${ICON.check}Engines, filters, brake components &amp; more</li>
          <li>${ICON.check}Chassis &amp; engine number lookup for exact fit</li>
          <li>${ICON.check}Add parts to your enquiry list, order online, collect in Lusaka or Ndola</li>
        </ul>
        <div class="search-row">
          <input type="search" id="partsSearchBox" placeholder="Search parts, e.g. brake pads, oil filter...">
        </div>
        <div class="parts-categories">
          ${PART_CATEGORIES.map((c, i) => `<div class="parts-cat${i === 0 ? ' active' : ''}" data-cat="${c.id}">${ICON.parts}<strong>${c.name}</strong></div>`).join('\n          ')}
        </div>
      </div>
    </div>

    <div class="parts-grid reveal-stagger">
      ${PARTS.map(partCard).join('\n      ')}
    </div>
    <p id="partsEmpty" class="faq-empty">No parts match your search. Try a different term below.</p>

    <div class="form-card card reveal" style="max-width:820px;margin:60px auto 0;">
      <h3 style="margin-bottom:6px;">Can't find your part? Tell us directly</h3>
      <p style="color:var(--gm-text-soft);font-size:.92rem;margin-bottom:22px;">Give us your vehicle's details and we'll confirm price and availability.</p>
      <form id="partsForm" novalidate>
        <div class="form-grid">
          <div class="field"><label for="ptName">Full name</label><input id="ptName" name="name" type="text" required></div>
          <div class="field"><label for="ptPhone">Phone number</label><input id="ptPhone" name="phone" type="tel" required></div>
          <div class="field"><label for="ptEmail">Email address</label><input id="ptEmail" name="email" type="email" required></div>
          <div class="field"><label for="ptVehicle">Make, model &amp; year</label><input id="ptVehicle" name="vehicle" type="text" placeholder="e.g. Suzuki Vitara, 2021" required></div>
          <div class="field"><label for="ptChassis">Chassis number</label><input id="ptChassis" name="chassis_number" type="text"></div>
          <div class="field"><label for="ptEngine">Engine number</label><input id="ptEngine" name="engine_number" type="text"></div>
          <div class="field full"><label for="ptParts">Part(s) needed</label><textarea id="ptParts" name="parts_needed" placeholder="Describe the part(s) you need" required></textarea></div>
        </div>
        <button type="submit" class="btn btn--red btn--block" style="margin-top:22px;">Send Part Request</button>
        <p class="form-note">We only fit 100% genuine Suzuki parts. Your request goes straight to our parts desk.</p>
        <div class="form-success">${ICON.check}Thanks. Your request is ready to send.</div>
      </form>
    </div>
  </div>
</section>
`;

write('parts.html', page({
  title: 'Genuine Suzuki Parts | Order Spares Online | Guardian Motors Zambia',
  description: 'Browse and request 100% genuine Suzuki spare parts by category: engine, brakes, electrical, body & trim and motorcycle parts. Collect in Lusaka or Ndola.',
  path: '/parts.html', active: 'parts', content: partsContent,
}));

/* ================================================================== ABOUT */
const aboutContent = `
${pageBanner({ eyebrow: 'About Guardian Motors', title: 'A Zambian-owned name drivers have trusted since 1969', description: 'Over 55 years distributing new Suzuki vehicles and motorcycles across Zambia.', crumb: 'About' })}
<section class="section">
  <div class="container about-grid">
    <div class="about-media reveal">
      <img src="/assets/img/slide2.webp" alt="Guardian Motors dealership in Lusaka, Zambia" loading="lazy" width="1200" height="800">
      <div class="about-media__badge"><strong class="count-up" data-count="55" data-suffix="+">0</strong><span>Years serving<br>Zambian drivers</span></div>
    </div>
    <div class="about-copy reveal">
      <p>Guardian Motors Limited is a proudly Zambian-owned company and the official distributor of new Suzuki vehicles and Suzuki motorcycles, alongside genuine Maruti Suzuki India Ltd models. For more than five decades we've helped customers across Zambia drive away in a prestigious new vehicle they can enjoy for years to come.</p>
      <p>Beyond sales, our fully equipped workshops in Lusaka and Ndola provide manufacturer-standard after-sales service for individual owners and corporate fleets alike, including Nissan fleet servicing, backed by genuine spare parts for every vehicle and motorcycle we sell.</p>
      <ul class="about-list">
        <li>${ICON.check}Official Suzuki Motor Corporation &amp; Maruti Suzuki India Ltd distributor</li>
        <li>${ICON.check}Showrooms in Lusaka and Ndola (Sundat Motor Sales)</li>
        <li>${ICON.check}Modern diagnostic equipment and manufacturer-trained mechanics</li>
        <li>${ICON.check}Genuine parts for every vehicle and motorcycle we distribute</li>
      </ul>
      <a href="/contact.html" class="btn btn--outline-dark">Visit a Showroom</a>
    </div>
  </div>
  <div class="container">
    <div class="stats-row reveal-stagger">
      <div class="stat-card"><strong class="count-up" data-count="1969" data-suffix="">0</strong><span>Established</span></div>
      <div class="stat-card"><strong class="count-up" data-count="2" data-suffix="">0</strong><span>Zambian Branches</span></div>
      <div class="stat-card"><strong class="count-up" data-count="9" data-suffix="+">0</strong><span>Suzuki Models</span></div>
      <div class="stat-card"><strong class="count-up" data-count="100" data-suffix="%">0</strong><span>Genuine Parts Only</span></div>
    </div>
  </div>
</section>
`;

write('about.html', page({
  title: 'About Us | Guardian Motors Limited, Zambia Since 1969',
  description: "Guardian Motors Limited is Zambia's authorised Suzuki and Maruti Suzuki distributor, Zambian-owned since 1969, with showrooms in Lusaka and Ndola.",
  path: '/about.html', active: 'about', content: aboutContent,
}));

/* ================================================================== FAQ */
const faqContent = `
${pageBanner({ eyebrow: 'Frequently Asked Questions', title: 'Answers before you ask', description: "Can't find what you're after? Message us on WhatsApp or use the contact form.", crumb: 'FAQ' })}
<section class="section">
  <div class="container">
    <div class="faq-search reveal">
      ${ICON.search}
      <input type="text" id="faqSearch" placeholder="Search FAQs, e.g. warranty, Nkongole, hours...">
    </div>
    <div class="faq-tags reveal">
      <button class="filter-btn faq-tag active" data-tag="all">All</button>
      <button class="filter-btn faq-tag" data-tag="sales">Sales &amp; Financing</button>
      <button class="filter-btn faq-tag" data-tag="service">Service</button>
      <button class="filter-btn faq-tag" data-tag="parts">Parts</button>
      <button class="filter-btn faq-tag" data-tag="general">General</button>
    </div>
    <div class="faq-list reveal">
      ${FAQS.map(faqItem).join('\n      ')}
    </div>
    <p id="faqEmpty" class="faq-empty">No FAQs match your search. Try a different term or contact us directly.</p>
  </div>
</section>
`;

write('faq.html', page({
  title: 'FAQs | Guardian Motors Limited, Zambia',
  description: 'Answers on Suzuki vehicle financing, servicing, genuine parts, warranty and our Lusaka and Ndola showroom hours.',
  path: '/faq.html', active: 'faq', content: faqContent,
}));

/* ================================================================== CONTACT */
const contactContent = `
${pageBanner({ eyebrow: 'Get In Touch', title: "We'd love to hear from you", description: 'Visit us in Lusaka or Ndola, or reach our team directly.', crumb: 'Contact' })}
<section class="section">
  <div class="container">
    <div class="branch-grid reveal-stagger">
      <div class="branch-card card">
        <iframe class="branch-card__map" loading="lazy" title="Map to Guardian Motors Lusaka showroom" src="https://www.google.com/maps?q=Guardian+Motors+Limited+Lusaka+Zambia&output=embed"></iframe>
        <div class="branch-card__body">
          <span class="tag">Head Office</span>
          <h3>Lusaka Showroom</h3>
          <div class="branch-detail">${ICON.pin}<div><strong>Address</strong>Corner of Kabelenga Rd / Tuleteka Rd, P.O. Box 31092, Lusaka</div></div>
          <div class="branch-detail">${ICON.phone}<div><strong>Phone / WhatsApp</strong><a href="tel:+260211228778">+260 211 228778</a> &middot; <a href="https://wa.me/260777407110">+260 777 407 110</a></div></div>
          <div class="branch-detail">${ICON.mail}<div><strong>Email</strong><a href="mailto:sales@guardianmotors.co.zm">sales@guardianmotors.co.zm</a></div></div>
          <div style="margin-top:16px;">
            <div class="branch-hours"><span>Mon to Fri</span><span>08:00 to 17:00</span></div>
            <div class="branch-hours"><span>Parts &amp; Service</span><span>07:30 to 17:00</span></div>
            <div class="branch-hours"><span>Saturday</span><span>08:00 to 13:00</span></div>
          </div>
        </div>
      </div>
      <div class="branch-card card">
        <iframe class="branch-card__map" loading="lazy" title="Map to Guardian Motors Ndola showroom (Sundat Motor Sales)" src="https://www.google.com/maps?q=Ndola+Zambia+Broadway+Shinde+Street&output=embed"></iframe>
        <div class="branch-card__body">
          <span class="tag">Copperbelt Branch</span>
          <h3>Ndola Showroom <small style="font-weight:500;color:var(--gm-text-soft);">, Sundat Motor Sales</small></h3>
          <div class="branch-detail">${ICON.pin}<div><strong>Address</strong>Corner of Broadway / Shinde Street, P.O. Box 71838, Ndola</div></div>
          <div class="branch-detail">${ICON.phone}<div><strong>Phone</strong><a href="tel:+260212621012">+260 212 621012</a> / <a href="tel:+260212612054">612054</a></div></div>
          <div class="branch-detail">${ICON.mail}<div><strong>Email</strong><a href="mailto:smsndola@iconnect.zm">smsndola@iconnect.zm</a></div></div>
          <div style="margin-top:16px;">
            <div class="branch-hours"><span>Mon to Fri</span><span>08:00 to 17:00</span></div>
            <div class="branch-hours"><span>Saturday</span><span>08:00 to 13:00</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-wrap">
      <div class="contact-channels reveal">
        <div class="contact-channel">${ICON.phone}<div><strong>Call the Lusaka Switchboard</strong><a href="tel:+260211228778">+260 211 228778</a></div></div>
        <div class="contact-channel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-5 18h.01"/></svg><div><strong>WhatsApp Us</strong><a href="https://wa.me/260777407110">+260 777 407 110</a></div></div>
        <div class="contact-channel">${ICON.mail}<div><strong>Sales Enquiries</strong><a href="mailto:sales@guardianmotors.co.zm">sales@guardianmotors.co.zm</a></div></div>
        <div class="contact-channel">${ICON.mail}<div><strong>Service Bookings</strong><a href="mailto:service@guardianmotors.co.zm">service@guardianmotors.co.zm</a></div></div>
        <div class="contact-channel">${ICON.mail}<div><strong>Parts Desk</strong><a href="mailto:parts@guardianmotors.co.zm">parts@guardianmotors.co.zm</a></div></div>
        <div class="contact-channel">${ICON.pin}<div><strong>Head Office</strong><span>Emray House, Stand 6247, Kabelenga Rd, Lusaka, P.O. Box 31092</span></div></div>
      </div>
      <form id="contactForm" class="form-card card reveal" novalidate>
        <div class="form-grid">
          <div class="field"><label for="ctName">Full name</label><input id="ctName" name="name" type="text" required></div>
          <div class="field"><label for="ctPhone">Phone number</label><input id="ctPhone" name="phone" type="tel" required></div>
          <div class="field full"><label for="ctEmail">Email address</label><input id="ctEmail" name="email" type="email" required></div>
          <div class="field full"><label for="contactSubject">Subject</label><input id="contactSubject" name="subject" type="text" placeholder="What is this regarding?" required></div>
          <div class="field full"><label for="ctMessage">Message</label><textarea id="ctMessage" name="message" required placeholder="How can we help?"></textarea></div>
        </div>
        <button type="submit" class="btn btn--red btn--block" style="margin-top:22px;">Send Message</button>
        <p class="form-note">We typically respond within one business day.</p>
        <div class="form-success">${ICON.check}Thanks. Your message is ready to send.</div>
      </form>
    </div>
  </div>
</section>
`;

write('contact.html', page({
  title: 'Contact Us | Lusaka & Ndola Showrooms | Guardian Motors',
  description: 'Reach Guardian Motors Limited: Lusaka head office and Ndola (Sundat Motor Sales) branch. Phone, WhatsApp, email and showroom hours.',
  path: '/contact.html', active: 'contact', content: contactContent,
}));

/* ================================================================== CART */
const cartContent = `
${pageBanner({ eyebrow: 'Your Enquiry List', title: 'Enquiry cart & wishlist', description: 'Review the vehicles and parts you’ve added, then send it all to our sales team in one message.', crumb: 'Cart' })}
<section class="section">
  <div class="container">
    <div class="cart-tabs reveal">
      <button class="filter-btn active" data-cart-tab="cartPanel">${ICON.cart} Enquiry Cart (<span data-cart-count>0</span>)</button>
      <button class="filter-btn" data-cart-tab="wishlistPanel">${ICON.heart} Wishlist (<span data-wishlist-count>0</span>)</button>
    </div>

    <div id="cartPanel" class="cart-panel active">
      <div class="booking-wrap" style="margin-top:0;align-items:start;">
        <div>
          <div id="cartItems"></div>
        </div>
        <form id="cartEnquiryForm" class="form-card card" novalidate>
          <h3 style="margin-bottom:6px;">Send this enquiry</h3>
          <p style="color:var(--gm-text-soft);font-size:.92rem;margin-bottom:22px;"><span id="cartTotalCount">0</span> item(s) in your list. Add your details and we'll get back to you.</p>
          <div class="form-grid">
            <div class="field full"><label for="ceName">Full name</label><input id="ceName" name="name" type="text" required></div>
            <div class="field"><label for="cePhone">Phone number</label><input id="cePhone" name="phone" type="tel" required></div>
            <div class="field"><label for="ceEmail">Email address</label><input id="ceEmail" name="email" type="email" required></div>
            <div class="field full"><label for="ceNotes">Notes</label><textarea id="ceNotes" name="notes" placeholder="Anything else we should know?"></textarea></div>
          </div>
          <button type="submit" class="btn btn--red btn--block" style="margin-top:22px;">Send Enquiry List</button>
          <p class="form-note">Sent straight to our sales desk with every item in your list.</p>
        </form>
      </div>
    </div>

    <div id="wishlistPanel" class="cart-panel">
      <div id="wishlistItems"></div>
    </div>
  </div>
</section>
`;

write('cart.html', page({
  title: 'Your Enquiry Cart & Wishlist | Guardian Motors',
  description: 'Review saved vehicles and parts, then send your full enquiry to Guardian Motors sales team in one message.',
  path: '/cart.html', active: 'home', content: cartContent,
}));

console.log('\nDone. Generated', VEHICLES.length, 'vehicle pages plus 8 site pages.');
