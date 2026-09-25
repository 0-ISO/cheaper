"""
Парсер Wildberries.

Использует публичный JSON-эндпоинт WB:
https://search.wb.ru/exactmatch/ru/common/v5/search

Не требует Selenium, прокси или авторизации.
"""
import httpx
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

WB_SEARCH_URL = "https://search.wb.ru/exactmatch/ru/common/v5/search"

# Заголовки — ведём себя как обычный браузер
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "Origin": "https://www.wildberries.ru",
    "Referer": "https://www.wildberries.ru/",
}

# Таймауты
TIMEOUT = httpx.Timeout(10.0, connect=5.0)


async def search_wb(query: str, limit: int = 30) -> List[Dict[str, Any]]:
    """
    Ищет товары на Wildberries.
    Возвращает список товаров в нормализованном виде.
    """
    if not query.strip():
        return []

    params = {
        "appType": "1",
        "curr": "rub",
        "dest": "-1257786",   # Москва
        "query": query,
        "resultset": "catalog",
        "sort": "popular",
        "spp": "30",
        "suppressSpellcheck": "false",
        "limit": str(limit),
    }

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT, headers=HEADERS) as client:
            response = await client.get(WB_SEARCH_URL, params=params)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as e:
        logger.warning(f"[WB] HTTP error: {e}")
        return []
    except Exception as e:
        logger.exception(f"[WB] Unexpected error: {e}")
        return []

    products_raw = data.get("data", {}).get("products", [])
    if not products_raw:
        logger.info(f"[WB] No products for query: {query}")
        return []

    result = []
    for p in products_raw[:limit]:
        normalized = _normalize_product(p)
        if normalized:
            result.append(normalized)

    logger.info(f"[WB] Found {len(result)} products for '{query}'")
    return result


def _normalize_product(p: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Превращает товар из формата WB в наш универсальный формат.

    Формат WB:
      - salePriceU: цена со скидкой в копейках
      - priceU: цена без скидки
      - sizes[0].price.product: реальная цена для пользователя (в копейках)
    """
    try:
        wb_id = p.get("id")
        if not wb_id:
            return None

        name = p.get("name", "").strip()
        brand = p.get("brand", "").strip()
        title = f"{brand} {name}".strip() if brand else name

        # Цена — приоритет: sizes[0].price.product → salePriceU → priceU
        price = None
        sizes = p.get("sizes") or []
        if sizes:
            price_block = sizes[0].get("price") or {}
            price = price_block.get("product")

        if not price:
            price = p.get("salePriceU")

        if not price:
            return None

        # WB отдаёт в копейках
        price_rub = int(price) // 100

        # Цена без скидки
        price_old = p.get("priceU")
        price_old_rub = int(price_old) // 100 if price_old else price_rub

        # Рейтинг — WB отдаёт 0-50 или 0-5 (зависит от версии)
        rating = p.get("reviewRating") or p.get("rating") or 0
        if rating > 5:
            rating = round(rating / 10, 1)
        else:
            rating = round(float(rating), 1)

        feedbacks = p.get("feedbacks") or 0

        # Ссылка на товар WB (для клика)
        url = f"https://www.wildberries.ru/catalog/{wb_id}/detail.aspx"

        return {
            "id": f"wb_{wb_id}",          # Префикс, чтобы не конфликтовать с другими mp
            "mp": "wb",
            "mp_id": wb_id,
            "title": title,
            "price": price_rub,
            "price_old": price_old_rub,
            "rating": rating,
            "reviews": feedbacks,
            "inStock": True,
            "url": url,
            "image": None,                # Позже добавим сборку URL картинки
        }
    except Exception as e:
        logger.debug(f"[WB] Failed to normalize product: {e}")
        return None
    # В конце wb.py добавь алиас:
async def search(query: str, limit: int = 20):
    return await search_wb(query, limit)