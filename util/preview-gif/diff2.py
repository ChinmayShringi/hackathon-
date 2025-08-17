from PIL import Image, ImageFilter, ImageOps, ImageEnhance, ImageDraw
import sys
import numpy as np
import math

def gaussian_truncated(low=0, high=1):
    mu = (low + high) / 2
    sigma = (high - low) / 6
    while True:
        x = np.random.normal(mu, sigma)
        if low <= x <= high:
            return x

def add_noise_to_frame(frame, noise_level):
    """Adds Gaussian noise to a PIL Image."""
    img_array = np.array(frame, dtype=np.float32)
    noise = np.random.normal(0, noise_level, img_array.shape)
    noisy_array = np.clip(img_array + noise, 0, 255)
    return Image.fromarray(noisy_array.astype(np.uint8), 'RGB')

def create_frozen_reveal_gif(input_gif, output_gif):
    """
    Creates a GIF with a two-act structure:
    1. A 10-second "reveal" where the first frame of the GIF resolves from
       top-to-bottom over a noisy/blurry version.
    2. The full, clean original animation plays through one cycle.
    """
    reveal_duration_ms = 10000.0

    # --- 1. Read the source GIF to get frames, durations, and dimensions ---
    original_frames = []
    original_durations = []
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
    avg_frame_duration = cycle_duration_ms / len(original_frames) if len(original_frames) > 0 else 33

    print(f"Source GIF has {len(original_frames)} frames. Total cycle time: {cycle_duration_ms} ms.")
    print("Beginning Act I: Generating 10-second frozen reveal sequence...")

    # --- 2. ACT I: Generate the top-to-bottom reveal animation ---
    reveal_frames = []
    elapsed_time_ms = 0
    
    start_blur, end_blur = 15.0 + gaussian_truncated(5., 10.), 0.9 + gaussian_truncated(0.1, 0.2)
    start_noise, end_noise = 90.0 + gaussian_truncated(10., 20.), 19.0 + gaussian_truncated(1.0, 2.0)
    start_brightness, end_brightness = 3.0 + gaussian_truncated(1., 2.0), 1.5 + gaussian_truncated(0.5, 1.0)

    progress_factor = gaussian_truncated(1.0, 8.0)

    while elapsed_time_ms < reveal_duration_ms:
        # A. Calculate progress for effects (linear) and scanline (eased)
        linear_progress = min(1.0, elapsed_time_ms / reveal_duration_ms)
        eased_progress = linear_progress ** progress_factor

        current_blur = start_blur + (end_blur - start_blur) * linear_progress
        current_noise = start_noise + (end_noise - start_noise) * linear_progress
        current_brightness = start_brightness + (end_brightness - start_brightness) * linear_progress
        
        # B. Generate the "unresolved" base using ONLY the first frame
        bg = Image.new("RGB", (w, h), (0, 0, 0))
        bg.paste(first_frame, (0, 0), first_frame)
        
        enhancer = ImageEnhance.Brightness(bg)
        frame_brightened = enhancer.enhance(current_brightness)
        frame_with_noise = add_noise_to_frame(frame_brightened, current_noise)
        unresolved_base = frame_with_noise.filter(ImageFilter.GaussianBlur(current_blur))
            
        # C. Paste the clean, revealed portion
        final_frame = unresolved_base.copy().convert("RGBA")
        reveal_height = int(h * eased_progress)

        if reveal_height > 0:
            clean_strip = first_frame.crop((0, 0, w, reveal_height))
            final_frame.paste(clean_strip, (0, 0), clean_strip)

        # D. Draw the animating HORIZONTAL gradient divider
        if reveal_height < h:
            sine_wave = math.sin(elapsed_time_ms / 2000.0)
            gradient_center_x = (w / 2) + (w / 2.5) * sine_wave

            x_coords = np.arange(w)
            distance = np.abs(x_coords - gradient_center_x)
            
            max_alpha, min_alpha = int(255 * 0.30), int(255 * 0.10)
            norm_distance = np.clip(distance / (w / 2), 0, 1)
            alpha_values = max_alpha - (norm_distance * (max_alpha - min_alpha))
            
            # Create a (1, w, 4) numpy array for the horizontal line
            gradient_line = np.zeros((1, w, 4), dtype=np.uint8)
            gradient_line[..., 0:3] = 255
            gradient_line[..., 3] = alpha_values.reshape(1, w).astype(np.uint8)
            
            gradient_image = Image.fromarray(gradient_line, 'RGBA')
            
            overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
            overlay.paste(gradient_image, (0, reveal_height))
            final_frame = Image.alpha_composite(final_frame, overlay)

        reveal_frames.append(final_frame.convert("RGB"))
        elapsed_time_ms += avg_frame_duration
    
    # --- 3. ACT II: Append the clean, original animation ---
    print("Act I complete. Appending one full, clean animation cycle...")
    
    clean_original_frames = [frame.convert("RGB") for frame in original_frames]
    
    # --- 4. Combine and Save ---
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
    final_duration_s = sum(all_durations) / 1000.0
    print(f"Done. Final GIF has {len(all_processed_frames)} frames and a total duration of {final_duration_s:.2f} seconds.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python your_script_name.py input.gif output.gif")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        create_frozen_reveal_gif(input_gif, output_gif)
