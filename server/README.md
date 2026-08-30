# HIV Health Management KG API

艾滋病健康管理小程序知识图谱后端，基于 FastAPI + Neo4j，提供图谱查询、路径检索和健康检查接口。该服务可与症状网络 R API 部署在同一台服务器（`111.229.149.38`）。

## 快速启动

1. 复制环境变量

```bash
cp .env.example .env
```

2. 启动服务

```bash
docker-compose up --build
```

## 服务地址

- API 根地址：`http://localhost:8000`
- Swagger 文档：`http://localhost:8000/docs`
- ReDoc 文档：`http://localhost:8000/redoc`
- 健康检查：`http://localhost:8000/health`

## 主要接口

- `GET /api/kg/graph`
- `POST /api/kg/query`
- `POST /api/kg/path`
- `GET /health`
- `GET /health/neo4j`

`POST /api/kg/query` 当前支持的 `query_type`：

- `entity_neighbors`
- `entities_by_type`
- `relations_between`
- `search_entities`
