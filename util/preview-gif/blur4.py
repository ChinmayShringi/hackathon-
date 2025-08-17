from PIL import Image
import sys
import numpy as np
from scipy.ndimage import gaussian_filter

def smart_gaussian_blur_gif_optimized(input_gif, output_gif, blur_radius=4):
    """
    Blurs each frame of an animated GIF using a correct pre-multiplied alpha
    workflow to prevent halo artifacts.
    """
    gif = Image.open(input_gif)
    frames = []
    durations = []

    try:
        while True:
            frame = gif.convert("RGBA")
            
            # --- 1. Convert to NumPy array and normalize ---
            # Use a floating point array for the multiplication/division steps
            frame_np = np.array(frame, dtype=np.float64)

            # --- 2. Pre-multiply Alpha ---
            # Get the alpha channel, normalized to a 0.0-1.0 range
            alpha = frame_np[:, :, 3] / 255.0
            # Multiply RGB channels by the normalized alpha
            premultiplied_frame = frame_np.copy()
            for i in range(3): # For R, G, B channels
                premultiplied_frame[:, :, i] *= alpha

            # --- 3. Pad and Blur the Pre-multiplied Image ---
            pad_size = int(blur_radius * 3)
            padded_np = np.pad(premultiplied_frame, ((pad_size, pad_size), (pad_size, pad_size), (0, 0)), 'reflect')
            
            # Blur all channels (R, G, B, and A) of the pre-multiplied data
            blurred_padded_np = gaussian_filter(padded_np, sigma=(blur_radius, blur_radius, 0))

            # Crop back to original size
            blurred_np = blurred_padded_np[pad_size:-pad_size, pad_size:-pad_size]

            # --- 4. Un-premultiply Alpha ---
            # Get the new, blurred alpha channel
            new_alpha = blurred_np[:, :, 3]
            
            # Add a tiny number (epsilon) to avoid division by zero in fully transparent regions
            epsilon = 1e-8
            
            final_frame_np = blurred_np.copy()
            for i in range(3): # For R, G, B channels
                # Divide the blurred RGB channels by the new blurred alpha
                final_frame_np[:, :, i] = np.divide(blurred_np[:, :, i], new_alpha + epsilon, where=(new_alpha > epsilon))

            # --- 5. Clip, Convert, and Save ---
            # Ensure values are within the valid 0-255 range
            final_frame_np = np.clip(final_frame_np, 0, 255)

            # Convert back to an 8-bit integer array for saving
            final_frame = Image.fromarray(final_frame_np.astype(np.uint8), 'RGBA')
            frames.append(final_frame)
            
            durations.append(gif.info.get('duration', 100))
            gif.seek(gif.tell() + 1)

    except EOFError:
        pass

    if frames:
        frames[0].save(
            output_gif,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
            disposal=2,
            transparency=gif.info.get('transparency', 0)
        )

if __name__ == "__main__":
    try:
        import numpy
        import scipy
    except ImportError:
        print("Error: This script requires 'numpy' and 'scipy'.")
        print("Please install them using: pip install numpy scipy")
        sys.exit(1)

    if len(sys.argv) < 3:
        print("Usage: python your_script_name.py input.gif output.gif [blur_radius]")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        blur_radius = float(sys.argv[3]) if len(sys.argv) > 3 else 4
        smart_gaussian_blur_gif_optimized(input_gif, output_gif, blur_radius)
