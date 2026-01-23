.PHONY: dev dev-d stop logs clean migrate shell prod prod-stop prod-logs prod-status

# Запуск dev окружения
dev:
	docker compose --env-file .env.dev -f docker-compose.dev.yml up --build

# Запуск в фоне
dev-d:
	docker compose --env-file .env.dev -f docker-compose.dev.yml up -d --build

# Остановка
stop:
	docker compose -f docker-compose.dev.yml down

# Логи
logs:
	docker compose -f docker-compose.dev.yml logs -f

# Полная очистка (включая volumes)
clean:
	docker compose -f docker-compose.dev.yml down -v

# Применить миграции
migrate:
	docker compose -f docker-compose.dev.yml exec backend alembic upgrade head

# Открыть shell в backend
shell:
	docker compose -f docker-compose.dev.yml exec backend bash

# Production commands (use with .env.prod and docker-compose.yml)
prod:
	@echo "🚀 Starting production with external database..."
	@echo "Make sure .env.prod file exists with real values"
	@if [ ! -f .env.prod ]; then \
		echo "❌ .env.prod file not found. Copy .env.prod.example and fill with real values"; \
		exit 1; \
	fi
	@echo "✅ Production database and environment configured"
	@echo "📝 Deploy your backend/frontend separately to connect to this database"

prod-stop:
	@echo "🛑 Stopping production database..."
	docker compose -f docker-compose.yml down

prod-logs:
	@echo "📋 Production database logs:"
	docker compose -f docker-compose.yml logs -f postgres

prod-status:
	@echo "📊 Production services status:"
	docker compose -f docker-compose.yml ps
