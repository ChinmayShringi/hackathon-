from PIL import Image, ImageDraw
import math

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
    pixel_count = min(math.ceil(eased * total_pixels), total_pixels)
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

for frame_idx in range(total_frames):
    # Create transparent RGBA frame
    frame = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    draw = ImageDraw.Draw(frame)

    # Determine how many pixels should be revealed up to this frame
    end_idx = pixels_revealed[frame_idx]

    # Trail length dynamically scales with reveal progress (25% of current distance)
    trail_len = max(1, int(trail_ratio * pixels_stepped[frame_idx+1]))

    # === Draw Revealed Pixels ===
    for i in range(end_idx):
        x, y = spiral_indices[i]
        # Fully revealed pixels are drawn fully transparent (mask logic for downstream compositing)
        draw.point((x, y), fill=(0, 0, 0, 255))

    # === Draw the Bug (Bloom Style) ===
    if 0 < end_idx <= len(spiral_indices):
        bug_x, bug_y = spiral_indices[end_idx - 1]

        # Radius of bloom effect
        radius = 1  # total diameter = 3px (1 left, 1 right)
        
        for r in range(radius, 0, -1):
            # Alpha fades outward (center = solid, edges = transparent)
            alpha = int(255 * (1 - (r / radius)))

            # Draw concentric circles outward with fading alpha
            draw.ellipse(
                (bug_x - r, bug_y - r, bug_x + r, bug_y + r),
                fill=(*bug_rgb, alpha)
            )

        # Optionally reinforce the center with one solid pixel for sharpness
        draw.point((bug_x, bug_y), fill=(*bug_rgb, 255))

    for t in range(trail_len):
        idx = end_idx - 1 - t
        if 0 <= idx < len(spiral_indices):
            x, y = spiral_indices[idx]

            # Linear fade fraction
            fade_fraction = t / trail_len

            # Interpolate color from bug_rgb to fade_to_rgb
            color = tuple(
                int(bug_rgb[i] + (fade_to_rgb[i] - bug_rgb[i]) * fade_fraction)
                for i in range(3)
            )

            # Opacity fades from 100% → 0%
            alpha = int(255 * (1 - fade_fraction))

            draw.point((x, y), fill=(*color, alpha))

    '''
    # === Draw the Glowing Trail Behind the Bug ===
    for t in range(trail_len):
        idx = end_idx - 1 - t
        if 0 <= idx < len(spiral_indices):
            x, y = spiral_indices[idx]

            # Fade trail using linear opacity drop from 75% to 0%
            opacity = int(192 * (1 - t / trail_len))  # 192 = 75% alpha
            trail_color = (*bug_rgb, opacity)
            draw.point((x, y), fill=trail_color)
    

    # === Draw the Bug (1px, full alpha) ===
    if 0 < end_idx <= len(spiral_indices):
        bug_x, bug_y = spiral_indices[end_idx - 1]
        draw.point((bug_x, bug_y), fill=(*bug_rgb, 255))
    '''
    
    frames.append(frame)

# === Save the GIF ===

output_path = "./preview-mask.gif"
frames[0].save(
    output_path,
    save_all=True,
    append_images=frames[1:],
    duration=int(1000 / fps),
    loop=0,
    disposal=2,
    optimize=False  # <-- Add this line
)
print(f"GIF saved to: {output_path}")

