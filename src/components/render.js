import { formatPrice, formatNumber, percentDiff, sortOffers } from '../lib/utils.js';
import { MARKETPLACES, PRICE_HISTORY } from '../data/demo.js';
import { renderChart } from '../lib/chart.js';

function getMarketplace(id) {
  return MARKETPLACES[id] || { id, name: id, short: id.charAt(0).toUpperCase() };
}

function renderPriceRows(offers) {
  const sorted = sortOffers(offers);
  const best = sorted[0].price;

  return sorted.map((o, i) => {
    const isBest = i === 0;
    const delta = isBest ? '' : '+' + percentDiff(o.price, best) + '%';
    const mp = getMarketplace(o.mp);   // ← защита

    return `
      <div class="price-row ${isBest ? 'best' : ''}">
        <span class="mp mp-${o.mp}">
          <span class="mp-logo">${mp.short}</span>
          ${mp.name}
        </span>
        ${isBest ? '<span class="badge-best">★ Лучшая</span>' : ''}
        <span class="val tabular">${formatPrice(o.price)}</span>
        <span class="delta tabular">${delta}</span>
      </div>
    `;
  }).join('');
}

function cardHTML(p, index) {
  const sorted = sortOffers(p.offers);
  const best = sorted[0].price;
  const worst = sorted[sorted.length - 1].price;
  const saving = worst - best;
  const savingPct = Math.round(saving / worst * 100);

  return `
    <article class="card" data-id="${p.id}" style="animation-delay:${index * 40}ms">
      <div class="card-main">
        <div class="thumb">
          ${p.inStock ? '<span class="thumb-badge">В наличии</span>' : ''}
          ${p.emoji || '📦'}
        </div>

        <div class="info">
          <h3><a href="#/product/${p.id}" data-link>${p.title}</a></h3>
          <div class="meta">
            ${p.rating ? `<span class="star">★ ${p.rating}</span>` : ''}
            ${p.reviews ? `<span>${formatNumber(p.reviews)} отзывов</span>` : ''}
            ${p.inStock ? '<span class="stock">В наличии</span>' : ''}
          </div>
          <div class="prices">${renderPriceRows(p.offers)}</div>
        </div>

        <div class="card-side">
          <div class="savings">
            <div class="savings-label">Экономия</div>
            <div class="savings-val tabular">${formatPrice(saving)}</div>
            <div class="savings-sub">до ${savingPct}% на этом товаре</div>
          </div>
          <button class="btn btn-primary" data-action="compare-card" type="button">
            Сравнить
          </button>
          <button class="btn btn-ghost" data-action="toggle-chart" type="button">
            История цен
          </button>
        </div>
      </div>

      <div class="card-footer">
        <span>Разброс цен: <b class="tabular">${formatPrice(saving)}</b> · экономия до <b>${savingPct}%</b></span>
        <a href="#/product/${p.id}" data-link class="link">Все предложения →</a>
      </div>

      <div class="chart">
        <div class="chart-inner">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2);margin-bottom:8px">
            <span>История за 90 дней</span>
            <span style="color:var(--success)">↓ 8% за месяц</span>
          </div>
          ${renderChart(PRICE_HISTORY)}
        </div>
      </div>
    </article>
  `;
}

function skeletonHTML() {
  return `
    <div class="skeleton-card">
      <div class="skeleton-box sk-thumb"></div>
      <div>
        <div class="skeleton-box sk-line"></div>
        <div class="skeleton-box sk-line mid"></div>
        <div class="skeleton-box sk-line short"></div>
      </div>
      <div>
        <div class="skeleton-box sk-price"></div>
        <div class="skeleton-box sk-price"></div>
        <div class="skeleton-box sk-price"></div>
      </div>
    </div>
  `;
}

export function productsHTML(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <h2>Ничего не найдено</h2>
        <p>Попробуйте изменить запрос или посмотрите популярные товары</p>
      </div>
    `;
  }
  return list.map(cardHTML).join('');
}

export function skeletonsHTML(count = 3) {
  return Array.from({ length: count }, skeletonHTML).join('');
}