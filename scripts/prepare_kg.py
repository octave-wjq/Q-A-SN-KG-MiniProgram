#!/usr/bin/env python3
"""Prepare KG nodes and edges from concatenated JSON objects."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

HEAD_TYPE_MAP = {
    "核心疾病": "疾病",
    "干预方法": "干预",
    "药物": "药物",
    "检测": "检测",
}

TAIL_TYPE_MAP = {
    "症状": "症状",
    "人群": "人群",
    "核心疾病": "疾病",
}

ALLOWED_RELATIONS = {"具有症状", "干预对象", "易感人群", "检测对象"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert doc/triples8.json into KG node/edge JSON files."
    )
    parser.add_argument("--input", default="doc/triples8.json", help="Input JSON path")
    parser.add_argument(
        "--nodes-output", default="data/kg_nodes.json", help="Output path for KG nodes"
    )
    parser.add_argument(
        "--edges-output", default="data/kg_edges.json", help="Output path for KG edges"
    )
    parser.add_argument(
        "--object-count",
        type=int,
        default=2,
        help="Expected number of concatenated JSON objects to parse",
    )
    return parser.parse_args()


def parse_concatenated_objects(text: str, expected_count: int) -> Tuple[List[Dict[str, Any]], str]:
    decoder = json.JSONDecoder()
    objects: List[Dict[str, Any]] = []
    index = 0

    while index < len(text) and len(objects) < expected_count:
        while index < len(text) and text[index].isspace():
            index += 1
        if index >= len(text):
            break

        try:
            obj, end = decoder.raw_decode(text, index)
        except json.JSONDecodeError as exc:
            raise ValueError(
                f"Failed to decode JSON object at char {exc.pos}: {exc.msg}"
            ) from exc

        if not isinstance(obj, dict):
            raise ValueError(f"Parsed object #{len(objects) + 1} is not a JSON object")

        objects.append(obj)
        index = end

    if len(objects) != expected_count:
        raise ValueError(
            f"Expected {expected_count} JSON objects, but parsed {len(objects)} object(s)"
        )

    trailing = text[index:].strip()
    return objects, trailing


def extract_triples(objects: Iterable[Dict[str, Any]]) -> List[Dict[str, str]]:
    triples: List[Dict[str, str]] = []
    required_keys = {"head", "head_type", "relation", "tail", "tail_type"}

    for obj_index, obj in enumerate(objects, start=1):
        results = obj.get("results", [])
        if not isinstance(results, list):
            raise ValueError(f"Object #{obj_index} has invalid 'results' field")

        for result_index, result in enumerate(results, start=1):
            if not isinstance(result, dict):
                raise ValueError(
                    f"Object #{obj_index} result #{result_index} is not an object"
                )
            raw_triples = result.get("triples", [])
            if not isinstance(raw_triples, list):
                raise ValueError(
                    f"Object #{obj_index} result #{result_index} has invalid 'triples' field"
                )

            for triple_index, triple in enumerate(raw_triples, start=1):
                if not isinstance(triple, dict):
                    raise ValueError(
                        "Object "
                        f"#{obj_index} result #{result_index} triple #{triple_index} is not an object"
                    )
                missing = required_keys - triple.keys()
                if missing:
                    missing_keys = ", ".join(sorted(missing))
                    raise ValueError(
                        "Object "
                        f"#{obj_index} result #{result_index} triple #{triple_index} is missing keys: {missing_keys}"
                    )
                triples.append(
                    {
                        "head": str(triple["head"]).strip(),
                        "head_type": str(triple["head_type"]).strip(),
                        "relation": str(triple["relation"]).strip(),
                        "tail": str(triple["tail"]).strip(),
                        "tail_type": str(triple["tail_type"]).strip(),
                    }
                )

    return triples


def map_head_type(raw_type: str) -> str:
    mapped = HEAD_TYPE_MAP.get(raw_type)
    if not mapped:
        raise ValueError(f"Unsupported head_type: {raw_type}")
    return mapped


def map_tail_type(raw_type: str) -> str:
    mapped = TAIL_TYPE_MAP.get(raw_type)
    if not mapped:
        raise ValueError(f"Unsupported tail_type: {raw_type}")
    return mapped


def build_nodes_and_edges(
    triples: Iterable[Dict[str, str]],
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], Dict[str, Any]]:
    node_map: Dict[str, Dict[str, Any]] = {}
    node_priority: Dict[str, int] = {}
    type_conflicts: Dict[str, set[str]] = {}

    edges: List[Dict[str, Any]] = []
    edge_keys = set()
    triples_list = list(triples)

    for triple in triples_list:
        head = triple["head"]
        tail = triple["tail"]
        relation = triple["relation"]

        if relation not in ALLOWED_RELATIONS:
            raise ValueError(f"Unsupported relation: {relation}")

        head_type = map_head_type(triple["head_type"])
        tail_type = map_tail_type(triple["tail_type"])

        add_or_update_node(node_map, node_priority, type_conflicts, head, head_type, 2)
        add_or_update_node(node_map, node_priority, type_conflicts, tail, tail_type, 1)

        edge_key = (head, tail, relation)
        if edge_key not in edge_keys:
            edge_keys.add(edge_key)
            edges.append(
                {
                    "source": head,
                    "target": tail,
                    "relation": relation,
                    "evidence_level": "B",
                    "source_literature": [],
                    "confidence": 0.8,
                }
            )

    nodes = [node_map[name] for name in sorted(node_map)]
    edges.sort(key=lambda item: (item["source"], item["target"], item["relation"]))

    relation_counts = Counter(item["relation"] for item in triples_list)
    node_type_counts = Counter(node["type"] for node in nodes)
    conflict_summary = {name: sorted(types) for name, types in sorted(type_conflicts.items())}

    stats = {
        "triple_count": len(triples_list),
        "unique_head_count": len({item["head"] for item in triples_list}),
        "unique_tail_count": len({item["tail"] for item in triples_list}),
        "node_count": len(nodes),
        "edge_count": len(edges),
        "relation_counts": dict(sorted(relation_counts.items())),
        "node_type_counts": dict(sorted(node_type_counts.items())),
        "type_conflicts": conflict_summary,
    }

    return nodes, edges, stats


def add_or_update_node(
    node_map: Dict[str, Dict[str, Any]],
    node_priority: Dict[str, int],
    type_conflicts: Dict[str, set[str]],
    entity: str,
    entity_type: str,
    priority: int,
) -> None:
    if entity not in node_map:
        node_map[entity] = {
            "node_id": entity,
            "label": entity,
            "type": entity_type,
            "description": "",
            "evidence_level": "B",
            "aliases": [],
        }
        node_priority[entity] = priority
        return

    current_type = node_map[entity]["type"]
    if current_type == entity_type:
        return

    type_conflicts.setdefault(entity, set()).update({current_type, entity_type})
    if priority > node_priority[entity]:
        node_map[entity]["type"] = entity_type
        node_priority[entity] = priority


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    args = parse_args()
    input_path = Path(args.input)
    nodes_output_path = Path(args.nodes_output)
    edges_output_path = Path(args.edges_output)

    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    raw_text = input_path.read_text(encoding="utf-8")
    objects, trailing = parse_concatenated_objects(raw_text, args.object_count)
    triples = extract_triples(objects)
    nodes, edges, stats = build_nodes_and_edges(triples)

    write_json(nodes_output_path, nodes)
    write_json(edges_output_path, edges)

    print("KG data prepared:")
    print(f"- parsed_objects: {len(objects)}")
    print(f"- triples: {stats['triple_count']}")
    print(f"- unique_heads: {stats['unique_head_count']}")
    print(f"- unique_tails: {stats['unique_tail_count']}")
    print(f"- nodes: {stats['node_count']}")
    print(f"- edges: {stats['edge_count']}")
    print(f"- relation_counts: {stats['relation_counts']}")
    print(f"- node_type_counts: {stats['node_type_counts']}")
    if stats["type_conflicts"]:
        print(f"- type_conflicts: {stats['type_conflicts']}")
    if trailing:
        print(f"- warning: ignored trailing content length={len(trailing)}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # pragma: no cover
        print(f"[ERROR] {exc}", file=sys.stderr)
        raise SystemExit(1)
