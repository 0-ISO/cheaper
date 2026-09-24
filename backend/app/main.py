from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api import health, search, products


app = FastAPI(
    title="Ценомер API",
    description="Сравнение цен на маркетплейсах",
    version="0.1.0",
    debug=settings.DEBUG,
)

# CORS — чтобы фронт с :5173 мог обращаться
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роуты
app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(search.router, prefix=settings.API_PREFIX)
app.include_router(products.router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    return {
        "name": "Ценомер API",
        "version": "0.1.0",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "search": "/api/search?q=iphone",
            "product": "/api/products/1",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )