from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.telegram_auth import get_user_from_init_data
from app.database import get_async_session
from app.models.user import User


async def get_current_user(
    authorization: Annotated[str, Header()],
    session: AsyncSession = Depends(get_async_session)
) -> User:
    """
    Dependency to get current user from Telegram initData.

    Expects Authorization header with format: "tma {initData}"
    """
    if not authorization.startswith("tma "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected 'tma {initData}'"
        )

    init_data = authorization[4:]  # Remove "tma " prefix
    user_data = get_user_from_init_data(init_data)

    telegram_id = user_data.get("id")
    if not telegram_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in initData"
        )

    result = await session.execute(
        select(User).where(User.telegram_id == telegram_id)
    )
    user = result.scalar_one_or_none()

    # Lazy onboarding: create user on first request
    # This is intentional for Telegram Mini App MVP - no explicit registration needed
    if not user:
        user = User(
            telegram_id=telegram_id,
            username=user_data.get("username"),
            first_name=user_data.get("first_name"),
            last_name=user_data.get("last_name")
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)

    return user
