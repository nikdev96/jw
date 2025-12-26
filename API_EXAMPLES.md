# API Examples

Примеры запросов к API для тестирования.

## Public endpoints (без авторизации)

### Получить все категории

```bash
curl http://localhost:8000/api/v1/categories
```

```json
[
  {
    "id": 1,
    "name": "Электроника",
    "slug": "electronics",
    "sort_order": 1
  },
  {
    "id": 2,
    "name": "Одежда",
    "slug": "clothing",
    "sort_order": 2
  }
]
```

### Получить все товары

```bash
curl http://localhost:8000/api/v1/products
```

### Получить товары по категории

```bash
curl "http://localhost:8000/api/v1/products?category_id=1"
```

### Получить товар по ID

```bash
curl http://localhost:8000/api/v1/products/1
```

```json
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "description": "Смартфон Apple iPhone 15 Pro 256GB",
  "price": "99990.00",
  "image_url": "https://example.com/iphone15.jpg",
  "category_id": 1,
  "is_active": true,
  "sort_order": 1,
  "category": {
    "id": 1,
    "name": "Электроника",
    "slug": "electronics"
  }
}
```

## Protected endpoints (требуется авторизация)

**Важно:** Для тестирования protected endpoints нужен валидный Telegram initData.

### Получить текущего пользователя

```bash
curl -H "Authorization: tma query_id=...&user=...&hash=..." \
  http://localhost:8000/api/v1/users/me
```

```json
{
  "id": 1,
  "telegram_id": 123456789,
  "username": "john_doe",
  "first_name": "John",
  "last_name": "Doe",
  "created_at": "2025-12-22T10:30:00Z",
  "updated_at": "2025-12-22T10:30:00Z"
}
```

### Создать заказ

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: tma query_id=...&user=...&hash=..." \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 3, "quantity": 1}
    ],
    "delivery_address": "ул. Пушкина, д. 10, кв. 5",
    "phone": "+79001234567",
    "comment": "Позвонить за час до доставки"
  }' \
  http://localhost:8000/api/v1/orders
```

**Response:**

```json
{
  "id": 1,
  "user_id": 123456789,
  "status": "pending",
  "total_amount": "319970.00",
  "delivery_address": "ул. Пушкина, д. 10, кв. 5",
  "phone": "+79001234567",
  "comment": "Позвонить за час до доставки",
  "created_at": "2025-12-22T15:30:00Z",
  "updated_at": "2025-12-22T15:30:00Z",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "iPhone 15 Pro",
      "quantity": 2,
      "price": "99990.00"
    },
    {
      "id": 2,
      "product_id": 3,
      "product_name": "MacBook Air M2",
      "quantity": 1,
      "price": "119990.00"
    }
  ]
}
```

### Получить мои заказы

```bash
curl -H "Authorization: tma query_id=...&user=...&hash=..." \
  http://localhost:8000/api/v1/orders/my
```

### Получить заказ по ID

```bash
curl -H "Authorization: tma query_id=...&user=...&hash=..." \
  http://localhost:8000/api/v1/orders/1
```

## Ошибки

### 401 Unauthorized - невалидный initData

```json
{
  "detail": "Invalid initData hash"
}
```

### 404 Not Found - товар не найден

```json
{
  "detail": "Product not found"
}
```

### 400 Bad Request - товар неактивен

```json
{
  "detail": "Some products are not available"
}
```

### 422 Validation Error - невалидные данные

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "items"],
      "msg": "Field required"
    }
  ]
}
```

## Тестирование из JavaScript (Telegram Mini App)

```javascript
// Get initData from Telegram
const initData = window.Telegram.WebApp.initData;

// Helper function
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`http://localhost:8000/api/v1${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(initData && { 'Authorization': `tma ${initData}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API Error');
  }

  return response.json();
}

// Examples
const categories = await apiRequest('/categories');
const products = await apiRequest('/products?category_id=1');
const product = await apiRequest('/products/1');

const order = await apiRequest('/orders', {
  method: 'POST',
  body: JSON.stringify({
    items: [
      { product_id: 1, quantity: 2 },
      { product_id: 3, quantity: 1 }
    ],
    delivery_address: "ул. Пушкина, д. 10",
    phone: "+79001234567"
  })
});

const myOrders = await apiRequest('/orders/my');
```

## Swagger UI

Интерактивная документация доступна по адресу:
http://localhost:8000/docs

Там можно тестировать все endpoints прямо из браузера.
