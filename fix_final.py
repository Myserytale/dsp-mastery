with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r') as f:
    lines = f.readlines()

# delete lines 1529 to 1532
del lines[1529:1533]

# insert the correct lines
lines.insert(1529, "`,\n")
lines.insert(1530, "    keyFormulas: `## Week 4 Key Formulas\n\nNo specific formulas are listed.`\n")

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w') as f:
    f.writelines(lines)
print('Fixed.')
