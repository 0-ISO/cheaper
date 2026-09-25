"""
Парсер DNS (dns-shop.ru) через curl_cffi + cookies.

Cookies qrator_ssid2 / qrator_jsid2 живут ~2-4 часа.
Когда протухнут — обновить из браузера.
"""
import httpx
import logging
from typing import List, Dict, Any

from curl_cffi.requests import AsyncSession

from app.services.parsers.base import (
    Product,
    normalize_price,
    normalize_rating,
    normalize_reviews,
)


logger = logging.getLogger(__name__)


MP_ID = "dns"

DNS_HOME = "https://www.dns-shop.ru/"
DNS_SEARCH_URL = "https://restapi.dns-shop.ru/v1/site/get-presearch-selection"
DNS_DEFAULT_CITY_ID = "2661002e-2db4-11e8-9dc5-00155d03330d"

# Cookies из браузера — обновлять при 403
DNS_COOKIES = (
    "qrator_ssid2=v2.0.1790250211.924.2ef20d6bYn93NHiF|6SniwfO3pJHHaI6o|cLSL/UXB2/jDAgTSbwx2LeBwhTdHUpabxoYyT03iJnpbc8+XT+TRnlLZjtpi0ZtP8vSxRgGZW8kRarYjJJ6Bgg==-Wx1Qq6DDphDtWy6EwgK1gpkX8mQ=; "
    "qrator_jsid2=v2.0.1790250210.891.2ef20d6bWBZeC0Ao|hmSOoemqAhgRRdvS|qmISwiU86kLsJj2DnU1Ar5K6Gbe80ayIFMEmzxRHtWjbn6hEOJdZrjxqpVbM66Qr5FxweOXtkc1qebORXxpxmezq+zM1Vm8LLYUf/kI3Zgi4vviaa+jTQbn1dERmtnZ5CgNyEtyMPR1ch6vXiViB2W6PPmWx3R0Lh85liY4wZbE=-TbSLS9MAtk1zDR8alcweceyPDSI="
)


async def search(query: str, limit: int = 20) -> List[Product]:
    """Ищет товары DNS. Возвращает список Product."""
    if not query.strip():
        return []

    url = f"{DNS_SEARCH_URL}?cityId={DNS_DEFAULT_CITY_ID}&query={query}"

    try:
        async with AsyncSession() as session:
            response = await session.get(
                url,
                impersonate="chrome",
                timeout=15,
                headers={
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "ru-RU,ru;q=0.9",
                    "Origin": "https://www.dns-shop.ru",
                    "Referer": "https://www.dns-shop.ru/",
                    "Cookie": DNS_COOKIES,
                },
            )

            if response.status_code != 200:
                logger.warning(f"[{MP_ID}] Status {response.status_code} для '{query}'")
                return []

            data = response.json()
    except Exception as e:
        logger.exception(f"[{MP_ID}] Request failed: {e}")
        return []

    raw = data.get("data", {}).get("products", [])
    if not raw:
        logger.info(f"[{MP_ID}] Пусто для '{query}'")
        return []

    products = []
    for item in raw[:limit]:
        normalized = _normalize(item)
        if normalized:
            products.append(normalized)

    logger.info(f"[{MP_ID}] Возвращаю {len(products)} товаров")
    return products


def _normalize(item: Dict[str, Any]) -> Product | None:
    """Превращает сырой товар DNS в Product."""
    product_id = item.get("productId")
    name = (item.get("productName") or "").strip()
    price = normalize_price(item.get("currentPrice"))

    if not product_id or not name or price is None:
        return None

    url = item.get("productUrl") or ""
    if url.startswith("/"):
        url = "https://www.dns-shop.ru" + url

    price_old = normalize_price(item.get("originalPrice")) or price

    return {
        "id": f"{MP_ID}_{product_id}",
        "mp": MP_ID,
        "mp_id": product_id,
        "title": name,
        "price": price,
        "price_old": price_old,
        "rating": 0,
        "reviews": 0,
        "inStock": item.get("isAvailable", True),
        "url": url,
        "image": item.get("imageUrl"),
    }