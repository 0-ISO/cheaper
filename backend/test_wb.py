"""Тест WB через curl_cffi — эмулируем браузер."""
from curl_cffi import requests


def test():
    url = "https://search.wb.ru/exactmatch/ru/common/v5/search"
    params = {
        "appType": "1",
        "curr": "rub",
        "dest": "-1257786",
        "query": "iphone",
        "resultset": "catalog",
        "sort": "popular",
        "spp": "30",
        "suppressSpellcheck": "false",
        "limit": "10",
    }

    print("→ Запрос к WB через curl_cffi (impersonate=chrome)...")

    try:
        # impersonate="chrome" — эмулирует TLS Chrome
        r = requests.get(url, params=params, impersonate="chrome", timeout=15)

        print(f"\n← Status: {r.status_code}")
        print(f"← Content-Type: {r.headers.get('content-type')}")
        print(f"← Длина: {len(r.text)} байт")

        if r.status_code == 200:
            data = r.json()
            products = data.get("data", {}).get("products", [])
            print(f"\n✓ Найдено товаров: {len(products)}")
            if products:
                p = products[0]
                print(f"\n  Первый товар:")
                print(f"    id: {p.get('id')}")
                print(f"    name: {p.get('name')}")
                print(f"    brand: {p.get('brand')}")
                print(f"    salePriceU: {p.get('salePriceU')}")
                print(f"    priceU: {p.get('priceU')}")
        else:
            print(f"\n✗ WB заблокировал:")
            print(r.text[:500])

    except Exception as e:
        print(f"\n✗ {type(e).__name__}: {e}")


if __name__ == "__main__":
    test()