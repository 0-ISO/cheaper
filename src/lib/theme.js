import { storage } from './storage.js';

const ICONS = {
  dark: 'M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l-1.5-1.5M19.5 19.5 18 18M6 18l-1.5 1.5M19.5 4.5 18 6M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  light: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
};

const html = document.documentElement;

export function apply(theme) {
  html.setAttribute('data-theme', theme);

  const icon = document.getElementById('themeIcon');
  if (icon) icon.setAttribute('d', theme === 'dark' ? ICONS.dark : ICONS.light);

  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = theme === 'dark' ? '#0B0B0D' : '#FAFAFA';
}

export function init() {
  const saved = storage.get('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved || (prefersDark ? 'dark' : 'light'));

  const toggle = document.getElementById('themeToggle');
  if (!toggle) {
    console.warn('[Theme] #themeToggle not found');
    return;
  }

  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    storage.set('theme', next);
  });
}

export function toggle() {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  apply(next);
  storage.set('theme', next);
  return next;
}