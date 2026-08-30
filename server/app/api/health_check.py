from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.services.neo4j_service import neo4j_service
from app.utils.helpers import api_response

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, object]:
    neo4j_connected = await neo4j_service.verify_connectivity()
    status = "ok" if neo4j_connected else "degraded"
    return api_response(
        data={
            "status": status,
            "neo4j_connected": neo4j_connected,
        }
    )


@router.get("/health/neo4j")
async def neo4j_health_check() -> JSONResponse:
    neo4j_connected = await neo4j_service.verify_connectivity()
    if neo4j_connected:
        return JSONResponse(content=api_response(data={"neo4j_connected": True}))
    return JSONResponse(
        status_code=503,
        content=api_response(
            code=50301,
            message="Neo4j connection unavailable",
            data={"neo4j_connected": False},
        ),
    )
