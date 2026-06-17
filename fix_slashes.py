import re
import glob

files = glob.glob('dsp-app/frontend/src/content/*.ts')
for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()

    # We want to replace \c with \\c for any c EXCEPT backtick
    # In regex, \\\\ matches \ on disk.
    # [^`] matches any character except `
    # We use a capture group to keep the character.
    def replacer(match):
        c = match.group(1)
        if c == '`':
            return '\\`'
        elif c == '$':
            return '\\$'
        else:
            return '\\\\' + c

    new_text = re.sub(r'\\(.)', replacer, text)
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print(f'Fixed {fpath}')
