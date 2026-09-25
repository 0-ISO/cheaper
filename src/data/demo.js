// Демо-данные используются как fallback, если API недоступен.
// Основные данные приходят с бэкенда через /api/search и /api/products/:id.

export const MARKETPLACES = {
  ozon:   { id: 'ozon',   name: 'Ozon',        short: 'O' },
  wb:     { id: 'wb',     name: 'Wildberries', short: 'W' },
  dns:    { id: 'dns',    name: 'DNS',         short: 'D' },
  yandex: { id: 'yandex', name: 'Я.Маркет',    short: 'Я' },
  mvideo: { id: 'mvideo', name: 'М.Видео',     short: 'М' },   // ← НОВОЕ
};

export const PRODUCTS_FALLBACK = [
  {
    id: 1,
    emoji: '📱',
    title: 'Apple iPhone 15 128GB, чёрный',
    rating: 4.8,
    reviews: 1240,
    inStock: true,
    offers: [
      { mp: 'ozon',   price: 64990 },
      { mp: 'wb',     price: 67490 },
      { mp: 'dns',    price: 69990 },
      { mp: 'yandex', price: 66490 },
    ],
  },
];

export const PRICE_HISTORY = [
  70, 72, 68, 65, 63, 60, 58, 55, 57, 54,
  50, 48, 45, 47, 44, 42, 40, 38, 41, 39,
  36, 34, 32, 30,
];

export const TRACKED = [
  {
    id: 1,
    productId: 1,
    emoji: '📱',
    title: 'Apple iPhone 15 128GB, чёрный',
    tags: ['Ozon', 'WB', 'DNS'],
    currentPrice: 64990,
    startPrice: 70990,
    history: [70, 72, 71, 68, 67, 65, 66, 64, 63, 65, 64, 62, 63, 61, 60, 62, 61, 59, 60, 58, 60, 59, 61, 62],
  },
  {
    id: 2,
    productId: 3,
    emoji: '📱',
    title: 'Apple iPhone 15 256GB, чёрный',
    tags: ['Ozon', 'DNS'],
    currentPrice: 74990,
    startPrice: 72990,
    history: [73, 72, 71, 72, 74, 75, 73, 72, 74, 75, 76, 74, 73, 75, 76, 77, 75, 74, 76, 78, 77, 76, 75, 74],
  },
];

// Совместимость: поиск товара по ID
export function findProduct(id) {
  return PRODUCTS_FALLBACK.find(p => p.id === Number(id));
}