from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    slug: str
    sort_order: int = 0
    parent_id: int | None = None
    is_active: bool = True
    is_info_only: bool = False
    coming_soon: bool = False


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    sort_order: int | None = None
    parent_id: int | None = None
    is_active: bool | None = None
    is_info_only: bool | None = None
    coming_soon: bool | None = None


class Category(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class CategoryWithChildren(Category):
    children: list["Category"] = []


# Support forward reference
CategoryWithChildren.model_rebuild()
