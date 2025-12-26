# Development Workflow для JUSTWEED

## Рекомендуемый подход: Git + SSH деплой скрипт

### Workflow разработки

**Локально (на Mac):**
1. Вносишь изменения в код
2. Тестируешь локально (`npm run dev` + `uvicorn`)
3. Коммитишь и пушишь в GitHub
4. Запускаешь деплой скрипт

**На сервере:**
- Скрипт автоматически:
  - Пуллит последние изменения
  - Обновляет зависимости (если нужно)
  - Перезапускает сервисы

---

## Вариант 1: Простой SSH деплой (рекомендую)

### Шаг 1: Создай скрипт деплоя на СЕРВЕРЕ

Подключись к серверу и создай:

```bash
ssh username@34.142.187.226
sudo nano /var/www/justweed/deploy.sh
```

Вставь:

```bash
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
```

Дай права на выполнение:
```bash
chmod +x /var/www/justweed/deploy.sh
```

Настрой sudo без пароля для systemctl (безопасно):
```bash
sudo visudo
```

Добавь в конец (замени `username` на твоего пользователя):
```
username ALL=(ALL) NOPASSWD: /bin/systemctl restart justweed-backend
username ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
```

---

### Шаг 2: Деплой с локальной машины

**Способ A: SSH команда (быстро)**

На Mac добавь в `~/.zshrc` или `~/.bashrc`:

```bash
alias deploy-jw="ssh username@34.142.187.226 'cd /var/www/justweed && ./deploy.sh'"
```

Применить:
```bash
source ~/.zshrc
```

**Теперь деплой в одну команду:**
```bash
git push
deploy-jw
```

**Способ B: Локальный скрипт**

Создай скрипт локально:

```bash
nano ~/deploy-justweed.sh
```

Вставь:
```bash
#!/bin/bash
echo "Pushing to GitHub..."
git push origin main

echo "Deploying to server..."
ssh username@34.142.187.226 'cd /var/www/justweed && ./deploy.sh'

echo "Done! Visit https://surfjw.surf"
```

Дай права:
```bash
chmod +x ~/deploy-justweed.sh
```

Используй:
```bash
~/deploy-justweed.sh
```

---

## Вариант 2: GitHub Actions (автоматический деплой)

Более продвинутый вариант - деплой автоматически при пуше в `main`.

### Настройка:

**1. Создай SSH ключ для GitHub Actions на сервере:**

```bash
# На сервере
ssh-keygen -t ed25519 -f ~/.ssh/github_actions -N ""
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_actions  # Скопируй приватный ключ
```

**2. Добавь secrets в GitHub:**

- Открой https://github.com/nikdev96/jw/settings/secrets/actions
- Добавь secrets:
  - `SERVER_HOST`: `34.142.187.226`
  - `SERVER_USER`: `username` (твой пользователь на сервере)
  - `SERVER_SSH_KEY`: (вставь приватный ключ из `~/.ssh/github_actions`)

**3. Создай workflow файл:**

Локально создай:
```bash
mkdir -p .github/workflows
nano .github/workflows/deploy.yml
```

Вставь:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/justweed
            ./deploy.sh
```

**4. Коммит и пуш:**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions auto-deploy"
git push
```

Теперь каждый `git push` автоматически деплоит на сервер!

---

## Вариант 3: Ручной деплой (для небольших правок)

Если изменения только в frontend:

```bash
# Локально
git push

# На сервере
ssh username@34.142.187.226
cd /var/www/justweed
git pull
cd frontend
npm run build
sudo systemctl reload nginx
```

Если изменения в backend:

```bash
# На сервере
ssh username@34.142.187.226
cd /var/www/justweed
git pull
source venv/bin/activate
alembic upgrade head  # Если есть новые миграции
sudo systemctl restart justweed-backend
```

---

## Мой рекомендуемый workflow:

**Вариант 1** (SSH скрипт) - **ЛУЧШЕ ВСЕГО ДЛЯ НАЧАЛА:**
- ✅ Простой
- ✅ Контролируемый (ты запускаешь деплой вручную)
- ✅ Быстрый
- ✅ Надежный

**Вариант 2** (GitHub Actions) - **когда проект вырастет:**
- ✅ Полностью автоматический
- ✅ Логи деплоя в GitHub
- ⚠️ Чуть сложнее настроить
- ⚠️ Деплоит каждый коммит (может быть излишним)

---

## Быстрая шпаргалка

### Полный цикл разработки:

```bash
# 1. Вноси изменения локально
code frontend/src/pages/HomePage.tsx

# 2. Тестируй локально
npm run dev  # в frontend/
uvicorn app.main:app --reload  # в корне

# 3. Коммит и пуш
git add .
git commit -m "Update homepage design"
git push

# 4. Деплой (один из вариантов):
deploy-jw                    # Если настроил alias
~/deploy-justweed.sh        # Если создал скрипт
# Или автоматически через GitHub Actions
```

---

## Откат изменений (если что-то сломалось)

```bash
# На сервере
cd /var/www/justweed
git log --oneline -5  # Посмотри последние коммиты
git reset --hard abc1234  # Откат к рабочему коммиту
./deploy.sh  # Задеплой старую версию
```

---

## Мониторинг логов после деплоя

```bash
# Backend логи
ssh username@34.142.187.226 'sudo journalctl -u justweed-backend -f'

# Nginx логи
ssh username@34.142.187.226 'sudo tail -f /var/log/nginx/error.log'
```

---

## Рекомендации

1. **Всегда тестируй локально** перед деплоем
2. **Создай ветку `dev`** для разработки, деплой только из `main`
3. **Используй .env.local** для локальной разработки (не коммить!)
4. **Делай бэкапы БД** перед большими изменениями
5. **Логируй изменения** в commit messages

---

## Что дальше?

Настрой **Вариант 1** (SSH деплой скрипт) - это займет 5 минут и сильно упростит жизнь!
