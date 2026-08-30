# 艾滋病健康管理小程序

> 基于**症状网络（Symptom Network）**与**知识图谱（Knowledge Graph）**的 RAG 问答微信小程序

复旦大学护理学院学术项目。为艾滋病患者提供智能健康问答、症状网络可视化与干预仿真、知识图谱查询及健康管理工具。

## 核心功能

- **RAG 健康问答**：基于 Coze 工作流的检索增强问答，回答附带证据溯源
- **症状网络可视化**：偏相关网络图、核心症状中心性排名、do-钳制干预仿真、外溢效应热图
- **知识图谱查询**：疾病/症状/干预/药物等实体的有向图检索，支持邻居展开与路径查询
- **健康管理**：用药提醒、复诊提醒、运动与饮食记录
- **症状录入与分级建议**：录入症状后预测伴随症状并生成分级管理建议

## 技术架构（纯微信云开发，无自建服务器）

```
微信小程序（原生前端）
    ↓ wx.cloud.callFunction()
云函数（Node.js）
    ├── login   微信登录（openid）
    ├── user    用户信息 CRUD
    ├── coze    Coze API 代理（RAG 问答）
    ├── kg      知识图谱查询
    ├── sn      症状网络数据查询（预计算）
    └── health  健康管理工具
微信云数据库（MongoDB-like）
```

症状网络仿真数据通过本地 Python 脚本（GraphicalLasso + do-钳制仿真）预计算后导入云数据库。

| 层级 | 选型 |
|------|------|
| 前端 | 微信小程序原生 |
| 可视化 | AntV G6 + ECharts |
| 后端 | 微信云函数（Node.js） |
| 数据库 | 微信云数据库 |
| RAG | Coze API |
| 预计算 | Python（numpy / scipy / sklearn / networkx） |

## 目录结构

```
├── miniprogram/       小程序前端（pages / utils / images）
├── cloudfunctions/    云函数（coze / kg / sn / health / login / user 等）
├── scripts/           预计算与数据导入脚本
├── data/              预计算生成的 JSON 数据
├── doc/               需求文档与原始数据
└── server/            [已废弃] 早期 FastAPI 后端，保留仅供参考
```

## 快速开始

1. 用微信开发者工具导入项目，填写自己的小程序 `appid`（`project.config.json`）
2. 复制配置模板并填入真实密钥（该文件已被 `.gitignore` 忽略，不会提交）：
   ```bash
   cp cloudfunctions/coze/config.example.js cloudfunctions/coze/config.js
   # 编辑 config.js，填入 COZE_API_TOKEN / WORKFLOW_ID / SPACE_ID
   ```
3. 上传并部署 `cloudfunctions/` 下各云函数
4. 通过 `scripts/` 预计算并导入症状网络与知识图谱数据

## 安全说明

- 所有密钥（Coze Token、数据库密码等）均**不入库**，通过本地配置文件或环境变量注入
- `config.js`、`project.private.config.json`、`.env` 已在 `.gitignore` 中忽略

## 说明

复旦大学护理学院学术研究项目，仅供学习与研究使用，问答内容不构成医疗建议。
