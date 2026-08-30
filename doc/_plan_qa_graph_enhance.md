# 实施计划：图谱入口简化 + 问答证据溯源增强

## 问题1：graph tab 直接嵌 web-view 显示 kg-sn.html

**改动：**
- `pages/graph/graph.js`：onLoad 直接读取 kg-sn.html URL，data 里存 url。删除 openKg/openSn 双入口逻辑。
- `pages/graph/graph.wxml`：替换为单个 `<web-view src="{{url}}">`，删除两张卡片。
- `pages/graph/graph.json`：保持。
- `pages/graph/graph.wxss`：清空或保留容器样式。
- URL 改为 `https://fudan-hiv-kg-sn.cloud/kg-sn.html`（合并页）。
- webview 中间页 `pages/webview/` 保留（节点跳转仍用它带 focus 参数）。

## 问题2a：参考文献可展开看 snippet（命中文本块/指南内容）

**后端（coze 云函数）：** `parseStructured` 已解析 snippet（286行），无需改。确保 literature 项含 snippet 字段透传。
**前端：**
- `qa.wxml`：参考文献每条改为可点击展开，展开后显示 `lit.snippet`（指南原文/命中块）。加展开状态 `lit.expanded`。
- `qa.js`：加 `toggleLitDetail(e)` 切换某条文献展开。updateLastAiMessage 时给 literature 每项初始化 expanded:false。
- `qa.wxss`：加文献展开区样式（snippet 文本块、缩进、浅灰底）。

**工作流（你在 Coze 控制台）：** 回答生成节点 references 的 snippet 要填「真实命中的指南原文片段」。已在 guide 节点7模板里。

## 问题2b：体现用了哪些 KG/SN 节点（增强后端匹配）

**后端 `buildGraphContext`：** 当前只用「问题原文精确包含节点名」匹配（`q.indexOf(label)`）。
增强为：**同时扫描问题原文 + 回答正文**里出现的节点名。
- 修改 callWorkflow 流程：先拿到工作流回答 answer，再用 `question + answer` 一起做 KG/SN 节点匹配。
- 即把 buildGraphContext 拆成两步，或新增一个「从回答正文回扫节点」的逻辑，把命中的节点合并进 references.kg_nodes/sn_nodes。
- 这样"拉米夫定有什么副作用"的回答里提到"头痛/腹泻/恶心"等症状节点也能被识别并展示。
- 注意：buildGraphContext 当前在 callWorkflow 之前执行（要先有 context 注入）。需调整为：① 先 buildGraphContext(question) 拿 context 注入 → ② callWorkflow 得到 answer → ③ 再用 answer 回扫补充 kg_nodes/sn_nodes。

## 问题2c：点击节点跳图谱并只显示相关节点

**kg-sn.html（web/graph.html）：** 加 URL 参数支持。
- 读取 `?focus=节点名&type=kg|sn`，页面 initialize 后自动：把该名填入对应区(kg或sn)的搜索框 → 调用 trySearchAndFocus 等价逻辑 → 高亮该节点+邻居、弱化其余、focus 定位。
- 若 type 未指定，kg 和 sn 两区都尝试匹配。
- 需重新部署到 openclaw（scp + 已有 tmux 服务即时生效）。

**前端 qa：**
- `qa.wxml`：KG/SN 节点的 ref-item 加 bindtap，data-label=节点名 data-type=kg/sn。
- `qa.js`：加 `onRefNodeTap(e)` → `wx.navigateTo` 到 webview 页，url = `kg-sn.html?focus=节点名&type=kg/sn`（encodeURIComponent）。
- 文献项不跳转（无对应节点）。

## 问题3：更新 doc/coze-workflow-guide.md 为最终版

- 删除过时/冗余内容（早期分步骤、重复的简化版说明等）。
- 保留并整合：工作流节点结构、JSON 结构化输出（含 snippet 要求）、意图分类器防污染（GRAPH_CONTEXT 分离）、证据溯源最终方案。
- 新增：snippet 字段说明（参考文献展开看原文）、KG/SN 节点回传/匹配说明、节点跳转图谱的 URL 参数协议。
- 形成一份干净的「最终版」操作指南。

## 验证
- 后端：node -c cloudfunctions/coze/index.js
- 前端：node -c 各 js；wxml 标签平衡
- kg-sn.html 部署后 curl 测 ?focus= 参数页面可访问
- 真实问题链路（拉米夫定）：参考文献能展开看 snippet、KG/SN 节点有显示且可点击跳转

## 文件清单
- 改：pages/graph/graph.{js,wxml,wxss}
- 改：pages/qa/qa.{js,wxml,wxss}
- 改：cloudfunctions/coze/index.js（节点回扫匹配）
- 改：web/graph.html（URL focus 参数）→ 部署为 kg-sn.html
- 改：doc/coze-workflow-guide.md（最终版）
- 不动：pages/webview/（复用）
