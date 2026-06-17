with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip().startswith('═'):
        lines[i] = '  // ' + line.lstrip()

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w') as f:
    f.writelines(lines)
print('Fixed comments.')
