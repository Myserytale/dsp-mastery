import re
import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Reformat HW1
    if 'weeks1to5.ts' in filepath:
        content = re.sub(
            r'## Homework 1 Solutions\n\n### Problem 1: Concepts\n- \*\*\(a\) Signal Classification\*\*: (.*?)\n- \*\*\(c\) Continuous vs Discrete vs Digital\*\*: (.*?)\n- \*\*\(n\) DSP over ASP\*\*: (.*?)\n\n### Problem 2 & 3: Python Basics\n\*\*Generating and Plotting a Signal\*\*',
            r'## 📝 Homework 1 Solutions\n\n> **Core Theme:** Establishing the fundamental definitions of signals and systems, and representing them in Python.\n\n### 📌 Problem 1: Concepts\n- **Signal Classification**: \1\n- **Continuous vs Discrete vs Digital**: \2\n- **DSP over ASP**: \3\n\n---\n\n### 📌 Problem 2 & 3: Python Basics\n> **Task:** Generate, save, and visualize a signal.\n',
            content
        )
        content = re.sub(
            r'### Problem 4: System Properties\n\*\*Test the system \$y\[n\] = \\\\cos\(x\[n\]\) \+ n\$ \(Part a\)\*\*',
            r'---\n\n### 📌 Problem 4: System Properties\n\n#### System: $y[n] = \\cos(x[n]) + n$',
            content
        )
        content = re.sub(
            r'\*\*Test the system \$y\[n\] = 2\^\{-n\} x\[n\]\$ \(Part b\)\*\*',
            r'#### System: $y[n] = 2^{-n} x[n]$',
            content
        )

        content = re.sub(
            r'## Homework 2 Solutions\n\n### Problem 1 & 2: Convolution Properties',
            r'## 📝 Homework 2 Solutions\n\n> **Focus:** Properties of Convolution and Matrix Formulations.\n\n### 📌 Problem 1 & 2: Convolution Properties',
            content
        )
        content = re.sub(r'### Problem 3: Length of Convolution', r'---\n\n### 📌 Problem 3: Length of Convolution', content)
        content = re.sub(r'### Problem 4: Matrix Formulation', r'---\n\n### 📌 Problem 4: Matrix Formulation', content)
        content = re.sub(r'### Problem 6: Plotting Convolution', r'---\n\n### 📌 Problem 6: Plotting Convolution', content)

        content = re.sub(
            r'## Homework 3 Solutions\n\n### Problem 3: Fourier Series',
            r'## 📝 Homework 3 Solutions\n\n> **Focus:** Fourier Series coefficients and FT properties.\n\n### 📌 Problem 3: Fourier Series',
            content
        )
        content = re.sub(r'### Problem 5: Key FT Properties', r'---\n\n### 📌 Problem 5: Key FT Properties', content)
        content = re.sub(r'### Problem 6: Symmetry', r'---\n\n### 📌 Problem 6: Symmetry', content)

        content = re.sub(
            r'## Homework 4 Solutions\n\n### Problem 1: Aliasing Proof',
            r'## 📝 Homework 4 Solutions\n\n> **Focus:** Aliasing proofs and continuous vs discrete FTs.\n\n### 📌 Problem 1: Aliasing Proof',
            content
        )
        content = re.sub(r'### Problem 3: Key FT Pairs', r'---\n\n### 📌 Problem 3: Key FT Pairs', content)
        content = re.sub(r'### Problem 4: Numeric vs Analytic FT', r'---\n\n### 📌 Problem 4: Numeric vs Analytic FT', content)

        content = re.sub(
            r'## Homework 5 Solutions\n\n### Problem 1 & 2: Sampling & Reconstruction',
            r'## 📝 Homework 5 Solutions\n\n> **Focus:** Sampling Theorem, Antialiasing, and DFT Limits.\n\n### 📌 Problem 1 & 2: Sampling & Reconstruction',
            content
        )
        content = re.sub(r'### Problem 3: Antialiasing Filter', r'---\n\n### 📌 Problem 3: Antialiasing Filter', content)
        content = re.sub(r'### Problem 5 & 6: Spectrum of Sampled Signal', r'---\n\n### 📌 Problem 5 & 6: Spectrum of Sampled Signal', content)
        content = re.sub(r'### Problem 10 & 11: DFT Limits', r'---\n\n### 📌 Problem 10 & 11: DFT Limits', content)

    if 'weeks6to9.ts' in filepath:
        content = re.sub(
            r'## Homework 6 Solutions\n\n### Problem 1 & 2: Zero Padding',
            r'## 📝 Homework 6 Solutions\n\n> **Focus:** Zero padding, convolution complexity, and spectral leakage.\n\n### 📌 Problem 1 & 2: Zero Padding',
            content
        )
        content = re.sub(r'### Problem 4: Complexity of Discrete Convolution', r'---\n\n### 📌 Problem 4: Complexity of Discrete Convolution', content)
        content = re.sub(r'### Problem 6: Spectral Leakage & Scalloping', r'---\n\n### 📌 Problem 6: Spectral Leakage & Scalloping', content)

        content = re.sub(
            r'## Homework 7 Solutions\n\n### Problem 1-3: Periodogram & Slicing',
            r'## 📝 Homework 7 Solutions\n\n> **Focus:** PSD Estimation, Welch\'s Method, and Laplace Transforms.\n\n### 📌 Problem 1-3: Periodogram & Slicing',
            content
        )
        content = re.sub(r'### Problem 5-10: Welch\'s Method', r'---\n\n### 📌 Problem 5-10: Welch\'s Method', content)
        content = re.sub(r'### Problem 13-16: Pre-processing Operations', r'---\n\n### 📌 Problem 13-16: Pre-processing Operations', content)
        content = re.sub(r'### Problem 25-27: Laplace Transform Basics', r'---\n\n### 📌 Problem 25-27: Laplace Transform Basics', content)

        content = re.sub(
            r'## Homework 8 Solutions\n\n### Problem 2-4: Poles, Zeros & Stability',
            r'## 📝 Homework 8 Solutions\n\n> **Focus:** Poles and zeros, Bode plots, and Z-Transform convergence.\n\n### 📌 Problem 2-4: Poles, Zeros & Stability',
            content
        )
        content = re.sub(r'### Problem 6-8: Bode Plots', r'---\n\n### 📌 Problem 6-8: Bode Plots', content)
        content = re.sub(r'### Problem 10-15: Z-Transform Fundamentals', r'---\n\n### 📌 Problem 10-15: Z-Transform Fundamentals', content)

        content = re.sub(
            r'## Homework 9 Solutions\n\n### Problem 1-4: Digital Stability & The Unit Circle',
            r'## 📝 Homework 9 Solutions\n\n> **Focus:** Z-plane stability and digital filter frequency response.\n\n### 📌 Problem 1-4: Digital Stability & The Unit Circle',
            content
        )
        content = re.sub(r'### Problem 7-8: Stability Analysis Examples', r'---\n\n### 📌 Problem 7-8: Stability Analysis Examples', content)
        content = re.sub(r'### Problem 13: FIR vs IIR Filters', r'---\n\n### 📌 Problem 13: FIR vs IIR Filters', content)
        content = re.sub(r'### Problem 14-15: Evaluating Frequency Response', r'---\n\n### 📌 Problem 14-15: Evaluating Frequency Response', content)

    if 'weeks10to13.ts' in filepath:
        content = re.sub(
            r'## Homework 10 Solutions\n\n### Problem 1-7: Filter Terminology',
            r'## 📝 Homework 10 Solutions\n\n> **Focus:** Filter Terminology, Notch Filters, and Bilinear Transform.\n\n### 📌 Problem 1-7: Filter Terminology',
            content
        )
        content = re.sub(r'### Problem 14-16: Notch Filter Design', r'---\n\n### 📌 Problem 14-16: Notch Filter Design', content)
        content = re.sub(r'### Problem 18-23: Bilinear Transform \(BLT\) & Pre-warping', r'---\n\n### 📌 Problem 18-23: Bilinear Transform (BLT) & Pre-warping', content)

        content = re.sub(
            r'## Homework 11 Solutions\n\n### Problem 1-3: FIR vs IIR Filters\n- \*\*FIR\*\*: Finite impulse response. Achieved purely by feed-forward delays \(no feedback\).\n  - \*Advantages\*: Always stable, perfectly linear phase \(no phase distortion\).\n  - \*Disadvantages\*: Requires many coefficients \(high filter order\) to achieve a sharp cutoff, leading to high computational cost.\n- \*\*IIR\*\*: Infinite impulse response. Requires feedback.\n  - \*Advantages\*: Extremely efficient, achieves sharp cutoffs with very low order.\n  - \*Disadvantages\*: Phase is non-linear \(distorts signal shape\), can become unstable if poles drift outside the unit circle due to quantization errors.',
            r'## 📝 Homework 11 Solutions\n\n> **Focus:** FIR vs IIR tradeoffs, the Window Method, and Linear Phase.\n\n### 📌 Problem 1-3: FIR vs IIR Filters\n| Feature | FIR (Finite Impulse Response) | IIR (Infinite Impulse Response) |\n|---------|-------------------------------|--------------------------------|\n| **Feedback** | None (Feed-forward only) | Required |\n| **Stability**| Always stable | Can become unstable |\n| **Phase** | Can be perfectly linear | Inherently non-linear |\n| **Efficiency**| Low (Requires high order) | High (Sharp cutoffs at low order) |',
            content
        )
        content = re.sub(r'### Problem 8-12: The Window Method & Causality', r'---\n\n### 📌 Problem 8-12: The Window Method & Causality', content)
        content = re.sub(r'### Problem 23-28: Linear Phase & Group Delay', r'---\n\n### 📌 Problem 23-28: Linear Phase & Group Delay', content)

        content = re.sub(
            r'## Homework 12 Solutions\n\n### Problem 4-5: STFT & Uncertainty Principle',
            r'## 📝 Homework 12 Solutions\n\n> **Focus:** Time-Frequency Analysis, STFT, and Wavelet Transforms.\n\n### 📌 Problem 4-5: STFT & Uncertainty Principle',
            content
        )
        content = re.sub(r'### Problem 6-12: Wavelet Transform vs. Fourier', r'---\n\n### 📌 Problem 6-12: Wavelet Transform vs. Fourier', content)

        content = re.sub(
            r'## Comprehensive Exam Overview & Solved Examples\n\nTo master the exam, you must be comfortable with the following core problem types. Here is an overview of potential questions with step-by-step solutions.\n\n### Topic 1: LTI Systems & Convolution\n\*\*Potential Question:\*\* Given an LTI system with \$h\[n\] = \\\\{1, -1, 2\\\\}\$ \(origin at first sample\) and input \$x\[n\] = \\\\{2, 1, 3\\\\}\$. Compute the output \$y\[n\]\$. Is this system stable\? Is it causal\?\n\n\*\*Solution:\*\*\n1. \*\*Convolution:\*\* \$y\[n\] = x\[n\] \* h\[n\]\$. Length will be \$3\+3-1 = 5\$.\n   - \$y\[0\] = x\[0\]h\[0\] = 2\(1\) = 2\$\n   - \$y\[1\] = x\[0\]h\[1\] \+ x\[1\]h\[0\] = 2\(-1\) \+ 1\(1\) = -1\$\n   - \$y\[2\] = x\[0\]h\[2\] \+ x\[1\]h\[1\] \+ x\[2\]h\[0\] = 2\(2\) \+ 1\(-1\) \+ 3\(1\) = 6\$\n   - \$y\[3\] = x\[1\]h\[2\] \+ x\[2\]h\[1\] = 1\(2\) \+ 3\(-1\) = -1\$\n   - \$y\[4\] = x\[2\]h\[2\] = 3\(2\) = 6\$\n   Result: \$y\[n\] = \\\\{2, -1, 6, -1, 6\\\\}\$.\n2. \*\*Stability:\*\* Check if \$\\\\sum \|h\[n\]\| < \\\\infty\$. \$|1| \+ \|-1\| \+ \|2\| = 4 < \\\\infty\$. The system is \*\*stable\*\*.\n3. \*\*Causality:\*\* \$h\[n\] = 0\$ for \$n < 0\$. The system is \*\*causal\*\*.',
            r'## 🎯 Comprehensive Exam Overview & Solved Examples\n\n> **How to use this guide:** To master the exam, you must be comfortable with the following core problem types. Review these step-by-step solutions carefully.\n\n---\n\n### 📌 Topic 1: LTI Systems & Convolution\n**Potential Question:** Given an LTI system with $h[n] = \\{1, -1, 2\\}$ (origin at first sample) and input $x[n] = \\{2, 1, 3\\}$. Compute the output $y[n]$. Is this system stable? Is it causal?\n\n> **Solution:**\n> 1. **Convolution:** $y[n] = x[n] * h[n]$. Length will be $3+3-1 = 5$.\n>    - $y[0] = x[0]h[0] = 2(1) = 2$\n>    - $y[1] = x[0]h[1] + x[1]h[0] = 2(-1) + 1(1) = -1$\n>    - $y[2] = x[0]h[2] + x[1]h[1] + x[2]h[0] = 2(2) + 1(-1) + 3(1) = 6$\n>    - $y[3] = x[1]h[2] + x[2]h[1] = 1(2) + 3(-1) = -1$\n>    - $y[4] = x[2]h[2] = 3(2) = 6$\n>    **Result:** $y[n] = \\{2, -1, 6, -1, 6\\}$.\n> 2. **Stability:** Check if $\\sum |h[n]| < \\infty$. $|1| + |-1| + |2| = 4 < \\infty$. The system is **stable**.\n> 3. **Causality:** $h[n] = 0$ for $n < 0$. The system is **causal**.',
            content
        )
        content = re.sub(
            r'### Topic 2: Nyquist Theorem & Aliasing\n\*\*Potential Question:\*\* A continuous-time signal \$x\(t\) = \\\\cos\(400\\\\pi t\) \+ \\\\sin\(1000\\\\pi t\)\$ is sampled at \$f_s = 600\$ Hz. What frequencies will be present in the sampled signal\?\n\n\*\*Solution:\*\*\n1. \*\*Identify frequencies:\*\* \$f_1 = 400\\\\pi / 2\\\\pi = 200\$ Hz. \$f_2 = 1000\\\\pi / 2\\\\pi = 500\$ Hz.\n2. \*\*Check Nyquist:\*\* \$f_s/2 = 300\$ Hz.\n3. \*\*Evaluate \$f_1\:\*\* 200 Hz < 300 Hz. It is \*\*not aliased\*\*.\n4. \*\*Evaluate \$f_2\:\*\* 500 Hz > 300 Hz. It will alias. \$f_\{text\{alias\}\} = \|f_2 - k f_s\| = \|500 - 600\| = \|-100\| = 100\$ Hz.\nResult: The reconstructed signal will have frequencies at \*\*100 Hz\*\* and \*\*200 Hz\*\*.',
            r'---\n\n### 📌 Topic 2: Nyquist Theorem & Aliasing\n**Potential Question:** A continuous-time signal $x(t) = \\cos(400\\pi t) + \\sin(1000\\pi t)$ is sampled at $f_s = 600$ Hz. What frequencies will be present in the sampled signal?\n\n> **Solution:**\n> 1. **Identify frequencies:** $f_1 = 400\\pi / 2\\pi = 200$ Hz. $f_2 = 1000\\pi / 2\\pi = 500$ Hz.\n> 2. **Check Nyquist:** $f_s/2 = 300$ Hz.\n> 3. **Evaluate $f_1$:** 200 Hz $< 300$ Hz. It is **not aliased**.\n> 4. **Evaluate $f_2$:** 500 Hz $> 300$ Hz. It will alias. \n>    $$f_{\\text{alias}} = |f_2 - k f_s| = |500 - 600| = |-100| = 100 \\text{ Hz}$$\n> **Result:** The reconstructed signal will have frequencies at **100 Hz** and **200 Hz**.',
            content
        )
        content = re.sub(
            r'### Topic 3: Z-Transform and Frequency Response\n\*\*Potential Question:\*\* A system is defined by \$y\[n\] = 0.5 y\[n-1\] \+ x\[n\] \+ x\[n-1\]\$. Find the transfer function \$H\(z\)\$, its poles/zeros, and determine if it acts as a lowpass or highpass filter.\n\n\*\*Solution:\*\*\n1. \*\*Z-Transform:\*\* \$Y\(z\) = 0.5 z\^\{-1\} Y\(z\) \+ X\(z\) \+ z\^\{-1\} X\(z\)\$\n2. \*\*Transfer Function:\*\* \$H\(z\) = \\\\frac\{Y\(z\)\}\{X\(z\)\} = \\\\frac\{1 \+ z\^\{-1\}\}\{1 - 0.5 z\^\{-1\}\} = \\\\frac\{z \+ 1\}\{z - 0.5\}\$\n3. \*\*Poles/Zeros:\*\* Zero at \$z = -1\$. Pole at \$z = 0.5\$. Since \$|0.5| < 1\$, the system is stable.\n4. \*\*Filter Type:\*\* Evaluate frequency response magnitude at DC \(\$\\\\omega = 0, z=1\$\) and Nyquist \(\$\\\\omega = \\\\pi, z=-1\$\).\n   - \$|H\(e\^\{j0\}\)| = |\\\\frac\{1 \+ 1\}\{1 - 0.5\}| = 4\$\n   - \$|H\(e\^\{j\\\\pi\}\)| = |\\\\frac\{-1 \+ 1\}\{-1 - 0.5\}| = 0\$\n   Result: High gain at DC, zero gain at Nyquist. This is a \*\*lowpass filter\*\*.',
            r'---\n\n### 📌 Topic 3: Z-Transform and Frequency Response\n**Potential Question:** A system is defined by $y[n] = 0.5 y[n-1] + x[n] + x[n-1]$. Find the transfer function $H(z)$, its poles/zeros, and determine if it acts as a lowpass or highpass filter.\n\n> **Solution:**\n> 1. **Z-Transform:** $Y(z) = 0.5 z^{-1} Y(z) + X(z) + z^{-1} X(z)$\n> 2. **Transfer Function:** $H(z) = \\frac{Y(z)}{X(z)} = \\frac{1 + z^{-1}}{1 - 0.5 z^{-1}} = \\frac{z + 1}{z - 0.5}$\n> 3. **Poles/Zeros:** Zero at $z = -1$. Pole at $z = 0.5$. Since $|0.5| < 1$, the system is stable.\n> 4. **Filter Type:** Evaluate frequency response magnitude at DC ($\\omega = 0, z=1$) and Nyquist ($\\omega = \\pi, z=-1$).\n>    - $|H(e^{j0})| = |\\frac{1 + 1}{1 - 0.5}| = 4$\n>    - $|H(e^{j\\pi})| = |\\frac{-1 + 1}{-1 - 0.5}| = 0$\n>    **Result:** High gain at DC, zero gain at Nyquist. This is a **lowpass filter**.',
            content
        )
        content = re.sub(
            r'### Topic 4: Filter Design \(Bilinear Transform\)\n\*\*Potential Question:\*\* Given an analog lowpass filter \$H\(s\) = \\\\frac\{1\}\{s\+1\}\$, use the bilinear transform to design a digital filter \$H\(z\)\$ assuming a sampling period \$T_s = 2\$.\n\n\*\*Solution:\*\*\n1. \*\*Bilinear Substitution:\*\* \$s = \\\\frac\{2\}\{T_s\} \\\\frac\{1-z\^\{-1\}\}\{1\+z\^\{-1\}\}\$. Since \$T_s = 2\$, \$s = \\\\frac\{1-z\^\{-1\}\}\{1\+z\^\{-1\}\}\$.\n2. \*\*Substitute into H\(s\):\*\*\n   \$\\\$H\(z\) = \\\\frac\{1\}\{\\\\frac\{1-z\^\{-1\}\}\{1\+z\^\{-1\}\} \+ 1\} = \\\\frac\{1\}\{\\\\frac\{\(1-z\^\{-1\}\) \+ \(1\+z\^\{-1\}\)\}\{1\+z\^\{-1\}\}\}\$\$\n   \$\\\$H\(z\) = \\\\frac\{1\+z\^\{-1\}\}\{2\} = 0.5 \+ 0.5z\^\{-1\}\$\$\n   Result: The digital filter is \$y\[n\] = 0.5x\[n\] \+ 0.5x\[n-1\]\$ \(a simple moving average!\).',
            r'---\n\n### 📌 Topic 4: Filter Design (Bilinear Transform)\n**Potential Question:** Given an analog lowpass filter $H(s) = \\frac{1}{s+1}$, use the bilinear transform to design a digital filter $H(z)$ assuming a sampling period $T_s = 2$.\n\n> **Solution:**\n> 1. **Bilinear Substitution:** $s = \\frac{2}{T_s} \\frac{1-z^{-1}}{1+z^{-1}}$. Since $T_s = 2$, $s = \\frac{1-z^{-1}}{1+z^{-1}}$.\n> 2. **Substitute into H(s):**\n>    $$H(z) = \\frac{1}{\\frac{1-z^{-1}}{1+z^{-1}} + 1} = \\frac{1}{\\frac{(1-z^{-1}) + (1+z^{-1})}{1+z^{-1}}}$$\n>    $$H(z) = \\frac{1+z^{-1}}{2} = 0.5 + 0.5z^{-1}$$\n>    **Result:** The digital filter is $y[n] = 0.5x[n] + 0.5x[n-1]$ (a simple moving average!).',
            content
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = '/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content'
process_file(f'{base_dir}/weeks1to5.ts')
process_file(f'{base_dir}/weeks6to9.ts')
process_file(f'{base_dir}/weeks10to13.ts')
