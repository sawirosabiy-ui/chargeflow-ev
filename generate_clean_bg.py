from PIL import Image, ImageFilter, ImageDraw
import numpy as np

# Load the authentic reference viewport
src = Image.open('public/images/charging/viewport_frame.jpg').convert('RGB')
w, h = src.size # 637, 497

# Also load the full reference image to see if any higher resolution or adjacent details exist
ref_full = Image.open('brain/media_1788608149440.jpg') if False else None

# Let's inspect where the car is located:
# In viewport_frame:
# Canopy & lights: y: 0 to 185 (DO NOT TOUCH, looks pristine)
# Bay 01 is from x: 0 to 180
# Bay 02 is from x: 180 to 320
# Bay 03 is from x: 320 to 460
# Right charger: x: 460 to 637, y: 120 to 497 (DO NOT TOUCH)
# Ground wet reflections & Bay 03 line: y: 400 to 497 (preserve the authentic wet ground texture)

# Let's construct a clean backdrop:
# 1. Bay 02 wall is between x: 195 and 315, y: 180 and 320.
# 2. We can replicate this wall structure into Bay 03 (x: 320 to 445).
# 3. For the pavement where the car was (y: 310 to 410, x: 120 to 460):
#    Notice that the wet ground has dark reflective asphalt with faint vertical streaks of the neon canopy lights.
#    We can sample the dark asphalt texture from the wet ground (e.g. y: 420..480 or from Bay 02 ground) and fill the stall floor with natural depth and soft ambient occlusion.

img_np = np.array(src, dtype=np.float32)

# Clone stall architecture from Bay 02 to Bay 03:
# Bay 02 width is ~120px
# Let's copy the background wall of Bay 02 (x: 200..320, y: 185..315) to Bay 03 (x: 320..440, y: 185..315)
bay2_wall = img_np[185:315, 200:320]
# Slightly blend brightness/contrast to match Bay 03 lighting:
img_np[185:315, 320:440] = bay2_wall

# In Bay 01 & 02, the front bumper of the 2D car was encroaching into x: 110..210, y: 240..370
# Notice Bay 01 has its own wall visible around x: 70..180, y: 185..300.
# Let's make sure Bay 01 / 02 background is also clean:
bay1_patch = img_np[185:300, 75:175]
# Where the car front wheel/bumper was in Bay 02 (x: 170..230, y: 260..340):
# Bay 02 clean wall can cover it seamlessly:
img_np[230:315, 175:235] = bay2_wall[45:130, 20:80]

# Now for the floor (y: 315 to 405, x: 110 to 455):
# Reconstruct the asphalt floor using vertical gradient matching the real wet floor:
# Real floor at y=410 has average color [20, 28, 35], with vertical neon reflection streaks.
# Let's sample the ground from y: 410..470 and project it upwards with a natural perspective fade:
ground_sample = img_np[410:470, 110:455]
# Resize or tile smoothly:
ground_img = Image.fromarray(ground_sample.astype(np.uint8))
ground_resized = ground_img.resize((455 - 110, 405 - 315), Image.Resampling.BICUBIC)
ground_arr = np.array(ground_resized, dtype=np.float32)

# Darken slightly towards the back wall to give realistic stall depth / ambient occlusion:
for i in range(405 - 315):
    depth_factor = 0.55 + 0.45 * (i / (405 - 315))
    img_np[315 + i, 110:455] = ground_arr[i] * depth_factor

# Smooth the seams:
result_img = Image.fromarray(np.clip(img_np, 0, 255).astype(np.uint8))

# Let's apply a subtle bilateral/box blur ONLY around the boundary seams to make it completely seamless:
mask = Image.new('L', (w, h), 0)
draw = ImageDraw.Draw(mask)
# Car removal zone:
draw.rectangle([115, 190, 450, 405], fill=255)
# Feather the mask edges:
mask = mask.filter(ImageFilter.GaussianBlur(8))

# Smoothly composite so untouched parts (canopy, charger, foreground asphalt) remain 100% pixel-perfect original:
final_bg = Image.composite(result_img, src, mask)

# Save clean station background
final_bg.save('public/images/charging/clean_station_bg.jpg', quality=95)
print("Saved clean_station_bg.jpg successfully!")

