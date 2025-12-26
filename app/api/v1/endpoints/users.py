from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import User as UserSchema

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user information.

    Requires valid Telegram initData in Authorization header.
    """
    return current_user
