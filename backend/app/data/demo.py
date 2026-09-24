MARKETPLACES = {
    "ozon":   {"id": "ozon",   "name": "Ozon",        "short": "O"},
    "wb":     {"id": "wb",     "name": "Wildberries", "short": "W"},
    "dns":    {"id": "dns",    "name": "DNS",         "short": "D"},
    "yandex": {"id": "yandex", "name": "Я.Маркет",    "short": "Я"},
}

PRODUCTS = [
    {
        "id": 1,
        "emoji": "📱",
        "title": "Apple iPhone 15 128GB, чёрный",
        "rating": 4.8,
        "reviews": 1240,
        "inStock": True,
        "offers": [
            {"mp": "ozon",   "price": 64990, "delivery": "Завтра",      "seller": "Ozon",    "rating": 4.9},
            {"mp": "yandex", "price": 66490, "delivery": "Послезавтра", "seller": "М.Видео", "rating": 4.7},
            {"mp": "wb",     "price": 67490, "delivery": "1–2 дня",     "seller": "WB",      "rating": 4.6},
            {"mp": "dns",    "price": 69990, "delivery": "Сегодня",     "seller": "DNS",     "rating": 4.8},
        ],
    },
    {
        "id": 2,
        "emoji": "📱",
        "title": "Apple iPhone 15 128GB, синий",
        "rating": 4.7,
        "reviews": 862,
        "inStock": True,
        "offers": [
            {"mp": "wb",     "price": 65990, "delivery": "1–2 дня",     "seller": "WB",      "rating": 4.5},
            {"mp": "ozon",   "price": 66990, "delivery": "Завтра",      "seller": "Ozon",    "rating": 4.8},
            {"mp": "yandex", "price": 68490, "delivery": "Послезавтра", "seller": "М.Видео", "rating": 4.7},
        ],
    },
    {
        "id": 3,
        "emoji": "📱",
        "title": "Apple iPhone 15 256GB, чёрный",
        "rating": 4.9,
        "reviews": 2140,
        "inStock": True,
        "offers": [
            {"mp": "ozon", "price": 74990, "delivery": "Завтра",  "seller": "Ozon", "rating": 4.9},
            {"mp": "dns",  "price": 76990, "delivery": "Сегодня", "seller": "DNS",  "rating": 4.8},
            {"mp": "wb",   "price": 77990, "delivery": "1–2 дня", "seller": "WB",   "rating": 4.6},
        ],
    },
]

PRODUCT_DETAILS = {
    1: {
        "id": 1,
        "emoji": "📱",
        "title": "Apple iPhone 15 128GB, чёрный",
        "rating": 4.8,
        "reviews": 1240,
        "inStock": True,
        "gallery": ["📱", "📲", "🔋", "📦"],
        "specs": {
            "Бренд": "Apple",
            "Модель": "iPhone 15",
            "Память": "128 ГБ",
            "Цвет": "Чёрный",
            'Экран': '6.1" OLED',
            "Процессор": "A16 Bionic",
            "Камера": "48 МП + 12 МП",
            "Аккумулятор": "3349 мА·ч",
        },
        "offers": [
            {"mp": "ozon",   "price": 64990, "delivery": "Завтра",      "seller": "Ozon",    "rating": 4.9},
            {"mp": "yandex", "price": 66490, "delivery": "Послезавтра", "seller": "М.Видео", "rating": 4.7},
            {"mp": "wb",     "price": 67490, "delivery": "1–2 дня",     "seller": "WB",      "rating": 4.6},
            {"mp": "dns",    "price": 69990, "delivery": "Сегодня",     "seller": "DNS",     "rating": 4.8},
        ],
        "history": [70, 72, 68, 65, 63, 60, 58, 55, 57, 54, 50, 48, 45, 47, 44, 42, 40, 38, 41, 39, 36, 34, 32, 30],
    },
}