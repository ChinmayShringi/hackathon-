from PIL import Image, ImageFilter
import sys
import numpy as np

def smart_gaussian_blur_gif_final(input_gif, output_gif, blur_radius=4):
    """
    Blurs each frame of a GIF using a stable, compositing-based workflow
    to correctly handle transparency and prevent all artifacts.
    """
    gif = Image.open(input_gif)
    frames = []
    durations = []

    try:
        while True:
            # --- 1. Separate Color and Alpha ---
            frame = gif.convert("RGBA")
            
            # Get the alpha channel as a separate grayscale image
            alpha_channel = frame.getchannel('A')
            
            # --- 2. Pre-multiply by Compositing onto Black ---
            # This is the most robust way to handle pre-multiplication.
            # It correctly removes any "ghost" color from transparent areas.
            premultiplied_frame = Image.new("RGB", frame.size, (0, 0, 0))
            premultiplied_frame.paste(frame, mask=alpha_channel)

            # --- 3. Blur the Color and Alpha Data Separately ---
            # Blur the pre-multiplied color data.
            blurred_rgb = premultiplied_frame.filter(ImageFilter.GaussianBlur(radius=blur_radius))
            
            # Separately, blur the alpha channel.
            blurred_alpha = alpha_channel.filter(ImageFilter.GaussianBlur(radius=blur_radius))

            # --- 4. Recombine the Blurred Channels ---
            # Merge the blurred R, G, B, and the blurred A back into a single image.
            r, g, b = blurred_rgb.split()
            final_frame = Image.merge("RGBA", (r, g, b, blurred_alpha))
            
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
            transparency=0
        )

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python your_script_name.py input.gif output.gif [blur_radius]")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        blur_radius = float(sys.argv[3]) if len(sys.argv) > 3 else 4
        smart_gaussian_blur_gif_final(input_gif, output_gif, blur_radius)
