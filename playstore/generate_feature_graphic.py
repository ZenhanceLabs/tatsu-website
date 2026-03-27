"""
Play Store Feature Graphic Generator - Multi-language
Size: 1024x500
Usage: python generate_feature_graphic.py [--lang ja|en|ko]
"""
import os
import sys
import re
import json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1024, 500
OUTPUT_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.join(os.path.dirname(__file__), "..")

FONTS = {
    'ja': "C:/Windows/Fonts/meiryo.ttc",
    'en': "C:/Windows/Fonts/segoeui.ttf",
    'ko': "C:/Windows/Fonts/malgun.ttf",
}

TEXTS = {
    'ja': {
        'tagline_1': 'がんばらなくていい',
        'tagline_2': 'デジタルデトックス。',
    },
    'en': {
        'tagline_1': 'Digital detox —',
        'tagline_2': 'no willpower needed.',
    },
    'ko': {
        'tagline_1': '노력 없이도 되는',
        'tagline_2': '디지털 디톡스.',
    },
}

def font(size, lang='ja'):
    try:
        path = FONTS[lang]
        idx = 0
        return ImageFont.truetype(path, size, index=idx)
    except:
        return ImageFont.load_default()

def load_img(name):
    p = os.path.join(BASE_DIR, name)
    if os.path.exists(p):
        return Image.open(p).convert("RGBA")
    return None

def load_first_cat():
    cats_path = os.path.join(BASE_DIR, "pixelcats.js")
    try:
        with open(cats_path, "r", encoding="utf-8") as f:
            content = f.read()
            match = re.search(r'const pixelCats\s*=\s*(\[.*\]);', content, re.DOTALL)
            if match:
                cats_data = json.loads(match.group(1))
                for c in cats_data:
                    if 'data' in c and isinstance(c['data'], list):
                        return c
    except Exception as e:
        print(f"Error loading cats: {e}")
    return None

def draw_cat(cat_info, pixel_size=6):
    if not cat_info:
        return None
    data_rows = cat_info.get('data', [])
    pal = cat_info.get('pal', {})
    if not data_rows: return None

    cat_w = len(data_rows[0]) * pixel_size
    cat_h = len(data_rows) * pixel_size
    img = Image.new("RGBA", (cat_w, cat_h), (0,0,0,0))
    d = ImageDraw.Draw(img)

    for y, row in enumerate(data_rows):
        for x, char in enumerate(row):
            if char != '0' and char in pal:
                color = pal[char]
                d.rectangle([x*pixel_size, y*pixel_size, (x+1)*pixel_size, (y+1)*pixel_size], fill=color)
    return img

def draw_feature_graphic(lang='ja'):
    t = TEXTS[lang]
    bg = Image.new("RGBA", (W, H), (252, 253, 255, 255))
    draw = ImageDraw.Draw(bg)

    icon = load_img("app_icon.png")
    if icon:
        iw = 110
        icon = icon.resize((iw, iw), Image.Resampling.LANCZOS)
        bg.paste(icon, (70, 100), icon)

    f_title = font(64, lang)
    TEXT_COLOR = (40, 48, 60, 255)
    draw.text((210, 108), "TATSU", font=f_title, fill=TEXT_COLOR)

    f_sub = font(34, lang)
    draw.text((75, 250), t['tagline_1'], font=f_sub, fill=TEXT_COLOR)
    draw.text((75, 310), t['tagline_2'], font=f_sub, fill=TEXT_COLOR)

    f_foot = font(14, lang)
    draw.text((75, H - 40), "© Zenhance", font=f_foot, fill=(180, 185, 195, 255))

    cat_info = load_first_cat()
    cat_img = draw_cat(cat_info, pixel_size=20)
    if cat_img:
        cx = W - cat_img.width - 60
        cy = (H - cat_img.height) // 2
        bg.paste(cat_img, (cx, cy), cat_img)

    return bg

if __name__ == "__main__":
    lang = 'ja'
    for i, arg in enumerate(sys.argv):
        if arg == '--lang' and i+1 < len(sys.argv):
            lang = sys.argv[i+1]
    if lang not in TEXTS:
        print(f"Unknown language: {lang}. Supported: ja, en, ko")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating feature graphic [{lang}]...")
    img = draw_feature_graphic(lang)
    suffix = '' if lang == 'ja' else f'_{lang}'
    out_path = os.path.join(OUTPUT_DIR, f"feature_graphic{suffix}.png")
    img.save(out_path, "PNG")
    print(f"Saved to {out_path}")
