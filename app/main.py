from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.api.v1.api import api_router
from app.config import settings

app = FastAPI(
    title="BotShop API",
    description="Backend API for BotShop with Telegram authentication",
    version="1.0.0",
    debug=settings.DEBUG
)

# Setup rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Build allowed origins list
allowed_origins = [settings.FRONTEND_URL]
if settings.DEBUG and settings.FRONTEND_DEV_URL:
    allowed_origins.append(settings.FRONTEND_DEV_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "BotShop API"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/test_miniapp.html")
async def test_miniapp():
    html_path = Path(__file__).parent.parent / "test_miniapp.html"
    return FileResponse(html_path, media_type="text/html")
