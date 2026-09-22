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

1. 用微信开发者工具导入项目，保持原小程序 `appid=wxd08371300aa163c5` 不变。
2. 非密钥配置已随仓库提供（`cloudfunctions/coze/config.js`），`WORKFLOW_ID` / `SPACE_ID` 已核对原线上值。Coze Key 唯一编辑位置为 `ResearchBridge/private/coze/credentials.json`；日常轮换在 ResearchBridge 中运行 `node scripts/rotate_coze_credentials.js --apply` 和 `--verify`。
3. `cloudbaserc.json` 保留真实运行参数，但源码目录需显式传 `--dir`，例如 `tcb fn deploy snkg-user --dir ./cloudfunctions/user --envId yuelai-0gawhvuc757cd498`。其他函数用相应 `snkg-<目录名>` 与 `./cloudfunctions/<目录名>`；不要直接 `--all`，也不要按原目录名发布无前缀函数。
4. 首次或全量更新 `snkg-coze` 包前，先执行 `install -m 600 ../ResearchBridge/private/coze/credentials.json cloudfunctions/coze/coze-credentials.json`（三仓库按本工作区同级放置），确保包内有私有文件。复制品不作为编辑源、不提交Git。
5. 本次已完成数据基线复制，不要重复执行初始化导入脚本覆盖已有数据；最终增量与前端正式发布前仍保留源环境。目标密钥轮换不会自动更新仍服务旧包的源环境，不要提前撤销旧密钥。

## ResearchBridge 迁移说明

本仓库代码已适配迁移到 ResearchBridge 共享云资源（目标 `resourceAppid=wx3da56dbad356038f`、`resourceEnv=yuelai-0gawhvuc757cd498`）。

**客户端**
- 统一通过 `miniprogram/utils/cloud.js` 创建 `new wx.cloud.Cloud({ resourceAppid, resourceEnv })` 共享实例，所有资源调用（云函数 / 上传 / 下载 / 临时地址解析）都等待同一个初始化单例；不 monkey-patch `wx.cloud`，不失败回退到源环境。
- `utils/api.js` 的 `callCloud` 统一走该共享实例，并把逻辑函数名映射为部署名 `snkg-<逻辑名>`。
- 头像上传、客服二维码下载、缓存头像地址刷新均走共享目标；持久 fileID 保留，展示用的短期地址不回写永久记录。
- 小程序 `appid` 保持 `wxd08371300aa163c5` 不变。

**服务端（云函数）**
- 所有函数部署名为 `snkg-<原函数名>`，源函数目录不变；部署名与运行参数见 `cloudbaserc.json`，本地目录通过 CLI `--dir` 传入。`path` 表示 HTTP 访问服务，不用于目录映射。
- 22 个集合统一改为 `snkg-<原名>` 前缀（含 coze 图谱读取、`import_data` 的 count/import 分支与固定 `_id` 规则）。
- 每个函数通过 `identity.js` 从可信 `WXContext` 解析身份：`FROM_APPID` 存在时必须等于 `wxd08371300aa163c5` 且 `FROM_OPENID` 非空；否则仅接受 `APPID==sourceAppid` 且 `OPENID` 非空的直接来源。其余来源（未知/另一项目/ResearchBridge）一律拒绝；后台导入继续使用原 openid 管理员白名单。
- 目标 `snkg-*` 集合权限统一为 ADMINONLY：所有客户端读写都走本项目目标云函数，客户端不直连数据库。

**文件映射**
- 源根 `cloud://cloud1-9g32qnjv9f0dc26a.636c-cloud1-9g32qnjv9f0dc26a-1412631187/` → 目标根
  `cloud://yuelai-0gawhvuc757cd498.7975-yuelai-0gawhvuc757cd498-1313725099/apps/snkg/`，对象按 `apps/snkg/<原key>` 隔离迁入。

**边界（重要）**
- 以上为**已完成并合入本分支的代码改动**：客户端接入、目标函数适配、集合/文件映射、身份校验、部署清单与说明。
- **已完成基线迁移与目标部署**：22集合/7291条记录/15个文件的独立完整性核验通过，7个目标函数已部署；真实客户端原身份、资料及13条会话与源一致，项目间函数及文件读写隔离通过。
- **前端尚未正式发布，最终增量与旧包过渡尚未完成**。源环境仍服务旧发布包，不关闭、不删除；基线复制不等于线上所有用户已无感切换。

## 安全说明

- 所有密钥（Coze Token、数据库密码等）均**不入库**，通过本地配置文件或环境变量注入
- `coze-credentials.json`、`project.private.config.json`、`.env` 被 Git 忽略；非秘密的 `cloudfunctions/coze/config.js` 跟随版本管理。

## 说明

复旦大学护理学院学术研究项目，仅供学习与研究使用，问答内容不构成医疗建议。
