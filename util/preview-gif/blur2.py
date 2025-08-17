from PIL import Image, ImageFilter, ImageOps
import sys

def smart_gaussian_blur_gif(input_gif, output_gif, blur_radius=4):
    """
    Blurs each frame of an animated GIF with proper handling of transparent edges
    by mirroring and compositing onto a solid background before blurring.
    """
    gif = Image.open(input_gif)
    frames = []
    durations = []

    try:
        while True:
            frame = gif.convert("RGBA")
            w, h = frame.size

            # Create opaque white background
            bg = Image.new("RGBA", (w, h), (255, 255, 255, 255))
            opaque_frame = Image.alpha_composite(bg, frame)

            # Create padded canvas (2x original dimensions)
            padded_canvas = Image.new("RGBA", (w * 2, h * 2))

            # Paste opaque frame into center
            padded_canvas.paste(opaque_frame, (w // 2, h // 2))

            # Mirror edges to all sides
            left = ImageOps.mirror(opaque_frame)
            right = ImageOps.mirror(opaque_frame)
            top = ImageOps.flip(opaque_frame)
            bottom = ImageOps.flip(opaque_frame)

            # Paste mirrored edges
            padded_canvas.paste(left, (-w // 2, h // 2))
            padded_canvas.paste(right, (w + (w // 2), h // 2))
            padded_canvas.paste(top, (w // 2, -h // 2))
            padded_canvas.paste(bottom, (w // 2, h + (h // 2)))

            # Corner mirrors
            top_left = ImageOps.mirror(top)
            top_right = ImageOps.mirror(top)
            bottom_left = ImageOps.mirror(bottom)
            bottom_right = ImageOps.mirror(bottom)

            padded_canvas.paste(top_left, (-w // 2, -h // 2))
            padded_canvas.paste(top_right, (w + (w // 2), -h // 2))
            padded_canvas.paste(bottom_left, (-w // 2, h + (h // 2)))
            padded_canvas.paste(bottom_right, (w + (w // 2), h + (h // 2)))

            # Apply blur to padded canvas
            blurred = padded_canvas.filter(ImageFilter.GaussianBlur(blur_radius))

            # Crop back to original size
            final_frame = blurred.crop((w // 2, h // 2, w + (w // 2), h + (h // 2)))

            # Restore original alpha channel
            final_frame.putalpha(frame.split()[3])

            frames.append(final_frame)
            durations.append(gif.info.get('duration', 100))

            gif.seek(gif.tell() + 1)

    except EOFError:
        pass  # all frames processed

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

