from PIL import Image, ImageDraw
import os

# 1. Process App Icon (icon.jpg -> app_icon.png with rounded corners)
try:
    img = Image.open("icon.jpg").convert("RGBA")
    # Make square
    size = min(img.size)
    img = img.crop(((img.width - size) // 2, (img.height - size) // 2, (img.width + size) // 2, (img.height + size) // 2))
    img = img.resize((256, 256), Image.Resampling.LANCZOS)
    
    # Create rounded mask
    # Standard iOS icon corner radius is about 22.5% of the width. 256 * 0.225 = 57.6
    radius = 58
    mask = Image.new('L', (256, 256), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, 256, 256), radius=radius, fill=255)
    
    # Apply mask
    output = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    output.save("app_icon.png")
    print("Generated app_icon.png")
except Exception as e:
    print(f"Error processing app icon: {e}")

# 2. Generate Cat Favicon (favicon.png)
data = [
      "000000000000000000000",
      "002200000000022000000",
      "002120000000212000000",
      "002112222222112000000",
      "002111111111112000000",
      "002111111111112000000",
      "222111211121112220000",
      "002111211121112000000",
      "222111112111112220000",
      "002111121211112000000",
      "000211111111120000220",
      "002111111111112002112",
      "002111111111112002112",
      "021111111111111202112",
      "021111111111111202112",
      "021111111111111202112",
      "021112121212111202112",
      "021112121212111221112",
      "002112121212112111120",
      "002111221221112111200",
      "000222222222222222000"
]
pal = {
    "1": "#ffffff",
    "2": "#171717",
    "3": "#fca5a5"
}

pixel_size = 3
fav_w = 21 * pixel_size
fav_h = 21 * pixel_size

fav_img = Image.new("RGBA", (fav_w, fav_h), (255, 255, 255, 0)) # transparent background
draw_fav = ImageDraw.Draw(fav_img)

for y, row in enumerate(data):
    for x, char in enumerate(row):
        if char != "0":
            color = pal.get(char, "#000000")
            px_x = x * pixel_size
            px_y = y * pixel_size
            draw_fav.rectangle([px_x, px_y, px_x + pixel_size - 1, px_y + pixel_size - 1], fill=color)

fav_img.save("favicon.png")
print("Generated favicon.png")
