from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.category import Category


class CategoryService:
    @staticmethod
    async def get_all(
        session: AsyncSession,
        parent_id: int | None = None,
        is_active: bool | None = None,
        include_children: bool = False
    ) -> list[Category]:
        """Get categories with optional filters"""
        query = select(Category)

        # Filter by parent_id
        if parent_id is None:
            query = query.where(Category.parent_id.is_(None))
        else:
            query = query.where(Category.parent_id == parent_id)

        # Filter by is_active
        if is_active is not None:
            query = query.where(Category.is_active == is_active)

        # Include children relationship
        if include_children:
            query = query.options(selectinload(Category.children))

        query = query.order_by(Category.sort_order, Category.name)

        result = await session.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(session: AsyncSession, category_id: int, include_children: bool = False) -> Category | None:
        query = select(Category).where(Category.id == category_id)

        if include_children:
            query = query.options(selectinload(Category.children))

        result = await session.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_slug(session: AsyncSession, slug: str, include_children: bool = False) -> Category | None:
        query = select(Category).where(Category.slug == slug)

        if include_children:
            query = query.options(selectinload(Category.children))

        result = await session.execute(query)
        return result.scalar_one_or_none()
