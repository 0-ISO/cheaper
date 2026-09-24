import { storage } from '../lib/storage.js';

const KEY = 'onboarding-seen';
const TOTAL_SLIDES = 3;

let root = null;
let currentSlide = 0;
let touchStartX = 0;
let touchStartY = 0;
let keyHandler = null;

function slide1() {
  return {
    step: 'Шаг 1 — Возможности',
    title: 'Все магазины<br>в <span class="grad">одном месте</span>',
    text: 'Сравниваем цены на <b>Ozon</b>, <b>Wildberries</b>, <b>DNS</b> и <b>Яндекс Маркете</b> — без переключения между вкладками.',
    features: [
      'Актуальные цены каждые 15 минут',
      'История цен за 90 дней',
      'Никакой рекламы — только цифры',
    ],
    visual: `
      <div class="demo-card">
        <div class="mp-grid">
          <div class="mp-tile mp-ozon-tile"><div class="mp-name">Ozon</div><div class="mp-sub">64 990 ₽</div></div>
          <div class="mp-tile mp-wb-tile"><div class="mp-name">Wildberries</div><div class="mp-sub">67 490 ₽</div></div>
          <div class="mp-tile mp-dns-tile"><div class="mp-name">DNS</div><div class="mp-sub">69 990 ₽</div></div>
          <div class="mp-tile mp-yandex-tile"><div class="mp-name">Я.Маркет</div><div class="mp-sub">66 490 ₽</div></div>
        </div>
        <div class="mp-connect">
          <span class="dot-live"></span>
          Подключено 4 магазина · обновление каждые 15 мин
        </div>
      </div>
    `,
  };
}

function slide2() {
  return {
    step: 'Шаг 2 — Как работает',
    title: 'Один поиск —<br><span class="grad">сравнение цен</span>',
    text: 'Введите название товара. Мы найдём его на всех площадках, сопоставим позиции и покажем, где дешевле — с учётом доставки и рейтинга продавца.',
    features: [
      'Умное сопоставление одинаковых товаров',
      'Учёт доставки и рейтинга продавца',
      'Сортировка по цене, наличию, отзывам',
    ],
    visual: `
      <div class="demo-card">
        <div class="search-demo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span>iPhone 15 128GB<span class="caret"></span></span>
        </div>
        <div class="price-compare">
          <div class="price-compare-row best">
            <div class="mp-logo" style="background:var(--ozon)">O</div>
            <span class="mp-name">Ozon</span>
            <span class="val tabular">64 990 ₽</span>
          </div>
          <div class="price-compare-row">
            <div class="mp-logo" style="background:var(--yandex)">Я</div>
            <span class="mp-name">Я.Маркет</span>
            <span class="val tabular">66 490 ₽</span>
          </div>
          <div class="price-compare-row">
            <div class="mp-logo" style="background:var(--wb)">W</div>
            <span class="mp-name">Wildberries</span>
            <span class="val tabular">67 490 ₽</span>
          </div>
          <div class="price-compare-row">
            <div class="mp-logo" style="background:var(--dns)">D</div>
            <span class="mp-name">DNS</span>
            <span class="val tabular">69 990 ₽</span>
          </div>
        </div>
      </div>
    `,
  };
}

function slide3() {
  return {
    step: 'Шаг 3 — Выгода',
    title: 'Экономьте<br><span class="grad">до 30%</span> на заказе',
    text: 'Отслеживайте цены на нужные товары — пришлём уведомление, когда цена упадёт. Средняя экономия наших пользователей — <b>2 340 ₽</b> на заказе.',
    features: [
      'Push-уведомления о снижении цены',
      'График истории за 90 дней',
      'Список отслеживаемых в один клик',
    ],
    visual: `
      <div class="demo-card">
        <div class="savings-demo">
          <div class="label">Экономия за месяц</div>
          <div class="amount tabular">2 340 ₽</div>
          <div class="sub">на 8 заказах</div>
          <div class="bar"><div class="bar-fill"></div></div>
          <div class="bar-meta">
            <span>Без Ценомера</span>
            <span>С Ценомером</span>
          </div>
        </div>
      </div>
    `,
  };
}

const SLIDES = [slide1, slide2, slide3];

function renderOverlay() {
  const slidesHTML = SLIDES.map((fn, i) => {
    const s = fn();
    return `
      <div class="slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
        <div class="slide-text">
          <div class="slide-step">${s.step}</div>
          <h2>${s.title}</h2>
          <p>${s.text}</p>
          <div class="slide-features">
            ${s.features.map(f => `
              <div class="slide-feature">
                <span class="check">✓</span>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="slide-visual">${s.visual}</div>
      </div>
    `;
  }).join('');

  const dotsHTML = SLIDES.map((_, i) =>
    `<div class="dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></div>`
  ).join('');

  root = document.createElement('div');
  root.className = 'onboarding';
  root.id = 'onboarding';
  root.innerHTML = `
    <div class="onboard-top">
      <div class="onboard-brand">
        <div class="logo-mark">Ц</div>
        <span>Ценомер</span>
      </div>
      <button class="onboard-skip" id="onboardSkip" type="button">Пропустить</button>
    </div>

    <div class="onboard-stage">
      <div class="slides-viewport" id="slidesViewport">${slidesHTML}</div>
    </div>

    <div class="onboard-bottom">
      <div class="dots" id="dots">${dotsHTML}</div>
      <div class="onboard-nav">
        <button class="btn btn-ghost btn-lg hidden" id="onboardPrev" type="button">Назад</button>
        <button class="btn btn-primary btn-lg" id="onboardNext" type="button">Далее →</button>
      </div>
    </div>
  `;

  document.body.appendChild(root);
  document.body.style.overflow = 'hidden';
  bindEvents();
}

function goTo(index) {
  if (index < 0 || index >= TOTAL_SLIDES) return;

  const slides = root.querySelectorAll('.slide');
  const dots = root.querySelectorAll('.dot');

  slides.forEach((el, i) => {
    el.classList.remove('active', 'prev');
    if (i === index) el.classList.add('active');
    else if (i < index) el.classList.add('prev');
  });

  dots.forEach((el, i) => el.classList.toggle('active', i === index));

  currentSlide = index;
  updateNav();
}

function updateNav() {
  const prevBtn = root.querySelector('#onboardPrev');
  const nextBtn = root.querySelector('#onboardNext');
  const skipBtn = root.querySelector('#onboardSkip');

  prevBtn.classList.toggle('hidden', currentSlide === 0);

  if (currentSlide === TOTAL_SLIDES - 1) {
    nextBtn.textContent = 'Начать';
    skipBtn.classList.add('hidden');
  } else {
    nextBtn.textContent = 'Далее →';
    skipBtn.classList.remove('hidden');
  }
}

function next() {
  if (currentSlide === TOTAL_SLIDES - 1) return finish();
  goTo(currentSlide + 1);
}

function prev() {
  goTo(currentSlide - 1);
}

function finish() {
  storage.set(KEY, true);

  if (keyHandler) {
    document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  }

  if (!root) return;
  root.classList.add('closing');
  document.body.style.overflow = '';

  setTimeout(() => {
    if (root) {
      root.remove();
      root = null;
    }
    if (location.hash && location.hash !== '#/') {
      location.hash = '#/';
    }
  }, 300);
}

function skip() { finish(); }

function bindEvents() {
  root.querySelector('#onboardNext').addEventListener('click', next);
  root.querySelector('#onboardPrev').addEventListener('click', prev);
  root.querySelector('#onboardSkip').addEventListener('click', skip);

  root.querySelector('#dots').addEventListener('click', (e) => {
    const dot = e.target.closest('[data-dot]');
    if (dot) goTo(Number(dot.dataset.dot));
  });

  keyHandler = (e) => {
    if (!root) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Escape') skip();
  };
  document.addEventListener('keydown', keyHandler);

  const viewport = root.querySelector('#slidesViewport');
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) next();
    else prev();
  }, { passive: true });
}

export function showOnboarding() {
  if (root) {
    console.warn('[Onboarding] already shown');
    return;
  }
  currentSlide = 0;
  renderOverlay();
}

export function shouldShowOnboarding() {
  return !storage.get(KEY);
}

export function resetOnboarding() {
  storage.remove(KEY);
}