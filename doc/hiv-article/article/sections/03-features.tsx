import { Section, Raw } from "reacticle";

export function SectionFeatures() {
  const features = [
    {
      icon: "💬",
      title: "健康问答",
      tag: "随时问，放心问",
      points: [
        "标注「AI 生成，仅供参考」",
        "展开「思考过程」看检索路径",
        "展开参考文献 · 可看原文片段",
        "答不上来 → 转人工咨询",
      ],
    },
    {
      icon: "🕸️",
      title: "知识-症状图谱",
      tag: '把知识"看"出来',
      points: [
        "交互式网络图：缩放 / 拖拽 / 搜索",
        "点击节点高亮局部关系",
        "问答点击节点直跳图谱",
        "筛选关系类型，避免信息过载",
      ],
    },
    {
      icon: "📋",
      title: "健康管理",
      tag: "用药 · 复诊 · 运动 · 饮食",
      points: [
        "用药提醒：自动生成时间，逐条打卡",
        "复诊提醒：提前 1/3/7 天推送",
        "热量计算：食物库选食累加",
        "消息通知：到点准时提醒",
      ],
    },
    {
      icon: "🩺",
      title: "症状自查",
      tag: "勾一勾，给建议",
      points: [
        "勾选症状 · 标记严重程度",
        "伴随症状预警（网络推算）",
        "分级建议：紧急 / 随访 / 日常",
        "紧急情况：一键拨打 120",
      ],
    },
  ];

  return (
    <Section index="03" title="四大功能">
      <p>
        打开微信小程序，底部四个 Tab，覆盖 HIV/AIDS 患者日常健康管理的全场景。
        技术在后台，患者看到的是简单、直接、放心用的工具。
      </p>

      <Raw title="四大功能一览">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--ra-space-4, 1rem)",
            margin: "var(--ra-space-4, 1rem) 0",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "var(--ra-color-surface)",
                border: "1.5px solid var(--ra-color-border, currentColor)",
                borderRadius: "var(--ra-radius-lg, 1rem)",
                padding: "var(--ra-space-5, 1.5rem) var(--ra-space-4, 1rem) var(--ra-space-4, 1rem)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--ra-space-3, 0.75rem)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--ra-space-2, 0.5rem)" }}>
                <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{f.icon}</span>
                <strong
                  style={{
                    fontSize: "var(--ra-text-base, 1rem)",
                    fontWeight: "var(--ra-font-weight-bold, 700)",
                    color: "var(--ra-color-fg, inherit)",
                  }}
                >
                  {f.title}
                </strong>
              </div>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "var(--ra-text-xs, 0.72rem)",
                  color: "var(--ra-color-accent)",
                  fontWeight: "700",
                  letterSpacing: "0.06em",
                  background: "color-mix(in srgb, var(--ra-color-accent) 12%, transparent)",
                  borderRadius: "var(--ra-radius-full, 999px)",
                  padding: "0.15em 0.7em",
                  width: "fit-content",
                }}
              >
                {f.tag}
              </span>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "var(--ra-space-4, 1rem)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--ra-space-1, 0.25rem)",
                }}
              >
                {f.points.map((pt) => (
                  <li
                    key={pt}
                    style={{
                      fontSize: "var(--ra-text-sm, 0.88rem)",
                      color: "var(--ra-color-muted, inherit)",
                      lineHeight: 1.5,
                    }}
                  >
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Raw>
    </Section>
  );
}
