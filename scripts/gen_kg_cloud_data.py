# -*- coding: utf-8 -*-
"""
从新三元组生成云数据库导入格式 data/kg_nodes.json、data/kg_edges.json，
并拆分为 miniprogram/pages/admin/datasets/kg_nodes_*.js、kg_edges_*.js 分片。
复用 build_kg_from_triples 的解析逻辑（同一份数据/类型/关系映射）。
"""
import json
import os
import importlib.util

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIS = os.path.join(BASE, 'data', 'kg_graph_vis.json')   # 已由 build_kg_from_triples 生成
NODES_OUT = os.path.join(BASE, 'data', 'kg_nodes.json')
EDGES_OUT = os.path.join(BASE, 'data', 'kg_edges.json')
DATASET_DIR = os.path.join(BASE, 'miniprogram', 'pages', 'admin', 'datasets')

NODE_CHUNK = 200
EDGE_CHUNK = 250


def main():
    vis = json.load(open(VIS, encoding='utf-8'))

    # 云数据库节点格式
    kg_nodes = [{
        'node_id': n['id'], 'label': n['label'], 'type': n['primary_type'],
        'description': '', 'evidence_level': 'B', 'aliases': []
    } for n in vis['nodes']]

    # 云数据库边格式（relation 存中文标签）
    kg_edges = [{
        'source': e['source'], 'target': e['target'], 'relation': e['relation_label'],
        'evidence_level': 'B', 'source_literature': [], 'confidence': 0.8
    } for e in vis['edges']]

    json.dump(kg_nodes, open(NODES_OUT, 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump(kg_edges, open(EDGES_OUT, 'w', encoding='utf-8'), ensure_ascii=False)
    print('kg_nodes.json:', len(kg_nodes), 'kg_edges.json:', len(kg_edges))

    # 清理旧分片
    for f in os.listdir(DATASET_DIR):
        if f.startswith('kg_nodes_') or f.startswith('kg_edges_'):
            os.remove(os.path.join(DATASET_DIR, f))

    def write_chunks(data, prefix, size):
        cnt = 0
        for i in range(0, len(data), size):
            chunk = data[i:i + size]
            path = os.path.join(DATASET_DIR, f'{prefix}_{cnt}.js')
            with open(path, 'w', encoding='utf-8') as f:
                f.write('module.exports = ' + json.dumps(chunk, ensure_ascii=False) + ';\n')
            cnt += 1
        return cnt

    nc = write_chunks(kg_nodes, 'kg_nodes', NODE_CHUNK)
    ec = write_chunks(kg_edges, 'kg_edges', EDGE_CHUNK)
    print('节点分片:', nc, '边分片:', ec)
    print('注意：admin.js 里的分片数量常量需与此一致（节点', nc, '片 / 边', ec, '片）')


if __name__ == '__main__':
    main()
