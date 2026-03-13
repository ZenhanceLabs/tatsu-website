"""
Play Store 宣伝画像ジェネレーター v3
ライトテーマ、Meiryo Bold 極太、プレミアム感のあるデザイン
"""
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920
FRAME_COLOR = (139, 140, 137)
FRAME_STROKE = (163, 164, 161)
BEZEL_COLOR = (5, 5, 5)
SCREEN_BG = (30, 30, 30)

FONT_BOLD = "C:/Windows/Fonts/meiryob.ttc"
FONT_REGULAR = "C:/Windows/Fonts/meiryo.ttc"

BASE_DIR = os.path.join(os.path.dirname(__file__), "..")
OUTPUT_DIR = os.path.dirname(__file__)

# ── Background colors (light, clean palette) ──
BG_WHITE = (245, 247, 250)
BG_SOFT_BLUE = (230, 238, 250)
BG_SOFT_GREEN = (232, 245, 238)
BG_SOFT_PURPLE = (238, 232, 248)
BG_SOFT_ORANGE = (252, 242, 230)
BG_SOFT_INDIGO = (228, 232, 250)
TEXT_DARK = (20, 25, 35)
TEXT_ACCENT = (50, 100, 220)
TEXT_SUB = (90, 100, 120)

def font(size, bold=True):
    try:
        return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size, index=0)
    except:
        return ImageFont.load_default()

def gradient_bg(w, h, c1, c2):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for i in range(h):
        r = c1[0] + (c2[0] - c1[0]) * i // h
        g = c1[1] + (c2[1] - c1[1]) * i // h
        b = c1[2] + (c2[2] - c1[2]) * i // h
        d.line([(0,i),(w,i)], fill=(r,g,b))
    return img

def load_ss(name):
    p = os.path.join(BASE_DIR, name)
    if os.path.exists(p):
        return Image.open(p).convert("RGB")
    return None

def draw_phone(canvas, cx, cy, phone_w, ss_img=None):
    """Draw phone at center-top (cx, cy). Returns phone bounding info."""
    phone_h = int(phone_w * 820 / 380)
    px = cx - phone_w // 2
    py = cy
    draw = ImageDraw.Draw(canvas)
    sx = phone_w / 380
    sy = phone_h / 820

    # Frame body
    draw.rounded_rectangle(
        [px+10*sx, py+10*sy, px+370*sx, py+810*sy],
        radius=int(42*sx), fill=FRAME_COLOR, outline=FRAME_STROKE, width=max(2,int(1.5*sx))
    )
    # Inner bezel
    draw.rounded_rectangle(
        [px+14*sx, py+14*sy, px+366*sx, py+806*sy],
        radius=int(38*sx), fill=BEZEL_COLOR
    )
    # Screen
    scr_x, scr_y = px+20*sx, py+20*sy
    scr_w, scr_h = 340*sx, 780*sy
    scr_r = int(32*sx)
    draw.rounded_rectangle([scr_x, scr_y, scr_x+scr_w, scr_y+scr_h], radius=scr_r, fill=SCREEN_BG)

    if ss_img is not None:
        ss = ss_img.copy()
        tw, th = int(scr_w), int(scr_h)
        scale = max(tw/ss.width, th/ss.height)
        nw, nh = int(ss.width*scale), int(ss.height*scale)
        ss = ss.resize((nw,nh), Image.Resampling.LANCZOS)
        l = (nw-tw)//2; t = (nh-th)//2
        ss = ss.crop((l,t,l+tw,t+th))
        mask = Image.new("L",(tw,th),0)
        ImageDraw.Draw(mask).rounded_rectangle([0,0,tw,th], radius=scr_r, fill=255)
        canvas.paste(ss, (int(scr_x),int(scr_y)), mask)

    # Punch hole center
    pcx, pcy = px+190*sx, py+46*sy
    pr = 11*sx
    draw.ellipse([pcx-pr,pcy-pr,pcx+pr,pcy+pr], fill=(0,0,0))
    lr = 4.5*sx
    draw.ellipse([pcx-lr,pcy-lr,pcx+lr,pcy+lr], fill=(26,26,36))
    # Speaker
    draw.rounded_rectangle([px+160*sx,py+14*sy,px+220*sx,py+16*sy], radius=1, fill=(34,34,34))
    # Side buttons
    bx = px+370*sx; bw = 2.5*sx
    for bs,be in [(200,245),(250,295),(330,375)]:
        draw.rectangle([bx,py+bs*sy,bx+bw,py+be*sy], fill=(68,68,68))
    return (px, py, phone_w, phone_h)

def text_center(draw, text, y, w, fnt, fill=TEXT_DARK):
    bbox = draw.textbbox((0,0), text, font=fnt)
    tw = bbox[2]-bbox[0]
    draw.text(((w-tw)//2, y), text, font=fnt, fill=fill)


# ════════════════════════════════════════
# SLIDES 1+2: 大スクショを急角度で斜めに横断
# ════════════════════════════════════════

def make_slide_1_2():
    GAP = 30
    CW = W*2 + GAP
    combined = gradient_bg(CW, H, (240, 244, 252), (220, 230, 248))

    # ── Large tilted phone spanning both slides (draw FIRST, text on top) ──
    ss = load_ss("home.png")
    pw = 900
    ph = int(pw * 820 / 380)
    pad = 80
    temp = Image.new("RGBA", (pw+pad*2, ph+pad*2), (0,0,0,0))
    temp_rgb = Image.new("RGB", temp.size, (200,200,200))
    draw_phone(temp_rgb, temp.width//2, pad, pw, ss)
    tmask = Image.new("L", temp.size, 0)
    tmd = ImageDraw.Draw(tmask)
    tsx = pw/380
    tmd.rounded_rectangle(
        [pad+6*tsx, pad+6*(ph/820), pad+374*tsx, pad+814*(ph/820)],
        radius=int(44*tsx), fill=255
    )
    temp_rgba = temp_rgb.convert("RGBA")
    temp_rgba.putalpha(tmask)

    # Rotate 35 degrees
    rotated = temp_rgba.rotate(35, expand=True, resample=Image.Resampling.BICUBIC)

    # Position: balanced half-half across the two slides
    paste_x = CW//2 - rotated.width//2 + 0
    paste_y = H - rotated.height + 500

    combined.paste(rotated.convert("RGB"), (paste_x, paste_y), rotated)

    # ── Text on slide 1 lower-left area (drawn ON TOP of phone) ──
    draw = ImageDraw.Draw(combined)
    f_big = font(96)
    f_sub = font(56, bold=False)

    lx = 60
    draw.text((lx, 1260), "受動的", font=f_big, fill=TEXT_DARK)
    draw.text((lx, 1390), "デジタル", font=f_big, fill=TEXT_DARK)
    draw.text((lx, 1520), "デトックス", font=f_big, fill=TEXT_DARK)
    draw.text((lx, 1670), "システムに", font=f_sub, fill=TEXT_SUB)
    draw.text((lx, 1740), "身を委ねるだけ。", font=f_sub, fill=TEXT_SUB)

    # ── Text on slide 2 upper-right area ──
    s2x = W + GAP
    f_feat = font(96)
    f_desc = font(56, bold=False)

    tx = s2x + W - 800
    draw.text((tx, 120), "AIが提案する", font=f_feat, fill=TEXT_DARK)
    draw.text((tx, 250), "あなた専用の", font=f_feat, fill=TEXT_DARK)
    draw.text((tx, 380), "制限タスク。", font=f_feat, fill=TEXT_DARK)
    draw.text((tx, 540), "意志の力に頼らず、", font=f_desc, fill=TEXT_SUB)
    draw.text((tx, 610), "スマホ時間を減らします。", font=f_desc, fill=TEXT_SUB)

    # Split
    s1 = combined.crop((0, 0, W, H))
    s2 = combined.crop((W+GAP, 0, W+GAP+W, H))
    return s1, s2


# ════════════════════════════════════════
# SLIDES 3-7: Phone emerging from bottom
# ════════════════════════════════════════

def make_slide_3():
    """制限モード – select_mode.png"""
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_BLUE)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)

    text_center(draw, "3つの", 90, W, f_t, TEXT_DARK)
    text_center(draw, "制限モード", 240, W, f_t, TEXT_DARK)
    text_center(draw, "あなたに合ったスタイルで", 420, W, f_s, TEXT_SUB)
    text_center(draw, "デトックスを始めよう", 490, W, f_s, TEXT_SUB)

    phone_w = int(W * 0.82)
    ss = load_ss("select_mode.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


def make_slide_4():
    """分析 – analysis_1.png"""
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_PURPLE)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)

    text_center(draw, "スマホ利用を", 90, W, f_t, TEXT_DARK)
    text_center(draw, "可視化", 240, W, f_t, TEXT_DARK)
    text_center(draw, "習慣の改善度合いを", 420, W, f_s, TEXT_SUB)
    text_center(draw, "グラフでチェック", 490, W, f_s, TEXT_SUB)

    phone_w = int(W * 0.82)
    ss = load_ss("analysis_1.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


def make_slide_5():
    """電子猫 – catsfile.png"""
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_GREEN)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)

    text_center(draw, "かわいい", 90, W, f_t, TEXT_DARK)
    text_center(draw, "電子猫を集めよう", 240, W, f_t, TEXT_DARK)
    text_center(draw, "デトックスの頑張りが", 420, W, f_s, TEXT_SUB)
    text_center(draw, "ご褒美に変わる！", 490, W, f_s, TEXT_SUB)

    phone_w = int(W * 0.82)
    ss = load_ss("catsfile.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


def make_slide_6():
    """プライバシー – analysis_2.png"""
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_INDIGO)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_a = font(70) # Keeping accent font size since it's a 2-line title + 2-line bold accent
    
    text_center(draw, "データは完全に", 90, W, f_t, TEXT_DARK)
    text_center(draw, "ローカル処理。", 240, W, f_t, TEXT_DARK)
    text_center(draw, "外部送信ゼロ。", 420, W, f_a, TEXT_ACCENT)
    text_center(draw, "安心のプライバシー設計。", 520, W, f_a, TEXT_ACCENT)

    phone_w = int(W * 0.82)
    ss = load_ss("analysis_2.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


def make_slide_7():
    """制限の自動提案 – restriction.png"""
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_ORANGE)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)

    text_center(draw, "使いすぎを検知し", 90, W, f_t, TEXT_DARK)
    text_center(draw, "自動で制限を提案。", 240, W, f_t, TEXT_DARK)

    text_center(draw, "AIがあなたの利用傾向を分析し", 420, W, f_s, TEXT_SUB)
    text_center(draw, "最適な制限タスクを", 490, W, f_s, TEXT_SUB)
    text_center(draw, "リアルタイムにおすすめ", 560, W, f_s, TEXT_SUB)

    phone_w = int(W * 0.82)
    ss = load_ss("restriction.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg

def make_slide_8():
    """高度な分析 – analysis_pro.png (No Pro badge)"""
    bg = gradient_bg(W, H, (240, 244, 252), (235, 235, 245))
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)

    text_center(draw, "さらに高度な", 90, W, f_t, TEXT_DARK)
    text_center(draw, "分析レポート。", 240, W, f_t, TEXT_DARK)

    text_center(draw, "過去のデータを元に", 420, W, f_s, TEXT_SUB)
    text_center(draw, "曜日ごとの利用パターンや", 490, W, f_s, TEXT_SUB)
    text_center(draw, "時間帯別の傾向を深く分析", 560, W, f_s, TEXT_SUB)

    phone_w = int(W * 0.82)
    ss = load_ss("analysis_pro.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


# ══════════════════════════════════════════
if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Generating slides 1-2...")
    s1, s2 = make_slide_1_2()
    s1.convert("RGB").save(os.path.join(OUTPUT_DIR, "slide_1.jpg"), "JPEG", quality=95)
    s2.convert("RGB").save(os.path.join(OUTPUT_DIR, "slide_2.jpg"), "JPEG", quality=95)
    print("  → slide_1.jpg, slide_2.jpg")

    for num, gen in [(3,make_slide_3),(4,make_slide_4),(5,make_slide_5),(6,make_slide_6),(7,make_slide_7),(8,make_slide_8)]:
        print(f"Generating slide {num}...")
        img = gen()
        img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"slide_{num}.jpg"), "JPEG", quality=95)
        print(f"  → slide_{num}.jpg")

    print("\nDone!")
