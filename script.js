'use strict';

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const themeColor = document.querySelector('meta[name="theme-color"]');

function effectiveTheme() {
  return root.dataset.theme || (systemTheme.matches ? 'dark' : 'light');
}

function syncThemeControls() {
  const dark = effectiveTheme() === 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeToggle.setAttribute('title', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeColor.setAttribute('content', dark ? '#141d1b' : '#f7f8f4');
}

themeToggle.hidden = false;
syncThemeControls();
systemTheme.addEventListener('change', syncThemeControls);
themeToggle.addEventListener('click', () => {
  root.dataset.theme = effectiveTheme() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch { /* The toggle still works without storage. */ }
  syncThemeControls();
});

const menuToggle = document.getElementById('menu-toggle');
const navigation = document.getElementById('navigation');
const mobileLayout = window.matchMedia('(max-width: 760px)');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  navigation.dataset.open = String(open);
  menuToggle.querySelector('span').textContent = open ? '−' : '+';
}

// Keep navigation visible if JavaScript is disabled or fails to initialize.
menuToggle.hidden = false;
navigation.dataset.collapsible = 'true';
setMenu(false);
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (mobileLayout.matches) {
    setMenu(false);
    // Move focus out of the collapsed menu to the selected section.
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header-inner')) setMenu(false);
});
mobileLayout.addEventListener('change', () => {
  if (!mobileLayout.matches && document.activeElement === menuToggle) navigation.querySelector('a').focus();
  if (mobileLayout.matches && navigation.contains(document.activeElement)) menuToggle.focus();
  setMenu(false);
});

const navLinks = [...navigation.querySelectorAll('a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let scrollQueued = false;

function updateActiveSection() {
  const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
  const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
  const current = atPageEnd ? sections[sections.length - 1] : sections.reduce((active, section) => section.getBoundingClientRect().top <= headerHeight + 100 ? section : active, sections[0]);
  for (const link of navLinks) {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  scrollQueued = false;
}

window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateActiveSection);
  }
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();
document.getElementById('year').textContent = new Date().getFullYear();
