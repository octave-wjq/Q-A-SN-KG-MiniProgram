# -*- coding: utf-8 -*-
"""生成公众号文章配图占位图（架构图/示意图/截图占位）。"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'doc', 'article_images')
os.makedirs(OUT, exist_ok=True)

# 字体
def load_font(size):
    for p in [
        '/System/Library/Fonts/PingFang.ttc',
        '/System/Library/Fonts/STHeiti Medium.ttc',
        '/System/Library/Fonts/Hiragino Sans GB.ttc',
    ]:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

GREEN = (45, 201, 126)
GREEN_D = (33, 168, 102)
GREEN_S = (232, 249, 240)
GRAY = (138, 147, 160)
DARK = (31, 45, 61)
BG = (245, 246, 248)
WHITE = (255, 255, 255)

def center_text(d, box, text, font, fill):
    x0, y0, x1, y1 = box
    bb = d.textbbox((0, 0), text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    d.text((x0 + (x1 - x0 - tw) / 2 - bb[0], y0 + (y1 - y0 - th) / 2 - bb[1]), text, font=font, fill=fill)

def rounded(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


# ---- 图1：项目整体架构图 ----
def fig_architecture():
    W, H = 1080, 720
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    f_title = load_font(38)
    f_box = load_font(26)
    f_small = load_font(20)

    center_text(d, (0, 24, W, 80), '艾滋病健康管理小程序 · 系统架构', f_title, DARK)

    # 前端层
    rounded(d, (60, 110, W - 60, 200), 18, fill=WHITE, outline=GREEN, width=3)
    center_text(d, (60, 110, W - 60, 150), '微信小程序前端', f_box, GREEN_D)
    labels = ['首页/症状自查', '健康问答', '知识-症状图谱', '健康管理']
    bw = (W - 160) / 4
    for i, t in enumerate(labels):
        x = 80 + i * bw
        rounded(d, (x, 158, x + bw - 20, 190), 10, fill=GREEN_S)
        center_text(d, (x, 158, x + bw - 20, 190), t, f_small, GREEN_D)

    # 箭头
    center_text(d, (0, 205, W, 235), '↓  云函数调用 / HTTPS', f_small, GRAY)

    # 云开发层
    rounded(d, (60, 245, W - 60, 420), 18, fill=WHITE, outline=GREEN, width=3)
    center_text(d, (60, 252, W - 60, 290), '微信云开发（Serverless 后端）', f_box, GREEN_D)
    cfuncs = ['coze\n问答RAG', 'kg\n知识图谱', 'sn\n症状网络', 'health\n健康管理', 'user\n用户']
    cw = (W - 160) / 5
    for i, t in enumerate(cfuncs):
        x = 80 + i * cw
        rounded(d, (x, 300, x + cw - 16, 360), 10, fill=GREEN_S)
        center_text(d, (x, 300, x + cw - 16, 360), t, f_small, GREEN_D)
    center_text(d, (60, 372, W - 60, 410), '云数据库：kg_nodes / kg_edges / sn_graph / qa_history / health_*', f_small, GRAY)

    center_text(d, (0, 425, W, 455), '↓', f_small, GRAY)

    # 外部能力层
    rounded(d, (60, 465, 520, 600), 18, fill=WHITE, outline=GREEN, width=3)
    center_text(d, (60, 472, 520, 510), 'Coze 工作流（RAG）', f_box, GREEN_D)
    center_text(d, (60, 515, 520, 595), '意图分类 → 检索 → 安全过滤\n→ 循证回答（带文献溯源）', f_small, GRAY)

    rounded(d, (560, 465, W - 60, 600), 18, fill=WHITE, outline=GREEN, width=3)
    center_text(d, (560, 472, W - 60, 510), '云服务器（图谱可视化）', f_box, GREEN_D)
    center_text(d, (560, 515, W - 60, 595), 'vis-network 渲染\n知识图谱 + 症状网络', f_small, GRAY)

    center_text(d, (0, 640, W, 690), '89 篇权威文献知识库 · 2806 节点知识图谱 · 27 节点症状网络', f_small, GREEN_D)
    img.save(os.path.join(OUT, '01_architecture.png'))
    print('生成 01_architecture.png')


# ---- 图2：RAG 问答流程图 ----
def fig_rag_flow():
    W, H = 1080, 520
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    f_title = load_font(36)
    f_box = load_font(24)
    f_small = load_font(19)
    center_text(d, (0, 24, W, 76), 'RAG 智能问答：让回答有据可查', f_title, DARK)

    steps = [
        ('用户提问', '“拉米夫定\n有什么副作用”'),
        ('图谱检索', '命中知识图谱/\n症状网络节点'),
        ('知识库检索', '89篇权威文献\n语义召回'),
        ('大模型生成', '循证回答\n+证据等级'),
        ('溯源展示', '展开看原文\n点节点跳图谱'),
    ]
    n = len(steps)
    bw = 180
    gap = (W - n * bw) / (n + 1)
    y0, y1 = 150, 360
    for i, (t, sub) in enumerate(steps):
        x = gap + i * (bw + gap)
        rounded(d, (x, y0, x + bw, y1), 16, fill=WHITE, outline=GREEN, width=3)
        center_text(d, (x, y0 + 16, x + bw, y0 + 70), t, f_box, GREEN_D)
        center_text(d, (x, y0 + 78, x + bw, y1 - 10), sub, f_small, GRAY)
        if i < n - 1:
            ax = x + bw + gap / 2
            center_text(d, (ax - 20, y0, ax + 20, y1), '→', f_title, GREEN)
    center_text(d, (0, 400, W, 470), '与纯大模型直接回答不同：先检索权威来源，再生成回答，并标注证据等级、可溯源到文献原文', f_small, GREEN_D)
    img.save(os.path.join(OUT, '02_rag_flow.png'))
    print('生成 02_rag_flow.png')


# ---- 图3：知识图谱 vs 症状网络 对比示意 ----
def fig_kg_sn():
    import math
    W, H = 1080, 560
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    f_title = load_font(34)
    f_box = load_font(26)
    f_small = load_font(19)
    f_node = load_font(16)

    # 左：知识图谱（语义驱动）
    center_text(d, (0, 24, W // 2, 70), '知识图谱（语义驱动）', f_box, GREEN_D)
    cx, cy = 270, 300
    d.ellipse((cx - 40, cy - 40, cx + 40, cy + 40), fill=(180, 35, 24))
    center_text(d, (cx - 40, cy - 40, cx + 40, cy + 40), 'HIV', f_node, WHITE)
    kg_nodes = [('发热', -90, (29, 78, 216)), ('拉米夫定', 30, (21, 128, 61)), ('CD4检测', 150, (3, 105, 161))]
    for label, ang, col in kg_nodes:
        x = cx + 150 * math.cos(math.radians(ang))
        y = cy + 150 * math.sin(math.radians(ang))
        d.line((cx, cy, x, y), fill=GRAY, width=2)
        d.ellipse((x - 36, y - 36, x + 36, y + 36), fill=col)
        center_text(d, (x - 36, y - 36, x + 36, y + 36), label, f_node, WHITE)
    center_text(d, (40, 470, W // 2 - 40, 540), '实体+关系三元组：疾病→症状、\n推荐药物、检查方法…来自权威文献', f_small, GRAY)

    # 分隔线
    d.line((W // 2, 90, W // 2, 470), fill=(210, 216, 226), width=2)

    # 右：症状网络（数据驱动）
    center_text(d, (W // 2, 24, W, 70), '症状网络（数据驱动）', f_box, GREEN_D)
    pts = [(720, 200), (860, 180), (960, 280), (820, 320), (700, 330), (900, 400)]
    names = ['疲乏', '失眠', '焦虑', '头晕', '食欲', '抑郁']
    cols = [(0, 114, 178), (240, 228, 66), (86, 180, 233), (0, 158, 115), (230, 159, 0), (204, 121, 167)]
    for i in range(len(pts)):
        for j in range(i + 1, len(pts)):
            if (i + j) % 2 == 0:
                d.line((pts[i][0], pts[i][1], pts[j][0], pts[j][1]), fill=(200, 210, 220), width=2)
    for (x, y), nm, col in zip(pts, names, cols):
        d.ellipse((x - 30, y - 30, x + 30, y + 30), fill=col)
        center_text(d, (x - 30, y - 30, x + 30, y + 30), nm, f_node, WHITE)
    center_text(d, (W // 2 + 40, 470, W - 40, 540), '症状间统计关联（偏相关网络）：\n揭示哪些症状容易相伴出现', f_small, GRAY)

    img.save(os.path.join(OUT, '03_kg_vs_sn.png'))
    print('生成 03_kg_vs_sn.png')


# ---- 通用占位图（截图/视频位） ----
def placeholder(name, title, ratio=(9, 16), note='此处替换为实际截图'):
    w = 600
    h = int(w * ratio[1] / ratio[0])
    img = Image.new('RGB', (w, h), WHITE)
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, w - 1, h - 1), outline=GREEN, width=4)
    f_t = load_font(34)
    f_n = load_font(22)
    center_text(d, (0, h / 2 - 80, w, h / 2 - 20), title, f_t, GREEN_D)
    center_text(d, (0, h / 2 + 10, w, h / 2 + 50), note, f_n, GRAY)
    # 顶部模拟手机状态栏
    d.rounded_rectangle((30, 30, w - 30, 90), radius=12, fill=GREEN_S)
    center_text(d, (30, 30, w - 30, 90), '📱 小程序界面', f_n, GREEN_D)
    img.save(os.path.join(OUT, name))
    print('生成', name)


if __name__ == '__main__':
    fig_architecture()
    fig_rag_flow()
    fig_kg_sn()
    placeholder('04_screen_qa.png', '健康问答页', note='截图：问答+思考过程+参考文献')
    placeholder('05_screen_graph.png', '知识-症状图谱', note='截图：图谱可视化+筛选')
    placeholder('06_screen_health.png', '健康管理页', note='截图：用药/复诊/热量')
    placeholder('07_screen_symptom.png', '症状自查', note='截图：勾选症状+管理建议')
    placeholder('08_demo_video.png', '🎬 Demo 视频', ratio=(16, 9), note='此处插入演示视频')
    print('全部完成，输出目录:', OUT)
