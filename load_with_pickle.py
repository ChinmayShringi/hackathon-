#!/usr/bin/env python3
"""
Alternative loading method using pickle
"""

import pickle
import os

def load_with_pickle(filepath):
    """Load pickled data using pickle module"""
    try:
        print(f"Loading data with pickle from: {filepath}")
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        print(f"✅ Successfully loaded data with pickle")
        print(f"Data type: {type(data)}")
        if hasattr(data, 'shape'):
            print(f"Shape: {data.shape}")
        return data
    except Exception as e:
        print(f"❌ Error loading with pickle: {e}")
        return None

if __name__ == "__main__":
    # Try to load the indices file with pickle
    indices_file = "training/enwik9.indices.npy"
    
    if os.path.exists(indices_file):
        data = load_with_pickle(indices_file)
        if data is not None:
            print("🎉 Data loaded successfully with pickle!")
    else:
        print(f"❌ File not found: {indices_file}") 