import os
import re

BYTE_PATH = "byte.txt"  # adjust if needed

def parse_byte_file(path):
    if not os.path.exists(path):
        print(f"[GAL] byte.txt not found at {path}")
        return

    with open(path, 'r') as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        register_match = re.match(r":register\[(.*?)\]", line.strip())
        if register_match:
            reg_name = register_match.group(1)
            path_line = lines[i + 1].strip()
            if path_line.startswith("path:"):
                target_path = path_line.split("path:")[1].strip()
                full_path = os.path.join("../gal.root", target_path)
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                with open(full_path, 'w') as new_file:
                    new_file.write(f"# Registered by {reg_name}\n")
                print(f"[GAL] Registered {reg_name} → {full_path}")

if __name__ == "__main__":
    parse_byte_file(BYTE_PATH)
