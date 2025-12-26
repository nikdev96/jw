from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path

from app.api.v1.api import api_router
from app.config import settings

app = FastAPI(
    title="BotShop API",
    description="Backend API for BotShop with Telegram authentication",
    version="1.0.0",
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
