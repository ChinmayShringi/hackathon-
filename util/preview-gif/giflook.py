import sys
from PIL import Image

def inspect_gif_frames(gif_path):
    """
    Opens a GIF file and prints the total number of frames it contains.
    """
    try:
        # Open the image file
        img = Image.open(gif_path)
    except FileNotFoundError:
        print(f"Error: The file '{gif_path}' was not found.")
        sys.exit(1)
    except Exception as e:
        # Catch other PIL errors, like not being a valid GIF
        print(f"An error occurred while opening the image: {e}")
        sys.exit(1)

    # Check if the image is an animated format like GIF
    if not getattr(img, 'is_animated', False):
        print(f"The file '{gif_path}' is not an animated image or has only 1 frame.")
        # n_frames is still the correct attribute for single-frame images
        print(f"Total Frames: {getattr(img, 'n_frames', 1)}")
        return

    # The 'n_frames' attribute holds the total number of frames
    num_frames = getattr(img, 'n_frames', 1)

    print(f"Inspecting: {gif_path}")
    print(f"Total Frames: {num_frames}")

    # It's good practice to close the file handle
    img.close()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python inspect_gif.py <path_to_gif_file>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    inspect_gif_frames(file_path)
