# 🔍 Ценомер — агрегатор цен на маркетплейсах

Сравнивает цены на товары в **Ozon**, **Wildberries**, **DNS** и **Яндекс.Маркете** в одном месте. Один поиск — четыре магазина.

![Скриншот главной](docs/screenshot-home.png)

## ✨ Что умеет

- 🔎 **Поиск по названию** — «iPhone 17 Pro Max», «наушники», «macbook»
- 💰 **Сравнение цен** — все магазины в одной карточке, лучшая цена подсвечена
- 📊 **История цен** — график за 30/90/365 дней
- 🔔 **Отслеживание товаров** — уведомления при снижении цены
- 🌗 **Тёмная тема** — автоопределение по системной
- 📱 **Адаптив** — работает на телефоне, планшете, десктопе
- ⚡ **Живые данные** — парсинг реальных цен с DNS в реальном времени

## 🏗️ Архитектура
┌──────────────────┐ /api/* ┌──────────────────┐
│ │ ──────────▶ │ │
│ Frontend │ Vite proxy │ Backend │
│ Vite + JS │ │ FastAPI │
│ (SPA) │ ◀────────── │ (Python) │
│ :5173 │ JSON │ :8000 │
└──────────────────┘ └──────────────────┘
│
│ httpx / curl_cffi
▼
┌──────────────────┐
│ DNS-Shop.ru │
│ restapi.dns-... │
└──────────────────┘

- **Frontend** — Vite, ES-модули, vanilla JS, hash-роутер.
- **Backend** — FastAPI, Pydantic, асинхронный httpx / curl_cffi.
- **Парсеры** — модульные, отдельный файл под каждый маркетплейс.

## 🛠️ Стек

### Frontend
- **Vite** 5 — сборка, HMR, proxy
- **Vanilla JS** — ES-модули, без фреймворков
- **CSS** — переменные, тёмная тема, адаптив
- **Inter** — шрифт

### Backend
- **Python** 3.13
- **FastAPI** — веб-фреймворк
- **Uvicorn** — ASGI-сервер
- **Pydantic** — валидация данных
- **httpx** — HTTP-клиент
- **curl_cffi** — обход антибота через TLS-эмуляцию браузера

### Инфраструктура
- **Vite-proxy** — единый origin для фронта и API
- **Hash-роутинг** — SPA без сервера
- **Модульные парсеры** — легко добавить новый магазин

## 📁 Структура проекта
cenomer/
├── index.html # Точка входа Vite
├── package.json # Зависимости фронта
├── vite.config.js # Конфиг Vite + proxy на /api
├── public/
│ └── favicon.svg # Иконка
│
├── src/ # 🎨 Фронтенд
│ ├── main.js # Точка входа, роутер, инициализация
│ ├── lib/ # Инфраструктура
│ │ ├── api.js # Обёртка над fetch('/api/*')
│ │ ├── utils.js # Форматтеры, хелперы
│ │ ├── theme.js # Тёмная тема
│ │ ├── chart.js # SVG-графики
│ │ ├── modal.js # Модалки
│ │ ├── toast.js # Тосты
│ │ └── storage.js # localStorage с префиксом
│ ├── components/ # Переиспользуемые компоненты
│ │ ├── render.js # Карточки товаров
│ │ ├── compare.js # Модалка сравнения
│ │ ├── notifications.js # Модалка уведомлений
│ │ ├── onboarding.js # Онбординг
│ │ └── confirm.js # Подтверждение действий
│ ├── pages/ # Экраны
│ │ ├── home.js # Главная с поиском
│ │ ├── product.js # Карточка товара
│ │ ├── tracking.js # Отслеживаемые
│ │ ├── profile.js # Профиль
│ │ ├── settings.js # Настройки
│ │ └── not-found.js # 404
│ ├── router/
│ │ └── router.js # Hash-роутер
│ ├── data/
│ │ └── demo.js # Демо-данные (fallback)
│ └── styles/ # CSS-модули
│ ├── index.css # Импорт всех стилей
│ ├── variables.css # Цвета, тени, размеры
│ ├── base.css # Базовые стили
│ ├── components.css # Кнопки, чипы, поля
│ ├── layout.css # Topbar, hero, toolbar
│ ├── cards.css # Карточки товаров
│ └── ...
│
└── backend/ # ⚙️ Бэкенд
├── app/
│ ├── main.py # Точка входа FastAPI
│ ├── config.py # Настройки
│ ├── schemas.py # Pydantic-модели
│ ├── api/ # Роуты
│ │ ├── health.py
│ │ ├── search.py
│ │ └── products.py
│ ├── services/ # Бизнес-логика
│ │ ├── search.py # Оркестратор поиска
│ │ └── parsers/ # Парсеры магазинов
│ │ ├── dns.py # DNS (работает)
│ │ └── wb.py # WB (заблокирован)
│ └── data/
│ └── demo.py # Демо-данные
├── requirements.txt
└── .env.example

## 🚀 Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone https://github.com/твой-ник/cenomer.git
cd cenomer
npm install
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
HOST=127.0.0.1
PORT=8000
DEBUG=true
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
uvicorn app.main:app --reload --port 8000
npm run dev
{ "status": "ok", "version": "0.1.0" }
GET /api/search?q=iphone&limit=20

Поиск товаров.

Параметры:

    q — поисковый запрос

    limit — максимум товаров (1–100)

    source — dns | wb | demo | auto (по умолчанию: dns → wb → demo)

Ответ:
{
  "query": "iphone",
  "count": 18,
  "source": "dns",
  "products": [
    {
      "id": "00e7b405-...",
      "emoji": "📦",
      "title": "6.3\" Смартфон Apple iPhone 17 Pro 256 ГБ серебристый",
      "inStock": true,
      "offers": [{
        "mp": "dns",
        "price": 125999,
        "seller": "DNS",
        "url": "https://www.dns-shop.ru/product/..."
      }],
      "image": "https://c.dns-shop.ru/thumb/...jpg",
      "source": "dns"
    }
  ]
}
GET /api/products/{id}

Детальная карточка товара (в разработке).
🧩 Как это работает
Парсинг DNS

    curl_cffi эмулирует TLS-отпечаток Chrome (обход антибота).

    Cookies qrator_ssid2 + qrator_jsid2 получаются из браузера (обход IP-фильтра).

    Запрос к https://restapi.dns-shop.ru/v1/site/get-presearch-selection.

    Нормализация ответа в универсальный формат.

    Возврат JSON на фронт.

Fallback

Если парсер упал (403, timeout, ошибка) — возвращаются демо-данные. Сайт не падает.
Proxy

Vite перехватывает /api/* и проксирует на http://127.0.0.1:8000. CORS не нужен — фронт и бэк на одном origin.
🔧 Скрипты
npm run dev       # Dev-сервер (Vite, :5173)
npm run build     # Production-сборка → dist/
npm run preview   # Просмотр сборки (:4173)

🚧 Статус и roadmap
✅ Готово

    ☑

    Миграция на Vite + ES-модули
    ☑

    FastAPI-бэкенд с Pydantic
    ☑

    Парсер DNS (реальные данные)
    ☑

    Vite-proxy для /api/*
    ☑

    Главная с поиском
    ☑

    Карточка товара (каркас)
    ☑

    Отслеживаемые (каркас)
    ☑

    Профиль и настройки
    ☑

    Тёмная тема
    ☑

    Онбординг

🚧 В работе

    □

    Картинки товаров в карточках
    □

    Второй магазин (М.Видео, Ситилинк)
    □

    Полная карточка товара (рейтинг, отзывы)
    □

    Playwright для стабильного парсинга

🔮 Планы

    □

    Реальная авторизация
    □

    Push-уведомления
    □

    Прогноз цены (ML)
    □

    B2B API для селлеров
    □

    Мобильное приложение (PWA)

⚠️ Юридические заметки

Проект парсит публичные данные с маркетплейсов. Используется исключительно для демонстрации и обучения.

Не рекомендуется для коммерческого использования без:

    Согласования с маркетплейсами.

    Соблюдения их Terms of Service.

    Юридической консультации.

🤝 Вклад

Pull requests приветствуются. Для крупных изменений — сначала откройте issue.
