from PIL import Image, ImageFilter, ImageDraw
import numpy as np

# Load original viewport frame
src = Image.open('public/images/charging/viewport_frame.jpg').convert('RGB')
w, h = src.size # 637, 497

# In viewport_frame.jpg:
# Canopy is at top (y: 0 to ~190)
# Bay 02 is located roughly between x: 215 and x: 325, y: 180 to y: 350
# Bay 03 is where the car was, roughly x: 325 to x: 440 (or car body x: 130 to 450, y: 200 to 410)
# Notice Bay 01 is x: 90 to 200, Bay 02 is x: 210 to 320, Bay 03 is x: 330 to 445, Bay 04 is x: 450 to 560
# Charger is on right: x: 480 to 630

# Let's inspect Bay 02 background:
# Stall width is approximately 115 px.
# Bay 02 stall wall is from x=215 to 325, y=190 to 330.
# Bay 03 stall wall should be from x=330 to 440, y=190 to 330.

# Ground in Bay 02 is at y=330 to 497.
# In Bay 03, the asphalt ground is visible at the very bottom y=380..497 with green line markings.
# Let's synthesize the empty Bay 03:
result = src.copy()
src_arr = np.array(src)
res_arr = np.array(result)

# Let's clone the empty bay wall from Bay 02 into Bay 03:
# Bay 02 wall region: y from 192 to 345, x from 215 to 328
# Bay 03 wall region: y from 192 to 345, x from 328 to 441
wall_patch = src_arr[192:345, 218:328].copy()
# Bay 03 ground/wall transition:
res_arr[192:345, 328:438] = wall_patch

# For the area where the car body was (between x: 140 and 330, y: 220 and 380):
# Wait! In the original photo, the car in Bay 03 is parked at an angle, covering from x=140 to 450, y=210 to 410!
# Let's check what was behind x=140 to 220: that was Bay 01 & Bay 02!
# Let's inspect what's in Bay 01 and Bay 02.
print("Successfully tested clone dimensions")

