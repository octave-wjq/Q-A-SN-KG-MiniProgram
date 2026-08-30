from fastapi import APIRouter

from app.api.coze import router as coze_router
from app.api.health_check import router as health_check_router
from app.api.kg import router as kg_router

api_router = APIRouter()
api_router.include_router(coze_router, prefix="/coze", tags=["coze"])
api_router.include_router(kg_router, prefix="/kg", tags=["knowledge-graph"])

health_router = APIRouter()
health_router.include_router(health_check_router, tags=["health"])
