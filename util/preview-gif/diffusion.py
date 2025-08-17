from PIL import Image, ImageFilter, ImageOps, ImageEnhance, ImageDraw
import sys
import numpy as np
import math

def add_noise_to_frame(frame, noise_level):
    """Adds Gaussian noise to a PIL Image."""
    img_array = np.array(frame, dtype=np.float32)
    noise = np.random.normal(0, noise_level, img_array.shape)
    noisy_array = np.clip(img_array + noise, 0, 255)
    return Image.fromarray(noisy_array.astype(np.uint8), 'RGB')

def create_resolving_scanline_gif(input_gif, output_gif):
    """
    Creates a GIF with a resolving effect. The reveal scanline accelerates
    over time, and is represented by a white vertical gradient with an
    animated, oscillating center point.
    """
    target_duration_ms = 10000.0

    # --- 1. Read all original frames and their durations ---
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

    cycle_duration_ms = sum(original_durations)
    print(f"Source GIF has {len(original_frames)} frames with a total duration of {cycle_duration_ms} ms.")
    
    if cycle_duration_ms <= 0:
        print("Error: GIF has no duration. Cannot process.")
        return

    # --- 2. Build the Full Frame Stack ---
    repetitions = math.ceil(target_duration_ms / cycle_duration_ms)
    full_frames_original = original_frames * repetitions
    full_durations = original_durations * repetitions
    num_total_frames = len(full_frames_original)

    # --- 3. Process the full frame stack ---
    processed_frames = []
    elapsed_time_ms = 0
    
    # Using the new values from your script for effects
    start_blur, end_blur = 20.0, 3.0
    start_noise, end_noise = 200.0, 20.0
    start_brightness, end_brightness = 1.8, 1.3

    print("\nProcessing frames with accelerating scanline and gradient divider...")
    for i in range(num_total_frames):
        # A. Calculate progress for effects (linear) and scanline (eased)
        linear_progress = min(1.0, elapsed_time_ms / target_duration_ms)
        eased_progress = linear_progress ** 4 # t^4 Easing for the scanline

        current_blur = start_blur + (end_blur - start_blur) * linear_progress
        current_noise = start_noise + (end_noise - start_noise) * linear_progress
        current_brightness = start_brightness + (end_brightness - start_brightness) * linear_progress
        
        # B. Generate the "unresolved" base frame
        source_frame = full_frames_original[i]
        w, h = source_frame.size
        bg = Image.new("RGB", (w, h), (0, 0, 0))
        bg.paste(source_frame, (0, 0), source_frame)
        
        enhancer = ImageEnhance.Brightness(bg)
        frame_brightened = enhancer.enhance(current_brightness)
        frame_with_noise = add_noise_to_frame(frame_brightened, current_noise)
        
        unresolved_frame = frame_with_noise.filter(ImageFilter.GaussianBlur(current_blur))
            
        # C. Paste the clean, revealed portion
        final_frame = unresolved_frame.copy().convert("RGBA")
        reveal_width = int(w * eased_progress)

        if reveal_width > 0:
            clean_strip = full_frames_original[i].crop((0, 0, reveal_width, h))
            final_frame.paste(clean_strip, (0, 0), clean_strip)

        # D. Draw the animating vertical gradient divider
        if reveal_width < w:
            # Create a procedural gradient for the line using NumPy
            # 1. Determine the oscillating center of the gradient
            sine_wave = math.sin(elapsed_time_ms / 2000.0) # Slow cycle for the gradient's position
            gradient_center_y = (h / 2) + (h / 2.5) * sine_wave # Center moves over the middle part of the screen

            # 2. Calculate distance of each pixel from the center
            y_coords = np.arange(h)
            distance = np.abs(y_coords - gradient_center_y)
            
            # 3. Map distance to opacity (10% to 30%)
            max_alpha, min_alpha = int(255 * 0.30), int(255 * 0.10)
            # Normalize distance to 0-1 range based on max possible distance
            norm_distance = np.clip(distance / (h / 2), 0, 1)
            alpha_values = max_alpha - (norm_distance * (max_alpha - min_alpha))
            
            # 4. Create the 1-pixel wide gradient image
            gradient_line = np.zeros((h, 1, 4), dtype=np.uint8)
            gradient_line[..., 0:3] = 255  # Set RGB to white
            gradient_line[..., 3] = alpha_values.reshape(h, 1).astype(np.uint8) # Reshape to a column and set alpha
            
            gradient_image = Image.fromarray(gradient_line, 'RGBA')
            
            # 5. Composite the gradient onto the main image
            overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
            overlay.paste(gradient_image, (reveal_width, 0))
            final_frame = Image.alpha_composite(final_frame, overlay)

        processed_frames.append(final_frame.convert("RGB")) # Convert back to RGB for saving
        
        elapsed_time_ms += full_durations[i]

    # --- 4. Save the Final GIF ---
    print("\nSaving the processed GIF...")
    processed_frames[0].save(
        output_gif,
        save_all=True,
        append_images=processed_frames[1:],
        duration=full_durations,
        loop=0
    )
    print(f"Done. Final GIF has {len(processed_frames)} frames and a total duration of {sum(full_durations)} ms.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python your_script_name.py input.gif output.gif")
    else:
        input_gif = sys.argv[1]
        output_gif = sys.argv[2]
        create_resolving_scanline_gif(input_gif, output_gif)
