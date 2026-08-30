import { Article, Hero, Lead, Raw } from "reacticle";
import { SectionProblem } from "./sections/01-problem";
import { SectionTech } from "./sections/02-tech";
import { SectionFeatures } from "./sections/03-features";
import { SectionClosing } from "./sections/04-closing";

export function ArticleDoc() {
  return (
    <Article toc width="regular">
      <Hero
        title='把"循证健康管理"装进微信'
        subtitle="每个回答都有据可查，每个症状都在图谱里找到关联"
        meta={[
          { label: "团队", value: "复旦大学护理学院" },
          { label: "平台", value: "微信小程序" },
        ]}
      />
      <Lead>
        HIV 患者每天面对的，不只是疾病本身——还有用药的复杂、症状的混乱、信息的真假难辨。
        这个小程序用知识图谱、RAG 智能问答、症状网络三项技术，给出一个简单的答案：
        <strong>让每一条健康建议，都能说清楚"从哪来"。</strong>
      </Lead>

      <SectionProblem />
      <SectionTech />
      <SectionFeatures />
      <SectionClosing />

      <Raw title="">
        <footer
          style={{
            marginTop: "var(--ra-space-7, 3rem)",
            paddingTop: "var(--ra-space-4, 1rem)",
            borderTop: "1px solid var(--ra-color-border, currentColor)",
            color: "var(--ra-color-muted, inherit)",
            fontSize: "var(--ra-text-xs, 0.78rem)",
            textAlign: "center",
            letterSpacing: "0.02em",
            opacity: 0.85,
          }}
        >
          Made with{" "}
          <a
            href="https://github.com/ConardLi/garden-skills"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "underline",
              textUnderlineOffset: "0.2em",
            }}
          >
            beautiful-article
          </a>{" "}
          · andy theme
        </footer>
      </Raw>
    </Article>
  );
}
