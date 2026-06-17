with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# We find the matrix block and replace the single/double backslashes with four backslashes.
def fix_matrix(match):
    matrix_text = match.group(0)
    # Replace any sequence of 1 or 2 backslashes at the end of a line or between elements with 4 backslashes
    matrix_text = re.sub(r'\\\\?\s*(\n|y|2|3)', r'\\\\\\\\ \1', matrix_text)
    return matrix_text

# Actually, it's easier to just explicitly replace the exact block.
old_block = r"""$$
\begin{bmatrix}
y[0] \ y[1] \ y[2] \ y[3] \ y[4] \ y[5] \ y[6]
\end{bmatrix}
=
\begin{bmatrix}
-1 & 0 & 0 & 0 & 0 \
2 & -1 & 0 & 0 & 0 \
1 & 2 & -1 & 0 & 0 \
0 & 1 & 2 & -1 & 0 \
0 & 0 & 1 & 2 & -1 \
0 & 0 & 0 & 1 & 2 \
0 & 0 & 0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
1 \ 2 \ 3 \ 2 \ 1
\end{bmatrix}
$$"""

# Let's just do a manual string replace.
# First read the file
with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "y[0]" in line and "y[1]" in line and "bmatrix" not in line:
        lines[i] = "y[0] \\\\\\\\ y[1] \\\\\\\\ y[2] \\\\\\\\ y[3] \\\\\\\\ y[4] \\\\\\\\ y[5] \\\\\\\\ y[6]\n"
    if "& 0 & 0" in line or "1 & 2 & -1" in line or "0 & 1 & 2" in line or "-1 & 0 & 0" in line:
        lines[i] = line.replace("\\\n", "\\\\\\\\\n").replace("\\\r\n", "\\\\\\\\\n")
    if "1 \\\\ 2 \\\\ 3 \\\\ 2 \\\\ 1" in line:
        lines[i] = "1 \\\\\\\\ 2 \\\\\\\\ 3 \\\\\\\\ 2 \\\\\\\\ 1\n"

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Done")
