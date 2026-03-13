"""
Play Store Feature Graphic Generator - Minimalist Version
Size: 1024x500
Light, clean, elegant theme. No screenshots. Just one iconic cat.
"""
import os
import re
import json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1024, 500
OUTPUT_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.join(os.path.dirname(__file__), "..")

# Using the regular Meiryo font for a thinner, lighter look
FONT_REGULAR = "C:/Windows/Fonts/meiryo.ttc"

def font(size):
    try:
        return ImageFont.truetype(FONT_REGULAR, size, index=0)
    except:
        return ImageFont.load_default()

def load_img(name):
    p = os.path.join(BASE_DIR, name)
    if os.path.exists(p):
        return Image.open(p).convert("RGBA")
    return None

def load_first_cat():
    """Load only the first cat (Classic White) from pixelcats.js"""
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
    """Render a single cat to PIL Image"""
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

def create_gradient_bg():
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    # A very subtle, elegant soft gradient (Top-Left: Almost White -> Bottom-Right: Soft Sky)
    for x in range(W):
        for y in range(H):
            ratio = (x/W + y/H) / 2
            r = int(255 - ratio * 15)
            g = int(255 - ratio * 12)
            b = int(255 - ratio * 5)
            d.point((x, y), fill=(r, g, b))
    return img.convert("RGBA")

def draw_feature_graphic():
    bg = Image.new("RGBA", (W, H), (252, 253, 255, 255))
    draw = ImageDraw.Draw(bg)
    
    # ── Left Side: Minimalist Icon & Typgraphy ──
    # Icon with rounded corners and transparent background
    icon = load_img("app_icon.png")
    if icon:
        iw = 110
        icon = icon.resize((iw, iw), Image.Resampling.LANCZOS)
        imask = Image.new("L", icon.size, 0)
        ImageDraw.Draw(imask).rounded_rectangle([0, 0, iw, iw], radius=24, fill=255)
        # Drop shadow for icon
        shadow = Image.new("RGBA", (iw+20, iw+20), (0,0,0,0))
        ImageDraw.Draw(shadow).rounded_rectangle([10, 10, iw+10, iw+10], radius=24, fill=(0,0,0,30))
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        bg.paste(shadow, (70-10, 100-10+6), shadow)
        
        bg.paste(icon, (70, 100), imask)

    # Typgraphy
    f_title = font(64)
    # Use dark slate/charcoal color for elegance instead of complete black
    TEXT_COLOR = (40, 48, 60, 255)
    
    draw.text((210, 108), "TATSU", font=f_title, fill=TEXT_COLOR)
    
    f_sub = font(34)
    # Use thinner, non-bold text for the catchphrase with elegant spacing
    draw.text((75, 250), "がんばらなくていい", font=f_sub, fill=TEXT_COLOR)
    draw.text((75, 310), "デジタルデトックス。", font=f_sub, fill=TEXT_COLOR)
    
    f_foot = font(14)
    draw.text((75, H - 40), "© Zenhance", font=f_foot, fill=(180, 185, 195, 255)) # Very subtle copyright

    # ── Right Side: Iconic Classic White Cat ──
    # We remove screenshots and just use the singular, iconic white pixel cat
    # placed centrally on the right side.
    cat_info = load_first_cat()
    cat_img = draw_cat(cat_info, pixel_size=10) # Large pixel size
    if cat_img:
        # Add a soft drop shadow to the cat
        c_shadow = cat_img.copy().convert("RGBA")
        # Turn cat shadow pure black
        cdata = c_shadow.load()
        for x in range(c_shadow.width):
            for y in range(c_shadow.height):
                _, _, _, a = cdata[x,y]
                if a > 0:
                    cdata[x,y] = (0,0,0,40)
        c_shadow = c_shadow.filter(ImageFilter.GaussianBlur(20))
        
        cx = W - cat_img.width - 140
        cy = (H - cat_img.height) // 2 + 10
        
        bg.paste(c_shadow, (cx, cy+15), c_shadow)
        bg.paste(cat_img, (cx, cy), cat_img)

    return bg

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Generating minimalist feature graphic...")
    img = draw_feature_graphic()
    out_path = os.path.join(OUTPUT_DIR, "feature_graphic.png")
    img.save(out_path, "PNG")
    print(f"Saved to {out_path}")
