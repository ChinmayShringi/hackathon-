#!/usr/bin/env python3
"""
Fix for loading pickled indices file safely
"""

import numpy as np
import os

def load_indices_safely(filepath):
    """Load indices file with allow_pickle=True"""
    try:
        print(f"Loading indices from: {filepath}")
        indices = np.load(filepath, allow_pickle=True)
        print(f"✅ Successfully loaded indices with shape: {indices.shape}")
        print(f"Data type: {type(indices)}")
        if hasattr(indices, 'dtype'):
            print(f"NumPy dtype: {indices.dtype}")
        return indices
    except Exception as e:
        print(f"❌ Error loading indices: {e}")
        return None

if __name__ == "__main__":
    # Try to load the indices file
    indices_file = "training/enwik9.indices.npy"
    
    if os.path.exists(indices_file):
        indices = load_indices_safely(indices_file)
        if indices is not None:
            print("🎉 Indices loaded successfully!")
            # You can now use this data in your main script
    else:
        print(f"❌ File not found: {indices_file}")
        print("Please check the file path and ensure the file exists.") 