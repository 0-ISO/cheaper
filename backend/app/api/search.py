from fastapi import APIRouter, Query
from typing import Optional
from app.schemas import SearchResponse
from app.services.search import search_products

router = APIRouter(tags=["search"])


@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query("", description="Поисковый запрос"),
    limit: int = Query(20, ge=1, le=100),
    source: Optional[str] = Query(
        None,
        description="dns | wb | demo (по умолчанию: dns → wb → demo)"
    ),
):
    if source == "dns":
        sources = ["dns"]
    elif source == "wb":
        sources = ["wb"]
    elif source == "demo":
        sources = []
    else:
        sources = ["dns", "wb"]

    result = await search_products(q, sources=sources)
    products = result["products"][:limit]

    return {
        "query": q,
        "count": len(products),
        "source": result["source"],
        "products": products,
    }