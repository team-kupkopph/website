// Kupkop PH — shared scripts
document.addEventListener('DOMContentLoaded', function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  var menuBtn = document.querySelector('.menu-btn');
  var links = document.querySelector('.nav-links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () { links.classList.toggle('open'); });
  }

  initCookieConsent();
  addManageCookiesLink();
});

// Adds a "Manage cookies" link to the footer that re-opens the consent banner.
function addManageCookiesLink() {
  var fb = document.querySelector('.foot-bottom');
  if (!fb) return;
  var spans = fb.querySelectorAll('span');
  var target = spans[spans.length - 1]; // the "Privacy · Terms" span
  if (!target) return;
  target.appendChild(document.createTextNode(' · '));
  var a = document.createElement('a');
  a.href = '#';
  a.textContent = 'Manage cookies';
  a.addEventListener('click', function (e) {
    e.preventDefault();
    try { localStorage.removeItem('kkp-consent'); } catch (err) {}
    var existing = document.querySelector('.cookie');
    if (existing) existing.remove();
    initCookieConsent();
  });
  target.appendChild(a);
}

// Cookie consent — works with Google Consent Mode (analytics default denied in the page head).
function initCookieConsent() {
  var KEY = 'kkp-consent';
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === 'granted' || choice === 'declined') return; // already chose

  var bar = document.createElement('div');
  bar.className = 'cookie';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Cookie consent');
  bar.innerHTML =
    '<p>🍪 We use cookies for analytics to understand how visitors use the site and improve Kupkop PH. ' +
    'See our <a href="privacy.html">Privacy Policy</a>.</p>' +
    '<div class="actions">' +
    '<button class="decline" type="button">Decline</button>' +
    '<button class="accept" type="button">Accept</button>' +
    '</div>';
  document.body.appendChild(bar);

  function close() { bar.remove(); }
  bar.querySelector('.accept').addEventListener('click', function () {
    try { localStorage.setItem(KEY, 'granted'); } catch (e) {}
    if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'granted' });
    close();
  });
  bar.querySelector('.decline').addEventListener('click', function () {
    try { localStorage.setItem(KEY, 'declined'); } catch (e) {}
    close();
  });
}
