from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.order import Order, OrderCreate
from app.services.order_service import OrderService
from app.services.telegram_bot import TelegramBotService

router = APIRouter()


@router.post("", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Create new order.
    Requires valid Telegram initData in Authorization header.
    """
    order = await OrderService.create_order(
        session,
        user_id=current_user.telegram_id,
        order_data=order_data
    )

    # Send notification to manager via Telegram Bot in background
    background_tasks.add_task(TelegramBotService.notify_new_order, order)

    return order


@router.get("/my", response_model=list[Order])
async def get_my_orders(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get all orders for current user.
    Requires valid Telegram initData in Authorization header.
    """
    orders = await OrderService.get_user_orders(session, current_user.telegram_id)
    return orders


@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get specific order by ID.
    Only returns orders belonging to current user.
    """
    order = await OrderService.get_by_id(
        session,
        order_id=order_id,
        user_id=current_user.telegram_id
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return order
