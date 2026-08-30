# Coze 工作流搭建指南 — 艾滋病健康问答 RAG（最终版）

> 本文档是问答模块工作流的**唯一权威说明**，已整合证据溯源、防分类器污染、KG/SN 节点联动、参考文献 snippet 等全部最新设计。后端 `cloudfunctions/coze/index.js` 已按本文档对接完成。

## 概述

艾滋病健康管理小程序的智能问答模块，采用 RAG（检索增强生成）架构：图谱检索 + 知识库检索 + 大模型生成，为患者提供**可溯源**的循证健康建议。

- **调用方式**：Workflow API（同步，`POST /v1/workflow/run`）
- **环境**：云开发 `cloud1-9g32qnjv9f0dc26a`；配置见 `cloudfunctions/coze/config.js`（WORKFLOW_ID / COZE_API_TOKEN）
- **输入参数**：`BOT_USER_INPUT`（干净的用户问题）、`GRAPH_CONTEXT`（图谱上下文）、`user_id`
- **输出格式**：结构化 JSON 字符串（见下文「回答生成节点」）

---

## 数据流总览

```
小程序 qa 页
  → coze 云函数 handleChat
      ① buildGraphContext(question)  本地检索 KG/SN 节点 → 生成 GRAPH_CONTEXT
      ② callWorkflow(question, graphContext)  调 Coze 工作流
          [开始] → [意图分类] → 分支
                                  ├ health_qa → [问题改写] → [知识库检索] → [安全过滤] → [回答生成(JSON)] → [结束]
                                  ├ greeting  → [闲聊回复] → [结束]
                                  ├ emergency → [紧急回复] → [结束]
                                  └ off_topic → [拒答回复] → [结束]
      ③ 用「问题+回答正文」二次回扫 KG/SN 节点 → 补全 references
      ④ 返回 { answer, references{literature,kg_nodes,sn_nodes}, thinking, needHuman, elapsedMs }
  → qa 页渲染：回答 + 思考过程 + 引用来源(文献可展开看snippet / 节点可点击跳图谱) + 应答耗时 + 转人工
```

**三条铁律**（本项目踩坑总结）：
1. `BOT_USER_INPUT` 只放干净用户问题，**绝不混入**检索上下文或输出格式指令（否则污染意图分类节点）。
2. JSON 输出格式要求**只写在「回答生成」节点**的提示词里，不出现在任何前置节点输入。
3. 文献来源**只能引用检索结果里真实出现的**，禁止模型编造（医疗场景安全红线）。

---

## 节点配置

### 1. 开始节点（Start）— 输入变量

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `BOT_USER_INPUT` | String | 用户问题（干净，进入意图分类） |
| `GRAPH_CONTEXT` | String | 图谱检索上下文（后端注入，可能为空字符串） |
| `user_id` | String | 用户标识 |

### 2. 意图分类节点（LLM - Classifier）

轻量模型即可。**提示词只引用 `{{BOT_USER_INPUT}}`，不要引用 `GRAPH_CONTEXT`。**

```
你是一个意图分类器，服务于一个艾滋病(HIV/AIDS)健康管理小程序。根据用户输入，判断属于以下哪个类别：

1. health_qa — 任何与健康、身体、症状、用药、检测、营养饮食、运动、心理、生活管理相关的问题或描述。**默认归为此类**。例如"我有以下症状：发热、乏力，请给出管理建议""拉米夫定有什么副作用""CD4偏低怎么办""最近睡不好"等，只要涉及身体或健康，一律 health_qa。
2. greeting — 纯打招呼、问好（如"你好""在吗"），不含任何健康内容。
3. off_topic — 明显与健康无关（如政治、娱乐、编程、天气、股票）。
4. emergency — 明确涉及自杀、自伤倾向，或描述危及生命的严重急症。

判定规则：
- 只要输入里出现症状名、药名、身体不适、健康管理诉求，必须归 health_qa，不要因为"没明说HIV"就判成 off_topic。
- 拿不准时，优先归 health_qa（宁可多答，不要误拒）。
- 仅输出类别名称（health_qa / greeting / off_topic / emergency），不要解释、不要输出其它任何内容。
```

输出变量：`intent`（String）

### 3. 条件分支节点（Condition）

| 条件 | 走向 |
|------|------|
| intent == "health_qa" | → 问题改写 → 知识库检索 |
| intent == "greeting" | → 闲聊回复节点 |
| intent == "emergency" | → 紧急回复节点 |
| intent == "off_topic" | → 拒答回复节点 |

### 3a/3b/3c. 闲聊 / 紧急 / 拒答回复节点（Code）

这三个分支为了和 health_qa 输出格式统一，**也输出 JSON 字符串**（references 为空、need_human 按需），便于云函数统一解析：

```python
# 闲聊
output = '{"answer":"你好！我是你的健康问答助手，专注于HIV/AIDS相关的健康管理。你可以问我症状管理、用药提醒、生活方式、心理健康等问题。","references":[],"need_human":false}'
```

```python
# 紧急（need_human=true，引导转人工/急救）
output = '{"answer":"⚠️ 检测到可能的紧急情况。如出现严重药物不良反应（皮疹、肝损伤、严重腹泻）请立即就医急诊；如有心理危机请拨打全国心理援助热线 400-161-9995。请尽快寻求专业帮助。","references":[],"need_human":true}'
```

```python
# 拒答
output = '{"answer":"抱歉，我只能回答与HIV/AIDS健康管理相关的问题。如果你有症状、用药、检测、生活管理方面的疑问，欢迎随时提问。","references":[],"need_human":false}'
```

> 若不想改这三个分支，保持纯文本输出也可——云函数 `parseStructured` 解析失败会回退文本解析，answer 仍能正常显示，只是 references 为空。

### 4. 问题改写节点（LLM - Rewriter）

轻量模型。把模糊问题改写为清晰的健康咨询问题，提升检索命中率。引用 `{{BOT_USER_INPUT}}`，输出 `rewritten_query`。

```
# 角色
你是一位专业的HIV/AIDS健康管理顾问。任务是理解HIV/AIDS患者的咨询需求并准确改写问题。若问题已清晰（如"什么是CD4细胞？"）则原样输出。

# 改写示例
- "拉米夫定怎么吃" + "有什么副作用吗" → "HIV患者服用拉米夫定有哪些副作用和注意事项？"
- "最近总是很累" + "这正常吗" → "HIV患者出现持续疲劳症状是否正常，需要如何处理？"
- "什么是CD4细胞？" → "什么是CD4细胞？"（无需改写）
```

> Workflow API 无状态，不自带多轮上下文。如需上下文，由小程序端拼接最近 N 条对话作为额外参数传入。

### 5. 知识库检索节点（Knowledge）— 保留来源

用 `rewritten_query` 检索。知识库上传 `doc/RAG/文献/` 下的 88 篇文献，**文件名即溯源名**，保持文件名规范（如 `中国艾滋病诊疗指南2021.pdf`）。

- 检索模式：混合检索（语义 + 关键词）
- Top-K：5；相似度阈值：0.6；分段：500-800 字符
- **控制台开启「输出引用 / recall slices」**，确保 `knowledge_results` 保留每个片段的文档名

### 6. 安全过滤节点（LLM - Filter）— 不要丢来源

轻量模型。过滤不适内容，但**必须保留来源标记**（这是真溯源的关键）：

```
检查以下检索结果是否适合回答HIV/AIDS患者的健康问题。
过滤规则：移除过时治疗方案、移除易引起恐慌的无解释统计数据；保留循证建议、药物相互作用警告、生活方式建议。

保留循证内容，并在每段保留其来源标记，输出格式：
[1][来源:中国艾滋病诊疗指南2021] <片段内容>
[2][来源:WHO HIV治疗指南] <片段内容>
若所有内容都不适合，输出"无相关参考资料"。
```

输入 `knowledge_results`，输出 `filtered_context`。

### 7. 回答生成节点（LLM - Generator）— 输出结构化 JSON（核心）

主力模型（推理能力强）。**JSON 输出格式要求只写在这一个节点**。同时引用图谱上下文和知识库结果作参考：

```
你是一位专业的HIV/AIDS健康管理顾问，服务于复旦大学护理学院的患者健康管理项目。

## 角色定位
- 提供循证医学建议，不替代医生诊断；语气温和、专业、无歧视；尊重隐私。

## 回答规则
1. 基于参考信息回答，不编造；参考不足则明确告知并建议咨询医生。
2. 涉及用药调整必须强调"请在医生指导下进行"；不提供具体剂量；不做预后判断。
3. 回答 200-400 字，通俗易懂，适当分点。

## 参考信息
【知识图谱/症状网络检索结果】
{{GRAPH_CONTEXT}}

【知识库检索结果】
{{filtered_context}}

【用户问题】
{{BOT_USER_INPUT}}

## 输出格式（必须严格执行）
你只能引用上方真实出现的来源（[来源:xxx] 或图谱节点），禁止编造任何文献。
请严格只输出一个 JSON 对象，不要包裹 ```json 代码块、不要任何多余文字，结构如下：

{"answer":"面向患者的健康建议正文","references":[{"title":"文献/指南名称","evidence_level":"A|B|C","snippet":"支撑该结论的原文片段"}],"need_human":false}

规则：
1. references 只能来自上方 filtered_context 中真实出现的来源；最多 3 条，选最相关的；若无可靠来源则为空数组 []。
2. snippet 填该来源里**支撑结论的原文片段**（指南/文献原句），**控制在 80 字以内**（过长易导致 JSON 括号错位）。
3. 证据等级：诊疗指南/专家共识=A，系统综述/RCT=B，一般文献/观察性研究=C。
4. 无法回答（参考不足、超出范围）时 need_human=true，并在 answer 说明建议转人工。
5. **JSON 括号务必正确闭合**：references 数组只用一对 []，每个文献对象一对 {}；数组结束的 ] 之后直接跟 "need_human"，不要多写或少写 ] 和 }。输出前自查括号配对。
```

> **关于畸形 JSON**：LLM 生成长嵌套 JSON 时，偶发多吐一个 `]` 或 `}`（snippet 越长、references 越多越容易发生）。规则 1/2/5 从源头降低概率：限制 references≤3 条、snippet≤80 字、明确括号闭合要求。
> 即便如此仍无法 100% 杜绝，因此**前后端都做了括号配平容错**：从第一个 `{` 起逐字符做花括号配平（跳过字符串内的括号），深度归零处即为合法 JSON 结尾，自动丢弃尾部多余字符。后端 `parseStructured`、前端 `parseAnswerJSON` 均如此，双重兜底。若该 Coze LLM 节点支持「输出格式=JSON / JSON 模式」，建议直接开启，比提示词约束更可靠。

### 8. 结束节点（End）

输出变量名 `output`（或 `data`），值为节点 7（或各分支）输出的 JSON 字符串。

---

## 后端对接（`cloudfunctions/coze/index.js`，已完成，无需改）

### 发送参数
```js
parameters: {
  BOT_USER_INPUT: question,          // 只有干净用户问题
  GRAPH_CONTEXT: graphContext || '', // 图谱上下文，独立参数
  user_id: userId || 'anonymous'
}
```

### 解析回答
- `parseStructured(raw)` — **优先**解析 JSON：容错剥离 ```json 围栏、截取首个 `{` 到末个 `}`。映射为 `references[].{title, evidence_level(归一A/B/C), snippet}` + `need_human`。
- `parseLiterature(raw)` — **回退**：JSON 解析失败时解析旧的 `【参考文献】\n1. xxx | 证据等级:A` 文本格式。**因此工作流未改造时线上也不报错**。
- `evidence_level` 兼容中文：高→A、中→B、低→C，缺省 C。
- `detectNeedHuman()` — 回答过短/含兜底语时兜底置 need_human。

### KG/SN 节点联动（不依赖工作流，后端本地完成）
`buildGraphContext(question, matchText)` 用节点名字符串匹配（label 长度≥2 且出现在文本中）：
- **第一遍** `buildGraphContext(question)`：仅用问题匹配，生成注入工作流的 `GRAPH_CONTEXT`。
- **第二遍** `buildGraphContext(question, question+"\n"+answer)`：用**问题+回答正文**回扫，识别回答里实际涉及的 KG/SN 节点，覆盖补全 `references.kg_nodes / sn_nodes` 和 `thinking`。
  - 例：问"拉米夫定有什么副作用"，回答提到"头痛/腹泻/恶心"，这些症状节点也会被识别并展示。
- 命中节点写入 `references.kg_nodes`（label/type/relations）、`references.sn_nodes`（label/group/strength/neighbors），`thinking.steps` 反映检索过程。

> KG/SN 节点是否显示，取决于**问题或回答文字里是否出现 `kg_nodes`/`sn_graph` 集合里的节点名**，与工作流无关。若某次问答没显示节点，说明文本里没出现已收录的节点名。

### 返回给前端的契约
```js
data: {
  answer,                                  // 纯回答文本
  references: { literature[], kg_nodes[], sn_nodes[] },
  thinking: { sn_matched[], kg_matched[], steps[] },
  needHuman, elapsedMs, qa_id, conversationId
}
```

---

## 小程序前端联动（`pages/qa/qa`，已完成）

- **思考过程**：可折叠，展示检索命中的 KG/SN 节点和步骤。
- **引用来源**（可折叠）：
  - 参考文献：序号 + 标题 + A/B/C 证据等级；**点击可展开看 snippet**（指南/文献原文片段）。
  - 症状网络 / 知识图谱节点：**点击跳转图谱页并聚焦该节点**。
- **应答耗时**、**转人工咨询**（need_human 时，弹云端客服二维码）。

### 节点跳转图谱协议
点击 KG/SN 节点 → 打开 web-view：
```
https://fudan-hiv-kg-sn.cloud/kg-sn.html?focus=<节点名>&type=<kg|sn>
```
`kg-sn.html` 加载后读取 URL 参数，自动在对应分区（kg=上区 / sn=下区，缺省两区都试）搜索该节点并**高亮节点+邻居、弱化其余**。

---

## 上线与验证

1. 按节点 1/2/6/7 改提示词（开始节点加 `GRAPH_CONTEXT`、分类器只引用 `BOT_USER_INPUT`、过滤节点保留来源、生成节点输出 JSON），发布工作流（**Workflow ID 不变，无需改 config.js**）。
2. 微信开发者工具重新上传部署 `coze` 云函数。

| 测试输入 | 分类器输出 | references | need_human |
|----------|-----------|------------|------------|
| 拉米夫定有什么副作用 | health_qa | 1~3 条真实文献(A/B/C) + KG/SN节点 | false |
| CD4低于200怎么办 | health_qa | ≥1 条诊疗指南(A) | false |
| 你好 | greeting | [] | false |
| 今天股市怎么样 | off_topic | [] | false |
| 我不想活了 | emergency | [] | true |

3. 小程序问答页确认：思考过程、参考文献可展开看 snippet、KG/SN 节点可点击跳图谱并聚焦、应答耗时、转人工入口。

---

## 注意事项

1. **Token 安全**：API Token 仅在云函数 `config.js`，勿提交公开仓库。
2. **超时**：Workflow 同步调用，云函数超时设 20s+；后端有 KG 全量加载（带缓存），首次稍慢。
3. **知识库更新**：定期更新文献以反映最新诊疗指南；文件名即溯源名，保持规范。
4. **三条铁律**（见开头）是本项目踩坑总结，改工作流时务必遵守，尤其勿让 JSON 格式指令污染分类节点。