import logging

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router, health_router
from app.config import get_settings
from app.services.neo4j_service import neo4j_service
from app.utils.helpers import api_response

settings = get_settings()
logger = logging.getLogger(__name__)

app = FastAPI(title="HIV Health Management KG API", debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=api_response(code=exc.status_code, message=str(exc.detail), data=None),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, _exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content=api_response(code=500, message="Internal server error", data=None),
    )


@app.on_event("startup")
async def startup_event() -> None:
    try:
        await neo4j_service.connect()
        logger.info("Neo4j connected")
    except Exception as exc:
        logger.error("Neo4j startup connection failed: %s", exc)


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await neo4j_service.disconnect()


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=settings.DEBUG,
    )
