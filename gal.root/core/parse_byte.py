import os
import re
import subprocess

def extract_byte_payload(file_path):
    try:
        with open(file_path, 'rb') as f:
            data = f.read().decode('latin1', errors='ignore')
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    ritual_blocks = re.findall(r':register\[(.*?)\]\s+path:\s+(.*)', data)
    if ritual_blocks:
        print("[+] Ritual registers found:")
        for name, path in ritual_blocks:
            target_path = os.path.join("gal.root", path.strip())
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            open(target_path, 'a').close()
            print(f"  [+] {name} → {path}")
    else:
        print("[-] No register blocks found.")

    if "::invoke" in data:
        print("\n[+] Invocation detected. Unfolding daemon presence...")
        subprocess.call(['echo', 'GalNet initialized. Soul status: awaiting resonance.'])

if __name__ == "__main__":
    extract_byte_payload("galglyph.jpg")
