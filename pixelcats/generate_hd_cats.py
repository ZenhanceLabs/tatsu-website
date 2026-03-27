import os
import json
import glob
from PIL import Image

def main():
    base_dir = r"c:\Dev\TATSU-Website\pixelcats"
    out_dir = os.path.join(base_dir, "hd_icons")
    os.makedirs(out_dir, exist_ok=True)
    
    scale = 20 # 21 * 20 = 420x420
    
    ts_files = glob.glob(os.path.join(base_dir, "catPatterns_*.ts"))
    print(f"Found {len(ts_files)} Cat Pattern files.")
    
    count = 0
    for f in ts_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        start = content.find('[')
        end = content.rfind(']') + 1
        if start == -1 or end == 0:
            print(f"Could not find array in {f}")
            continue
            
        json_str = content[start:end]
        try:
            cats = json.loads(json_str)
        except Exception as e:
            print(f"Error parsing {f}: {e}")
            continue
            
        for cat in cats:
            cat_id = cat.get("id", "unknown")
            pal = cat.get("pal", {})
            data = cat.get("data", [])
            overlay = cat.get("faceOverlay", [])
            
            img = Image.new("RGBA", (21, 21), (0, 0, 0, 0))
            pixels = img.load()
            
            # Helper to convert color
            def get_color(c):
                if c.startswith('#'):
                    h = c.lstrip('#')
                    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (255,)
                return (0, 0, 0, 255)

            # Draw base data
            for y, row in enumerate(data):
                if y >= 21: break
                for x, char in enumerate(row):
                    if x >= 21: break
                    if char != '0' and char in pal:
                        pixels[x, y] = get_color(pal[char])
            
            # Draw overlay if present
            if overlay:
                for y, row in enumerate(overlay):
                    if y >= 21: break
                    for x, char in enumerate(row):
                        if x >= 21: break
                        if char != '0' and char in pal:
                            pixels[x, y] = get_color(pal[char])
                            
            # resize
            cat_size = 21 * scale
            padding = 40
            final_size = cat_size + padding * 2
            
            img_hd = img.resize((cat_size, cat_size), Image.Resampling.NEAREST)
            final_img = Image.new("RGBA", (final_size, final_size), (0, 0, 0, 0))
            final_img.paste(img_hd, (padding, padding))
            
            out_path = os.path.join(out_dir, f"{cat_id}.png")
            final_img.save(out_path)
            count += 1
            
    print(f"Successfully generated {count} HD icons in {out_dir}")

if __name__ == '__main__':
    main()
