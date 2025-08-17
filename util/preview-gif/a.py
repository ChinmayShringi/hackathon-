import sys
from PIL import Image
import numpy as np

def analyze_gif_middle_frame(gif_path):
    """
    Opens a GIF, finds its middle frame, and prints all unique RGBA color values found.
    """
    try:
        gif = Image.open(gif_path)
    except FileNotFoundError:
        print(f"Error: The file '{gif_path}' was not found.")
        return
    except Exception as e:
        print(f"An error occurred while opening the GIF: {e}")
        return

    # 1. Find the middle frame
    total_frames = getattr(gif, 'n_frames', 1)
    middle_frame_index = total_frames // 2

    print(f"Analyzing '{gif_path}'...")
    print(f"Total frames: {total_frames}")
    print(f"Middle frame index: {middle_frame_index}\n")

    try:
        # Seek to the middle frame
        gif.seek(middle_frame_index)
        # Ensure the frame is in RGBA format for analysis
        middle_frame = gif.convert("RGBA")
    except EOFError:
        print("Error: Could not seek to the middle frame. The GIF might be shorter than expected.")
        return

    # 2. Count unique pixel color values
    # Using a set is a highly efficient way to find unique items.
    # We convert each pixel's tuple of (R,G,B,A) into a hashable object.
    
    # Efficient method using NumPy:
    # Reshape the image array into a list of pixels, then find unique rows.
    frame_arr = np.array(middle_frame)
    # Reshape from (height, width, 4) to (total_pixels, 4)
    pixels = frame_arr.reshape(-1, 4)
    # np.unique finds all unique rows and can also return their counts
    unique_colors, counts = np.unique(pixels, axis=0, return_counts=True)

    print(f"Found {len(unique_colors)} unique RGBA color values in the middle frame:")
    
    # 3. Print the results
    for i in range(len(unique_colors)):
        color = tuple(unique_colors[i])
        count = counts[i]
        print(f"  - RGBA: {color}, Count: {count}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python your_utility_name.py your_animation.gif")
        sys.exit(1)

    gif_file_path = sys.argv[1]
    analyze_gif_middle_frame(gif_file_path)
