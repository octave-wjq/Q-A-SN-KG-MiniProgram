from typing import Any

from pydantic import BaseModel, Field


class KGNode(BaseModel):
    id: str
    label: str
    type: str
    properties: dict[str, Any] = Field(default_factory=dict)


class KGEdge(BaseModel):
    source: str
    target: str
    relation: str
    direction: str = "directed"
    evidence_level: str
    source_literature: list[str] = Field(default_factory=list)
    confidence: float


class KGGraphResponse(BaseModel):
    nodes: list[KGNode] = Field(default_factory=list)
    edges: list[KGEdge] = Field(default_factory=list)


class KGQueryRequest(BaseModel):
    query_type: str
    params: dict[str, Any] = Field(default_factory=dict)


class KGPathRequest(BaseModel):
    source: str
    target: str
    max_depth: int = Field(default=3, ge=1, le=10)


class KGPathResponse(BaseModel):
    paths: list[dict[str, Any]] = Field(default_factory=list)
