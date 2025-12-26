#!/bin/bash
set -e  # Exit on error

echo "🔧 JUSTWEED Migration - Safe Apply"
echo "=================================="
echo ""

# 1. Start PostgreSQL
echo "1️⃣  Starting PostgreSQL..."
docker compose up -d
sleep 3

# 2. Clean existing categories (ВАЖНО!)
echo "2️⃣  Cleaning existing categories..."
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "TRUNCATE categories CASCADE;" || echo "⚠️  Table empty or doesn't exist - OK"

# 3. Apply Alembic migration
echo "3️⃣  Applying Alembic migration..."
venv/bin/alembic upgrade head

# 4. Load JUSTWEED categories
echo "4️⃣  Loading JUSTWEED categories..."
docker exec -i botshop-postgres-1 psql -U nikita -d botshop < seed_justweed_SAFE.sql

# 5. Verify
echo "5️⃣  Verifying results..."
echo ""
echo "📊 Parent categories:"
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "
SELECT id, name, is_info_only, coming_soon
FROM categories
WHERE parent_id IS NULL
ORDER BY sort_order;
"

echo ""
echo "📊 Total count:"
docker exec -it botshop-postgres-1 psql -U nikita -d botshop -c "
SELECT
  COUNT(*) FILTER (WHERE parent_id IS NULL) as parents,
  COUNT(*) FILTER (WHERE parent_id IS NOT NULL) as children,
  COUNT(*) as total
FROM categories;
"

echo ""
echo "✅ Migration completed successfully!"
echo ""
echo "🚀 Next steps:"
echo "   - Start backend: venv/bin/uvicorn app.main:app --reload"
echo "   - Test API: curl http://localhost:8000/api/v1/categories"
