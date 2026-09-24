import { storage } from '../lib/storage.js';
import { apply as applyTheme, toggle as toggleTheme } from '../lib/theme.js';
import { showToast } from '../lib/toast.js';
import { openNotificationsModal, loadNotificationSettings } from '../components/notifications.js';
import { confirm } from '../components/confirm.js';
import { resetOnboarding, showOnboarding } from '../components/onboarding.js';

const TABS = [
  { id: 'appearance', icon: '🎨', label: 'Оформление' },
  { id: 'notifications', icon: '🔔', label: 'Уведомления' },
  { id: 'account', icon: '👤', label: 'Аккаунт' },
  { id: 'data', icon: '💾', label: 'Данные' },
];

let activeTab = 'appearance';
let _unbind = null;

function getTheme() {
  return storage.get('theme') || 'auto';
}

function getLanguage() {
  return storage.get('language') || 'ru';
}

function getNotifSummary() {
  const s = loadNotificationSettings();
  const channels = Object.entries(s.channels)
    .filter(([, on]) => on)
    .map(([id]) => ({ push: 'Push', email: 'Email', telegram: 'Telegram' }[id]))
    .join(', ');
  return {
    threshold: s.threshold,
    channels: channels || 'Не выбрано',
  };
}

function renderAppearancePanel() {
  const current = getTheme();
  const lang = getLanguage();

  return `
    <div class="panel-card">
      <h3>Тема</h3>
      <p>Выберите, как выглядит интерфейс</p>

      <div class="theme-options">
        <div class="theme-option ${current === 'light' ? 'active' : ''}" data-theme-choice="light">
          <div class="preview preview-light"></div>
          <div class="label">Светлая</div>
        </div>
        <div class="theme-option ${current === 'dark' ? 'active' : ''}" data-theme-choice="dark">
          <div class="preview preview-dark"></div>
          <div class="label">Тёмная</div>
        </div>
        <div class="theme-option ${current === 'auto' ? 'active' : ''}" data-theme-choice="auto">
          <div class="preview preview-auto"></div>
          <div class="label">Как в системе</div>
        </div>
      </div>
    </div>

    <div class="panel-card">
      <h3>Язык</h3>
      <p>Язык интерфейса (в разработке)</p>

      <div class="lang-options">
        <button class="lang-option ${lang === 'ru' ? 'active' : ''}" data-lang="ru" type="button">🇷🇺 Русский</button>
        <button class="lang-option ${lang === 'en' ? 'active' : ''}" data-lang="en" type="button">🇬🇧 English</button>
      </div>
    </div>

    <div class="panel-card">
      <h3>Компактный режим</h3>
      <p>Меньше отступов — больше контента на экране</p>
      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Плотная компоновка</div>
          <div class="desc">Уменьшает отступы в списках</div>
        </div>
        <button class="toggle" data-toggle="compact" type="button"></button>
      </div>
    </div>
  `;
}

function renderNotificationsPanel() {
  const s = getNotifSummary();

  return `
    <div class="panel-card">
      <h3>Уведомления о снижении цены</h3>
      <p>Когда присылать уведомления</p>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Порог снижения</div>
          <div class="desc">Уведомим, если цена упадёт на ${s.threshold}% или больше</div>
        </div>
        <button class="btn btn-ghost" id="openNotifBtn" type="button">Настроить</button>
      </div>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Активные каналы</div>
          <div class="desc">${s.channels}</div>
        </div>
        <button class="btn btn-ghost" id="openNotifBtn2" type="button">Изменить</button>
      </div>
    </div>

    <div class="panel-card">
      <h3>Дополнительно</h3>
      <p>Тонкая настройка поведения</p>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Только мои отслеживаемые</div>
          <div class="desc">Не присылать уведомления о других товарах</div>
        </div>
        <button class="toggle on" data-toggle="only-tracked" type="button"></button>
      </div>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Дайджест раз в неделю</div>
          <div class="desc">Краткий обзор изменений цен по понедельникам</div>
        </div>
        <button class="toggle" data-toggle="weekly-digest" type="button"></button>
      </div>
    </div>
  `;
}

function renderAccountPanel() {
  const user = {
    name: 'Иван Петров',
    email: 'ivan@example.com',
  };

  return `
    <div class="panel-card">
      <h3>Профиль</h3>
      <p>Основная информация</p>

      <div class="form-row" style="display:block">
        <div class="form-row-info" style="margin-bottom:10px">
          <div class="name">Имя</div>
        </div>
        <input class="input-field" type="text" value="${user.name}" />
      </div>

      <div class="form-row" style="display:block">
        <div class="form-row-info" style="margin-bottom:10px">
          <div class="name">Email</div>
          <div class="desc">Используется для уведомлений</div>
        </div>
        <input class="input-field" type="email" value="${user.email}" />
      </div>
    </div>

    <div class="panel-card">
      <h3>Безопасность</h3>
      <p>Пароль и вход</p>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Сменить пароль</div>
          <div class="desc">Последнее изменение — 3 месяца назад</div>
        </div>
        <button class="btn btn-ghost" type="button">Сменить</button>
      </div>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Двухфакторная аутентификация</div>
          <div class="desc">Дополнительная защита входа</div>
        </div>
        <button class="toggle" data-toggle="2fa" type="button"></button>
      </div>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Активные сессии</div>
          <div class="desc">2 устройства</div>
        </div>
        <button class="btn btn-ghost" type="button">Посмотреть</button>
      </div>
    </div>

    <div class="panel-card">
      <h3>Выход</h3>
      <p>Завершить сессию на этом устройстве</p>
      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Выйти из аккаунта</div>
          <div class="desc">Данные сохранятся в облаке</div>
        </div>
        <button class="btn btn-ghost" data-action="logout" type="button">Выйти</button>
      </div>
    </div>
  `;
}

function renderDataPanel() {
  const usedMb = 2.4;
  const totalMb = 50;
  const percent = Math.round(usedMb / totalMb * 100);

  return `
    <div class="panel-card">
      <h3>Хранилище</h3>
      <p>Локальные данные приложения</p>

      <div class="storage-bar">
        <div class="storage-fill" style="width:${percent}%"></div>
      </div>
      <div class="storage-meta">
        <span>${usedMb} МБ использовано</span>
        <span>${totalMb} МБ доступно</span>
      </div>

      <div class="form-row" style="margin-top:16px">
        <div class="form-row-info">
          <div class="name">Кэш поисков</div>
          <div class="desc">История запросов и результаты</div>
        </div>
        <button class="btn btn-ghost" data-action="clear-cache" type="button">Очистить</button>
      </div>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">История цен</div>
          <div class="desc">Сохранённые графики за 90 дней</div>
        </div>
        <button class="btn btn-ghost" data-action="clear-history" type="button">Очистить</button>
      </div>
    </div>

    <div class="panel-card">
      <h3>Экспорт</h3>
      <p>Сохраните свои данные</p>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Отслеживаемые товары</div>
          <div class="desc">Список в CSV или JSON</div>
        </div>
        <button class="btn btn-ghost" data-action="export" type="button">Экспорт</button>
      </div>

      <div class="form-row">
        <div class="form-row-info">
          <div class="name">История поиска</div>
          <div class="desc">Все ваши запросы</div>
        </div>
        <button class="btn btn-ghost" data-action="export" type="button">Экспорт</button>
      </div>
    </div>

    <div class="panel-card">
      <h3>Онбординг</h3>
      <p>Показать обучающие слайды снова</p>
      <div class="form-row">
        <div class="form-row-info">
          <div class="name">Показать вводный экран</div>
          <div class="desc">3 слайда о том, как всё работает</div>
        </div>
        <button class="btn btn-ghost" data-action="reset-onboarding" type="button">Показать</button>
      </div>
    </div>

    <div class="panel-card">
      <h3>Опасная зона</h3>
      <p>Действия, которые нельзя отменить</p>

      <div class="danger-action">
        <div class="icon">⚠️</div>
        <div class="text">
          <div class="name">Удалить все данные</div>
          <div class="desc">Сбросит настройки, историю и отслеживаемые</div>
        </div>
        <button class="btn btn-danger" data-action="wipe" type="button">Удалить</button>
      </div>
    </div>
  `;
}

function renderPanel(tab) {
  switch (tab) {
    case 'appearance': return renderAppearancePanel();
    case 'notifications': return renderNotificationsPanel();
    case 'account': return renderAccountPanel();
    case 'data': return renderDataPanel();
    default: return '';
  }
}

export function render({ outlet }) {
  if (_unbind) { _unbind(); _unbind = null; }

  const tabsHTML = TABS.map(t => `
    <button class="settings-tab ${t.id === activeTab ? 'active' : ''}"
            data-tab="${t.id}" type="button">
      <span class="tab-icon">${t.icon}</span>
      <span>${t.label}</span>
    </button>
  `).join('');

  outlet.innerHTML = `
    <div class="settings-page page-enter">
      <div class="settings-header">
        <h1>Настройки</h1>
        <p>Персонализация и управление данными</p>
      </div>

      <div class="settings-tabs" id="settingsTabs">${tabsHTML}</div>

      <div class="settings-content" id="settingsContent">
        <div class="settings-panel active">${renderPanel(activeTab)}</div>
      </div>
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  const tabsEl = document.getElementById('settingsTabs');
  const contentEl = document.getElementById('settingsContent');
  if (!tabsEl || !contentEl) return;

  // Переключение вкладок
  const onTabsClick = (e) => {
    const tab = e.target.closest('[data-tab]');
    if (!tab) return;
    const id = tab.dataset.tab;
    if (id === activeTab) return;
    activeTab = id;

    tabsEl.querySelectorAll('.settings-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === id);
    });

    contentEl.innerHTML = `<div class="settings-panel active">${renderPanel(id)}</div>`;
  };

  // Клики внутри панели
  const onContentClick = async (e) => {
    // Тема
    const themeOpt = e.target.closest('[data-theme-choice]');
    if (themeOpt) {
      const choice = themeOpt.dataset.themeChoice;
      const list = contentEl.querySelectorAll('[data-theme-choice]');
      list.forEach(t => t.classList.toggle('active', t.dataset.themeChoice === choice));

      if (choice === 'auto') {
        storage.remove('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
      } else {
        applyTheme(choice);
        storage.set('theme', choice);
      }
      showToast(choice === 'auto' ? 'Как в системе' : choice === 'dark' ? 'Тёмная тема' : 'Светлая тема');
      return;
    }

    // Язык
    const langOpt = e.target.closest('[data-lang]');
    if (langOpt) {
      const lang = langOpt.dataset.lang;
      contentEl.querySelectorAll('[data-lang]').forEach(l =>
        l.classList.toggle('active', l.dataset.lang === lang)
      );
      storage.set('language', lang);
      showToast(`Язык: ${lang === 'ru' ? 'Русский' : 'English'} (демо)`);
      return;
    }

    // Toggles
    const toggle = e.target.closest('[data-toggle]');
    if (toggle) {
      toggle.classList.toggle('on');
      return;
    }

    // Уведомления
    if (e.target.closest('#openNotifBtn') || e.target.closest('#openNotifBtn2')) {
      openNotificationsModal();
      // После закрытия — перерисуем панель, чтобы обновить саммари
      setTimeout(() => {
        if (activeTab === 'notifications') {
          contentEl.innerHTML = `<div class="settings-panel active">${renderPanel(activeTab)}</div>`;
        }
      }, 300);
      return;
    }

    // Действия
    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      handleAction(actionEl.dataset.action);
    }
  };

  tabsEl.addEventListener('click', onTabsClick);
  contentEl.addEventListener('click', onContentClick);

  _unbind = () => {
    tabsEl.removeEventListener('click', onTabsClick);
    contentEl.removeEventListener('click', onContentClick);
  };
}

async function handleAction(action) {
  switch (action) {
    case 'logout': {
      const ok = await confirm({
        title: 'Выйти из аккаунта?',
        message: 'Вы сможете войти снова в любой момент. Данные сохранятся в облаке.',
        confirmText: 'Выйти',
        type: 'info',
        icon: '🚪',
      });
      if (ok) showToast('Вы вышли из аккаунта');
      break;
    }

    case 'clear-cache':
      showToast('Кэш очищен');
      break;

    case 'clear-history':
      showToast('История очищена');
      break;

    case 'export':
      showToast('Экспорт данных (демо)');
      break;

    case 'reset-onboarding':
      resetOnboarding();
      showOnboarding();
      break;

    case 'wipe': {
      const ok = await confirm({
        title: 'Удалить все данные?',
        message: 'Настройки, история поиска и отслеживаемые товары будут удалены безвозвратно. Это действие нельзя отменить.',
        confirmText: 'Удалить всё',
        type: 'danger',
      });
      if (ok) {
        storage.remove('theme');
        storage.remove('notif-settings');
        storage.remove('language');
        storage.remove('onboarding-seen');
        showToast('Все данные удалены');
        setTimeout(() => location.reload(), 800);
      }
      break;
    }
  }
}