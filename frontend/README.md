# JUSTWEED - Telegram Mini App Frontend

MVP фронтенд для магазина JUSTWEED в Telegram.

## Быстрый старт

```bash
# Установка
npm install

# Запуск dev
npm run dev

# Сборка
npm run build
```

## Технологии

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Telegram WebApp SDK

## Структура

```
src/
├── api/          # API client (Fetch)
├── components/   # UI (Skeleton, Header, FloatingCart)
├── hooks/        # useTelegram
├── pages/        # Home, Category, Cart, Checkout, OrderSuccess
├── types/        # TypeScript interfaces
└── utils/        # Cart (localStorage)
```

## Интеграция с Telegram

1. Запустите backend на `http://localhost:8000`
2. Запустите frontend: `npm run dev`
3. Создайте HTTPS туннель (serveo/ngrok)
4. Настройте Menu Button в @BotFather

## API

Backend endpoints:
- `GET /api/v1/categories`
- `GET /api/v1/products?category_id=X`
- `POST /api/v1/orders`

Авторизация: `Authorization: tma <initData>`

## Состояние

- Корзина: `localStorage` (`justweed_cart`)
- initData: передается в API автоматически
- Theme: Telegram colors через CSS variables
