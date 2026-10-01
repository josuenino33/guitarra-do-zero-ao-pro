"""Gera os ícones do app (PNG e SVG) em docs/icons. Uso: python tools/icons.py"""
import os
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), '..', 'docs', 'icons')
BG, WOOD, NUT, FRET, STRING = '#17201C', '#3B2719', '#EFE8D6', '#CBD0D5', '#B7BCC1'
RED, AMBER, GREEN = '#D2412B', '#E59D1E', '#2C8A60'


def draw(size, pad):
    """Braço estilizado com três notas. `pad` é a margem de segurança (0..0.5)."""
    S = 4  # supersampling para bordas suaves
    W = size * S
    im = Image.new('RGBA', (W, W), BG)
    d = ImageDraw.Draw(im)
    x0, x1 = W * pad, W * (1 - pad)
    span = x1 - x0
    y0, y1 = W * 0.5 - span * 0.30, W * 0.5 + span * 0.30
    d.rounded_rectangle([x0, y0, x1, y1], radius=span * 0.05, fill=WOOD)
    d.rectangle([x0 + span * 0.12, y0, x0 + span * 0.16, y1], fill=NUT)
    for fx in (0.45, 0.74):
        d.rectangle([x0 + span * fx, y0, x0 + span * (fx + 0.022), y1], fill=FRET)
    for k in range(4):
        y = y0 + (y1 - y0) * (0.17 + 0.22 * k)
        d.rectangle([x0, y - span * 0.006, x1, y + span * 0.006], fill=STRING)
    ys = [y0 + (y1 - y0) * (0.17 + 0.22 * k) for k in range(4)]
    for cx, cy, r, c in ((0.595, ys[1], 0.11, RED), (0.30, ys[3], 0.08, AMBER), (0.87, ys[2], 0.08, GREEN)):
        X, R = x0 + span * cx, span * r
        d.ellipse([X - R, cy - R, X + R, cy + R], fill=c)
    return im.resize((size, size), Image.LANCZOS)


def main():
    os.makedirs(OUT, exist_ok=True)
    for size in (192, 512):
        draw(size, 0.10).save(os.path.join(OUT, f'icon-{size}.png'))
        draw(size, 0.22).save(os.path.join(OUT, f'icon-maskable-{size}.png'))
    draw(180, 0.12).convert('RGB').save(os.path.join(OUT, 'icon-180.png'))
    draw(32, 0.04).save(os.path.join(OUT, 'favicon-32.png'))
    print('ícones gerados em', os.path.abspath(OUT))


if __name__ == '__main__':
    main()
