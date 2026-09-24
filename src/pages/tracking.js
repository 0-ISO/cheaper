import { TRACKED } from '../data/demo.js';
import { formatPrice, plural } from '../lib/utils.js';
import { renderSparkline } from '../lib/chart.js';
import { openNotificationsModal } from '../components/notifications.js';
import * as Router from '../router/router.js';
import { confirm } from '../components/confirm.js';
import { showToast } from '../lib/toast.js';

function renderStat(label, value, sub, cls = '') {
  return `
    <div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-value ${cls} tabular">${value}</div>
      ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
    </div>
  `;
}

function trendInfo(item) {
  const diff = item.currentPrice - item.startPrice;
  const pct = Math.round(Math.abs(diff) / item.startPrice * 100);

  if (diff < 0) return { cls: 'down', icon: '↓', text: `−${formatPrice(Math.abs(diff))} · ${pct}%`, sparkCls: '', hasChange: true };
  if (diff > 0) return { cls: 'up',   icon: '↑', text: `+${formatPrice(diff)} · ${pct}%`,          sparkCls: 'up', hasChange: true };
  return { cls: 'flat', icon: '—', text: 'Без изменений', sparkCls: 'flat', hasChange: false };
}

function renderItem(item, index) {
  const t = trendInfo(item);
  const showWas = t.cls === 'down';

  return `
    <div class="tracked-item" data-id="${item.id}"
         style="animation-delay:${index * 40}ms">
      <div class="tracked-thumb">${item.emoji}</div>

      <div class="tracked-info">
        <h3>${item.title}</h3>
        <div class="tracked-meta">
          ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>

      ${renderSparkline(item.history, t.sparkCls)}

      <div class="tracked-price">
        <div class="now tabular">${formatPrice(item.currentPrice)}</div>
        <div class="change ${t.cls}">
          ${t.icon} ${t.text}
        </div>
        ${showWas ? `<div class="was tabular">${formatPrice(item.startPrice)}</div>` : ''}
      </div>

      <div class="tracked-actions">
        <button class="toggle on" data-action="toggle" type="button" aria-label="Уведомления"></button>
        <button class="icon-btn" data-action="open" type="button" title="Открыть товар">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
        <button class="icon-btn" data-action="remove" type="button" title="Удалить">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function renderEmpty() {
  return `
    <div class="empty-state">
      <div class="icon">🔔</div>
      <h2>Пока ничего не отслеживается</h2>
      <p>Добавляйте товары в отслеживание — мы будем следить за ценой и пришлём уведомление, когда она упадёт.</p>
      <a href="#/" data-link class="btn btn-primary">Найти товары →</a>
    </div>
  `;
}

function skeletonsHTML(count = 3) {
  return Array.from({ length: count }, () => `
    <div class="tracked-item" style="animation:none">
      <div class="skeleton-box" style="width:80px;height:80px;border-radius:12px"></div>
      <div>
        <div class="skeleton-box" style="height:16px;width:70%;margin-bottom:8px"></div>
        <div class="skeleton-box" style="height:12px;width:40%"></div>
      </div>
      <div class="skeleton-box" style="width:90px;height:36px;border-radius:8px"></div>
      <div>
        <div class="skeleton-box" style="height:20px;width:100px;margin-bottom:6px"></div>
        <div class="skeleton-box" style="height:14px;width:70px"></div>
      </div>
    </div>
  `).join('');
}

let _unbind = null;

export function render({ outlet }) {
  if (_unbind) { _unbind(); _unbind = null; }

  // Скелетон
  outlet.innerHTML = `
    <div class="tracking">
      <div class="tracking-head">
        <div class="tracking-title">
          <div class="skeleton-box" style="height:32px;width:220px;margin-bottom:8px"></div>
          <div class="skeleton-box" style="height:16px;width:300px"></div>
        </div>
      </div>
      <div class="tracking-stats">
        ${Array.from({ length: 3 }, () =>
          '<div class="skeleton-box" style="height:100px;border-radius:14px"></div>'
        ).join('')}
      </div>
      <div class="tracked-list">${skeletonsHTML(3)}</div>
    </div>
  `;

  setTimeout(() => {
    const items = TRACKED || [];
    const isEmpty = items.length === 0;

    let totalSaving = 0;
    let downCount = 0;
    let upCount = 0;
    items.forEach(it => {
      const diff = it.currentPrice - it.startPrice;
      if (diff < 0) { totalSaving += Math.abs(diff); downCount++; }
      else if (diff > 0) upCount++;
    });

    outlet.innerHTML = `
      <div class="tracking">
        <div class="tracking-head">
          <div class="tracking-title">
            <h1>Отслеживаемые</h1>
            <p>${items.length} ${plural(items.length, 'товар', 'товара', 'товаров')} · уведомления при снижении цены</p>
          </div>
          <button class="btn btn-primary" ${isEmpty ? 'disabled style="opacity:0.5;pointer-events:none"' : ''} type="button">
            + Добавить товар
          </button>
        </div>

        ${!isEmpty ? `
          <div class="tracking-stats">
            ${renderStat('Активных', items.length, 'товаров отслеживается')}
            ${renderStat('Экономия', formatPrice(totalSaving), `${downCount} ${plural(downCount, 'товар', 'товара', 'товаров')} подешевел`, 'down')}
            ${renderStat('Подорожало', upCount, upCount === 0 ? 'всё стабильно' : `${upCount} ${plural(upCount, 'товар', 'товара', 'товаров')}`, upCount > 0 ? 'up' : '')}
          </div>

          <div class="notify-banner">
            <span class="bell">🔔</span>
            <div class="text">
              <b>Уведомления включены</b> — пришлём, когда цена упадёт больше чем на 5%.
            </div>
            <button class="btn btn-ghost" id="openNotifSettings" type="button">Настроить</button>
          </div>
        ` : ''}

        <div class="tracked-list" id="trackedList">
          ${isEmpty ? renderEmpty() : items.map(renderItem).join('')}
        </div>
      </div>
    `;

    if (!isEmpty) bindEvents();
  }, 400);
}

function bindEvents() {
  const list = document.getElementById('trackedList');
  if (!list) return;

  const onListClick = (e) => {
    const item = e.target.closest('.tracked-item');
    if (!item) return;

    const toggle = e.target.closest('[data-action="toggle"]');
    if (toggle) {
      toggle.classList.toggle('on');
      return;
    }

        const remove = e.target.closest('[data-action="remove"]');
    if (remove) {
      const id = item.dataset.id;
      confirm({
        title: 'Убрать из отслеживаемых?',
        message: 'Товар пропадёт из списка. Вы всегда сможете добавить его снова.',
        confirmText: 'Убрать',
        type: 'warning',
        icon: '🔔',
      }).then((ok) => {
        if (!ok) return;
        item.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => item.remove(), 300);
        showToast('Товар убран из отслеживаемых');
      });
      return;
    }

    const open = e.target.closest('[data-action="open"]');
    if (open) {
      Router.navigate('/product/' + item.dataset.id);
    }
  };

  list.addEventListener('click', onListClick);

  const notifBtn = document.getElementById('openNotifSettings');
  const onNotifClick = () => openNotificationsModal();
  if (notifBtn) notifBtn.addEventListener('click', onNotifClick);

  _unbind = () => {
    list.removeEventListener('click', onListClick);
    if (notifBtn) notifBtn.removeEventListener('click', onNotifClick);
  };
}