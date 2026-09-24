from typing import List, Dict, Any
from app.data.demo import PRODUCTS, PRODUCT_DETAILS
from app.services.parsers.wb import search_wb
from app.services.parsers.dns import search_dns
import logging

logger = logging.getLogger(__name__)


async def search_products(query: str, sources: List[str] = None) -> Dict[str, Any]:
    """
    Поиск товаров.

    Приоритет по умолчанию: DNS → WB → demo.
    """
    if not query:
        return {"products": PRODUCTS, "source": "demo"}

    if sources is None:
        sources = ["dns", "wb"]

    for source in sources:
        try:
            if source == "dns":
                products = await search_dns(query, limit=20)
            elif source == "wb":
                products = await search_wb(query, limit=20)
            else:
                continue

            if products:
                normalized = [_to_frontend(p, source) for p in products]
                logger.info(f"[search] Returning {len(normalized)} products from {source.upper()}")
                return {"products": normalized, "source": source}
            else:
                logger.info(f"[search] {source.upper()} returned nothing")
        except Exception as e:
            logger.exception(f"[search] {source.upper()} parser failed: {e}")

    logger.info(f"[search] All sources failed, using demo data")
    demo = _filter_demo(query)
    return {"products": demo, "source": "demo"}


def _to_frontend(item: Dict[str, Any], source: str) -> Dict[str, Any]:
    """
    Нормализованный товар → формат, который рендерит фронт.
    """
    mp = item.get("mp", source)

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
                "seller": {"dns": "DNS", "wb": "Wildberries"}.get(mp, mp.upper()),
                "rating": item.get("rating", 0),
                "url": item.get("url"),
            }
        ],
        "url": item.get("url"),
        "image": item.get("image"),
        "price_old": item.get("price_old"),
        "source": source,
    }


def _filter_demo(query: str) -> List[Dict[str, Any]]:
    """Fallback — демо-данные."""
    query_lower = query.lower()
    words = [w for w in query_lower.split() if len(w) > 1]
    if not words:
        return PRODUCTS

    def matches(product):
        text = product["title"].lower()
        return all(word in text for word in words)

    result = [p for p in PRODUCTS if matches(p)]
    return result if result else PRODUCTS


def get_product_detail(product_id: int) -> Dict[str, Any] | None:
    """Детальная карточка (пока только демо)."""
    return PRODUCT_DETAILS.get(product_id)