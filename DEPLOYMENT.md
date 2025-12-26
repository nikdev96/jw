# Deployment Guide

## Миграция БД: image_url → images

### Шаг 1: Проверка текущего состояния

```bash
# Проверить текущую версию БД
alembic current

# Проверить pending миграции
alembic history
```

### Шаг 2: Backup БД (ОБЯЗАТЕЛЬНО)

```bash
# Создать backup перед миграцией
pg_dump -U user -d botshop -F c -f backup_before_images_$(date +%Y%m%d_%H%M%S).dump

# Или полный SQL backup
pg_dump -U user -d botshop > backup_before_images_$(date +%Y%m%d_%H%M%S).sql
```

### Шаг 3: Применить миграцию

```bash
# Применить миграцию
alembic upgrade head

# Проверить результат
alembic current
```

### Шаг 4: Проверка данных

```sql
-- Проверить что данные перенеслись
SELECT id, name, images FROM products LIMIT 10;

-- Проверить что нет пустых images у товаров с фото
SELECT COUNT(*) FROM products WHERE images = '[]'::json;

-- Посмотреть примеры
SELECT name, images FROM products WHERE json_array_length(images) > 0 LIMIT 5;
```

### Откат (если что-то пошло не так)

```bash
# Откатить миграцию
alembic downgrade -1

# Восстановить из backup
pg_restore -U user -d botshop -c backup_before_images_YYYYMMDD_HHMMSS.dump
```

---

## Production Deployment

### 1. Подготовка окружения

```bash
# Клонировать на сервер
git clone https://github.com/yourusername/botshop.git
cd botshop

# Создать venv
python3.12 -m venv venv
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt
```

### 2. Настройка .env

```bash
cp .env.example .env
nano .env
```

**Обязательные переменные:**
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/botshop
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
MANAGER_CHAT_ID=123456789
DEBUG=False
```

### 3. Настройка PostgreSQL

```bash
# Создать пользователя и БД
sudo -u postgres psql

CREATE USER botshop WITH PASSWORD 'secure_password';
CREATE DATABASE botshop OWNER botshop;
GRANT ALL PRIVILEGES ON DATABASE botshop TO botshop;
\q
```

### 4. Применить миграции

```bash
# Создать схему БД
alembic upgrade head

# Проверить
alembic current
```

### 5. Загрузить тестовые данные (опционально)

```bash
# Только для staging/dev
psql -U botshop -d botshop < seed_data.sql
```

### 6. Настройка systemd service

```bash
sudo nano /etc/systemd/system/botshop.service
```

```ini
[Unit]
Description=BotShop FastAPI Application
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/botshop
Environment="PATH=/var/www/botshop/venv/bin"
ExecStart=/var/www/botshop/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Запустить сервис
sudo systemctl daemon-reload
sudo systemctl enable botshop
sudo systemctl start botshop

# Проверить статус
sudo systemctl status botshop
```

### 7. Nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/botshop
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Активировать конфиг
sudo ln -s /etc/nginx/sites-available/botshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL с Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 9. Обновить CORS в коде

**Файл:** `app/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourdomain.com",
        "https://your-telegram-miniapp.web.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Мониторинг

### Логи

```bash
# Логи приложения
sudo journalctl -u botshop -f

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Check

```bash
# Проверить API
curl http://localhost:8000/health

# Ожидаемый ответ
{"status":"ok"}
```

---

## Обновление кода

```bash
# На сервере
cd /var/www/botshop
git pull origin main

# Применить новые миграции (если есть)
source venv/bin/activate
alembic upgrade head

# Перезапустить сервис
sudo systemctl restart botshop

# Проверить
sudo systemctl status botshop
```

---

## Backup & Recovery

### Автоматический backup (cron)

```bash
sudo crontab -e
```

```cron
# Backup каждый день в 3:00
0 3 * * * pg_dump -U botshop -d botshop -F c -f /backups/botshop_$(date +\%Y\%m\%d).dump

# Удалять backups старше 7 дней
0 4 * * * find /backups -name "botshop_*.dump" -mtime +7 -delete
```

### Восстановление

```bash
# Остановить приложение
sudo systemctl stop botshop

# Восстановить БД
pg_restore -U botshop -d botshop -c /backups/botshop_YYYYMMDD.dump

# Запустить приложение
sudo systemctl start botshop
```

---

## Security Checklist

- [x] ✅ DEBUG=False в production
- [x] ✅ CORS настроен на конкретные домены
- [x] ✅ HTTPS включен
- [x] ✅ PostgreSQL доступен только localhost
- [x] ✅ Firewall настроен (ufw)
- [x] ✅ Secrets в environment variables
- [x] ✅ Регулярные backups настроены
- [ ] Rate limiting на API (опционально)
- [ ] Monitoring (Sentry/Grafana) настроен (опционально)

---

## Troubleshooting

### Приложение не запускается

```bash
# Проверить логи
sudo journalctl -u botshop -n 50

# Проверить порт
sudo netstat -tulpn | grep 8000

# Проверить .env
cat .env | grep -v PASSWORD
```

### БД недоступна

```bash
# Проверить PostgreSQL
sudo systemctl status postgresql

# Проверить подключение
psql -U botshop -d botshop -c "SELECT 1"
```

### Миграции не применяются

```bash
# Проверить текущую версию
alembic current

# Проверить pending миграции
alembic history

# Принудительно установить версию (осторожно!)
alembic stamp head
```

---

## Performance Tuning

### PostgreSQL

```sql
-- Увеличить shared_buffers
-- /etc/postgresql/14/main/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
```

### Uvicorn workers

```bash
# В systemd service
ExecStart=/var/www/botshop/venv/bin/uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker
```

---

## Готово к продакшену

Следуйте шагам последовательно. После deployment проверьте все endpoints через `/docs`.
