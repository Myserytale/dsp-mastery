with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip().startswith('// ══════════════════════'):
        if '},' not in lines[i-1] and '},' not in lines[i-2]:
            lines.insert(i, '  },\n')
            break

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w') as f:
    f.writelines(lines)
print('Fixed brace.')
