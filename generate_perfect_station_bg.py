from PIL import Image, ImageFilter, ImageDraw
import numpy as np

crop = Image.open('public/images/charging/viewport_frame.jpg').convert('RGB')
w, h = crop.size # 637, 497

arr = np.array(crop, dtype=np.float32)

# Copy Bay 02 wall into Bay 03 wall:
wall_y1, wall_y2 = 175, 235
b2_x1, b2_x2 = 210, 320
b3_x1, b3_x2 = 320, 430
arr[wall_y1:wall_y2, b3_x1:b3_x2] = arr[wall_y1:wall_y2, b2_x1:b2_x2]

# Synthesize the clean wet asphalt floor for x: 170 to 480, y: 235 to 430:
ground_sample = arr[430:480, 170:480]
floor_h = 430 - 235
floor_w = 480 - 170
clean_floor = np.zeros((floor_h, floor_w, 3), dtype=np.float32)

np.random.seed(42)
noise = np.random.normal(0, 3.0, (floor_h, floor_w, 3))

for r in range(floor_h):
    t = r / float(floor_h)
    base = np.array([8.0 + 12.0 * (t**1.5), 12.0 + 15.0 * (t**1.5), 18.0 + 18.0 * (t**1.5)])
    
    for c in range(floor_w):
        x_actual = 170 + c
        dist_from_bay3_center = abs(x_actual - 350) / 100.0
        light_glow = max(0.0, 1.0 - dist_from_bay3_center**2) * 12.0 * (1.0 - t*0.6)
        
        charger_dist = max(0.0, (x_actual - 300) / 180.0)
        green_glow = charger_dist * 6.0 * t
        
        clean_floor[r, c, 0] = base[0] + light_glow * 0.7 + noise[r, c, 0]
        clean_floor[r, c, 1] = base[1] + light_glow * 0.9 + green_glow + noise[r, c, 1]
        clean_floor[r, c, 2] = base[2] + light_glow * 1.0 + noise[r, c, 2]

mask = np.zeros((h, w), dtype=np.float32)
for y in range(h):
    for x in range(w):
        if 175 <= x < 475 and 235 <= y < 425:
            bx = min(x - 175, 475 - x)
            by = min(y - 235, 425 - y)
            feather = min(bx / 15.0, by / 15.0, 1.0)
            mask[y, x] = feather

for ch in range(3):
    arr[235:430, 170:480, ch] = (
        clean_floor[:, :, ch] * mask[235:430, 170:480] + 
        arr[235:430, 170:480, ch] * (1.0 - mask[235:430, 170:480])
    )

res_img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
res_img.save('public/images/charging/station_clean_plate.jpg', quality=95)
print("Saved station_clean_plate.jpg successfully!")
