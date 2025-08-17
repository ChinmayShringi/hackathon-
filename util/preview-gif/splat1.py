from PIL import Image
import sys
import numpy as np
import random

def create_circular_kernel(size, color):
    """
    Creates a square kernel of a given color with a circular alpha falloff.
    The center is fully opaque, fading to fully transparent at the edges.
    """
    # Create a coordinate grid from -1.0 to 1.0
    ax = np.linspace(-1, 1, size)
    xx, yy = np.meshgrid(ax, ax)

    # Calculate distance from the center, clamped to a max of 1.0
    distance = np.sqrt(xx**2 + yy**2)
    distance[distance > 1] = 1

    # Create a smooth, circular falloff (1 - distance^2)
    # This creates a softer edge than a linear falloff.
    alpha = (1.0 - distance**2) * 255
    
    # Build the 4-channel RGBA kernel
    kernel = np.zeros((size, size, 4), dtype=np.uint8)
    kernel[:, :, 0] = color[0]  # Red
    kernel[:, :, 1] = color[1]  # Green
    kernel[:, :, 2] = color[2]  # Blue
    kernel[:, :, 3] = alpha.astype(np.uint8) # Alpha

    return kernel

def DiffusionSplatting(input_gif, output_gif):
    """
    Applies the "DiffusionSplatting" generative filter to an animated GIF.
    This creates a stunning diffusion effect by splatting pixels onto a canvas.
    """
    gif = Image.open(input_gif)
    frames = []
    durations = []

    try:
        while True:
            # --- 1. Create Buffers and Get Source Data ---
            source_frame = gif.convert("RGBA")
            w, h = source_frame.size
            
            # Load the source image into a NumPy array for fast pixel access
            source_pixels = np.array(source_frame)
            
            # Create the target buffer, initiated as pure black (and transparent)
            target_buffer = np.zeros((h, w, 4), dtype=np.uint8)

            # --- 2. Select and Randomize 50% of Coordinates ---
            all_coords = [(y, x) for y in range(h) for x in range(w)]
            random.shuffle(all_coords)
            num_points_to_process = len(all_coords) // 2
            selected_coords = all_coords[:num_points_to_process]

            # --- 3. Define Splat Size Distribution ---
            # Determine the indices that mark the end of each splat size category
            first_third_end = int(num_points_to_process * 0.33)
            second_third_end = int(num_points_to_process * 0.66)

            # --- 4. Main Splatting Loop ---
            for i, (y, x) in enumerate(selected_coords):
                # Get the color from the original source pixel
                color = source_pixels[y, x]

                # Determine splat size based on the point's position in the randomized list
                if i < first_third_end:
                    size = 5
                elif i < second_third_end:
                    size = 3
                else:
                    size = 1

                # For a 1x1 splat, we just draw the pixel directly
                if size == 1:
                    target_buffer[y, x] = color
                    continue

                # --- 5. Create Kernel and Composite it onto the Target ---
                kernel = create_circular_kernel(size, color)
                
                # Calculate placement location (top-left corner of the kernel)
                offset = size // 2
                x0, y0 = x - offset, y - offset
                
                # Determine the intersection to handle edges safely
                x1_k, y1_k = max(0, -x0), max(0, -y0)
                x2_k, y2_k = min(size, w - x0), min(size, h - y0)
                
                x1_t, y1_t = max(0, x0), max(0, y0)
                x2_t, y2_t = min(w, x0 + size), min(h, y0 + size)
                
                # If there's nothing to draw, skip
                if x1_k >= x2_k or y1_k >= y2_k:
                    continue

                # Get the slices (the regions to work on)
                kernel_slice = kernel[y1_k:y2_k, x1_k:x2_k]
                target_slice = target_buffer[y1_t:y2_t, x1_t:x2_t].astype(np.float32)

                # Alpha compositing (linear interpolation)
                splat_alpha = (kernel_slice[:, :, 3] / 255.0)[..., np.newaxis]
                
                # Blend the splat onto the target buffer
                composited_slice = target_slice * (1 - splat_alpha) + kernel_slice.astype(np.float32) * splat_alpha
                target_buffer[y1_t:y2_t, x1_t:x2_t] = composited_slice.astype(np.uint8)

            # --- Finalize Frame ---
            final_frame = Image.fromarray(target_buffer, 'RGBA')
            frames.append(final_frame)
            durations.append(gif.info.get('duration', 100))
            gif.seek(gif.tell() + 1)

    except EOFError:
        pass  # all frames processed

    # Save the new animated GIF
    if frames:
        frames[0].save(
            output_gif,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
            disposal=2 # Important for transparent GIFs
        )

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python your_script_name.py input.gif output.gif")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        DiffusionSplatting(input_gif, output_gif)
