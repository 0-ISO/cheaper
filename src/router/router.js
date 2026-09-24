const routes = [];
let current = null;
let outlet = null;

function parse(hash) {
  const path = (hash || '').replace(/^#/, '') || '/';
  return { path };
}

function matchRoute(pattern, path) {
  const pParts = pattern.split('/').filter(Boolean);
  const uParts = path.split('/').filter(Boolean);
  if (pParts.length !== uParts.length) return null;

  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) {
      params[pParts[i].slice(1)] = decodeURIComponent(uParts[i]);
    } else if (pParts[i] !== uParts[i]) {
      return null;
    }
  }
  return params;
}

function match(path) {
  for (const r of routes) {
    const params = matchRoute(r.pattern, path);
    if (params) return { route: r, params };
  }
  return null;
}

export function register(pattern, handler) {
  routes.push({ pattern, handler });
}

function updateActiveNav(path) {
  document.querySelectorAll('[data-route]').forEach(el => {
    const r = el.dataset.route;
    el.classList.toggle('active', r === path);
  });
}

async function render() {
  const { path } = parse(location.hash);
  const m = match(path);

  if (!outlet) return;

  try {
    if (current && current.destroy) current.destroy();
    outlet.innerHTML = '';
    current = m ? m.route : null;
    updateActiveNav(path);

    if (m) {
      await m.route.handler({ outlet, params: m.params, path });
    } else {
      // Ленивая загрузка 404 — не тянем в основной бандл
      const { render: render404 } = await import('../pages/not-found.js');
      await render404({ outlet, params: {}, path });
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  } catch (err) {
    console.error('[Router] render error:', err);
    outlet.innerHTML = `
      <div class="container" style="padding:80px 24px;text-align:center">
        <h1 style="font-size:32px;margin-bottom:12px">Ошибка</h1>
        <p style="color:var(--text-2)">${err.message}</p>
      </div>`;
  }
}

export function init(appOutlet) {
  outlet = appOutlet;
  window.addEventListener('hashchange', render);
  render();
}

export function navigate(path) {
  const target = '#' + path;
  if (location.hash === target) return;
  location.hash = target;
}