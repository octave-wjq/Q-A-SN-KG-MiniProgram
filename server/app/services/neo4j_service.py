from __future__ import annotations

from typing import Any

from neo4j import AsyncDriver, AsyncGraphDatabase

from app.config import Settings, get_settings
from app.models.kg import KGEdge, KGNode


class Neo4jService:
    _instance: Neo4jService | None = None

    def __new__(cls, settings: Settings | None = None) -> Neo4jService:
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, settings: Settings | None = None) -> None:
        if getattr(self, "_initialized", False):
            if settings is not None:
                self._settings = settings
            return
        self._settings = settings or get_settings()
        self._driver: AsyncDriver | None = None
        self._initialized = True

    async def connect(self) -> None:
        if self._driver is not None:
            return
        self._driver = AsyncGraphDatabase.driver(
            self._settings.NEO4J_URI,
            auth=(self._settings.NEO4J_USER, self._settings.NEO4J_PASSWORD),
        )
        try:
            await self._driver.verify_connectivity()
        except Exception as exc:
            await self._driver.close()
            self._driver = None
            raise RuntimeError(f"Neo4j connection failed: {exc}") from exc

    async def disconnect(self) -> None:
        if self._driver is None:
            return
        await self._driver.close()
        self._driver = None

    async def verify_connectivity(self) -> bool:
        if self._driver is None:
            try:
                await self.connect()
            except Exception:
                return False
        if self._driver is None:
            return False
        try:
            await self._driver.verify_connectivity()
            return True
        except Exception:
            return False

    async def get_graph(
        self,
        entity_ids: list[str] | None = None,
        relation_types: list[str] | None = None,
    ) -> dict[str, list[dict[str, Any]]]:
        driver = await self._get_driver()
        cypher = """
        MATCH (n)-[r]->(m)
        WHERE (
          $entity_ids IS NULL
          OR coalesce(n.id, elementId(n)) IN $entity_ids
          OR coalesce(m.id, elementId(m)) IN $entity_ids
        )
        AND (
          $relation_types IS NULL
          OR type(r) IN $relation_types
        )
        RETURN {
          id: toString(coalesce(n.id, elementId(n))),
          label: toString(coalesce(n.label, n.name, coalesce(n.id, elementId(n)))),
          type: toString(coalesce(n.type, head(labels(n)), "unknown")),
          properties: properties(n)
        } AS source_node,
        {
          id: toString(coalesce(m.id, elementId(m))),
          label: toString(coalesce(m.label, m.name, coalesce(m.id, elementId(m)))),
          type: toString(coalesce(m.type, head(labels(m)), "unknown")),
          properties: properties(m)
        } AS target_node,
        {
          source: toString(coalesce(n.id, elementId(n))),
          target: toString(coalesce(m.id, elementId(m))),
          relation: type(r),
          direction: "directed",
          evidence_level: toString(coalesce(r.evidence_level, "C")),
          source_literature: coalesce(r.source_literature, []),
          confidence: coalesce(toFloat(r.confidence), 0.0)
        } AS edge
        """
        params = {
            "entity_ids": entity_ids or None,
            "relation_types": relation_types or None,
        }

        async with driver.session() as session:
            result = await session.run(cypher, params)
            records = await result.data()

        node_map: dict[str, KGNode] = {}
        edges: list[KGEdge] = []

        for record in records:
            source_node = KGNode(**record["source_node"])
            target_node = KGNode(**record["target_node"])
            edge_payload = record["edge"]
            edge_payload["source_literature"] = self._normalize_literature(edge_payload["source_literature"])
            edge = KGEdge(**edge_payload)

            node_map[source_node.id] = source_node
            node_map[target_node.id] = target_node
            edges.append(edge)

        dedup_edges = list({(e.source, e.target, e.relation): e for e in edges}.values())
        return {
            "nodes": [node.model_dump() for node in node_map.values()],
            "edges": [edge.model_dump() for edge in dedup_edges],
        }

    async def query(self, query_type: str, params: dict[str, Any]) -> list[dict[str, Any]]:
        driver = await self._get_driver()
        cypher, query_params = self._build_query(query_type, params)

        async with driver.session() as session:
            result = await session.run(cypher, query_params)
            records = await result.data()

        return [record["result"] for record in records]

    async def find_paths(self, source: str, target: str, max_depth: int = 3) -> list[dict[str, Any]]:
        driver = await self._get_driver()
        normalized_depth = max(1, min(max_depth, 10))
        cypher = """
        MATCH (source), (target)
        WHERE toString(coalesce(source.id, elementId(source))) = $source
          AND toString(coalesce(target.id, elementId(target))) = $target
        MATCH path = allShortestPaths((source)-[*..10]->(target))
        WHERE length(path) <= $max_depth
        RETURN {
          length: length(path),
          nodes: [node IN nodes(path) | {
            id: toString(coalesce(node.id, elementId(node))),
            label: toString(coalesce(node.label, node.name, coalesce(node.id, elementId(node)))),
            type: toString(coalesce(node.type, head(labels(node)), "unknown")),
            properties: properties(node)
          }],
          edges: [rel IN relationships(path) | {
            source: toString(coalesce(startNode(rel).id, elementId(startNode(rel)))),
            target: toString(coalesce(endNode(rel).id, elementId(endNode(rel)))),
            relation: type(rel),
            direction: "directed",
            evidence_level: toString(coalesce(rel.evidence_level, "C")),
            source_literature: coalesce(rel.source_literature, []),
            confidence: coalesce(toFloat(rel.confidence), 0.0)
          }]
        } AS result
        """
        query_params = {
            "source": source,
            "target": target,
            "max_depth": normalized_depth,
        }
        async with driver.session() as session:
            result = await session.run(cypher, query_params)
            records = await result.data()

        paths = [record["result"] for record in records]
        for path in paths:
            for edge in path.get("edges", []):
                edge["source_literature"] = self._normalize_literature(edge.get("source_literature"))
        return paths

    async def _get_driver(self) -> AsyncDriver:
        if self._driver is None:
            await self.connect()
        if self._driver is None:
            raise RuntimeError("Neo4j driver is unavailable.")
        return self._driver

    def _build_query(self, query_type: str, params: dict[str, Any]) -> tuple[str, dict[str, Any]]:
        limit = int(params.get("limit", 20))
        limit = max(1, min(limit, 200))

        if query_type == "entity_neighbors":
            entity_id = params.get("entity_id")
            if not entity_id:
                raise ValueError("'entity_id' is required for entity_neighbors query.")
            cypher = """
            MATCH (n)-[r]-(m)
            WHERE toString(coalesce(n.id, elementId(n))) = $entity_id
              AND ($relation_types IS NULL OR type(r) IN $relation_types)
            RETURN {
              source: {
                id: toString(coalesce(n.id, elementId(n))),
                label: toString(coalesce(n.label, n.name, coalesce(n.id, elementId(n)))),
                type: toString(coalesce(n.type, head(labels(n)), "unknown")),
                properties: properties(n)
              },
              relation: {
                relation: type(r),
                evidence_level: toString(coalesce(r.evidence_level, "C")),
                source_literature: coalesce(r.source_literature, []),
                confidence: coalesce(toFloat(r.confidence), 0.0)
              },
              target: {
                id: toString(coalesce(m.id, elementId(m))),
                label: toString(coalesce(m.label, m.name, coalesce(m.id, elementId(m)))),
                type: toString(coalesce(m.type, head(labels(m)), "unknown")),
                properties: properties(m)
              }
            } AS result
            LIMIT $limit
            """
            query_params = {
                "entity_id": entity_id,
                "relation_types": params.get("relation_types") or None,
                "limit": limit,
            }
            return cypher, query_params

        if query_type == "entities_by_type":
            entity_type = params.get("entity_type")
            if not entity_type:
                raise ValueError("'entity_type' is required for entities_by_type query.")
            cypher = """
            MATCH (n)
            WHERE toString(coalesce(n.type, head(labels(n)), "unknown")) = $entity_type
            RETURN {
              id: toString(coalesce(n.id, elementId(n))),
              label: toString(coalesce(n.label, n.name, coalesce(n.id, elementId(n)))),
              type: toString(coalesce(n.type, head(labels(n)), "unknown")),
              properties: properties(n)
            } AS result
            LIMIT $limit
            """
            query_params = {
                "entity_type": entity_type,
                "limit": limit,
            }
            return cypher, query_params

        if query_type == "relations_between":
            source = params.get("source")
            target = params.get("target")
            if not source or not target:
                raise ValueError("'source' and 'target' are required for relations_between query.")
            cypher = """
            MATCH (s)-[r]->(t)
            WHERE toString(coalesce(s.id, elementId(s))) = $source
              AND toString(coalesce(t.id, elementId(t))) = $target
            RETURN {
              source: toString(coalesce(s.id, elementId(s))),
              target: toString(coalesce(t.id, elementId(t))),
              relation: type(r),
              evidence_level: toString(coalesce(r.evidence_level, "C")),
              source_literature: coalesce(r.source_literature, []),
              confidence: coalesce(toFloat(r.confidence), 0.0)
            } AS result
            LIMIT $limit
            """
            query_params = {
                "source": source,
                "target": target,
                "limit": limit,
            }
            return cypher, query_params

        if query_type == "search_entities":
            keyword = params.get("keyword")
            if not keyword:
                raise ValueError("'keyword' is required for search_entities query.")
            cypher = """
            MATCH (n)
            WHERE toLower(toString(coalesce(n.label, n.name, ""))) CONTAINS toLower($keyword)
            RETURN {
              id: toString(coalesce(n.id, elementId(n))),
              label: toString(coalesce(n.label, n.name, coalesce(n.id, elementId(n)))),
              type: toString(coalesce(n.type, head(labels(n)), "unknown")),
              properties: properties(n)
            } AS result
            LIMIT $limit
            """
            query_params = {
                "keyword": keyword,
                "limit": limit,
            }
            return cypher, query_params

        raise ValueError(
            "Unsupported query_type. Use one of: entity_neighbors, entities_by_type, relations_between, search_entities."
        )

    @staticmethod
    def _normalize_literature(value: Any) -> list[str]:
        if isinstance(value, list):
            return [str(item) for item in value]
        if value is None:
            return []
        return [str(value)]


neo4j_service = Neo4jService()
