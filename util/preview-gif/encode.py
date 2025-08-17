import sys
import numpy as np
from PIL import Image, ImageSequence

def entropy(img):
    hist = img.histogram()
    hist = np.array(hist) / sum(hist)
    hist = hist[hist > 0]
    return -np.sum(hist * np.log2(hist))

def most_informative_frame(frames):
    entropies = [entropy(f.convert('RGB')) for f in frames]
    return np.argmax(entropies)

def zigzag_encode(n):
    return (n << 1) ^ (n >> 15)

def encode_value(value, bit_widths):
    chunks = []
    remaining = value
    for bits in bit_widths:
        max_val = (1 << bits) - 1
        chunk = min(remaining, max_val)
        chunks.append(chunk)
        if chunk < max_val:
            break
        remaining -= chunk
    return chunks

def bitpack(values, bit_widths):
    tiers = [[] for _ in bit_widths]
    current_indices = list(range(len(values)))
    current_values = values[:]

    for i, bits in enumerate(bit_widths):
        max_val = (1 << bits) - 1
        next_indices = []
        next_values = []
        for idx, val in zip(current_indices, current_values):
            chunk = min(val, max_val)
            tiers[i].append((idx, chunk))
            if chunk == max_val:
                next_indices.append(idx)
                next_values.append(val - chunk)
        current_indices = next_indices
        current_values = next_values
        if not current_indices:
            break
    return tiers

def write_packed_tiers(tiers, bit_widths, total_len):
    bitstream = bytearray()
    bit_cursor = 0
    buffer = 0

    for tier, bits in zip(tiers, bit_widths):
        tier_data = [0] * total_len
        for idx, val in tier:
            tier_data[idx] = val
        for val in tier_data:
            buffer = (buffer << bits) | val
            bit_cursor += bits
            while bit_cursor >= 8:
                bit_cursor -= 8
                byte = (buffer >> bit_cursor) & 0xFF
                bitstream.append(byte)
        buffer = 0
        bit_cursor = 0

    return bitstream

def flatten_frame(frame):
    return frame.transpose(2, 0, 1).reshape(-1)

def encode_gif(input_gif, output_bin):
    frames = [frame.convert('RGBA') for frame in ImageSequence.Iterator(Image.open(input_gif))]
    informative_idx = most_informative_frame(frames)
    base_frame = np.array(frames[informative_idx], dtype=np.uint8)
    base_flat = flatten_frame(base_frame)

    all_deltas = []
    for i, frame in enumerate(frames):
        if i == informative_idx:
            continue
        current = np.array(frame.convert('RGBA'), dtype=np.uint8)
        delta = (flatten_frame(current).astype(np.int16) - base_flat.astype(np.int16))
        zigzagged = [zigzag_encode(d) for d in delta]
        all_deltas.append(zigzagged)

    bit_widths = [1, 2, 4, 8]
    encoded_tiers = [bitpack(zigzagged, bit_widths) for zigzagged in all_deltas]

    with open(output_bin, 'wb') as f:
        f.write(bytes([informative_idx, len(frames)]))
        np.save(f, base_frame)
        for tiers in encoded_tiers:
            packed = write_packed_tiers(tiers, bit_widths, len(base_flat))
            np.save(f, packed)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: python encode.py input.gif output.bin')
    else:
        encode_gif(sys.argv[1], sys.argv[2])

