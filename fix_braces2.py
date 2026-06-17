with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r') as f:
    lines = f.readlines()

# Remove bogus '  },\n' around line 17
for i in range(15, 25):
    if lines[i].strip() == '},':
        del lines[i]
        break

# Find WEEK 5:
week5_idx = -1
for i, line in enumerate(lines):
    if 'WEEK 5:' in line:
        week5_idx = i
        break

if week5_idx != -1:
    # The line before week5_idx should be the ════ line.
    # The line before that should be }, 
    if '},' not in lines[week5_idx-2] and '},' not in lines[week5_idx-3]:
        lines.insert(week5_idx-1, '  },\n')

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w') as f:
    f.writelines(lines)
print('Fixed properly.')
