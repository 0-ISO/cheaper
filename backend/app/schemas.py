from pydantic import BaseModel, Field
from typing import List, Optional, Union, Any


class Offer(BaseModel):
    mp: str
    price: int
    delivery: Optional[str] = None
    seller: Optional[str] = None
    rating: Optional[float] = None
    url: Optional[str] = None


class Product(BaseModel):
    id: Union[int, str]
    emoji: str = "📦"
    title: str
    rating: float = 0
    reviews: int = 0
    inStock: bool = True
    offers: List[Offer] = []


class Specs(BaseModel):
    """Характеристики товара. Свободная форма — ключ-значение."""
    model_config = {"extra": "allow"}


class ProductDetail(BaseModel):
    """Детальная карточка товара."""
    id: Union[int, str]
    emoji: str = "📦"
    title: str
    rating: float = 0
    reviews: int = 0
    inStock: bool = True
    gallery: List[str] = []
    specs: dict = {}
    offers: List[Offer] = []
    history: List[int] = []


class SearchResponse(BaseModel):
    query: str
    count: int
    source: str = "demo"
    products: List[dict]


class HealthResponse(BaseModel):
    status: str
    version: str