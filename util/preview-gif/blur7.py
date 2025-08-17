from PIL import Image, ImageFilter, ImageOps
import sys

def smart_gaussian_blur_gif_opaque(input_gif, output_gif, blur_radius=2):
    """
    Blurs each frame of a GIF using a robust opaque workflow as designed.
    It composites the frame on a black background, pads it with mirrored
    content, blurs the entire canvas, and then crops the clean center portion.
    The output is a fully opaque GIF.
    """
    gif = Image.open(input_gif)
    frames = []
    durations = []

    try:
        while True:
            frame_rgba = gif.convert("RGBA")
            w, h = frame_rgba.size

            # --- 1. Create Opaque Black Background and Composite ---
            # Per your instructions, this creates a stable base with no alpha.
            bg = Image.new("RGB", (w, h), (0, 0, 0))
            # The original frame's alpha is used as the mask for pasting.
            bg.paste(frame_rgba, (0, 0), frame_rgba)
            frame_rgb = bg

            # --- 2. Create Padded Canvas and Mirror Edges ---
            # As you noted, the seams don't matter; this is just to provide blur data.
            padded_canvas = Image.new("RGB", (w * 3, h * 3))
            
            # Paste the central image and its 8 mirrored neighbors
            for i in range(-1, 2):
                for j in range(-1, 2):
                    # Apply mirroring and flipping based on position
                    temp_frame = frame_rgb.copy()
                    if i == -1: temp_frame = ImageOps.mirror(temp_frame)
                    if j == -1: temp_frame = ImageOps.flip(temp_frame)
                    # The central image (0,0) is not transformed
                    
                    padded_canvas.paste(temp_frame, (w * (i + 1), h * (j + 1)))

            # --- 3. Apply Blur to Padded Canvas ---
            blurred = padded_canvas.filter(ImageFilter.GaussianBlur(blur_radius))

            # --- 4. Crop Back to Original Size ---
            # Cut out the clean, correctly blurred central portion.
            final_frame = blurred.crop((w, h, w * 2, h * 2))

            frames.append(final_frame)
            durations.append(gif.info.get('duration', 100))

            gif.seek(gif.tell() + 1)

    except EOFError:
        pass  # all frames processed

    # --- 5. Save the Opaque GIF ---
    # The frames are already RGB (fully opaque), so alpha handling is not needed.
    frames[0].save(
        output_gif,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0
    )

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python your_script_name.py input.gif output.gif [blur_radius]")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        # Per your request, the default blur radius is now 2.
        blur_radius = float(sys.argv[3]) if len(sys.argv) > 3 else 2
        smart_gaussian_blur_gif_opaque(input_gif, output_gif, blur_radius)
