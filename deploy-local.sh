#!/bin/bash

# JUSTWEED - Local Deploy Script
# Этот скрипт запускается ЛОКАЛЬНО на Mac для деплоя на сервер

set -e

echo "🚀 JUSTWEED Deploy Script"
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Конфигурация (измени на свои данные)
SERVER_USER="your_username"  # ЗАМЕНИ на username на сервере
SERVER_HOST="34.142.187.226"
PROJECT_DIR="/var/www/justweed"

# Проверка uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 1. Push to GitHub
echo -e "${GREEN}📤 Pushing to GitHub...${NC}"
git push origin main

# 2. Deploy to server
echo -e "${GREEN}🌐 Deploying to server...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} "cd ${PROJECT_DIR} && ./deploy.sh"

# 3. Success
echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Visit: https://surfjw.surf${NC}"
