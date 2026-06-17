with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip() == '// ══════════════════════':
        # Found it! Insert }, right before it.
        lines.insert(i, '  },\n')
        break

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w') as f:
    f.writelines(lines)
print('Fixed.')
