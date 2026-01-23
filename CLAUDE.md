# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JUSTWEED is a Telegram Mini App e-commerce platform for a cannabis dispensary. It consists of a FastAPI async backend and React/TypeScript frontend, with Telegram WebApp authentication.

## Commands

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server (port 8000)
uvicorn app.main:app --reload

# Database migrations
alembic upgrade head              # Apply all migrations
alembic revision -m "description" # Create new migration

# Start PostgreSQL (Docker)
docker compose up -d
```

### Frontend

```bash
cd frontend

npm install      # Install dependencies
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run lint     # ESLint check
```

### Environment Setup

Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` - PostgreSQL async connection string
- `TELEGRAM_BOT_TOKEN` - Bot token for manager notifications
- `MANAGER_CHAT_ID` - Telegram chat ID for order alerts
- `FRONTEND_URL` / `FRONTEND_DEV_URL` - CORS allowed origins

## Architecture

### Backend (Python/FastAPI)

```
app/
├── main.py           # FastAPI app, CORS, rate limiting (slowapi)
├── config.py         # Pydantic Settings from environment
├── database.py       # Async SQLAlchemy + PostgreSQL
├── api/v1/
│   ├── deps.py       # get_current_user dependency (Telegram auth)
│   └── endpoints/    # REST endpoints (categories, products, orders, users)
├── models/           # SQLAlchemy ORM models
├── schemas/          # Pydantic request/response schemas
├── services/         # Business logic layer (all DB queries here)
└── core/
    └── telegram_auth.py  # HMAC-SHA256 initData validation
```

### Frontend (React/TypeScript/Vite)

```
frontend/src/
├── api/client.ts     # Fetch-based API client with Authorization header
├── components/       # Reusable UI (BottomNavigation, ProductPreviewModal, etc.)
├── hooks/
│   └── useTelegram.ts  # Telegram WebApp SDK integration
├── pages/            # Route components (HomePage, CartPage, CheckoutPage, etc.)
├── types/            # TypeScript interfaces
└── utils/cart.ts     # localStorage cart helpers
```

### Key Patterns

- **Telegram Auth**: All protected endpoints require `Authorization: tma {initData}` header. Validation uses HMAC-SHA256 with 1-hour auth_date window.
- **Lazy User Onboarding**: Users are created automatically on first authenticated request.
- **Client-Side Cart**: Cart state stored in localStorage, no backend session needed.
- **Service Layer**: All database operations isolated in `app/services/`.
- **Async-First**: SQLAlchemy AsyncSession, httpx for external API calls.
- **Rate Limiting**: slowapi middleware applied globally.

### API Design

- **Public**: `GET /api/v1/categories`, `GET /api/v1/products`
- **Protected**: `POST /api/v1/orders`, `GET /api/v1/orders/my`, `GET /api/v1/users/me`

### Database

PostgreSQL with Alembic migrations. Key models:
- `Category` - Hierarchical (parent_id), with is_active/is_info_only/coming_soon flags
- `Product` - Price (Numeric), images (JSON array), type, THC percentage
- `Order` / `OrderItem` - Status enum, price snapshots at order time
- `User` - Telegram user data (telegram_id as primary identifier)

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy 2.0 async, Alembic, asyncpg, slowapi
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide icons
- **Database**: PostgreSQL 15
- **Auth**: Telegram WebApp initData (HMAC-SHA256)
- **Currency**: Thai Baht (฿)
