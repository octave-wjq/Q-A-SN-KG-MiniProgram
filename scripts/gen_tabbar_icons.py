# -*- coding: utf-8 -*-
"""
生成小程序 tabBar 图标（5个 x 2态 = 10个 PNG）。
尺寸 81x81 RGBA 透明底；普通态灰 #8A93A0，激活态薄荷绿 #2DC97E。
线性图标风格，纯 PIL 绘制。
"""
import os
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   'miniprogram', 'images', 'tabbar')

SIZE = 81
# 用 4x 超采样再缩小，得到抗锯齿的平滑线条
SS = 4
W = SIZE * SS

GRAY = (138, 147, 160, 255)   # #8A93A0
GREEN = (45, 201, 126, 255)   # #2DC97E
LW = 5 * SS                   # 线宽


def new_canvas():
    return Image.new('RGBA', (W, W), (0, 0, 0, 0))


def finish(img, path):
    img = img.resize((SIZE, SIZE), Image.LANCZOS)
    img.save(path)


def line(d, pts, color, width=LW):
    d.line(pts, fill=color, width=width, joint='curve')
    # 圆角线头
    r = width // 2
    for (x, y) in [pts[0], pts[-1]]:
        d.ellipse([x - r, y - r, x + r, y + r], fill=color)


def draw_home(d, c):
    # 房子：屋顶三角 + 房身
    m = W * 0.20
    cx = W / 2
    top = W * 0.20
    eave = W * 0.42      # 屋檐高度
    bottom = W * 0.80
    left = W * 0.24
    right = W * 0.76
    # 屋顶
    line(d, [(left - W*0.02, eave + W*0.03), (cx, top), (right + W*0.02, eave + W*0.03)], c)
    # 房身（左右墙 + 底）
    line(d, [(left, eave), (left, bottom), (right, bottom), (right, eave)], c)
    # 门
    door_w = W * 0.10
    line(d, [(cx - door_w, bottom), (cx - door_w, bottom - W*0.18),
             (cx + door_w, bottom - W*0.18), (cx + door_w, bottom)], c)


def draw_chat(d, c):
    # 对话气泡 + 小尾巴 + 三个点
    left = W * 0.20
    right = W * 0.80
    top = W * 0.22
    bot = W * 0.62
    r = W * 0.10
    d.rounded_rectangle([left, top, right, bot], radius=r, outline=c, width=LW)
    # 尾巴
    line(d, [(W*0.36, bot), (W*0.32, W*0.76), (W*0.50, bot)], c)
    # 三个点
    dot = W * 0.035
    cy = (top + bot) / 2
    for fx in [0.36, 0.50, 0.64]:
        x = W * fx
        d.ellipse([x - dot, cy - dot, x + dot, cy + dot], fill=c)


def draw_graph(d, c):
    # 知识图谱：中心节点 + 三个外围节点连线
    cx, cy = W / 2, W / 2
    R = W * 0.26
    rc = W * 0.085   # 节点半径
    import math
    nodes = []
    for ang in [-90, 30, 150]:
        x = cx + R * math.cos(math.radians(ang))
        y = cy + R * math.sin(math.radians(ang))
        nodes.append((x, y))
    # 连线
    for (x, y) in nodes:
        line(d, [(cx, cy), (x, y)], c, width=int(LW*0.8))
    # 外围节点（描边圆）
    for (x, y) in nodes:
        d.ellipse([x - rc, y - rc, x + rc, y + rc], outline=c, width=LW)
        d.ellipse([x - rc, y - rc, x + rc, y + rc], fill=c)
    # 中心节点（实心）
    rcen = W * 0.11
    d.ellipse([cx - rcen, cy - rcen, cx + rcen, cy + rcen], fill=c)


def draw_health(d, c):
    # 心形 + 心电线（健康）
    import math
    cx = W / 2
    top = W * 0.30
    # 用两段圆弧+下尖近似心形轮廓（描边）
    pts = []
    for t in range(0, 361, 3):
        a = math.radians(t)
        # 心形参数方程
        x = 16 * (math.sin(a) ** 3)
        y = 13 * math.cos(a) - 5 * math.cos(2*a) - 2 * math.cos(3*a) - math.cos(4*a)
        pts.append((cx + x * (W*0.022), W*0.50 - y * (W*0.022)))
    d.line(pts + [pts[0]], fill=c, width=LW, joint='curve')
    # 心电线
    line(d, [(W*0.30, W*0.50), (W*0.40, W*0.50), (W*0.46, W*0.40),
             (W*0.54, W*0.60), (W*0.60, W*0.50), (W*0.70, W*0.50)], c, width=int(LW*0.85))


def draw_user(d, c):
    # 头 + 肩
    cx = W / 2
    head_r = W * 0.15
    head_cy = W * 0.34
    d.ellipse([cx - head_r, head_cy - head_r, cx + head_r, head_cy + head_r],
              outline=c, width=LW)
    # 肩（半圆弧）
    sw = W * 0.27
    top = W * 0.58
    bot = W * 0.86
    d.arc([cx - sw, top, cx + sw, bot + (bot-top)], start=180, end=360, fill=c, width=LW)


ICONS = {
    'home': draw_home,
    'chat': draw_chat,
    'graph': draw_graph,
    'health': draw_health,
    'user': draw_user,
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, fn in ICONS.items():
        for active, color in [(False, GRAY), (True, GREEN)]:
            img = new_canvas()
            d = ImageDraw.Draw(img)
            fn(d, color)
            fname = f'{name}-active.png' if active else f'{name}.png'
            finish(img, os.path.join(OUT, fname))
            print('生成', fname)
    print('完成，输出目录:', OUT)


if __name__ == '__main__':
    main()
