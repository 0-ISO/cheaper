import { showToast } from '../lib/toast.js';
import { openNotificationsModal } from '../components/notifications.js';
import { toggle as toggleTheme } from '../lib/theme.js';
import { confirm } from '../components/confirm.js';
import * as Router from '../router/router.js';

const USER = {
  name: 'Иван Петров',
  email: 'ivan@example.com',
  initials: 'ИП',
  trackedCount: 3,
  historyCount: 47,
};

const SEARCH_HISTORY = [
  { query: 'iPhone 15 128GB',    emoji: '📱', count: 12, when: '2 часа назад' },
  { query: 'PlayStation 5 Slim', emoji: '🎮', count: 8,  when: 'вчера' },
  { query: 'Dyson V15 Detect',   emoji: '🧹', count: 5,  when: '3 дня назад' },
  { query: 'MacBook Air M3 13"', emoji: '💻', count: 4,  when: '5 дней назад' },
  { query: 'Samsung Galaxy S24', emoji: '📱', count: 3,  when: 'неделю назад' },
];

function renderHead() {
  return `
    <div class="profile-head">
      <div class="profile-avatar">${USER.initials}</div>
      <div class="profile-info">
        <h1>${USER.name}</h1>
        <div class="email">${USER.email}</div>
        <div class="stats">
          <span class="stat"><b>${USER.trackedCount}</b> отслеживается</span>
          <span class="stat"><b>${USER.historyCount}</b> запросов</span>
        </div>
      </div>
    </div>
  `;
}

function renderSettings() {
  const rows = [
    { icon: '🔔', name: 'Уведомления',    desc: 'Порог снижения цены, каналы',     action: 'notifications' },
    { icon: '🎨', name: 'Оформление',     desc: 'Тема, язык',                      action: 'theme' },
    { icon: '🔒', name: 'Безопасность',   desc: 'Пароль, привязанные сервисы',     action: 'security' },
    { icon: '📤', name: 'Экспорт данных', desc: 'Скачать историю и отслеживаемые', action: 'export' },
    { icon: '⚙️', name: 'Все настройки',  desc: 'Оформление, уведомления, данные', action: 'settings' },
  ];

  const rowsHTML = rows.map(r => `
    <div class="setting-row" data-action="${r.action}">
      <div class="setting-icon">${r.icon}</div>
      <div class="setting-text">
        <div class="name">${r.name}</div>
        <div class="desc">${r.desc}</div>
      </div>
      <svg class="setting-arrow" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  `).join('');

  return `
    <div class="profile-section">
      <h2>Настройки</h2>
      <div class="settings-list">${rowsHTML}</div>
    </div>
  `;
}

function renderHistory() {
  if (SEARCH_HISTORY.length === 0) {
    return `
      <div class="profile-section">
        <h2>История поиска</h2>
        <div class="history-list" style="padding:32px;text-align:center;color:var(--text-2)">
          Пока ничего не искали
        </div>
      </div>
    `;
  }

  const rowsHTML = SEARCH_HISTORY.map(h => `
    <div class="history-row" data-query="${h.query}">
      <div class="history-icon">${h.emoji}</div>
      <div class="history-text">
        <div class="query">${h.query}</div>
        <div class="meta">${h.when}</div>
      </div>
      <span class="history-count">${h.count} раз</span>
    </div>
  `).join('');

  return `
    <div class="profile-section">
      <h2>История поиска</h2>
      <div class="history-list">${rowsHTML}</div>
    </div>
  `;
}

function renderDanger() {
  return `
    <div class="profile-section">
      <h2>Аккаунт</h2>
      <div class="settings-list">
        <div class="setting-row" data-action="logout">
          <div class="setting-icon">🚪</div>
          <div class="setting-text">
            <div class="name">Выйти из аккаунта</div>
            <div class="desc">Данные сохранятся в облаке</div>
          </div>
          <svg class="setting-arrow" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        <div class="setting-row" data-action="delete">
          <div class="setting-icon">🗑️</div>
          <div class="setting-text">
            <div class="name" style="color:var(--danger)">Удалить аккаунт</div>
            <div class="desc">Безвозвратно. Все данные будут удалены.</div>
          </div>
          <svg class="setting-arrow" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
               style="color:var(--danger)">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  `;
}

let _unbind = null;

export function render({ outlet }) {
  if (_unbind) { _unbind(); _unbind = null; }

  outlet.innerHTML = `
    <div class="profile">
      ${renderHead()}
      ${renderSettings()}
      ${renderHistory()}
      ${renderDanger()}
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  const container = document.querySelector('.profile');
  if (!container) return;

  const onClick = (e) => {
    const row = e.target.closest('.setting-row');
    if (row) {
      handleAction(row.dataset.action);
      return;
    }

    const historyRow = e.target.closest('.history-row');
    if (historyRow) {
      showToast(`Поиск: ${historyRow.dataset.query} (демо)`);
    }
  };

  container.addEventListener('click', onClick);

  _unbind = () => {
    container.removeEventListener('click', onClick);
  };
}

function handleAction(action) {
  switch (action) {
    case 'notifications':
      openNotificationsModal();
      break;
    case 'theme': {
      const next = toggleTheme();
      showToast(next === 'dark' ? 'Тёмная тема' : 'Светлая тема');
      break;
    }
    case 'security':
      showToast('Раздел в разработке');
      break;
    case 'export':
      showToast('Экспорт данных (демо)');
      break;
        case 'logout':
      confirm({
        title: 'Выйти из аккаунта?',
        message: 'Вы сможете войти снова в любой момент.',
        confirmText: 'Выйти',
        type: 'info',
        icon: '🚪',
      }).then((ok) => {
        if (ok) showToast('Вы вышли из аккаунта');
      });
      break;

    case 'delete':
      confirm({
        title: 'Удалить аккаунт?',
        message: 'Это действие нельзя отменить. Все данные, история поиска и отслеживаемые товары будут удалены навсегда.',
        confirmText: 'Удалить',
        type: 'danger',
      }).then((ok) => {
        if (ok) showToast('Аккаунт удалён (демо)');
      });
      break;
          case 'settings':
      Router.navigate('/settings');
      break;
  }
}