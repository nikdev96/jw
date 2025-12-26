from typing import Union
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.schemas.category import Category, CategoryWithChildren
from app.services.category_service import CategoryService

router = APIRouter()


@router.get("", response_model=Union[list[Category], list[CategoryWithChildren]])
async def get_categories(
    parent_id: int | None = Query(None, description="Filter by parent category ID. Use 'null' for root categories"),
    is_active: bool | None = Query(None, description="Filter by active status"),
    include_children: bool = Query(False, description="Include child categories in response"),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get categories with optional filters.

    Examples:
    - GET /categories - All root categories
    - GET /categories?parent_id=1 - Children of category 1
    - GET /categories?include_children=true - Root categories with their children
    - GET /categories?is_active=true - Only active categories
    """
    categories = await CategoryService.get_all(
        session,
        parent_id=parent_id,
        is_active=is_active,
        include_children=include_children
    )
    return categories


@router.get("/{category_id}", response_model=Category)
async def get_category(
    category_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    """Get a single category by ID"""
    category = await CategoryService.get_by_id(session, category_id)
    if not category:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Category not found")
    return category
