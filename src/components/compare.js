import { formatPrice, percentDiff, sortOffers } from '../lib/utils.js';
import { MARKETPLACES } from '../data/demo.js';
import { createModal } from '../lib/modal.js';
import { showToast } from '../lib/toast.js';

function skeletonContent() {
  return `
    <div class="modal-header">
      <div>
        <div class="skeleton-box" style="height:22px;width:220px;margin-bottom:6px"></div>
        <div class="skeleton-box" style="height:14px;width:160px"></div>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-skeleton-head">
        <div class="skeleton-box modal-skeleton-thumb"></div>
        <div class="modal-skeleton-info">
          <div class="skeleton-box modal-skeleton-line" style="width:80%"></div>
          <div class="skeleton-box modal-skeleton-line mid" style="margin-bottom:0"></div>
        </div>
      </div>
      ${Array.from({ length: 3 }, () => `
        <div class="modal-skeleton-card">
          <div class="skeleton-box modal-skeleton-logo"></div>
          <div class="modal-skeleton-info">
            <div class="skeleton-box modal-skeleton-line short"></div>
            <div class="skeleton-box modal-skeleton-line" style="width:40%;margin-bottom:0"></div>
          </div>
          <div class="skeleton-box" style="height:24px;width:90px"></div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderContent(product) {
  const sorted = sortOffers(product.offers);
  const best = sorted[0].price;
  const worst = sorted[sorted.length - 1].price;
  const saving = worst - best;
  const savingPct = Math.round(saving / worst * 100);

  const offersHTML = sorted.map((o, i) => {
    const mp = MARKETPLACES[o.mp];
    const isBest = i === 0;
    const delta = isBest ? '' : '+' + percentDiff(o.price, best) + '%';

    return `
      <div class="compare-card ${isBest ? 'best' : ''}">
        <div class="compare-mp-logo ${o.mp}">${mp.short}</div>
        <div class="compare-info">
          <div class="mp-name">
            ${mp.name}
            ${isBest ? '<span class="badge-best">★ Лучшая цена</span>' : ''}
          </div>
          <div class="compare-details">
            ${o.delivery ? `<span class="detail">🚚 ${o.delivery}</span>` : ''}
            ${o.seller ? `<span class="detail">🏪 ${o.seller}</span>` : ''}
            ${o.rating ? `<span class="detail">★ ${o.rating}</span>` : ''}
          </div>
        </div>
        <div class="compare-price">
          <span class="price tabular">${formatPrice(o.price)}</span>
          ${delta ? `<span class="delta tabular">${delta}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  const bestMp = MARKETPLACES[sorted[0].mp];
  const count = product.offers.length;
  const countLabel = count === 1 ? 'магазин' : count < 5 ? 'магазина' : 'магазинов';

  return `
    <div class="modal-header">
      <div>
        <h2>Сравнение предложений</h2>
        <div class="sub">${count} ${countLabel} · обновлено 2 минуты назад</div>
      </div>
      <button class="modal-close" data-modal-close type="button" aria-label="Закрыть">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <div class="compare-head">
        <div class="thumb-sm">${product.emoji || '📦'}</div>
        <div class="info">
          <h3>${product.title}</h3>
          <div class="meta">
            ${product.rating ? `<span class="star">★ ${product.rating}</span>` : ''}
            ${product.reviews ? `<span>${product.reviews.toLocaleString('ru-RU')} отзывов</span>` : ''}
            ${product.inStock ? '<span>В наличии</span>' : ''}
          </div>
        </div>
      </div>

      <div class="compare-grid">${offersHTML}</div>

      <div class="compare-summary">
        <div class="saving-info">
          <div class="label">Экономия</div>
          <div class="amount tabular">${formatPrice(saving)}</div>
          <div class="sub">до ${savingPct}% на этом товаре</div>
        </div>
        <button class="btn btn-primary" id="compareBuyBest" type="button">
          Купить в ${bestMp.name}
        </button>
      </div>
    </div>
  `;
}

export function openCompareModal(product) {
  if (!product || !product.offers) {
    console.warn('[CompareModal] product is invalid');
    return;
  }

  const { overlay, close } = createModal(skeletonContent(), { wide: true });

  // Имитация загрузки — 500мс
  setTimeout(() => {
    // Если модалку уже закрыли — ничего не делаем
    if (!overlay.isConnected) return;

    // Заменяем содержимое
    const modal = overlay.querySelector('.modal');
    if (modal) {
      modal.innerHTML = renderContent(product);
    }

    const buyBtn = overlay.querySelector('#compareBuyBest');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        showToast('Переход в магазин (демо)');
      });
    }
  }, 500);
}