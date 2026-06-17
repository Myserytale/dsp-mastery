with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r') as f:
    text = f.read()

# Replace any sequence of 2 backslashes followed by a backtick with 1 backslash followed by a backtick.
text = text.replace("\\\\`", "\\`")

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w') as f:
    f.write(text)
print('Fixed backticks.')
