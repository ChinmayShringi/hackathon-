from PIL import Image, ImageFilter, ImageOps, ImageEnhance
import sys
import numpy as np
import math

def add_noise_to_frame(frame, noise_level):
    """Adds Gaussian noise to a PIL Image."""
    img_array = np.array(frame, dtype=np.float32)
    noise = np.random.normal(0, noise_level, img_array.shape)
    noisy_array = np.clip(img_array + noise, 0, 255)
    return Image.fromarray(noisy_array.astype(np.uint8), 'RGB')

def create_timed_progressive_denoise_gif(input_gif, output_gif):
    """
    Creates a GIF of at least 10 seconds, where a denoising effect
    progressively fades out over the first 10 seconds.
    """
    target_duration_ms = 10000.0

    # --- 1. First Pass: Read all original frames and their durations ---
    original_frames = []
    original_durations = []
    with Image.open(input_gif) as gif:
        try:
            while True:
                original_frames.append(gif.copy())
                original_durations.append(gif.info.get('duration', 100))
                gif.seek(gif.tell() + 1)
        except EOFError:
            pass # Reached the end of the GIF

    cycle_duration_ms = sum(original_durations)
    print(f"Source GIF has {len(original_frames)} frames with a total duration of {cycle_duration_ms} ms.")
    
    if cycle_duration_ms <= 0:
        print("Error: GIF has no duration. Cannot process.")
        return

    # --- 2. Build the Full Frame Stack to meet the 10-second target ---
    repetitions = math.ceil(target_duration_ms / cycle_duration_ms)
    print(f"Repeating the frame sequence {repetitions} times to ensure duration is >= 10 seconds.")
    
    full_frames = original_frames * repetitions
    full_durations = original_durations * repetitions
    num_total_frames = len(full_frames)

    # --- 3. Process the full frame stack with time-based progression ---
    processed_frames = []
    elapsed_time_ms = 0
    
    # Define Start and End Values for Effects
    start_blur = 3.0
    start_noise = 100.0
    start_brightness = 0.5  # 50%
    end_brightness = 1.0    # 100%

    print("\nProcessing frames with time-based effects...")
    for i in range(num_total_frames):
        # Calculate progress based on time, not frame index. Clamp at 10s.
        progress = min(1.0, elapsed_time_ms / target_duration_ms)

        # Linearly interpolate each value for the current frame
        current_blur = start_blur * (1 - progress)
        current_noise = start_noise * (1 - progress)
        current_brightness = start_brightness + (end_brightness - start_brightness) * progress
        
        frame_to_process = full_frames[i]
        w, h = frame_to_process.size

        # Apply Effects
        bg = Image.new("RGB", (w, h), (0, 0, 0))
        bg.paste(frame_to_process, (0, 0), frame_to_process.convert("RGBA"))
        
        enhancer = ImageEnhance.Brightness(bg)
        frame_brightened = enhancer.enhance(current_brightness)

        frame_with_noise = add_noise_to_frame(frame_brightened, current_noise)
        
        if current_blur > 0:
            padded_canvas = Image.new("RGB", (w * 3, h * 3))
            for x_offset in range(-1, 2):
                for y_offset in range(-1, 2):
                    temp_frame = frame_with_noise.copy()
                    if x_offset == -1: temp_frame = ImageOps.mirror(temp_frame)
                    if y_offset == -1: temp_frame = ImageOps.flip(temp_frame)
                    padded_canvas.paste(temp_frame, (w * (x_offset + 1), h * (y_offset + 1)))
            
            blurred = padded_canvas.filter(ImageFilter.GaussianBlur(current_blur))
            final_frame = blurred.crop((w, h, w * 2, h * 2))
        else:
            # Skip the expensive padding/blurring if blur is zero
            final_frame = frame_with_noise

        processed_frames.append(final_frame)
        
        # Update the master clock for the next frame
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
        create_timed_progressive_denoise_gif(input_gif, output_gif)
