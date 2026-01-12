# 📱 UI Skeleton Implementation Guide

## ✅ Completed UI Structure

Modern mobile shop skeleton в стиле iOS для JUSTWEED Telegram Mini App.

---

## 🏗️ Архитектура навигации

```
┌─────────────────────────┐
│   App.tsx               │
│   ├── Routes            │
│   │   ├── Home          │ ← Catalog with categories
│   │   ├── Category      │ ← Products in category
│   │   ├── Cart          │ ← Empty state (UI only)
│   │   ├── Support       │ ← Info/Contact (UI only)
│   │   ├── Checkout      │ ← Existing (has logic)
│   │   └── OrderSuccess  │ ← Existing (has logic)
│   └── BottomNavigation  │ ← New! iOS-style tabs
└─────────────────────────┘
```

---

## 📁 Новые компоненты

### 1. **BottomNavigation** (`components/BottomNavigation.tsx`)

**iOS-style нижняя навигация**

```tsx
Tabs:
- 🏠 Catalog (path: /)
- 🛒 Cart (path: /cart)
- 💬 Support (path: /support)

Features:
✓ Активный индикатор с Framer Motion
✓ Показывается на главных экранах (home, cart, support)
✓ Скрывается на checkout/order-success
✓ Fixed bottom с safe area
```

**Где подключать логику:**
- Бейдж с количеством товаров в корзине (строка 23-30)
- Динамические иконки из конфига

---

### 2. **CartPage (новая версия)** (`pages/CartPage.tsx`)

**Empty state UI - БЕЗ логики**

```tsx
Текущее состояние: ЗАГЛУШКА
- Пустая корзина
- CTA кнопка "Browse Catalog"
- Никаких расчетов
```

**Где подключать логику:**
```tsx
// TODO: Add cart items
const [cart, setCart] = useState<CartItem[]>([]);

// TODO: Add cart list rendering
{cart.length > 0 && (
  <div className="space-y-3">
    {cart.map(item => (
      <CartItemComponent item={item} />
    ))}
  </div>
)}

// TODO: Add totals
const total = getCartTotal(cart);

// TODO: Add checkout button
<button onClick={() => navigate('/checkout')}>
  Checkout · {total} ฿
</button>
```

**Старая версия:** `pages/CartPage.old.tsx` (бэкап с логикой)

---

### 3. **SupportPage** (`pages/SupportPage.tsx`)

**Информационный экран - UI only**

```tsx
Sections:
1. Support Cards (4 cards):
   - Contact Manager
   - Delivery Info
   - Payment Methods
   - Working Hours

2. FAQ Section (3 items)
3. Contact CTA
```

**Где подключать логику:**
```tsx
// Line 73: handleContactManager
const handleContactManager = () => {
  // TODO: Replace with real Telegram bot link
  window.Telegram.WebApp.openTelegramLink('https://t.me/your_bot');
};

// TODO: Fetch FAQ from API
const { data: faq } = await api.getFAQ();

// TODO: Fetch support config
const { workingHours, deliveryTime } = await api.getConfig();
```

---

## 🎨 Цветовая палитра (сохранена)

```css
--tg-theme-bg-color: #ffffff
--tg-theme-text-color: #000000
--tg-theme-button-color: #3390ec (синий акцент)
--tg-theme-secondary-bg-color: #f4f4f5

Custom:
- Green accent: green-600 (#16a34a) для кнопок
- Gray shades: gray-50, gray-100, gray-500, gray-900
```

---

## 📱 Отступы для Bottom Nav

**Все главные страницы имеют `pb-20` (80px):**

| Файл | Строка | Изменение |
|------|--------|-----------|
| `HomePage.tsx` | 120 | Добавлен `pb-20` в контейнер |
| `CategoryPage.tsx` | 320 | Добавлен `pb-20` в wrapper |
| `CartPage.tsx` | 13 | Встроен `pb-20` |
| `SupportPage.tsx` | 13 | Встроен `pb-20` |

---

## 🔄 Измененные файлы

### App.tsx

**Изменения:**
1. Добавлен импорт `SupportPage` и `BottomNavigation`
2. Закомментирован `FloatingCart` (заменен на bottom nav)
3. Добавлен роут `/support`
4. Обновлена логика показа bottom nav:
   ```tsx
   const hideBottomNav = location.pathname.match(/\/(checkout|order-success)/);
   ```

**До:**
```tsx
{!isCartPage && <FloatingCart cart={cart} />}
```

**После:**
```tsx
{!hideBottomNav && <BottomNavigation />}
```

---

## ⚠️ Заглушки и TODO

### CartPage.tsx
- [ ] Line 40-60: Подключить рендеринг списка товаров
- [ ] Подключить `getCart()`, `updateQuantity()`, `removeFromCart()`
- [ ] Добавить расчет subtotal/total
- [ ] Добавить кнопку Checkout с условием `cart.length > 0`

### SupportPage.tsx
- [ ] Line 73: Заменить console.log на реальную ссылку Telegram
- [ ] Line 35-50: Загружать FAQ из API
- [ ] Line 100: Динамический контент support cards
- [ ] Добавить ссылки Terms & Privacy

### BottomNavigation.tsx
- [ ] Line 23-30: Добавить badge с количеством товаров
  ```tsx
  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
      {cartCount}
    </span>
  )}
  ```
- [ ] Иконки из конфига вместо хардкода

---

## 🎯 Next Steps: Подключение логики

### Приоритет 1: Cart функционал
```bash
1. Восстановить логику корзины из CartPage.old.tsx
2. Интегрировать с BottomNavigation (badge)
3. Подключить к localStorage/API
```

### Приоритет 2: Support контакты
```bash
1. Добавить реальную ссылку на Telegram бота
2. Загрузить FAQ из backend
3. Добавить кнопку "My Orders"
```

### Приоритет 3: Улучшения UX
```bash
1. Skeleton states для загрузки
2. Pull-to-refresh
3. Haptic feedback (Telegram.WebApp.HapticFeedback)
```

---

## 🧪 Как тестировать

### 1. Навигация
- [x] Переключение между Home/Cart/Support
- [x] Активный таб подсвечивается
- [x] Bottom nav скрывается на checkout/success

### 2. Отступы
- [x] Контент не перекрывается bottom nav
- [x] Прокрутка работает корректно

### 3. Анимации
- [x] Плавные переходы между страницами
- [x] Tab indicator анимируется
- [x] Кнопки имеют active:scale эффект

---

## 📊 Метрики

```
Новые файлы:     3 (BottomNav, CartPage, SupportPage)
Измененные:      3 (App, HomePage, CategoryPage)
Строк кода:      ~450 lines
UI-only:         ✓ Без бизнес-логики
iOS-style:       ✓ Нативный мобильный UX
```

---

## 💡 Дизайн решения

### Почему fixed bottom вместо плавающей корзины?

**Было:** FloatingCart (плавающая кнопка справа снизу)
- ✗ Занимает место на экране
- ✗ Перекрывает контент
- ✗ Только 1 функция (корзина)

**Стало:** BottomNavigation (фиксированная панель снизу)
- ✓ Стандартный mobile паттерн (как в Instagram, Telegram)
- ✓ 3 функции в одной панели
- ✓ Не перекрывает контент (учтено в отступах)
- ✓ iOS-like UX

### Почему пустая корзина вместо логики?

**UI-first подход:**
1. Сначала визуал → потом логика
2. Легче тестировать дизайн
3. Можно показать клиенту без backend
4. Логика добавится отдельным PR

---

## 🎨 Референсы

Вдохновение:
- Telegram Mini Apps (Delivery, Marketplace)
- iOS App Store tabs
- Modern e-commerce apps (Getir, Gorillas)

---

**Created:** 2025-12-26
**Author:** Senior Frontend + Mobile UX Engineer
**Status:** ✅ UI Skeleton Complete — Ready for Logic Integration
