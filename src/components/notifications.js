import { createModal } from '../lib/modal.js';
import { showToast } from '../lib/toast.js';
import { storage } from '../lib/storage.js';

const STORAGE_KEY = 'notif-settings';

const DEFAULTS = {
  threshold: 10,
  channels: {
    push: true,
    email: true,
    telegram: false,
  },
};

export function loadNotificationSettings() {
  const saved = storage.get(STORAGE_KEY);
  if (saved && typeof saved === 'object') {
    return {
      threshold: saved.threshold ?? DEFAULTS.threshold,
      channels: { ...DEFAULTS.channels, ...(saved.channels || {}) },
    };
  }
  return JSON.parse(JSON.stringify(DEFAULTS));
}

function save(settings) {
  storage.set(STORAGE_KEY, settings);
}

function skeletonContent() {
  return `
    <div class="modal-header">
      <div>
        <div class="skeleton-box" style="height:22px;width:180px;margin-bottom:6px"></div>
        <div class="skeleton-box" style="height:14px;width:260px"></div>
      </div>
    </div>
    <div class="modal-body">
      <div class="skeleton-box" style="height:16px;width:200px;margin-bottom:12px"></div>
      <div class="skeleton-box" style="height:80px;border-radius:12px;margin-bottom:20px"></div>
      <div class="skeleton-box" style="height:16px;width:160px;margin-bottom:12px"></div>
      ${Array.from({ length: 3 }, () => `
        <div class="skeleton-box" style="height:60px;border-radius:12px;margin-bottom:8px"></div>
      `).join('')}
    </div>
  `;
}

function renderContent(settings) {
  const thresholds = [5, 10, 15, 20];

  const thresholdHTML = thresholds.map(t => `
    <button class="threshold-tab ${t === settings.threshold ? 'active' : ''}"
            data-threshold="${t}" type="button">
      <div class="pct">${t}%</div>
      <div class="label">${t === 5 ? 'мин.' : t === 20 ? 'макс.' : ''}</div>
    </button>
  `).join('');

  const channels = [
    { id: 'push',     icon: '🔔', name: 'Push-уведомления', desc: 'В браузере, если открыт сайт' },
    { id: 'email',    icon: '📧', name: 'Email',            desc: 'Письмо на привязанную почту' },
    { id: 'telegram', icon: '✈️', name: 'Telegram',         desc: 'Сообщение в боте @cenomer_bot' },
  ];

  const channelsHTML = channels.map(c => `
    <label class="channel">
      <span class="channel-icon">${c.icon}</span>
      <span class="channel-info">
        <span class="name">${c.name}</span>
        <span class="desc">${c.desc}</span>
      </span>
      <button class="toggle ${settings.channels[c.id] ? 'on' : ''}"
              data-channel="${c.id}" type="button"
              aria-label="Переключить ${c.name}"></button>
    </label>
  `).join('');

  return `
    <div class="modal-header">
      <div>
        <h2>Уведомления</h2>
        <div class="sub">Настроим, когда и как сообщать о снижении цены</div>
      </div>
      <button class="modal-close" data-modal-close type="button" aria-label="Закрыть">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <div class="notif-section">
        <div class="notif-section-head">
          <div>
            <h3>Порог снижения цены</h3>
            <p>Уведомим, если цена упадёт на выбранный процент или больше</p>
          </div>
        </div>
        <div class="threshold-tabs" id="thresholdTabs">${thresholdHTML}</div>
        <div class="threshold-hint">
          <span class="icon">💡</span>
          <span>Чем ниже порог, тем больше уведомлений. Оптимально — 10%.</span>
        </div>
      </div>

      <div class="notif-section">
        <div class="notif-section-head">
          <div>
            <h3>Каналы доставки</h3>
            <p>Выберите, куда присылать уведомления</p>
          </div>
        </div>
        <div class="channel-list" id="channelList">${channelsHTML}</div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-ghost" data-modal-close type="button">Отмена</button>
      <button class="btn btn-primary" id="notifSave" type="button">Сохранить</button>
    </div>
  `;
}

export function openNotificationsModal() {
  const { overlay, close } = createModal(skeletonContent());

  // Имитация загрузки — 400мс
  setTimeout(() => {
    if (!overlay.isConnected) return;

    const settings = loadNotificationSettings();
    const modal = overlay.querySelector('.modal');
    if (modal) modal.innerHTML = renderContent(settings);

    // Порог
    const tabs = overlay.querySelectorAll('.threshold-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        settings.threshold = Number(tab.dataset.threshold);
      });
    });

    // Каналы
    const channels = overlay.querySelectorAll('[data-channel]');
    channels.forEach(ch => {
      ch.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = ch.dataset.channel;
        settings.channels[id] = !settings.channels[id];
        ch.classList.toggle('on', settings.channels[id]);
      });
    });

    // Сохранить
    const saveBtn = overlay.querySelector('#notifSave');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        save(settings);
        close();
        showToast('Настройки уведомлений сохранены');
      });
    }
  }, 400);
}