export const MARKETPLACES = {
  ozon:   { id: 'ozon',   name: 'Ozon',        short: 'O' },
  wb:     { id: 'wb',     name: 'Wildberries', short: 'W' },
  dns:    { id: 'dns',    name: 'DNS',         short: 'D' },
  yandex: { id: 'yandex', name: 'Я.Маркет',    short: 'Я' },
};

export const PRODUCTS = [
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
  {
    id: 2,
    emoji: '📱',
    title: 'Apple iPhone 15 128GB, синий',
    rating: 4.7,
    reviews: 862,
    inStock: true,
    offers: [
      { mp: 'wb',     price: 65990 },
      { mp: 'ozon',   price: 66990 },
      { mp: 'yandex', price: 68490 },
    ],
  },
  {
    id: 3,
    emoji: '📱',
    title: 'Apple iPhone 15 256GB, чёрный',
    rating: 4.9,
    reviews: 2140,
    inStock: true,
    offers: [
      { mp: 'ozon', price: 74990 },
      { mp: 'dns',  price: 76990 },
      { mp: 'wb',   price: 77990 },
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
  {
    id: 3,
    productId: 2,
    emoji: '📱',
    title: 'Apple iPhone 15 128GB, синий',
    tags: ['WB', 'Я.Маркет'],
    currentPrice: 65990,
    startPrice: 65990,
    history: [66, 66, 65, 66, 66, 65, 66, 66, 65, 66, 66, 65, 66, 66, 65, 66, 66, 65, 66, 66, 65, 66, 66, 66],
  },
];

export const PRODUCT_DETAILS = {
  1: {
    id: 1,
    emoji: '📱',
    title: 'Apple iPhone 15 128GB, чёрный',
    rating: 4.8,
    reviews: 1240,
    inStock: true,
    gallery: ['📱', '📲', '🔋', '📦'],
    specs: {
      'Бренд': 'Apple',
      'Модель': 'iPhone 15',
      'Память': '128 ГБ',
      'Цвет': 'Чёрный',
      'Экран': '6.1" OLED',
      'Процессор': 'A16 Bionic',
      'Камера': '48 МП + 12 МП',
      'Аккумулятор': '3349 мА·ч',
    },
    offers: [
      { mp: 'ozon',   price: 64990, delivery: 'Завтра',      seller: 'Ozon',    rating: 4.9 },
      { mp: 'yandex', price: 66490, delivery: 'Послезавтра', seller: 'М.Видео', rating: 4.7 },
      { mp: 'wb',     price: 67490, delivery: '1–2 дня',     seller: 'WB',      rating: 4.6 },
      { mp: 'dns',    price: 69990, delivery: 'Сегодня',     seller: 'DNS',     rating: 4.8 },
    ],
    history: [70, 72, 68, 65, 63, 60, 58, 55, 57, 54, 50, 48, 45, 47, 44, 42, 40, 38, 41, 39, 36, 34, 32, 30],
  },
};

export function findProduct(id) {
  const numericId = Number(id);
  return PRODUCT_DETAILS[numericId] || PRODUCTS.find(p => p.id === numericId);
}