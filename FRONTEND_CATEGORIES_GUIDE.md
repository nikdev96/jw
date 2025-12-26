# Frontend Guide: JUSTWEED Categories

## Как отображать категории

### 1. Главное меню (Tabs)
Показывать только **parent categories** (`parent_id IS NULL`):

```typescript
GET /api/v1/categories?parent_id=null
```

**Результат:**
- Flower (product)
- Edibles (product)
- Pre-Rolls (product)
- Delivery (info)
- Payments (info)
- Education (info)
- Merch (coming soon)
- Support (info)

### 2. Отображение категорий

**Product Categories** (`is_info_only=false`, `coming_soon=false`):
- Показывать как обычные категории с товарами
- При клике → отображать дочерние категории
- Можно добавлять товары

**Info Categories** (`is_info_only=true`):
- НЕ показывать кнопку "добавить товар"
- При клике → отображать информационный контент
- Дочерние категории = разделы контента

**Coming Soon** (`coming_soon=true`):
- Показывать с Badge "Coming Soon"
- Disabled состояние
- Нельзя кликнуть

### 3. Дочерние категории

```typescript
GET /api/v1/categories?parent_id=1  // Flower subcategories
```

**Правила:**
- Дочерние категории наследуют `is_info_only` от родителя
- Сортировка по `sort_order`
- Показывать breadcrumb: Parent → Child

### 4. Примеры отображения

**Flower (Product):**
```
[Flower Tab]
  → Premium Strains [10 products]
  → Exotic Genetics [5 products]
  → Indica [8 products]
  ...
```

**Delivery (Info):**
```
[Delivery Tab]
  → Fast Delivery [Info: 1-2 hours]
  → Night Delivery [Info: 10pm - 6am]
  → Pick Up [Info: Address list]
  ...
```

**Merch (Coming Soon):**
```
[Merch Tab] 🔒 Coming Soon
  (disabled)
```

### 5. API Response Format

```json
{
  "id": 1,
  "name": "Flower",
  "slug": "flower",
  "parent_id": null,
  "is_info_only": false,
  "coming_soon": false,
  "children": [
    {
      "id": 11,
      "name": "Premium Strains",
      "slug": "premium-strains",
      "parent_id": 1
    }
  ]
}
```

### 6. React Component Example

```tsx
function CategoryTabs() {
  const categories = useCategories({ parentId: null });

  return categories.map(cat => (
    <Tab
      key={cat.id}
      disabled={cat.coming_soon}
      badge={cat.coming_soon ? 'Coming Soon' : null}
      type={cat.is_info_only ? 'info' : 'product'}
    >
      {cat.name}
    </Tab>
  ));
}
```

### 7. Tailwind CSS Classes

```css
/* Product category */
.category-product { bg-green-500 }

/* Info category */
.category-info { bg-blue-500 }

/* Coming soon */
.category-disabled { opacity-50 cursor-not-allowed }
```

---

## Критические правила

1. ❌ НЕЛЬЗЯ добавлять товары в `is_info_only=true`
2. ❌ НЕЛЬЗЯ отображать coming_soon как активные
3. ✅ Всегда проверять флаги перед рендером
4. ✅ Сортировка по `sort_order`
