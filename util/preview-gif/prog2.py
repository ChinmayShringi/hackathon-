from PIL import Image, ImageFilter, ImageOps, ImageEnhance, ImageDraw
import sys
import numpy as np
import math
import random

def gaussian_truncated(low=0, high=1):
    mu = (low + high) / 2
    sigma = (high - low) / 6
    while True:
        x = np.random.normal(mu, sigma)
        if low <= x <= high:
            return x

def get_image_palette(img, color_count=16):
    quantized_img = img.convert('P', palette=Image.Palette.ADAPTIVE, colors=color_count)
    palette = quantized_img.getpalette()
    return [tuple(palette[i*3 : i*3+3]) for i in range(color_count)]

def add_palette_noise(frame, palette, noise_density):
    noise_layer = Image.new('RGBA', frame.size)
    draw = ImageDraw.Draw(noise_layer)
    num_noise_pixels = int(frame.width * frame.height * noise_density)
    for _ in range(num_noise_pixels):
        x = random.randint(0, frame.width - 1)
        y = random.randint(0, frame.height - 1)
        noise_color = random.choice(palette)
        draw.point((x, y), fill=noise_color)
    return Image.alpha_composite(frame.convert('RGBA'), noise_layer).convert('RGB')

def rolling_xor(data_bytes, key_bytes):
    key_len = len(key_bytes)
    return bytes([b ^ key_bytes[i % key_len] for i, b in enumerate(data_bytes)])

def pack_frames_to_texture_atlas(frames, tile_columns=4):
    frame_width, frame_height = frames[0].size
    total_frames = len(frames)
    rows = math.ceil(total_frames / tile_columns)
    atlas = Image.new("RGB", (tile_columns * frame_width, rows * frame_height))

    for idx, frame in enumerate(frames):
        x = (idx % tile_columns) * frame_width
        y = (idx // tile_columns) * frame_height
        atlas.paste(frame, (x, y))

    return atlas

def create_frozen_reveal_gif(input_gif, output_gif, output_blob):
    reveal_duration_ms = 10000.0
    key_string = "delula is the solula"
    xor_key = key_string.encode("utf-8")

    # --- 1. Read the source GIF ---
    original_frames, original_durations = [], []
    with Image.open(input_gif) as gif:
        try:
            while True:
                original_frames.append(gif.convert("RGBA"))
                original_durations.append(gif.info.get('duration', 100))
                gif.seek(gif.tell() + 1)
        except EOFError:
            pass

    if not original_frames:
        print("Error: Could not read frames from the input GIF.")
        return

    first_frame = original_frames[0]
    w, h = first_frame.size
    cycle_duration_ms = sum(original_durations)
    avg_frame_duration = cycle_duration_ms / len(original_frames)

    image_palette = get_image_palette(first_frame.convert('RGB'))

    print(f"Source GIF has {len(original_frames)} frames. Total cycle time: {cycle_duration_ms} ms.")
    print("Beginning Act I: Generating 10-second frozen reveal sequence...")

    reveal_frames = []
    elapsed_time_ms = 0
    start_blur, end_blur = 10.0 + gaussian_truncated(0.5, 1.0), 2.9 + gaussian_truncated(0.1, 0.2)
    start_noise, end_noise = 10 + gaussian_truncated(0.1, 0.2), 1.9 + gaussian_truncated(0.01, 0.05)
    start_brightness, end_brightness = 3.5 + gaussian_truncated(0.5, 1.0), 1.0 + gaussian_truncated(0.1, 0.2)
    progress_factor = gaussian_truncated(1.0, 2.0)

    stutter_state = 'PROGRESSING'
    stutter_frames_remaining = 0
    progress_at_stutter_start = 0.0

    while elapsed_time_ms < reveal_duration_ms:
        if stutter_state == 'STUTTERING':
            linear_progress = progress_at_stutter_start
            stutter_frames_remaining -= 1
            if stutter_frames_remaining <= 0:
                stutter_state = 'PROGRESSING'
        else:
            linear_progress = min(1.0, elapsed_time_ms / reveal_duration_ms)
            if random.randint(1, 150) == 1 and 0.1 < linear_progress < 0.9:
                stutter_state = 'STUTTERING'
                stutter_frames_remaining = int(gaussian_truncated(1.0, 5.0))
                progress_at_stutter_start = linear_progress

        eased_progress = linear_progress ** progress_factor
        current_blur = start_blur + (end_blur - start_blur) * linear_progress
        current_noise_density = start_noise + (end_noise - start_noise) * max(linear_progress * 1.5, 1.0)
        current_brightness = start_brightness + (end_brightness - start_brightness) * linear_progress

        bg = Image.new("RGB", (w, h), (0, 0, 0))
        bg.paste(first_frame, (0, 0), first_frame)
        enhancer = ImageEnhance.Brightness(bg)
        frame_brightened = enhancer.enhance(current_brightness)
        frame_with_noise = add_palette_noise(frame_brightened, image_palette, current_noise_density)
        unresolved_base = frame_with_noise.filter(ImageFilter.GaussianBlur(current_blur))

        final_frame = unresolved_base.copy().convert("RGBA")
        reveal_height = int(h * eased_progress)

        if reveal_height > 0:
            clean_strip = first_frame.crop((0, 0, w, reveal_height))
            final_frame.paste(clean_strip, (0, 0), clean_strip)

        if reveal_height < h:
            sine_wave = math.sin(elapsed_time_ms / 2000.0)
            gradient_center_x = (w / 2) + (w / 2.5) * sine_wave

            x_coords = np.arange(w)
            distance = np.abs(x_coords - gradient_center_x)
            max_alpha, min_alpha = int(192 * 0.30), int(192 * 0.10)
            norm_distance = np.clip(distance / (w / 2), 0, 1)
            alpha_values = max_alpha - (norm_distance * (max_alpha - min_alpha))
            gradient_line = np.zeros((1, w, 4), dtype=np.uint8)
            gradient_line[..., 0:3] = 255
            gradient_line[..., 3] = alpha_values.reshape(1, w).astype(np.uint8)
            gradient_image = Image.fromarray(gradient_line, 'RGBA')
            overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
            overlay.paste(gradient_image, (0, reveal_height))
            final_frame = Image.alpha_composite(final_frame, overlay)

        reveal_frames.append(final_frame.convert("RGB"))
        elapsed_time_ms += avg_frame_duration

    print("Act I complete. Appending one full, clean animation cycle...")
    clean_original_frames = [frame.convert("RGB") for frame in original_frames]
    all_processed_frames = reveal_frames + clean_original_frames
    all_durations = [avg_frame_duration] * len(reveal_frames) + original_durations

    print("\nSaving the final composite GIF...")
    all_processed_frames[0].save(
        output_gif,
        save_all=True,
        append_images=all_processed_frames[1:],
        duration=all_durations,
        loop=0
    )

    print(f"Generating texture atlas and writing encrypted .bin...")
    atlas = pack_frames_to_texture_atlas(all_processed_frames)
    atlas_bytes = atlas.tobytes()
    encrypted_blob = rolling_xor(atlas_bytes, xor_key)

    with open(output_blob, "wb") as f:
        f.write(encrypted_blob)

    print(f"Done. Final GIF has {len(all_processed_frames)} frames. Encrypted atlas written to {output_blob}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python your_script.py input.gif output.gif output_atlas.bin")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        output_blob = sys.argv[3]
        create_frozen_reveal_gif(input_gif, output_gif, output_blob)
