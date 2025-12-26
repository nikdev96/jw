# Промпт для развертывания JUSTWEED на сервере

Привет! Я Claude Code, помоги мне развернуть Telegram Mini App **JUSTWEED** на этом сервере.

## Контекст проекта

**Стек:**
- Backend: FastAPI + PostgreSQL + SQLAlchemy 2.0 async
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Репозиторий: `git@github.com:nikdev96/jw.git` (приватный, доступ по SSH)

**Что нужно сделать:**
1. Установить все необходимые зависимости
2. Клонировать репозиторий
3. Настроить PostgreSQL
4. Настроить Backend (FastAPI с uvicorn)
5. Собрать Frontend (production build)
6. Настроить Nginx как reverse proxy + static files
7. Настроить SSL (Let's Encrypt) для домена
8. Привязать доменное имя к серверу
9. Создать systemd сервисы для автозапуска
10. Применить миграции БД и seed данные

---

## Доменное имя

**Домен:** [ТУТ_ВВЕДИ_СВОЙ_ДОМЕН] (например: `justweed.example.com`)

**DNS записи уже настроены:**
- A-запись указывает на IP этого сервера
- (проверь: `dig +short justweed.example.com` должен показать IP сервера)

---

## Системные требования

**ОС:** Ubuntu 22.04 / Debian 11+ (или что установлено)

**Порты:**
- 80 (HTTP) - открыт
- 443 (HTTPS) - открыт
- 22 (SSH) - открыт

---

## Шаг 1: Установка зависимостей

Установи следующие пакеты:

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Python 3.11+
sudo apt install python3.11 python3.11-venv python3-pip -y

# PostgreSQL 15+
sudo apt install postgresql postgresql-contrib -y

# Node.js 20+ и npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Nginx
sudo apt install nginx -y

# Git
sudo apt install git -y

# Certbot для SSL
sudo apt install certbot python3-certbot-nginx -y

# Дополнительные утилиты
sudo apt install curl wget build-essential -y
```

**Проверь версии:**
```bash
python3.11 --version  # >= 3.11
node --version        # >= 20.x
npm --version         # >= 10.x
psql --version        # >= 15.x
nginx -v              # >= 1.18
```

---

## Шаг 2: Настройка PostgreSQL

**2.1. Создай пользователя и БД:**

```bash
sudo -u postgres psql
```

В psql выполни:
```sql
CREATE USER justweed_user WITH PASSWORD 'СИЛЬНЫЙ_ПАРОЛЬ_СГЕНЕРИРУЙ';
CREATE DATABASE justweed_db OWNER justweed_user;
GRANT ALL PRIVILEGES ON DATABASE justweed_db TO justweed_user;
\q
```

**2.2. Проверь подключение:**
```bash
psql -U justweed_user -d justweed_db -h localhost
# Введи пароль, должно подключиться
\q
```

---

## Шаг 3: Клонирование репозитория

**3.1. Настройка SSH ключа для GitHub:**

Если SSH ключ для GitHub еще не настроен:
```bash
# Сгенерируй SSH ключ (если нет)
ssh-keygen -t ed25519 -C "server@justweed" -f ~/.ssh/id_ed25519 -N ""

# Выведи публичный ключ
cat ~/.ssh/id_ed25519.pub
```

→ **Добавь этот ключ в GitHub:**
- Зайди в настройки репозитория `nikdev96/jw`
- Settings → Deploy keys → Add deploy key
- Вставь публичный ключ, дай доступ на чтение

**3.2. Клонируй репозиторий:**

```bash
cd /var/www
sudo mkdir -p justweed
sudo chown $USER:$USER justweed
cd justweed

# Клонируй
git clone git@github.com:nikdev96/jw.git .
```

---

## Шаг 4: Настройка Backend

**4.1. Создай виртуальное окружение:**

```bash
cd /var/www/justweed
python3.11 -m venv venv
source venv/bin/activate
```

**4.2. Установи зависимости:**

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**4.3. Создай `.env` файл:**

```bash
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql+asyncpg://justweed_user:ТВОЙ_ПАРОЛЬ@localhost:5432/justweed_db

# Telegram Bot
TELEGRAM_BOT_TOKEN=ТВОЙ_ТОКЕН_БОТА_ОТ_BOTFATHER
TELEGRAM_BOT_USERNAME=ТВОЙ_БОТ_USERNAME

# App
SECRET_KEY=СГЕНЕРИРУЙ_СЛУЧАЙНЫЙ_КЛЮЧ_64_СИМВОЛА
ENVIRONMENT=production
DEBUG=False

# CORS (домен без https://)
ALLOWED_ORIGINS=https://justweed.example.com

# API
API_V1_PREFIX=/api/v1
EOF
```

**Замени:**
- `ТВОЙ_ПАРОЛЬ` → пароль от PostgreSQL
- `ТВОЙ_ТОКЕН_БОТА_ОТ_BOTFATHER` → токен бота
- `ТВОЙ_БОТ_USERNAME` → username бота (без @)
- `СГЕНЕРИРУЙ_СЛУЧАЙНЫЙ_КЛЮЧ_64_СИМВОЛА` → openssl rand -hex 32
- `justweed.example.com` → твой домен

**4.4. Примени миграции:**

```bash
source venv/bin/activate
alembic upgrade head
```

**4.5. Загрузи seed данные (категории + тестовые товары):**

```bash
psql -U justweed_user -d justweed_db -h localhost < seed_justweed_SAFE.sql
psql -U justweed_user -d justweed_db -h localhost < seed_ux_test_products.sql
```

**4.6. Проверь запуск:**

```bash
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

→ Открой `http://IP_СЕРВЕРА:8000/docs` в браузере
→ Должен открыться Swagger UI
→ Ctrl+C для остановки

---

## Шаг 5: Настройка Frontend

**5.1. Установи зависимости:**

```bash
cd /var/www/justweed/frontend
npm install
```

**5.2. Создай `.env` для production:**

```bash
cat > .env << 'EOF'
VITE_API_URL=https://justweed.example.com/api/v1
EOF
```

**Замени** `justweed.example.com` на твой домен.

**5.3. Собери production build:**

```bash
npm run build
```

→ Должна появиться папка `dist/` с compiled файлами

---

## Шаг 6: Настройка Nginx

**6.1. Создай конфигурацию:**

```bash
sudo nano /etc/nginx/sites-available/justweed
```

Вставь:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name justweed.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name justweed.example.com;

    # SSL certificates (будут созданы certbot'ом)
    ssl_certificate /etc/letsencrypt/live/justweed.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/justweed.example.com/privkey.pem;

    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend static files
    root /var/www/justweed/frontend/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend docs (опционально, для /docs)
    location /docs {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /openapi.json {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
}
```

**Замени** `justweed.example.com` на твой домен (4 места).

**6.2. Включи конфигурацию:**

```bash
sudo ln -s /etc/nginx/sites-available/justweed /etc/nginx/sites-enabled/
sudo nginx -t  # Проверка конфигурации
```

**НЕ перезапускай nginx пока!** Сначала получим SSL сертификат.

---

## Шаг 7: Получение SSL сертификата

**7.1. Создай директорию для certbot:**

```bash
sudo mkdir -p /var/www/certbot
```

**7.2. Временно запусти nginx без SSL:**

Отредактируй `/etc/nginx/sites-available/justweed`:
- Закомментируй весь `server` блок для 443 порта
- Оставь только блок для 80 порта

```bash
sudo nano /etc/nginx/sites-available/justweed
```

Или создай временный конфиг:

```bash
sudo bash -c 'cat > /etc/nginx/sites-available/justweed-temp << EOF
server {
    listen 80;
    server_name justweed.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        root /var/www/justweed/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF'

sudo rm /etc/nginx/sites-enabled/justweed
sudo ln -s /etc/nginx/sites-available/justweed-temp /etc/nginx/sites-enabled/justweed
sudo nginx -t && sudo systemctl reload nginx
```

**7.3. Получи сертификат:**

```bash
sudo certbot certonly --webroot -w /var/www/certbot -d justweed.example.com
```

→ Следуй инструкциям
→ Введи email для уведомлений
→ Согласись с Terms of Service

**7.4. Верни полную конфигурацию nginx:**

```bash
sudo rm /etc/nginx/sites-enabled/justweed
sudo ln -s /etc/nginx/sites-available/justweed /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**7.5. Настрой автообновление SSL:**

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Шаг 8: Создание systemd сервиса для Backend

**8.1. Создай сервис файл:**

```bash
sudo nano /etc/systemd/system/justweed-backend.service
```

Вставь:

```ini
[Unit]
Description=JUSTWEED Backend (FastAPI)
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/justweed
Environment="PATH=/var/www/justweed/venv/bin"
ExecStart=/var/www/justweed/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**8.2. Дай права:**

```bash
sudo chown -R www-data:www-data /var/www/justweed
sudo chmod -R 755 /var/www/justweed
```

**8.3. Запусти сервис:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable justweed-backend
sudo systemctl start justweed-backend
sudo systemctl status justweed-backend
```

→ Должен быть `active (running)`

---

## Шаг 9: Проверка

**9.1. Проверь Backend:**
```bash
curl http://localhost:8000/api/v1/categories
```
→ Должен вернуть JSON с категориями

**9.2. Проверь Frontend:**
```bash
curl -I https://justweed.example.com
```
→ Должен вернуть 200 OK

**9.3. Открой в браузере:**
```
https://justweed.example.com
```
→ Должна открыться главная страница JUSTWEED

---

## Шаг 10: Настройка Telegram Mini App

**10.1. Открой BotFather в Telegram:**
```
/mybots
→ Выбери своего бота
→ Bot Settings
→ Menu Button
→ Configure Menu Button
→ URL: https://justweed.example.com
```

**10.2. Проверь работу:**
- Открой бота в Telegram
- Нажми кнопку меню (внизу)
- Должно открыться Mini App

---

## Логи и мониторинг

**Backend логи:**
```bash
sudo journalctl -u justweed-backend -f
```

**Nginx логи:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**PostgreSQL логи:**
```bash
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

---

## Обновление кода

Когда нужно обновить код из GitHub:

```bash
cd /var/www/justweed
git pull origin main

# Backend
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart justweed-backend

# Frontend
cd frontend
npm install
npm run build

# Перезапусти nginx
sudo systemctl reload nginx
```

---

## Troubleshooting

**Проблема: Backend не запускается**
```bash
sudo journalctl -u justweed-backend -n 100
# Проверь логи на ошибки
```

**Проблема: 502 Bad Gateway**
- Проверь что backend запущен: `sudo systemctl status justweed-backend`
- Проверь что порт 8000 слушается: `sudo netstat -tlnp | grep 8000`

**Проблема: Frontend не обновляется**
```bash
# Пересобери frontend
cd /var/www/justweed/frontend
npm run build
sudo systemctl reload nginx
```

**Проблема: SSL не работает**
```bash
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

---

## Финальный чек-лист

- [ ] PostgreSQL запущен и доступен
- [ ] Backend запущен (`systemctl status justweed-backend`)
- [ ] Frontend собран (`frontend/dist/` существует)
- [ ] Nginx запущен и настроен
- [ ] SSL сертификат получен и работает
- [ ] Домен резолвится в IP сервера
- [ ] Telegram Bot настроен с правильным URL
- [ ] API возвращает данные (curl test)
- [ ] Frontend открывается в браузере
- [ ] Mini App открывается в Telegram

---

**Удачи с деплоем! 🚀**
