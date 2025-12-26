from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.product import Product


class ProductService:
    @staticmethod
    async def get_all(
        session: AsyncSession,
        category_id: int | None = None,
        only_active: bool = True
    ) -> list[Product]:
        query = select(Product).options(selectinload(Product.category))

        if only_active:
            query = query.where(Product.is_active == True)

        if category_id is not None:
            query = query.where(Product.category_id == category_id)

        query = query.order_by(Product.sort_order, Product.name)

        result = await session.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(session: AsyncSession, product_id: int) -> Product | None:
        result = await session.execute(
            select(Product)
            .options(selectinload(Product.category))
            .where(Product.id == product_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_ids(session: AsyncSession, product_ids: list[int]) -> list[Product]:
        result = await session.execute(
            select(Product).where(Product.id.in_(product_ids))
        )
        return list(result.scalars().all())
