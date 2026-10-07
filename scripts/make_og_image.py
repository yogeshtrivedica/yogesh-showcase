"""Generate the 1200x630 Open Graph preview image from the portrait."""
from PIL import Image, ImageDraw, ImageFont, ImageOps

W, H = 1200, 630
NAVY, GREEN, MINT, ICE, CREAM = "#042C53", "#0F6E56", "#E1F5EE", "#85B7EB", "#F8F7F4"

img = Image.new("RGB", (W, H), NAVY)
d = ImageDraw.Draw(img)

# subtle grid lines
for x in (140, 600):
    d.line([(x, 0), (x, H)], fill="#0A3966", width=1)
d.line([(0, 560), (W, 560)], fill="#0A3966", width=1)
# green accent bar
d.rectangle([(0, 0), (14, H)], fill=GREEN)

def font(path, size, wght):
    f = ImageFont.truetype(path, size)
    try:
        f.set_variation_by_axes([wght])
    except Exception:
        pass
    return f

serif_b = font("/tmp/cormorant.ttf", 74, 600)
serif_i = font("/tmp/cormorant.ttf", 74, 500)
sans = font("/tmp/jakarta.ttf", 22, 500)
mono_small = font("/tmp/jakarta.ttf", 17, 600)

# eyebrow
d.text((80, 88), "INDEPENDENT FINANCE REVIEW  ·  FRACTIONAL CFO  ·  DUBAI", font=mono_small, fill=ICE)
d.line([(80, 128), (760, 128)], fill=GREEN, width=2)

# headline
d.text((78, 165), "Your system says", font=serif_b, fill="#FFFFFF")
d.text((78, 245), "you made a profit.", font=serif_b, fill="#FFFFFF")
d.text((78, 325), "Your bank may disagree.", font=serif_i, fill="#8FD5BF")

# name + credentials
d.text((80, 450), "CA Yogesh Pannalal Trivedi", font=font("/tmp/cormorant.ttf", 40, 600), fill=MINT)
d.text((80, 500), "Chartered Accountant (ICAI, 2008)  ·  17+ years  ·  UAE, East Africa, India", font=sans, fill=ICE)

# portrait circle
p = Image.open("/app/frontend/public/portrait.jpg").convert("RGB")
size = 360
p = ImageOps.fit(p, (size, size), Image.LANCZOS)
mask = Image.new("L", (size * 4, size * 4), 0)
ImageDraw.Draw(mask).ellipse((0, 0, size * 4, size * 4), fill=255)
mask = mask.resize((size, size), Image.LANCZOS)
cx, cy = 980, 300
ring = size + 24
d.ellipse((cx - ring // 2, cy - ring // 2, cx + ring // 2, cy + ring // 2), fill=CREAM)
d.ellipse((cx - ring // 2 - 10, cy - ring // 2 - 10, cx + ring // 2 + 10, cy + ring // 2 + 10), outline=GREEN, width=3)
img.paste(p, (cx - size // 2, cy - size // 2), mask)

# footer
d.text((80, 580), "yogeshtrivedica@gmail.com   ·   +971 55 331 0567   ·   linkedin.com/in/cayogeshtrivedi", font=mono_small, fill="#B5D4F4")

img.save("/app/frontend/public/og-image.jpg", quality=90, optimize=True)
print("saved", img.size)
