import glob
import re

for fpath in glob.glob('dsp-app/frontend/src/content/*.ts'):
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Replace \n followed by ** or *Proof with \n\n
    # Use negative lookbehind to ensure we don't replace if it's already \n\n
    new_text = re.sub(r'(?<!\n)\n(\*\*(?:\([a-z]\)|\w)|\*Proof)', r'\n\n\1', text)

    # Also fix "\n(a)" if not bolded
    new_text = re.sub(r'(?<!\n)\n(\([a-z]\)\s)', r'\n\n\1', new_text)

    # If it's still missing spaces, let's just use \n\n for any \n followed by **
    new_text = re.sub(r'(?<!\n)\n(\*\*)', r'\n\n\1', new_text)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_text)

print("Done")
