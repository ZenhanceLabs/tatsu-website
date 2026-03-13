"""
Play Store Feature Graphic Generator
Size: 1024x500
"""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1024, 500
OUTPUT_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.join(os.path.dirname(__file__), "..")

BG_COLOR = (245, 247, 250)
TEXT_DARK = (20, 25, 35)
TEXT_SUB = (90, 100, 120)

FONT_BOLD = "C:/Windows/Fonts/meiryob.ttc"
FONT_REGULAR = "C:/Windows/Fonts/meiryo.ttc"

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

def load_img(name):
    p = os.path.join(BASE_DIR, name)
    if os.path.exists(p):
        return Image.open(p).convert("RGBA")
    return None

def draw_feature_graphic():
    bg = gradient_bg(W, H, (240, 244, 252), (230, 238, 250))
    draw = ImageDraw.Draw(bg)

    # Left side: Icon, Title, and Catchphrase
    # Load app icon
    icon = load_img("app_icon.png")
    if icon:
        # Resize if necessary
        icon = icon.resize((140, 140), Image.Resampling.LANCZOS)
        bg.paste(icon, (80, 80), icon)

    # "TATSU"
    f_title = font(90)
    draw.text((250, 90), "TATSU", font=f_title, fill=TEXT_DARK)

    # Catchphrase
    f_sub = font(36, bold=False)
    draw.text((80, 250), "システムに身を委ねるだけの", font=f_sub, fill=TEXT_DARK)
    f_sub_bold = font(38)
    draw.text((80, 310), "「受動的」デジタルデトックス", font=f_sub_bold, fill=TEXT_DARK)

    # Footer (Zenhance)
    f_foot = font(24, bold=False)
    draw.text((80, H - 60), "© Zenhance", font=f_foot, fill=TEXT_SUB)

    # Right side: Screenshots and Cats
    # Let's put a tilted screenshot.
    ss = load_img("home.png")
    if ss:
        # Draw phone like in generate_slides.py
        # But for brevity, we can just use the screenshot itself with rounded corners
        # Size it to about 300px height
        scale = 350 / ss.height
        new_w, new_h = int(ss.width * scale), int(ss.height * scale)
        ss = ss.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Add a simple border
        border_r = 16
        phone_img = Image.new("RGBA", (new_w + 12, new_h + 12), (0,0,0,0))
        pd = ImageDraw.Draw(phone_img)
        pd.rounded_rectangle([0, 0, new_w+12, new_h+12], radius=border_r+4, fill=(50,50,50))
        pd.rounded_rectangle([6, 6, new_w+6, new_h+6], radius=border_r, fill=(255,255,255))
        phone_img.paste(ss, (6, 6), ss if ss.mode=="RGBA" else None)
        
        # Tilt and paste
        rotated1 = phone_img.rotate(-15, expand=True, resample=Image.Resampling.BICUBIC)
        bg.paste(rotated1, (550, 80), rotated1)

        ss2 = load_img("restriction.png")
        if ss2:
            ss2 = ss2.resize((new_w, new_h), Image.Resampling.LANCZOS)
            phone_img2 = Image.new("RGBA", (new_w + 12, new_h + 12), (0,0,0,0))
            pd2 = ImageDraw.Draw(phone_img2)
            pd2.rounded_rectangle([0, 0, new_w+12, new_h+12], radius=border_r+4, fill=(50,50,50))
            pd2.rounded_rectangle([6, 6, new_w+6, new_h+6], radius=border_r, fill=(255,255,255))
            phone_img2.paste(ss2, (6, 6), ss2 if ss2.mode=="RGBA" else None)
            rotated2 = phone_img2.rotate(10, expand=True, resample=Image.Resampling.BICUBIC)
            bg.paste(rotated2, (750, 180), rotated2)

    return bg

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Generating feature graphic...")
    img = draw_feature_graphic()
    out_path = os.path.join(OUTPUT_DIR, "feature_graphic.png")
    img.save(out_path, "PNG")
    print(f"Saved to {out_path}")
