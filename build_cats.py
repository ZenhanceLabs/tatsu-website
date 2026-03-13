import os
import json
import re

out = []
dir_path = "pixelcats"

print("Parsing pixel cats...")

for filename in os.listdir(dir_path):
    if filename.startswith("catPatterns_") and filename.endswith(".ts"):
        with open(os.path.join(dir_path, filename), "r", encoding="utf-8") as f:
            content = f.read()
            # Extract everything between [ and ]; at the end of the file
            match = re.search(r'export const \w+\s*=\s*(\[.*?\]);?\s*$', content, re.DOTALL)
            if match:
                array_str = match.group(1)
                try:
                    # Clean up standard TS formatting for json.loads just in case
                    data = json.loads(array_str)
                    out.extend(data)
                except Exception as e:
                    print(f"Error parsing JSON in {filename}: {e}")
                    # fallback: try using ast.literal_eval if it's not valid json
                    pass
            else:
                print(f"Could not find array in {filename}")

with open("pixelcats.js", "w", encoding="utf-8") as f:
    f.write(f"const pixelCats = {json.dumps(out)};\n")
print(f"Extracted {len(out)} cat patterns.")
