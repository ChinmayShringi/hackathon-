from PIL import Image
import sys
import numpy as np
from scipy.ndimage import gaussian_filter

def smart_gaussian_blur_gif_optimized(input_gif, output_gif, blur_radius=4):
    """
    Blurs each frame of an animated GIF using an efficient and correct
    reflection padding method with NumPy and SciPy.
    """
    gif = Image.open(input_gif)
    frames = []
    durations = []

    try:
        while True:
            # Ensure frame is RGBA
            frame = gif.convert("RGBA")
            
            # --- 1. Efficient Padding using NumPy ---
            # Use a more reasonable pad size, just enough for the blur kernel.
            # A pad of 3 * sigma (blur_radius) is standard practice.
            pad_size = int(blur_radius * 3)

            # Convert the Pillow Image to a NumPy array for fast manipulation.
            # The array has shape (height, width, channels).
            frame_np = np.array(frame)
            h, w, _ = frame_np.shape

            # Create a padded array. np.pad is ideal for this.
            # The 'reflect' mode correctly mirrors the edges, solving the main logic flaw.
            padded_np = np.pad(frame_np, ((pad_size, pad_size), (pad_size, pad_size), (0, 0)), 'reflect')

            # --- 2. Blur All Channels (Including Alpha) with SciPy ---
            # Apply the Gaussian filter directly to the padded NumPy array.
            # We apply the filter to each channel (R, G, B, and A) independently.
            # This is vastly more efficient than Pillow's filter method and correctly
            # blurs the alpha channel, ensuring a soft edge.
            # The `sigma` parameter in SciPy is equivalent to the `radius` in Pillow.
            blurred_padded_np = gaussian_filter(padded_np, sigma=(blur_radius, blur_radius, 0))

            # --- 3. Crop and Convert Back ---
            # Crop the padding back off to return to the original image dimensions.
            final_np = blurred_padded_np[pad_size:-pad_size, pad_size:-pad_size]
            
            # Convert the NumPy array back to a Pillow Image.
            # Ensure the data type is 8-bit unsigned integer, as required for images.
            final_frame = Image.fromarray(final_np.astype(np.uint8), 'RGBA')

            frames.append(final_frame)
            
            # Preserve original frame duration
            durations.append(gif.info.get('duration', 100))

            # Move to the next frame
            gif.seek(gif.tell() + 1)

    except EOFError:
        pass  # End of frames

    # Save the processed frames as a new animated GIF
    if frames:
        frames[0].save(
            output_gif,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
            disposal=2,  # Important for transparent GIFs to dispose of the previous frame
            transparency=0
        )

if __name__ == "__main__":
    # Add dependency check for user-friendliness
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
