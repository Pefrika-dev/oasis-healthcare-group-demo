/* data.js — centralized demonstration data layer for Oasis Healthcare Group */
(function (global) {
  'use strict';
  const U = global.OasisUtils;

  const STORAGE_KEY = 'oasis_demo_v1';
  const VERSION = 1;

  const CATEGORIES = {
    facility: ['Hospital', 'Doctors Plaza', 'Care Centre'],
    service: null
  };

  const COUNTIES = ['Nairobi', 'Siaya', 'Kakamega', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Kitui', 'Eldoret', 'Webuye', 'Busia', 'Keroka', 'Ngong'];

  // ---------- seed facilities (19 entries from brief) ----------
  const seedFacilities = [
    { id:'fac_siaya_ms', name:'Oasis Multi-Specialty Hospital Siaya', category:'Hospital', county:'Siaya', town:'Siaya', address:null, phones:[], services:['svc_general','svc_outpatient','svc_inpatient','svc_maternity','svc_lab','svc_radiology'], hours:'Contact facility to confirm opening hours', emergency:true, description:'Multi-specialty hospital serving Siaya County. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_kakamega_ms', name:'Oasis Multi-Specialty Hospital Kakamega', category:'Hospital', county:'Kakamega', town:'Kakamega', address:null, phones:[], services:['svc_general','svc_outpatient','svc_inpatient','svc_maternity','svc_lab'], hours:'Contact facility to confirm opening hours', emergency:true, description:'Multi-specialty hospital serving Kakamega County. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_homabay_ms', name:'Oasis Multi-Specialty Hospital Homabay', category:'Hospital', county:'Homa Bay', town:'Homa Bay', address:null, phones:[], services:['svc_general','svc_outpatient','svc_inpatient','svc_maternity','svc_lab'], hours:'Contact facility to confirm opening hours', emergency:true, description:'Multi-specialty hospital serving Homa Bay County. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_ntunyigi', name:'Oasis Ntunyigi Hospital', category:'Hospital', county:'Migori', town:'Kehancha', address:'Kehancha, Migori County', phones:['+254 795 885 703','+254 734 921 994'], services:['svc_general','svc_outpatient','svc_inpatient','svc_maternity','svc_lab'], hours:'Contact facility to confirm opening hours', emergency:true, description:'Hospital in Kehancha, Migori County. Contact numbers supplied in the project brief.', image:null, status:'published', verification:'verified' },
    { id:'fac_migori_ms', name:'Oasis Multi-Specialty Hospital Migori', category:'Hospital', county:'Migori', town:'Migori', address:null, phones:[], services:['svc_general','svc_outpatient','svc_inpatient','svc_maternity','svc_lab'], hours:'Contact facility to confirm opening hours', emergency:true, description:'Multi-specialty hospital serving Migori County. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_kitisuru', name:'Oasis Health Specialty Hospital', category:'Hospital', county:'Nairobi', town:'Kitisuru', address:'Kitisuru, Nairobi', phones:[], services:['svc_specialist','svc_general','svc_outpatient','svc_lab','svc_radiology'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Specialty hospital in Kitisuru, Nairobi. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_kisii_sh', name:'Oasis Specialist Hospital Kisii', category:'Hospital', county:'Kisii', town:'Kisii', address:null, phones:[], services:['svc_specialist','svc_general','svc_outpatient','svc_inpatient','svc_lab'], hours:'Contact facility to confirm opening hours', emergency:true, description:'Specialist hospital in Kisii. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_dp_kisii', name:'Oasis Doctors Plaza Kisii', category:'Doctors Plaza', county:'Kisii', town:'Kisii', address:null, phones:[], services:['svc_outpatient','svc_specialist','svc_general'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Kisii. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_dp_nairobi', name:'Oasis Doctors Plaza Nairobi', category:'Doctors Plaza', county:'Nairobi', town:'Westlands', address:'Westlands, Nairobi', phones:['0782 283 5657','0786 167 488'], services:['svc_outpatient','svc_specialist','svc_general','svc_dental','svc_optical'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Westlands, Nairobi. Contact numbers supplied in the project brief.', image:null, status:'published', verification:'verified' },
    { id:'fac_dp_ngong', name:'Oasis Doctors Plaza Ngong', category:'Doctors Plaza', county:'Nairobi', town:'Ngong', address:'Ngong', phones:[], services:['svc_outpatient','svc_specialist','svc_general'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Ngong. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_dp_kitui', name:'Oasis Doctors Plaza Kitui', category:'Doctors Plaza', county:'Kitui', town:'Kitui', address:null, phones:[], services:['svc_outpatient','svc_specialist','svc_general'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Kitui. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_dp_eldoret', name:'Oasis Doctors Plaza Eldoret', category:'Doctors Plaza', county:'Uasin Gishu', town:'Eldoret', address:null, phones:[], services:['svc_outpatient','svc_specialist','svc_general'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Eldoret. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_dp_nyamira', name:'Oasis Doctors Plaza Nyamira', category:'Doctors Plaza', county:'Nyamira', town:'Nyamira', address:null, phones:['+254 738 617 647'], services:['svc_outpatient','svc_specialist','svc_general'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Nyamira. Contact number supplied in the project brief.', image:null, status:'published', verification:'verified' },
    { id:'fac_dp_webuye', name:'Oasis Doctors Plaza Webuye', category:'Doctors Plaza', county:'Bungoma', town:'Webuye', address:null, phones:[], services:['svc_outpatient','svc_specialist','svc_general'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Webuye. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_dp_siaya', name:'Oasis Doctors Plaza Siaya', category:'Doctors Plaza', county:'Siaya', town:'Siaya', address:null, phones:[], services:['svc_outpatient','svc_specialist','svc_general'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Siaya. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_dp_makadara', name:'Oasis Doctors Plaza Makadara', category:'Doctors Plaza', county:'Nairobi', town:'Makadara', address:'Makadara, Nairobi', phones:[], services:['svc_outpatient','svc_specialist','svc_general'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Makadara, Nairobi. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_dp_busia', name:'Oasis Doctors Plaza Busia', category:'Doctors Plaza', county:'Busia', town:'Busia', address:null, phones:[], services:['svc_outpatient','svc_specialist','svc_general'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Doctors plaza in Busia. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_fmc_keroka', name:'Oasis Family Medicine Centre Keroka', category:'Care Centre', county:'Nyamira', town:'Keroka', address:null, phones:[], services:['svc_family','svc_general','svc_outpatient'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Family medicine centre in Keroka. Details to be verified with the facility.', image:null, status:'published', verification:'pending' },
    { id:'fac_makadara_cc', name:'Oasis Healthcare Group - Makadara', category:'Care Centre', county:'Nairobi', town:'Makadara', address:'Makadara, Nairobi', phones:[], services:['svc_general','svc_outpatient'], hours:'Contact facility to confirm opening hours', emergency:false, description:'Care centre in Makadara, Nairobi. This entry may overlap with Oasis Doctors Plaza Makadara; marked for verification.', image:null, status:'published', verification:'possible_duplicate' }
  ];

  const seedServices = [
    { id:'svc_general', name:'General Medicine', icon:'stethoscope', description:'Everyday medical consultations, diagnosis and treatment for common conditions.', published:true },
    { id:'svc_outpatient', name:'Outpatient Care', icon:'clinic', description:'Same-day clinical services without an overnight hospital stay.', published:true },
    { id:'svc_inpatient', name:'Inpatient Care', icon:'bed', description:'Admission and ward-based care for patients requiring overnight monitoring.', published:true },
    { id:'svc_maternity', name:'Maternity and Women\'s Health', icon:'heart', description:'Antenatal, delivery and postnatal care, plus women\'s health services.', published:true },
    { id:'svc_dental', name:'Dental Care', icon:'tooth', description:'Oral health assessments, preventive and restorative dental treatment.', published:true },
    { id:'svc_optical', name:'Optical Care', icon:'eye', description:'Eye examinations and vision care services.', published:true },
    { id:'svc_radiology', name:'Radiology and Diagnostic Imaging', icon:'scan', description:'Imaging services to support diagnosis and treatment planning.', published:true },
    { id:'svc_lab', name:'Laboratory Services', icon:'flask', description:'Diagnostic testing and pathology services.', published:true },
    { id:'svc_physio', name:'Physiotherapy', icon:'activity', description:'Rehabilitation and movement therapy to restore function.', published:true },
    { id:'svc_mental', name:'Mental Health', icon:'mind', description:'Counselling and mental health support services.', published:true },
    { id:'svc_oncology', name:'Oncology', icon:'ribbon', description:'Cancer care services, subject to facility capability.', published:true },
    { id:'svc_rehab', name:'Rehabilitation', icon:'rehab', description:'Post-treatment recovery and rehabilitation programmes.', published:true },
    { id:'svc_family', name:'Family Medicine', icon:'family', description:'Comprehensive care for individuals and families across age groups.', published:true },
    { id:'svc_specialist', name:'Specialist Consultations', icon:'specialist', description:'Consultations with specialist clinicians, subject to availability.', published:true }
  ];

  const seedDoctors = [
    { id:'doc_demo_1', name:'Dr. Amina Wanjiku', specialty:'General Medicine', facilityId:'fac_dp_nairobi', bio:'Demonstration profile only. Sample clinician for the doctor directory prototype.', demo:true, published:true },
    { id:'doc_demo_2', name:'Dr. Brian Otieno', specialty:'Maternity and Women\'s Health', facilityId:'fac_ntunyigi', bio:'Demonstration profile only. Sample clinician for the doctor directory prototype.', demo:true, published:true },
    { id:'doc_demo_3', name:'Dr. Catherine Muthoni', specialty:'Dental Care', facilityId:'fac_dp_nairobi', bio:'Demonstration profile only. Sample clinician for the doctor directory prototype.', demo:true, published:true },
    { id:'doc_demo_4', name:'Dr. David Kipchoge', specialty:'Radiology and Diagnostic Imaging', facilityId:'fac_kitisuru', bio:'Demonstration profile only. Sample clinician for the doctor directory prototype.', demo:true, published:true },
    { id:'doc_demo_5', name:'Dr. Esther Nyambura', specialty:'Family Medicine', facilityId:'fac_fmc_keroka', bio:'Demonstration profile only. Sample clinician for the doctor directory prototype.', demo:true, published:true },
    { id:'doc_demo_6', name:'Dr. Felix Omondi', specialty:'Specialist Consultations', facilityId:'fac_kisii_sh', bio:'Demonstration profile only. Sample clinician for the doctor directory prototype.', demo:true, published:true }
  ];

  const seedAppointments = [
    { id:'apt_demo_1', serviceId:'svc_general', facilityId:'fac_dp_nairobi', date:'2026-11-05', time:'10:00', name:'Demo Patient', phone:'0700 000 000', email:'demo@example.com', notes:'Demonstration record only.', status:'Pending Review', ref:'OHG-DEMO-1001', createdAt:new Date().toISOString(), demo:true },
    { id:'apt_demo_2', serviceId:'svc_maternity', facilityId:'fac_ntunyigi', date:'2026-11-12', time:'09:00', name:'Demo Patient', phone:'0700 000 000', email:'demo@example.com', notes:'Demonstration record only.', status:'New', ref:'OHG-DEMO-1002', createdAt:new Date().toISOString(), demo:true }
  ];

  const seedEnquiries = [
    { id:'enq_demo_1', name:'Demo Visitor', email:'demo@example.com', phone:'0700 000 000', facilityId:'fac_dp_nairobi', subject:'General enquiry', message:'Demonstration enquiry record only.', status:'New', createdAt:new Date().toISOString(), demo:true }
  ];

  const seedContent = {
    heroHeadline:'Healthcare That Moves With You.',
    heroSub:'Discover healthcare services and facilities across the Oasis Healthcare Group network.',
    heroEmergency:'For urgent care, contact the facility directly or call the emergency line.',
    aboutText:'Oasis Healthcare Group operates a network of hospitals, doctors\' plazas and care centres across Kenya. This page is an independent concept demonstration and does not claim to be officially commissioned or endorsed by Oasis Healthcare Group.',
    contactEmail:'info@oasishealthcaregroup.com',
    contactPhone:'0111 161 400',
    contactOffice:'Greenhouse Mall, 1st Floor, Ngong Road, Nairobi, Kenya',
    emergencyPhones:['0701 302 302','0111 161 400'],
    featuredServices:['svc_general','svc_maternity','svc_lab','svc_radiology'],
    featuredFacilities:['fac_ntunyigi','fac_dp_nairobi','fac_kitisuru'],
    faqs:[
      { q:'Is this website an official Oasis Healthcare Group website?', a:'No. This is an independent concept demonstration created to show how a modern digital platform could support a multi-facility healthcare group. It is not an official Oasis website.' },
      { q:'Are the doctors listed real clinicians?', a:'No. Doctor profiles are clearly labelled as demonstration or sample data and are not real clinicians.' },
      { q:'Are appointments booked here confirmed by a hospital?', a:'No. Appointment requests are stored locally in your browser and receive a demonstration reference number. Real confirmation requires a connected, authorised backend and hospital staff review.' },
      { q:'How do I contact a facility directly?', a:'Use the telephone links on the facility page, or call the main call centre on 0111 161 400.' },
      { q:'Is my data secure?', a:'This demo stores information only in your browser (localStorage). Do not enter real personal or medical information. Production systems require secure server-side storage and data protection controls.' }
    ]
  };

  const seedSettings = {
    demoMode:true,
    demoCredentials:{ username:'admin', password:'demo' },
    lastReset:null
  };

  const seedActivity = [
    { id:'act_1', type:'system', message:'Demonstration dataset initialised.', createdAt:new Date().toISOString() }
  ];

  function seedData() {
    const now = new Date().toISOString();
    return {
      version: VERSION,
      facilities: U.clone(seedFacilities).map(function (f) { f.createdAt = f.createdAt || now; f.updatedAt = f.updatedAt || now; return f; }),
      services: U.clone(seedServices).map(function (s) { s.createdAt = s.createdAt || now; s.updatedAt = s.updatedAt || now; return s; }),
      doctors: U.clone(seedDoctors).map(function (d) { d.createdAt = d.createdAt || now; d.updatedAt = d.updatedAt || now; return d; }),
      appointments: U.clone(seedAppointments),
      enquiries: U.clone(seedEnquiries),
      content: U.clone(seedContent),
      settings: U.clone(seedSettings),
      activity: U.clone(seedActivity)
    };
  }

  // ---------- storage ----------
  function loadRaw() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (e) { return null; }
  }

  function saveRaw(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
    catch (e) { return false; }
  }

  let cache = null;

  function getData() {
    if (cache) return cache;
    const raw = loadRaw();
    if (raw && raw.version === VERSION) { cache = raw; return cache; }
    cache = seedData();
    saveRaw(cache);
    return cache;
  }

  function setData(data) { cache = data; saveRaw(cache); broadcast(); }

  function broadcast() {
    try { window.dispatchEvent(new CustomEvent('oasis:data-changed')); } catch (e) {}
  }

  function resetData() {
    cache = seedData();
    cache.settings.lastReset = new Date().toISOString();
    logActivity('system', 'Demonstration data reset to original sample dataset.');
    saveRaw(cache);
    broadcast();
    return U.clone(cache);
  }

  function logActivity(type, message, meta) {
    const d = getData();
    d.activity.unshift({ id: U.uid('act'), type: type, message: message, meta: meta || null, createdAt: new Date().toISOString() });
    if (d.activity.length > 50) d.activity = d.activity.slice(0, 50);
    saveRaw(d);
  }

  // ---------- generic helpers ----------
  function list(col) { return U.clone(getData()[col] || []); }
  function byId(col, id) { return (getData()[col] || []).find(function (x) { return x.id === id; }) || null; }

  function upsert(col, record) {
    const d = getData();
    const arr = d[col] = d[col] || [];
    const now = new Date().toISOString();
    const idx = arr.findIndex(function (x) { return x.id === record.id; });
    const rec = U.clone(record);
    rec.updatedAt = now;
    if (idx >= 0) { arr[idx] = Object.assign({}, arr[idx], rec); }
    else { rec.createdAt = rec.createdAt || now; arr.unshift(rec); }
    setData(d);
    return rec;
  }

  function remove(col, id) {
    const d = getData();
    d[col] = (d[col] || []).filter(function (x) { return x.id !== id; });
    setData(d);
  }

  // ---------- facilities ----------
  const Facilities = {
    all: function () { return list('facilities'); },
    get: function (id) { return byId('facilities', id); },
    save: function (f) {
      if (!f.id) f.id = U.uid('fac');
      const r = upsert('facilities', f);
      logActivity('facility', 'Facility record saved: ' + r.name, { id: r.id });
      return r;
    },
    delete: function (id) {
      const f = byId('facilities', id);
      remove('facilities', id);
      logActivity('facility', 'Facility record removed: ' + (f ? f.name : id), { id: id });
    },
    search: function (q, filters) {
      filters = filters || {};
      let items = list('facilities');
      if (filters.category) items = items.filter(function (f) { return f.category === filters.category; });
      if (filters.county) items = items.filter(function (f) { return f.county === filters.county; });
      if (filters.status) items = items.filter(function (f) { return f.status === filters.status; });
      if (filters.verification) items = items.filter(function (f) { return f.verification === filters.verification; });
      if (q) {
        const ql = String(q).toLowerCase();
        items = items.filter(function (f) {
          return [f.name, f.town, f.county, f.category, (f.services||[]).join(' ')].join(' ').toLowerCase().indexOf(ql) >= 0;
        });
      }
      return items;
    },
    published: function () { return list('facilities').filter(function (f) { return f.status === 'published'; }); },
    counts: function () {
      const all = list('facilities');
      return {
        total: all.length,
        published: all.filter(function (f){return f.status==='published';}).length,
        pending: all.filter(function (f){return f.verification==='pending';}).length,
        needsCorrection: all.filter(function (f){return f.verification==='needs_correction';}).length,
        possibleDuplicate: all.filter(function (f){return f.verification==='possible_duplicate';}).length,
        verified: all.filter(function (f){return f.verification==='verified';}).length
      };
    }
  };

  // ---------- services ----------
  const Services = {
    all: function () { return list('services'); },
    get: function (id) { return byId('services', id); },
    save: function (s) {
      if (!s.id) s.id = U.uid('svc');
      const r = upsert('services', s);
      logActivity('service', 'Service saved: ' + r.name, { id: r.id });
      return r;
    },
    delete: function (id) {
      const s = byId('services', id);
      remove('services', id);
      // detach from facilities
      const d = getData();
      d.facilities.forEach(function (f) { if (f.services) f.services = f.services.filter(function (x){return x !== id;}); });
      setData(d);
      logActivity('service', 'Service removed: ' + (s ? s.name : id));
    },
    published: function () { return list('services').filter(function (s){return s.published;}); },
    facilitiesFor: function (serviceId) {
      return list('facilities').filter(function (f){ return (f.services||[]).indexOf(serviceId) >= 0; });
    }
  };

  // ---------- doctors ----------
  const Doctors = {
    all: function () { return list('doctors'); },
    get: function (id) { return byId('doctors', id); },
    save: function (d) {
      if (!d.id) d.id = U.uid('doc');
      const r = upsert('doctors', d);
      logActivity('doctor', 'Doctor profile saved: ' + r.name, { id: r.id });
      return r;
    },
    delete: function (id) {
      const d = byId('doctors', id);
      remove('doctors', id);
      logActivity('doctor', 'Doctor profile removed: ' + (d ? d.name : id));
    },
    published: function () { return list('doctors').filter(function (x){return x.published;}); }
  };

  // ---------- appointments ----------
  const Appointments = {
    all: function () { return list('appointments'); },
    get: function (id) { return byId('appointments', id); },
    save: function (a) {
      if (!a.id) a.id = U.uid('apt');
      if (!a.ref) a.ref = genRef('OHG');
      if (!a.status) a.status = 'New';
      const r = upsert('appointments', a);
      logActivity('appointment', 'Appointment request ' + r.ref + ' saved.', { id: r.id });
      return r;
    },
    delete: function (id) {
      const a = byId('appointments', id);
      remove('appointments', id);
      logActivity('appointment', 'Appointment record removed: ' + (a ? a.ref : id));
    },
    byStatus: function (s) { return list('appointments').filter(function (x){return x.status===s;}); },
    stats: function () {
      const all = list('appointments');
      const byMonth = {};
      all.forEach(function (a) {
        const k = (a.date || a.createdAt || '').slice(0,7);
        byMonth[k] = (byMonth[k]||0)+1;
      });
      const statuses = {};
      all.forEach(function (a){ statuses[a.status] = (statuses[a.status]||0)+1; });
      return { total: all.length, pending: all.filter(function(x){return x.status==='New'||x.status==='Pending Review';}).length, byMonth: byMonth, statuses: statuses };
    }
  };

  function genRef(prefix) {
    prefix = prefix || 'OHG';
    const n = (getData().appointments.length + 1001);
    return prefix + '-DEMO-' + n;
  }

  // ---------- enquiries ----------
  const Enquiries = {
    all: function () { return list('enquiries'); },
    get: function (id) { return byId('enquiries', id); },
    save: function (e) {
      if (!e.id) e.id = U.uid('enq');
      if (!e.status) e.status = 'New';
      const r = upsert('enquiries', e);
      logActivity('enquiry', 'Enquiry received: ' + r.subject, { id: r.id });
      return r;
    },
    delete: function (id) {
      const e = byId('enquiries', id);
      remove('enquiries', id);
      logActivity('enquiry', 'Enquiry archived/removed: ' + (e ? e.subject : id));
    }
  };

  // ---------- content ----------
  const Content = {
    get: function () { return U.clone(getData().content || {}); },
    save: function (c) {
      const d = getData();
      d.content = Object.assign({}, d.content, c);
      setData(d);
      logActivity('content', 'Website content updated.');
      return U.clone(d.content);
    }
  };

  // ---------- settings ----------
  const Settings = {
    get: function () { return U.clone(getData().settings || {}); },
    save: function (s) {
      const d = getData();
      d.settings = Object.assign({}, d.settings, s);
      setData(d);
      return U.clone(d.settings);
    }
  };

  // ---------- activity ----------
  const Activity = {
    all: function () { return list('activity'); }
  };

  // ---------- export ----------
  function exportFacilitiesCSV() {
    const cols = [
      { label:'ID', key:'id' }, { label:'Name', key:'name' }, { label:'Category', key:'category' },
      { label:'County', key:'county' }, { label:'Town', key:'town' }, { label:'Address', key:'address' },
      { label:'Phones', get:function(r){return (r.phones||[]).join('; ');} },
      { label:'Hours', key:'hours' }, { label:'Emergency', key:'emergency' },
      { label:'Status', key:'status' }, { label:'Verification', key:'verification' }
    ];
    return U.toCSV(Facilities.all(), cols);
  }
  function exportAppointmentsCSV() {
    const cols = [
      { label:'Reference', key:'ref' }, { label:'Name', key:'name' }, { label:'Phone', key:'phone' },
      { label:'Email', key:'email' }, { label:'Service', get:function(r){const s=Services.get(r.serviceId);return s?s.name:r.serviceId;} },
      { label:'Facility', get:function(r){const f=Facilities.get(r.facilityId);return f?f.name:r.facilityId;} },
      { label:'Date', key:'date' }, { label:'Time', key:'time' }, { label:'Status', key:'status' },
      { label:'Created', key:'createdAt' }
    ];
    return U.toCSV(Appointments.all(), cols);
  }

  // ---------- counts for dashboard ----------
  function overviewCounts() {
    const f = Facilities.counts();
    const a = Appointments.stats();
    const enqs = Enquiries.all();
    return {
      facilitiesTotal: f.total,
      facilitiesPublished: f.published,
      facilitiesPending: f.pending,
      appointmentsTotal: a.total,
      appointmentsPending: a.pending,
      enquiriesTotal: enqs.length,
      enquiriesNew: enqs.filter(function(x){return x.status==='New';}).length,
      servicesTotal: Services.all().length,
      servicesPublished: Services.published().length,
      doctorsTotal: Doctors.all().length
    };
  }

  // ---------- init: ensure data exists ----------
  getData();

  // storage event sync
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) { cache = null; getData(); broadcast(); }
  });

  global.OasisData = {
    STORAGE_KEY: STORAGE_KEY,
    VERSION: VERSION,
    Facilities: Facilities,
    Services: Services,
    Doctors: Doctors,
    Appointments: Appointments,
    Enquiries: Enquiries,
    Content: Content,
    Settings: Settings,
    Activity: Activity,
    resetData: resetData,
    getData: function(){ return U.clone(getData()); },
    exportFacilitiesCSV: exportFacilitiesCSV,
    exportAppointmentsCSV: exportAppointmentsCSV,
    overviewCounts: overviewCounts,
    genRef: genRef,
    COUNTIES: COUNTIES,
    FACILITY_CATEGORIES: CATEGORIES.facility
  };
  // expose seed constants for reference
  global.OasisData._seed = { facilities: seedFacilities, services: seedServices };
})(window);