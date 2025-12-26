from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.enums import OrderStatus
from app.schemas.order import OrderCreate
from app.services.product_service import ProductService


class OrderService:
    @staticmethod
    async def create_order(
        session: AsyncSession,
        user_id: int,
        order_data: OrderCreate
    ) -> Order:
        """Create new order with items. Validates products and calculates total."""

        # Get all products
        product_ids = [item.product_id for item in order_data.items]
        products = await ProductService.get_by_ids(session, product_ids)

        if len(products) != len(product_ids):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Some products not found"
            )

        # Check if all products are active
        inactive_products = [p for p in products if not p.is_active]
        if inactive_products:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Some products are not available"
            )

        # Create products dict for easy access
        products_dict = {p.id: p for p in products}

        # Calculate total and create order items
        total_amount = Decimal("0")
        order_items = []

        for item_data in order_data.items:
            product = products_dict[item_data.product_id]
            item_total = product.price * item_data.quantity
            total_amount += item_total

            order_item = OrderItem(
                product_id=product.id,
                product_name=product.name,
                quantity=item_data.quantity,
                price=product.price
            )
            order_items.append(order_item)

        # Create order
        order = Order(
            user_id=user_id,
            status=OrderStatus.PENDING,
            total_amount=total_amount,
            delivery_address=order_data.delivery_address,
            phone=order_data.phone,
            comment=order_data.comment,
            items=order_items
        )

        session.add(order)
        await session.commit()
        await session.refresh(order, ["items"])

        return order

    @staticmethod
    async def get_user_orders(
        session: AsyncSession,
        user_id: int
    ) -> list[Order]:
        """Get all orders for a user."""
        result = await session.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(
        session: AsyncSession,
        order_id: int,
        user_id: int | None = None
    ) -> Order | None:
        """Get order by ID. Optionally filter by user_id."""
        query = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order_id)
        )

        if user_id is not None:
            query = query.where(Order.user_id == user_id)

        result = await session.execute(query)
        return result.scalar_one_or_none()
