from PIL import Image, ImageFilter, ImageOps
import sys
import numpy as np

def add_noise_to_frame(frame, noise_level):
    """
    Adds Gaussian noise to a PIL Image.

    Args:
        frame (PIL.Image.Image): The input image in 'RGB' mode.
        noise_level (float): The standard deviation of the Gaussian noise.

    Returns:
        PIL.Image.Image: The image with added noise.
    """
    # Convert image to numpy array with a float type for calculations
    img_array = np.array(frame, dtype=np.float32)
    
    # Generate Gaussian noise with the same shape as the image array
    # The noise is centered at 0, with a standard deviation of noise_level.
    noise = np.random.normal(0, noise_level, img_array.shape)
    
    # Add the noise to the image array
    noisy_array = img_array + noise
    
    # Clip the values to the valid 0-255 range for RGB
    noisy_array = np.clip(noisy_array, 0, 255)
    
    # Convert the array back to an 8-bit integer type and then to a PIL Image
    return Image.fromarray(noisy_array.astype(np.uint8), 'RGB')

def smart_gaussian_blur_gif_opaque(input_gif, output_gif, blur_radius=3, noise_level=0.5):
    """
    Blurs each frame of a GIF using a robust opaque workflow.
    It can optionally add noise to each frame before blurring to simulate
    a diffusion or textured effect.

    Args:
        input_gif (str): Path to the input GIF file.
        output_gif (str): Path to save the output GIF file.
        blur_radius (float): The radius for the Gaussian blur.
        noise_level (float): The standard deviation for the Gaussian noise.
                             A value of 0 means no noise is added.
    """
    gif = Image.open(input_gif)
    frames = []
    durations = []

    try:
        while True:
            frame_rgba = gif.convert("RGBA")
            w, h = frame_rgba.size

            # --- 1. Create Opaque Black Background and Composite ---
            bg = Image.new("RGB", (w, h), (0, 0, 0))
            bg.paste(frame_rgba, (0, 0), frame_rgba)
            frame_rgb = bg

            # --- 2. (NEW) Inject Noise ---
            # If a noise level is specified, add noise to the opaque frame.
            if noise_level > 0:
                frame_to_process = add_noise_to_frame(frame_rgb, noise_level)
            else:
                frame_to_process = frame_rgb

            # --- 3. Create Padded Canvas and Mirror Edges ---
            padded_canvas = Image.new("RGB", (w * 3, h * 3))
            
            for i in range(-1, 2):
                for j in range(-1, 2):
                    temp_frame = frame_to_process.copy()
                    if i == -1: temp_frame = ImageOps.mirror(temp_frame)
                    if j == -1: temp_frame = ImageOps.flip(temp_frame)
                    
                    padded_canvas.paste(temp_frame, (w * (i + 1), h * (j + 1)))

            # --- 4. Apply Blur to Padded Canvas ---
            blurred = padded_canvas.filter(ImageFilter.GaussianBlur(blur_radius))

            # --- 5. Crop Back to Original Size ---
            final_frame = blurred.crop((w, h, w * 2, h * 2))

            frames.append(final_frame)
            durations.append(gif.info.get('duration', 100))

            gif.seek(gif.tell() + 1)

    except EOFError:
        pass  # all frames processed

    # --- 6. Save the Opaque GIF ---
    if frames:
        frames[0].save(
            output_gif,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0
        )

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python your_script_name.py input.gif output.gif [blur_radius] [noise_level]")
        print("Example: python your_script_name.py in.gif out.gif 2 10")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        blur_radius = float(sys.argv[3]) if len(sys.argv) > 3 else 0
        # Add the new tunable parameter for noise level
        noise_level = float(sys.argv[4]) if len(sys.argv) > 4 else 0.75
        
        print(f"Processing with Blur Radius: {blur_radius} and Noise Level: {noise_level}")
        smart_gaussian_blur_gif_opaque(input_gif, output_gif, blur_radius, noise_level)
