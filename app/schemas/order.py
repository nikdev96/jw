from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import OrderStatus


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderItemInDB(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    product_name: str
    quantity: int
    price: Decimal


class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(min_length=1)
    delivery_address: str | None = None
    phone: str | None = None
    comment: str | None = None


class OrderUpdate(BaseModel):
    status: OrderStatus | None = None
    delivery_address: str | None = None
    phone: str | None = None
    comment: str | None = None


class Order(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    status: OrderStatus
    total_amount: Decimal
    delivery_address: str | None
    phone: str | None
    comment: str | None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemInDB]
