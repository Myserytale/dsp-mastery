import re

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r') as f:
    text = f.read()

# We need to remove the injected `    keyFormulas: `## Week 4 Key Formulas\n\n- Sampling theorem\n- Aliasing equations\n- DFT/FFT numeric relations`,\n`
# from everywhere EXCEPT where id: 4 is.
# Actually, the easiest way is to just find all occurrences of that injected string and remove them if they don't belong to Week 4.
# Let's just remove ALL occurrences, and then inject it ONLY for Week 4.

injected_str = r"    keyFormulas: `## Week 4 Key Formulas\n\n- Sampling theorem\n- Aliasing equations\n- DFT/FFT numeric relations`,\n"
text = text.replace(injected_str.replace(r'\n', '\n'), '')

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w') as f:
    f.write(text)
print('Removed all injected.')
