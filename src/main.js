import './styles/index.css';

import { init as initTheme } from './lib/theme.js';
import * as Router from './router/router.js';
import { showOnboarding, shouldShowOnboarding, resetOnboarding } from './components/onboarding.js';

// ─── Страницы ───
import * as HomePage from './pages/home.js';
import * as ProductPage from './pages/product.js';
import * as TrackingPage from './pages/tracking.js';
import * as ProfilePage from './pages/profile.js';
import * as SettingsPage from './pages/settings.js';

// ─── Регистрация роутов ───
Router.register('/', HomePage.render);
Router.register('/product/:id', ProductPage.render);
Router.register('/tracking', TrackingPage.render);
Router.register('/profile', ProfilePage.render);
Router.register('/settings', SettingsPage.render);

// ─── Глобальные обработчики ───
function bindGlobalHandlers() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      Router.navigate(href.slice(1));
    }
  });

  window.addEventListener('scroll', () => {
    const toolbar = document.getElementById('toolbar');
    if (toolbar) toolbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const resetBtn = document.getElementById('resetOnboarding');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetOnboarding();
      showOnboarding();
    });
  }

  const demoToggle = document.getElementById('demoToggle');
  if (demoToggle) {
    demoToggle.addEventListener('click', () => {
      const cards = document.getElementById('cards');
      if (!cards) return;
      const on = demoToggle.classList.toggle('on');
      if (on) {
        import('./components/render.js').then(({ skeletonsHTML, productsHTML }) => {
          import('./data/demo.js').then(({ PRODUCTS }) => {
            cards.innerHTML = skeletonsHTML(3);
            setTimeout(() => {
              cards.innerHTML = productsHTML(PRODUCTS);
              demoToggle.classList.remove('on');
            }, 1800);
          });
        });
      }
    });
  }
}

// ─── Boot ───
function boot() {
  initTheme();

  const app = document.getElementById('app');
  if (!app) {
    console.error('[main] #app not found');
    return;
  }

  Router.init(app);
  bindGlobalHandlers();

  if (shouldShowOnboarding()) {
    showOnboarding();
  }

  console.log('[Cenomer] booted — UI v0.6 (settings, confirm, animations) ✨');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}