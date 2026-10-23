/* admin.js — functional demonstration admin dashboard */
(function () {
  'use strict';
  const U = window.OasisUtils;
  const D = window.OasisData;
  const C = window.OasisComponents;

  const state = {
    view: 'overview',
    filters: {},
    editingFacility: null,
    editingDoctor: null,
    editingService: null,
    enquiryFilter: 'all',
    appointmentFilter: { status:'', facility:'', q:'', date:'' },
    facilityFilter: { q:'', category:'', county:'', status:'', verification:'' },
    serviceFilter: { q:'' },
    doctorFilter: { q:'' },
    contentDraft: null
  };

  // ---------- auth ----------
  const SESSION_KEY = 'oasis_admin_session_v1';
  function isLoggedIn() { return sessionStorage.getItem(SESSION_KEY) === '1'; }
  function login(u, p) {
    const s = D.Settings.get();
    const creds = (s.demoCredentials) || { username:'admin', password:'demo' };
    if (u === creds.username && p === creds.password) {
      sessionStorage.setItem(SESSION_KEY, '1');
      return true;
    }
    return false;
  }
  function logout() { sessionStorage.removeItem(SESSION_KEY); location.reload(); }

  document.addEventListener('DOMContentLoaded', function () {
    U.applyImgFallbacks(document);
    // logo in login
    document.querySelectorAll('[data-logo]').forEach(function (el){ el.innerHTML = C.logo(el.dataset.logo==='compact'?'compact':'full'); });
    if (isLoggedIn()) showApp(); else showLogin();
    setupLogin();
    setupSidebar();
    setupStorageSync();
  });

  function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appShell').style.display = 'none';
  }
  function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appShell').style.display = 'block';
    document.querySelectorAll('[data-logo]').forEach(function (el){ el.innerHTML = C.logo(el.dataset.logo==='compact'?'compact':'full'); });
    buildSidebar();
    const brand = document.querySelector('.sidebar-brand .logo');
    if (brand) brand.addEventListener('click', function (e) { e.preventDefault(); navigate('overview'); closeSidebar(); });
    navigate('overview');
  }
  function setupLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const u = document.getElementById('lUser').value.trim();
      const p = document.getElementById('lPass').value;
      const err = document.getElementById('loginErr');
      if (login(u, p)) {
        err.style.display = 'none';
        showApp();
      } else {
        err.textContent = 'Invalid demo credentials. Use admin / demo.';
        err.style.display = 'block';
      }
    });
  }

  const NAV = [
    { id:'overview', label:'Overview', icon:'chart' },
    { id:'facilities', label:'Facilities', icon:'building' },
    { id:'appointments', label:'Appointments', icon:'calendar' },
    { id:'doctors', label:'Doctors', icon:'user' },
    { id:'services', label:'Services', icon:'stethoscope' },
    { id:'enquiries', label:'Contact Enquiries', icon:'mail' },
    { id:'content', label:'Content Management', icon:'edit' },
    { id:'reports', label:'Reports', icon:'download' },
    { id:'settings', label:'Settings', icon:'settings' }
  ];

  function buildSidebar() {
    const nav = document.getElementById('sideNav');
    nav.innerHTML = NAV.map(function (n) {
      return '<button class="nav-item" data-view="'+n.id+'">' + C.icon(n.icon) + '<span>'+U.escapeHtml(n.label)+'</span></button>';
    }).join('');
    nav.querySelectorAll('.nav-item').forEach(function (b) {
      b.addEventListener('click', function(){ navigate(b.dataset.view); closeSidebar(); });
    });
  }

  function setupSidebar() {
    const toggle = document.getElementById('sideToggle');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sideBackdrop');
    if (toggle) toggle.addEventListener('click', function(){ sidebar.classList.toggle('open'); backdrop.classList.toggle('open'); });
    if (backdrop) backdrop.addEventListener('click', closeSidebar);
    const logout = document.getElementById('logoutBtn');
    if (logout) logout.addEventListener('click', logout);
    const gs = document.getElementById('globalSearch');
    if (gs) gs.addEventListener('input', U.debounce(function(){
      const q = gs.value.trim();
      if (q.length > 0) {
        state.facilityFilter.q = q;
        if (state.view !== 'facilities') { navigate('facilities'); } else { renderCurrent(); }
      }
    }, 250));
    const notif = document.getElementById('notifBtn');
    if (notif) notif.addEventListener('click', openNotifications);
  }

  function updateNotifCount() {
    const el = document.getElementById('notifCount');
    if (!el) return;
    const counts = D.overviewCounts();
    const n = counts.appointmentsPending + counts.enquiriesNew;
    const btn = document.getElementById('notifBtn');
    if (btn) btn.setAttribute('aria-label', n > 0 ? 'Notifications (' + n + ' pending)' : 'Notifications');
    if (n > 0) { el.textContent = String(n); el.style.display = 'inline-flex'; }
    else { el.style.display = 'none'; }
  }

  function openNotifications() {
    const recent = D.Activity.all().slice(0,10);
    const content = recent.length ? '<ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px;">' +
      recent.map(function(a){ return '<li style="padding:8px 0; border-bottom:1px solid var(--a-line);"><span class="badge badge-muted">'+U.escapeHtml(a.type)+'</span> '+U.escapeHtml(a.message)+'<br><span class="muted" style="font-size:.75rem;">'+U.formatDateTime(a.createdAt)+'</span></li>'; }).join('') + '</ul>'
      : '<p class="muted">No notifications.</p>';
    U.modal({ title: 'Notifications & recent activity', content: content });
  }
  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sideBackdrop').classList.remove('open');
  }

  function navigate(view) {
    state.view = view;
    document.querySelectorAll('.nav-item').forEach(function (b){ b.classList.toggle('active', b.dataset.view === view); });
    const meta = NAV.find(function (n){return n.id===view;});
    document.getElementById('pageTitle').textContent = meta ? meta.label : view;
    document.getElementById('pageSub').textContent = 'Dashboard / ' + (meta ? meta.label : view);
    renderCurrent();
  }

  function renderCurrent() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    switch (state.view) {
      case 'overview': renderOverview(content); break;
      case 'facilities': renderFacilities(content); break;
      case 'appointments': renderAppointments(content); break;
      case 'doctors': renderDoctorsAdmin(content); break;
      case 'services': renderServicesAdmin(content); break;
      case 'enquiries': renderEnquiries(content); break;
      case 'content': renderContentAdmin(content); break;
      case 'reports': renderReports(content); break;
      case 'settings': renderSettings(content); break;
      default: content.innerHTML = '<p>Unknown view.</p>';
    }
    U.applyImgFallbacks(content);
    updateNotifCount();
  }

  function setupStorageSync() {
    window.addEventListener('oasis:data-changed', function(){ if (isLoggedIn()) renderCurrent(); });
    window.addEventListener('storage', function(){ if (isLoggedIn()) renderCurrent(); });
  }

  // ---------- helpers ----------
  function panel(title, sub, bodyHtml, actions) {
    return '<div class="panel"><div class="panel-head"><div><h3 class="panel-title">'+U.escapeHtml(title)+'</h3>'+(sub?'<p class="panel-sub">'+U.escapeHtml(sub)+'</p>':'')+'</div>'+(actions||'')+'</div>'+bodyHtml+'</div>';
  }

  function kpi(label, value, sub, color, icon) {
    return '<div class="kpi '+color+'"><div class="kpi-icon">'+C.icon(icon)+'</div><div class="kpi-label">'+U.escapeHtml(label)+'</div><div class="kpi-value">'+U.escapeHtml(String(value))+'</div><div class="kpi-sub">'+U.escapeHtml(sub)+'</div></div>';
  }

  // ---------- overview ----------
  function renderOverview(root) {
    const counts = D.overviewCounts();
    const aStats = D.Appointments.stats();
    const fCounts = D.Facilities.counts();
    const recent = D.Activity.all().slice(0,8);
    root.innerHTML =
      '<div class="kpi-grid">' +
        kpi('Total facilities', counts.facilitiesTotal, 'Registered in demo data', 'teal', 'building') +
        kpi('Published facilities', counts.facilitiesPublished, 'Visible on public site', 'green', 'check') +
        kpi('Pending verification', counts.facilitiesPending, 'Awaiting confirmation', 'amber', 'alert') +
        kpi('Appointment requests', counts.appointmentsTotal, counts.appointmentsPending + ' pending', 'navy', 'calendar') +
        kpi('Contact enquiries', counts.enquiriesTotal, counts.enquiriesNew + ' new', 'purple', 'mail') +
        kpi('Service categories', counts.servicesTotal, counts.servicesPublished + ' published', 'teal', 'stethoscope') +
        kpi('Demo doctors', counts.doctorsTotal, 'Sample profiles', 'amber', 'user') +
        kpi('Facilities needing correction', fCounts.needsCorrection + fCounts.possibleDuplicate, 'Flagged records', 'red', 'alert') +
      '</div>' +
      '<div class="overview-charts">' +
        panel('Appointments by month', 'Demonstration data', barChartFromObject(aStats.byMonth, 'var(--a-teal)')) +
        panel('Appointment status', 'Demonstration data', barChartFromObject(aStats.statuses, 'var(--a-navy)')) +
      '</div>' +
      '<div class="overview-charts">' +
        panel('Facilities by category', 'Demonstration data', facilitiesByCategoryChart()) +
        panel('Facility verification progress', 'Demonstration data', verificationChart(fCounts)) +
      '</div>' +
      panel('Recent activity', 'Actual interactions in the demo', recent.length ? '<ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">' +
        recent.map(function(a){ return '<li style="padding:8px 0; border-bottom:1px solid var(--a-line);"><span class="badge badge-muted">'+U.escapeHtml(a.type)+'</span> '+U.escapeHtml(a.message)+' <span class="muted" style="font-size:.75rem;">'+U.formatDateTime(a.createdAt)+'</span></li>'; }).join('') + '</ul>' : '<p class="muted">No activity yet.</p>');
  }

  function barChartFromObject(obj, color) {
    const entries = Object.keys(obj).sort().map(function(k){ return [k, obj[k]]; });
    if (!entries.length) return '<p class="muted">No data.</p>';
    const max = Math.max.apply(null, entries.map(function(e){return e[1];})) || 1;
    return '<div class="bar-chart">' + entries.map(function(e){
      const pct = Math.round((e[1]/max)*100);
      return '<div class="bar-row"><span>'+U.escapeHtml(e[0])+'</span><div class="bar-track"><div class="bar-fill" style="width:'+pct+'%; background:'+color+';"></div></div><span>'+e[1]+'</span></div>';
    }).join('') + '</div>';
  }
  function facilitiesByCategoryChart() {
    const counts = {};
    D.Facilities.all().forEach(function(f){ counts[f.category] = (counts[f.category]||0)+1; });
    return barChartFromObject(counts, 'var(--a-teal)');
  }
  function verificationChart(fc) {
    const obj = { 'Verified': fc.verified, 'Pending': fc.pending, 'Needs correction': fc.needsCorrection, 'Possible duplicate': fc.possibleDuplicate };
    return barChartFromObject(obj, 'var(--a-amber)');
  }

  // ---------- facilities admin ----------
  function renderFacilities(root) {
    const f = state.facilityFilter;
    let items = D.Facilities.search(f.q, { category: f.category, county: f.county, status: f.status, verification: f.verification });
    const counties = Array.from(new Set(D.Facilities.all().map(function(x){return x.county;}))).sort();
    const cats = D.FACILITY_CATEGORIES;
    root.innerHTML =
      panel('Facility registry', 'Manage demonstration facility records. Changes reflect on the public site immediately.',
        '<div class="filter-grid">' +
          '<input id="afQ" type="search" placeholder="Search" value="'+U.escapeHtml(f.q||'')+'">' +
          '<select id="afCat" aria-label="Filter by category"><option value="">All categories</option>'+cats.map(function(c){return '<option value="'+U.escapeHtml(c)+'" '+(f.category===c?'selected':'')+'>'+U.escapeHtml(c)+'</option>';}).join('')+'</select>' +
          '<select id="afCounty" aria-label="Filter by county"><option value="">All counties</option>'+counties.map(function(c){return '<option value="'+U.escapeHtml(c)+'" '+(f.county===c?'selected':'')+'>'+U.escapeHtml(c)+'</option>';}).join('')+'</select>' +
          '<select id="afStatus" aria-label="Filter by publication status"><option value="">All status</option><option value="published" '+(f.status==='published'?'selected':'')+'>Published</option><option value="draft" '+(f.status==='draft'?'selected':'')+'>Draft</option></select>' +
          '<select id="afVer" aria-label="Filter by verification status"><option value="">All verification</option><option value="verified" '+(f.verification==='verified'?'selected':'')+'>Verified</option><option value="pending" '+(f.verification==='pending'?'selected':'')+'>Pending</option><option value="needs_correction" '+(f.verification==='needs_correction'?'selected':'')+'>Needs correction</option><option value="possible_duplicate" '+(f.verification==='possible_duplicate'?'selected':'')+'>Possible duplicate</option></select>' +
        '</div>' +
        '<div style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">' +
          '<button class="btn btn-primary btn-sm" id="afAdd">+ Add facility</button>' +
          '<button class="btn btn-sm" id="afExport">Export CSV</button>' +
          '<button class="btn btn-sm btn-danger" id="afReset">Reset demo data</button>' +
        '</div>' +
        (items.length ? tableFacilities(items) : '<div class="empty-state"><h3>No facilities match</h3></div>')
      );
    // handlers
    document.getElementById('afQ').addEventListener('input', U.debounce(function(){ state.facilityFilter.q = this.value; renderCurrent(); },200));
    document.getElementById('afCat').addEventListener('change', function(){ state.facilityFilter.category = this.value; renderCurrent(); });
    document.getElementById('afCounty').addEventListener('change', function(){ state.facilityFilter.county = this.value; renderCurrent(); });
    document.getElementById('afStatus').addEventListener('change', function(){ state.facilityFilter.status = this.value; renderCurrent(); });
    document.getElementById('afVer').addEventListener('change', function(){ state.facilityFilter.verification = this.value; renderCurrent(); });
    document.getElementById('afAdd').addEventListener('click', function(){ openFacilityEditor(null); });
    document.getElementById('afExport').addEventListener('click', function(){ U.downloadText('facilities.csv', D.exportFacilitiesCSV(), 'text/csv'); U.toast('CSV exported.', 'success'); });
    document.getElementById('afReset').addEventListener('click', function(){ U.confirm('Reset demo data?', 'This restores the original sample dataset and removes your changes.', function(){ D.resetData(); U.toast('Demo data reset.', 'success'); renderCurrent(); }); });
    // row actions
    root.querySelectorAll('[data-action="fac-edit"]').forEach(function(b){ b.addEventListener('click', function(){ openFacilityEditor(b.dataset.id); }); });
    root.querySelectorAll('[data-action="fac-toggle"]').forEach(function(b){ b.addEventListener('click', function(){ toggleFacilityPublish(b.dataset.id); }); });
    root.querySelectorAll('[data-action="fac-delete"]').forEach(function(b){ b.addEventListener('click', function(){ deleteFacility(b.dataset.id); }); });
    root.querySelectorAll('[data-action="fac-merge"]').forEach(function(b){ b.addEventListener('click', function(){ openMergeModal(b.dataset.id); }); });
  }

  function openMergeModal(sourceId) {
    const source = D.Facilities.get(sourceId);
    if (!source) return;
    const others = D.Facilities.all().filter(function(x){ return x.id !== sourceId; });
    const content =
      '<p>Merge <strong>' + U.escapeHtml(source.name) + '</strong> into another facility. Services and phone numbers from the source are added to the target, then the source record is removed.</p>' +
      '<div class="field"><label>Merge into</label><select id="mergeTarget"><option value="">Select target facility</option>' +
        others.map(function(x){ return '<option value="'+U.escapeHtml(x.id)+'">'+U.escapeHtml(x.name)+' ('+U.escapeHtml(x.town)+')</option>'; }).join('') +
      '</select></div>' +
      '<p class="muted" style="font-size:.8rem;">Alternative: use Edit to mark the record as "Possible duplicate" without merging.</p>';
    const m = U.modal({ title:'Merge facility record', content: content, footer: '<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-primary" data-merge>Merge</button>' });
    m.overlay.querySelector('[data-cancel]').addEventListener('click', m.close);
    m.overlay.querySelector('[data-merge]').addEventListener('click', function () {
      const targetId = m.overlay.querySelector('#mergeTarget').value;
      if (!targetId) { U.toast('Select a target facility.', 'warn'); return; }
      const target = D.Facilities.get(targetId);
      if (!target) return;
      const mergedServices = Array.from(new Set((target.services||[]).concat(source.services||[])));
      const mergedPhones = Array.from(new Set((target.phones||[]).concat(source.phones||[])));
      target.services = mergedServices;
      target.phones = mergedPhones;
      D.Facilities.save(target);
      D.Facilities.delete(sourceId);
      U.toast('Facility merged into ' + target.name + '.', 'success');
      m.close();
      renderCurrent();
    });
  }

  function tableFacilities(items) {
    return '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th>Name</th><th>Category</th><th>County / Town</th><th>Verification</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
      items.map(function(f){
        return '<tr>' +
          '<td><strong>'+U.escapeHtml(f.name)+'</strong><br><span class="muted" style="font-size:.75rem;">'+U.escapeHtml(f.id)+'</span></td>' +
          '<td>'+U.escapeHtml(f.category)+'</td>' +
          '<td>'+U.escapeHtml(f.town)+', '+U.escapeHtml(f.county)+'</td>' +
          '<td>'+C.statusBadge(f.verification)+'</td>' +
          '<td>'+C.statusBadge(f.status)+'</td>' +
          '<td style="white-space:nowrap;">' +
            '<button class="btn btn-sm" data-action="fac-edit" data-id="'+U.escapeHtml(f.id)+'">Edit</button> ' +
            '<button class="btn btn-sm btn-ghost" data-action="fac-toggle" data-id="'+U.escapeHtml(f.id)+'">'+(f.status==='published'?'Unpublish':'Publish')+'</button> ' +
            '<button class="btn btn-sm btn-ghost" data-action="fac-merge" data-id="'+U.escapeHtml(f.id)+'">Merge</button> ' +
            '<button class="btn btn-sm btn-danger" data-action="fac-delete" data-id="'+U.escapeHtml(f.id)+'">Delete</button>' +
          '</td></tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  function openFacilityEditor(id) {
    const f = id ? D.Facilities.get(id) : null;
    const counties = Array.from(new Set(D.Facilities.all().map(function(x){return x.county;}))).sort();
    const cats = D.FACILITY_CATEGORIES;
    const svcs = D.Services.all();
    const selectedServices = f ? (f.services||[]) : [];
    const content =
      '<form id="facForm">' +
        '<div class="form-grid">' +
          '<div class="field"><label>Name *</label><input name="name" required value="'+U.escapeHtml(f?f.name:'')+'"></div>' +
          '<div class="field"><label>Category *</label><select name="category" required>'+cats.map(function(c){return '<option value="'+U.escapeHtml(c)+'" '+(f&&f.category===c?'selected':'')+'>'+U.escapeHtml(c)+'</option>';}).join('')+'</select></div>' +
          '<div class="field"><label>County *</label><input name="county" required value="'+U.escapeHtml(f?f.county:'')+'"></div>' +
          '<div class="field"><label>Town *</label><input name="town" required value="'+U.escapeHtml(f?f.town:'')+'"></div>' +
          '<div class="field full"><label>Address (optional)</label><input name="address" value="'+U.escapeHtml(f&&f.address?f.address:'')+'" placeholder="Contact facility to confirm"></div>' +
          '<div class="field"><label>Phones (comma separated)</label><input name="phones" value="'+U.escapeHtml(f&&(f.phones||[]).join(', '))+'"></div>' +
          '<div class="field"><label>Opening hours</label><input name="hours" value="'+U.escapeHtml(f?f.hours:'Contact facility to confirm opening hours')+'"></div>' +
          '<div class="field"><label>Emergency availability</label><select name="emergency"><option value="true" '+(f&&f.emergency?'selected':'')+'>Available (confirm)</option><option value="false" '+(f&&!f.emergency?'selected':'')+'>Contact facility to confirm</option></select></div>' +
          '<div class="field"><label>Publication status</label><select name="status"><option value="draft" '+(f&&f.status==='draft'?'selected':'')+'>Draft</option><option value="published" '+(f&&f.status==='published'?'selected':'')+'>Published</option></select></div>' +
          '<div class="field"><label>Verification status</label><select name="verification"><option value="pending" '+(f&&f.verification==='pending'?'selected':'')+'>Pending verification</option><option value="verified" '+(f&&f.verification==='verified'?'selected':'')+'>Verified</option><option value="needs_correction" '+(f&&f.verification==='needs_correction'?'selected':'')+'>Needs correction</option><option value="possible_duplicate" '+(f&&f.verification==='possible_duplicate'?'selected':'')+'>Possible duplicate</option></select></div>' +
          '<div class="field full"><label>Description</label><textarea name="description">'+U.escapeHtml(f?f.description:'')+'</textarea></div>' +
          '<div class="field full"><label>Services (demo)</label><div style="display:flex; flex-wrap:wrap; gap:6px;">' +
            svcs.map(function(s){ return '<label style="font-size:.8rem;"><input type="checkbox" name="svc" value="'+U.escapeHtml(s.id)+'" '+(selectedServices.indexOf(s.id)>=0?'checked':'')+'> '+U.escapeHtml(s.name)+'</label>'; }).join('') +
          '</div></div>' +
        '</div>' +
      '</form>';
    const m = U.modal({ title: id ? 'Edit facility' : 'Add facility', content: content, size:'modal-lg', footer: '<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-primary" data-save>Save</button>' });
    m.overlay.querySelector('[data-cancel]').addEventListener('click', m.close);
    m.overlay.querySelector('[data-save]').addEventListener('click', function () {
      const form = m.overlay.querySelector('#facForm');
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const phones = String(fd.get('phones')||'').split(',').map(function(x){return x.trim();}).filter(Boolean);
      const services = Array.from(form.querySelectorAll('input[name="svc"]:checked')).map(function(x){return x.value;});
      const rec = {
        id: id || undefined,
        name: fd.get('name'),
        category: fd.get('category'),
        county: fd.get('county'),
        town: fd.get('town'),
        address: fd.get('address') || null,
        phones: phones,
        hours: fd.get('hours'),
        emergency: fd.get('emergency') === 'true',
        status: fd.get('status'),
        verification: fd.get('verification'),
        description: fd.get('description'),
        services: services
      };
      D.Facilities.save(rec);
      U.toast('Facility saved.', 'success');
      m.close();
      renderCurrent();
    });
  }

  function toggleFacilityPublish(id) {
    const f = D.Facilities.get(id);
    if (!f) return;
    f.status = f.status === 'published' ? 'draft' : 'published';
    D.Facilities.save(f);
    U.toast('Publication status updated.', 'success');
    renderCurrent();
  }
  function deleteFacility(id) {
    const f = D.Facilities.get(id);
    U.confirm('Delete facility record?', 'Remove "' + (f?f.name:id) + '" from demonstration data?', function () {
      D.Facilities.delete(id);
      U.toast('Facility removed.', 'success');
      renderCurrent();
    }, { okLabel:'Delete' });
  }

  // ---------- appointments admin ----------
  function renderAppointments(root) {
    const f = state.appointmentFilter;
    let items = D.Appointments.all();
    if (f.status) items = items.filter(function(a){return a.status===f.status;});
    if (f.facility) items = items.filter(function(a){return a.facilityId===f.facility;});
    if (f.date) items = items.filter(function(a){return a.date===f.date;});
    if (f.q) { const ql=f.q.toLowerCase(); items = items.filter(function(a){ return (a.name+' '+a.ref+' '+(D.Facilities.get(a.facilityId)||{}).name).toLowerCase().indexOf(ql)>=0; }); }
    const facs = D.Facilities.all();
    const statuses = ['New','Pending Review','Contacted','Confirmed for Demonstration','Cancelled'];
    root.innerHTML =
      panel('Appointment requests', 'Demonstration records from the public request form.',
        '<div class="filter-grid cols-4">' +
          '<input id="aaQ" type="search" placeholder="Search name/ref/facility" value="'+U.escapeHtml(f.q||'')+'">' +
          '<select id="aaStatus" aria-label="Filter by appointment status"><option value="">All statuses</option>'+statuses.map(function(s){return '<option value="'+U.escapeHtml(s)+'" '+(f.status===s?'selected':'')+'>'+U.escapeHtml(s)+'</option>';}).join('')+'</select>' +
          '<select id="aaFac" aria-label="Filter by facility"><option value="">All facilities</option>'+facs.map(function(x){return '<option value="'+U.escapeHtml(x.id)+'" '+(f.facility===x.id?'selected':'')+'>'+U.escapeHtml(x.name)+'</option>';}).join('')+'</select>' +
          '<input id="aaDate" type="date" value="'+U.escapeHtml(f.date||'')+'" aria-label="Filter by date">' +
        '</div>' +
        '<div style="margin-bottom:12px;"><button class="btn btn-sm" id="aaExport">Export CSV</button></div>' +
        (items.length ? tableAppointments(items) : '<div class="empty-state"><h3>No appointment requests</h3><p>Requests submitted on the public site will appear here.</p></div>')
      );
    document.getElementById('aaQ').addEventListener('input', U.debounce(function(){ state.appointmentFilter.q = this.value; renderCurrent(); },200));
    document.getElementById('aaStatus').addEventListener('change', function(){ state.appointmentFilter.status = this.value; renderCurrent(); });
    document.getElementById('aaFac').addEventListener('change', function(){ state.appointmentFilter.facility = this.value; renderCurrent(); });
    document.getElementById('aaDate').addEventListener('change', function(){ state.appointmentFilter.date = this.value; renderCurrent(); });
    document.getElementById('aaExport').addEventListener('click', function(){ U.downloadText('appointments.csv', D.exportAppointmentsCSV(), 'text/csv'); U.toast('CSV exported.', 'success'); });
    root.querySelectorAll('[data-action="apt-view"]').forEach(function(b){ b.addEventListener('click', function(){ openAppointmentModal(b.dataset.id); }); });
    root.querySelectorAll('[data-action="apt-delete"]').forEach(function(b){ b.addEventListener('click', function(){ deleteAppointment(b.dataset.id); }); });
  }

  function tableAppointments(items) {
    return '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th>Reference</th><th>Patient (demo)</th><th>Service</th><th>Facility</th><th>Date / Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
      items.map(function(a){
        const s = D.Services.get(a.serviceId); const f = D.Facilities.get(a.facilityId);
        return '<tr>' +
          '<td><strong>'+U.escapeHtml(a.ref)+'</strong></td>' +
          '<td>'+U.escapeHtml(a.name)+'<br><span class="muted" style="font-size:.75rem;">'+U.escapeHtml(a.phone)+'</span></td>' +
          '<td>'+U.escapeHtml(s?s.name:a.serviceId)+'</td>' +
          '<td>'+U.escapeHtml(f?f.name:a.facilityId)+'</td>' +
          '<td>'+U.escapeHtml(a.date)+' '+U.escapeHtml(a.time)+'</td>' +
          '<td>'+C.statusBadge(a.status)+'</td>' +
          '<td style="white-space:nowrap;">' +
            '<button class="btn btn-sm" data-action="apt-view" data-id="'+U.escapeHtml(a.id)+'">View</button> ' +
            '<button class="btn btn-sm btn-danger" data-action="apt-delete" data-id="'+U.escapeHtml(a.id)+'">Delete</button>' +
          '</td></tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  function openAppointmentModal(id) {
    const a = D.Appointments.get(id);
    if (!a) return;
    const s = D.Services.get(a.serviceId); const f = D.Facilities.get(a.facilityId);
    const statuses = ['New','Pending Review','Contacted','Confirmed for Demonstration','Cancelled'];
    const content =
      '<div class="form-grid">' +
        '<div class="field"><label>Reference</label><input value="'+U.escapeHtml(a.ref)+'" disabled></div>' +
        '<div class="field"><label>Status</label><select id="aptStatus">'+statuses.map(function(st){return '<option value="'+U.escapeHtml(st)+'" '+(a.status===st?'selected':'')+'>'+U.escapeHtml(st)+'</option>';}).join('')+'</select></div>' +
        '<div class="field"><label>Name</label><input value="'+U.escapeHtml(a.name)+'" disabled></div>' +
        '<div class="field"><label>Phone</label><input value="'+U.escapeHtml(a.phone)+'" disabled></div>' +
        '<div class="field"><label>Email</label><input value="'+U.escapeHtml(a.email||'')+'" disabled></div>' +
        '<div class="field"><label>Service</label><input value="'+U.escapeHtml(s?s.name:a.serviceId)+'" disabled></div>' +
        '<div class="field"><label>Facility</label><input value="'+U.escapeHtml(f?f.name:a.facilityId)+'" disabled></div>' +
        '<div class="field"><label>Date / Time</label><input value="'+U.escapeHtml(a.date)+' '+U.escapeHtml(a.time)+'" disabled></div>' +
        '<div class="field full"><label>Notes (patient)</label><textarea disabled>'+U.escapeHtml(a.notes||'')+'</textarea></div>' +
        '<div class="field full"><label>Internal demo note</label><textarea id="aptNote" placeholder="Internal note (demo only)">'+U.escapeHtml(a.internalNote||'')+'</textarea></div>' +
      '</div>' +
      '<p class="muted" style="font-size:.8rem; margin-top:8px;">Status changes are demonstration-only and do not confirm a real appointment. Real confirmation requires an authorised backend.</p>';
    const m = U.modal({ title: 'Appointment ' + a.ref, content: content, size:'modal-lg', footer: '<button class="btn btn-ghost" data-cancel>Close</button><button class="btn btn-primary" data-save>Save changes</button>' });
    m.overlay.querySelector('[data-cancel]').addEventListener('click', m.close);
    m.overlay.querySelector('[data-save]').addEventListener('click', function () {
      a.status = m.overlay.querySelector('#aptStatus').value;
      a.internalNote = m.overlay.querySelector('#aptNote').value;
      D.Appointments.save(a);
      U.toast('Appointment updated (demo).', 'success');
      m.close();
      renderCurrent();
    });
  }
  function deleteAppointment(id) {
    const a = D.Appointments.get(id);
    U.confirm('Delete appointment record?', 'Remove demonstration record ' + (a?a.ref:id) + '?', function () {
      D.Appointments.delete(id);
      U.toast('Record removed.', 'success');
      renderCurrent();
    }, { okLabel:'Delete' });
  }

  // ---------- doctors admin ----------
  function renderDoctorsAdmin(root) {
    const f = state.doctorFilter;
    let items = D.Doctors.all();
    if (f.q) { const ql=f.q.toLowerCase(); items = items.filter(function(d){ return (d.name+' '+d.specialty).toLowerCase().indexOf(ql)>=0; }); }
    root.innerHTML =
      panel('Doctor profiles (demonstration)', 'Manage clearly labelled sample doctor profiles. These are not real clinicians.',
        '<div style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">' +
          '<input id="adQ" type="search" placeholder="Search" value="'+U.escapeHtml(f.q||'')+'" style="flex:1; min-width:180px;">' +
          '<button class="btn btn-primary btn-sm" id="adAdd">+ Add demo profile</button>' +
        '</div>' +
        (items.length ? tableDoctors(items) : '<div class="empty-state"><h3>No doctor profiles</h3></div>')
      );
    document.getElementById('adQ').addEventListener('input', U.debounce(function(){ state.doctorFilter.q = this.value; renderCurrent(); },200));
    document.getElementById('adAdd').addEventListener('click', function(){ openDoctorEditor(null); });
    root.querySelectorAll('[data-action="doc-edit"]').forEach(function(b){ b.addEventListener('click', function(){ openDoctorEditor(b.dataset.id); }); });
    root.querySelectorAll('[data-action="doc-toggle"]').forEach(function(b){ b.addEventListener('click', function(){ toggleDoctorPublish(b.dataset.id); }); });
    root.querySelectorAll('[data-action="doc-delete"]').forEach(function(b){ b.addEventListener('click', function(){ deleteDoctor(b.dataset.id); }); });
  }
  function tableDoctors(items) {
    return '<div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Specialty</th><th>Facility</th><th>Demo</th><th>Published</th><th>Actions</th></tr></thead><tbody>' +
      items.map(function(d){
        const f = D.Facilities.get(d.facilityId);
        return '<tr>' +
          '<td>'+U.escapeHtml(d.name)+'</td>' +
          '<td>'+U.escapeHtml(d.specialty)+'</td>' +
          '<td>'+U.escapeHtml(f?f.name:'—')+'</td>' +
          '<td>'+(d.demo?'<span class="badge badge-demo">Demo</span>':'—')+'</td>' +
          '<td>'+C.statusBadge(d.published?'published':'draft')+'</td>' +
          '<td style="white-space:nowrap;">' +
            '<button class="btn btn-sm" data-action="doc-edit" data-id="'+U.escapeHtml(d.id)+'">Edit</button> ' +
            '<button class="btn btn-sm btn-ghost" data-action="doc-toggle" data-id="'+U.escapeHtml(d.id)+'">'+(d.published?'Unpublish':'Publish')+'</button> ' +
            '<button class="btn btn-sm btn-danger" data-action="doc-delete" data-id="'+U.escapeHtml(d.id)+'">Delete</button>' +
          '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function openDoctorEditor(id) {
    const d = id ? D.Doctors.get(id) : null;
    const facs = D.Facilities.all();
    const svcs = D.Services.all();
    const content =
      '<form id="docForm">' +
        '<div class="form-grid">' +
          '<div class="field"><label>Name *</label><input name="name" required value="'+U.escapeHtml(d?d.name:'')+'"></div>' +
          '<div class="field"><label>Specialty *</label><input name="specialty" required value="'+U.escapeHtml(d?d.specialty:'')+'"></div>' +
          '<div class="field full"><label>Facility</label><select name="facilityId"><option value="">Not assigned</option>'+facs.map(function(f){return '<option value="'+U.escapeHtml(f.id)+'" '+(d&&d.facilityId===f.id?'selected':'')+'>'+U.escapeHtml(f.name)+'</option>';}).join('')+'</select></div>' +
          '<div class="field full"><label>Bio (demo)</label><textarea name="bio">'+U.escapeHtml(d?d.bio:'Demonstration profile only. Sample clinician for the doctor directory prototype.')+'</textarea></div>' +
          '<div class="field"><label>Published</label><select name="published"><option value="true" '+(d&&d.published?'selected':'')+'>Published</option><option value="false" '+(d&&!d.published?'selected':'')+'>Draft</option></select></div>' +
          '<div class="field"><label>Demo profile</label><select name="demo"><option value="true" '+(d? (d.demo?'selected':'') : 'selected')+'>Yes (demo)</option><option value="false" '+(d&&!d.demo?'selected':'')+'>No</option></select></div>' +
        '</div>' +
      '</form>';
    const m = U.modal({ title: id ? 'Edit doctor profile' : 'Add demo doctor', content: content, footer: '<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-primary" data-save>Save</button>' });
    m.overlay.querySelector('[data-cancel]').addEventListener('click', m.close);
    m.overlay.querySelector('[data-save]').addEventListener('click', function () {
      const form = m.overlay.querySelector('#docForm');
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const rec = {
        id: id || undefined,
        name: fd.get('name'),
        specialty: fd.get('specialty'),
        facilityId: fd.get('facilityId') || null,
        bio: fd.get('bio'),
        published: fd.get('published') === 'true',
        demo: fd.get('demo') === 'true'
      };
      D.Doctors.save(rec);
      U.toast('Doctor profile saved (demo).', 'success');
      m.close();
      renderCurrent();
    });
  }
  function toggleDoctorPublish(id) {
    const d = D.Doctors.get(id);
    if (!d) return;
    d.published = !d.published;
    D.Doctors.save(d);
    U.toast('Publication status updated.', 'success');
    renderCurrent();
  }
  function deleteDoctor(id) {
    const d = D.Doctors.get(id);
    U.confirm('Delete doctor profile?', 'Remove demonstration profile ' + (d?d.name:id) + '?', function () {
      D.Doctors.delete(id);
      U.toast('Profile removed.', 'success');
      renderCurrent();
    }, { okLabel:'Delete' });
  }

  // ---------- services admin ----------
  function renderServicesAdmin(root) {
    const f = state.serviceFilter;
    let items = D.Services.all();
    if (f.q) { const ql=f.q.toLowerCase(); items = items.filter(function(s){ return (s.name+' '+s.description).toLowerCase().indexOf(ql)>=0; }); }
    root.innerHTML =
      panel('Service categories', 'Manage demonstration service categories. Changes reflect on the public site.',
        '<div style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">' +
          '<input id="asQ" type="search" placeholder="Search" value="'+U.escapeHtml(f.q||'')+'" style="flex:1; min-width:180px;">' +
          '<button class="btn btn-primary btn-sm" id="asAdd">+ Add service</button>' +
        '</div>' +
        (items.length ? tableServices(items) : '<div class="empty-state"><h3>No services</h3></div>')
      );
    document.getElementById('asQ').addEventListener('input', U.debounce(function(){ state.serviceFilter.q = this.value; renderCurrent(); },200));
    document.getElementById('asAdd').addEventListener('click', function(){ openServiceEditor(null); });
    root.querySelectorAll('[data-action="svc-edit"]').forEach(function(b){ b.addEventListener('click', function(){ openServiceEditor(b.dataset.id); }); });
    root.querySelectorAll('[data-action="svc-toggle"]').forEach(function(b){ b.addEventListener('click', function(){ toggleServicePublish(b.dataset.id); }); });
    root.querySelectorAll('[data-action="svc-delete"]').forEach(function(b){ b.addEventListener('click', function(){ deleteService(b.dataset.id); }); });
  }
  function tableServices(items) {
    return '<div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Description</th><th>Published</th><th>Actions</th></tr></thead><tbody>' +
      items.map(function(s){
        return '<tr>' +
          '<td>'+U.escapeHtml(s.name)+'</td>' +
          '<td>'+U.escapeHtml(s.description)+'</td>' +
          '<td>'+C.statusBadge(s.published?'published':'draft')+'</td>' +
          '<td style="white-space:nowrap;">' +
            '<button class="btn btn-sm" data-action="svc-edit" data-id="'+U.escapeHtml(s.id)+'">Edit</button> ' +
            '<button class="btn btn-sm btn-ghost" data-action="svc-toggle" data-id="'+U.escapeHtml(s.id)+'">'+(s.published?'Unpublish':'Publish')+'</button> ' +
            '<button class="btn btn-sm btn-danger" data-action="svc-delete" data-id="'+U.escapeHtml(s.id)+'">Delete</button>' +
          '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function openServiceEditor(id) {
    const s = id ? D.Services.get(id) : null;
    const content =
      '<form id="svcForm">' +
        '<div class="form-grid">' +
          '<div class="field full"><label>Name *</label><input name="name" required value="'+U.escapeHtml(s?s.name:'')+'"></div>' +
          '<div class="field full"><label>Description *</label><textarea name="description" required>'+U.escapeHtml(s?s.description:'')+'</textarea></div>' +
          '<div class="field"><label>Icon key</label><input name="icon" value="'+U.escapeHtml(s?s.icon:'stethoscope')+'"></div>' +
          '<div class="field"><label>Published</label><select name="published"><option value="true" '+(s&&s.published?'selected':'')+'>Published</option><option value="false" '+(s&&!s.published?'selected':'')+'>Draft</option></select></div>' +
          '<div class="field full"><label>Assigned facilities</label><div style="display:flex; flex-wrap:wrap; gap:8px; max-height:160px; overflow:auto;">' +
            D.Facilities.all().map(function(fac){
              const checked = s && D.Services.facilitiesFor(s.id).some(function(x){return x.id===fac.id;});
              return '<label style="font-size:.8rem;"><input type="checkbox" name="fac" value="'+U.escapeHtml(fac.id)+'" '+(checked?'checked':'')+'> '+U.escapeHtml(fac.name)+'</label>';
            }).join('') +
          '</div></div>' +
        '</div>' +
      '</form>';
    const m = U.modal({ title: id ? 'Edit service' : 'Add service', content: content, footer: '<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-primary" data-save>Save</button>' });
    m.overlay.querySelector('[data-cancel]').addEventListener('click', m.close);
    m.overlay.querySelector('[data-save]').addEventListener('click', function () {
      const form = m.overlay.querySelector('#svcForm');
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const rec = {
        id: id || undefined,
        name: fd.get('name'),
        description: fd.get('description'),
        icon: fd.get('icon'),
        published: fd.get('published') === 'true'
      };
      const saved = D.Services.save(rec);
      // sync facility assignments
      const assigned = Array.from(form.querySelectorAll('input[name="fac"]:checked')).map(function(x){ return x.value; });
      D.Facilities.all().forEach(function(fac){
        const has = (fac.services||[]).indexOf(saved.id) >= 0;
        const should = assigned.indexOf(fac.id) >= 0;
        if (has !== should) {
          fac.services = should ? (fac.services||[]).concat([saved.id]) : (fac.services||[]).filter(function(x){return x !== saved.id;});
          D.Facilities.save(fac);
        }
      });
      U.toast('Service saved.', 'success');
      m.close();
      renderCurrent();
    });
  }
  function toggleServicePublish(id) {
    const s = D.Services.get(id);
    if (!s) return;
    s.published = !s.published;
    D.Services.save(s);
    U.toast('Publication status updated.', 'success');
    renderCurrent();
  }
  function deleteService(id) {
    const s = D.Services.get(id);
    U.confirm('Delete service?', 'Remove service category ' + (s?s.name:id) + '? It will be detached from facilities.', function () {
      D.Services.delete(id);
      U.toast('Service removed.', 'success');
      renderCurrent();
    }, { okLabel:'Delete' });
  }

  // ---------- enquiries admin ----------
  function renderEnquiries(root) {
    const filter = state.enquiryFilter;
    let items = D.Enquiries.all();
    if (filter !== 'all') items = items.filter(function(e){return e.status===filter;});
    const statuses = ['New','Reviewed','Archived'];
    root.innerHTML =
      panel('Contact enquiries', 'Demonstration enquiries from the public contact form.',
        '<div style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">' +
          '<select id="aeStatus" aria-label="Filter enquiries by status"><option value="all" '+(filter==='all'?'selected':'')+'>All statuses</option>'+statuses.map(function(s){return '<option value="'+U.escapeHtml(s)+'" '+(filter===s?'selected':'')+'>'+U.escapeHtml(s)+'</option>';}).join('')+'</select>' +
        '</div>' +
        (items.length ? tableEnquiries(items) : '<div class="empty-state"><h3>No enquiries</h3></div>')
      );
    document.getElementById('aeStatus').addEventListener('change', function(){ state.enquiryFilter = this.value; renderCurrent(); });
    root.querySelectorAll('[data-action="enq-view"]').forEach(function(b){ b.addEventListener('click', function(){ openEnquiryModal(b.dataset.id); }); });
    root.querySelectorAll('[data-action="enq-archive"]').forEach(function(b){ b.addEventListener('click', function(){ archiveEnquiry(b.dataset.id); }); });
  }
  function tableEnquiries(items) {
    return '<div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>' +
      items.map(function(e){
        return '<tr>' +
          '<td>'+U.escapeHtml(e.name)+'</td>' +
          '<td>'+U.escapeHtml(e.email)+'</td>' +
          '<td>'+U.escapeHtml(e.subject)+'</td>' +
          '<td>'+C.statusBadge(e.status)+'</td>' +
          '<td>'+U.formatDate(e.createdAt)+'</td>' +
          '<td style="white-space:nowrap;">' +
            '<button class="btn btn-sm" data-action="enq-view" data-id="'+U.escapeHtml(e.id)+'">View</button> ' +
            '<button class="btn btn-sm btn-ghost" data-action="enq-archive" data-id="'+U.escapeHtml(e.id)+'">Archive</button>' +
          '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function openEnquiryModal(id) {
    const e = D.Enquiries.get(id);
    if (!e) return;
    const f = e.facilityId ? D.Facilities.get(e.facilityId) : null;
    const content =
      '<div class="form-grid">' +
        '<div class="field"><label>Name</label><input value="'+U.escapeHtml(e.name)+'" disabled></div>' +
        '<div class="field"><label>Email</label><input value="'+U.escapeHtml(e.email)+'" disabled></div>' +
        '<div class="field"><label>Phone</label><input value="'+U.escapeHtml(e.phone||'')+'" disabled></div>' +
        '<div class="field"><label>Facility</label><input value="'+U.escapeHtml(f?f.name:(e.facilityId||'General'))+'" disabled></div>' +
        '<div class="field"><label>Status</label><select id="enqStatus">'+['New','Reviewed','Archived'].map(function(s){return '<option value="'+s+'" '+(e.status===s?'selected':'')+'>'+s+'</option>';}).join('')+'</select></div>' +
        '<div class="field full"><label>Subject</label><input value="'+U.escapeHtml(e.subject)+'" disabled></div>' +
        '<div class="field full"><label>Message</label><textarea disabled>'+U.escapeHtml(e.message)+'</textarea></div>' +
        '<div class="field full"><label>Internal demo note</label><textarea id="enqNote" placeholder="Internal note (demo)">'+U.escapeHtml(e.internalNote||'')+'</textarea></div>' +
      '</div>';
    const m = U.modal({ title: 'Enquiry from ' + e.name, content: content, size:'modal-lg', footer: '<button class="btn btn-ghost" data-cancel>Close</button><button class="btn btn-primary" data-save>Save</button>' });
    m.overlay.querySelector('[data-cancel]').addEventListener('click', m.close);
    m.overlay.querySelector('[data-save]').addEventListener('click', function () {
      e.status = m.overlay.querySelector('#enqStatus').value;
      e.internalNote = m.overlay.querySelector('#enqNote').value;
      D.Enquiries.save(e);
      U.toast('Enquiry updated (demo).', 'success');
      m.close();
      renderCurrent();
    });
  }
  function archiveEnquiry(id) {
    const e = D.Enquiries.get(id);
    if (!e) return;
    e.status = 'Archived';
    D.Enquiries.save(e);
    U.toast('Enquiry archived (demo).', 'success');
    renderCurrent();
  }

  // ---------- content admin ----------
  function renderContentAdmin(root) {
    const c = D.Content.get();
    const svcs = D.Services.all();
    const facs = D.Facilities.all();
    root.innerHTML =
      panel('Content management', 'Edit demonstration homepage content. Changes reflect on the public site.',
        '<form id="contentForm">' +
          '<div class="form-grid">' +
            '<div class="field full"><label>Hero headline</label><input name="heroHeadline" value="'+U.escapeHtml(c.heroHeadline)+'"></div>' +
            '<div class="field full"><label>Hero supporting text</label><textarea name="heroSub">'+U.escapeHtml(c.heroSub)+'</textarea></div>' +
            '<div class="field full"><label>Hero emergency text</label><input name="heroEmergency" value="'+U.escapeHtml(c.heroEmergency)+'"></div>' +
            '<div class="field full"><label>About text</label><textarea name="aboutText">'+U.escapeHtml(c.aboutText)+'</textarea></div>' +
            '<div class="field"><label>Contact email</label><input name="contactEmail" value="'+U.escapeHtml(c.contactEmail)+'"></div>' +
            '<div class="field"><label>Contact phone</label><input name="contactPhone" value="'+U.escapeHtml(c.contactPhone)+'"></div>' +
            '<div class="field full"><label>Main office</label><input name="contactOffice" value="'+U.escapeHtml(c.contactOffice)+'"></div>' +
            '<div class="field full"><label>Featured services (comma-separated IDs)</label><input name="featuredServices" value="'+U.escapeHtml((c.featuredServices||[]).join(', '))+'"></div>' +
            '<div class="field full"><label>Featured facilities (comma-separated IDs)</label><input name="featuredFacilities" value="'+U.escapeHtml((c.featuredFacilities||[]).join(', '))+'"></div>' +
          '</div>' +
          '<div style="margin-top:12px; display:flex; gap:8px;">' +
            '<button class="btn btn-primary" type="submit">Save content</button>' +
            '<button class="btn btn-ghost" type="button" id="contentPreview">Preview public site</button>' +
          '</div>' +
        '</form>' +
        '<div class="muted" style="margin-top:16px; font-size:.8rem;">Service IDs: '+svcs.map(function(s){return s.id;}).join(', ')+'<br>Facility IDs: '+facs.map(function(f){return f.id;}).join(', ')+'</div>'
      );
    const form = root.querySelector('#contentForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const fd = new FormData(form);
      const featuredServices = String(fd.get('featuredServices')||'').split(',').map(function(x){return x.trim();}).filter(Boolean);
      const featuredFacilities = String(fd.get('featuredFacilities')||'').split(',').map(function(x){return x.trim();}).filter(Boolean);
      D.Content.save({
        heroHeadline: fd.get('heroHeadline'),
        heroSub: fd.get('heroSub'),
        heroEmergency: fd.get('heroEmergency'),
        aboutText: fd.get('aboutText'),
        contactEmail: fd.get('contactEmail'),
        contactPhone: fd.get('contactPhone'),
        contactOffice: fd.get('contactOffice'),
        featuredServices: featuredServices,
        featuredFacilities: featuredFacilities
      });
      U.toast('Content updated.', 'success');
    });
    root.querySelector('#contentPreview').addEventListener('click', function(){ window.open('index.html','_blank'); });
  }

  // ---------- reports ----------
  function renderReports(root) {
    const counts = D.overviewCounts();
    const aStats = D.Appointments.stats();
    const fCounts = D.Facilities.counts();
    root.innerHTML =
      '<div class="report-grid">' +
        panel('Facility inventory report', 'Demonstration data', '<p>Total: '+counts.facilitiesTotal+' · Published: '+counts.facilitiesPublished+' · Pending verification: '+counts.facilitiesPending+'</p>' +
          '<button class="btn btn-sm" id="repFac">Export facilities CSV</button>') +
        panel('Appointment request report', 'Demonstration data', '<p>Total: '+counts.appointmentsTotal+' · Pending: '+counts.appointmentsPending+'</p>' +
          '<div style="margin-top:8px;">'+barChartFromObject(aStats.statuses, 'var(--a-teal)')+'</div>' +
          '<button class="btn btn-sm" id="repApt" style="margin-top:8px;">Export appointments CSV</button>') +
        panel('Service availability report', 'Demonstration data', '<p>Service categories: '+counts.servicesTotal+' · Published: '+counts.servicesPublished+'</p>') +
        panel('Facility verification report', 'Demonstration data', '<div>'+barChartFromObject({ 'Verified': fCounts.verified, 'Pending': fCounts.pending, 'Needs correction': fCounts.needsCorrection, 'Possible duplicate': fCounts.possibleDuplicate }, 'var(--a-amber)')+'</div>') +
      '</div>';
    root.querySelector('#repFac').addEventListener('click', function(){ U.downloadText('facilities.csv', D.exportFacilitiesCSV(), 'text/csv'); U.toast('CSV exported.', 'success'); });
    root.querySelector('#repApt').addEventListener('click', function(){ U.downloadText('appointments.csv', D.exportAppointmentsCSV(), 'text/csv'); U.toast('CSV exported.', 'success'); });
  }

  // ---------- settings ----------
  function renderSettings(root) {
    const s = D.Settings.get();
    root.innerHTML =
      panel('Settings', 'Demonstration settings',
        '<div class="form-grid">' +
          '<div class="field"><label>Demo mode</label><input value="Enabled" disabled></div>' +
          '<div class="field"><label>Storage key</label><input value="'+U.escapeHtml(D.STORAGE_KEY)+'" disabled></div>' +
          '<div class="field full"><label>Demo credentials (local testing only)</label><input value="admin / demo" disabled></div>' +
        '</div>' +
        '<div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap;">' +
          '<button class="btn btn-danger" id="resetData">Reset demo data</button>' +
          '<button class="btn btn-ghost" id="clearSession">Clear session</button>' +
        '</div>' +
        '<p class="muted" style="font-size:.8rem; margin-top:12px;">Resetting restores the original sample dataset. Clearing the session logs you out of the demo dashboard.</p>'
      );
    root.querySelector('#resetData').addEventListener('click', function(){ U.confirm('Reset demo data?', 'Restore original sample dataset?', function(){ D.resetData(); U.toast('Demo data reset.', 'success'); renderCurrent(); }, {okLabel:'Reset'}); });
    root.querySelector('#clearSession').addEventListener('click', function(){ sessionStorage.removeItem('oasis_admin_session_v1'); location.reload(); });
  }

  // ---------- mobile sidebar helpers (already) ----------
  // expose
  window.OasisAdmin = { navigate: navigate };
})();
