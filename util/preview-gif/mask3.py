from PIL import Image, ImageDraw
import math
import numpy as np

# === Configuration ===

size = 128  # The width and height of the square canvas in pixels.
fps = 15  # Frames per second of the output GIF.
duration_seconds = 10  # Total duration of the GIF animation.
total_frames = fps * duration_seconds  # Total number of frames = 150
total_pixels = size * size  # Total number of pixels to reveal = 16384
trail_ratio = 0.1  # The bug's trail will be 10% the length of current reveal progress.

# Bug color setup in RGB from hex
bug_color_hex = "#7e22ce"  # Deep purple (aesthetic choice for the "trace bug")
bug_rgb = tuple(int(bug_color_hex.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
fade_to_rgb = (243, 232, 255)  # light lavender

# === Spiral Path Generation ===

def generate_spiral_indices(size):
    """
    Generates a list of (x, y) coordinates in a clockwise, centered rectangular spiral.
    Guarantees exactly `size * size` unique, in-bounds coordinates.
    """
    cx, cy = size // 2, size // 2  # image center
    x, y = cx, cy
    dx, dy = 0, -1  # start by moving upward
    visited = set()
    indices = []

    while len(indices) < size * size:
        if 0 <= x < size and 0 <= y < size and (x, y) not in visited:
            indices.append((x, y))
            visited.add((x, y))

        # direction change logic to create the spiral path
        if (x - cx == y - cy) or \
           (x - cx < 0 and x - cx == -(y - cy)) or \
           (x - cx > 0 and x - cx == 1 - (y - cy)):
            dx, dy = -dy, dx  # rotate direction clockwise

        x += dx
        y += dy

    return indices

spiral_indices = generate_spiral_indices(size)

# === Easing Function for Reveal Timing ===

def easing_progress(t):
    """
    Quadratic ease-in function.
    Slower at the beginning, accelerates toward the end.
    More visually digestible when the spiral begins in the center.
    """
    return t ** 4

# Compute how many pixels should be revealed cumulatively at each frame
pixels_revealed = []
pixels_stepped = [0]
for i in range(total_frames):
    t = i / (total_frames - 1)  # normalized time [0,1]
    eased = easing_progress(t)
    pixel_count = min(int(eased * total_pixels), total_pixels)
    pixel_step = pixel_count - pixels_stepped[-1]
    pixels_revealed.append(pixel_count)

    # however, we should cleverly check how far the bug is from the center, and calculate max based on distance * 8.
    # max distance is 64, which represents the outer line, which has 128 * 4 total pixels to work with
    spiral_offset = min(pixel_count, total_pixels - 1)

    bug_x, bug_y = spiral_indices[spiral_offset]
    dist_from_center = max(abs(bug_x), abs(bug_y))
    clamp_length = dist_from_center * 2 * 4

    pixel_step = min(pixel_step, clamp_length)
    pixels_stepped.append(pixel_step)


# === Frame Generation ===

frames = []
transparent_color = (0, 0, 0) # We will make black the transparent color

print("Generating frames...")
for frame_idx in range(total_frames):
    # 1. Create a base canvas that is fully opaque white.
    frame_img = Image.new("RGB", (size, size), (255, 255, 255))
    
    # 2. Convert to NumPy for direct manipulation.
    frame_arr = np.array(frame_img)

    # 3. Determine which pixels to change for this frame.
    end_idx = min(pixels_revealed[frame_idx], len(spiral_indices))
    coords_to_change = spiral_indices[:end_idx]

    # 4. Directly set the pixels to our transparent color (black).
    if coords_to_change:
        # --- FIX 1: Correctly assign coordinates ---
        xs, ys = zip(*coords_to_change)
        
        # This now correctly writes black pixels in a spiral shape.
        frame_arr[ys, xs] = transparent_color

    # 5. Convert the array back to a PIL Image.
    final_frame = Image.fromarray(frame_arr, 'RGB')
    
    # --- FIX 2: Convert to Palettized mode before appending ---
    # This gives us explicit control over the GIF's palette and transparency.
    # We create a simple 2-color palette.
    paletted_frame = final_frame.quantize(colors=2, palette=Image.Palette.ADAPTIVE)
    
    # We need to find the index of our transparent color in the new palette.
    # The palette data is a flat list [R1,G1,B1, R2,G2,B2, ...].
    palette = paletted_frame.getpalette()
    try:
        # Find the starting position of our transparent color (black) in the list.
        transparency_index = palette.index(transparent_color[0], 0, 256*3) // 3
    except ValueError:
        # If black isn't in the palette (e.g., an all-white frame), there's nothing to make transparent.
        transparency_index = None

    frames.append((paletted_frame, transparency_index))

# === Save the GIF ===

output_path = "./preview-mask.gif"

# We need to manually prepare the images and find the transparency index for saving.
images_to_save = [f[0] for f in frames]
# The transparency index for the first frame is what matters most.
first_frame_transparency = frames[0][1]

print(f"Saving GIF to: {output_path}")
images_to_save[0].save(
    output_path,
    save_all=True,
    append_images=images_to_save[1:],
    duration=int(1000 / fps),
    loop=0,
    disposal=2,
    transparency=first_frame_transparency if first_frame_transparency is not None else -1
)

print("Save complete.")
