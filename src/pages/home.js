import { findProduct, MARKETPLACES } from '../data/demo.js';
import { productsHTML, skeletonsHTML } from '../components/render.js';
import { openCompareModal } from '../components/compare.js';
import { search as apiSearch } from '../lib/api.js';

function renderHero() {
  return `
    <section class="hero">
      <div class="container">
        <div class="hero-badge">
          <span class="pulse"></span>
          Обновляем цены каждые 15 минут
        </div>

        <h1>Один поиск — <span class="grad">четыре магазина</span></h1>

        <p class="hero-sub">
          Сравниваем цены на Ozon, Wildberries, DNS и Яндекс Маркете.
          Средняя экономия — <b>2 340 ₽</b> на заказе.
        </p>

        <div class="hero-stats">
          <div class="hero-stat"><b>2.4M</b> товаров</div>
          <div class="hero-stat"><b>4</b> магазина</div>
          <div class="hero-stat"><b>15 мин</b> обновление</div>
        </div>

        <div class="search-wrap">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" id="searchInput" placeholder="Введите название товара…"
                   value="iphone" autocomplete="off" />
            <button class="btn btn-primary" id="searchBtn" type="button">Сравнить</button>
          </div>

          <div class="search-dropdown" id="searchDropdown">
            <div class="dd-section">Популярное сейчас</div>
            <div class="dd-item" data-value="iphone"><div class="dd-icon">📱</div><span>iPhone</span><span class="dd-meta">12 400 запросов</span></div>
            <div class="dd-item" data-value="playstation 5"><div class="dd-icon">🎮</div><span>PlayStation 5</span><span class="dd-meta">8 200 запросов</span></div>
            <div class="dd-item" data-value="dyson"><div class="dd-icon">🧹</div><span>Dyson</span><span class="dd-meta">5 100 запросов</span></div>
            <div class="dd-divider"></div>
            <div class="dd-section">Категории</div>
            <div class="dd-item" data-value="смартфон"><div class="dd-icon">📱</div><span>Смартфоны</span></div>
            <div class="dd-item" data-value="ноутбук"><div class="dd-icon">💻</div><span>Ноутбуки</span></div>
            <div class="dd-item" data-value="наушники"><div class="dd-icon">🎧</div><span>Наушники</span></div>
          </div>
        </div>

        <div class="chips">
          <button class="chip" type="button">iphone</button>
          <button class="chip" type="button">playstation 5</button>
          <button class="chip" type="button">dyson</button>
          <button class="chip" type="button">macbook</button>
          <button class="chip" type="button">samsung</button>
        </div>
      </div>
    </section>
  `;
}

function renderToolbar(count, query) {
  return `
    <div class="toolbar" id="toolbar">
      <div class="toolbar-inner">
        <div class="toolbar-count">
          Найдено <span id="resultCount">${count}</span> товара
          <span>· по запросу «<b id="queryLabel">${query}</b>»</span>
        </div>
        <div class="live"><span class="dot"></span>обновлено сейчас</div>
        <div class="filters">
          <button class="filter active" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M3 6h18M6 12h12M10 18h4"/>
            </svg>
            Сначала дешёвые
          </button>
          <button class="filter" type="button">В наличии</button>
          <button class="filter" type="button">Рейтинг 4+</button>
        </div>
      </div>
    </div>
  `;
}

let _unbind = null;

export function render({ outlet }) {
  if (_unbind) { _unbind(); _unbind = null; }

  const initialQuery = 'iphone';

  outlet.innerHTML = `
    ${renderHero()}
    <div id="toolbarContainer"></div>
    <div class="container">
      <div class="results" id="cards">
        ${skeletonsHTML(3)}
      </div>
    </div>
  `;

  loadProducts(initialQuery);
  bindEvents();
}

async function loadProducts(query) {
  const cards = document.getElementById('cards');
  const toolbarContainer = document.getElementById('toolbarContainer');
  if (!cards) return;

  cards.innerHTML = skeletonsHTML(3);
  if (toolbarContainer) toolbarContainer.innerHTML = '';

  let products = [];
  let source = 'api';

  try {
    const data = await apiSearch(query, 20);
    products = data.products || [];
    console.log('[Home] loaded from API:', data.count, 'products, source:', data.source);
  } catch (err) {
    console.error('[Home] API failed:', err);
    products = [];
    source = 'error';
  }

  if (toolbarContainer) {
    toolbarContainer.innerHTML = renderToolbar(products.length, query);
  }

  if (products.length === 0) {
    cards.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <h2>Ничего не найдено</h2>
        <p>Попробуйте изменить запрос</p>
      </div>
    `;
    return;
  }

  cards.innerHTML = productsHTML(products);
}

function bindEvents() {
  const input = document.getElementById('searchInput');
  const dropdown = document.getElementById('searchDropdown');
  const btn = document.getElementById('searchBtn');
  const cards = document.getElementById('cards');
  const queryLabel = document.getElementById('queryLabel');

  if (!input || !dropdown || !cards) return;

  const open = () => dropdown.classList.add('open');
  const close = () => dropdown.classList.remove('open');

  const runSearch = () => {
    const q = input.value.trim() || 'iphone';
    if (queryLabel) queryLabel.textContent = q;
    loadProducts(q);
  };

  const onInputFocus = () => open();
  const onDocClick = (e) => {
    if (!e.target.closest('.search-wrap')) close();
  };
  const onDropdownClick = (e) => {
    const item = e.target.closest('.dd-item');
    if (!item) return;
    input.value = item.dataset.value;
    close();
    runSearch();
  };
  const onBtnClick = () => { close(); runSearch(); };
  const onKeyDown = (e) => {
    if (e.key === 'Enter') { close(); runSearch(); }
    if (e.key === 'Escape') close();
  };

  const onCardsClick = (e) => {
    const toggleBtn = e.target.closest('[data-action="toggle-chart"]');
    if (toggleBtn) {
      const chart = toggleBtn.closest('.card')?.querySelector('.chart');
      if (!chart) return;
      chart.classList.toggle('open');
      toggleBtn.textContent = chart.classList.contains('open')
        ? 'Скрыть историю'
        : 'История цен';
      return;
    }

    const compareBtn = e.target.closest('[data-action="compare-card"]');
    if (compareBtn) {
      const cardEl = compareBtn.closest('.card');
      const id = cardEl.dataset.id;
      const product = findProduct(id);
      if (product) openCompareModal(product);
    }
  };

  input.addEventListener('focus', onInputFocus);
  document.addEventListener('click', onDocClick);
  dropdown.addEventListener('click', onDropdownClick);
  btn.addEventListener('click', onBtnClick);
  input.addEventListener('keydown', onKeyDown);
  cards.addEventListener('click', onCardsClick);

  const chips = document.querySelectorAll('.chip');
  const chipHandlers = [];
  chips.forEach(c => {
    const h = () => {
      input.value = c.textContent.trim();
      runSearch();
    };
    c.addEventListener('click', h);
    chipHandlers.push([c, h]);
  });

  _unbind = () => {
    input.removeEventListener('focus', onInputFocus);
    document.removeEventListener('click', onDocClick);
    dropdown.removeEventListener('click', onDropdownClick);
    btn.removeEventListener('click', onBtnClick);
    input.removeEventListener('keydown', onKeyDown);
    cards.removeEventListener('click', onCardsClick);
    chipHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
  };
}