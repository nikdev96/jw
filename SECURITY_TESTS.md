# Security Tests

Минимальные проверки безопасности для продакшена.

## 1. Telegram initData Validation

### ✅ Test: Reject invalid hash

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: tma query_id=AAH&user=%7B%22id%22%3A123%7D&hash=invalid_hash" \
  -d '{"items":[{"product_id":1,"quantity":1}]}'

# Expected: 401 Unauthorized
# {"detail":"Invalid initData hash"}
```

### ✅ Test: Reject missing hash

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: tma query_id=AAH&user=%7B%22id%22%3A123%7D" \
  -d '{"items":[{"product_id":1,"quantity":1}]}'

# Expected: 401 Unauthorized
# {"detail":"Hash not found in initData"}
```

### ✅ Test: Reject old initData (replay attack)

Создайте initData с auth_date старше 1 часа:

```python
import time
import hashlib
import hmac
import json
from urllib.parse import urlencode

BOT_TOKEN = "your_bot_token"
user = {"id": 123456789, "first_name": "Test"}
auth_date = int(time.time()) - 7200  # 2 hours ago

data = {
    "query_id": "AAH",
    "user": json.dumps(user),
    "auth_date": str(auth_date)
}

data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
secret_key = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
hash_value = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

data["hash"] = hash_value
init_data = urlencode(data)
print(f"Authorization: tma {init_data}")
```

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: tma [generated_init_data_here]" \
  -d '{"items":[{"product_id":1,"quantity":1}]}'

# Expected: 401 Unauthorized
# {"detail":"initData is too old"}
```

---

## 2. Order Access Control

### ✅ Test: User cannot access another user's order

**Шаг 1:** Создать заказ пользователем А

```bash
# User A creates order (gets order_id=1)
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: tma [USER_A_INIT_DATA]" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"product_id":1,"quantity":1}]}'
```

**Шаг 2:** Попытаться получить заказ пользователем Б

```bash
# User B tries to access order 1
curl http://localhost:8000/api/v1/orders/1 \
  -H "Authorization: tma [USER_B_INIT_DATA]"

# Expected: 404 Not Found
# {"detail":"Order not found"}
```

**Правильно:** 404 Not Found (не 403, чтобы не раскрывать существование заказа)

---

## 3. Price Manipulation

### ✅ Test: Cannot submit custom price

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: tma [VALID_INIT_DATA]" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 1, "price": "0.01"}
    ]
  }'

# Expected: 422 Unprocessable Entity
# Price field should not be accepted
```

**Проверка:** В OrderItemCreate схеме нет поля price.

```python
# app/schemas/order.py
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    # NO price field!
```

---

## 4. Inactive Products

### ✅ Test: Cannot order inactive product

**Шаг 1:** Деактивировать товар в БД

```sql
UPDATE products SET is_active = false WHERE id = 1;
```

**Шаг 2:** Попытаться заказать

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: tma [VALID_INIT_DATA]" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"product_id":1,"quantity":1}]}'

# Expected: 400 Bad Request
# {"detail":"Some products are not available"}
```

---

## 5. Non-existent Products

### ✅ Test: Cannot order non-existent product

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: tma [VALID_INIT_DATA]" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"product_id":99999,"quantity":1}]}'

# Expected: 404 Not Found
# {"detail":"Some products not found"}
```

---

## 6. SQL Injection

### ✅ Test: SQL injection in product search

```bash
# Try SQL injection
curl "http://localhost:8000/api/v1/products?category_id=1%20OR%201=1"

# Expected: 422 Unprocessable Entity or safe behavior
# SQLAlchemy uses parameterized queries - protected by default
```

---

## 7. XSS in Telegram Notifications

### ✅ Test: HTML injection in order comment

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: tma [VALID_INIT_DATA]" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": 1, "quantity": 1}],
    "comment": "<script>alert(\"XSS\")</script>",
    "delivery_address": "<b>Bold attack</b>"
  }'

# Expected: Order created, manager receives notification with escaped HTML
# Message should show: &lt;script&gt;alert("XSS")&lt;/script&gt;
```

**Проверка:** В коде используется `html.escape()` для всех пользовательских данных.

---

## 8. Empty Order

### ✅ Test: Cannot create order without items

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: tma [VALID_INIT_DATA]" \
  -H "Content-Type: application/json" \
  -d '{"items":[]}'

# Expected: 422 Unprocessable Entity
# {"detail":[{"loc":["body","items"],"msg":"List should have at least 1 item"}]}
```

---

## 9. Negative Quantity

### ✅ Test: Cannot order negative quantity

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: tma [VALID_INIT_DATA]" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"product_id":1,"quantity":-5}]}'

# Expected: 422 Unprocessable Entity
# {"detail":[{"loc":["body","items",0,"quantity"],"msg":"Input should be greater than 0"}]}
```

---

## 10. Authorization Header Format

### ✅ Test: Reject invalid header format

```bash
# Missing "tma " prefix
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Authorization: query_id=AAH..." \
  -H "Content-Type: application/json" \
  -d '{"items":[{"product_id":1,"quantity":1}]}'

# Expected: 401 Unauthorized
# {"detail":"Invalid authorization header format. Expected 'tma {initData}'"}
```

---

## Summary Checklist

**Telegram Auth:**
- ✅ Invalid hash rejected
- ✅ Missing hash rejected
- ✅ Old initData rejected (1 hour expiry)
- ✅ Invalid header format rejected

**Order Security:**
- ✅ User cannot access other users' orders
- ✅ Price calculated on backend, not from client
- ✅ Inactive products cannot be ordered
- ✅ Non-existent products rejected

**Input Validation:**
- ✅ Empty order rejected
- ✅ Negative quantity rejected
- ✅ SQL injection protected (SQLAlchemy)
- ✅ XSS in notifications prevented (HTML escape)

---

## Automated Testing (Optional)

Для автоматизации создайте файл `test_security.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_reject_invalid_initdata():
    response = client.post(
        "/api/v1/orders",
        headers={"Authorization": "tma query_id=AAH&hash=invalid"},
        json={"items": [{"product_id": 1, "quantity": 1}]}
    )
    assert response.status_code == 401
    assert "Invalid initData" in response.json()["detail"]

def test_reject_empty_order():
    # Need valid initData
    response = client.post(
        "/api/v1/orders",
        headers={"Authorization": "tma [VALID_INIT_DATA]"},
        json={"items": []}
    )
    assert response.status_code == 422

def test_reject_negative_quantity():
    response = client.post(
        "/api/v1/orders",
        headers={"Authorization": "tma [VALID_INIT_DATA]"},
        json={"items": [{"product_id": 1, "quantity": -1}]}
    )
    assert response.status_code == 422
```

Запуск:
```bash
pip install pytest
pytest test_security.py -v
```
