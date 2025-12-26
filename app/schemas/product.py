from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    images: list[str] = []
    category_id: int
    is_active: bool = True
    sort_order: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    images: list[str] | None = None
    category_id: int | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class Product(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ProductWithCategory(Product):
    model_config = ConfigDict(from_attributes=True)

    category: "CategoryInProduct"


class CategoryInProduct(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
