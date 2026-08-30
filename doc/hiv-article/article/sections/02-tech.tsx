import { Section, Aside, Raw } from "reacticle";

export function SectionTech() {
  const steps = [
    { num: "1", label: "意图识别", desc: "判断健康问题 / 闲聊 / 紧急情况" },
    { num: "2", label: "图谱检索", desc: "命中知识图谱与症状网络节点" },
    { num: "3", label: "知识库检索", desc: "89 篇权威文献语义召回" },
    { num: "4", label: "循证生成", desc: "标注证据等级 A / B / C" },
    { num: "5", label: "溯源展示", desc: "展开参考文献 · 可看原文片段" },
  ];

  return (
    <Section index="02" title="三项核心技术">
      <p>
        这套系统的技术底座由三层构成，分别回答不同层面的问题：
        RAG 解决<strong>回答可信度</strong>，知识图谱解决<strong>知识系统性</strong>，
        症状网络解决<strong>伴随症状预判</strong>。
      </p>

      {/* ── RAG ── */}
      <Raw title="RAG 问答：一次提问的五步链路">
        <div style={{ margin: "var(--ra-space-3, 0.75rem) 0 var(--ra-space-5, 1.5rem)" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--ra-space-2, 0.5rem)",
            }}
          >
            {steps.map((s, i) => (
              <div
                key={s.num}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--ra-space-3, 0.75rem)",
                  position: "relative",
                }}
              >
                {/* 连接线 */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "1.1rem",
                      top: "2rem",
                      bottom: "-0.6rem",
                      width: "2px",
                      background: "var(--ra-color-border, currentColor)",
                      opacity: 0.35,
                    }}
                  />
                )}
                <span
                  style={{
                    minWidth: "2.2rem",
                    height: "2.2rem",
                    borderRadius: "var(--ra-radius-full, 999px)",
                    background: "var(--ra-color-accent)",
                    color: "var(--ra-color-on-accent, #fff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "var(--ra-font-weight-bold, 700)",
                    fontSize: "var(--ra-text-sm, 0.9rem)",
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {s.num}
                </span>
                <div style={{ paddingTop: "0.3rem" }}>
                  <strong
                    style={{
                      fontSize: "var(--ra-text-base, 1rem)",
                      color: "var(--ra-color-fg, inherit)",
                    }}
                  >
                    {s.label}
                  </strong>
                  <span
                    style={{
                      fontSize: "var(--ra-text-sm, 0.9rem)",
                      color: "var(--ra-color-muted, inherit)",
                      marginLeft: "var(--ra-space-2, 0.5rem)",
                    }}
                  >
                    — {s.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Raw>

      <Aside tone="principle" label="关键差异">
        别的 AI 告诉你"答案"，这套系统还告诉你<strong>"答案从哪来"</strong>——
        每条回答标注证据等级，可展开看原文片段。
      </Aside>

      <p>
        知识图谱从权威文献中抽取了 <strong>2806 个实体节点</strong>、
        <strong>3712 条关系边</strong>、<strong>19 种关系类型</strong>，
        涵盖疾病、症状、药物、检查、并发症、不良反应、传播途径等。
        比如：<code>HIV感染 —推荐药物→ 拉米夫定</code>、
        <code>拉米夫定 —不良反应→ 头痛</code>——
        知识不再是孤立的句子，而是可查询、可推理的网络。
      </p>

      <p>
        症状网络则来自真实患者数据——用 GraphicalLasso 偏相关算法，
        计算出 <strong>27 个症状之间的统计关联</strong>。
        如果数据显示"疲乏"与"焦虑""失眠"高度相关，
        当患者报告疲乏时，系统就能预警可能伴随的其他症状。
        这是从群体数据里"算"出来的规律，不靠经验猜测。
      </p>

      <Raw title="两类知识底座的分工">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--ra-space-3, 0.75rem)",
            margin: "var(--ra-space-3, 0.75rem) 0",
          }}
        >
          {[
            {
              tag: "知识图谱",
              q: "是什么？为什么？",
              desc: "文献语义驱动\n2806 节点 · 3712 关系",
            },
            {
              tag: "症状网络",
              q: "还可能有什么？",
              desc: "患者数据驱动\n27 症状 · 偏相关网络",
            },
          ].map((item) => (
            <div
              key={item.tag}
              style={{
                background: "var(--ra-color-surface)",
                border: "1.5px solid var(--ra-color-border, currentColor)",
                borderRadius: "var(--ra-radius-lg, 1rem)",
                padding: "var(--ra-space-4, 1rem)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--ra-space-2, 0.5rem)",
              }}
            >
              <span
                style={{
                  fontSize: "var(--ra-text-xs, 0.75rem)",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  color: "var(--ra-color-accent)",
                  textTransform: "uppercase",
                }}
              >
                {item.tag}
              </span>
              <strong
                style={{
                  fontSize: "var(--ra-text-base, 1rem)",
                  color: "var(--ra-color-fg, inherit)",
                }}
              >
                {item.q}
              </strong>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--ra-text-sm, 0.88rem)",
                  color: "var(--ra-color-muted, inherit)",
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Raw>
    </Section>
  );
}
