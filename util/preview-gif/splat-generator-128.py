from PIL import Image
import sys
import numpy as np

# A single, fully-opaque pixel.
KERNEL_1 = np.array([[1.0]])

# A 3x3 kernel with a smooth, circular falloff.
KERNEL_3 = np.array([
    [0.367, 0.606, 0.367],
    [0.606, 1.0,   0.606],
    [0.367, 0.606, 0.367]
])

# A 5x5 kernel with a wider, smooth, circular falloff.
KERNEL_5 = np.array([
    [0.135, 0.324, 0.472, 0.324, 0.135],
    [0.324, 0.778, 1.0,   0.778, 0.324],
    [0.472, 1.0,   1.0,   1.0,   0.472],
    [0.324, 0.778, 1.0,   0.778, 0.324],
    [0.135, 0.324, 0.472, 0.324, 0.135]
])

def apply_splatting(target_buffer, points, kernel):
    """
    Applies a splatting effect to a target buffer for a given list of points and an opacity kernel.
    It uses a "Screen" blend mode for a diffusion effect.

    Args:
        target_buffer (np.ndarray): The RGBA numpy array to draw on. This array is modified in-place.
        points (np.ndarray): An array of points, each with format (x, y, r, g, b).
        kernel (np.ndarray): A 2D numpy array representing the opacity kernel (e.g., 1x1, 3x3, 5x5).
    """
    # Get canvas dimensions and kernel size for calculations
    h, w, _ = target_buffer.shape
    kernel_size = kernel.shape[0]

    # --- Optimized Case: KERNEL_1 (Simple Pixel Blit) ---
    # This is much faster than looping for single pixels.
    if kernel_size == 1:
        # Extract coordinates (as integers) and colors (as 8-bit ints)
        coords = points[:, :2].astype(int)
        colors = points[:, 2:].astype(np.uint8)
        
        # We use advanced indexing to blit all points in a single, vectorized operation.
        # This directly places each color at its corresponding (y, x) coordinate.
        # Note the order for NumPy indexing is (row, column) which is (y, x).
        target_buffer[coords[:, 1], coords[:, 0], :3] = colors
        return # Exit the function after the fast blit

    # --- General Case: Kernels larger than 1x1 ---
    offset = kernel_size // 2

    for point in points:
        # 1. Extract coordinates and color for the current point
        x, y, r, g, b = point.astype(int)

        # 2. Define splat region boundaries based on kernel size
        y_start, x_start = y - offset, x - offset
        y_end, x_end = y + offset + 1, x + offset + 1

        # 3. Handle edges by calculating the valid intersection of the splat and the canvas
        target_y_start, target_x_start = max(0, y_start), max(0, x_start)
        target_y_end, target_x_end = min(h, y_end), min(w, x_end)
        
        kernel_y_start, kernel_x_start = max(0, -y_start), max(0, -x_start)
        kernel_y_end, kernel_x_end = min(kernel_size, h - y_start), min(kernel_size, w - x_start)

        # If the splat is entirely off-screen, skip to the next point.
        if (target_x_start >= target_x_end) or (target_y_start >= target_y_end):
            continue

        # 4. Get the view into the target buffer and the corresponding kernel slice
        target_slice = target_buffer[target_y_start:target_y_end, target_x_start:target_x_end]
        kernel_opacity = kernel[kernel_y_start:kernel_y_end, kernel_x_start:kernel_x_end]

        # 5. Perform the "Screen" blend operation using vectorized NumPy
        base_rgb = target_slice[..., :3].astype(np.float32) / 255.0
        top_rgb = np.array([r, g, b], dtype=np.float32) / 255.0
        blended_rgb = 1.0 - (1.0 - base_rgb) * (1.0 - top_rgb)

        # 6. Alpha composite the blended result onto the target slice
        opacity = kernel_opacity[..., np.newaxis]
        final_rgb = base_rgb * (1.0 - opacity) + blended_rgb * opacity

        # 7. Update the target buffer (via the view)
        target_slice[..., :3] = (final_rgb * 255).astype(np.uint8)

def diffusion_scaffolding(input_gif, output_gif):
    """
    Creates the basic scaffolding for the DiffusionSplatting filter.
    This version simply loads a GIF, converts each frame to an opaque RGB 
    format on a black background, and saves it. It serves as a testable baseline.
    """
    gif = Image.open(input_gif)
    frames = []
    durations = []

    print(KERNEL_1)
    print(KERNEL_3)
    print(KERNEL_5)

    try:
        while True:
            # Step 1: Load the source frame
            source_frame_rgba = gif.convert("RGBA")
            w, h = source_frame_rgba.size

            # Step 2: Merge onto a black background to collapse to RGB
            bg = Image.new("RGB", (w, h), (0, 0, 0))
            bg.paste(source_frame_rgba, (0, 0), source_frame_rgba)
            frame_rgb = bg
            
            # Step 2a: Convert the entire thing to a 2d numpy array
            numpy_array = np.array(frame_rgb)
            points_array = np.dstack((np.indices(numpy_array.shape[:2]).transpose(1, 2, 0)[:, :, ::-1], numpy_array)).reshape(-1, 5)
            np.random.shuffle(points_array)
            points_a, points_b, points_c = np.array_split(points_array, 3)

            target_buffer = np.full((numpy_array.shape[0], numpy_array.shape[1], 4), [0, 0, 0, 255], dtype=np.uint8)

            apply_splatting(target_buffer, points_a, KERNEL_5)
            apply_splatting(target_buffer, points_b, KERNEL_3)
            apply_splatting(target_buffer, points_c, KERNEL_1)
                
            # Step 2b: Placeholder for future logic
            # Do something with the numpy array here
            
            # Step 2c: Convert back to an image frame
            final_frame = Image.fromarray(target_buffer)

            # Add the processed frame to our list for reassembly
            frames.append(final_frame)
            durations.append(gif.info.get('duration', 100))

            # Move to the next frame in the source GIF
            gif.seek(gif.tell() + 1)

    except EOFError:
        pass  # All frames have been processed
    
    print(len(frames))

    # Step 3: Reassemble the gif output to the new file
    if frames:
        frames[0].save(
            output_gif,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0
        )

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python your_script_name.py input.gif output.gif")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        diffusion_scaffolding(input_gif, output_gif)
