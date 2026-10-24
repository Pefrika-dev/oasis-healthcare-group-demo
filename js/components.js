/* components.js — shared rendering helpers */
(function (global) {
  'use strict';
  const U = global.OasisUtils;
  const D = global.OasisData;

  const OasisComponents = {};

  // SVG icon set
  const ICONS = {
    stethoscope: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3v6a4 4 0 0 0 4 4 4 4 0 0 0 4-4V3"/><path d="M4 3h2M10 3h2"/><path d="M8 13v3a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-1"/><circle cx="16" cy="15" r="2"/></svg>',
    clinic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M9 21V12h6v9"/><path d="M12 9v-3M10.5 7.5h3"/></svg>',
    bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6"/><path d="M3 21v-3M21 21v-3"/><path d="M7 9V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    tooth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4c-2 0-3 1.5-3 3.5 0 3 1.5 9 3 9 1 0 1.5-2 2-4 .3-1 1-1.5 2-1.5s1.7.5 2 1.5c.5 2 1 4 2 4 1.5 0 3-6 3-9 0-2-1-3.5-3-3.5-1.5 0-2.5 1-3 1s-1.5-1-3-1z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h4M7 12h10M7 17h6"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/></svg>',
    activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>',
    mind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01"/></svg>',
    ribbon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z"/><path d="M9 14l-2 8 5-3 5 3-2-8"/></svg>',
    rehab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 4M12 12l3 4M9 9h6"/></svg>',
    family: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="2.5"/><circle cx="16" cy="7" r="2.5"/><path d="M3 20v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2M13 20v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/></svg>',
    specialist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/><path d="M15 4l2-2M9 4L7 2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.7A2 2 0 0 1 22 16.9z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M10 22v-4h4v4"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 5l-7 7 7 7"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
  };

  OasisComponents.icon = function (name, cls) {
    const svg = ICONS[name] || ICONS.info;
    return '<span class="icon ' + (cls||'') + '" aria-hidden="true">' + svg + '</span>';
  };

  OasisComponents.logo = function (variant) {
    variant = variant || 'full';
    const compact = variant === 'compact';
    return '<a class="logo" href="#home"' + (compact ? ' aria-label="Oasis Healthcare Group"' : '') + '>' +
      '<span class="logo-mark" aria-hidden="true">' +
        '<svg viewBox="0 0 40 40" width="34" height="34">' +
          '<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f766e"/><stop offset="1" stop-color="#1e3a8a"/></linearGradient></defs>' +
          '<circle cx="20" cy="20" r="18" fill="url(#lg)"/>' +
          '<path d="M20 9c-4 0-7 3-7 7 0 3 2 5 4 6v5h6v-5c2-1 4-3 4-6 0-4-3-7-7-7z" fill="#fff" opacity=".95"/>' +
          '<circle cx="20" cy="16" r="2.2" fill="#0f766e"/>' +
        '</svg>' +
      '</span>' +
      (compact ? '' : '<span class="logo-text"><span class="logo-name">Oasis</span><span class="logo-sub">Healthcare Group</span></span>') +
    '</a>';
  };

  OasisComponents.statusBadge = function (status, type) {
    // type: verification | appointment | generic
    const map = {
      'verified': { cls:'badge-success', label:'Verified' },
      'pending': { cls:'badge-warn', label:'Pending verification' },
      'needs_correction': { cls:'badge-danger', label:'Needs correction' },
      'possible_duplicate': { cls:'badge-info', label:'Possible duplicate' },
      'published': { cls:'badge-success', label:'Published' },
      'draft': { cls:'badge-muted', label:'Draft' },
      'New': { cls:'badge-info', label:'New' },
      'Pending Review': { cls:'badge-warn', label:'Pending review' },
      'Contacted': { cls:'badge-primary', label:'Contacted' },
      'Confirmed for Demonstration': { cls:'badge-success', label:'Confirmed (demo)' },
      'Cancelled': { cls:'badge-danger', label:'Cancelled' },
      'Reviewed': { cls:'badge-success', label:'Reviewed' },
      'Archived': { cls:'badge-muted', label:'Archived' }
    };
    const m = map[status] || { cls:'badge-muted', label: status };
    return '<span class="badge ' + m.cls + '">' + U.escapeHtml(m.label) + '</span>';
  };

  OasisComponents.demoTag = function () {
    return '<span class="badge badge-demo">Demo data</span>';
  };

  OasisComponents.facilityCard = function (f) {
    const phone = (f.phones && f.phones[0]) ? f.phones[0] : null;
    const services = (f.services||[]).map(function (sid) {
      const s = D.Services.get(sid); return s ? s.name : sid;
    }).slice(0,4);
    return '<article class="card facility-card" data-facility-id="' + U.escapeHtml(f.id) + '">' +
      '<div class="card-media facility-media">' +
        '<div class="media-fallback" aria-hidden="true">' + OasisComponents.icon('building','icon-lg') + '</div>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-meta-row">' +
          '<span class="chip">' + U.escapeHtml(f.category) + '</span>' +
          OasisComponents.statusBadge(f.verification) +
        '</div>' +
        '<h3 class="card-title">' + U.escapeHtml(f.name) + '</h3>' +
        '<p class="card-sub">' + U.escapeHtml(f.town) + (f.county ? ', ' + U.escapeHtml(f.county) : '') + '</p>' +
        '<p class="card-text">' + U.escapeHtml(f.description) + '</p>' +
        (services.length ? '<div class="tag-row">' + services.map(function(s){return '<span class="tag">'+U.escapeHtml(s)+'</span>';}).join('') + '</div>' : '') +
        '<div class="card-actions">' +
          '<button class="btn btn-sm btn-primary" data-action="facility-details" data-id="' + U.escapeHtml(f.id) + '">View details</button>' +
          (phone ? '<a class="btn btn-sm btn-ghost" href="' + U.telHref(phone) + '">' + OasisComponents.icon('phone') + ' Call</a>' : '') +
          '<a class="btn btn-sm btn-ghost" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((f.name||'') + ', ' + (f.town||'') + ', ' + (f.county||'')) + '" target="_blank" rel="noopener">Maps</a>' +
          '<button class="btn btn-sm btn-ghost" data-action="facility-appoint" data-id="' + U.escapeHtml(f.id) + '">Request appointment</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  };

  OasisComponents.serviceCard = function (s) {
    const count = D.Services.facilitiesFor(s.id).length;
    return '<article class="card service-card" data-service-id="' + U.escapeHtml(s.id) + '">' +
      '<div class="card-icon">' + OasisComponents.icon(s.icon || 'stethoscope', 'icon-xl') + '</div>' +
      '<div class="card-body">' +
        '<h3 class="card-title">' + U.escapeHtml(s.name) + '</h3>' +
        '<p class="card-text">' + U.escapeHtml(s.description) + '</p>' +
        '<p class="card-sub">' + count + ' facilit' + (count===1?'y':'ies') + ' in demo data</p>' +
        '<div class="card-actions">' +
          '<button class="btn btn-sm btn-primary" data-action="service-details" data-id="' + U.escapeHtml(s.id) + '">View details</button>' +
          '<button class="btn btn-sm btn-ghost" data-action="service-appoint" data-id="' + U.escapeHtml(s.id) + '">Request appointment</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  };

  OasisComponents.doctorCard = function (d) {
    const f = D.Facilities.get(d.facilityId);
    return '<article class="card doctor-card" data-doctor-id="' + U.escapeHtml(d.id) + '">' +
      '<div class="card-avatar" aria-hidden="true">' + OasisComponents.icon('user','icon-xl') + '</div>' +
      '<div class="card-body">' +
        '<div class="card-meta-row">' +
          OasisComponents.demoTag() +
          (d.published ? OasisComponents.statusBadge('published') : OasisComponents.statusBadge('draft')) +
        '</div>' +
        '<h3 class="card-title">' + U.escapeHtml(d.name) + '</h3>' +
        '<p class="card-sub">' + U.escapeHtml(d.specialty) + '</p>' +
        '<p class="card-text">' + U.escapeHtml(f ? f.name : 'Facility not assigned') + '</p>' +
        '<p class="card-text muted">' + U.escapeHtml(d.bio) + '</p>' +
        '<div class="card-actions">' +
          '<button class="btn btn-sm btn-primary" data-action="doctor-details" data-id="' + U.escapeHtml(d.id) + '">View profile</button>' +
          '<button class="btn btn-sm btn-ghost" data-action="doctor-appoint" data-id="' + U.escapeHtml(d.id) + '">Request appointment</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  };

  OasisComponents.emptyState = function (title, message, actionHtml) {
    return '<div class="empty-state">' +
      '<div class="empty-icon" aria-hidden="true">' + OasisComponents.icon('info','icon-xl') + '</div>' +
      '<h3>' + U.escapeHtml(title) + '</h3>' +
      '<p>' + U.escapeHtml(message) + '</p>' +
      (actionHtml || '') +
    '</div>';
  };

  OasisComponents.skeleton = function (n) {
    n = n || 3;
    let h = '';
    for (let i=0;i<n;i++) h += '<div class="skeleton card"></div>';
    return h;
  };

  global.OasisComponents = OasisComponents;
})(window);