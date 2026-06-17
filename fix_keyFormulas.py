with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r') as f:
    text = f.read()

# Insert keyFormulas right before the closing brace of Week 4.
# Week 4 ends around line 1530:
# 1530   },
# 1531   // ══════════════════════

import re
text = re.sub(r'(`,\n\s*?)(},\n\s*?// ══════════════════════)', r'\1    keyFormulas: `## Week 4 Key Formulas\n\n- Sampling theorem\n- Aliasing equations\n- DFT/FFT numeric relations`,\n\2', text)

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w') as f:
    f.write(text)
print('Fixed keyFormulas.')
