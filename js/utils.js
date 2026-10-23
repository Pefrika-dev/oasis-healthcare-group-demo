/* utils.js — shared helpers for Oasis Healthcare Group demo */
(function (global) {
  'use strict';

  const OasisUtils = {};

  OasisUtils.uid = function (prefix) {
    prefix = prefix || 'id';
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  };

  OasisUtils.clone = function (v) { return JSON.parse(JSON.stringify(v)); };

  OasisUtils.escapeHtml = function (s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  OasisUtils.formatDate = function (iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return String(iso); }
  };

  OasisUtils.formatDateTime = function (iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleString('en-KE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return String(iso); }
  };

  OasisUtils.formatPhone = function (p) {
    if (!p) return '';
    const s = String(p).replace(/\s+/g, ' ').trim();
    return s;
  };

  OasisUtils.telHref = function (p) {
    if (!p) return '#';
    const digits = String(p).replace(/[^\d+]/g, '');
    return 'tel:' + digits;
  };

  OasisUtils.slug = function (s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  OasisUtils.debounce = function (fn, ms) {
    let t;
    return function () {
      const args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms || 200);
    };
  };

  OasisUtils.validateEmail = function (v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
  };

  OasisUtils.validatePhone = function (v) {
    const d = String(v || '').replace(/\D/g, '');
    return d.length >= 9 && d.length <= 15;
  };

  OasisUtils.required = function (v) { return String(v || '').trim().length > 0; };

  OasisUtils.toCSV = function (rows, columns) {
    const esc = function (val) {
      const s = (val === null || val === undefined) ? '' : String(val);
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };
    const header = columns.map(function (c) { return esc(c.label); }).join(',');
    const body = rows.map(function (r) {
      return columns.map(function (c) {
        const v = typeof c.get === 'function' ? c.get(r) : r[c.key];
        return esc(v);
      }).join(',');
    }).join('\n');
    return header + '\n' + body;
  };

  OasisUtils.downloadText = function (filename, content, mime) {
    try {
      const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      return true;
    } catch (e) { return false; }
  };

  OasisUtils.toast = function (message, type) {
    type = type || 'info';
    let host = document.getElementById('toastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toastHost';
      host.className = 'toast-host';
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    const t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.setAttribute('role', 'status');
    t.innerHTML = '<span class="toast-msg">' + OasisUtils.escapeHtml(message) + '</span>';
    host.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, 3200);
  };

  OasisUtils.confirm = function (title, message, onConfirm, opts) {
    opts = opts || {};
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="modal-card modal-sm">' +
        '<h3 class="modal-title">' + OasisUtils.escapeHtml(title) + '</h3>' +
        '<p class="modal-body">' + OasisUtils.escapeHtml(message) + '</p>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-ghost" data-cancel>Cancel</button>' +
          '<button class="btn btn-danger" data-ok>' + OasisUtils.escapeHtml(opts.okLabel || 'Confirm') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('show'); });
    const restoreFocus = document.activeElement;
    const cancelBtn = overlay.querySelector('[data-cancel]');
    requestAnimationFrame(function () { if (cancelBtn) cancelBtn.focus(); });
    document.body.style.overflow = 'hidden';
    function close() {
      overlay.classList.remove('show');
      document.body.style.overflow = '';
      if (restoreFocus && restoreFocus.focus) restoreFocus.focus();
      setTimeout(function(){ if(overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 200);
    }
    overlay.querySelector('[data-cancel]').addEventListener('click', close);
    overlay.querySelector('[data-ok]').addEventListener('click', function () { close(); if (onConfirm) onConfirm(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  };

  OasisUtils.modal = function (opts) {
    // opts: {title, content(html string), size, onClose, footer}
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    const size = opts.size || '';
    overlay.innerHTML =
      '<div class="modal-card ' + size + '">' +
        '<div class="modal-header"><h3 class="modal-title">' + OasisUtils.escapeHtml(opts.title || '') + '</h3><button class="modal-close" aria-label="Close">&times;</button></div>' +
        '<div class="modal-body-wrap">' + (opts.content || '') + '</div>' +
        (opts.footer ? '<div class="modal-actions">' + opts.footer + '</div>' : '') +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('show'); });
    const restoreFocus = document.activeElement;
    const closeBtn = overlay.querySelector('.modal-close');
    requestAnimationFrame(function () { if (closeBtn) closeBtn.focus(); });
    document.body.style.overflow = 'hidden';
    function close() {
      overlay.classList.remove('show');
      document.body.style.overflow = '';
      if (restoreFocus && restoreFocus.focus) restoreFocus.focus();
      setTimeout(function(){ if(overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 200);
      if (opts.onClose) opts.onClose();
    }
    overlay.querySelector('.modal-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    const esc = function (e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
      if (e.key === 'Tab') {
        const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', esc);
    return { close: close, overlay: overlay };
  };

  OasisUtils.setLoading = function (el, on) {
    if (!el) return;
    if (on) { el.classList.add('is-loading'); el.setAttribute('aria-busy', 'true'); }
    else { el.classList.remove('is-loading'); el.removeAttribute('aria-busy'); }
  };

  OasisUtils.imgFallback = function (img) {
    if (!img) return;
    img.addEventListener('error', function () {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#e8f1f0"/><g fill="#0f766e" opacity=".6"><circle cx="300" cy="170" r="46"/><path d="M220 300 Q300 230 380 300" stroke="#0f766e" stroke-width="12" fill="none" stroke-linecap="round"/></g><text x="300" y="360" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#475569">Oasis Healthcare Group</text></svg>'
      );
      img.alt = img.alt || 'Healthcare image placeholder';
    });
  };

  OasisUtils.applyImgFallbacks = function (root) {
    root = root || document;
    root.querySelectorAll('img').forEach(OasisUtils.imgFallback);
  };

  global.OasisUtils = OasisUtils;
})(window);