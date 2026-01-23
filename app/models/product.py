from decimal import Decimal
from typing import TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, Numeric, Text, JSON, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.order_item import OrderItem


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    images: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    thc: Mapped[Decimal | None] = mapped_column(Numeric(4, 2), nullable=True)

    category: Mapped["Category"] = relationship("Category", back_populates="products")
    order_items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="product")

    __table_args__ = (
        CheckConstraint('thc IS NULL OR (thc >= 0 AND thc <= 100)', name='thc_range_check'),
    )
