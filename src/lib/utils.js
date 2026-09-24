export function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

export function formatNumber(n) {
  return n.toLocaleString('ru-RU');
}

export function percentDiff(a, b) {
  return Math.round((a - b) / b * 100);
}

export function sortOffers(offers) {
  return [...offers].sort((a, b) => a.price - b.price);
}

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}