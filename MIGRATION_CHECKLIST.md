# Migration Checklist - JUSTWEED Categories

## ✅ Проверено и исправлено

### 1. Foreign Key Constraint
- ❌ **Было:** `ON DELETE CASCADE` (опасно - удаление родителя удаляет всех детей)
- ✅ **Стало:** `ON DELETE RESTRICT` (безопасно - запрещает удаление родителя с детьми)

### 2. Seed данных
- ❌ **Было:** Жёсткие id (конфликты при повторной вставке)
- ✅ **Стало:** DO block с переменными + RETURNING id
- ✅ **Защита:** Проверка на пустоту таблицы перед вставкой

### 3. Slug уникальность
- ✅ **OK:** Уже есть в initial migration (`UNIQUE INDEX ix_categories_slug`)

### 4. Alembic vs Raw SQL
- ❌ **Было:** Только raw SQL миграция
- ✅ **Стало:** Proper Alembic revision файл
- ✅ **Файл:** `alembic/versions/7f8a2c9d1e5b_add_category_hierarchy.py`

---

## 📁 Созданные файлы

### ИСПОЛЬЗУЙ ЭТИ (SAFE):
1. ✅ `alembic/versions/7f8a2c9d1e5b_add_category_hierarchy.py` - Alembic migration
2. ✅ `seed_justweed_SAFE.sql` - Seed данных без жёстких id
3. ✅ `APPLY_MIGRATION.sh` - Автоматический скрипт применения

### НЕ ИСПОЛЬЗУЙ (СТАРЫЕ):
1. ❌ `migrations/add_category_hierarchy.sql` - старая raw SQL миграция
2. ❌ `seed_justweed.sql` - старый seed с жёсткими id

---

## 🚀 Как применить

### Вариант A: Автоматический (рекомендуется)

```bash
./APPLY_MIGRATION.sh
```

### Вариант B: Вручную

```bash
# 1. Запустить PostgreSQL
docker compose up -d

# 2. Очистить старые категории
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "TRUNCATE categories CASCADE;"

# 3. Применить Alembic миграцию
venv/bin/alembic upgrade head

# 4. Загрузить JUSTWEED категории
docker exec -i botshop-postgres-1 psql -U nikita -d botshop < seed_justweed_SAFE.sql

# 5. Проверить результат
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "SELECT COUNT(*) FROM categories;"
```

---

## ⚠️ Важные замечания

1. **Seed данных - CLEAN DB ONLY**
   - Требует пустой таблицы categories
   - Перед запуском: `TRUNCATE categories CASCADE`
   - При наличии данных - упадёт с ошибкой

2. **ON DELETE RESTRICT**
   - Нельзя удалить родительскую категорию, если есть дочерние
   - Сначала удалить всех детей, потом родителя
   - Это защита от случайных удалений

3. **Alembic upgrade head**
   - Применит ВСЕ pending миграции
   - Если БД чистая - применит initial + hierarchy
   - Если уже есть initial - применит только hierarchy

---

## 🧪 Проверка после применения

```bash
# Проверить количество категорий
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "
SELECT
  COUNT(*) FILTER (WHERE parent_id IS NULL) as parents,
  COUNT(*) FILTER (WHERE parent_id IS NOT NULL) as children,
  COUNT(*) as total
FROM categories;
"

# Ожидаемый результат:
# parents | children | total
# --------+----------+-------
#       8 |       37 |    45

# Проверить структуру Flower
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "
SELECT c.name, COUNT(ch.id) as children_count
FROM categories c
LEFT JOIN categories ch ON ch.parent_id = c.id
WHERE c.name = 'Flower'
GROUP BY c.name;
"

# Ожидаемый результат: 9 дочерних категорий
```

---

## 🔧 Если что-то пошло не так

### Откатить миграцию
```bash
venv/bin/alembic downgrade -1
```

### Полный сброс БД
```bash
docker exec -it botshop-postgres-1 psql -U nikita -d postgres -c "DROP DATABASE botshop;"
docker exec -it botshop-postgres-1 psql -U nikita -d postgres -c "CREATE DATABASE botshop;"
venv/bin/alembic upgrade head
docker exec -i botshop-postgres-1 psql -U nikita -d botshop < seed_justweed_SAFE.sql
```

---

## ✅ После успешного применения

1. Удалить старые файлы:
   ```bash
   rm migrations/add_category_hierarchy.sql
   rm seed_justweed.sql
   ```

2. Запустить backend:
   ```bash
   venv/bin/uvicorn app.main:app --reload
   ```

3. Протестировать API:
   ```bash
   curl http://localhost:8000/api/v1/categories
   curl "http://localhost:8000/api/v1/categories?include_children=true"
   ```
