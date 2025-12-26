from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.schemas.product import Product, ProductWithCategory
from app.services.product_service import ProductService

router = APIRouter()


@router.get("", response_model=list[ProductWithCategory])
async def get_products(
    category_id: int | None = Query(None),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get all products. Optionally filter by category_id.
    Only returns active products.
    """
    products = await ProductService.get_all(
        session,
        category_id=category_id,
        only_active=True
    )
    return products


@router.get("/{product_id}", response_model=ProductWithCategory)
async def get_product(
    product_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    """Get product by ID."""
    product = await ProductService.get_by_id(session, product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    if not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not available"
        )

    return product
