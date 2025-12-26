# 🚀 Quick Start - Telegram Mini App

## ✅ Backend запущен и работает!

**API URL:** http://localhost:8000
**Swagger Docs:** http://localhost:8000/docs

---

## 📊 Что работает:

### 1. Health Check
```bash
curl http://localhost:8000/health
# {"status":"ok"}
```

### 2. Категории (4 шт)
```bash
curl http://localhost:8000/api/v1/categories
```
- Электроника
- Одежда
- Книги
- Продукты

### 3. Товары (10 шт)
```bash
curl http://localhost:8000/api/v1/products
```
- iPhone 15 Pro (99990 ₽)
- MacBook Air M2 (119990 ₽)
- AirPods Pro (24990 ₽)
- и другие...

### 4. Swagger UI
Открой в браузере: **http://localhost:8000/docs**

---

## 🌐 Подключить Telegram Mini App

### Шаг 1: Настроить ngrok

```bash
# 1. Зарегистрироваться
open https://dashboard.ngrok.com/signup

# 2. Получить authtoken
open https://dashboard.ngrok.com/get-started/your-authtoken

# 3. Настроить ngrok
ngrok config add-authtoken YOUR_TOKEN_HERE

# 4. Запустить туннель
ngrok http 8000
```

Скопируй HTTPS URL (например: `https://abc123.ngrok-free.app`)

---

### Шаг 2: Обновить CORS

Файл: `app/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://abc123.ngrok-free.app",  # Твой ngrok URL
        "http://localhost:3000",          # Для локальной разработки
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Перезапустить сервер:
```bash
# Ctrl+C чтобы остановить
# Потом снова:
venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

### Шаг 3: Настроить Menu Button в BotFather

1. Открой **@BotFather** в Telegram
2. Отправь `/setmenubutton`
3. Выбери своего бота
4. Отправь название кнопки (например: "Открыть магазин")
5. Отправь URL: `https://abc123.ngrok-free.app/test_miniapp.html`

---

### Шаг 4: Тест!

1. Открой своего бота в Telegram
2. Нажми на кнопку Menu (возле поля ввода)
3. Откроется Mini App

**Что увидишь:**
- Информацию о Telegram пользователе
- Категории товаров
- Список товаров
- Кнопку создания тестового заказа

---

## 🧪 Тестирование API локально

### Получить товар по ID
```bash
curl http://localhost:8000/api/v1/products/1
```

### Получить товары категории
```bash
curl "http://localhost:8000/api/v1/products?category_id=1"
```

### Создать заказ (нужен Telegram initData)
```bash
# Этот запрос сработает только из Mini App
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: tma INIT_DATA_FROM_TELEGRAM" \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 1}
    ],
    "delivery_address": "ул. Тестовая, 1",
    "phone": "+79001234567"
  }'
```

---

## 📱 Получить MANAGER_CHAT_ID

Чтобы получать уведомления о заказах:

1. Отправь боту любое сообщение
2. Открой в браузере:
   ```
   https://api.telegram.org/bot8003645352:AAGn609hLNSbuBGGHRTeVl8z1cwH2dVSzPU/getUpdates
   ```
3. Найди `"chat":{"id":123456789}`
4. Обнови `.env`:
   ```
   MANAGER_CHAT_ID=123456789
   ```
5. Перезапусти сервер

---

## 🎯 Что дальше?

### Frontend для Mini App

Создай React/Vue/Svelte приложение:

```bash
# Пример с React + Vite
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Установить Telegram Web App SDK
npm install @twa-dev/sdk
```

**Структура:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── ProductList.tsx
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   ├── api/
│   │   └── client.ts           # Axios с Authorization
│   └── App.tsx
├── package.json
└── vite.config.ts
```

**API Client пример:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-ngrok-url.app/api/v1',
});

api.interceptors.request.use((config) => {
  const initData = window.Telegram.WebApp.initData;
  if (initData) {
    config.headers.Authorization = `tma ${initData}`;
  }
  return config;
});

export default api;
```

---

## 🔧 Troubleshooting

### Backend не запускается
```bash
# Проверить логи
cat /tmp/claude/-Users-nikita-lessons-botshop/tasks/b5f567a.output

# Перезапустить
venv/bin/uvicorn app.main:app --reload
```

### PostgreSQL не доступен
```bash
docker compose ps
docker compose restart
```

### Миграции не применяются
```bash
venv/bin/alembic current
venv/bin/alembic upgrade head
```

---

## 📚 Документация

- **API Docs:** http://localhost:8000/docs
- **README.md** - полная документация проекта
- **API_EXAMPLES.md** - примеры запросов
- **SECURITY_TESTS.md** - сценарии тестирования
- **DEPLOYMENT.md** - production deployment

---

## ✅ Готово к продакшену!

Когда будешь готов деплоить:
1. Обнови `allow_origins` в main.py
2. Установи `DEBUG=False`
3. Настрой production БД
4. Запусти на сервере (см. DEPLOYMENT.md)

**Твой бот токен:** `8003645352:AAGn609hLNSbuBGGHRTeVl8z1cwH2dVSzPU`
