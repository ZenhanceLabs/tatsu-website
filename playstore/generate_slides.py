"""
Play Store 宣伝画像ジェネレーター v4 (Multi-language)
ライトテーマ、プレミアム感のあるデザイン
Usage: python generate_slides.py [--lang ja|en|ko]
"""
import os
import sys
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920
FRAME_COLOR = (139, 140, 137)
FRAME_STROKE = (163, 164, 161)
BEZEL_COLOR = (5, 5, 5)
SCREEN_BG = (30, 30, 30)

# ── Fonts per language ──
FONTS = {
    'ja': {
        'bold': ("C:/Windows/Fonts/meiryob.ttc", 0),
        'regular': ("C:/Windows/Fonts/meiryo.ttc", 0),
    },
    'en': {
        'bold': ("C:/Windows/Fonts/segoeuib.ttf", 0),
        'regular': ("C:/Windows/Fonts/segoeui.ttf", 0),
    },
    'ko': {
        'bold': ("C:/Windows/Fonts/malgunbd.ttf", 0),
        'regular': ("C:/Windows/Fonts/malgun.ttf", 0),
    },
}

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

# ── Multi-language texts ──
TEXTS = {
    'ja': {
        's1_lines': ["受動的", "デジタル", "デトックス"],
        's1_sub': ["システムに", "身を委ねるだけ。"],
        's2_lines': ["AIが提案する", "あなた専用の", "制限タスク。"],
        's2_sub': ["意志の力に頼らず、", "スマホ時間を減らします。"],
        's3_title': ["3つの", "制限モード"],
        's3_sub': ["あなたに合ったスタイルで", "デトックスを始めよう"],
        's4_title': ["スマホ利用を", "可視化"],
        's4_sub': ["習慣の改善度合いを", "グラフでチェック"],
        's5_title': ["かわいい", "電子猫を集めよう"],
        's5_sub': ["デトックスの頑張りが", "ご褒美に変わる！"],
        's6_title': ["データは完全に", "ローカル処理。"],
        's6_accent': ["外部送信ゼロ。", "安心のプライバシー設計。"],
        's7_title': ["使いすぎを検知し", "自動で制限を提案。"],
        's7_sub': ["AIがあなたの利用傾向を分析し", "最適な制限タスクを", "リアルタイムにおすすめ"],
        's8_title': ["さらに高度な", "分析レポート。"],
        's8_sub': ["過去のデータを元に", "曜日ごとの利用パターンや", "時間帯別の傾向を深く分析"],
    },
    'en': {
        's1_lines': ["Passive", "Digital", "Detox"],
        's1_sub': ["Just let the", "system take over."],
        's2_lines': ["AI-suggested", "app limits", "made for you."],
        's2_sub': ["No willpower needed.", "Cut screen time effortlessly."],
        's3_title': ["3 restriction", "modes"],
        's3_sub': ["Find the style that suits you", "and start your detox"],
        's4_title': ["Visualize your", "phone usage"],
        's4_sub': ["Track habit improvements", "with clear charts"],
        's5_title': ["Collect adorable", "Pixel Cats"],
        's5_sub': ["Your detox efforts", "turn into rewards!"],
        's6_title': ["Data processed", "entirely on-device."],
        's6_accent': ["Zero external transfers.", "Privacy by design."],
        's7_title': ["Detects overuse &", "suggests limits."],
        's7_sub': ["AI analyzes your usage patterns", "and recommends optimal", "restriction tasks in real time"],
        's8_title': ["Advanced", "analytics reports."],
        's8_sub': ["Based on past data,", "deep analysis of daily patterns", "and hourly usage trends"],
    },
    'ko': {
        's1_lines': ["알아서 해주는", "디지털", "디톡스"],
        's1_sub': ["시스템에 맡기기만", "하면 됩니다."],
        's2_lines': ["AI가 제안하는", "맞춤형", "앱 제한."],
        's2_sub': ["의지력에 기대지 않고,", "스마트폰 시간을 줄입니다."],
        's3_title': ["3가지", "제한 모드"],
        's3_sub': ["나에게 맞는 스타일로", "디톡스를 시작하세요"],
        's4_title': ["스마트폰 사용", "패턴을 한눈에"],
        's4_sub': ["그래프로 습관 개선을", "확인해 보세요"],
        's5_title': ["귀여운", "전자 고양이 모으기"],
        's5_sub': ["디톡스 노력이", "보상으로 바뀝니다!"],
        's6_title': ["데이터는 완전", "로컬 처리."],
        's6_accent': ["외부 전송 제로.", "안심의 프라이버시 설계."],
        's7_title': ["과다 사용 감지 &", "자동 제한 제안."],
        's7_sub': ["AI가 사용 패턴을 분석하고", "맞춤형 앱 제한을", "실시간으로 추천"],
        's8_title': ["한층 더 정교해진", "분석 리포트."],
        's8_sub': ["과거 데이터를 바탕으로", "요일별 사용 패턴과", "시간대별 경향을 심층 분석"],
    }
}

# ── Screenshot names per language ──
SS_SUFFIX = {'ja': '', 'en': '_en', 'ko': '_ko'}
SS_DIR = {'ja': '', 'en': 'screenshot/', 'ko': 'screenshot/'}

current_lang = 'ja'

def font(size, bold=True):
    try:
        f = FONTS[current_lang]
        path, idx = f['bold'] if bold else f['regular']
        return ImageFont.truetype(path, size, index=idx)
    except:
        return ImageFont.load_default()

def gradient_bg(w, h, c1, c2):
    """Smooth vertical gradient with dithering to prevent banding."""
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for i in range(h):
        t = i / max(h - 1, 1)
        r = int(c1[0] + (c2[0] - c1[0]) * t + random.uniform(-0.5, 0.5))
        g = int(c1[1] + (c2[1] - c1[1]) * t + random.uniform(-0.5, 0.5))
        b = int(c1[2] + (c2[2] - c1[2]) * t + random.uniform(-0.5, 0.5))
        r, g, b = max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b))
        d.line([(0,i),(w,i)], fill=(r,g,b))
    return img

def load_ss(name):
    """Load screenshot with language suffix. name should be base like 'home.png'"""
    base, ext = os.path.splitext(name)
    suffix = SS_SUFFIX[current_lang]
    ss_dir = SS_DIR[current_lang]
    p = os.path.join(BASE_DIR, f"{ss_dir}{base}{suffix}{ext}")
    if os.path.exists(p):
        return Image.open(p).convert("RGB")
    # Fallback to root (Japanese)
    p2 = os.path.join(BASE_DIR, name)
    if os.path.exists(p2):
        return Image.open(p2).convert("RGB")
    return None

def draw_phone(canvas, cx, cy, phone_w, ss_img=None):
    phone_h = int(phone_w * 820 / 380)
    px = cx - phone_w // 2
    py = cy
    draw = ImageDraw.Draw(canvas)
    sx = phone_w / 380
    sy = phone_h / 820
    draw.rounded_rectangle(
        [px+10*sx, py+10*sy, px+370*sx, py+810*sy],
        radius=int(42*sx), fill=FRAME_COLOR, outline=FRAME_STROKE, width=max(2,int(1.5*sx))
    )
    draw.rounded_rectangle(
        [px+14*sx, py+14*sy, px+366*sx, py+806*sy],
        radius=int(38*sx), fill=BEZEL_COLOR
    )
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

    pcx, pcy = px+190*sx, py+46*sy
    pr = 11*sx
    draw.ellipse([pcx-pr,pcy-pr,pcx+pr,pcy+pr], fill=(0,0,0))
    lr = 4.5*sx
    draw.ellipse([pcx-lr,pcy-lr,pcx+lr,pcy+lr], fill=(26,26,36))
    draw.rounded_rectangle([px+160*sx,py+14*sy,px+220*sx,py+16*sy], radius=1, fill=(34,34,34))
    bx = px+370*sx; bw = 2.5*sx
    for bs,be in [(200,245),(250,295),(330,375)]:
        draw.rectangle([bx,py+bs*sy,bx+bw,py+be*sy], fill=(68,68,68))
    return (px, py, phone_w, phone_h)

def text_center(draw, text, y, w, fnt, fill=TEXT_DARK):
    bbox = draw.textbbox((0,0), text, font=fnt)
    tw = bbox[2]-bbox[0]
    draw.text(((w-tw)//2, y), text, font=fnt, fill=fill)


def make_slide_1_2():
    t = TEXTS[current_lang]
    GAP = 30
    CW = W*2 + GAP
    combined = gradient_bg(CW, H, (240, 244, 252), (220, 230, 248))

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
    rotated = temp_rgba.rotate(35, expand=True, resample=Image.Resampling.BICUBIC)
    paste_x = CW//2 - rotated.width//2 + 0
    paste_y = H - rotated.height + 500
    combined.paste(rotated.convert("RGB"), (paste_x, paste_y), rotated)

    draw = ImageDraw.Draw(combined)
    f_big = font(96)
    f_sub = font(56, bold=False)

    lx = 60
    y_start = 1260
    for i, line in enumerate(t['s1_lines']):
        draw.text((lx, y_start + i * 130), line, font=f_big, fill=TEXT_DARK)
    sub_y = y_start + len(t['s1_lines']) * 130 + 20
    for i, line in enumerate(t['s1_sub']):
        draw.text((lx, sub_y + i * 70), line, font=f_sub, fill=TEXT_SUB)

    s2x = W + GAP
    f_feat = font(96)
    f_desc = font(56, bold=False)
    tx = s2x + W - 800
    for i, line in enumerate(t['s2_lines']):
        draw.text((tx, 120 + i * 130), line, font=f_feat, fill=TEXT_DARK)
    sub2_y = 120 + len(t['s2_lines']) * 130 + 30
    for i, line in enumerate(t['s2_sub']):
        draw.text((tx, sub2_y + i * 70), line, font=f_desc, fill=TEXT_SUB)

    s1 = combined.crop((0, 0, W, H))
    s2 = combined.crop((W+GAP, 0, W+GAP+W, H))
    return s1, s2


def make_slide_3():
    t = TEXTS[current_lang]
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_BLUE)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)
    for i, line in enumerate(t['s3_title']):
        text_center(draw, line, 90 + i * 150, W, f_t, TEXT_DARK)
    sub_y = 90 + len(t['s3_title']) * 150 + 30
    for i, line in enumerate(t['s3_sub']):
        text_center(draw, line, sub_y + i * 70, W, f_s, TEXT_SUB)
    phone_w = int(W * 0.82)
    ss = load_ss("select_mode.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


def make_slide_4():
    t = TEXTS[current_lang]
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_PURPLE)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)
    for i, line in enumerate(t['s4_title']):
        text_center(draw, line, 90 + i * 150, W, f_t, TEXT_DARK)
    sub_y = 90 + len(t['s4_title']) * 150 + 30
    for i, line in enumerate(t['s4_sub']):
        text_center(draw, line, sub_y + i * 70, W, f_s, TEXT_SUB)
    phone_w = int(W * 0.82)
    ss = load_ss("analysis_1.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


def make_slide_5():
    t = TEXTS[current_lang]
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_GREEN)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)
    for i, line in enumerate(t['s5_title']):
        text_center(draw, line, 90 + i * 150, W, f_t, TEXT_DARK)
    sub_y = 90 + len(t['s5_title']) * 150 + 30
    for i, line in enumerate(t['s5_sub']):
        text_center(draw, line, sub_y + i * 70, W, f_s, TEXT_SUB)
    phone_w = int(W * 0.82)
    ss = load_ss("catsfile.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


def make_slide_6():
    t = TEXTS[current_lang]
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_INDIGO)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_a = font(70)
    for i, line in enumerate(t['s6_title']):
        text_center(draw, line, 90 + i * 150, W, f_t, TEXT_DARK)
    accent_y = 90 + len(t['s6_title']) * 150 + 30
    for i, line in enumerate(t['s6_accent']):
        text_center(draw, line, accent_y + i * 100, W, f_a, TEXT_ACCENT)
    phone_w = int(W * 0.82)
    ss = load_ss("analysis_2.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


def make_slide_7():
    t = TEXTS[current_lang]
    bg = gradient_bg(W, H, (240, 244, 252), BG_SOFT_ORANGE)
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)
    for i, line in enumerate(t['s7_title']):
        text_center(draw, line, 90 + i * 150, W, f_t, TEXT_DARK)
    sub_y = 90 + len(t['s7_title']) * 150 + 30
    for i, line in enumerate(t['s7_sub']):
        text_center(draw, line, sub_y + i * 70, W, f_s, TEXT_SUB)
    phone_w = int(W * 0.82)
    ss = load_ss("restriction.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg

def make_slide_8():
    t = TEXTS[current_lang]
    bg = gradient_bg(W, H, (240, 244, 252), (235, 235, 245))
    draw = ImageDraw.Draw(bg)
    f_t = font(110)
    f_s = font(46, bold=False)
    for i, line in enumerate(t['s8_title']):
        text_center(draw, line, 90 + i * 150, W, f_t, TEXT_DARK)
    sub_y = 90 + len(t['s8_title']) * 150 + 30
    for i, line in enumerate(t['s8_sub']):
        text_center(draw, line, sub_y + i * 70, W, f_s, TEXT_SUB)
    phone_w = int(W * 0.82)
    ss = load_ss("analysis_pro.png")
    draw_phone(bg, W//2, 660, phone_w, ss)
    return bg


if __name__ == "__main__":
    # Parse --lang argument
    lang = 'ja'
    for i, arg in enumerate(sys.argv):
        if arg == '--lang' and i+1 < len(sys.argv):
            lang = sys.argv[i+1]
    if lang not in TEXTS:
        print(f"Unknown language: {lang}. Supported: ja, en, ko")
        sys.exit(1)

    current_lang = lang
    suffix = '' if lang == 'ja' else f'_{lang}'

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Generating slides for [{lang}]...")

    print("  Generating slides 1-2...")
    s1, s2 = make_slide_1_2()
    s1.convert("RGB").save(os.path.join(OUTPUT_DIR, f"slide_1{suffix}.jpg"), "JPEG", quality=95)
    s2.convert("RGB").save(os.path.join(OUTPUT_DIR, f"slide_2{suffix}.jpg"), "JPEG", quality=95)
    print(f"  → slide_1{suffix}.jpg, slide_2{suffix}.jpg")

    for num, gen in [(3,make_slide_3),(4,make_slide_4),(5,make_slide_5),(6,make_slide_6),(7,make_slide_7),(8,make_slide_8)]:
        print(f"  Generating slide {num}...")
        img = gen()
        img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"slide_{num}{suffix}.jpg"), "JPEG", quality=95)
        print(f"  → slide_{num}{suffix}.jpg")

    print(f"\nDone! ({lang})")
