# Git Workflow для JUSTWEED

## Стратегия веток

### Основные ветки:

**`main`** - Production ветка
- Всегда стабильная и рабочая
- Деплоится на сервер https://surfjw.surf
- Merge только протестированного кода

**`dev`** - Development ветка
- Основная разработка
- Можно ломать и экспериментировать
- Тестируешь локально перед merge в main

**`feature/*`** - Feature ветки (опционально)
- Для больших фич
- Примеры: `feature/payment`, `feature/admin-panel`

---

## Простой workflow (рекомендую)

### Setup (один раз):

```bash
# Создай dev ветку
git checkout -b dev
git push -u origin dev

# Переключись обратно на main
git checkout main
```

### Ежедневная разработка:

```bash
# 1. Переключись на dev
git checkout dev

# 2. Вноси изменения
code frontend/src/pages/HomePage.tsx

# 3. Тестируй локально
npm run dev

# 4. Коммит в dev
git add .
git commit -m "Update homepage design"
git push origin dev

# Продолжай работать в dev сколько хочешь
```

### Когда готов задеплоить на production:

```bash
# 1. Убедись что dev работает
# Протестируй локально!

# 2. Переключись на main
git checkout main

# 3. Merge dev в main
git merge dev

# 4. Push в main
git push origin main

# 5. На сервере - pull
ssh username@34.142.187.226
cd /var/www/justweed
git pull origin main
cd frontend && npm run build
sudo systemctl restart justweed-backend
```

---

## Еще проще (если не хочешь париться):

### Вариант A: main + feature ветки

```bash
# Для новой фичи
git checkout -b feature/new-design
# работаешь
git add . && git commit -m "New design"
git push origin feature/new-design

# Когда готово
git checkout main
git merge feature/new-design
git push origin main

# На сервере
git pull origin main
```

### Вариант B: только main (самый простой, но рискованный)

```bash
# НЕ рекомендую для production!
git add .
git commit -m "Changes"
git push origin main

# На сервере сразу pull
ssh server "cd /var/www/justweed && git pull"
```

⚠️ **Проблема**: если код сломан - production тоже сломается!

---

## Что происходит на сервере:

### Текущая настройка:

```bash
# На сервере в /var/www/justweed
git branch
# Показывает: main
```

Сервер всегда на ветке `main`.

### Чтобы сменить ветку на сервере (НЕ делай это):

```bash
# НЕ ДЕЛАЙ! Сервер должен быть на main
git checkout dev  # ❌ Плохо
```

---

## Мой совет для тебя:

### Используй 2 ветки: `main` + `dev`

**Локальная разработка:**
```bash
git checkout dev
# работаешь
git add . && git commit -m "Work in progress"
git push origin dev
```

**Деплой на production:**
```bash
git checkout main
git merge dev
git push origin main

# На сервере
ssh username@34.142.187.226 "cd /var/www/justweed && git pull origin main && cd frontend && npm run build && sudo systemctl restart justweed-backend"
```

---

## Защита от ошибок:

### 1. Protected branches на GitHub

Открой: https://github.com/nikdev96/jw/settings/branches

**Add rule:**
- Branch name pattern: `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass

Теперь нельзя напрямую push в main (только через PR).

### 2. Git hooks (локально)

Создай `.git/hooks/pre-push`:
```bash
#!/bin/bash
current_branch=$(git branch --show-current)

if [ "$current_branch" = "main" ]; then
    echo "⚠️  WARNING: Pushing to main!"
    read -p "Are you sure? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
```

---

## Hotfix (срочные исправления)

Если production сломался:

```bash
# Создай hotfix ветку от main
git checkout main
git checkout -b hotfix/critical-bug

# Исправь
git add . && git commit -m "Fix critical bug"

# Merge в main
git checkout main
git merge hotfix/critical-bug
git push origin main

# На сервере
git pull origin main
```

---

## Команды для работы с ветками:

```bash
# Посмотреть текущую ветку
git branch

# Посмотреть все ветки (включая remote)
git branch -a

# Переключиться на ветку
git checkout dev

# Создать и переключиться
git checkout -b feature/new-thing

# Удалить локальную ветку
git branch -d feature/old-thing

# Удалить remote ветку
git push origin --delete feature/old-thing

# Merge ветки
git checkout main
git merge dev

# Посмотреть разницу между ветками
git diff main..dev
```

---

## Пример реального workflow:

### День 1-3: Разработка новой фичи

```bash
git checkout dev
# работаешь 3 дня
git add . && git commit -m "Day 1"
git push origin dev

git add . && git commit -m "Day 2"
git push origin dev

git add . && git commit -m "Day 3 - feature ready"
git push origin dev
```

### День 4: Деплой на production

```bash
# Финальный тест локально
npm run dev
# все работает!

# Merge в main
git checkout main
git merge dev
git push origin main

# Деплой
ssh username@34.142.187.226
cd /var/www/justweed
git pull origin main
cd frontend && npm run build
sudo systemctl restart justweed-backend
exit

# Проверка
curl https://surfjw.surf
# работает!
```

---

## Структура твоего репозитория:

```
nikdev96/jw
├── main (production) ← сервер
├── dev (development) ← ты работаешь здесь
└── feature/* (optional)
```

---

## Quick Start для тебя ПРЯМО СЕЙЧАС:

```bash
# 1. Создай dev ветку
git checkout -b dev
git push -u origin dev

# 2. В дальнейшем:
# Всегда работай в dev
git checkout dev

# Деплой только когда все работает:
git checkout main
git merge dev
git push
```

---

## Итого - что использовать:

**Для тебя оптимально:**
- `main` - production (на сервере)
- `dev` - твоя рабочая ветка

**Workflow:**
1. Работаешь в `dev`
2. Коммитишь сколько хочешь
3. Когда готово - merge в `main`
4. Push `main`
5. На сервере `git pull origin main`

Просто, безопасно, работает! 🚀
