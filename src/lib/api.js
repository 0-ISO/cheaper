/**
 * Обёртка над API бэкенда.
 * Все запросы идут через Vite-proxy на /api → http://127.0.0.1:8000
 */

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Поиск товаров по запросу.
 * @param {string} query — поисковый запрос
 * @param {number} limit — максимум товаров
 * @returns {Promise<{query: string, count: number, source: string, products: Array}>}
 */
export async function search(query, limit = 20) {
  const q = encodeURIComponent(query || '');
  return request(`/search?q=${q}&limit=${limit}`);
}

/**
 * Детальная карточка товара.
 * @param {string|number} id — ID товара
 */
export async function getProduct(id) {
  return request(`/products/${id}`);
}

/**
 * Проверка здоровья API.
 */
export async function health() {
  return request('/health');
}