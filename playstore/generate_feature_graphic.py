"""
Play Store Feature Graphic Generator
Size: 1024x500
Dynamic, Cool, Dark/Neon Theme
"""
import os
import re
import json
import random
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1024, 500
OUTPUT_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.join(os.path.dirname(__file__), "..")

FONT_BOLD = "C:/Windows/Fonts/meiryob.ttc"
FONT_REGULAR = "C:/Windows/Fonts/meiryo.ttc"

def font(size, bold=True):
    try:
        return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size, index=0)
    except:
        return ImageFont.load_default()

def load_img(name):
    p = os.path.join(BASE_DIR, name)
    if os.path.exists(p):
        return Image.open(p).convert("RGBA")
    return None

def load_cats():
    """Load and parse cats from pixelcats.js"""
    cats_path = os.path.join(BASE_DIR, "pixelcats.js")
    try:
        with open(cats_path, "r", encoding="utf-8") as f:
            content = f.read()
            match = re.search(r'const pixelCats\s*=\s*(\[.*\]);', content, re.DOTALL)
            if match:
                cats_data = json.loads(match.group(1))
                return [c for c in cats_data if 'data' in c and isinstance(c['data'], list)]
    except Exception as e:
        print(f"Error loading cats: {e}")
    return []

def draw_cat(cat_info, pixel_size=4):
    """Render a single cat to PIL Image"""
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

def create_glowing_bg():
    # Dark modern gradient
    bg = Image.new("RGBA", (W, H), (15, 18, 25, 255))
    draw = ImageDraw.Draw(bg)
    for y in range(H):
        ratio = y / H
        # top dark blue to bottom dark purple/slate
        r = int(10 + ratio * 20)
        g = int(15 + ratio * 15)
        b = int(25 + ratio * 30)
        draw.line([(0, y), (W, y)], fill=(r,g,b,255))
        
    # Add glowing orbs for depth
    orbs = Image.new("RGBA", (W, H), (0,0,0,0))
    od = ImageDraw.Draw(orbs)
    od.ellipse([-200, -200, 400, 400], fill=(59, 130, 246, 60)) # Blue blur
    od.ellipse([700, 100, 1300, 700], fill=(139, 92, 246, 50)) # Purple blur
    od.ellipse([300, 300, 800, 800], fill=(99, 102, 241, 40)) # Indigo blur
    orbs = orbs.filter(ImageFilter.GaussianBlur(80))
    
    bg = Image.alpha_composite(bg, orbs)
    return bg

def draw_framed_phone(ss_img, width, border=4, radius=16):
    """Draws a simple rounded phone frame around a screenshot"""
    scale = width / ss_img.width
    nh = int(ss_img.height * scale)
    nw = width
    ss = ss_img.resize((nw, nh), Image.Resampling.LANCZOS)
    
    frame = Image.new("RGBA", (nw + border*2, nh + border*2), (0,0,0,0))
    fd = ImageDraw.Draw(frame)
    # Outer frame
    fd.rounded_rectangle([0, 0, frame.width, frame.height], radius=radius+border, fill=(20,20,25,255))
    # Inner border line
    fd.rounded_rectangle([border-1, border-1, frame.width-border+1, frame.height-border+1], radius=radius, outline=(80,80,90,255), width=1)
    
    # Mask for screenshot
    mask = Image.new("L", (nw, nh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0,0,nw,nh], radius=radius, fill=255)
    
    frame.paste(ss, (border, border), mask)
    
    # Add simple glare
    glare = Image.new("RGBA", frame.size, (0,0,0,0))
    gd = ImageDraw.Draw(glare)
    pts = [(0, 0), (frame.width*0.8, 0), (0, frame.height*0.5)]
    gd.polygon(pts, fill=(255,255,255,15))
    frame = Image.alpha_composite(frame, glare)
    
    return frame

def draw_feature_graphic():
    bg = create_glowing_bg()
    
    # ── Phones (Dynamic Arrangement on Right) ──
    ss1 = load_img("home.png")
    ss2 = load_img("analysis_1.png")
    
    if ss1 and ss2:
        pw = 260
        # Phone 1 (Back/Left)
        p1 = draw_framed_phone(ss2, pw)
        p1_rot = p1.rotate(12, expand=True, resample=Image.Resampling.BICUBIC)
        # Drop shadow for P1
        p1_shadow = p1_rot.copy().convert("RGBA")
        p1_shadow = p1_shadow.filter(ImageFilter.GaussianBlur(10))
        bg.paste((0,0,0,100), (450+10, 80+10), p1_shadow.getchannel("A"))
        bg.paste(p1_rot, (450, 80), p1_rot)
        
        # Phone 2 (Front/Right)
        p2 = draw_framed_phone(ss1, pw)
        p2_rot = p2.rotate(-8, expand=True, resample=Image.Resampling.BICUBIC)
        p2_shadow = p2_rot.copy().convert("RGBA")
        p2_shadow = p2_shadow.filter(ImageFilter.GaussianBlur(15))
        bg.paste((0,0,0,150), (660+15, 50+15), p2_shadow.getchannel("A"))
        bg.paste(p2_rot, (660, 50), p2_rot)

    # ── Cats (Floating around) ──
    cats = load_cats()
    if cats:
        random.seed(42) # Deterministic
        selected_cats = random.sample(cats, min(6, len(cats)))
        positions = [
            (380, 50, -15), (920, 100, 20), (520, 400, 10), 
            (880, 380, -25), (420, 250, 5), (800, 420, -10)
        ]
        
        for i, cat in enumerate(selected_cats):
            if i >= len(positions): break
            cimg = draw_cat(cat, pixel_size=5)
            if cimg:
                x, y, rot = positions[i]
                cimg_rot = cimg.rotate(rot, expand=True, resample=Image.Resampling.NEAREST)
                bg.paste(cimg_rot, (x, y), cimg_rot)

    # ── Text (Left aligned, modern typography) ──
    draw = ImageDraw.Draw(bg)
    
    # Icon and App Name
    icon = load_img("app_icon.png")
    if icon:
        icon = icon.resize((90, 90), Image.Resampling.LANCZOS)
        # Add a gentle glow to icon
        iglow = icon.copy().filter(ImageFilter.GaussianBlur(8))
        bg.paste((255,255,255,100), (60, 60), iglow.getchannel("A"))
        
        # Round the icon fully for the display
        imask = Image.new("L", icon.size, 0)
        ImageDraw.Draw(imask).rounded_rectangle([0,0,90,90], radius=20, fill=255)
        bg.paste(icon, (60, 60), imask)
    
    f_title = font(76)
    draw.text((170, 60), "TATSU", font=f_title, fill=(255,255,255,255))
    
    # Catchphrase
    f_sub = font(42)
    f_sub_bold = font(48, bold=True)
    draw.text((60, 200), "がんばらなくていい", font=f_sub_bold, fill=(96, 165, 250, 255)) # Blue-400
    draw.text((60, 260), "デジタルデトックス。", font=f_sub_bold, fill=(255,255,255,255))
    
    # Description
    f_desc = font(22, bold=False)
    draw.text((60, 340), "システムに身を委ねて、", font=f_desc, fill=(156, 163, 175, 255))
    draw.text((60, 375), "ストレスなくスマホ時間を減らそう。", font=f_desc, fill=(156, 163, 175, 255))

    # Copyright (Tiny, unobtrusive)
    f_foot = font(14, bold=False)
    draw.text((60, H - 30), "© 2026 Zenhance", font=f_foot, fill=(255, 255, 255, 60))

    return bg

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Generating cool feature graphic...")
    img = draw_feature_graphic()
    out_path = os.path.join(OUTPUT_DIR, "feature_graphic.png")
    img.save(out_path, "PNG")
    print(f"Saved to {out_path}")
