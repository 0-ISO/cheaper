import { findProduct } from '../data/demo.js';
import { MARKETPLACES } from '../data/demo.js';
import { formatPrice, formatNumber, sortOffers } from '../lib/utils.js';
import { renderChart } from '../lib/chart.js';
import { showToast } from '../lib/toast.js';
import { openCompareModal } from '../components/compare.js';

function renderGallery(product) {
  const main = product.gallery[0];
  const thumbs = product.gallery.map((g, i) => `
    <button class="gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" type="button">
      ${g}
    </button>
  `).join('');

  return `
    <div class="gallery">
      <div class="gallery-main" id="galleryMain">
        ${product.inStock ? '<span class="thumb-badge">В наличии</span>' : ''}
        ${main}
      </div>
      <div class="gallery-thumbs">${thumbs}</div>
    </div>
  `;
}

function renderBestOffer(offers) {
  const sorted = sortOffers(offers);
  const best = sorted[0];
  const mp = MARKETPLACES[best.mp];

  return `
    <div class="best-offer">
      <div class="best-offer-label">★ Лучшая цена</div>
      <div class="best-offer-row">
        <span class="mp mp-${best.mp}">
          <span class="mp-logo">${mp.short}</span>
          ${mp.name}
        </span>
        <span class="price tabular">${formatPrice(best.price)}</span>
      </div>
      <button class="btn btn-primary" type="button">Перейти в ${mp.name}</button>
    </div>
  `;
}

function renderOffers(offers) {
  const sorted = sortOffers(offers);

  return sorted.map(o => {
    const mp = MARKETPLACES[o.mp];
    return `
      <div class="offer-row">
        <span class="mp mp-${o.mp}">
          <span class="mp-logo">${mp.short}</span>
          ${mp.name}
        </span>
        <span class="delivery">${o.delivery || ''} · ${o.seller || ''}</span>
        <span class="price tabular">${formatPrice(o.price)}</span>
        <button class="btn btn-ghost" type="button">Открыть</button>
      </div>
    `;
  }).join('');
}

function renderSpecs(specs) {
  return Object.entries(specs).map(([k, v]) => `
    <div class="spec-row">
      <span class="key">${k}</span>
      <span class="val">${v}</span>
    </div>
  `).join('');
}

function skeletonHTML() {
  return `
    <div class="product">
      <div class="skeleton-box" style="height:14px;width:280px;margin-bottom:20px"></div>
      <div class="product-grid">
        <div>
          <div class="skeleton-box" style="aspect-ratio:1;border-radius:var(--radius)"></div>
          <div style="display:flex;gap:8px;margin-top:12px">
            ${Array.from({ length: 4 }, () =>
              '<div class="skeleton-box" style="width:68px;height:68px;border-radius:12px"></div>'
            ).join('')}
          </div>
        </div>
        <div>
          <div class="skeleton-box" style="height:26px;width:90%;margin-bottom:12px"></div>
          <div class="skeleton-box" style="height:26px;width:60%;margin-bottom:20px"></div>
          <div class="skeleton-box" style="height:14px;width:70%;margin-bottom:24px"></div>
          <div class="skeleton-box" style="height:130px;border-radius:14px;margin-bottom:20px"></div>
          <div class="skeleton-box" style="height:50px;border-radius:12px;margin-bottom:8px"></div>
          <div class="skeleton-box" style="height:50px;border-radius:12px;margin-bottom:8px"></div>
          <div class="skeleton-box" style="height:50px;border-radius:12px"></div>
        </div>
      </div>
    </div>
  `;
}

let _unbind = null;

export function render({ outlet, params }) {
  if (_unbind) { _unbind(); _unbind = null; }

  outlet.innerHTML = skeletonHTML();

  setTimeout(() => {
    const product = findProduct(params.id);

    if (!product || !product.specs) {
      import('./not-found.js').then(({ render: render404 }) => {
        render404({ outlet, params: {}, path: params.id });
      });
      return;
    }

    outlet.innerHTML = `
      <div class="product">
        <div class="breadcrumbs">
          <a href="#/" data-link>Поиск</a>
          <span class="sep">/</span>
          <span>Смартфоны</span>
          <span class="sep">/</span>
          <span>${product.title}</span>
        </div>

        <div class="product-grid">
          <div>${renderGallery(product)}</div>

          <div class="product-info">
            <h1>${product.title}</h1>
            <div class="product-meta">
              <span class="star">★ ${product.rating}</span>
              <span>${formatNumber(product.reviews)} отзывов</span>
              ${product.inStock ? '<span class="stock">В наличии</span>' : ''}
              <span>Артикул: APL-${product.id}0001</span>
            </div>

            ${renderBestOffer(product.offers)}

            <div class="all-offers-title">
              Все предложения (${product.offers.length})
            </div>
            <div class="all-offers">${renderOffers(product.offers)}</div>

            <div class="product-actions">
              <button class="btn btn-primary" data-action="compare" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M3 6h18M6 12h12M10 18h4"/>
                </svg>
                Сравнить
              </button>
              <button class="btn btn-ghost" data-action="track" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10 21a2 2 0 0 0 4 0"/>
                </svg>
                Отслеживать
              </button>
            </div>
          </div>
        </div>

        <div class="specs">
          <h2>Характеристики</h2>
          <div class="specs-grid">${renderSpecs(product.specs)}</div>
        </div>

        <div class="price-history">
          <div class="price-history-head">
            <h2>История цены</h2>
            <div class="period-tabs">
              <button class="period-tab active" type="button">30 дней</button>
              <button class="period-tab" type="button">90 дней</button>
              <button class="period-tab" type="button">Год</button>
            </div>
          </div>
          <div class="price-history-chart">
            ${renderChart(product.history)}
          </div>
        </div>
      </div>
    `;

    bindEvents(product);
  }, 400);
}

function bindEvents(product) {
  // Галерея
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const thumbHandlers = [];
  thumbs.forEach(btn => {
    const h = () => {
      thumbs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const idx = Number(btn.dataset.idx);
      const main = document.getElementById('galleryMain');
      if (main) {
        main.innerHTML = `
          ${product.inStock ? '<span class="thumb-badge">В наличии</span>' : ''}
          ${product.gallery[idx]}
        `;
      }
    };
    btn.addEventListener('click', h);
    thumbHandlers.push([btn, h]);
  });

  // Периоды
  const tabs = document.querySelectorAll('.period-tab');
  const tabHandlers = [];
  tabs.forEach(tab => {
    const h = () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    };
    tab.addEventListener('click', h);
    tabHandlers.push([tab, h]);
  });

  // Сравнить
  const compareBtn = document.querySelector('[data-action="compare"]');
  const onCompare = () => openCompareModal(product);
  if (compareBtn) compareBtn.addEventListener('click', onCompare);

  // Отслеживать
  const trackBtn = document.querySelector('[data-action="track"]');
  let onTrack = null;
  if (trackBtn) {
    onTrack = () => {
      const on = trackBtn.classList.toggle('btn-primary');
      trackBtn.classList.toggle('btn-ghost', !on);
      trackBtn.innerHTML = on
        ? '★ Отслеживается'
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round">
             <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
             <path d="M10 21a2 2 0 0 0 4 0"/>
           </svg> Отслеживать`;
      showToast(on ? 'Добавлено в отслеживаемые' : 'Убрано из отслеживаемых');
    };
    trackBtn.addEventListener('click', onTrack);
  }

  _unbind = () => {
    thumbHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
    tabHandlers.forEach(([el, h]) => el.removeEventListener('click', h));
    if (compareBtn) compareBtn.removeEventListener('click', onCompare);
    if (trackBtn && onTrack) trackBtn.removeEventListener('click', onTrack);
  };
}