#!/usr/bin/env python3
"""
Quick base64 encoder/decoder for CTF challenges
Usage: python3 b64.py encode "hello world"
       python3 b64.py decode "aGVsbG8gd29ybGQ="
"""

import sys
import base64

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 b64.py [encode|decode] <text>")
        sys.exit(1)
    
    action = sys.argv[1].lower()
    text = sys.argv[2]
    
    if action == "encode":
        encoded = base64.b64encode(text.encode()).decode()
        print(f"Encoded: {encoded}")
    elif action == "decode":
        try:
            decoded = base64.b64decode(text).decode()
            print(f"Decoded: {decoded}")
        except Exception as e:
            print(f"Error decoding: {e}")
    else:
        print("Action must be 'encode' or 'decode'")

if __name__ == "__main__":
    main()