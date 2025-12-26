# BotShop - Telegram Mini App (Backend)

Production-ready backend для интернет-магазина в Telegram Mini App.

## Стек

**Backend:**
- FastAPI (async)
- SQLAlchemy 2.0 (async)
- PostgreSQL + asyncpg
- Alembic (миграции)
- Pydantic v2 (валидация)
- httpx (Telegram Bot API)

**Безопасность:**
- Проверка Telegram initData (HMAC-SHA256)
- Авторизация только через Telegram
- Валидация всех входных данных

## Структура проекта

```
botshop/
├── alembic/                    # Миграции БД
│   ├── versions/
│   ├── env.py                  # Async конфигурация Alembic
│   └── script.py.mako
├── app/
│   ├── main.py                 # FastAPI приложение
│   ├── config.py               # Настройки (Pydantic Settings)
│   ├── database.py             # SQLAlchemy async setup
│   ├── models/                 # ORM модели
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   └── enums.py            # OrderStatus enum
│   ├── schemas/                # Pydantic схемы
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── product.py
│   │   └── order.py
│   ├── services/               # Бизнес-логика
│   │   ├── category_service.py
│   │   ├── product_service.py
│   │   ├── order_service.py
│   │   └── telegram_bot.py     # Уведомления в Telegram
│   ├── core/
│   │   └── telegram_auth.py    # Проверка initData
│   └── api/
│       ├── deps.py             # Dependencies (auth)
│       └── v1/
│           ├── api.py
│           └── endpoints/
│               ├── users.py
│               ├── categories.py
│               ├── products.py
│               └── orders.py
├── requirements.txt
├── .env.example
└── README.md
```

## Модели БД

**User** - пользователи из Telegram
- telegram_id (unique, indexed)
- username, first_name, last_name

**Category** - категории товаров
- name, slug (unique)
- sort_order

**Product** - товары
- name, description, price
- image_url, category_id
- is_active, sort_order

**Order** - заказы
- user_id, status (enum)
- total_amount
- delivery_address, phone, comment
- created_at, updated_at

**OrderItem** - позиции в заказе
- order_id, product_id
- product_name (snapshot)
- quantity, price (snapshot)

## API Endpoints

### Public (no auth)
```
GET  /categories                # Список категорий
GET  /products?category_id=     # Список товаров
GET  /products/{id}             # Карточка товара
```

### Protected (требуется Telegram auth)
```
POST /orders                    # Создать заказ
GET  /orders/my                 # Мои заказы
GET  /orders/{id}               # Заказ по ID
GET  /users/me                  # Текущий пользователь
```

## Установка

### 1. Клонировать и установить зависимости

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Создать .env файл

```bash
cp .env.example .env
```

Заполнить:
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/botshop
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
MANAGER_CHAT_ID=123456789
DEBUG=True
```

**Как получить MANAGER_CHAT_ID:**
1. Отправить боту `/start`
2. Открыть https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
3. Найти `"chat":{"id":123456789}`

### 3. Создать БД и применить миграции

```bash
createdb botshop
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 4. Запустить сервер

```bash
uvicorn app.main:app --reload
```

API: http://localhost:8000
Docs: http://localhost:8000/docs

## Аутентификация

Telegram initData передается в заголовке:

```http
Authorization: tma query_id=...&user=%7B%22id%22%3A123...&hash=...
```

### Пример (JavaScript):

```javascript
const initData = window.Telegram.WebApp.initData;

const response = await fetch('http://localhost:8000/api/v1/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `tma ${initData}`
  },
  body: JSON.stringify({
    items: [
      { product_id: 1, quantity: 2 },
      { product_id: 3, quantity: 1 }
    ],
    delivery_address: "ул. Пушкина, д. 10",
    phone: "+79001234567",
    comment: "Домофон не работает"
  })
});
```

## Создание заказа (flow)

1. Frontend отправляет POST /orders с массивом `items`
2. Backend проверяет:
   - initData валидный
   - Все product_id существуют
   - Все товары активны (is_active=true)
3. Рассчитывает total_amount (актуальные цены из БД)
4. Создает Order + OrderItem (в транзакции)
5. Отправляет уведомление менеджеру в Telegram
6. Возвращает созданный Order

**Важно:** цены берутся из БД в момент создания заказа и сохраняются в OrderItem (snapshot).

## OrderStatus enum

```python
PENDING      # Новый заказ
CONFIRMED    # Подтвержден менеджером
PROCESSING   # В обработке
SHIPPED      # Отправлен
DELIVERED    # Доставлен
CANCELLED    # Отменен
```

## Уведомления в Telegram

При создании заказа менеджер получает сообщение:

```
🛒 Новый заказ #123

👤 Покупатель: ID 987654321

📦 Состав заказа:
• Товар 1 × 2 = 500 ₽
• Товар 2 × 1 = 300 ₽

💰 Итого: 800 ₽

📍 Адрес: ул. Пушкина, д. 10
📞 Телефон: +79001234567
💬 Комментарий: Домофон не работает

🕐 Создан: 22.12.2025 15:30
```

## Работа с миграциями

```bash
# Создать новую миграцию
alembic revision --autogenerate -m "Add new field"

# Применить миграции
alembic upgrade head

# Откатить одну миграцию
alembic downgrade -1

# Откатить все
alembic downgrade base

# История миграций
alembic history

# Текущая версия
alembic current
```

## Production Checklist

### 🔴 ОБЯЗАТЕЛЬНО перед запуском production:

- [ ] **CORS**: Заменить `allow_origins=["*"]` на конкретные домены Mini App
- [ ] **DEBUG**: Установить `DEBUG=False` в .env
- [ ] **HTTPS**: Включить SSL/TLS
- [ ] **Secrets**: Проверить TELEGRAM_BOT_TOKEN и MANAGER_CHAT_ID

### 🟡 Рекомендуется:

- [ ] Мониторинг: Sentry для error tracking
- [ ] Backup: Автоматический pg_dump
- [ ] Rate limiting: 10-20 req/min per user на /orders
- [ ] Индексы: Order.user_id, Order.created_at
- [ ] Health check endpoint

### 🟢 Опционально (для масштабирования):

- [ ] Redis для кеширования каталога
- [ ] CDN для images
- [ ] Structured logging (structlog/JSON)
- [ ] Connection pool tuning
- [ ] Horizontal scaling

## Архитектурные решения

**Stateless API:** сервер не хранит сессии, корзина на фронте.

**Lazy Onboarding:** пользователь создается автоматически при первом запросе. Это осознанный trade-off для Telegram Mini App — Telegram уже аутентифицировал пользователя, нет необходимости в explicit registration.

**Snapshot цен:** при создании заказа цена товара копируется в OrderItem, чтобы изменение цены не влияло на старые заказы.

**Транзакционность:** Order и OrderItem создаются в одной транзакции. Уведомления в Telegram отправляются ПОСЛЕ commit в background, чтобы падение Telegram API не откатывало заказ.

**Service layer:** бизнес-логика отделена от API handlers.

**Валидация:** на уровне Pydantic (входные данные) и SQLAlchemy (БД).

**Безопасность:** user_id берется только из проверенного Telegram WebApp initData (SHA256 + HMAC-SHA256 + auth_date check).

## Что дальше

**Backend:**
- Админка для управления каталогом
- Поиск по товарам
- Фильтры (цена, наличие)
- Пагинация
- Загрузка изображений (S3/CDN)
- Статусы заказов (webhook от доставки)
- Stock quantity (если продаются физические товары с ограниченным количеством)

**Интеграции:**
- Платежи (ЮKassa/Stripe)
- Аналитика (Amplitude/Mixpanel)
- CRM интеграция

## Поддержка

Проблемы: создать issue в репозитории
Документация API: /docs
