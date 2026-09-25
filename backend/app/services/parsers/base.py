"""
Базовые типы и утилиты для всех парсеров.

Единый формат товара:
{
    "id": "уникальный-id-внутри-магазина",     # например, "30074328"
    "mp": "mvideo",                             # id маркетплейса
    "mp_id": "30074328",                        # ID в магазине
    "title": "Смартфон Apple iPhone 16...",     # название
    "price": 79999,                             # цена в рублях
    "price_old": 104999,                        # цена до скидки (или = price)
    "rating": 4.75,                             # рейтинг 0-5
    "reviews": 71,                              # кол-во отзывов
    "inStock": True,                            # в наличии
    "url": "https://www.mvideo.ru/products/...",# ссылка на товар
    "image": "https://img.mvideo.ru/...",       # картинка
}
"""
from typing import TypedDict, Optional


class Product(TypedDict, total=False):
    id: str
    mp: str
    mp_id: str
    title: str
    price: int
    price_old: int
    rating: float
    reviews: int
    inStock: bool
    url: Optional[str]
    image: Optional[str]


def normalize_price(value) -> Optional[int]:
    """Приводит цену к int. Возвращает None, если пусто/невалидно."""
    if value is None:
        return None
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return None


def normalize_rating(value) -> float:
    """Приводит рейтинг к float 0-5."""
    if value is None:
        return 0.0
    try:
        r = float(value)
        # Если рейтинг 0-50 (WB) — делим на 10
        if r > 5:
            r = r / 10
        return round(min(max(r, 0), 5), 1)
    except (ValueError, TypeError):
        return 0.0


def normalize_reviews(value) -> int:
    """Приводит кол-во отзывов к int."""
    if value is None:
        return 0
    try:
        return max(int(value), 0)
    except (ValueError, TypeError):
        return 0