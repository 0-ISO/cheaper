"""
Оркестратор поиска.

Пробует источники по очереди, пока один не вернёт товары.
Порядок: MVideo → DNS → WB → demo.
"""
import logging
from typing import List, Dict, Any

from app.data.demo import PRODUCTS, PRODUCT_DETAILS
from app.services.parsers import mvideo, dns, wb


logger = logging.getLogger(__name__)


PARSERS = {
    "mvideo": mvideo,
    "dns": dns,
    "wb": wb,
}

SOURCE_ORDER = ["mvideo", "dns", "wb"]


async def search_products(query: str, sources: List[str] = None) -> Dict[str, Any]:
    """Поиск товаров по всем источникам."""
    if not query or not query.strip():
        return {"products": PRODUCTS, "source": "demo"}

    source_list = sources if sources else SOURCE_ORDER

    for source in source_list:
        parser = PARSERS.get(source)
        if not parser:
            continue

        logger.info(f"[search] Пробую {source.upper()}")

        try:
            items = await parser.search(query, limit=20)
        except Exception as e:
            logger.exception(f"[search] {source.upper()} упал: {e}")
            continue

        if not items:
            logger.info(f"[search] {source.upper()} вернул пусто")
            continue

        normalized = [_to_frontend(p) for p in items]
        logger.info(f"[search] ✓ УСПЕХ: {len(normalized)} товаров из {source.upper()}")
        return {"products": normalized, "source": source}

    logger.warning("[search] Все источники упали, отдаю demo")
    return {"products": _filter_demo(query), "source": "demo"}


def _to_frontend(item: Dict[str, Any]) -> Dict[str, Any]:
    """Product → формат фронта."""
    mp = item["mp"]
    seller_names = {
        "dns": "DNS",
        "wb": "Wildberries",
        "mvideo": "М.Видео",
        "ozon": "Ozon",
        "yandex": "Я.Маркет",
    }

    return {
        "id": item["mp_id"],
        "emoji": "📦",
        "title": item["title"],
        "rating": item.get("rating", 0),
        "reviews": item.get("reviews", 0),
        "inStock": item.get("inStock", True),
        "offers": [
            {
                "mp": mp,
                "price": item["price"],
                "delivery": None,
                "seller": seller_names.get(mp, mp.upper()),
                "rating": item.get("rating", 0),
                "url": item.get("url"),
            }
        ],
        "url": item.get("url"),
        "image": item.get("image"),
        "price_old": item.get("price_old"),
        "source": mp,
    }


def _filter_demo(query: str) -> List[Dict[str, Any]]:
    """Fallback — фильтруем демо по запросу."""
    words = [w for w in query.lower().strip().split() if len(w) > 1]
    if not words:
        return PRODUCTS

    def matches(p):
        text = p["title"].lower()
        return all(w in text for w in words)

    result = [p for p in PRODUCTS if matches(p)]
    return result if result else PRODUCTS


def get_product_detail(product_id: int) -> Dict[str, Any] | None:
    """Детальная карточка (демо)."""
    return PRODUCT_DETAILS.get(product_id)