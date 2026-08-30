from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query

from app.models.kg import KGGraphResponse, KGPathRequest, KGPathResponse, KGQueryRequest
from app.services.neo4j_service import neo4j_service
from app.utils.helpers import api_response

router = APIRouter()


@router.get("/graph")
async def get_kg_graph(
    entity_ids: Optional[list[str]] = Query(default=None),
    relation_types: Optional[list[str]] = Query(default=None),
) -> dict[str, Any]:
    try:
        graph_data = await neo4j_service.get_graph(entity_ids=entity_ids, relation_types=relation_types)
        response = KGGraphResponse(**graph_data)
        return api_response(data=response.model_dump())
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch graph: {exc}") from exc


@router.post("/query")
async def query_kg(payload: KGQueryRequest) -> dict[str, Any]:
    try:
        results = await neo4j_service.query(payload.query_type, payload.params)
        return api_response(data={"results": results})
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Query execution failed: {exc}") from exc


@router.post("/path")
async def find_kg_path(payload: KGPathRequest) -> dict[str, Any]:
    try:
        paths = await neo4j_service.find_paths(
            source=payload.source,
            target=payload.target,
            max_depth=payload.max_depth,
        )
        response = KGPathResponse(paths=paths)
        return api_response(data=response.model_dump())
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Path query failed: {exc}") from exc
