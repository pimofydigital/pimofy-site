/* Google tag (GA4) with Consent Mode v2. Analytics stays off until the visitor accepts. */
(function () {
  var GA_ID = 'G-W1FW8P8XDX';
  var KEY = 'pimofy_consent_v1';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'url_passthrough', true);

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });

  // Load the Google tag library after the page has finished rendering, so it
  // never competes with the first paint (it is ~180 KB of script). Events
  // queued in dataLayer before it loads are still sent.
  var loaded = false;
  function loadGtag() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function scheduleGtag() {
    var idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
    setTimeout(function () { idle(loadGtag, { timeout: 2000 }); }, 3500);
  }
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (evt) {
    window.addEventListener(evt, loadGtag, { once: true, passive: true });
  });
  if (document.readyState === 'complete') scheduleGtag();
  else window.addEventListener('load', scheduleGtag, { once: true });

  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function choose(granted) {
    gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    store(granted ? 'granted' : 'denied');
    var b = document.getElementById('cookie-banner');
    if (b) b.hidden = true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    if (saved !== 'granted' && saved !== 'denied') banner.hidden = false;
    var a = document.getElementById('cookie-accept');
    var r = document.getElementById('cookie-reject');
    if (a) a.addEventListener('click', function () { choose(true); });
    if (r) r.addEventListener('click', function () { choose(false); });
    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); banner.hidden = false; if (a) a.focus(); });
    });
  });
})();
