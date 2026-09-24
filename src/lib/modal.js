let activeOverlay = null;
let keyHandler = null;

export function createModal(contentHTML, options = {}) {
  const { wide = false, onClose = null } = options;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true">
      ${contentHTML}
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => overlay.classList.add('open'));

  const close = () => {
    overlay.classList.remove('open');
    document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.remove();
      if (activeOverlay === overlay) activeOverlay = null;
      if (typeof onClose === 'function') onClose();
    }, 200);
  };

  keyHandler = (e) => {
    if (e.key === 'Escape') close();
  };
  document.addEventListener('keydown', keyHandler);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target.closest('[data-modal-close]')) close();
  });

  activeOverlay = { overlay, close };
  return { overlay, close };
}

export function closeActiveModal() {
  if (activeOverlay) activeOverlay.close();
}