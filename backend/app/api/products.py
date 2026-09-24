from fastapi import APIRouter, HTTPException
from app.schemas import ProductDetail
from app.services.search import get_product_detail

router = APIRouter(tags=["products"])


@router.get("/products/{product_id}", response_model=ProductDetail)
async def product_detail(product_id: int):
    product = get_product_detail(product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product