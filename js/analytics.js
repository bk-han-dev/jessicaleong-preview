/* Google Analytics 4 + lead click tracking for jessicaleongrealtor.com.
   Switched ON when GA_ID is a real G-… Measurement ID (not the G-XXXXXXX placeholder).
   Needs the Content-Security-Policy change and the Privacy Notice sentence (already prepared).
   If the browser sends Do Not Track, this file returns without loading Google. */
(function () {
  var GA_ID = 'G-VJYFJE7EN9'; // GA4 Measurement ID for jessicaleongrealtor.com
  if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID) || GA_ID === 'G-XXXXXXX') return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  // 16 Nov 2026: Google's gtag.js is fetched after the page has loaded and the browser is idle
  // (or at the first tap/click/key, whichever is sooner), so it no longer competes with the
  // page itself. Page views and events are queued in dataLayer and sent as soon as it loads.
  var loaded = false;
  function loadGtag() {
    if (loaded) return; loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }
  function whenIdle() {
    if ('requestIdleCallback' in window) requestIdleCallback(loadGtag, { timeout: 2000 });
    else setTimeout(loadGtag, 1);
  }
  if (document.readyState === 'complete') whenIdle(); else window.addEventListener('load', whenIdle, { once: true });
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) {
    window.addEventListener(t, loadGtag, { once: true, passive: true, capture: true });
  });
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });

  function ev(name, params) { try { gtag('event', name, params || {}); } catch (e) {} }
  var path = location.pathname;

  // Lead conversion (generate_lead), counted once per real enquiry.
  // On submit, the form's details are kept in sessionStorage; enquiry.php then 303-redirects a
  // delivered enquiry to /thank-you/. The thank-you page fires generate_lead with those details
  // and clears them, so a reload, the back button or a direct visit is not counted again.
  var LK = 'jlr_lead_pending', LD = 'jlr_lead_fallback_done';
  function ss(fn) { try { return fn(window.sessionStorage); } catch (e) { return null; } }
  var nav = '';
  try { nav = (performance.getEntriesByType('navigation')[0] || {}).type || ''; } catch (e) {}
  if (/\/thank-you\/?$/.test(path) && nav !== 'reload' && nav !== 'back_forward') {
    var pend = ss(function (st) { var v = st.getItem(LK); st.removeItem(LK); return v ? JSON.parse(v) : null; });
    if (pend && Date.now() - (pend.at || 0) < 30 * 60 * 1000) {
      ss(function (st) { st.setItem(LD, '1'); });
      ev('generate_lead', { lead_source: 'enquiry_form', form_type: pend.form_type || 'enquiry',
        project: pend.project || '', form_page: pend.page || '' });
    } else {
      // Fallback (no stored submit, e.g. storage blocked): count only when arriving from a page
      // on this site, and only once per browser session.
      var ref = '';
      try { ref = document.referrer && new URL(document.referrer).host === location.host ? new URL(document.referrer).pathname : ''; } catch (e) {}
      if (ref && !/\/thank-you\/?$/.test(ref) && !ss(function (st) { return st.getItem(LD); })) {
        ss(function (st) { st.setItem(LD, '1'); });
        ev('generate_lead', { lead_source: 'enquiry_form', form_type: /bank-lelong/.test(ref) ? 'lelong_alerts' : 'enquiry',
          project: '', form_page: ref });
      }
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    var where = a.closest('.wa-float') ? 'float' : a.closest('.mbar, .sticky-wa') ? 'sticky_bar'
      : a.closest('header, .cstrip') ? 'header' : a.closest('footer') ? 'footer' : 'content';
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(h)) {
      ev('whatsapp_click', { link_position: where, link_text: (a.textContent || '').trim().slice(0, 60) });
    } else if (/^tel:/.test(h)) {
      ev('phone_click', { link_position: where, phone_number: h.replace(/^tel:/, '') });
    }
  }, true);

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || !f.action || !/enquiry\.php/.test(f.action)) return;
    var sel = f.querySelector('select[name=project], select[name=interest], input[type=hidden][name=interest]');
    var src = f.querySelector('input[name=source], input[name=page]');
    var ftf = f.querySelector('input[name=form_type]');
    var info = { form_type: ftf ? ftf.value : (/bank-lelong/.test(path) ? 'lelong_alerts' : 'enquiry'),
      project: sel ? (sel.value || '').slice(0, 80) : '', page: src ? (src.value || '').slice(0, 100) : path, at: Date.now() };
    ss(function (st) { st.setItem(LK, JSON.stringify(info)); });
    loadGtag();
    ev('form_submit', { form_id: f.id || f.getAttribute('name') || 'enquiry', form_type: info.form_type,
      form_choice: info.project, form_page: info.page });
  }, true);
})();
