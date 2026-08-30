export function Cover() {
  return (
    <section
      className="ra-cover"
      aria-label="文章封面"
      data-ra-cover=""
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "min(100%, 48rem, calc((100vh - 8rem) * 3 / 4))",
        margin: "0 auto var(--ra-space-7, 3rem) auto",
        aspectRatio: "3 / 4",
        overflow: "hidden",
        background: "var(--ra-color-surface, var(--ra-color-bg))",
        color: "var(--ra-color-fg, inherit)",
        borderRadius: "var(--ra-radius-lg, 1.5rem)",
        border: "1.5px solid var(--ra-color-border, currentColor)",
        isolation: "isolate",
      }}
    >
      {/* 上 1/3：文字区 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "38%",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "var(--ra-space-7, 3rem) var(--ra-space-7, 3rem) var(--ra-space-4, 1rem)",
          gap: "var(--ra-space-3, 0.75rem)",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "var(--ra-text-xs, 0.72rem)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            background: "var(--ra-color-accent)",
            color: "var(--ra-color-on-accent, #fff)",
            borderRadius: "var(--ra-radius-full, 999px)",
            padding: "0.2em 0.85em",
            width: "fit-content",
            fontWeight: "var(--ra-font-weight-bold, 700)",
          }}
        >
          复旦大学护理学院
        </span>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.7rem, 5vw, var(--ra-text-4xl, 2.8rem))",
            lineHeight: 1.1,
            fontWeight: "var(--ra-font-weight-bold, 700)",
            color: "var(--ra-color-fg, inherit)",
          }}
        >
          循证健康管理
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "var(--ra-text-sm, 0.92rem)",
            color: "var(--ra-color-muted, inherit)",
            lineHeight: 1.5,
          }}
        >
          为 HIV/AIDS 患者构建的
          <br />
          知识图谱 × RAG × 症状网络
        </p>
      </div>

      {/* 分割线 */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "var(--ra-space-7, 3rem)",
          right: "var(--ra-space-7, 3rem)",
          height: "1.5px",
          background: "var(--ra-color-border, currentColor)",
          opacity: 0.4,
          zIndex: 2,
        }}
      />

      {/* 下 2/3：症状网络 SVG 图 */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--ra-space-5, 1.5rem) var(--ra-space-6, 2rem) var(--ra-space-6, 2rem)",
        }}
      >
        <SymptomNetworkSVG />
      </div>

      {/* 底部角标 */}
      <div
        style={{
          position: "absolute",
          bottom: "var(--ra-space-4, 1rem)",
          right: "var(--ra-space-5, 1.5rem)",
          zIndex: 3,
          fontSize: "var(--ra-text-xs, 0.7rem)",
          color: "var(--ra-color-muted, inherit)",
          opacity: 0.6,
          letterSpacing: "0.05em",
        }}
      >
        微信小程序
      </div>
    </section>
  );
}

function SymptomNetworkSVG() {
  const nodes = [
    { id: "fatigue",   x: 50,  y: 42,  r: 9,  label: "疲乏",   primary: true },
    { id: "anxiety",   x: 26,  y: 25,  r: 7,  label: "焦虑",   primary: false },
    { id: "insomnia",  x: 74,  y: 22,  r: 7,  label: "失眠",   primary: false },
    { id: "pain",      x: 18,  y: 55,  r: 6,  label: "疼痛",   primary: false },
    { id: "nausea",    x: 82,  y: 56,  r: 6,  label: "恶心",   primary: false },
    { id: "fever",     x: 38,  y: 68,  r: 5.5,label: "发热",   primary: false },
    { id: "headache",  x: 63,  y: 70,  r: 5.5,label: "头痛",   primary: false },
    { id: "depress",   x: 50,  y: 16,  r: 5,  label: "抑郁",   primary: false },
    { id: "diarrhea",  x: 15,  y: 75,  r: 4.5,label: "腹泻",   primary: false },
    { id: "rash",      x: 85,  y: 78,  r: 4.5,label: "皮疹",   primary: false },
    { id: "appetite",  x: 50,  y: 82,  r: 4,  label: "食欲减退",primary: false },
  ];

  const edges = [
    { from: "fatigue",  to: "anxiety",  w: 3.2 },
    { from: "fatigue",  to: "insomnia", w: 3.0 },
    { from: "fatigue",  to: "pain",     w: 2.0 },
    { from: "fatigue",  to: "nausea",   w: 1.8 },
    { from: "fatigue",  to: "fever",    w: 1.5 },
    { from: "fatigue",  to: "headache", w: 1.5 },
    { from: "fatigue",  to: "appetite", w: 2.2 },
    { from: "anxiety",  to: "insomnia", w: 2.8 },
    { from: "anxiety",  to: "depress",  w: 2.4 },
    { from: "anxiety",  to: "pain",     w: 1.6 },
    { from: "insomnia", to: "depress",  w: 2.0 },
    { from: "insomnia", to: "headache", w: 1.4 },
    { from: "pain",     to: "diarrhea", w: 1.2 },
    { from: "nausea",   to: "appetite", w: 2.0 },
    { from: "fever",    to: "rash",     w: 1.3 },
    { from: "headache", to: "rash",     w: 1.0 },
  ];

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      aria-label="症状网络示意图：27个症状之间的统计关联"
      role="img"
    >
      <defs>
        <radialGradient id="cov-center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ra-color-accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--ra-color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 背景晕光 */}
      <ellipse cx="50" cy="42" rx="28" ry="26"
        fill="url(#cov-center-glow)" />

      {/* 连线 */}
      {edges.map((e) => {
        const a = getNode(e.from);
        const b = getNode(e.to);
        return (
          <line
            key={`${e.from}-${e.to}`}
            x1={a.x} y1={a.y}
            x2={b.x} y2={b.y}
            stroke="var(--ra-color-accent)"
            strokeWidth={e.w * 0.28}
            strokeOpacity={0.28 + e.w * 0.06}
            strokeLinecap="round"
          />
        );
      })}

      {/* 节点 */}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x} cy={n.y} r={n.r}
            fill={n.primary
              ? "var(--ra-color-accent)"
              : "var(--ra-color-surface)"}
            stroke="var(--ra-color-accent)"
            strokeWidth={n.primary ? 0 : 1.2}
            strokeOpacity={0.75}
            fillOpacity={n.primary ? 0.92 : 0.9}
          />
          <text
            x={n.x}
            y={n.y + n.r + 3.2}
            textAnchor="middle"
            fontSize={n.primary ? "4" : "3.4"}
            fontWeight={n.primary ? "700" : "400"}
            fill={n.primary
              ? "var(--ra-color-accent)"
              : "var(--ra-color-fg)"}
            fillOpacity={0.85}
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* 图例说明 */}
      <text x="50" y="97" textAnchor="middle"
        fontSize="2.8" fill="var(--ra-color-muted)" fillOpacity="0.7">
        27 个症状 · 偏相关网络
      </text>
    </svg>
  );
}
