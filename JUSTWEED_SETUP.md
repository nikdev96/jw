# JUSTWEED Categories Setup Guide

## Файлы созданы

1. **migrations/add_category_hierarchy.sql** - SQL миграция для расширения таблицы
2. **seed_justweed.sql** - Полные данные категорий JUSTWEED
3. **justweed_categories.json** - JSON структура для reference
4. **FRONTEND_CATEGORIES_GUIDE.md** - Гайд для frontend разработчика

## Применение изменений

### Вариант A: Чистая установка (рекомендуется для dev)

```bash
# 1. Запустить PostgreSQL
docker compose up -d

# 2. Удалить старую БД и создать новую
docker exec -it botshop-postgres-1 psql -U nikita -d postgres -c "DROP DATABASE IF EXISTS botshop;"
docker exec -it botshop-postgres-1 psql -U nikita -d postgres -c "CREATE DATABASE botshop;"

# 3. Применить начальную миграцию
venv/bin/alembic upgrade head

# 4. Применить миграцию категорий
docker exec -i botshop-postgres-1 psql -U nikita -d botshop < migrations/add_category_hierarchy.sql

# 5. Загрузить JUSTWEED категории
docker exec -i botshop-postgres-1 psql -U nikita -d botshop < seed_justweed.sql
```

### Вариант B: Обновление существующей БД

```bash
# 1. Запустить PostgreSQL (если не запущен)
docker compose up -d

# 2. Очистить старые категории
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "TRUNCATE categories CASCADE;"

# 3. Применить миграцию
docker exec -i botshop-postgres-1 psql -U nikita -d botshop < migrations/add_category_hierarchy.sql

# 4. Загрузить JUSTWEED категории
docker exec -i botshop-postgres-1 psql -U nikita -d botshop < seed_justweed.sql
```

## Проверка результата

```bash
# Проверить родительские категории
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "
SELECT id, name, is_info_only, coming_soon
FROM categories
WHERE parent_id IS NULL
ORDER BY sort_order;
"

# Проверить дочерние категории Flower
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "
SELECT id, name, parent_id
FROM categories
WHERE parent_id = 1
ORDER BY sort_order;
"

# Полная структура
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "
SELECT
  COALESCE(p.name, c.name) as parent_name,
  c.name as category_name,
  c.is_info_only,
  c.coming_soon
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id
ORDER BY COALESCE(p.sort_order, c.sort_order), c.sort_order;
"
```

## Тестирование API

```bash
# Запустить backend
venv/bin/uvicorn app.main:app --reload

# Получить все корневые категории
curl http://localhost:8000/api/v1/categories

# Получить корневые категории с детьми
curl "http://localhost:8000/api/v1/categories?include_children=true"

# Получить дочерние категории Flower (id=1)
curl "http://localhost:8000/api/v1/categories?parent_id=1"

# Только активные категории
curl "http://localhost:8000/api/v1/categories?is_active=true"
```

## Структура категорий (итого)

**8 родительских категорий:**
- Flower (product) → 9 подкатегорий
- Edibles (product) → 5 подкатегорий
- Pre-Rolls (product) → 4 подкатегории
- Delivery (info) → 4 подкатегории
- Payments (info) → 4 подкатегории
- Education (info) → 4 подкатегории
- Merch (coming soon) → 4 подкатегории
- Support (info) → 3 подкатегории

**Всего: 45 категорий**

## API Response Example

```json
{
  "id": 1,
  "name": "Flower",
  "slug": "flower",
  "sort_order": 1,
  "parent_id": null,
  "is_active": true,
  "is_info_only": false,
  "coming_soon": false,
  "children": [
    {
      "id": 11,
      "name": "Premium Strains",
      "slug": "premium-strains",
      "sort_order": 1,
      "parent_id": 1,
      "is_active": true,
      "is_info_only": false,
      "coming_soon": false,
      "children": []
    }
  ]
}
```

## Важно для frontend

1. Product категории: `is_info_only=false` - можно добавлять товары
2. Info категории: `is_info_only=true` - только контент
3. Coming soon: `coming_soon=true` - показывать как disabled
4. Иерархия: максимум 2 уровня (parent → children)

## Следующие шаги

1. ✅ Применить миграцию
2. ✅ Загрузить seed данные
3. ⏳ Добавить товары в product категории (Flower, Edibles, Pre-Rolls)
4. ⏳ Создать контент для info категорий (Delivery, Payments, Education, Support)
5. ⏳ Реализовать frontend отображение
