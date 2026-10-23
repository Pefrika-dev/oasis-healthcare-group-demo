/* main.js — public website logic */
(function () {
  'use strict';
  const U = window.OasisUtils;
  const D = window.OasisData;
  const C = window.OasisComponents;

  const state = {
    facilityFilters: { q: '', category: '', county: '' },
    serviceQ: '',
    doctorFilters: { q: '', specialty: '', facility: '' },
    appointment: { step: 1, data: {} }
  };

  // ---------- init ----------
  document.addEventListener('DOMContentLoaded', function () {
    U.applyImgFallbacks(document);
    renderLogo();
    buildNav();
    setupMobileNav();
    setupSmoothScroll();
    setupScrollSpy();
    renderHero();
    renderFacilityFinder();
    renderServices();
    renderDoctors();
    renderPatientResources();
    renderContact();
    renderAbout();
    renderFooter();
    setupAppointmentWizard();
    setupStorageSync();
    // deep link
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(function(){ el.scrollIntoView(); }, 100);
    }
  });

  function renderLogo() {
    document.querySelectorAll('[data-logo]').forEach(function (el) { el.innerHTML = C.logo(el.dataset.logo === 'compact' ? 'compact' : 'full'); });
  }

  // ---------- nav ----------
  function buildNav() {
    const links = [
      { href:'#home', label:'Home' },
      { href:'#about', label:'About' },
      { href:'#facilities', label:'Facilities' },
      { href:'#services', label:'Services' },
      { href:'#doctors', label:'Doctors' },
      { href:'#resources', label:'Resources' },
      { href:'#contact', label:'Contact' }
    ];
    const nav = document.getElementById('siteNav');
    if (nav) nav.innerHTML = links.map(function (l){ return '<a href="'+l.href+'">'+U.escapeHtml(l.label)+'</a>'; }).join('') +
      '<a href="#appointment" class="btn btn-primary btn-sm cta">Book an Appointment</a>';
    const drawer = document.getElementById('drawerLinks');
    if (drawer) drawer.innerHTML = links.map(function(l){return '<a href="'+l.href+'" data-drawer-link>'+U.escapeHtml(l.label)+'</a>';}).join('') +
      '<a href="#appointment" class="btn btn-primary" data-drawer-link>Book an Appointment</a>';
  }

  function setupMobileNav() {
    const toggle = document.getElementById('menuToggle');
    const drawer = document.getElementById('navDrawer');
    if (!toggle || !drawer) return;
    function open() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden','false');
      drawer.removeAttribute('inert');
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Close navigation menu');
    }
    function close() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
      drawer.setAttribute('inert','');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open navigation menu');
    }
    toggle.addEventListener('click', function(){ drawer.classList.contains('open') ? close() : open(); });
    drawer.querySelector('.backdrop').addEventListener('click', close);
    const closeBtn = drawer.querySelector('[data-drawer-close]');
    if (closeBtn) closeBtn.addEventListener('click', close);
    drawer.querySelectorAll('a').forEach(function (a){ a.addEventListener('click', close); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
  }

  function setupSmoothScroll() {
    const valid = ['#home','#about','#facilities','#services','#doctors','#appointment','#resources','#contact'];
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block:'start' }); history.replaceState(null,'',id); }
    });
    // custom fallback for unsupported internal links
    window.addEventListener('hashchange', function () {
      const h = location.hash;
      if (h && h.length > 1 && valid.indexOf(h) < 0) {
        U.toast('That page is not part of this demonstration. Returning home.', 'warn');
        history.replaceState(null, '', '#home');
        const home = document.getElementById('home');
        if (home) home.scrollIntoView({ behavior:'smooth' });
      }
    });
  }

  function setupScrollSpy() {
    const sections = Array.from(document.querySelectorAll('main > section[id]'));
    const links = Array.from(document.querySelectorAll('#siteNav a[href^="#"], #drawerLinks a[href^="#"]')).filter(function (a) { return !a.classList.contains('btn'); });
    if (!sections.length || !links.length) return;
    const header = document.querySelector('.site-header');
    let frame = null;

    function update() {
      frame = null;
      const probe = (header ? header.offsetHeight : 72) + 32;
      let current = sections[0].id;
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= probe) current = section.id;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        current = sections[sections.length - 1].id;
      }
      links.forEach(function (link) {
        const on = link.getAttribute('href') === '#' + current;
        link.classList.toggle('active', on);
        if (on) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    function requestUpdate() {
      if (frame === null) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  // ---------- hero ----------
  function renderHero() {
    const content = D.Content.get();
    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.innerHTML =
      '<div class="container hero-grid">' +
        '<div>' +
          '<span class="eyebrow" style="color:rgba(255,255,255,.7); letter-spacing:.14em; text-transform:uppercase; font-size:.8rem; font-weight:600;">Oasis Healthcare Group · Kenya</span>' +
          '<h1>' + U.escapeHtml(content.heroHeadline) + '</h1>' +
          '<p class="lead">' + U.escapeHtml(content.heroSub) + '</p>' +
          '<div class="hero-actions">' +
            '<a class="btn btn-primary btn-lg" href="#facilities">Find a Facility</a>' +
            '<a class="btn btn-ghost btn-lg" href="#appointment">Book an Appointment</a>' +
            '<a class="btn btn-ghost btn-lg" href="#services">Explore Our Services</a>' +
          '</div>' +
          '<div class="emergency-banner">' +
            C.icon('alert') +
            '<div><strong>Need urgent care?</strong> ' + U.escapeHtml(content.heroEmergency) +
            ' <a href="tel:0701302302">Call 0701 302 302</a> or <a href="tel:0111161400">0111 161 400</a>.</div>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="hero-card">' +
            '<h2 class="hero-card-title">Our healthcare network</h2>' +
            '<p style="color:rgba(255,255,255,.75); font-size:.9rem;">Hospitals, doctors\' plazas and care centres across Kenya. Search by town, county or service.</p>' +
            '<div class="hero-stats">' +
              '<div class="hero-stat"><div class="num">' + D.Facilities.published().length + '</div><div class="lbl">Published facilities (demo)</div></div>' +
              '<div class="hero-stat"><div class="num">' + D.Services.published().length + '</div><div class="lbl">Service categories (demo)</div></div>' +
              '<div class="hero-stat"><div class="num">' + D.Doctors.published().length + '</div><div class="lbl">Demo doctor profiles</div></div>' +
              '<div class="hero-stat"><div class="num">17–19</div><div class="lbl">Facilities in brief (unverified)</div></div>' +
            '</div>' +
          '</div>' +
          '<div class="hero-image" style="margin-top:16px;">' +
            '<img src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&q=80" alt="A healthcare professional checking a patient blood pressure during a consultation" loading="eager" style="object-position: center 18%;">' +
          '</div>' +
        '</div>' +
      '</div>';
    U.applyImgFallbacks(hero);
  }

  // ---------- facility finder ----------
  function renderFacilityFinder() {
    const sec = document.getElementById('facilities');
    if (!sec) return;
    const counties = Array.from(new Set(D.Facilities.all().map(function (f){return f.county;}))).sort();
    const categories = D.FACILITY_CATEGORIES;
    sec.innerHTML =
      '<div class="container">' +
        '<div class="section-title">' +
          '<span class="eyebrow">Facility finder</span>' +
          '<h2>Find a facility near you</h2>' +
          '<p>Search the demonstration facility registry. Records are labelled by verification status. Some details require confirmation with the facility.</p>' +
        '</div>' +
        '<div class="verification-legend">' +
          '<span><span class="badge badge-success">Verified</span> confirmed details</span>' +
          '<span><span class="badge badge-warn">Pending verification</span> awaiting confirmation</span>' +
          '<span><span class="badge badge-danger">Needs correction</span> flagged for review</span>' +
          '<span><span class="badge badge-info">Possible duplicate</span> possible overlap</span>' +
        '</div>' +
        '<div class="finder">' +
          '<div class="finder-controls">' +
            '<div class="field"><label for="facQ">Search by name</label><input id="facQ" type="search" placeholder="Facility name, town or service"></div>' +
            '<div class="field"><label for="facCat">Category</label><select id="facCat"><option value="">All categories</option>' + categories.map(function(c){return '<option value="'+U.escapeHtml(c)+'">'+U.escapeHtml(c)+'</option>';}).join('') + '</select></div>' +
            '<div class="field"><label for="facCounty">County</label><select id="facCounty"><option value="">All counties</option>' + counties.map(function(c){return '<option value="'+U.escapeHtml(c)+'">'+U.escapeHtml(c)+'</option>';}).join('') + '</select></div>' +
            '<div class="field"><label for="facStatus">Verification</label><select id="facStatus"><option value="">All records</option><option value="verified">Verified</option><option value="pending">Pending verification</option></select></div>' +
          '</div>' +
          '<div id="facilityResults" class="grid grid-3"></div>' +
          '<div id="facilityEmpty"></div>' +
        '</div>' +
        '<div class="map-panel" style="margin-top:20px;">' +
          C.icon('map') +
          '<p><strong>Location presentation (demo)</strong></p>' +
          '<p style="font-size:.85rem;">A live map integration is not included in this demonstration. Directions are offered only when a verified address exists; otherwise contact the facility to confirm the location.</p>' +
        '</div>' +
      '</div>';
    const q = document.getElementById('facQ');
    const cat = document.getElementById('facCat');
    const county = document.getElementById('facCounty');
    const status = document.getElementById('facStatus');
    function run() {
      state.facilityFilters.q = q.value;
      state.facilityFilters.category = cat.value;
      state.facilityFilters.county = county.value;
      state.facilityFilters.verification = status.value;
      renderFacilityResults();
    }
    q.addEventListener('input', U.debounce(run, 200));
    cat.addEventListener('change', run);
    county.addEventListener('change', run);
    status.addEventListener('change', run);
    renderFacilityResults();
  }

  function renderFacilityResults() {
    const el = document.getElementById('facilityResults');
    const empty = document.getElementById('facilityEmpty');
    if (!el) return;
    const f = state.facilityFilters;
    // public site only shows published facilities
    const items = D.Facilities.search(f.q, { category: f.category, county: f.county, status: 'published', verification: f.verification });
    el.innerHTML = items.map(C.facilityCard).join('') || '';
    if (!items.length) {
      empty.innerHTML = C.emptyState('No facilities found', 'Try adjusting your search or filters.', '');
    } else {
      empty.innerHTML = '';
    }
    // attach handlers
    el.querySelectorAll('[data-action="facility-details"]').forEach(function (b){ b.addEventListener('click', function(){ openFacilityModal(b.dataset.id); }); });
    el.querySelectorAll('[data-action="facility-appoint"]').forEach(function (b){ b.addEventListener('click', function(){ startAppointment({facilityId: b.dataset.id}); }); });
  }

  function openFacilityModal(id) {
    const f = D.Facilities.get(id);
    if (!f) return;
    const services = (f.services||[]).map(function (sid){ const s=D.Services.get(sid); return s ? s.name : sid; });
    const content =
      '<div class="grid grid-2">' +
        '<div>' +
          '<p><strong>Category:</strong> ' + U.escapeHtml(f.category) + '</p>' +
          '<p><strong>County:</strong> ' + U.escapeHtml(f.county) + '</p>' +
          '<p><strong>Town:</strong> ' + U.escapeHtml(f.town) + '</p>' +
          '<p><strong>Address:</strong> ' + U.escapeHtml(f.address || 'Contact the facility to confirm the exact address.') + '</p>' +
          '<p><strong>Opening hours:</strong> ' + U.escapeHtml(f.hours) + '</p>' +
          '<p><strong>Emergency services:</strong> ' + (f.emergency ? 'Available (confirm with facility)' : 'Contact facility to confirm') + '</p>' +
          '<p><strong>Verification:</strong> ' + C.statusBadge(f.verification) + '</p>' +
          '<p><strong>Publication:</strong> ' + C.statusBadge(f.status) + '</p>' +
        '</div>' +
        '<div>' +
          '<p><strong>Contact numbers:</strong></p>' +
          (f.phones && f.phones.length ? f.phones.map(function(p){ return '<p><a class="btn btn-sm btn-ghost" href="'+U.telHref(p)+'">'+C.icon('phone')+' '+U.escapeHtml(p)+'</a></p>'; }).join('') : '<p class="muted">No phone numbers on file. Contact the main call centre on 0111 161 400.</p>') +
          '<p><strong>Services (demo data):</strong></p>' +
          (services.length ? '<div class="tag-row">' + services.map(function(s){return '<span class="tag">'+U.escapeHtml(s)+'</span>';}).join('') + '</div>' : '<p class="muted">Contact facility to confirm available services.</p>') +
          '<div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">' +
            '<button class="btn btn-primary" data-act="appoint">Request appointment</button>' +
            (f.address ? '<a class="btn btn-ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(f.address)+'">Request directions</a>' : '') +
          '</div>' +
          '<p class="muted" style="font-size:.78rem; margin-top:8px;">Directions open an external map service. Availability of precise directions depends on a verified address.</p>' +
        '</div>' +
      '</div>' +
      '<p class="muted" style="font-size:.8rem; margin-top:12px;">' + U.escapeHtml(f.description) + '</p>';
    const m = U.modal({ title: f.name, content: content, size:'modal-lg' });
    m.overlay.querySelector('[data-act="appoint"]').addEventListener('click', function(){ m.close(); startAppointment({facilityId: f.id}); });
  }

  // ---------- services ----------
  function renderServices() {
    const sec = document.getElementById('services');
    if (!sec) return;
    sec.innerHTML =
      '<div class="container">' +
        '<div class="section-title">' +
          '<span class="eyebrow">Medical services</span>' +
          '<h2>Explore our service categories</h2>' +
          '<p>Service categories supplied for this demonstration. Availability varies by facility and must be confirmed with the facility.</p>' +
        '</div>' +
        '<div class="field" style="max-width:400px; margin:0 auto 24px;">' +
          '<input id="svcQ" type="search" placeholder="Search services" aria-label="Search medical services">' +
        '</div>' +
        '<div id="serviceResults" class="grid grid-3"></div>' +
        '<div id="serviceEmpty"></div>' +
      '</div>';
    const q = document.getElementById('svcQ');
    q.addEventListener('input', U.debounce(function(){ state.serviceQ = q.value; renderServiceResults(); }, 200));
    renderServiceResults();
  }
  function renderServiceResults() {
    const el = document.getElementById('serviceResults');
    const empty = document.getElementById('serviceEmpty');
    if (!el) return;
    let items = D.Services.published();
    if (state.serviceQ) {
      const ql = state.serviceQ.toLowerCase();
      items = items.filter(function (s){ return (s.name+' '+s.description).toLowerCase().indexOf(ql) >= 0; });
    }
    el.innerHTML = items.map(C.serviceCard).join('');
    empty.innerHTML = items.length ? '' : C.emptyState('No services found', 'Try a different search term.', '');
    el.querySelectorAll('[data-action="service-details"]').forEach(function(b){ b.addEventListener('click', function(){ openServiceModal(b.dataset.id); }); });
    el.querySelectorAll('[data-action="service-appoint"]').forEach(function(b){ b.addEventListener('click', function(){ startAppointment({serviceId: b.dataset.id}); }); });
  }
  function openServiceModal(id) {
    const s = D.Services.get(id);
    if (!s) return;
    const facs = D.Services.facilitiesFor(id);
    const content =
      '<p>' + U.escapeHtml(s.description) + '</p>' +
      '<h4>Facilities offering this (demo data)</h4>' +
      (facs.length ? '<ul>' + facs.map(function(f){ return '<li>'+U.escapeHtml(f.name)+' — '+U.escapeHtml(f.town)+', '+U.escapeHtml(f.county)+'</li>'; }).join('') + '</ul>' : '<p class="muted">No facilities are currently linked to this service in the demo data. Contact facilities to confirm availability.</p>') +
      '<p class="muted" style="font-size:.8rem;">Service availability and clinical capability must be confirmed with each facility.</p>' +
      '<div style="margin-top:12px;"><button class="btn btn-primary" data-act="appoint">Request appointment</button></div>';
    const m = U.modal({ title: s.name, content: content });
    m.overlay.querySelector('[data-act="appoint"]').addEventListener('click', function(){ m.close(); startAppointment({serviceId: s.id}); });
  }

  // ---------- doctors ----------
  function renderDoctors() {
    const sec = document.getElementById('doctors');
    if (!sec) return;
    const specialties = Array.from(new Set(D.Doctors.all().map(function(d){return d.specialty;}))).sort();
    const facs = D.Facilities.published();
    sec.innerHTML =
      '<div class="container">' +
        '<div class="section-title">' +
          '<span class="eyebrow">Find a doctor</span>' +
          '<h2>Doctor directory (demonstration)</h2>' +
          '<p>All profiles below are clearly labelled as demonstration data. They are not real clinicians. Credentials must be verified before publication.</p>' +
        '</div>' +
        '<div class="finder">' +
          '<div class="finder-controls">' +
            '<div class="field"><label for="docQ">Search</label><input id="docQ" type="search" placeholder="Name or specialty"></div>' +
            '<div class="field"><label for="docSpec">Specialty</label><select id="docSpec"><option value="">All specialties</option>' + specialties.map(function(s){return '<option value="'+U.escapeHtml(s)+'">'+U.escapeHtml(s)+'</option>';}).join('') + '</select></div>' +
            '<div class="field"><label for="docFac">Facility</label><select id="docFac"><option value="">All facilities</option>' + facs.map(function(f){return '<option value="'+U.escapeHtml(f.id)+'">'+U.escapeHtml(f.name)+'</option>';}).join('') + '</select></div>' +
            '<div class="field"><label for="docPub">Publication</label><select id="docPub"><option value="published">Published</option><option value="">All</option></select></div>' +
          '</div>' +
          '<div id="doctorResults" class="grid grid-3"></div>' +
          '<div id="doctorEmpty"></div>' +
        '</div>' +
      '</div>';
    ['docQ','docSpec','docFac','docPub'].forEach(function(id){
      const el = document.getElementById(id);
      el.addEventListener(el.tagName==='INPUT'?'input':'change', U.debounce(function(){
        state.doctorFilters.q = document.getElementById('docQ').value;
        state.doctorFilters.specialty = document.getElementById('docSpec').value;
        state.doctorFilters.facility = document.getElementById('docFac').value;
        state.doctorFilters.published = document.getElementById('docPub').value;
        renderDoctorResults();
      }, 200));
    });
    renderDoctorResults();
  }
  function renderDoctorResults() {
    const el = document.getElementById('doctorResults');
    const empty = document.getElementById('doctorEmpty');
    if (!el) return;
    const f = state.doctorFilters;
    let items = D.Doctors.all();
    if (f.published) items = items.filter(function(d){return d.published;});
    if (f.specialty) items = items.filter(function(d){return d.specialty===f.specialty;});
    if (f.facility) items = items.filter(function(d){return d.facilityId===f.facility;});
    if (f.q) { const ql=f.q.toLowerCase(); items = items.filter(function(d){ return (d.name+' '+d.specialty).toLowerCase().indexOf(ql)>=0; }); }
    el.innerHTML = items.map(C.doctorCard).join('');
    empty.innerHTML = items.length ? '' : C.emptyState('No doctor profiles found', 'Adjust your filters or add demonstration profiles in the admin dashboard.', '');
    el.querySelectorAll('[data-action="doctor-details"]').forEach(function(b){ b.addEventListener('click', function(){ openDoctorModal(b.dataset.id); }); });
    el.querySelectorAll('[data-action="doctor-appoint"]').forEach(function(b){ b.addEventListener('click', function(){ startAppointment({doctorId: b.dataset.id}); }); });
  }
  function openDoctorModal(id) {
    const d = D.Doctors.get(id);
    if (!d) return;
    const f = D.Facilities.get(d.facilityId);
    const content =
      '<p>' + C.demoTag() + ' ' + C.statusBadge(d.published?'published':'draft') + '</p>' +
      '<p><strong>Specialty:</strong> ' + U.escapeHtml(d.specialty) + '</p>' +
      '<p><strong>Facility:</strong> ' + U.escapeHtml(f ? f.name : 'Not assigned') + '</p>' +
      '<p><strong>Profile:</strong> ' + U.escapeHtml(d.bio) + '</p>' +
      '<p class="muted" style="font-size:.8rem;">This is a demonstration profile. It is not a real clinician and must not be treated as medical advice.</p>' +
      '<div style="margin-top:12px;"><button class="btn btn-primary" data-act="appoint">Request appointment</button></div>';
    const m = U.modal({ title: d.name, content: content });
    m.overlay.querySelector('[data-act="appoint"]').addEventListener('click', function(){ m.close(); startAppointment({doctorId: d.id}); });
  }

  // ---------- appointment wizard ----------
  function setupAppointmentWizard() {
    const sec = document.getElementById('appointment');
    if (!sec) return;
    sec.innerHTML =
      '<div class="container">' +
        '<div class="section-title">' +
          '<span class="eyebrow">Appointment request</span>' +
          '<h2>Request an appointment</h2>' +
          '<p>Frontend-only demonstration. Requests are stored in your browser and receive a demonstration reference number. They are not confirmed by any hospital.</p>' +
        '</div>' +
        '<div class="finder" style="max-width:760px; margin:0 auto;">' +
          '<div class="wizard-steps" id="wizSteps"></div>' +
          '<div id="wizPanels"></div>' +
          '<div class="wizard-nav">' +
            '<button class="btn btn-ghost" id="wizBack">Back</button>' +
            '<button class="btn btn-primary" id="wizNext">Next</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    resetWizard();
  }

  function resetWizard(prefill) {
    state.appointment = { step:1, data: Object.assign({}, prefill || {}) };
    renderWizard();
  }

  function startAppointment(prefill) {
    const sec = document.getElementById('appointment');
    if (sec) sec.scrollIntoView({behavior:'smooth'});
    resetWizard(prefill || {});
  }

  function renderWizard() {
    const steps = ['Service','Facility','Date','Time','Details','Review'];
    const stepsEl = document.getElementById('wizSteps');
    if (!stepsEl) return;
    stepsEl.innerHTML = steps.map(function (s,i){
      const idx = i+1;
      const cls = idx === state.appointment.step ? 'active' : (idx < state.appointment.step ? 'done' : '');
      return '<div class="wizard-step '+cls+'">'+ (idx<state.appointment.step?'✓ ':'') + U.escapeHtml(s) + '</div>';
    }).join('');
    const panels = document.getElementById('wizPanels');
    panels.innerHTML = renderWizardPanel(state.appointment.step);
    attachWizardHandlers();
    const back = document.getElementById('wizBack');
    const next = document.getElementById('wizNext');
    back.style.visibility = state.appointment.step === 1 ? 'hidden' : 'visible';
    next.textContent = state.appointment.step === 6 ? 'Submit request' : 'Next';
  }

  function renderWizardPanel(step) {
    const d = state.appointment.data;
    if (step === 1) {
      const svcs = D.Services.published();
      return '<div class="wizard-panel active"><div class="field"><label for="wSvc">Select a service</label><select id="wSvc">' +
        '<option value="">Choose a service</option>' +
        svcs.map(function(s){ return '<option value="'+U.escapeHtml(s.id)+'" '+(d.serviceId===s.id?'selected':'')+'>'+U.escapeHtml(s.name)+'</option>'; }).join('') +
        '</select></div></div>';
    }
    if (step === 2) {
      let facs = D.Facilities.published();
      if (d.serviceId) facs = facs.filter(function(f){ return (f.services||[]).indexOf(d.serviceId) >= 0; });
      if (!facs.length) facs = D.Facilities.published();
      return '<div class="wizard-panel active"><div class="field"><label for="wFac">Select a facility</label><select id="wFac">' +
        '<option value="">Choose a facility</option>' +
        facs.map(function(f){ return '<option value="'+U.escapeHtml(f.id)+'" '+(d.facilityId===f.id?'selected':'')+'>'+U.escapeHtml(f.name)+' — '+U.escapeHtml(f.town)+'</option>'; }).join('') +
        '</select></div>' +
        '<p class="muted" style="font-size:.8rem;">If your chosen service is not linked to a facility in the demo data, all published facilities are shown. Confirm availability with the facility.</p></div>';
    }
    if (step === 3) {
      return '<div class="wizard-panel active"><div class="field"><label for="wDate">Preferred date</label><input id="wDate" type="date" value="'+U.escapeHtml(d.date||'')+'"></div>' +
        '<p class="muted" style="font-size:.8rem;">Choose a future date. This is a demonstration slot request, not a confirmed booking.</p></div>';
    }
    if (step === 4) {
      const slots = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00'];
      return '<div class="wizard-panel active"><div class="field"><label for="wTime">Preferred time (demonstration slot)</label><select id="wTime">' +
        '<option value="">Choose a time</option>' +
        slots.map(function(t){ return '<option value="'+t+'" '+(d.time===t?'selected':'')+'>'+t+'</option>'; }).join('') +
        '</select></div></div>';
    }
    if (step === 5) {
      return '<div class="wizard-panel active">' +
        '<div class="field"><label for="wName">Full name</label><input id="wName" type="text" value="'+U.escapeHtml(d.name||'')+'"></div>' +
        '<div class="field"><label for="wPhone">Phone number</label><input id="wPhone" type="tel" value="'+U.escapeHtml(d.phone||'')+'"></div>' +
        '<div class="field"><label for="wEmail">Email (optional)</label><input id="wEmail" type="email" value="'+U.escapeHtml(d.email||'')+'"></div>' +
        '<div class="field"><label for="wNotes">Notes (optional)</label><textarea id="wNotes" placeholder="Reason for visit (no sensitive medical details)">'+U.escapeHtml(d.notes||'')+'</textarea></div>' +
        '<p class="muted" style="font-size:.8rem;">Do not include national ID numbers, payment details, or detailed medical history.</p>' +
      '</div>';
    }
    if (step === 6) {
      const s = D.Services.get(d.serviceId); const f = D.Facilities.get(d.facilityId);
      return '<div class="wizard-panel active">' +
        '<h3>Review your request</h3>' +
        '<p><strong>Service:</strong> ' + U.escapeHtml(s ? s.name : '—') + '</p>' +
        '<p><strong>Facility:</strong> ' + U.escapeHtml(f ? f.name : '—') + '</p>' +
        '<p><strong>Date:</strong> ' + U.escapeHtml(d.date || '—') + '</p>' +
        '<p><strong>Time:</strong> ' + U.escapeHtml(d.time || '—') + '</p>' +
        '<p><strong>Name:</strong> ' + U.escapeHtml(d.name || '—') + '</p>' +
        '<p><strong>Phone:</strong> ' + U.escapeHtml(d.phone || '—') + '</p>' +
        '<p class="muted" style="font-size:.8rem;">Submitting creates a local demonstration record with a demo reference number. It is not a confirmed hospital appointment.</p>' +
      '</div>';
    }
    return '';
  }

  function attachWizardHandlers() {
    const d = state.appointment.data;
    const s1 = document.getElementById('wSvc'); if (s1) s1.addEventListener('change', function(){ d.serviceId = s1.value; });
    const s2 = document.getElementById('wFac'); if (s2) s2.addEventListener('change', function(){ d.facilityId = s2.value; });
    const s3 = document.getElementById('wDate'); if (s3) s3.addEventListener('change', function(){ d.date = s3.value; });
    const s4 = document.getElementById('wTime'); if (s4) s4.addEventListener('change', function(){ d.time = s4.value; });
    const n = document.getElementById('wName'); if (n) n.addEventListener('input', function(){ d.name = n.value; });
    const p = document.getElementById('wPhone'); if (p) p.addEventListener('input', function(){ d.phone = p.value; });
    const e = document.getElementById('wEmail'); if (e) e.addEventListener('input', function(){ d.email = e.value; });
    const nt = document.getElementById('wNotes'); if (nt) nt.addEventListener('input', function(){ d.notes = nt.value; });
  }

  function validateWizardStep(step) {
    const d = state.appointment.data;
    if (step === 1 && !d.serviceId) { U.toast('Please select a service.', 'warn'); return false; }
    if (step === 2 && !d.facilityId) { U.toast('Please select a facility.', 'warn'); return false; }
    if (step === 3) {
      if (!d.date) { U.toast('Please choose a date.', 'warn'); return false; }
      const chosen = new Date(d.date); const today = new Date(); today.setHours(0,0,0,0);
      if (chosen < today) { U.toast('Please choose a future date.', 'warn'); return false; }
    }
    if (step === 4 && !d.time) { U.toast('Please choose a time.', 'warn'); return false; }
    if (step === 5) {
      if (!U.required(d.name)) { U.toast('Please enter your name.', 'warn'); return false; }
      if (!U.validatePhone(d.phone)) { U.toast('Please enter a valid phone number.', 'warn'); return false; }
      if (d.email && !U.validateEmail(d.email)) { U.toast('Please enter a valid email.', 'warn'); return false; }
    }
    return true;
  }

  // wizard nav handlers (delegated)
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'wizNext') {
      if (!validateWizardStep(state.appointment.step)) return;
      if (state.appointment.step < 6) { state.appointment.step++; renderWizard(); }
      else { submitAppointment(); }
    }
    if (e.target && e.target.id === 'wizBack') {
      if (state.appointment.step > 1) { state.appointment.step--; renderWizard(); }
    }
  });

  function submitAppointment() {
    const d = state.appointment.data;
    const rec = {
      id: null,
      serviceId: d.serviceId,
      facilityId: d.facilityId,
      date: d.date,
      time: d.time,
      name: d.name,
      phone: d.phone,
      email: d.email || '',
      notes: d.notes || '',
      status: 'New',
      demo: true
    };
    const saved = D.Appointments.save(rec);
    U.toast('Request submitted. Reference: ' + saved.ref, 'success');
    // confirmation screen
    const panels = document.getElementById('wizPanels');
    panels.innerHTML =
      '<div class="empty-state">' +
        '<div class="empty-icon">' + C.icon('check') + '</div>' +
        '<h3>Request received (demonstration)</h3>' +
        '<p>Your demonstration reference number is <strong>' + U.escapeHtml(saved.ref) + '</strong>.</p>' +
        '<p class="muted">This is not a confirmed hospital appointment. A real confirmation requires a connected, authorised backend and review by hospital staff.</p>' +
        '<p class="muted">If you need urgent care, contact the facility directly or call 0701 302 302.</p>' +
        '<button class="btn btn-primary" id="newReq">Make another request</button>' +
      '</div>';
    document.getElementById('wizSteps').innerHTML = '';
    document.getElementById('wizBack').style.visibility = 'hidden';
    document.getElementById('wizNext').style.display = 'none';
    const nr = document.getElementById('newReq');
    if (nr) nr.addEventListener('click', function(){ setupAppointmentWizard(); });
  }

  // ---------- patient resources ----------
  function renderPatientResources() {
    const sec = document.getElementById('resources');
    if (!sec) return;
    const content = D.Content.get();
    const faqs = content.faqs || [];
    sec.innerHTML =
      '<div class="container">' +
        '<div class="section-title">' +
          '<span class="eyebrow">Patient resources</span>' +
          '<h2>Before you visit</h2>' +
          '<p>General guidance for patients and visitors. Information is for demonstration and must be verified with the facility.</p>' +
        '</div>' +
        '<div class="grid grid-2">' +
          resourceCard('Before Your Visit','Arrive a few minutes early, bring any previous medical records, and confirm the facility location and opening hours.') +
          resourceCard('Appointment Preparation','Have your contact details ready. This demo does not collect ID numbers or payment details.') +
          resourceCard('General Patient Guidance','Follow the instructions given by your clinician. For urgent symptoms, contact the facility or emergency services.') +
          resourceCard('Billing and Insurance Enquiries','Insurance and SHA arrangements must be confirmed directly with the facility. No coverage is claimed here.') +
          resourceCard('Contact and Support','Use the contact form or call the main call centre on 0111 161 400.') +
          resourceCard('Accessibility Information','This site aims for keyboard navigation, readable text and responsive layouts. Report accessibility issues via the contact form.') +
        '</div>' +
        '<div style="margin-top:32px;">' +
          '<h3>Frequently asked questions</h3>' +
          '<div id="faqList">' + faqs.map(function(f){ return '<div class="faq-item"><button class="faq-q">'+U.escapeHtml(f.q)+' <span>'+C.icon('chevronDown')+'</span></button><div class="faq-a">'+U.escapeHtml(f.a)+'</div></div>'; }).join('') + '</div>' +
        '</div>' +
      '</div>';
    setupFAQs();
  }
  function resourceCard(title, text) {
    return '<div class="resource-card"><h3>'+U.escapeHtml(title)+'</h3><p>'+U.escapeHtml(text)+'</p></div>';
  }

  function setupFAQs() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      const q = item.querySelector('.faq-q');
      if (q) q.addEventListener('click', function(){ item.classList.toggle('open'); });
    });
  }

  // ---------- contact ----------
  function renderContact() {
    const sec = document.getElementById('contact');
    if (!sec) return;
    const content = D.Content.get();
    const facs = D.Facilities.published();
    sec.innerHTML =
      '<div class="container">' +
        '<div class="section-title">' +
          '<span class="eyebrow">Contact and support</span>' +
          '<h2>Get in touch</h2>' +
          '<p>Contact details are from the project brief and may require verification.</p>' +
        '</div>' +
        '<div class="grid grid-2">' +
          '<div>' +
            '<div class="resource-card">' +
              '<h3>Main call centre</h3>' +
              '<p><a href="tel:0111161400">0111 161 400</a></p>' +
              '<h3>General email</h3>' +
              '<p><a href="mailto:info@oasishealthcaregroup.com">info@oasishealthcaregroup.com</a></p>' +
              '<h3>Main office</h3>' +
              '<p>Greenhouse Mall, 1st Floor, Ngong Road, Nairobi, Kenya</p>' +
              '<h3>Emergency contacts</h3>' +
              '<p><a href="tel:0701302302">0701 302 302</a> · <a href="tel:0111161400">0111 161 400</a></p>' +
              '<p class="muted" style="font-size:.8rem;">For urgent care, contact the facility directly or emergency services.</p>' +
            '</div>' +
            '<div class="resource-card" style="margin-top:16px;">' +
              '<h3>Facility-specific contacts</h3>' +
              '<div style="max-height:260px; overflow:auto;">' +
                facs.map(function(f){
                  const ph = (f.phones||[])[0];
                  return '<div style="padding:6px 0; border-bottom:1px solid #e2e8f0;"><strong>'+U.escapeHtml(f.name)+'</strong><br>' +
                    (ph ? '<a href="'+U.telHref(ph)+'">'+U.escapeHtml(ph)+'</a>' : '<span class="muted">Contact main call centre</span>') + '</div>';
                }).join('') +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<form id="contactForm" class="finder" novalidate>' +
              '<div class="field"><label for="cName">Name</label><input id="cName" type="text" required></div>' +
              '<div class="field"><label for="cEmail">Email</label><input id="cEmail" type="email" required></div>' +
              '<div class="field"><label for="cPhone">Phone (optional)</label><input id="cPhone" type="tel"></div>' +
              '<div class="field"><label for="cFacility">Related facility (optional)</label><select id="cFacility"><option value="">General enquiry</option>' + facs.map(function(f){return '<option value="'+U.escapeHtml(f.id)+'">'+U.escapeHtml(f.name)+'</option>';}).join('') + '</select></div>' +
              '<div class="field"><label for="cSubject">Subject</label><input id="cSubject" type="text" required></div>' +
              '<div class="field"><label for="cMessage">Message</label><textarea id="cMessage" required></textarea></div>' +
              '<button class="btn btn-primary" type="submit">Send enquiry (demo)</button>' +
              '<p class="muted" style="font-size:.8rem; margin-top:8px;">This form stores your enquiry in the browser for demonstration. It is not delivered to Oasis.</p>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>';
    setupContactForm();
  }

  function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('cName').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const phone = document.getElementById('cPhone').value.trim();
      const facilityId = document.getElementById('cFacility').value;
      const subject = document.getElementById('cSubject').value.trim();
      const message = document.getElementById('cMessage').value.trim();
      let ok = true;
      if (!U.required(name)) ok = false;
      if (!U.validateEmail(email)) ok = false;
      if (!U.required(subject)) ok = false;
      if (!U.required(message)) ok = false;
      if (phone && !U.validatePhone(phone)) ok = false;
      if (!ok) { U.toast('Please correct the highlighted fields.', 'error'); return; }
      const rec = { name:name, email:email, phone:phone, facilityId:facilityId, subject:subject, message:message, status:'New', demo:true };
      D.Enquiries.save(rec);
      form.reset();
      U.toast('Enquiry saved in demonstration storage.', 'success');
    });
  }

  // ---------- about ----------
  function renderAbout() {
    const sec = document.getElementById('about');
    if (!sec) return;
    const content = D.Content.get();
    sec.innerHTML =
      '<div class="container">' +
        '<div class="section-title">' +
          '<span class="eyebrow">About the group</span>' +
          '<h2>A network of care across Kenya</h2>' +
          '<p>' + U.escapeHtml(content.aboutText) + '</p>' +
        '</div>' +
        '<div class="grid grid-3">' +
          '<div class="resource-card"><h3>Our approach</h3><p>Patient-centred care, operational discipline and transparent information.</p></div>' +
          '<div class="resource-card"><h3>Our network</h3><p>Hospitals, doctors\' plazas and care centres in multiple counties.</p></div>' +
          '<div class="resource-card"><h3>Our commitment</h3><p>Clear communication, verified information and respectful service.</p></div>' +
        '</div>' +
        '<div class="demo-notice" style="margin-top:24px; background: rgba(15,118,110,.08); border:1px solid var(--c-line); color: var(--c-body);">' +
          '<strong>Demonstration notice:</strong> This is an independent concept demonstration. It is not an official Oasis Healthcare Group website and does not claim endorsement or commissioning.' +
        '</div>' +
      '</div>';
  }

  // ---------- footer ----------
  function renderFooter() {
    const f = document.getElementById('siteFooter');
    if (!f) return;
    const content = D.Content.get();
    f.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div>' +
            C.logo('compact') +
            '<p style="margin-top:12px; font-size:.9rem;">An independent concept demonstration of a digital platform for a multi-facility healthcare group in Kenya.</p>' +
            '<div class="demo-notice">Demonstration only. Not an official Oasis website. Do not enter real personal or medical information.</div>' +
          '</div>' +
          '<div><h4>Quick links</h4><ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">' +
            '<li><a href="#home">Home</a></li><li><a href="#about">About</a></li><li><a href="#facilities">Facilities</a></li><li><a href="#services">Services</a></li><li><a href="#doctors">Doctors</a></li>' +
          '</ul></div>' +
          '<div><h4>Contact</h4><ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">' +
            '<li><a href="tel:0111161400">0111 161 400</a></li><li><a href="mailto:info@oasishealthcaregroup.com">info@oasishealthcaregroup.com</a></li><li>Greenhouse Mall, 1st Floor, Ngong Road, Nairobi</li>' +
          '</ul></div>' +
          '<div><h4>Emergency</h4><ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">' +
            '<li><a href="tel:0701302302">0701 302 302</a></li><li><a href="tel:0111161400">0111 161 400</a></li><li class="muted">For urgent care, contact the facility directly.</li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© ' + new Date().getFullYear() + ' Concept demonstration. Not affiliated with Oasis Healthcare Group.</span>' +
          '<span>Admin dashboard: <a href="admin.html">admin.html</a> (demo login required)</span>' +
        '</div>' +
      '</div>';
    U.applyImgFallbacks(f);
  }

  function setupStorageSync() {
    window.addEventListener('oasis:data-changed', function () {
      renderHero();
      renderFacilityResults();
      renderServiceResults();
      renderDoctorResults();
      renderContact();
      renderAbout();
    });
    window.addEventListener('storage', function () {
      renderHero();
      renderFacilityResults();
      renderServiceResults();
      renderDoctorResults();
      renderContact();
    });
  }

  // expose for admin? no
  window.OasisApp = { resetWizard: resetWizard, startAppointment: startAppointment };
})();
