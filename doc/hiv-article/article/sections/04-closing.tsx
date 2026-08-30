import { Section, Quote, Raw } from "reacticle";

export function SectionClosing() {
  return (
    <Section index="04" title="写在最后">
      <p>
        这个项目想证明一件事：面向患者的 AI 健康工具，<strong>"可信"比"能说"更重要。</strong>
      </p>

      <p>
        知识图谱让知识成体系，症状网络让数据出洞察，RAG 让每个回答都可溯源——
        三者结合，把原本冰冷复杂的医学知识，
        变成 HIV/AIDS 患者触手可及、放心使用的日常工具。
      </p>

      <Quote>技术的价值，最终要落到一个个具体的人身上。</Quote>

      <Raw title="">
        <div
          style={{
            marginTop: "var(--ra-space-6, 2rem)",
            padding: "var(--ra-space-4, 1rem) var(--ra-space-5, 1.5rem)",
            background: "color-mix(in srgb, var(--ra-color-accent) 8%, transparent)",
            borderRadius: "var(--ra-radius-lg, 1rem)",
            border: "1px solid color-mix(in srgb, var(--ra-color-accent) 22%, transparent)",
            fontSize: "var(--ra-text-xs, 0.78rem)",
            color: "var(--ra-color-muted, inherit)",
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "var(--ra-color-fg, inherit)" }}>免责声明</strong>
          ：本项目由复旦大学护理学院团队研发。小程序内健康建议由 AI 生成，仅供参考，
          不能替代专业医生诊断，具体诊疗请遵医嘱。
        </div>
      </Raw>
    </Section>
  );
}
