import json
from PIL import Image, ImageDraw

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

img = Image.new("RGB", (1200, 630), "#f8f9fa")
draw = ImageDraw.Draw(img)

pixel_size = 24
cat_w = 21 * pixel_size
cat_h = 21 * pixel_size

start_x = (1200 - cat_w) // 2
start_y = (630 - cat_h) // 2

for y, row in enumerate(data):
    for x, char in enumerate(row):
        if char != "0":
            color = pal.get(char, "#000000")
            px_x = start_x + x * pixel_size
            px_y = start_y + y * pixel_size
            draw.rectangle([px_x, px_y, px_x + pixel_size - 1, px_y + pixel_size - 1], fill=color)

img.save("ogp.png")
print("Generated ogp.png")
