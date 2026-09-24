"""
Парсер DNS (dns-shop.ru).

Использует публичный эндпоинт get-presearch-selection.
curl_cffi эмулирует TLS-отпечаток Chrome, чтобы DNS не блокировал.
"""
from curl_cffi.requests import AsyncSession
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

DNS_SEARCH_URL = "https://restapi.dns-shop.ru/v1/site/get-presearch-selection"
DNS_DEFAULT_CITY_ID = "2661002e-2db4-11e8-9dc5-00155d03330d"


async def search_dns(
    query: str,
    limit: int = 30,
    city_id: str = DNS_DEFAULT_CITY_ID,
) -> List[Dict[str, Any]]:
    """Ищет товары в DNS. Возвращает нормализованный список."""
    if not query.strip():
        return []

    params = {
        "cityId": city_id,
        "query": query,
    }

    try:
        async with AsyncSession() as session:
            response = await session.get(
                DNS_SEARCH_URL,
                params=params,
                impersonate="chrome",   # ← магия здесь
                timeout=15,
                headers={
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "ru-RU,ru;q=0.9",
    "Origin": "https://www.dns-shop.ru",
    "Referer": "https://www.dns-shop.ru/",
    "Cookie": (
        "qrator_ssid2=v2.0.1790250211.924.2ef20d6bYn93NHiF|6SniwfO3pJHHaI6o|cLSL/UXB2/jDAgTSbwx2LeBwhTdHUpabxoYyT03iJnpbc8+XT+TRnlLZjtpi0ZtP8vSxRgGZW8kRarYjJJ6Bgg==-Wx1Qq6DDphDtWy6EwgK1gpkX8mQ=; "
        "qrator_jsid2=v2.0.1790250210.891.2ef20d6bWBZeC0Ao|hmSOoemqAhgRRdvS|qmISwiU86kLsJj2DnU1Ar5K6Gbe80ayIFMEmzxRHtWjbn6hEOJdZrjxqpVbM66Qr5FxweOXtkc1qebORXxpxmezq+zM1Vm8LLYUf/kI3Zgi4vviaa+jTQbn1dERmtnZ5CgNyEtyMPR1ch6vXiViB2W6PPmWx3R0Lh85liY4wZbE=-TbSLS9MAtk1zDR8alcweceyPDSI="
    ),
},
            )
            if response.status_code != 200:
                logger.warning(f"[DNS] Status {response.status_code} for '{query}'")
                return []
            data = response.json()
    except Exception as e:
        logger.exception(f"[DNS] Request failed: {e}")
        return []

    products = data.get("data", {}).get("products", [])
    if not products:
        logger.info(f"[DNS] No products for query: {query}")
        return []

    result = []
    for p in products[:limit]:
        normalized = _normalize_product(p)
        if normalized:
            result.append(normalized)

    logger.info(f"[DNS] Found {len(result)} products for '{query}'")
    return result


def _normalize_product(p: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Приводим товар DNS к нашему универсальному формату."""
    product_id = p.get("productId")
    name = (p.get("productName") or "").strip()
    price = p.get("currentPrice")

    if not product_id or not name or price is None:
        return None

    url = p.get("productUrl") or ""
    if url.startswith("/"):
        url = "https://www.dns-shop.ru" + url

    price_old = p.get("originalPrice") or price
    is_available = p.get("isAvailable", True)

    return {
        "id": f"dns_{product_id}",
        "mp": "dns",
        "mp_id": product_id,
        "title": name,
        "price": int(price),
        "price_old": int(price_old),
        "rating": 0,
        "reviews": 0,
        "inStock": is_available,
        "url": url,
        "image": p.get("imageUrl"),
    }