import { createModal } from '../lib/modal.js';

/**
 * Модалка подтверждения действия
 * @param {Object} opts
 * @param {string} opts.title       — заголовок
 * @param {string} opts.message     — текст под заголовком
 * @param {string} [opts.confirmText='Подтвердить'] — текст кнопки подтверждения
 * @param {string} [opts.cancelText='Отмена']       — текст кнопки отмены
 * @param {'danger'|'warning'|'info'} [opts.type='info'] — тип иконки и цвета
 * @param {string} [opts.icon]      — кастомная иконка (эмодзи)
 * @returns {Promise<boolean>}      — true если подтвердили
 */
export function confirm({
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  type = 'info',
  icon = null,
}) {
  return new Promise((resolve) => {
    const icons = {
      danger: '🗑️',
      warning: '⚠️',
      info: '❓',
    };
    const iconChar = icon || icons[type] || icons.info;

    const btnClass = type === 'danger' ? 'btn btn-danger' : 'btn btn-primary';

    const html = `
      <div class="confirm-body">
        <div class="confirm-icon ${type}">${iconChar}</div>
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
      <div class="confirm-footer">
        <button class="btn btn-ghost" id="confirmCancel" type="button">${cancelText}</button>
        <button class="${btnClass}" id="confirmOk" type="button">${confirmText}</button>
      </div>
    `;

    let resolved = false;
    const { overlay, close } = createModal(html, {
      onClose: () => {
        if (!resolved) {
          resolved = true;
          resolve(false);
        }
      },
    });

    overlay.querySelector('#confirmOk').addEventListener('click', () => {
      resolved = true;
      close();
      resolve(true);
    });

    overlay.querySelector('#confirmCancel').addEventListener('click', () => {
      resolved = true;
      close();
      resolve(false);
    });

    // Фокус на «Отмена» для безопасности (не случится случайный Enter)
    setTimeout(() => {
      const btn = overlay.querySelector('#confirmCancel');
      if (btn) btn.focus();
    }, 100);
  });
}