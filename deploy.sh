#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Переходим в директорию проекта
cd /var/www/justweed

# Пуллим последние изменения
echo "📦 Pulling latest changes from GitHub..."
git pull origin main

# Backend: обновляем зависимости если requirements.txt изменился
if git diff HEAD@{1} HEAD --name-only | grep -q "requirements.txt"; then
    echo "📚 Installing backend dependencies..."
    source venv/bin/activate
    pip install -r requirements.txt
fi

# Backend: применяем миграции если есть новые
echo "🗄️  Running database migrations..."
source venv/bin/activate
alembic upgrade head

# Frontend: проверяем изменения в package.json
if git diff HEAD@{1} HEAD --name-only | grep -q "frontend/package.json"; then
    echo "📚 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Frontend: собираем production build
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

# Перезапускаем backend сервис
echo "♻️  Restarting backend service..."
sudo systemctl restart justweed-backend

# Перезагружаем nginx
echo "♻️  Reloading nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
echo "🌐 Visit: https://surfjw.surf"
