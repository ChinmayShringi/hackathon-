from PIL import Image
import sys
import numpy as np

def extract_frames_and_durations(gif_path):
    """Helper function to load all frames and their durations from a GIF."""
    gif = Image.open(gif_path)
    frames = []
    durations = []
    try:
        while True:
            frames.append(gif.convert("RGBA"))
            durations.append(gif.info.get('duration', 100))
            gif.seek(gif.tell() + 1)
    except EOFError:
        pass
    return frames, durations

def composite_frames(idx, bg_frame, fg_frame, mask_frame):
    """
    Placeholder for the core compositing logic.
    You will replace the logic in this function.

    Args:
        bg_frame (Image.Image): The frame from the background animation.
        fg_frame (Image.Image): The frame from the foreground ("real") animation.
        mask_frame (Image.Image): The frame from the mask animation.

    Returns:
        Image.Image: The final, composited RGBA frame.
    """
    
    fg_arr = np.array(Image.alpha_composite(Image.new("RGBA", fg_frame.size, (0, 0, 0, 255)), fg_frame))
    mask_arr = np.array(mask_frame)
    
    is_white_mask = np.all(mask_arr == [255, 255, 255, 255], axis=2)
    is_reveal_mask = np.all(mask_arr == [0, 0, 0, 255], axis=2)
    
    print(f"{idx}: White Pixels: {np.sum(is_white_mask)}, Transparent Pixels: {np.sum(is_reveal_mask)}")
    fg_arr[is_white_mask, 3] = 0
    
    is_bug_mask = (mask_arr[:, :, 3] > 0) & (~is_white_mask)
    if np.any(is_bug_mask):
        # Extract the relevant pixel data from each array using our boolean mask.
        base_pixels = fg_arr[is_bug_mask]
        top_pixels = mask_arr[is_bug_mask]

        # Normalize to float (0.0 to 1.0) for accurate math.
        base_float = base_pixels.astype(np.float32) / 255.0
        top_float = top_pixels.astype(np.float32) / 255.0
        
        # Isolate the alpha of the top ("bug") layer. Reshape for broadcasting.
        top_alpha = top_float[:, 3][:, np.newaxis]

        # Perform the standard alpha blend formula: Out = Top * TopAlpha + Base * (1 - TopAlpha)
        blended_rgb = top_float[:, :3] * top_alpha + base_float[:, :3] * (1.0 - top_alpha)

        # Update the fg_arr in the bug locations with the new blended RGB values.
        # The alpha of these pixels remains 255 (opaque), as per the blend result.
        fg_arr[is_bug_mask, :3] = (blended_rgb * 255).astype(np.uint8)
    
    final_image = Image.alpha_composite(bg_frame, Image.fromarray(fg_arr, 'RGBA'))
    
    


    return final_image

def build_animation(background_path, foreground_path, mask_path, output_path):
    """
    Builds the final animation by calling the composite_frames function for each frame.
    """
    bg_frames, bg_durations = extract_frames_and_durations(background_path)
    fg_frames, _ = extract_frames_and_durations(foreground_path)
    mask_frames, _ = extract_frames_and_durations(mask_path)

    if not bg_frames or not fg_frames or not mask_frames:
        print("Error: One of the input GIFs could not be read or is empty.")
        return

    n = len(bg_frames)  # Frames in background
    k = len(mask_frames) # Frames in mask

    # Use the robust formula for calculating total output frames.
    if k <= n:
        total_output_frames = n * 2
    else:
        loops_needed = (k // n) + 1
        total_output_frames = n * loops_needed
    
    final_frames = []
    final_durations = []

    print(f"Preparing to generate {total_output_frames} frames...")
    print(k, n)

    for i in range(total_output_frames):
        final_frame = None

        # Determine if the mask is currently active
        if i < k:
            # When the mask is active, call the compositing function
            current_bg = bg_frames[i % n]
            current_fg = fg_frames[i % n]
            current_mask = mask_frames[i]
            
            final_frame = composite_frames(i, current_bg, current_fg, current_mask)
        else:
            # After the mask is finished, just append the foreground ("real") frames.
            final_frame = fg_frames[i % len(fg_frames)].copy()

        final_frames.append(final_frame)
        # Use the background's timing for the whole animation for consistency
        final_durations.append(bg_durations[i % n])

    # Save the final, non-looping GIF
    if final_frames:
        print("Saving final GIF...")
        final_frames[0].save(
            output_path,
            save_all=True,
            append_images=final_frames[1:],
            duration=final_durations,
            disposal=2,
        )
        print(f"Successfully created {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python your_script_name.py background.gif foreground.gif mask.gif output.gif")
        print("\n  background.gif: The blurry animation that plays continuously.")
        print("  foreground.gif: The sharp ('real') content that is revealed.")
        print("  mask.gif:       The animation that controls the reveal ('bug' animation).")
        sys.exit(1)
    
    background_gif_path = sys.argv[1]
    foreground_gif_path = sys.argv[2]
    mask_gif_path = sys.argv[3]
    output_gif_path = sys.argv[4]
    
    build_animation(background_gif_path, foreground_gif_path, mask_gif_path, output_gif_path)
