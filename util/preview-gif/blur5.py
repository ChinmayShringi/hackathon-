from PIL import Image
import sys
import numpy as np
from scipy.ndimage import gaussian_filter

def smart_gaussian_blur_gif_final(input_gif, output_gif, blur_radius=4):
    """
    Blurs each frame of a GIF using a numerically stable, pre-multiplied
    alpha workflow to produce a high-quality blur with no artifacts.
    """
    gif = Image.open(input_gif)
    frames = []
    durations = []

    try:
        while True:
            frame = gif.convert("RGBA")
            
            # --- 1. Convert to NumPy array and normalize ---
            frame_np = np.array(frame, dtype=np.float64)

            # --- 2. Pre-multiply Alpha ---
            alpha = frame_np[:, :, 3] / 255.0
            premultiplied_frame = np.empty_like(frame_np)
            for i in range(3): # R, G, B
                premultiplied_frame[:, :, i] = frame_np[:, :, i] * alpha
            premultiplied_frame[:, :, 3] = frame_np[:, :, 3] # Use the original alpha channel

            # --- 3. Pad and Blur ---
            pad_size = int(blur_radius * 3)
            padded_np = np.pad(premultiplied_frame, ((pad_size, pad_size), (pad_size, pad_size), (0, 0)), 'reflect')
            blurred_padded_np = gaussian_filter(padded_np, sigma=(blur_radius, blur_radius, 0))
            blurred_np = blurred_padded_np[pad_size:-pad_size, pad_size:-pad_size]

            # --- 4. Numerically Stable Un-premultiply Alpha (THE FIX) ---
            new_alpha = blurred_np[:, :, 3]
            
            # Initialize a black canvas to place our results on.
            final_frame_np = np.zeros_like(blurred_np)
            
            # Create a mask for all pixels where the alpha is non-negligible.
            # This is where we can safely perform division.
            mask = new_alpha > 1e-6 # A small threshold to avoid instability

            # For the pixels in the mask, perform the division.
            for i in range(3): # R, G, B
                # Divide the blurred pre-multiplied color by the new blurred alpha.
                final_frame_np[:, :, i][mask] = blurred_np[:, :, i][mask] / (new_alpha[mask] / 255.0)

            # Assign the new, blurred alpha channel to the final image.
            final_frame_np[:, :, 3] = new_alpha
            
            # --- 5. Clip, Convert, and Save ---
            final_frame_np = np.clip(final_frame_np, 0, 255)
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
        smart_gaussian_blur_gif_final(input_gif, output_gif, blur_radius)
