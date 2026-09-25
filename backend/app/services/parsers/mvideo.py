"""
Парсер М.Видео (mvideo.ru).

3 запроса:
1. GET  /bff/products/v2/search        → ID товаров
2. POST /bff/product-details/list      → название, рейтинг, картинка
3. GET  /bff/products/prices           → цены
"""
import httpx
import logging
from typing import List, Dict, Any

from app.services.parsers.base import (
    Product,
    normalize_price,
    normalize_rating,
    normalize_reviews,
)


logger = logging.getLogger(__name__)


MP_ID = "mvideo"

MV_BASE = "https://www.mvideo.ru"
MV_SEARCH_URL = f"{MV_BASE}/bff/products/v2/search"
MV_DETAILS_URL = f"{MV_BASE}/bff/product-details/list"
MV_PRICES_URL = f"{MV_BASE}/bff/products/prices"
MV_IMAGE_BASE = "https://img.mvideo.ru/"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/130.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "ru-RU,ru;q=0.9",
    "Origin": MV_BASE,
    "Referer": MV_BASE + "/",
    "Cookie": (
        "MVID_CITY_ID=CityCZ_975; "
        "MVID_REGION_ID=1; "
        "MVID_REGION_SHOP=S002; "
        "MVID_TIMEZONE_OFFSET=3; "
        "bIPs=; JSESSIONID=; MVID_GUEST_ID="
    ),
}

TIMEOUT = httpx.Timeout(15.0, connect=5.0)


async def search(query: str, limit: int = 20) -> List[Product]:
    """Главная функция — вызывается из search.py."""
    if not query.strip():
        return []

    async with httpx.AsyncClient(timeout=TIMEOUT, headers=HEADERS) as client:
        ids = await _search_ids(client, query, limit)
        if not ids:
            return []

        details = await _get_details(client, ids)
        if not details:
            return []

        prices = await _get_prices(client, ids)

    products = []
    for item in details:
        pid = str(item.get("productId", ""))
        normalized = _normalize(item, prices.get(pid, {}))
        if normalized:
            products.append(normalized)

    logger.info(f"[{MP_ID}] Возвращаю {len(products)} товаров")
    return products


async def _search_ids(client: httpx.AsyncClient, query: str, limit: int) -> List[str]:
    params = {"query": query, "limit": str(min(limit, 30)), "offset": "0"}
    try:
        r = await client.get(MV_SEARCH_URL, params=params)
        if r.status_code != 200:
            logger.warning(f"[{MP_ID}] search HTTP {r.status_code}")
            return []
        data = r.json()
        ids = data.get("body", {}).get("products", [])
        logger.info(f"[{MP_ID}] Получил {len(ids)} ID")
        return ids
    except Exception as e:
        logger.exception(f"[{MP_ID}] search failed: {e}")
        return []


async def _get_details(client: httpx.AsyncClient, ids: List[str]) -> List[Dict[str, Any]]:
    try:
        r = await client.post(MV_DETAILS_URL, json={"productIds": ids})
        if r.status_code != 200:
            logger.warning(f"[{MP_ID}] details HTTP {r.status_code}")
            return []
        data = r.json()
        products = data.get("body", {}).get("products", [])
        logger.info(f"[{MP_ID}] Получил детали для {len(products)} товаров")
        return products
    except Exception as e:
        logger.exception(f"[{MP_ID}] details failed: {e}")
        return []


async def _get_prices(client: httpx.AsyncClient, ids: List[str]) -> Dict[str, Dict[str, Any]]:
    try:
        r = await client.get(MV_PRICES_URL, params={"productIds": ",".join(ids)})
        if r.status_code != 200:
            logger.warning(f"[{MP_ID}] prices HTTP {r.status_code}")
            return {}
        data = r.json()
        material_prices = data.get("body", {}).get("materialPrices", [])
        logger.info(f"[{MP_ID}] Получил цены для {len(material_prices)} товаров")

        result = {}
        for item in material_prices:
            pid = str(item.get("productId", ""))
            price_block = item.get("price", {})
            if pid and price_block:
                result[pid] = {
                    "salePrice": price_block.get("salePrice"),
                    "basePrice": price_block.get("basePrice"),
                }
        return result
    except Exception as e:
        logger.exception(f"[{MP_ID}] prices failed: {e}")
        return {}


def _normalize(item: Dict[str, Any], price_data: Dict[str, Any]) -> Product | None:
    """Превращает сырой товар М.Видео + цену в Product."""
    mv_id = item.get("productId")
    name = (item.get("name") or "").strip()
    if not mv_id or not name:
        return None

    price = normalize_price(price_data.get("salePrice"))
    price_old = normalize_price(price_data.get("basePrice")) or price

    if price is None:
        logger.debug(f"[{MP_ID}] Нет цены для {mv_id}")
        return None

    rating_block = item.get("rating") or {}
    rating = normalize_rating(rating_block.get("star") if isinstance(rating_block, dict) else 0)
    reviews = normalize_reviews(rating_block.get("count") if isinstance(rating_block, dict) else 0)

    slug = item.get("nameTranslit") or ""
    url = f"{MV_BASE}/products/{mv_id}/{slug}" if slug else f"{MV_BASE}/products/{mv_id}"

    image = item.get("image")
    if image and not image.startswith("http"):
        image = MV_IMAGE_BASE + image

    return {
        "id": f"{MP_ID}_{mv_id}",
        "mp": MP_ID,
        "mp_id": str(mv_id),
        "title": name,
        "price": price,
        "price_old": price_old,
        "rating": rating,
        "reviews": reviews,
        "inStock": not item.get("isPreorder", False),
        "url": url,
        "image": image,
    }