# First Spread Review — HIV Article

审阅时间：2026-06-18
审阅范围：Cover.tsx · Article.tsx · sections/01-problem.tsx · plan/plan.md（缺失）

---

## 封面 5 条自检（Cover.tsx）

### 1. 图文并茂：有视觉主体（SVG）+ 文字层？
**PASS**
封面结构清晰：上 38% 为文字区（机构标签 + h1 + 副标题），下 62% 渲染 `<SymptomNetworkSVG />`，11 节点 16 条边的偏相关网络图，视觉主体充分。

### 2. 主题忠实：只用 --ra-* token，没有写死颜色/字体？
**FAIL**
存在硬编码 fallback 值，虽然写法是 `var(--ra-color-accent, #f97316)`，但 `#f97316`、`#fdf8f2`、`#1a1007`、`#a07850` 这四个写死颜色均直接出现在 `stopColor`、`fill`、SVG `text fill` 的 fallback 里。在主题切换或 token 覆盖时，这些 fallback 会透出，不符合"只用 token"的规范。

**修复点：**
- `SymptomNetworkSVG` 中所有 SVG 属性的 fallback 颜色统一替换为 `currentColor` 或去掉写死 hex，改为 CSS variable only。
- 或在组件顶层 `style={{ color: 'var(--ra-color-fg)' }}` 确保 `currentColor` 继承后，SVG 内部改用 `currentColor`。

### 3. 内容忠实：看封面能猜出文章讲什么？
**PASS**
"循证健康管理 / 为 HIV/AIDS 患者构建的 / 知识图谱 × RAG × 症状网络"加上症状网络 SVG，能准确预判文章主题。

### 4. 比例自适应：内部元素用百分比/相对单位，不写死 px？
**PASS**
封面容器用 `width: 100%`、`maxWidth: min(100%, 48rem, ...)`、`aspectRatio: 3/4`，内部分区用 `height: 38%`，padding 全部走 `--ra-space-*` token，SVG 用 `width/height: 100%` 加 `viewBox`。无写死 px 布局尺寸。

### 5. 不与 Hero 重复：封面文字 ≠ Hero 文字？
**PASS**
封面 h1 为"循证健康管理"，Hero title 为`把"循证健康管理"装进微信`。副标题也不同。文字层有差异，不构成逐字重复。

---

## 首屏整体评估（Article.tsx + 01-problem.tsx）

### Hero 标题/副题/meta 是否清晰框定主题？
**PASS**
- title：`把"循证健康管理"装进微信` — 点出载体（微信小程序）
- subtitle：`每个回答都有据可查，每个症状都在图谱里找到关联` — 点出两大功能轴（RAG 可溯源 + 症状图谱）
- meta：团队=复旦大学护理学院，平台=微信小程序 — 背景定位清晰

### Lead 是否用一两句框定主题+读者收获？
**PASS**
Lead 两句话：第一句点出患者三重痛点（用药/症状/信息），第二句点出解法（三技术）并以加粗的核心主张收尾"让每一条健康建议，都能说清楚'从哪来'"。主题+收获均框定到位。

### 第一节是否完成 plan.md Outline 里 Section 01 的任务？
**待议 — plan/plan.md 不存在（目录为空）**
无法对照 plan 校验。但从内容本身评估：Section 01 包含三大困境卡片（用药复杂/症状繁多/信息混乱）+ `<Aside tone="principle">` 核心判断 + 收尾段，结构完整，逻辑闭环。若 plan 要求即为"三大困境卡片 + Aside"，则：**PASS**（结构满足）。

**修复点：** 补充 `plan/plan.md`，否则后续 section 无法做计划对照核查。

### briefing 50% 信息保留比例是否体现？
**PASS（有限度）**
文章是原创构建，非对素材做 briefing 压缩，50% 保留率标准不直接适用。但从信息密度看：Lead + Section 01 共约 200 字，把三重困境、技术方案、核心主张全部覆盖，无废话填充，信息密度合理。

### andy 主题气质是否体现（圆角/暖橙/治愈感）？
**PASS**
- 圆角：封面用 `--ra-radius-lg`，卡片用 `--ra-radius-lg`，标签用 `--ra-radius-full`
- 暖橙：`--ra-color-accent` 贯穿封面 SVG 节点/连线/标签芯片
- 治愈感：三困境卡片用暖色 surface 背景（`--ra-color-surface`）+ emoji 图标，非冷硬风格

### Raw 是否服务段落论点，使用了 --ra-* token？
**PASS（主体）/ MINOR FAIL（SVG fallback）**
- Article.tsx footer 的 Raw 全部用 `--ra-space-*`、`--ra-color-*` token
- Section 01 三困境卡片的 Raw 全部用 `--ra-space-*`、`--ra-color-*`、`--ra-radius-*` token
- Cover.tsx 的 SVG 内部 fallback 存在写死颜色（同条目 2 问题），属于 Raw 层 token 使用不彻底

---

## 汇总

| 维度 | 结论 |
|------|------|
| 封面 1：图文并茂 | PASS |
| 封面 2：主题忠实（token only） | **FAIL** — SVG fallback 有 4 个写死 hex |
| 封面 3：内容忠实 | PASS |
| 封面 4：比例自适应 | PASS |
| 封面 5：不与 Hero 重复 | PASS |
| Hero 清晰度 | PASS |
| Lead 框定 | PASS |
| Section 01 完成度 | PASS（plan.md 缺失，无法做计划对照）|
| briefing 信息保留 | PASS |
| andy 气质 | PASS |
| Raw token 使用 | PASS（主体），同封面 2 的 SVG fallback 问题 |

**唯一需要修复的硬问题：** Cover.tsx 中 `SymptomNetworkSVG` 的 SVG 颜色 fallback 写死了 `#f97316`、`#fdf8f2`、`#1a1007`、`#a07850`，需替换为 `currentColor` 或去掉 fallback。其余均通过。

**建议补充：** 在 `plan/plan.md` 中落地完整 Outline，供后续 section 做计划对照核查。
