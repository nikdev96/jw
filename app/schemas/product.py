from decimal import Decimal
from pydantic import BaseModel, ConfigDict, field_validator


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    images: list[str] = []
    category_id: int
    is_active: bool = True
    sort_order: int = 0
    type: str | None = None
    thc: Decimal | None = None

    @field_validator('thc')
    @classmethod
    def validate_thc(cls, v):
        if v is not None:
            if v < 0:
                raise ValueError('THC cannot be negative')
            if v > 100:
                raise ValueError('THC cannot exceed 100%')
        return v


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
    type: str | None = None
    thc: Decimal | None = None


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
