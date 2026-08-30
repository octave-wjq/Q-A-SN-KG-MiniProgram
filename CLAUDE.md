# 艾滋病健康管理小程序 — 开发指南

## 项目概述

复旦大学护理学院学术项目。微信小程序为艾滋病患者提供：RAG健康问答、症状网络可视化与干预仿真、知识图谱查询、健康管理工具。

## 架构（纯云开发）

```
微信小程序（前端）
    ↓ wx.cloud.callFunction()
云函数（Node.js）
    ├── login        → 微信登录，返回 openid
    ├── user         → 用户信息 CRUD（云数据库）
    ├── coze         → 直接调 Coze API（RAG问答）
    ├── kg           → 知识图谱查询（云数据库）
    ├── sn           → 症状网络数据查询（云数据库，预计算）
    └── health       → 健康管理工具（云数据库）
云数据库（MongoDB-like）
    ├── kg_nodes     → 知识图谱节点
    ├── kg_edges     → 知识图谱边（三元组）
    ├── sn_graph     → 症状网络图数据（预计算）
    ├── sn_centrality → 核心症状排名（预计算）
    ├── sn_simulation → 干预仿真结果（预计算）
    ├── sn_spillover  → 外溢效应矩阵（预计算）
    ├── users        → 用户信息
    ├── symptoms     → 症状记录
    └── health_*     → 健康管理数据
```

**无云服务器**。所有后端逻辑在云函数中完成。症状网络仿真数据通过本地 Python/R 脚本预计算后导入云数据库。

## 技术栈

| 层级 | 选型 |
|------|------|
| 前端 | 微信小程序原生 |
| 图谱可视化 | AntV G6（小程序版）+ ECharts |
| 后端 | 微信云函数（Node.js） |
| 数据库 | 微信云数据库（MongoDB-like） |
| RAG问答 | Coze API（外部服务） |
| 预计算 | Python（numpy/scipy/sklearn/networkx） |

## 目录结构

```
Q-A-SN-KG-MiniProgram/
├── miniprogram/                # 小程序前端
│   ├── app.js                  # 入口，云开发初始化
│   ├── app.json                # 页面路由 + tabBar
│   ├── app.wxss                # 全局样式
│   ├── pages/
│   │   ├── index/              # 首页（快捷入口 + 健康贴士）
│   │   ├── qa/                 # 问答（对话界面，调 Coze）
│   │   ├── graph/              # 图谱（症状网络 + 知识图谱，双Tab）
│   │   ├── health/             # 健康管理（用药/复诊/运动/饮食）
│   │   └── profile/            # 我的（登录/个人信息/设置）
│   ├── utils/
│   │   ├── api.js              # callCloud / callCoze 封装
│   │   └── util.js             # 工具函数
│   └── images/                 # 图标资源
├── cloudfunctions/             # 云函数
│   ├── login/                  # 微信登录
│   ├── user/                   # 用户信息
│   ├── coze/                   # Coze API 代理（待创建）
│   ├── kg/                     # 知识图谱查询（待创建）
│   ├── sn/                     # 症状网络查询（待创建）
│   └── health/                 # 健康管理（待创建）
├── scripts/                    # 预计算脚本（待创建）
│   ├── precompute_sn.py        # 症状网络预计算 → JSON
│   ├── prepare_kg.py           # 知识图谱三元组 → JSON
│   └── import_to_cloud.js      # JSON → 云数据库批量导入
├── server/                     # [已废弃] FastAPI 后端（保留不删）
├── doc/                        # 项目文档和原始数据
│   ├── symptom_data.xls        # 症状数据（个体×症状矩阵）
│   ├── 同期仿真模拟代码.R       # R 仿真代码（移植参考）
│   ├── 复旦-艾滋病健康管理小程序-需求分析文档.docx
│   └── 两张图说明.docx
├── project.config.json         # 小程序项目配置
├── CLAUDE.md                   # 本文件
└── 指导开发.md                  # 详细开发指导文档
```

## 已完成

1. 小程序骨架：5个Tab页面（首页/问答/图谱/健康/我的）
2. 云函数：login（返回openid）、user（基础CRUD）
3. 前端 api.js：callCloud / callCoze 封装
4. 问答页面：对话UI完整，调 callCoze()
5. 图谱页面：双Tab（症状网络/知识图谱）+ 子Tab（网络图/排名/仿真/热图），canvas 占位
6. 健康页面：模块入口卡片
7. 个人页面：登录/退出 + 菜单

## 待开发任务

### Phase 1: 问答跑通（P0）

**1.1 创建 coze 云函数**
```
cloudfunctions/coze/
├── index.js      # 调 Coze API
├── package.json  # 依赖 node-fetch 或 axios
└── config.json   # 云函数配置
```

云函数逻辑：
- 接收 `{question, user_id}`
- HTTP POST 到 `https://api.coze.cn/v3/chat/completions`
- Headers: `Authorization: Bearer {ACCESS_TOKEN}`
- Body: `{bot_id, user_id, messages: [{role: "user", content: question}], stream: false}`
- 解析响应 `choices[0].message.content`
- 返回 `{answer, sources, evidenceLevel}`

环境变量（云函数配置）：
- COZE_API_BASE: https://api.coze.cn/v3
- COZE_BOT_ID: （待填）
- COZE_ACCESS_TOKEN: （待填）

**1.2 修改前端 api.js**
- callCoze 改为调 `callCloud('coze', {question, user_id})`
- 去掉 callServer 对 Coze 的依赖

**1.3 验收**：在小程序中输入问题 → 云函数调 Coze → 返回答案显示在对话界面

### Phase 2: 症状网络预计算 + 展示（P0）

**2.1 预计算脚本 `scripts/precompute_sn.py`**

从 R 代码移植，输出 JSON 文件：

```python
# 输入: doc/symptom_data.xls
# 输出:
#   data/sn_graph.json       — 节点/边（偏相关网络）
#   data/sn_centrality.json  — 中心性排名
#   data/sn_simulation.json  — 全节点干预仿真结果
#   data/sn_spillover.json   — 外溢效应矩阵
```

算法步骤：
1. 读取 symptom_data.xls → pandas DataFrame
2. Z标准化
3. GraphicalLasso 估计精度矩阵 Ω
4. 偏相关矩阵 Pcor = -Ω_ij / sqrt(Ω_ii * Ω_jj)
5. 构建网络图（networkx），计算中心性
6. 对每个节点做 do-钳制仿真（alleviate + aggravate）
7. 计算外溢效应矩阵
8. 输出 JSON

**2.2 导入脚本 `scripts/import_to_cloud.js`**
- 读取 JSON 文件
- 批量写入云数据库对应集合

**2.3 创建 sn 云函数**
```
cloudfunctions/sn/
├── index.js
└── package.json
```

路由（通过 action 参数区分）：
- `{action: "graph"}` → 返回网络图节点/边
- `{action: "centrality", top_n}` → 返回核心症状排名
- `{action: "simulate", node_id, intervention_type}` → 返回单节点仿真结果
- `{action: "simulate_batch", intervention_type}` → 返回全节点仿真排名
- `{action: "spillover", intervention_type}` → 返回外溢效应矩阵

**2.4 前端图谱页面接入**
- 网络图Tab：调 sn 云函数获取数据，用 canvas 或 G6 渲染
- 排名Tab：调 centrality，ECharts 柱状图
- 仿真Tab：调 simulate_batch，ECharts 折线图+CI
- 热图Tab：调 spillover，ECharts 热力图

### Phase 3: 知识图谱（P0）

**3.1 准备 KG 数据**
- 从文献中提取三元组（手动或半自动）
- 格式：`{source, relation, target, evidence_level, source_literature}`
- 导入云数据库 kg_nodes / kg_edges

**3.2 创建 kg 云函数**
```
cloudfunctions/kg/
├── index.js
└── package.json
```

路由：
- `{action: "graph", entity_ids?, relation_types?}` → 返回节点/边
- `{action: "neighbors", entity_id}` → 返回1-hop邻居
- `{action: "path", source, target, max_depth}` → BFS最短路径
- `{action: "search", keyword}` → 模糊搜索节点

**3.3 前端知识图谱Tab接入**
- G6 有向图渲染（Dagre布局）
- 节点点击展开邻居
- 路径查询高亮

### Phase 4: 健康管理工具（P1）

**4.1 创建 health 云函数**
- 用药提醒 CRUD
- 复诊提醒 CRUD
- 运动记录
- 饮食记录

**4.2 前端健康页面完善**
- 各模块子页面

### Phase 5: 症状输入与管理建议（P1）

- 症状录入表单
- 调 sn 云函数预测伴随症状
- 调 coze 云函数生成管理建议
- 分级展示（紧急/随访/日常）

## 云函数编码规范

### 统一响应格式
```javascript
// 成功
return { code: 0, message: 'success', data: {...} }
// 失败
return { code: errCode, message: '错误描述', data: null }
```

### 云函数模板
```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { action, ...params } = event
  try {
    switch (action) {
      case 'xxx': return await handleXxx(params)
      default: return { code: 400, message: `Unknown action: ${action}`, data: null }
    }
  } catch (err) {
    return { code: 500, message: err.message, data: null }
  }
}
```

### 前端调用约定
```javascript
// 所有业务调用统一走 callCloud
const result = await callCloud('functionName', { action: 'xxx', ...params })
// result 结构: { code, message, data }
```

## 云数据库集合设计

### kg_nodes
```json
{
  "_id": "auto",
  "node_id": "string",
  "label": "string",
  "type": "疾病|症状|干预|药物|检测|传播方式|社会因素",
  "description": "string",
  "evidence_level": "A|B|C",
  "aliases": ["string"]
}
```

### kg_edges
```json
{
  "_id": "auto",
  "source": "node_id",
  "target": "node_id",
  "relation": "表现为|缓解|增加风险|...",
  "evidence_level": "A|B|C",
  "source_literature": ["string"],
  "confidence": 0.85
}
```

### sn_graph（单条记录，存整张网络）
```json
{
  "_id": "sn_graph_v1",
  "nodes": [{"id": "焦虑", "centrality": 0.72, "frequency": 150}],
  "edges": [{"source": "焦虑", "target": "失眠", "weight": 0.41}]
}
```

### sn_centrality（单条记录）
```json
{
  "_id": "sn_centrality_v1",
  "rankings": [{"name": "疲劳", "score": 0.91, "rank": 1}]
}
```

### sn_simulation（每个节点一条记录）
```json
{
  "_id": "sim_{node_id}_{type}",
  "node_id": "焦虑",
  "intervention_type": "alleviate",
  "baseline_burden": 12.5,
  "intervened_burden": 9.8,
  "pct_change": -21.6,
  "p_value": 0.001,
  "ci_95": [9.2, 10.4],
  "valid": true
}
```

### sn_spillover（单条记录，存完整矩阵）
```json
{
  "_id": "spillover_{type}",
  "intervention_type": "alleviate",
  "node_names": ["焦虑", "失眠", "..."],
  "matrix": [[0.0, -0.32], [-0.28, 0.0]]
}
```

## R 仿真代码算法摘要

源文件：`doc/同期仿真模拟代码.R`

1. GGM 估计：`huge(method="glasso")` + `huge.select(criterion="ebic")` → 精度矩阵 Ω
2. 偏相关：`Pcor = -Ω_ij / sqrt(Ω_ii * Ω_jj)`，对角线置零
3. do-钳制仿真：
   - 钳制节点 i 为 x_star（mu_i ± 2SD）
   - 条件分布：`Sigma_cond = inv(Ω[-i,-i])`，`mu_cond = mu[-i] - Sigma_cond @ Ω[-i,i] * (x_star - mu_i)`
   - 采样 5000 次，计算总症状负担（行和）
4. 统计检验：t检验 + FDR校正
5. 外溢效应：每个节点干预后，其他所有节点的均值变化矩阵
6. 有效性判断：钳制值是否在该节点观测范围内

Python 移植用 sklearn.covariance.GraphicalLasso 替代 huge，numpy.random.multivariate_normal 替代 rmvnorm。

## 注意事项

- `server/` 目录保留但不再使用，所有后端逻辑迁移到云函数
- 云函数有 20s 执行时限，大数据查询需注意
- 云数据库单次查询最多返回 100 条，需分页或一次性存储
- 症状网络数据量不大（几十个节点），可以单条记录存整张图
- 知识图谱如果节点多，kg 云函数中做 BFS 时注意深度限制
