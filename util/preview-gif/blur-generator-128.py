from PIL import Image, ImageFilter, ImageOps
import sys

def smart_gaussian_blur_gif(input_gif, output_gif, blur_radius=4):
    """
    Applies Gaussian blur to each frame of an animated GIF, using a mirroring trick
    to prevent transparent or black edge bleed-through.

    Parameters:
        input_gif (str): Path to the input animated GIF.
        output_gif (str): Path to save the output blurred animated GIF.
        blur_radius (float): Radius of Gaussian blur (default: 4 pixels).
    """
    # Load input GIF frames
    gif = Image.open(input_gif)
    frames = []
    durations = []

    try:
        while True:
            frame = gif.convert("RGBA")
            w, h = frame.size

            # Create padded canvas (2x original dimensions)
            padded_canvas = Image.new("RGBA", (w * 2, h * 2))

            # Paste original frame into the center
            padded_canvas.paste(frame, (w // 2, h // 2))

            # Mirror and paste edges to avoid blur bleeding
            # Horizontal mirrors
            left_mirror = ImageOps.mirror(frame)
            right_mirror = ImageOps.mirror(frame)
            padded_canvas.paste(left_mirror, (-w // 2, h // 2))
            padded_canvas.paste(right_mirror, (w + (w // 2), h // 2))

            # Vertical mirrors
            top_mirror = ImageOps.flip(frame)
            bottom_mirror = ImageOps.flip(frame)
            padded_canvas.paste(top_mirror, (w // 2, -h // 2))
            padded_canvas.paste(bottom_mirror, (w // 2, h + (h // 2)))

            # Corner mirrors (mirrored both horizontally and vertically)
            top_left = ImageOps.mirror(top_mirror)
            top_right = ImageOps.mirror(top_mirror)
            bottom_left = ImageOps.mirror(bottom_mirror)
            bottom_right = ImageOps.mirror(bottom_mirror)

            padded_canvas.paste(top_left, (-w // 2, -h // 2))
            padded_canvas.paste(top_right, (w + (w // 2), -h // 2))
            padded_canvas.paste(bottom_left, (-w // 2, h + (h // 2)))
            padded_canvas.paste(bottom_right, (w + (w // 2), h + (h // 2)))

            # Blur the padded canvas
            blurred = padded_canvas.filter(ImageFilter.GaussianBlur(blur_radius))

            # Crop back down to original size
            final_frame = blurred.crop((w // 2, h // 2, w + (w // 2), h + (h // 2)))

            frames.append(final_frame)
            durations.append(gif.info.get('duration', 100))  # preserve original duration

            # Go to next frame
            gif.seek(gif.tell() + 1)

    except EOFError:
        pass  # All frames processed

    # Save blurred frames as animated GIF
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
        print("Usage: python blur-generator-128.py input.gif output.gif [blur_radius]")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        blur_radius = float(sys.argv[3]) if len(sys.argv) > 3 else 4
        smart_gaussian_blur_gif(input_gif, output_gif, blur_radius)
