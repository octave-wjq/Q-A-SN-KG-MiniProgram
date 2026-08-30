import { Section, Aside, Raw } from "reacticle";

export function SectionProblem() {
  const problems = [
    {
      icon: "💊",
      title: "用药复杂",
      desc: "长期抗病毒治疗、多种药物联用，副作用繁多，漏服风险高。",
    },
    {
      icon: "🌀",
      title: "症状繁多",
      desc: "27种常见症状相互关联，一个症状往往牵连多个，难以判断轻重缓急。",
    },
    {
      icon: "❓",
      title: "信息混乱",
      desc: "网上信息真假难辨，普通 AI 一本正经地胡说，医疗建议无据可查。",
    },
  ];

  return (
    <Section index="01" title="为什么需要这个工具？">
      <p>
        HIV/AIDS 患者的日常健康管理，远比想象中复杂。除了疾病本身，他们还要同时应对
        三重困境——而现有的数字工具，几乎没有一个真正解决这些问题。
      </p>

      <Raw title="三大困境">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--ra-space-4, 1rem)",
            margin: "var(--ra-space-4, 1rem) 0",
          }}
        >
          {problems.map((p) => (
            <div
              key={p.title}
              style={{
                background: "var(--ra-color-surface)",
                border: "1.5px solid var(--ra-color-border, currentColor)",
                borderRadius: "var(--ra-radius-lg, 1rem)",
                padding: "var(--ra-space-5, 1.5rem) var(--ra-space-4, 1rem)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--ra-space-2, 0.5rem)",
              }}
            >
              <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{p.icon}</span>
              <strong
                style={{
                  fontSize: "var(--ra-text-base, 1rem)",
                  color: "var(--ra-color-fg, inherit)",
                  fontWeight: "var(--ra-font-weight-bold, 700)",
                }}
              >
                {p.title}
              </strong>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--ra-text-sm, 0.9rem)",
                  color: "var(--ra-color-muted, inherit)",
                  lineHeight: 1.55,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Raw>

      <Aside tone="principle" label="核心判断">
        面向患者的 AI 健康工具，"可信"比"能说"更重要。
      </Aside>

      <p>
        这个小程序的出发点很简单：不只给答案，还要告诉患者<strong>答案从哪来</strong>。
        知识图谱、RAG 问答、症状网络三项技术，构成了这套工具背后的"可信底座"。
      </p>
    </Section>
  );
}
