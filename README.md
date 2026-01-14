# JUSTWEED - Telegram Mini App

Интернет-магазин каннабиса в формате Telegram Mini App.

**Production:** https://surfjw.surf

---

## Стек

| Компонент | Технологии |
|-----------|------------|
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0 (async), PostgreSQL |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **Auth** | Telegram WebApp initData (HMAC-SHA256) |
| **Deploy** | Ubuntu 24.04, Nginx, systemd, Let's Encrypt |

---

## Структура проекта

```
shopjw/
├── app/                          # Backend (FastAPI)
│   ├── main.py                   # Точка входа, CORS, rate limiting
│   ├── config.py                 # Настройки (Pydantic Settings)
│   ├── database.py               # Async SQLAlchemy + PostgreSQL
│   │
│   ├── api/
│   │   ├── deps.py               # Зависимости (get_current_user)
│   │   └── v1/
│   │       ├── api.py            # Главный роутер
│   │       └── endpoints/
│   │           ├── categories.py # GET /categories
│   │           ├── products.py   # GET /products
│   │           └── orders.py     # POST /orders (auth required)
│   │
│   ├── core/
│   │   └── telegram_auth.py      # Верификация Telegram initData
│   │
│   ├── models/                   # SQLAlchemy ORM
│   │   ├── category.py           # Категории (иерархия)
│   │   ├── product.py            # Товары
│   │   ├── order.py              # Заказы
│   │   ├── order_item.py         # Позиции заказа
│   │   ├── user.py               # Пользователи (Telegram)
│   │   └── enums.py              # OrderStatus
│   │
│   ├── schemas/                  # Pydantic валидация
│   │   ├── category.py
│   │   ├── product.py
│   │   └── order.py
│   │
│   └── services/                 # Бизнес-логика
│       ├── category_service.py
│       ├── product_service.py
│       ├── order_service.py
│       └── telegram_bot.py       # Уведомления менеджеру
│
├── frontend/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx               # Роутинг, тема Telegram
│   │   │
│   │   ├── api/
│   │   │   └── client.ts         # API клиент + auth header
│   │   │
│   │   ├── components/
│   │   │   ├── BottomNavigation.tsx   # Таб-бар внизу
│   │   │   ├── CategoryCard.tsx       # Карточка категории
│   │   │   ├── Header.tsx             # Заголовок + back
│   │   │   ├── ProductPreviewModal.tsx # Модал товара (bottom sheet)
│   │   │   ├── EmptyState.tsx
│   │   │   └── Skeleton.tsx           # Loading скелетоны
│   │   │
│   │   ├── hooks/
│   │   │   └── useTelegram.ts    # Telegram WebApp API
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx      # Главная (сетка категорий)
│   │   │   ├── CategoryPage.tsx  # Товары категории / accordion
│   │   │   ├── CartPage.tsx      # Корзина
│   │   │   ├── CheckoutPage.tsx  # Оформление заказа
│   │   │   ├── OrderSuccessPage.tsx
│   │   │   └── SupportPage.tsx
│   │   │
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript интерфейсы
│   │   │
│   │   └── utils/
│   │       └── cart.ts           # localStorage корзина
│   │
│   ├── .env.local                # VITE_API_URL=http://localhost:8000/api/v1
│   ├── .env.production           # VITE_API_URL=/api/v1
│   └── package.json
│
├── alembic/                      # Миграции БД
├── .env                          # Секреты (DATABASE_URL, TELEGRAM_BOT_TOKEN)
└── requirements.txt
```

---

## API Endpoints

### Публичные (без auth)
```
GET  /api/v1/categories                    # Корневые категории
GET  /api/v1/categories?parent_id={id}     # Подкатегории
GET  /api/v1/categories/{id}               # Одна категория

GET  /api/v1/products                      # Все активные товары
GET  /api/v1/products?category_id={id}     # Товары категории
GET  /api/v1/products/{id}                 # Один товар
```

### Требуют Telegram auth
```
POST /api/v1/orders                        # Создать заказ
GET  /api/v1/orders/my                     # Мои заказы
GET  /api/v1/orders/{id}                   # Заказ по ID
```

**Header:** `Authorization: tma {initData}`

---

## Модели данных

### Category
| Поле | Тип | Описание |
|------|-----|----------|
| id | int | PK |
| name | str | "Flower", "Edibles" |
| slug | str | "flower", "edibles" |
| parent_id | int? | FK на родителя (для подкатегорий) |
| is_active | bool | Активна ли |
| is_info_only | bool | Только инфо (без товаров) |
| coming_soon | bool | Скоро появится |
| sort_order | int | Порядок сортировки |

### Product
| Поле | Тип | Описание |
|------|-----|----------|
| id | int | PK |
| name | str | Название |
| description | str? | Описание |
| price | Decimal | Цена в батах (฿) |
| images | list[str] | JSON массив URL картинок |
| category_id | int | FK на категорию |
| is_active | bool | Активен ли |
| type | str? | "Indica", "Sativa", "Hybrid", "CBD" |
| thc | Decimal? | Процент THC (0-100) |
| sort_order | int | Порядок |

### Order
| Поле | Тип | Описание |
|------|-----|----------|
| id | int | PK |
| user_id | BigInt | Telegram user ID |
| status | enum | pending / confirmed / delivered |
| total_amount | Decimal | Сумма заказа |
| delivery_address | str | Адрес доставки |
| phone | str | Телефон |
| comment | str? | Комментарий |
| items | list | Позиции (OrderItem) |

---

## Локальная разработка

### Backend
```bash
# Виртуальное окружение
python3 -m venv venv
source venv/bin/activate

# Зависимости
pip install -r requirements.txt

# Настройки
cp .env.example .env
# Заполнить DATABASE_URL, TELEGRAM_BOT_TOKEN, MANAGER_CHAT_ID

# Миграции
alembic upgrade head

# Запуск (порт 8000)
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend

npm install
npm run dev      # Порт 3000
npm run build    # Сборка в dist/
```

---

## Production Deploy

### Сервер
- **Домен:** surfjw.surf
- **Путь:** `/var/www/justweed/`
- **User:** www-data

### Команды деплоя
```bash
# 1. Backend файлы
sudo cp -r app/ /var/www/justweed/
sudo chown -R www-data:www-data /var/www/justweed/app

# 2. Frontend сборка
cd frontend && npm run build
sudo rm -rf /var/www/justweed/frontend/dist
sudo cp -r dist /var/www/justweed/frontend/
sudo chown -R www-data:www-data /var/www/justweed/frontend/dist

# 3. Перезапуск backend
sudo pkill -f "uvicorn app.main:app"
cd /var/www/justweed
sudo -u www-data ./venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 &

# 4. Перезагрузка nginx
sudo systemctl reload nginx
```

### Nginx конфиг
```
/etc/nginx/sites-available/justweed
```
- Frontend: `/var/www/justweed/frontend/dist`
- API proxy: `location /api/ → http://127.0.0.1:8000/api/`

---

## Переменные окружения

```bash
# .env (backend)
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/botshop
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
MANAGER_CHAT_ID=123456789
DEBUG=False
FRONTEND_URL=https://surfjw.surf

# frontend/.env.production
VITE_API_URL=/api/v1
```

---

## Уведомления менеджеру

При создании заказа в Telegram отправляется:
```
🛒 Новый заказ #123

👤 Покупатель: ID 987654321

📦 Состав заказа:
• OG Kush × 2 = 5000 ฿
• Blue Dream × 1 = 2400 ฿

💰 Итого: 7400 ฿
📍 Адрес: ...
📞 Телефон: ...

🕐 Создан: 14.01.2026 15:30
```

---

## Важно

1. **Валюта** — тайский бат (฿)
2. **Auth** — HMAC-SHA256 с ключом `WebAppData` + bot_token
3. **Корзина** — localStorage в браузере
4. **Категории** — если есть подкатегории → accordion, если нет → сразу товары
5. **CORS** — разрешены `surfjw.surf` и `web.telegram.org`
