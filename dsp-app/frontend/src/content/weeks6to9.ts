import type { WeekContent } from './weeks1to5';

export const weeks6to9: WeekContent[] = [
  // ═══════════════════════════════════════════════════
  // WEEK 6: Sampling & Reconstruction
  // ═══════════════════════════════════════════════════
  {
    id: 6,
    title: 'Sampling & Reconstruction',
    bigPicture: `## Bridging Continuous and Discrete

This is arguably the most important week conceptually — it answers the question: **when can we perfectly recover a continuous signal from its samples?**

The answer is the **Nyquist-Shannon Sampling Theorem**: if you sample at rate $f_s \\geq 2 f_{\\max}$, you can perfectly reconstruct. Sample too slowly, and frequencies **alias** — they disguise themselves as lower frequencies, and there's no way to undo it.

> **Connection to previous weeks**: The Z-transform (Week 5) assumes we already have a discrete signal. This week explains HOW we got that discrete signal from the real world, and what can go wrong.`,

    concepts: [
      {
        name: 'Sampling Theorem (Nyquist Rate)',
        explanation: `### The Fundamental Limit

A continuous signal $x(t)$ with maximum frequency $f_{\\max}$ can be perfectly reconstructed from its samples $x[n] = x(nT_s)$ **if and only if**:

$$f_s = \\frac{1}{T_s} \\geq 2 f_{\\max}$$

The minimum rate $f_N = 2f_{\\max}$ is called the **Nyquist rate**.

**Intuition**: To capture a wave, you need at least 2 samples per cycle — one for the peak, one for the trough. Any fewer and you can't tell what frequency it was.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

f_signal = 5  # 5 Hz signal
t_cont = np.linspace(0, 1, 1000)
x_cont = np.sin(2 * np.pi * f_signal * t_cont)

fig, axes = plt.subplots(3, 1, figsize=(10, 7))

for i, fs in enumerate([40, 10, 6]):  # Over, Nyquist, Under
    n = np.arange(0, 1, 1/fs)
    x_sampled = np.sin(2 * np.pi * f_signal * n)
    axes[i].plot(t_cont, x_cont, 'b-', alpha=0.3, label='Original')
    axes[i].stem(n, x_sampled, linefmt='r-', markerfmt='ro', basefmt='k-')
    axes[i].set_title(f'fs = {fs} Hz ({"OK" if fs >= 2*f_signal else "ALIASING!"})')
    axes[i].legend()
plt.tight_layout()
plt.show()
\`\`\``
      },
      {
        name: 'Aliasing',
        explanation: `### When Sampling Goes Wrong

If $f_s < 2f_{\\max}$, frequencies above $f_s/2$ **fold back** into the range $[0, f_s/2]$. A frequency $f$ appears as:

$$f_{\\text{alias}} = |f - k \\cdot f_s| \\quad \\text{for integer } k \\text{ giving the smallest result}$$

**Example**: A 900 Hz tone sampled at 1000 Hz appears as a 100 Hz tone!

This is exactly what makes helicopter blades appear to spin slowly (or backwards) in video — the frame rate is too low.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# 900 Hz tone sampled at 1000 Hz
fs = 1000
f_true = 900
t_cont = np.linspace(0, 0.01, 10000)
x_cont = np.sin(2 * np.pi * f_true * t_cont)

n = np.arange(0, 0.01, 1/fs)
x_sampled = np.sin(2 * np.pi * f_true * n)

# The alias: 1000 - 900 = 100 Hz
f_alias = fs - f_true
x_alias = np.sin(2 * np.pi * f_alias * t_cont)

plt.figure(figsize=(10, 4))
plt.plot(t_cont*1000, x_cont, 'b-', alpha=0.3, label=f'{f_true} Hz (true)')
plt.plot(t_cont*1000, x_alias, 'g--', label=f'{f_alias} Hz (alias)')
plt.stem(n*1000, x_sampled, linefmt='r-', markerfmt='ro', basefmt=' ')
plt.xlabel('Time (ms)')
plt.title(f'{f_true} Hz sampled at {fs} Hz looks like {f_alias} Hz')
plt.legend()
plt.show()
\`\`\``
      },
      {
        name: 'Anti-Aliasing & Reconstruction',
        explanation: `### Preventing and Undoing Sampling

**Anti-aliasing filter**: Before sampling, apply a **lowpass filter** that removes all frequencies above $f_s/2$. This prevents aliasing.

**Reconstruction**: To convert samples back to a continuous signal, use **sinc interpolation**:

$$x(t) = \\sum_{n=-\\infty}^{\\infty} x[n] \\cdot \\text{sinc}\\left(\\frac{t - nT_s}{T_s}\\right)$$

Each sample generates a sinc function, and they all add up to perfectly reconstruct the original signal (if Nyquist was satisfied).

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Sinc interpolation reconstruction
fs = 10  # sampling rate
f_signal = 3  # signal frequency (below Nyquist)

n = np.arange(0, 1, 1/fs)
x_samples = np.sin(2 * np.pi * f_signal * n)

# Reconstruct using sinc interpolation
t_recon = np.linspace(0, 1, 1000)
x_recon = np.zeros_like(t_recon)

for i, sample in enumerate(x_samples):
    x_recon += sample * np.sinc((t_recon - i/fs) * fs)

x_true = np.sin(2 * np.pi * f_signal * t_recon)

plt.figure(figsize=(10, 4))
plt.plot(t_recon, x_true, 'b-', alpha=0.3, label='True signal')
plt.plot(t_recon, x_recon, 'g-', label='Reconstructed (sinc)')
plt.stem(n, x_samples, linefmt='r-', markerfmt='ro', basefmt=' ')
plt.title('Sinc Interpolation Reconstruction')
plt.legend()
plt.show()
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 6 Solutions

### 📌 Problem 1: Purpose of Zero Padding and its Effect on Frequency Resolution
Zero padding is the process of appending a sequence of zeros to the end of a time-domain signal before computing its Fast Fourier Transform (FFT).
- **Purpose**:
  1. **Interpolation in the Frequency Domain**: By increasing the total length of the sequence $N$ without adding new information, zero padding effectively interpolates the resulting spectrum. This provides a smoother and more detailed representation of the continuous-time Fourier Transform.
  2. **Radix-2 Efficiency**: It allows us to extend an arbitrary-length signal to a length that is a power of 2 ($2^m$), which is necessary to use the highly optimized Radix-2 FFT algorithms.
- **Effect on Frequency Resolution**:
  Zero padding **does not** increase the fundamental frequency resolution. The true resolution (the ability to distinguish between two closely spaced frequency components) depends entirely on the total observation time of the original signal ($T_{obs}$). However, zero padding decreases the frequency bin spacing ($\\Delta f = \\frac{f_s}{N_{pad}}$), which increases the *visual resolution* or *display resolution* by providing more finely spaced samples of the spectrum.

### 📌 Problem 2: Changes Observed in the FFT Output with Zero Padding
When zero padding is applied to a signal:
1. **Denser Frequency Bins**: The total number of points in the FFT output increases proportionally to the pad size, resulting in more frequency bins.
2. **Smoother Spectrum Shape**: The discrete spectral lines blend into a smoother curve (a sinc-like envelope) due to interpolation, allowing for better visualization of the signal's spectral envelope.
3. **Amplitude Scaling**: Depending on the FFT normalization used by the software library, the peak amplitude might require rescaling since the energy is now spread across a larger $N_{pad}$.
4. **No New True Peaks**: While the spectrum is visually smoother, no fundamentally new spectral features (like separating two previously merged peaks) will appear because the original signal information remains unchanged.

### 📌 Problem 3: Demonstrating the Effect of Zero Padding
Below is a runnable Python code that demonstrates the visual differences between an unpadded and a zero-padded FFT.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# 1. Generate the original signal
fs = 100  # Sampling frequency
t = np.arange(0, 1, 1/fs)  # 1 second duration
f1 = 5.5  # Signal frequency (not exactly on a bin)
x = np.sin(2 * np.pi * f1 * t)

# 2. Original FFT
X = np.fft.fft(x)
f = np.fft.fftfreq(len(x), 1/fs)

# 3. Zero-padded FFT
pad_factor = 8
N_pad = len(x) * pad_factor
x_padded = np.pad(x, (0, N_pad - len(x)), 'constant')
X_padded = np.fft.fft(x_padded)
f_padded = np.fft.fftfreq(N_pad, 1/fs)

# 4. Plotting
plt.figure(figsize=(10, 5))
# Plot only positive frequencies
plt.plot(f_padded[:N_pad//2], np.abs(X_padded[:N_pad//2]) / len(x), 
         label=f'Zero-Padded (N={N_pad})', color='blue')
plt.stem(f[:len(x)//2], np.abs(X[:len(x)//2]) / len(x), 
         label=f'Original (N={len(x)})', basefmt=" ", linefmt='red', markerfmt='ro')

plt.title('Effect of Zero Padding on FFT')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Normalized Magnitude')
plt.xlim(0, 15)
plt.legend()
plt.grid(True)
plt.show()
\`\`\`

### 📌 Problem 4: Practical Discrete Convolution Bounds and Complexity
**Given definition:**
$$ z[n] = \\sum_{k=-\\infty}^{\\infty} x[k]y[n-k] $$
For practical sequences, $x[k]$ is non-zero only for $0 \\le k \\le p-1$, and $y[m]$ is non-zero only for $0 \\le m \\le q-1$.

**Proof of summation limits:**
Let $m = n-k$. The condition for $y[n-k]$ to be non-zero is:
$$ 0 \\le n-k \\le q-1 $$
Rearranging this inequality for $k$:
1. $n - k \\ge 0 \\implies k \\le n$
2. $n - k \\le q - 1 \\implies k \\ge n - (q - 1)$

We also know that $x[k]$ is non-zero only when:
$$ 0 \\le k \\le p-1 $$

To find the overlapping region where both $x[k]$ and $y[n-k]$ are non-zero, we must intersect these bounds on $k$:
- Lower bound for $k$: must be at least $0$ and at least $n - (q - 1)$. Thus, $k_{min} = \\max(0, n - (q - 1))$.
- Upper bound for $k$: must be at most $p - 1$ and at most $n$. Thus, $k_{max} = \\min(p - 1, n)$.

Substituting these limits into the convolution sum yields:
$$ z[n] = \\sum_{k=\\max(0, n-(q-1))}^{\\min(p-1, n)} x[k]y[n-k] $$

**Proof of valid $n$ range:**
For the summation to be valid, the lower bound must not exceed the upper bound ($k_{min} \\le k_{max}$).
- The smallest possible value for $n$ occurs when the minimum indices intersect: $k=0$ and $m=0 \\implies n=0$.
- The largest possible value for $n$ occurs when the maximum indices intersect: $k=p-1$ and $m=q-1 \\implies n = (p-1) + (q-1) = p+q-2$.
Thus, $z[n]$ is computed for $n = 0, 1, \\dots, p+q-2$.

#### (a) Show that the number of multiplications is $p \\times q$
Every element of the non-zero sequence $x$ (which contains $p$ elements) is multiplied by every element of the non-zero sequence $y$ (which contains $q$ elements) exactly once across the entire computation of $z[n]$ for all valid $n$. 
Mathematically, the total number of non-zero product pairs $(x[k], y[m])$ is simply the size of the Cartesian product of the domains of $x$ and $y$.
$$ \\text{Total Multiplications} = p \\cdot q $$

#### (b) Determine the number of additions
Let $M_n$ be the number of multiplications (terms in the summation) required to compute a specific $z[n]$. To sum $M_n$ terms, we require $M_n - 1$ additions.
The total number of additions $A$ across all $z[n]$ is the sum of additions required for each $n$:
$$ A = \\sum_{n=0}^{p+q-2} (M_n - 1) $$
We can split this summation:
$$ A = \\sum_{n=0}^{p+q-2} M_n - \\sum_{n=0}^{p+q-2} 1 $$
We know that the sum of all multiplications across all $n$ is exactly $p \\cdot q$ (from part a).
The sum of $1$ from $n=0$ to $p+q-2$ is simply the length of the sequence $z[n]$, which is $p+q-1$.
Thus, the total number of additions is:
$$ A = p \\cdot q - (p + q - 1) $$

### 📌 Problem 5: Fourier Transforms of Windows and Spectral Leakage

**1. Rectangular Window**
$$ w_{rect}[n] = 1 \\quad \\text{for } 0 \\le n \\le N-1 $$
Using the geometric series sum formula, the Discrete-Time Fourier Transform is:
$$ W_{rect}(\\omega) = \\sum_{n=0}^{N-1} e^{-j\\omega n} = \\frac{1 - e^{-j\\omega N}}{1 - e^{-j\\omega}} = e^{-j\\omega \\frac{N-1}{2}} \\frac{\\sin(\\frac{\\omega N}{2})}{\\sin(\\frac{\\omega}{2})} $$

**2. Triangular (Bartlett) Window**
This can be modeled mathematically as the convolution of two rectangular windows of length $N/2$. In the frequency domain, convolution corresponds to multiplication (squaring).
$$ W_{tri}(\\omega) = \\frac{2}{N} e^{-j\\omega \\frac{N-1}{2}} \\left( \\frac{\\sin(\\frac{\\omega N}{4})}{\\sin(\\frac{\\omega}{2})} \\right)^2 $$

**3. Hann Window**
$$ w_{Hann}[n] = 0.5 - 0.5\\cos\\left(\\frac{2\\pi n}{N-1}\\right) $$
Using Euler's formula, the cosine splits into two shifted impulses in the frequency domain. Applying linearity and frequency shifting properties:
$$ W_{Hann}(\\omega) = 0.5 W_{rect}(\\omega) - 0.25 W_{rect}\\left(\\omega - \\frac{2\\pi}{N-1}\\right) - 0.25 W_{rect}\\left(\\omega + \\frac{2\\pi}{N-1}\\right) $$

**Reproducing Spectral Leakage Images**
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

N = 64
n = np.arange(N)

# Define windows
w_rect = np.ones(N)
w_tri = np.bartlett(N)
w_hann = np.hanning(N)

# Compute FFT with heavy zero padding for smooth curves
N_pad = 2048
W_rect = np.fft.fftshift(np.fft.fft(w_rect, N_pad))
W_tri = np.fft.fftshift(np.fft.fft(w_tri, N_pad))
W_hann = np.fft.fftshift(np.fft.fft(w_hann, N_pad))

# Normalize and convert to dB
def to_db(W):
    mag = np.abs(W)
    mag /= np.max(mag)  # Normalize to 0 dB peak
    mag = np.maximum(mag, 1e-10) # Avoid log of zero
    return 20 * np.log10(mag)

# Frequency axis normalized
omega = np.linspace(-np.pi, np.pi, N_pad)

plt.figure(figsize=(10, 6))
plt.plot(omega, to_db(W_rect), label='Rectangular')
plt.plot(omega, to_db(W_tri), label='Triangle (Bartlett)')
plt.plot(omega, to_db(W_hann), label='Hann')
plt.title('Window Frequency Responses (Spectral Leakage)')
plt.xlabel('Normalized Frequency (radians/sample)')
plt.ylabel('Magnitude (dB)')
plt.ylim(-80, 5)
plt.xlim(-np.pi/2, np.pi/2)
plt.legend()
plt.grid(True)
plt.show()
\`\`\`

### 📌 Problem 6: Demonstrating the Effect of Leakage and Scalloping
- **Spectral Leakage** occurs when a signal's frequency does not align perfectly with an FFT frequency bin (meaning an incomplete number of cycles fits within the observation window). The signal's energy "leaks" into adjacent bins.
- **Scalloping Loss** is the reduction in the measured peak amplitude that occurs because the true frequency falls between discrete FFT bins.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

fs = 100
N = 100
t = np.arange(N) / fs

# f1 is exactly on a bin (f1 = 10 Hz) -> integer number of cycles
f1 = 10.0
# f2 is directly between two bins (f2 = 10.5 Hz) -> worst case leakage/scalloping
f2 = 10.5

x1 = np.cos(2 * np.pi * f1 * t)
x2 = np.cos(2 * np.pi * f2 * t)

X1 = np.abs(np.fft.fft(x1))[:N//2] / (N/2)
X2 = np.abs(np.fft.fft(x2))[:N//2] / (N/2)
f = np.fft.fftfreq(N, 1/fs)[:N//2]

plt.figure(figsize=(10, 5))
plt.stem(f, X1, linefmt='b-', markerfmt='bo', basefmt=' ', label=f'Integer cycles ({f1} Hz)')
plt.stem(f, X2, linefmt='r-', markerfmt='ro', basefmt=' ', label=f'Non-integer cycles ({f2} Hz)')

# Highlighting Scalloping
plt.axhline(1.0, color='b', linestyle='--', alpha=0.3)
plt.axhline(np.max(X2), color='r', linestyle='--', alpha=0.3)
plt.annotate('Scalloping Loss', xy=(f2, np.max(X2)), xytext=(f2+2, 0.8),
             arrowprops=dict(facecolor='black', shrink=0.05))

plt.title('Demonstration of Spectral Leakage and Scalloping')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Amplitude')
plt.xlim(5, 15)
plt.legend()
plt.grid(True)
plt.show()
\`\`\`

### 📌 Problem 7: Confirming Numerically the Properties of Different Windows
This script numerically extracts the main lobe width (in bins) and highest sidelobe level (in dB) directly from the discrete signal data.

\`\`\`python
import numpy as np
import scipy.signal as sig

def analyze_window(window_func, N=128, N_pad=8192):
    # Generate window
    w = window_func(N)
    
    # High resolution FFT for accurate parameter extraction
    W = np.abs(np.fft.fft(w, N_pad))
    W /= np.max(W) # Normalize
    W_db = 20 * np.log10(np.maximum(W, 1e-10))
    
    # Shift to center
    W_db_shifted = np.fft.fftshift(W_db)
    
    # Find peaks to locate side lobes
    peaks, _ = sig.find_peaks(W_db_shifted)
    
    # Center bin index
    center = N_pad // 2
    
    # Find main lobe width (traverse out until derivative changes sign)
    idx = center
    while idx < N_pad - 1 and W_db_shifted[idx] > W_db_shifted[idx+1]:
        idx += 1
    
    # Calculate width in standard units of (bins of original N)
    main_lobe_width_bins = 2 * (idx - center) / (N_pad / N)
    
    # Find the highest side lobe level
    # Filter out the main peak based on our calculated lobe width
    sidelobe_peaks = [p for p in peaks if p < center - (idx-center) or p > center + (idx-center)]
    if len(sidelobe_peaks) > 0:
        max_sidelobe_db = np.max(W_db_shifted[sidelobe_peaks])
    else:
        max_sidelobe_db = -np.inf
        
    return main_lobe_width_bins, max_sidelobe_db

# Windows to test
windows = {
    'Rectangular': np.ones,
    'Triangle': np.bartlett,
    'Hann': np.hanning,
    'Hamming': np.hamming,
    'Blackman': np.blackman
}

print("Window Properties:")
print(f"{'Window Type':<15} | {'Main Lobe Width (bins)':<25} | {'Max Sidelobe Level (dB)'}")
print("-" * 65)
for name, func in windows.items():
    width, sidelobe = analyze_window(func)
    print(f"{name:<15} | {width:<25.2f} | {sidelobe:.2f} dB")
\`\`\`

---

## 🔬 Lab 06 Walkthrough: FFT Implementation and Analysis

This section documents and walks through the provided code snippets from Lab 06, explaining the core digital signal processing concepts implemented within.

### 1. Radix-2 Decimation-In-Time Fast Fourier Transform (DIT-FFT)
The first snippet builds a custom, recursive Radix-2 FFT algorithm from scratch using NumPy.

\`\`\`python
from numpy import *
from numpy.fft import fft, ifft, fftfreq, fftshift
from matplotlib.pyplot import *

def ditfft2(x):
    N = len(x)
    if N == 1: 
        return x
    else:
        # Recursively split the array into even and odd indices
        even = ditfft2(x[::2])
        # Compute twiddle factors and multiply by the odd half
        odd = exp(-2*pi*1j/N*arange(N/2)) * ditfft2(x[1::2])
        # Combine using the FFT butterfly structure
        return hstack([even + odd, even - odd])

x = arange(16)
# Testing the recursive FFT implementation
# X_custom = ditfft2(x)
\`\`\`
**Walkthrough:** 
This is a pure mathematical manifestation of the Cooley-Tukey algorithm. 
- The condition \`N == 1\` acts as the base case, preventing infinite recursion. 
- If the array has more than 1 element, it decimates the sequence in time into \`even\` and \`odd\` indexed components. 
- The \`odd\` components are multiplied by twiddle factors (\`exp(...)\`).
- Finally, they are merged via the standard hardware "butterfly" operations: \`even + odd\` and \`even - odd\`. This reduces computational complexity from $O(N^2)$ to $O(N \\log N)$.

### 2. Time-Domain Signal Generation and Zero Padding
This snippet constructs a continuous-time rectangular pulse and explores zero-padding it to increase frequency resolution visualization.

\`\`\`python
N = 128
tmax = 2
T = 2 * tmax / N
tm = 0.5
t = arange(-tmax, tmax, T)
x = zeros(N)
# Construct a rectangular pulse of width 2*tm
x[abs(t) <= tm] = 1

# FFT of the unpadded pulse
X = T * fft(fftshift(x))

# Zero Padding the signal
Npad = 512
# Pad symmetrically on both sides to maintain phase alignment
xp = pad(x, ((Npad - N)//2, (Npad - N)//2))
tpmax = tmax * Npad // N
\`\`\`
**Walkthrough:** 
A rectangular pulse \`x\` is defined in the time domain between $-t_{max}$ and $t_{max}$. Taking the \`fft\` of this produces a sinc function in the frequency domain. Notice the use of \`fftshift(x)\`; this is crucial to center the pulse properly around the $t=0$ index before passing it to the FFT to avoid rapid phase wraps. 
By expanding the array length from \`N=128\` to \`Npad=512\` using \`pad()\`, we append $0$s to both ends of the time-domain signal. This results in a higher density of samples in the frequency domain, interpolating the discrete spectrum and plotting a visually smoother sinc envelope.

### 3. Demonstrating Spectral Leakage and Scalloping
The final snippet provides a function to easily visualize how an FFT handles frequencies that do not map perfectly to the discrete bins.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

fs = 1000
N = 1000
n = np.arange(N)

def show_fft(f0):
    """
    Plots the FFT of a cosine wave with frequency f0.
    """
    x = np.cos(2 * np.pi * f0 * n / fs)
    X = np.fft.fft(x)
    f = np.fft.fftfreq(N, 1/fs)
    
    plt.figure(figsize=(12, 4))
    plt.plot(f[:N//2], np.abs(X[:N//2]))
    plt.title(f"f0 = {f0} Hz")
    plt.xlim([f0 - 10, f0 + 10])
    plt.grid()
    plt.show()

# Example Usage (Students run this in the lab):
# show_fft(10)   # No leakage, exact integer bin
# show_fft(10.5) # Maximum scalloping and leakage
\`\`\`
**Walkthrough:** 
With a sampling frequency $f_s = 1000$ and $N = 1000$ samples, the frequency resolution (bin spacing) is exactly $\\Delta f = 1 \\text{ Hz}$. 
- If you call \`show_fft(10)\`, the input is exactly 10 Hz. This matches an FFT bin perfectly, meaning there are an integer number of cycles in the observation window. The plot will show a single, perfect vertical spike with zero spectral leakage.
- If you call \`show_fft(10.5)\`, the frequency falls exactly between the 10 Hz and 11 Hz bins. Because an incomplete cycle ends the window abruptly, the signal's energy "leaks" out over all surrounding bins (Spectral Leakage), and the true peak amplitude is severely attenuated (Scalloping Loss). This hands-on function vividly demonstrates why applying window functions (like Hann or Blackman) is a fundamental prerequisite in practical signal processing.


### 🧠 Knowledge Check

\`\`\`quiz
question: According to the Nyquist-Shannon Sampling Theorem, what is the absolute minimum sampling frequency (fs) required to exactly reconstruct a baseband signal with a maximum frequency of f_max?
a: fs = f_max
b: fs = 2 * f_max (The Nyquist Rate)
c: fs = 4 * f_max
answer: b
\`\`\`
\`\`\`quiz
question: What is aliasing in the context of signal sampling?
a: The loss of high-frequency energy due to low-pass filtering.
b: High-frequency components folding back and impersonating lower frequencies because the sampling rate was too low.
c: The quantization noise introduced by analog-to-digital converters.
answer: b
\`\`\`
\`\`\`quiz
question: What is the primary purpose of an anti-aliasing filter placed before an Analog-to-Digital Converter (ADC)?
a: To eliminate all background noise in the signal.
b: To amplify the highest frequencies of the signal for better resolution.
c: To strictly limit the bandwidth of the continuous signal to less than half the sampling rate.
answer: c
\`\`\`
`,
    labWalkthrough: `

`,

    keyFormulas: `## Week 6 Key Formulas

| Formula | Description |
|---------|-------------|
| $f_s \\geq 2 f_{\\max}$ | Nyquist sampling theorem |
| $f_{\\text{alias}} = \\|f - k \\cdot f_s\\|$ | Aliased frequency |
| $x(t) = \\sum_n x[n] \\cdot \\text{sinc}\\left(\\frac{t-nT_s}{T_s}\\right)$ | Sinc interpolation |
| $f_s/2$ | Nyquist frequency (max representable) |`,
  },

  // ═══════════════════════════════════════════════════
  // WEEK 7: Discrete Fourier Transform (DFT)
  // ═══════════════════════════════════════════════════
  {
    id: 7,
    title: 'Discrete Fourier Transform (DFT)',
    bigPicture: `## The Computable Fourier Transform

The DTFT (Week 4) gives a **continuous** spectrum — great for theory but impossible to compute exactly on a computer. The **DFT** samples the DTFT at $N$ equally-spaced frequencies, giving us something we can actually compute:

$$X[k] = \\sum_{n=0}^{N-1} x[n] \\, e^{-j 2\\pi kn/N}, \\quad k = 0, 1, \\ldots, N-1$$

The DFT takes $N$ time samples in, $N$ frequency samples out. It's the foundation of all practical spectral analysis.

> **Key insight**: The DFT implicitly treats the signal as **periodic** with period $N$. This has consequences — convolution via DFT is **circular**, not linear!`,

    concepts: [
      {
        name: 'DFT Definition & Computation',
        explanation: `### The Transform Pair

**Forward DFT**:
$$X[k] = \\sum_{n=0}^{N-1} x[n] \\, W_N^{kn}, \\quad W_N = e^{-j2\\pi/N}$$

**Inverse DFT**:
$$x[n] = \\frac{1}{N} \\sum_{k=0}^{N-1} X[k] \\, W_N^{-kn}$$

$W_N^{kn}$ are the **twiddle factors** — complex exponentials equally spaced around the unit circle.

\`\`\`python
import numpy as np

def my_dft(x):
    """Direct DFT computation (O(N^2))."""
    N = len(x)
    X = np.zeros(N, dtype=complex)
    for k in range(N):
        for n in range(N):
            X[k] += x[n] * np.exp(-2j * np.pi * k * n / N)
    return X

# Test
x = np.array([1, 2, 3, 4])
X_mine = my_dft(x)
X_numpy = np.fft.fft(x)
print(f"My DFT:    {np.round(X_mine, 4)}")
print(f"NumPy FFT: {np.round(X_numpy, 4)}")
print(f"Match: {np.allclose(X_mine, X_numpy)}")
\`\`\``
      },
      {
        name: 'Circular vs Linear Convolution',
        explanation: `### The DFT's Big Gotcha

Multiplying DFTs gives **circular** convolution, not linear:

$$\\text{IDFT}\\{X[k] \\cdot H[k]\\} = x[n] \\circledast h[n]$$

Circular convolution wraps around — the tail folds over to the beginning. To get **linear** convolution via DFT:

1. **Zero-pad** both signals to length $\\geq N + M - 1$
2. Take DFTs
3. Multiply
4. Take IDFT

\`\`\`python
import numpy as np

x = np.array([1, 2, 3, 4, 5])
h = np.array([1, 1, 1])
N = len(x) + len(h) - 1  # length for linear convolution

# Linear convolution via DFT (with zero-padding)
X = np.fft.fft(x, N)
H = np.fft.fft(h, N)
y_dft = np.real(np.fft.ifft(X * H))

# Direct linear convolution
y_direct = np.convolve(x, h)

print(f"DFT method:  {np.round(y_dft, 4)}")
print(f"Direct:      {y_direct}")
print(f"Match: {np.allclose(y_dft, y_direct)}")
\`\`\``
      },
      {
        name: 'Spectral Leakage & Windowing',
        explanation: `### Why the Spectrum Looks Wrong

When you DFT a signal that doesn't have an integer number of periods in your window, the spectrum **leaks** — energy spreads to neighboring frequencies.

**The fix**: Apply a **window function** before the DFT to taper the signal edges to zero:

| Window | Main lobe width | Sidelobe level | Use for |
|--------|----------------|----------------|---------|
| Rectangular | Narrowest | Highest (-13 dB) | Frequency resolution |
| Hamming | Medium | Low (-43 dB) | General purpose |
| Blackman | Widest | Very low (-58 dB) | Dynamic range |

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

N = 256
fs = 1000
f1 = 100  # exact bin
f2 = 102  # close by — will leak

n = np.arange(N)
x = np.sin(2*np.pi*f1*n/fs) + 0.5*np.sin(2*np.pi*f2*n/fs)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))
for ax, win_name, win in [(ax1, 'Rectangular', np.ones(N)),
                           (ax2, 'Hamming', np.hamming(N))]:
    X = np.fft.fft(x * win, 4*N)  # zero-pad for smooth plot
    f = np.fft.fftfreq(4*N, 1/fs)
    ax.plot(f[:2*N], 20*np.log10(np.abs(X[:2*N])/N + 1e-10))
    ax.set_xlim(50, 150)
    ax.set_title(f'{win_name} window')
    ax.set_ylabel('Magnitude (dB)')
ax2.set_xlabel('Frequency (Hz)')
plt.tight_layout()
plt.show()
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 7 Solutions

### 📌 Problem 1: Parseval's Theorem using FFT
Parseval's theorem states that the total energy computed in the time domain is equal to the total energy computed in the frequency domain. Mathematically:
$$ \\sum_{n=0}^{N-1} |x[n]|^2 = \\frac{1}{N} \\sum_{k=0}^{N-1} |X[k]|^2 $$

**Demonstration via Python:**
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Define signal parameters
fs = 1000  # Sampling frequency
t = np.arange(0, 1, 1/fs)
# Generate a test signal (sine wave + noise)
x = np.sin(2 * np.pi * 50 * t) + 0.5 * np.random.randn(len(t))

def check_parseval(signal):
    N = len(signal)
    
    # 1. Time domain energy
    E_time = np.sum(np.abs(signal)**2)
    
    # 2. Frequency domain energy via FFT
    X = np.fft.fft(signal)
    E_freq = np.sum(np.abs(X)**2) / N
    
    print(f"Time Domain Energy: {E_time:.4f}")
    print(f"Freq Domain Energy: {E_freq:.4f}")
    print(f"Difference: {abs(E_time - E_freq):.4e}")

print("--- Original Signal ---")
check_parseval(x)

# Applying different parameters (Scaling amplitude)
print("\\n--- Scaled Signal (x2 Amplitude) ---")
x_scaled = 2 * x
check_parseval(x_scaled)
\`\`\`
**Observation on PSD:** By scaling the amplitude by a factor of 2, the total energy increases by a factor of 4. Parseval's theorem holds perfectly regardless of the amplitude scaling or the frequency content, as the equality between domains is a fundamental property of the Discrete Fourier Transform (DFT).

### 📌 Problem 2: The Periodogram
**Definition:** The periodogram is an estimate of the Power Spectral Density (PSD) of a signal, calculated as the squared magnitude of the discrete Fourier transform of the signal sequence, normalized by the number of samples ($N$):
$$ \\hat{P}_{per}(f) = \\frac{1}{N} \\left| \\sum_{n=0}^{N-1} x[n]e^{-j 2 \\pi f n} \\right|^2 $$
**Why is it a poor estimator?** The periodogram is an *inconsistent* estimator. As the number of data points $N$ goes to infinity, the variance of the periodogram estimate does not converge to zero. Instead, it remains roughly proportional to the square of the true PSD, meaning it oscillates wildly no matter how much data you collect.

### 📌 Problem 3: Slicing the Signal
**Benefits:**
*   **Averaging:** Slicing allows the signal to be broken into multiple segments, whose individual periodograms can be averaged. This significantly reduces the variance of the spectral estimate.
*   **Time-Frequency Analysis:** Slicing tracks how frequency content changes over time (Short-Time Fourier Transform).

**Side Effects:**
*   **Decreased Resolution:** Shorter segments mean fewer points for the FFT, which broadens the main lobe and decreases frequency resolution.
*   **Spectral Leakage:** Abrupt truncation at the boundaries of the slices introduces high-frequency artifacts, necessitating the use of window functions.

### 📌 Problem 4: Bias–Variance Trade-off in Spectral Estimation
In spectral estimation, you must balance **variance** (noise/fluctuations in the estimate) and **bias** (blurring or smearing of true frequency peaks):
*   To lower **variance**, you slice the signal into smaller segments to generate a larger ensemble of periodograms to average.
*   However, smaller segments worsen frequency resolution, leading to a higher **bias**, causing sharp, narrow spectral peaks to smear together and leak energy. 
You trade frequency resolution (bias) for a smoother, more reliable spectrum (variance).

### 📌 Problem 5: The Welch Method
The Welch method estimates PSD through the following steps:
1.  **Segment:** Divide the signal into overlapping segments.
2.  **Window:** Apply a tapering window (e.g., Hann, Hamming) to each segment to mitigate spectral leakage.
3.  **FFT:** Calculate the periodogram (magnitude-squared FFT) for each windowed segment.
4.  **Average:** Average the periodograms from all segments.
5.  **Normalize:** Scale the result to account for the energy lost due to the window and to convert to proper density units.

### 📌 Problem 6: Stationarity Assumption
Welch's method averages spectral estimates across time segments. If the signal is non-stationary (its frequency content changes over time), averaging will smear these dynamic features together, destroying temporal information and resulting in a spectrum that does not accurately reflect any single point in time.

### 📌 Problem 7: Variance Reduction in Welch
By averaging $K$ (semi-)independent periodogram segments, Welch's method reduces the variance of the PSD estimate by a factor roughly proportional to $K$. This produces a much smoother, more statistically reliable spectrum compared to a single noisy periodogram.

### 📌 Problem 8: What is Lost Using Welch?
**Frequency Resolution.** Because the entire signal of length $N$ is divided into shorter segments of length $L$, the frequency bins become wider ($\\Delta f = F_s / L$ instead of $F_s / N$). You lose the ability to distinguish closely spaced frequency components.

### 📌 Problem 9: Effect of Segment Length
*   **Longer segments:** Improve frequency resolution (less bias) but result in fewer segments to average, increasing variance (noisier spectrum).
*   **Shorter segments:** Degrade frequency resolution (more bias) but provide more segments to average, decreasing variance (smoother spectrum).

### 📌 Problem 10: Averaging Reduces Variance, Not Bias
Averaging relies on the Law of Large Numbers. The expected value (mean) of a sample mean remains the exact same as the expected value of a single sample (the bias does not change). However, the spread or standard deviation of the samples around that mean shrinks as more items are averaged.

### 📌 Problem 11: Purpose of Overlap
Window functions heavily taper the edges of each segment to zero, effectively throwing away data at the boundaries. Overlapping segments (typically 50%) reclaims this "lost" data, yielding more segments to average from the same total signal length, further reducing variance.

### 📌 Problem 12: Windows Before FFT
Windows gently bring the ends of a segment to zero. This mitigates the abrupt discontinuities that would otherwise occur when extracting finite segments, drastically reducing spectral leakage into adjacent frequency bins during the FFT.

### 📌 Problem 13: Detrending
Detrending removes the mean (DC component) or best-fit linear trend from each segment. Without this, a large DC offset or trend acts like a massive zero-frequency spike, whose energy can leak into low-frequency bins and obscure actual low-frequency dynamics.

### 📌 Problem 14: Zero Padding
Zero padding involves appending zeroes to the end of a segment before the FFT. 
*   **What it changes:** It interpolates the frequency domain, creating more frequency bins for a visually smoother curve.
*   **What it DOES NOT change:** It does *not* add information or improve true frequency resolution (the ability to resolve two close frequencies).

### 📌 Problem 15: Segment Length vs. FFT Length
If a segment has 300 samples, an FFT length of **512** (the next power of 2) is typically used. Zero-padding to a power of 2 allows the Fast Fourier Transform (FFT) algorithm (specifically Radix-2) to compute the spectrum with maximum computational efficiency.

### 📌 Problem 16: Order of Operations (Detrend, Window, Zero-Pad)
The correct order is strictly: **1. Detrending $\\rightarrow$ 2. Windowing $\\rightarrow$ 3. Zero-padding.**
They **do not commute**:
*   *Windowing before Detrending:* A window suppresses the boundaries to zero. If you detrend *after*, you might shift the entire segment up or down, ruining the zero-boundaries and causing leakage.
*   *Zero-padding before Detrending/Windowing:* Appended zeros represent "no signal". Detrending across zeroes will corrupt the mean calculation. Applying a window across the zeroes stretches the window shape incorrectly.

### 📌 Problem 17: Sampling Frequency in PSD Scaling
The integral of the PSD across continuous frequency (in Hz) must equal the total physical power of the signal. Scaling by $1/F_s$ normalizes the discrete bins into a density (Power per Hz), ensuring standard physical units irrespective of the sampling rate.

### 📌 Problem 18: One-Sided Spectrum
A one-sided spectrum discards the negative frequencies and doubles the amplitude/power of the positive frequencies (except DC and Nyquist) to conserve total energy. This is a valid measure of energy exclusively for **real-valued signals**, because their Fourier transforms are conjugate symmetric (positive and negative frequencies contain identical, redundant information).

### 📌 Problem 19: \`FFTSlices[:, 1:-1] *= np.sqrt(2)\`
In spectral processing, power is calculated by squaring the magnitude of the FFT slices. This specific line multiplies the positive frequency components (ignoring index 0/DC and the Nyquist limit at -1) by $\\sqrt{2}$. When the magnitude is subsequently squared to calculate power, $(\\sqrt{2})^2 = 2$. This correctly doubles the power of the positive frequencies, efficiently creating a one-sided PSD.

### 📌 Problem 20 & 21: Welch Implementation & Parameter Effects
\`\`\`python
import numpy as np
import scipy.signal as signal
import matplotlib.pyplot as plt

# --- Signal Generation ---
fs = 1000
t = np.arange(0, 5, 1/fs)
# Harmonic signal (50Hz and 120Hz) + noise
x = np.sin(2 * np.pi * 50 * t) + 0.5 * np.sin(2 * np.pi * 120 * t) + np.random.randn(len(t))

# --- Q20: Custom Welch vs Scipy ---
def custom_welch(x, fs, nperseg, noverlap):
    step = nperseg - noverlap
    # 1. Segment
    slices = [x[i:i+nperseg] for i in range(0, len(x) - nperseg + 1, step)]
    
    window = np.hanning(nperseg)
    P_custom = np.zeros(nperseg // 2 + 1)
    
    for sl in slices:
        # 2. Detrend (Mean removal)
        sl_detrend = sl - np.mean(sl)
        # 3. Window
        sl_windowed = sl_detrend * window
        # 4. FFT & Periodogram
        X = np.fft.rfft(sl_windowed)
        P_custom += (np.abs(X) ** 2)
        
    # 5. Average
    P_custom /= len(slices)
    
    # 6. Normalize (Scale for one-sided PSD)
    U = np.sum(window**2)
    P_custom = P_custom / (fs * U)
    P_custom[1:-1] *= 2 # Double positive frequencies
    
    f_custom = np.fft.rfftfreq(nperseg, 1/fs)
    return f_custom, P_custom

f_scipy, p_scipy = signal.welch(x, fs, nperseg=256, noverlap=128, window='hann')
f_custom, p_custom = custom_welch(x, fs, nperseg=256, noverlap=128)

# Verification assertion
assert np.allclose(p_scipy, p_custom)

# --- Q21: Numerical Demonstrations ---
# (a) Segment Size
f_256, p_256 = signal.welch(x, fs, nperseg=256)
f_1024, p_1024 = signal.welch(x, fs, nperseg=1024) # Higher resolution, higher variance

# (b) Overlap
f_0, p_0 = signal.welch(x, fs, nperseg=256, noverlap=0)
f_50, p_50 = signal.welch(x, fs, nperseg=256, noverlap=128) # Smoother due to more segments

# (c) Detrending
x_trend = x + 5 * t # Add artificial linear trend
f_nodt, p_nodt = signal.welch(x_trend, fs, detrend=False) # Massive low frequency leakage
f_dt, p_dt = signal.welch(x_trend, fs, detrend='linear') # Fixed

# (d) Window Type
f_box, p_box = signal.welch(x, fs, nperseg=256, window='boxcar') # High spectral leakage
f_hann, p_hann = signal.welch(x, fs, nperseg=256, window='hann') # Controlled leakage

# (e) Padding
f_nopad, p_nopad = signal.welch(x, fs, nperseg=256, nfft=256)
f_pad, p_pad = signal.welch(x, fs, nperseg=256, nfft=1024) # Interpolated spectrum (more points)
\`\`\`

### 📌 Problem 22-24
*(Skipped as requested: Specific \`eeg.bin\` analysis questions omitted).*

### 📌 Problem 25: Laplace Transform and Kernel
**Definition:** The one-sided Laplace Transform of a function $f(t)$ is defined as:
$$ F(s) = \\int_0^\\infty f(t) e^{-st} dt $$
**Kernel:** The kernel of the transform is $e^{-st}$, where $s = \\sigma + j\\omega$ is a complex frequency parameter.
**Why it is widely used:** It converts complex linear differential equations into simple algebraic equations. Additionally, by including the real dampening term $\\sigma$, it can analyze unstable systems that the Fourier Transform cannot handle.

### 📌 Problem 26: Linearity Property
The Laplace transform is a linear operator, meaning the transform of a linear combination of functions is the linear combination of their transforms:
$$ L[a f(t) + b g(t)] = a L[f(t)] + b L[g(t)] = aF(s) + bG(s) $$
*Example:* $L[3\\cos(t) + 2e^{-t}] = 3L[\\cos(t)] + 2L[e^{-t}] = \\frac{3s}{s^2+1} + \\frac{2}{s+1}$.

### 📌 Problem 27: Proof of Laplace Properties

**(a) $L[1]$**
$$ L[1] = \\int_0^\\infty 1 \\cdot e^{-st} dt = \\left[ -\\frac{1}{s} e^{-st} \\right]_0^\\infty = 0 - \\left(-\\frac{1}{s}\\right) = \\frac{1}{s} $$

**(b) $L[e^{at}]$**
$$ L[e^{at}] = \\int_0^\\infty e^{at} e^{-st} dt = \\int_0^\\infty e^{-(s-a)t} dt = \\left[ -\\frac{1}{s-a} e^{-(s-a)t} \\right]_0^\\infty = \\frac{1}{s-a} $$

**(c) $L[\\cos(at)]$**
Using Euler's formula, $\\cos(at) = \\frac{e^{jat} + e^{-jat}}{2}$. Using linearity:
$$ L[\\cos(at)] = \\frac{1}{2} \\left( L[e^{jat}] + L[e^{-jat}] \\right) = \\frac{1}{2} \\left( \\frac{1}{s-ja} + \\frac{1}{s+ja} \\right) = \\frac{1}{2} \\left( \\frac{s+ja+s-ja}{s^2+a^2} \\right) = \\frac{s}{s^2+a^2} $$

**(d) $L[\\sin(at)]$**
Similarly, $\\sin(at) = \\frac{e^{jat} - e^{-jat}}{2j}$.
$$ L[\\sin(at)] = \\frac{1}{2j} \\left( \\frac{1}{s-ja} - \\frac{1}{s+ja} \\right) = \\frac{1}{2j} \\left( \\frac{s+ja - (s-ja)}{s^2+a^2} \\right) = \\frac{a}{s^2+a^2} $$

**(e) $L[t^p]$**
$$ L[t^p] = \\int_0^\\infty t^p e^{-st} dt $$
Let $u = st$, then $t = \\frac{u}{s}$ and $dt = \\frac{du}{s}$.
$$ L[t^p] = \\int_0^\\infty \\left(\\frac{u}{s}\\right)^p e^{-u} \\frac{du}{s} = \\frac{1}{s^{p+1}} \\int_0^\\infty u^p e^{-u} du = \\frac{\\Gamma(p+1)}{s^{p+1}} $$

**(f) $L[e^{ct} f(t)]$**
$$ L[e^{ct} f(t)] = \\int_0^\\infty \\left[ e^{ct} f(t) \\right] e^{-st} dt = \\int_0^\\infty f(t) e^{-(s-c)t} dt = F(s-c) $$

**(g) $L[f(ct)]$**
$$ L[f(ct)] = \\int_0^\\infty f(ct) e^{-st} dt $$
Let $u = ct$, then $dt = \\frac{du}{c}$.
$$ L[f(ct)] = \\int_0^\\infty f(u) e^{-s(\\frac{u}{c})} \\frac{du}{c} = \\frac{1}{c} \\int_0^\\infty f(u) e^{-(s/c)u} du = \\frac{1}{c} F\\left(\\frac{s}{c}\\right) $$

**(h) $L[\\delta(t-t_0)]$**
Using the sifting property of the Dirac delta function:
$$ L[\\delta(t-t_0)] = \\int_0^\\infty \\delta(t-t_0) e^{-st} dt = e^{-st_0} $$

**(i) $L[H(t-t_0)]$**
Where $H(t)$ is the Heaviside step function:
$$ L[H(t-t_0)] = \\int_0^\\infty H(t-t_0) e^{-st} dt = \\int_{t_0}^\\infty e^{-st} dt = \\left[ -\\frac{1}{s} e^{-st} \\right]_{t_0}^\\infty = \\frac{e^{-st_0}}{s} $$

### 📌 Problem 28: Convolution Theorem
**Theorem:** $L[(f * g)(t)] = F(s)G(s)$.
**Proof:**
$$ L[(f * g)(t)] = \\int_0^\\infty \\left( \\int_0^t f(\\tau) g(t-\\tau) d\\tau \\right) e^{-st} dt $$
Change the order of integration. The region is $0 \\le \\tau \\le t \\le \\infty$, which is equivalent to $0 \\le \\tau \\le \\infty$ and $\\tau \\le t \\le \\infty$.
$$ = \\int_0^\\infty f(\\tau) \\left( \\int_\\tau^\\infty g(t-\\tau) e^{-st} dt \\right) d\\tau $$
Let $u = t - \\tau$, then $dt = du$, and as $t$ goes from $\\tau$ to $\\infty$, $u$ goes from $0$ to $\\infty$.
$$ = \\int_0^\\infty f(\\tau) \\left( \\int_0^\\infty g(u) e^{-s(u+\\tau)} du \\right) d\\tau $$
$$ = \\int_0^\\infty f(\\tau) e^{-s\\tau} d\\tau \\int_0^\\infty g(u) e^{-su} du = F(s)G(s) $$

### 📌 Problem 29: Inverse Laplace Transforms
*(Note: As specific functions (a)-(j) were omitted from the prompt's source text, here are derivations for a standard representative set covering partial fraction decomposition techniques).*

**(a) $F(s) = \\frac{1}{s^2}$**
Direct table lookup.
$f(t) = t$

**(b) $F(s) = \\frac{3}{s-4}$**
Linearity and exponential rule.
$f(t) = 3e^{4t}$

**(c) $F(s) = \\frac{s}{s^2+9}$**
Direct table lookup for cosine, where $\\omega = 3$.
$f(t) = \\cos(3t)$

**(d) $F(s) = \\frac{1}{(s+1)(s+2)}$**
Partial Fraction Decomposition (PFD):
$\\frac{1}{(s+1)(s+2)} = \\frac{A}{s+1} + \\frac{B}{s+2}$
$1 = A(s+2) + B(s+1)$
Set $s = -1 \\implies A = 1$. Set $s = -2 \\implies B = -1$.
$F(s) = \\frac{1}{s+1} - \\frac{1}{s+2} \\implies f(t) = e^{-t} - e^{-2t}$

**(e) $F(s) = \\frac{s+3}{s^2+3s+2}$**
PFD factor denominator: $(s+1)(s+2)$.
$\\frac{s+3}{(s+1)(s+2)} = \\frac{A}{s+1} + \\frac{B}{s+2}$
$s+3 = A(s+2) + B(s+1)$
$s = -1 \\implies A = 2$. $s = -2 \\implies B = -1$.
$F(s) = \\frac{2}{s+1} - \\frac{1}{s+2} \\implies f(t) = 2e^{-t} - e^{-2t}$

**(f) $F(s) = \\frac{1}{s^2+4s+13}$**
Complete the square: $s^2+4s+4+9 = (s+2)^2 + 3^2$.
$F(s) = \\frac{1}{(s+2)^2 + 3^2} = \\frac{1}{3} \\frac{3}{(s+2)^2 + 3^2}$.
Using frequency shift $F(s-c) \\implies e^{ct}f(t)$.
$f(t) = \\frac{1}{3} e^{-2t} \\sin(3t)$

**(g) $F(s) = \\frac{s}{(s^2+1)(s^2+4)}$**
PFD: $\\frac{s}{(s^2+1)(s^2+4)} = \\frac{As+B}{s^2+1} + \\frac{Cs+D}{s^2+4}$.
Substitute $x = s^2$: $\\frac{1}{(x+1)(x+4)} = \\frac{1/3}{x+1} - \\frac{1/3}{x+4}$.
$F(s) = \\frac{1}{3} \\frac{s}{s^2+1} - \\frac{1}{3} \\frac{s}{s^2+4}$
$f(t) = \\frac{1}{3} \\cos(t) - \\frac{1}{3} \\cos(2t)$

**(h) $F(s) = \\frac{e^{-2s}}{s+3}$**
Time-shift property: $L[f(t-t_0)H(t-t_0)] = e^{-st_0}F(s)$.
Here $F_1(s) = \\frac{1}{s+3} \\implies f_1(t) = e^{-3t}$.
$f(t) = e^{-3(t-2)} H(t-2)$

**(i) $F(s) = \\frac{1}{s(s+1)^2}$**
PFD for repeated roots:
$\\frac{1}{s(s+1)^2} = \\frac{A}{s} + \\frac{B}{s+1} + \\frac{C}{(s+1)^2}$
$1 = A(s+1)^2 + Bs(s+1) + Cs$
$s=0 \\implies A=1$. $s=-1 \\implies C=-1$.
Equate $s^2$ coefficients: $0 = A + B \\implies B = -1$.
$F(s) = \\frac{1}{s} - \\frac{1}{s+1} - \\frac{1}{(s+1)^2}$
$f(t) = 1 - e^{-t} - t e^{-t}$

**(j) $F(s) = \\frac{s^2}{(s^2+1)^2}$**
Using the convolution theorem or derivative properties:
$F(s) = s \\cdot \\frac{s}{(s^2+1)^2}$. We know $L[t \\sin t] = \\frac{2s}{(s^2+1)^2}$.
So $\\frac{s}{(s^2+1)^2} = L[\\frac{1}{2} t \\sin t]$.
Multiplying by $s$ is equivalent to taking the derivative in the time domain.
$f(t) = \\frac{d}{dt} \\left( \\frac{1}{2} t \\sin t \\right) = \\frac{1}{2} (\\sin t + t \\cos t)$

---

## 🧪 Lab 07 Walkthrough

In this lab, we build a spectral analysis pipeline from scratch, mirroring the core functionality of \`scipy.signal.welch\`. Let's walk through the implementation.

### 1. Setting Up the Tools
We first import necessary numeric libraries and create a helper to handle window functions.
\`\`\`python
from pylab import *
import numpy as np

def apply_window(x, window_type="hann"):
    """
    Applies a windowing function to mitigate spectral leakage.
    Windowing forces the edges of the slice to zero.
    """
    if window_type == "hann":
        return x * np.hanning(len(x))
    elif window_type == "boxcar":
        return x * np.ones(len(x))
    else:
        raise ValueError("Unsupported window")
\`\`\`

### 2. Spectral Core Logic
This helper performs the mathematical core of the PSD estimate on a single slice. It executes detrending, windowing, and zero-padding in the strict non-commutative order required.
\`\`\`python
def _spectral_helper(segment, fs, window_type, nfft):
    """
    Processes a single time-domain segment into a one-sided PSD estimate.
    """
    # 1. Detrend: Remove mean to prevent DC leakage
    segment_dt = segment - np.mean(segment)
    
    # 2. Window: Apply taper
    windowed = apply_window(segment_dt, window_type)
    
    # 3. FFT: Execute transform (zero padding is handled automatically 
    # if nfft > len(segment))
    X = np.fft.fft(windowed, n=nfft)
    
    # 4. Periodogram: Magnitude squared
    Pxx = np.abs(X) ** 2
    
    # Scale to normalize against window energy loss and sampling rate
    window_energy = np.sum(np.hanning(len(segment))**2)
    Pxx = Pxx / (fs * window_energy)
    
    # Convert to One-Sided Spectrum
    # Extract positive frequencies up to Nyquist
    Pxx_one_sided = Pxx[:nfft//2 + 1].copy()
    
    # Double the power of positive frequencies (excluding DC and Nyquist)
    # This is often done before squaring via \`* np.sqrt(2)\` on the FFT slices
    Pxx_one_sided[1:-1] *= 2 
    
    return Pxx_one_sided
\`\`\`

### 3. Parseval's Theorem Verification
A fundamental test of any spectral system is ensuring energy is conserved between domains.
\`\`\`python
# Parseval theorem checks
# Total energy in time domain
E_time = np.sum(np.abs(x)**2)

# Total energy in frequency domain (Remember the 1/N scaling factor)
X_full = np.fft.fft(x)
N = len(x)
E_freq = (1/N) * np.sum(np.abs(X_full)**2)

# Similarly, Power can be tested
P_time = np.mean(np.abs(x)**2)

# For PSD, integrating over frequency (Sum * df) should equal P_time
# df = Fs / N
df = fs / nfft
P_freq_sum = np.sum(Pxx_one_sided) * df
\`\`\`
By integrating the area under our one-sided PSD curve (\`Sum * df\`), we extract the total signal power \`P_freq_sum\`, mapping directly back to the time-domain mean squared value \`P_time\`.


### 🧠 Knowledge Check

\`\`\`quiz
question: What distinguishes the Discrete Fourier Transform (DFT) from the DTFT?
a: The DFT operates on continuous signals, while the DTFT operates on discrete ones.
b: Both the time-domain signal and the frequency-domain spectrum in the DFT are discrete and finite in length.
c: The DFT produces a continuous spectrum, whereas the DTFT produces a discrete one.
answer: b
\`\`\`
\`\`\`quiz
question: In the context of the DFT, what does the phenomenon of "spectral leakage" refer to?
a: Energy from a frequency component spreading into adjacent frequency bins because the signal length is not an integer multiple of the period.
b: The loss of low-frequency components when using a high-pass filter.
c: The aliasing of high frequencies into the low-frequency range.
answer: a
\`\`\`
\`\`\`quiz
question: How is spectral leakage typically mitigated when applying the DFT to real-world signals?
a: By increasing the sampling rate.
b: By multiplying the time-domain signal with a windowing function (e.g., Hamming or Hanning) before computing the DFT.
c: By applying a high-pass filter.
answer: b
\`\`\`
`,
    labWalkthrough: `

`,

    keyFormulas: `## Week 7 Key Formulas

| Formula | Description |
|---------|-------------|
| $X[k] = \\sum_{n=0}^{N-1} x[n] e^{-j2\\pi kn/N}$ | DFT |
| $x[n] = \\frac{1}{N} \\sum_{k=0}^{N-1} X[k] e^{j2\\pi kn/N}$ | Inverse DFT |
| $\\Delta f = f_s / N$ | Frequency resolution |
| Zero-pad to $N + M - 1$ for linear conv via DFT | Circular → Linear |`,
  },

  // ═══════════════════════════════════════════════════
  // WEEK 8: Fast Fourier Transform (FFT)
  // ═══════════════════════════════════════════════════
  {
    id: 8,
    title: 'Fast Fourier Transform (FFT)',
    bigPicture: `## From O(N²) to O(N log N)

The DFT formula requires $N^2$ multiplications. For $N = 10^6$ (a 1-second audio clip at CD quality), that's $10^{12}$ operations — impractical.

The **FFT** computes the exact same DFT but in $O(N \\log N)$ operations. For our million-sample signal: $10^6 \\times 20 = 2 \\times 10^7$ — that's **50,000× faster**.

The FFT isn't a different transform — it's a clever **algorithm** for computing the DFT efficiently by exploiting symmetry and periodicity of the twiddle factors.

> **Historical note**: The Cooley-Tukey FFT (1965) is often cited as one of the most important algorithms of the 20th century. It made real-time spectral analysis practical.`,

    concepts: [
      {
        name: 'Radix-2 Decimation-in-Time',
        explanation: `### The Key Idea: Divide and Conquer

Split the $N$-point DFT into two $N/2$-point DFTs:

$$X[k] = \\underbrace{\\sum_{r=0}^{N/2-1} x[2r] W_{N/2}^{kr}}_{\\text{DFT of even samples}} + W_N^k \\underbrace{\\sum_{r=0}^{N/2-1} x[2r+1] W_{N/2}^{kr}}_{\\text{DFT of odd samples}}$$

$$X[k] = G[k] + W_N^k \\cdot H[k]$$
$$X[k + N/2] = G[k] - W_N^k \\cdot H[k]$$

This is the **butterfly operation**: combine two half-size DFTs with one complex multiply and two additions.

\`\`\`python
import numpy as np

def fft_recursive(x):
    """Radix-2 DIT-FFT (recursive)."""
    N = len(x)
    if N == 1:
        return x.copy()
    
    # DFT of even and odd indices
    G = fft_recursive(x[0::2])  # even
    H = fft_recursive(x[1::2])  # odd
    
    # Twiddle factors
    W = np.exp(-2j * np.pi * np.arange(N//2) / N)
    
    # Butterfly
    return np.concatenate([
        G + W * H,    # first half
        G - W * H     # second half
    ])

# Test
x = np.random.randn(64)
X_mine = fft_recursive(x)
X_numpy = np.fft.fft(x)
print(f"Max error: {np.max(np.abs(X_mine - X_numpy)):.2e}")
\`\`\``
      },
      {
        name: 'Twiddle Factors & Butterfly',
        explanation: `### Understanding the Butterfly

The **twiddle factor** $W_N^k = e^{-j2\\pi k/N}$ is a rotation on the unit circle.

Key property: $W_N^{k+N/2} = -W_N^k$ — this is why the butterfly uses addition AND subtraction.

**Butterfly diagram** for one stage:
\`\`\`
a ──────⊕────── a + W·b
         ╲╱
         ╱╲
b ──×W──⊕────── a - W·b
\`\`\`

Each butterfly needs:
- 1 complex multiplication (by $W$)
- 2 complex additions

For $N$ points: $\\log_2 N$ stages × $N/2$ butterflies = $\\frac{N}{2} \\log_2 N$ multiplications.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Visualize twiddle factors on the unit circle
N = 8
k = np.arange(N)
W = np.exp(-2j * np.pi * k / N)

plt.figure(figsize=(6, 6))
theta = np.linspace(0, 2*np.pi, 100)
plt.plot(np.cos(theta), np.sin(theta), 'k-', alpha=0.2)
plt.scatter(W.real, W.imag, s=100, c='red', zorder=5)
for i in range(N):
    plt.annotate(f'W_{N}^{i}', (W[i].real+0.05, W[i].imag+0.05))
plt.axis('equal')
plt.grid(True, alpha=0.3)
plt.title(f'Twiddle factors for N={N}')
plt.show()
\`\`\``
      },
      {
        name: 'Practical FFT Tips',
        explanation: `### Using FFT Effectively

1. **Power-of-2 lengths**: Classic FFT requires $N = 2^m$. Zero-pad if needed.
2. **Zero-padding**: Append zeros to get denser frequency grid (but NOT more resolution)
3. **Real signals**: Use \`np.fft.rfft()\` — only computes positive frequencies (2× faster)
4. **Frequency axis**: Always use \`np.fft.fftfreq(N, 1/fs)\` to get correct frequencies

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Practical FFT example: detect frequencies in a signal
fs = 1000
t = np.arange(0, 1, 1/fs)
x = 0.7*np.sin(2*np.pi*50*t) + 1.0*np.sin(2*np.pi*120*t) + np.random.randn(len(t))*0.5

# FFT
N = len(x)
X = np.fft.rfft(x)  # only positive frequencies
f = np.fft.rfftfreq(N, 1/fs)

plt.figure(figsize=(10, 4))
plt.plot(f, 2/N * np.abs(X))
plt.xlabel('Frequency (Hz)')
plt.ylabel('Amplitude')
plt.title('FFT reveals: 50 Hz and 120 Hz components')
plt.xlim(0, 200)
plt.grid(True, alpha=0.3)
plt.show()
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 8 Solutions

### 📌 Problem 1: Laplace Transform and Convolution Theorem
**Question:** Write a Python script using sympy to compute the Laplace transform of $f(t) = e^{-2t}$ and $g(t) = \\sin(3t)$. Calculate their convolution and prove the validity of the convolution theorem for its Laplace transform.

**Solution:**
The convolution theorem states that $\\mathcal{L}\\{f(t) * g(t)\\} = F(s)G(s)$.
Here is the Python script using \`sympy\` to compute the transforms, the convolution, and verify the theorem:

\`\`\`python
import sympy as sp

# 1. Define symbolic variables
t, tau = sp.symbols('t tau', real=True, positive=True)
s = sp.symbols('s')

# 2. Define the functions
f = sp.exp(-2*t)
g = sp.sin(3*t)

# 3. Compute Laplace Transforms F(s) and G(s)
F = sp.laplace_transform(f, t, s, noconds=True)
G = sp.laplace_transform(g, t, s, noconds=True)

print(f"L{{f(t)}} = {F}")
print(f"L{{g(t)}} = {G}")

# 4. Compute the time-domain convolution: (f * g)(t) = int_0^t f(tau) * g(t - tau) dtau
conv_fg = sp.integrate(f.subs(t, tau) * g.subs(t, t - tau), (tau, 0, t))
print(f"\\nConvolution f(t)*g(t) =\\n{sp.simplify(conv_fg)}")

# 5. Compute the Laplace transform of the resulting convolution
L_conv = sp.laplace_transform(conv_fg, t, s, noconds=True)
L_conv_simplified = sp.simplify(L_conv)
print(f"\\nL{{f(t) * g(t)}} = {L_conv_simplified}")

# 6. Compute the product of individual Laplace transforms
prod_FG = sp.simplify(F * G)
print(f"F(s) * G(s) = {prod_FG}")

# 7. Prove the validity of the convolution theorem
is_valid = sp.simplify(L_conv_simplified - prod_FG) == 0
print(f"\\nConvolution theorem valid? {is_valid}")
\`\`\`

### 📌 Problem 2: Poles and Zeros in Laplace Transform
**Question:** Define poles and zeros in the context of the Laplace transform. How do they influence the behavior of a system?

**Solution:**
Given a transfer function $H(s) = \\frac{N(s)}{D(s)}$:
*   **Zeros** are the roots of the numerator polynomial, $N(s) = 0$. These are the complex frequencies where the system output becomes exactly zero.
*   **
<truncated 24070 bytes>
0$")
plt.title("Lab Exercise 1: Low-Pass Filter")
plt.xlabel("Frequency (rad/s)")
plt.ylabel("Gain (dB)")
plt.grid(True, which='both')
plt.legend()
plt.show()
\`\`\`
*Observation:* Notice how the magnitude drops off sharply at $-20$ dB/decade past $\\omega = 10$. This visually confirms the "Low-Pass" nature we discussed theoretically.

### Part 2: Discrete Systems & The Z-Plane
Transitioning to discrete systems, stability is no longer bounded by the $j\\omega$ axis, but by the unit circle $|z|=1$. 

**Lab Exercise 2: Pole-Zero Mapping for Discrete Systems**
Using a discrete transfer function $H(z) = \\frac{z}{z - 0.8}$.

\`\`\`python
# Lab 08 - Part 2 Code
import numpy as np

# Define Z-domain roots
zeros = [0]
poles = [0.8]

# Setup unit circle
theta = np.linspace(0, 2*np.pi, 100)
x_unit = np.cos(theta)
y_unit = np.sin(theta)

plt.figure(figsize=(6,6))
plt.plot(x_unit, y_unit, 'k--', label="Unit Circle")
plt.scatter(np.real(zeros), np.imag(zeros), marker='o', s=100, facecolors='none', edgecolors='b', label='Zeros')
plt.scatter(np.real(poles), np.imag(poles), marker='x', s=100, color='r', label='Poles')

plt.title("Lab Exercise 2: Z-Plane Root Map")
plt.xlabel("Real")
plt.ylabel("Imaginary")
plt.axhline(0, color='black', lw=0.5)
plt.axvline(0, color='black', lw=0.5)
plt.xlim(-1.5, 1.5)
plt.ylim(-1.5, 1.5)
plt.grid(True, ls=':')
plt.legend()
plt.show()
\`\`\`
*Observation:* The pole is situated at $0.8 + j0$. Because $0.8 < 1$, the pole resides entirely *inside* the unit circle. This guarantees that if the system is assumed to be causal (expanding outward), the ROC $|z|>0.8$ includes the unit circle, meaning the system is inherently **BIBO stable**.

### Conclusion
Throughout Lab 08, we leveraged numerical libraries to validate our manual solutions from Homework 8. Python handles the rigorous algebraic computations, allowing us as DSP engineers to focus heavily on analyzing the geometry of poles, zeros, and regions of convergence. Ensure your plots are adequately documented with axes and units for your final lab submissions!

### 🧠 Knowledge Check

\`\`\`quiz
question: What is the Fast Fourier Transform (FFT)?
a: A different mathematical transform that approximates the DFT.
b: A highly efficient algorithm (like Cooley-Tukey) for computing the DFT, reducing computational complexity from O(N^2) to O(N log N).
c: An analog hardware circuit for frequency analysis.
answer: b
\`\`\`
\`\`\`quiz
question: What is the primary effect of zero-padding a signal in the time domain before computing its FFT?
a: It fundamentally increases the true frequency resolution (ability to distinguish close frequencies).
b: It removes spectral leakage and the need for a windowing function.
c: It interpolates the frequency spectrum, providing a smoother visual representation with more frequency bins, but does not improve true resolution.
answer: c
\`\`\`
\`\`\`quiz
question: Which structural property of the DFT matrix is exploited by radix-2 FFT algorithms?
a: The fact that it is a sparse matrix with mostly zeros.
b: The symmetry and periodicity of the "twiddle factors" (complex roots of unity).
c: The fact that it only contains real numbers.
answer: b
\`\`\`
`,
    labWalkthrough: `

`,

    keyFormulas: `## Week 8 Key Formulas

| Formula | Description |
|---------|-------------|
| $X[k] = G[k] + W_N^k H[k]$ | FFT butterfly (first half) |
| $X[k+N/2] = G[k] - W_N^k H[k]$ | FFT butterfly (second half) |
| $W_N^k = e^{-j2\\pi k/N}$ | Twiddle factor |
| $O(N \\log_2 N)$ vs $O(N^2)$ | FFT vs DFT complexity |
| $N$ must be $2^m$ | Radix-2 requirement |`,
  },

  // ═══════════════════════════════════════════════════
  // WEEK 9: IIR Filter Design
  // ═══════════════════════════════════════════════════
  {
    id: 9,
    title: 'IIR Filter Design',
    bigPicture: `## Designing Filters That Feed Back

Now we start **designing** systems rather than just analyzing them. An **IIR (Infinite Impulse Response)** filter has feedback — its output depends on previous outputs:

$$y[n] = \\sum_{k=0}^{M} b_k x[n-k] - \\sum_{k=1}^{N} a_k y[n-k]$$

The feedback means the impulse response goes on forever (hence "infinite"). IIR filters can achieve sharp frequency selectivity with fewer coefficients than FIR filters, but they can be **unstable** if poles aren't inside the unit circle.

> **Connection to Week 5**: The transfer function $H(z) = B(z)/A(z)$ we studied in the Z-transform is exactly how we describe IIR filters. Now we learn how to **choose** those coefficients.`,

    concepts: [
      {
        name: 'IIR vs FIR',
        explanation: `### Two Types of Digital Filters

| Property | IIR | FIR |
|----------|-----|-----|
| **Feedback** | Yes ($a_k$ coefficients) | No |
| **Impulse response** | Infinite duration | Finite duration |
| **Stability** | Not guaranteed | Always stable |
| **Linear phase** | Generally no | Can be designed |
| **Efficiency** | Fewer coefficients for same sharpness | More coefficients |
| **Design method** | From analog prototypes | Window method, Parks-McClellan |

**When to use IIR**: You need a sharp cutoff with minimal computation (audio EQ, control systems).

**When to use FIR**: You need linear phase (audio, data communications) or guaranteed stability.

\`\`\`python
import numpy as np
from scipy.signal import butter, firwin, freqz
import matplotlib.pyplot as plt

# Compare 4th-order IIR vs 41-tap FIR lowpass at 0.3*Nyquist
fc = 0.3  # normalized cutoff

# IIR: Butterworth
b_iir, a_iir = butter(4, fc)
w_iir, h_iir = freqz(b_iir, a_iir, worN=1024)

# FIR: windowed sinc
b_fir = firwin(41, fc)
w_fir, h_fir = freqz(b_fir, 1, worN=1024)

plt.figure(figsize=(10, 4))
plt.plot(w_iir/np.pi, 20*np.log10(np.abs(h_iir)+1e-10), label=f'IIR (order 4, {len(b_iir)} coefs)')
plt.plot(w_fir/np.pi, 20*np.log10(np.abs(h_fir)+1e-10), label=f'FIR (41 taps)')
plt.xlabel('Normalized frequency (×π rad/sample)')
plt.ylabel('Magnitude (dB)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.ylim(-80, 5)
plt.title('IIR vs FIR: Same cutoff, IIR is sharper with fewer coefficients')
plt.show()
\`\`\``
      },
      {
        name: 'Butterworth & Chebyshev',
        explanation: `### Analog Prototypes

IIR filters are designed by starting with a well-known **analog** filter and converting to digital.

**Butterworth**: Maximally flat passband — no ripple, smooth rolloff.
$$|H_a(j\\Omega)|^2 = \\frac{1}{1 + (\\Omega/\\Omega_c)^{2N}}$$

**Chebyshev Type I**: Allows ripple in passband for sharper cutoff.

**Chebyshev Type II**: Allows ripple in stopband, flat passband.

\`\`\`python
import numpy as np
from scipy.signal import butter, cheby1, freqz
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 4))
fc = 0.3

for order in [2, 4, 8]:
    b, a = butter(order, fc)
    w, h = freqz(b, a, worN=1024)
    ax.plot(w/np.pi, 20*np.log10(np.abs(h)+1e-10), label=f'Butterworth N={order}')

# Chebyshev comparison
b, a = cheby1(4, 1, fc)  # 1 dB passband ripple
w, h = freqz(b, a, worN=1024)
ax.plot(w/np.pi, 20*np.log10(np.abs(h)+1e-10), '--', label='Chebyshev N=4, 1dB ripple')

ax.set_xlabel('Normalized frequency (×π)')
ax.set_ylabel('Magnitude (dB)')
ax.set_ylim(-60, 5)
ax.legend()
ax.grid(True, alpha=0.3)
ax.set_title('Higher order = sharper cutoff')
plt.show()
\`\`\``
      },
      {
        name: 'Bilinear Transform',
        explanation: `### From Analog to Digital

The **bilinear transform** maps the analog $s$-plane to the digital $z$-plane:

$$s = \\frac{2}{T_s} \\cdot \\frac{1 - z^{-1}}{1 + z^{-1}}$$

This maps the entire left half of the $s$-plane to inside the unit circle in $z$-plane — stable analog filters become stable digital filters!

**Frequency warping**: The mapping is nonlinear, so analog frequency $\\Omega$ maps to digital frequency:
$$\\omega = 2 \\arctan\\left(\\frac{\\Omega T_s}{2}\\right)$$

You must **pre-warp** the critical frequency before designing the analog prototype.

\`\`\`python
import numpy as np
from scipy.signal import bilinear, butter, freqs, freqz
import matplotlib.pyplot as plt

# Design analog Butterworth, then convert
Wn = 2 * np.pi * 1000  # 1 kHz analog cutoff
b_a, a_a = butter(4, Wn, analog=True)

# Bilinear transform to digital (fs = 8000 Hz)
fs = 8000
b_d, a_d = bilinear(b_a, a_a, fs)

# Plot both
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
w_a, h_a = freqs(b_a, a_a, worN=np.logspace(1, 5, 500)*2*np.pi)
ax1.semilogx(w_a/(2*np.pi), 20*np.log10(np.abs(h_a)+1e-10))
ax1.set_title('Analog prototype')
ax1.set_xlabel('Frequency (Hz)')

w_d, h_d = freqz(b_d, a_d, worN=1024)
ax2.plot(w_d/np.pi * fs/2, 20*np.log10(np.abs(h_d)+1e-10))
ax2.set_title('Digital (bilinear transform)')
ax2.set_xlabel('Frequency (Hz)')
plt.tight_layout()
plt.show()
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 9 Solutions

### 📌 Problem 1: Relationship Between Filters and Linear Time Invariant Systems
A digital filter is essentially a causal Linear Time-Invariant (LTI) system.
- **Linearity:** The filter's response to a sum of signals is the sum of the responses to each individual signal.
- **Time-Invariance:** Shifting the input signal in time shifts the output signal by the same amount without changing its shape.
Because of these properties, an LTI system (and thus a digital filter) is completely characterized by its impulse response $h[n]$. The output $y[n]$ is simply the discrete convolution of the input $x[n]$ and the impulse response $h[n]$:
$$y[n] = x[n] * h[n] = \\sum_{k=-\\infty}^{\\infty} x[k] h[n-k]$$

### 📌 Problem 2: Stability Criterion in the z-plane
For a causal linear digital filter to be Bounded-Input Bounded-Output (BIBO) stable, all the poles of its transfer function $H(z)$ must lie **strictly inside the unit circle** in the z-plane.
**Significance of the Unit Circle:** The unit circle ($|z| = 1$) represents the boundary between stability and instability.
- If any pole is *outside* the unit circle ($|z| > 1$), the system's impulse response will grow exponentially, leading to instability.
- If poles are *on* the unit circle ($|z| = 1$), the system is marginally stable (oscillatory).
- If all poles are *inside* ($|z| < 1$), the impulse response decays to zero over time, ensuring stability.

### 📌 Problem 3: Relationship Between the s-plane and z-plane
The $s$-plane is used for continuous-time systems, while the $z$-plane is used for discrete-time systems. They are related by the mapping:
$$z = e^{sT}$$
where $s = \\sigma + j\\omega$ and $T$ is the sampling period.
**Mapping properties:**
1. The left half of the $s$-plane ($\\sigma < 0$, stable continuous systems) maps entirely to the **inside of the unit circle** ($|z| < 1$) in the $z$-plane.
2. The right half of the $s$-plane ($\\sigma > 0$, unstable) maps to the **outside of the unit circle** ($|z| > 1$).
3. The imaginary axis of the $s$-plane ($s = j\\omega$, $\\sigma = 0$) wraps around the **unit circle** ($|z| = 1$). The mapping is periodic, with each interval of length $2\\pi/T$ along the $j\\omega$ axis wrapping around the unit circle once.

### 📌 Problem 4: Significance of Poles and Zeros
In the transfer function $H(z) = \\frac{Y(z)}{X(z)}$, **zeros** are the roots of the numerator (where $H(z) = 0$), and **poles** are the roots of the denominator (where $H(z) \\to \\infty$).
- **Influence on Behavior:**
  - Poles determine the resonances and the basic modes of the system's transient response. They are responsible for the feedback loops in the system.
  - Zeros determine the nulls in the frequency response, heavily influencing phase and the exact shape of the frequency magnitude curve.
- **Analyzing Stability:** As noted, if all poles have magnitude $< 1$, the system is stable.
- **Frequency Response Analysis:** Evaluating $H(z)$ along the unit circle ($z = e^{j\\omega}$) gives the frequency response. Geometrically, the magnitude at frequency $\\omega$ is the product of distances from the point $e^{j\\omega}$ to all zeros, divided by the product of distances to all poles. Zeros close to the unit circle create "dips" (attenuation), while poles close to the unit circle create "peaks" (amplification).

### 📌 Problem 5: Frequency Response of a Digital Filter
The frequency response $H(e^{j\\omega})$ describes how a digital filter modifies the amplitude and phase of incoming sinusoidal signals at various frequencies. It is obtained by substituting $z = e^{j\\omega}$ into the transfer function $H(z)$.
**Representation & Information:**
It is typically represented using two plots:
1. **Magnitude Response ($|H(e^{j\\omega})|$):** Shows the gain (amplification or attenuation) applied at each frequency. This defines whether the filter is low-pass, high-pass, band-pass, etc.
2. **Phase Response ($\\angle H(e^{j\\omega})$):** Shows the phase shift applied at each frequency, indicating how different frequency components are delayed in time relative to each other.

### 📌 Problem 6: Bode Plots: Discrete vs. Continuous Systems
1. **Periodicity:** The continuous-time frequency response extends from $0$ to $\\infty$. The discrete-time frequency response is **periodic** with period $2\\pi$ (in normalized radian frequency $\\omega$), reflecting the nature of aliasing.
2. **Frequency Axis:** In discrete Bode plots, the frequency axis typically only goes up to the Nyquist frequency ($\\omega = \\pi$ radians/sample, or $f_s/2$ Hz).
3. **Logarithmic vs Linear Scaling:** Continuous Bode plots extensively use logarithmic scaling for the frequency axis over many decades. Discrete frequency plots often use a linear frequency axis up to $\\pi$, though the magnitude is still frequently plotted in decibels (dB).

### 📌 Problem 7: Analysis of $H(z) = \\frac{1}{z - 0.5}$
**Stability:**
The transfer function has a single pole at $z = 0.5$.
Since the magnitude of the pole is $|0.5| < 1$, the system is **stable**.
**Impulse Response:**
Rewrite $H(z)$ by factoring out $z^{-1}$:
$$H(z) = \\frac{z^{-1}}{1 - 0.5z^{-1}}$$
We know the standard Z-transform pair:
$$(0.5)^n u[n] \\longleftrightarrow \\frac{1}{1 - 0.5z^{-1}}$$
Applying the time-delay property ($z^{-1}$ delays the sequence by 1 sample):
$$h[n] = (0.5)^{n-1} u[n-1]$$
The impulse response sequence for $n \\ge 0$ is:
$$h = [0, 1, 0.5, 0.25, 0.125, \\dots]$$

### 📌 Problem 8: Analysis of $H(z) = \\frac{1}{z^2 - z + 0.5}$
**Stability:**
Set the denominator to zero to find the poles:
$$z^2 - z + 0.5 = 0$$
Using the quadratic formula:
$$z = \\frac{1 \\pm \\sqrt{1 - 2}}{2} = 0.5 \\pm j0.5$$
The magnitude of the poles is $|z| = \\sqrt{0.5^2 + 0.5^2} = \\sqrt{0.5} = \\frac{1}{\\sqrt{2}} \\approx 0.707$.
Because $|z| < 1$, the system is **stable**.
**Impulse Response:**
We rewrite $H(z)$ into negative powers of $z$:
$$H(z) = \\frac{z^{-2}}{1 - z^{-1} + 0.5z^{-2}}$$
Recall the general transform pair for complex poles $p = r e^{\\pm j\\omega_0}$:
$$\\frac{r \\sin(\\omega_0) z^{-1}}{1 - 2r\\cos(\\omega_0)z^{-1} + r^2 z^{-2}} \\longleftrightarrow r^n \\sin(\\omega_0 n) u[n]$$
For our system, $r^2 = 0.5 \\implies r = \\frac{1}{\\sqrt{2}}$, and $2r\\cos(\\omega_0) = 1 \\implies \\cos(\\omega_0) = \\frac{1}{\\sqrt{2}} \\implies \\omega_0 = \\frac{\\pi}{4}$.
Then $r \\sin(\\omega_0) = \\frac{1}{\\sqrt{2}} \\cdot \\frac{1}{\\sqrt{2}} = 0.5$.
So, $\\frac{0.5z^{-1}}{1 - z^{-1} + 0.5z^{-2}} \\longleftrightarrow r^n \\sin\\left(\\frac{\\pi}{4} n\\right) u[n]$.
Our $H(z)$ is equal to this multiplied by $2z^{-1}$:
$$H(z) = 2z^{-1} \\left[ \\frac{0.5z^{-1}}{1 - z^{-1} + 0.5z^{-2}} \\right]$$
Taking the inverse Z-transform:
$$h[n] = 2 \\left(\\frac{1}{\\sqrt{2}}\\right)^{n-1} \\sin\\left(\\frac{\\pi}{4}(n-1)\\right) u[n-1]$$
Testing the first few terms for $n=0, 1, 2, 3, 4$:
$$h = [0, 0, 1, 1, 0.5, \\dots]$$

### 📌 Problem 9: Unit Step Response of $H(z) = \\frac{0.4}{z - 0.5}$
Rewrite $H(z)$ with negative powers:
$$H(z) = \\frac{0.4 z^{-1}}{1 - 0.5z^{-1}}$$
The unit step input is $U(z) = \\frac{1}{1 - z^{-1}}$. The output is $Y(z) = H(z) U(z)$:
$$Y(z) = \\frac{0.4 z^{-1}}{(1 - 0.5z^{-1})(1 - z^{-1})}$$
Perform partial fraction expansion on $\\frac{Y(z)}{z^{-1}}$:
$$\\frac{0.4}{(1 - 0.5z^{-1})(1 - z^{-1})} = \\frac{A}{1 - 0.5z^{-1}} + \\frac{B}{1 - z^{-1}}$$
$$A = \\left. \\frac{0.4}{1 - z^{-1}} \\right|_{z^{-1}=2} = \\frac{0.4}{-1} = -0.4$$
$$B = \\left. \\frac{0.4}{1 - 0.5z^{-1}} \\right|_{z^{-1}=1} = \\frac{0.4}{0.5} = 0.8$$
So, $Y(z) = \\frac{-0.4 z^{-1}}{1 - 0.5z^{-1}} + \\frac{0.8 z^{-1}}{1 - z^{-1}}$.
Taking the inverse Z-transform:
$$y[n] = -0.4 (0.5)^{n-1} u[n-1] + 0.8 u[n-1]$$
Evaluating for the first four terms ($n=0, 1, 2, 3$):
- $y[0] = 0$
- $y[1] = -0.4(1) + 0.8 = 0.4$
- $y[2] = -0.4(0.5) + 0.8 = 0.6$
- $y[3] = -0.4(0.25) + 0.8 = 0.7$
**First four terms:** $0, 0.4, 0.6, 0.7$.

### 📌 Problem 10 & 11: Python Script for Pole-Zero Diagram and Stability Analysis
Both questions ask to plot the pole-zero diagram for $H(z) = \\frac{z^2 + 0.5z + 1}{z^2 - 1.5z + 0.7}$ using \`numpy.roots\` and analyze stability.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Define the coefficients of the numerator and denominator polynomials
# H(z) = (z^2 + 0.5z + 1) / (z^2 - 1.5z + 0.7)
num_coeffs = [1, 0.5, 1]
den_coeffs = [1, -1.5, 0.7]

# Calculate zeros and poles using numpy.roots
zeros = np.roots(num_coeffs)
poles = np.roots(den_coeffs)

print(f"Zeros: {zeros}")
print(f"Poles: {poles}")

# Analyze stability
pole_magnitudes = np.abs(poles)
print(f"Pole magnitudes: {pole_magnitudes}")
is_stable = np.all(pole_magnitudes < 1)
print(f"System is stable: {is_stable}")

# Plotting the Pole-Zero diagram
fig, ax = plt.subplots(figsize=(6, 6))

# Plot the unit circle
theta = np.linspace(0, 2*np.pi, 100)
ax.plot(np.cos(theta), np.sin(theta), linestyle='--', color='gray', label='Unit Circle')

# Plot zeros and poles
ax.scatter(np.real(zeros), np.imag(zeros), s=100, marker='o', facecolors='none', edgecolors='blue', label='Zeros')
ax.scatter(np.real(poles), np.imag(poles), s=100, marker='x', color='red', label='Poles')

# Aesthetics
ax.axhline(0, color='black', lw=1)
ax.axvline(0, color='black', lw=1)
ax.set_xlim([-1.5, 1.5])
ax.set_ylim([-1.5, 1.5])
ax.set_aspect('equal')
ax.set_xlabel('Real Part')
ax.set_ylabel('Imaginary Part')
ax.set_title('Pole-Zero Diagram')
ax.legend()
plt.grid(True)
plt.show()

# Stability Analysis:
# The roots of the denominator are approximately 0.75 +/- j0.3708.
# The magnitude of these poles is sqrt(0.75^2 + 0.3708^2) = sqrt(0.7) ≈ 0.836.
# Since 0.836 < 1, all poles lie strictly inside the unit circle.
# Therefore, the system is strictly stable.
\`\`\`

### 📌 Problem 12: Inverse Z-Transform of $H(z) = \\frac{z + 0.5}{z^2 - 0.7z + 0.1}$
To compute the first five terms of the impulse response, we can perform long division.
Convert to negative powers of $z$:
$$H(z) = \\frac{z^{-1} + 0.5z^{-2}}{1 - 0.7z^{-1} + 0.1z^{-2}}$$
Now, divide the numerator by the denominator:
1. $z^{-1} / 1 = \\mathbf{z^{-1}}$
   Remainder: $(z^{-1} + 0.5z^{-2}) - z^{-1}(1 - 0.7z^{-1} + 0.1z^{-2}) = 1.2z^{-2} - 0.1z^{-3}$
2. $1.2z^{-2} / 1 = \\mathbf{1.2z^{-2}}$
   Remainder: $(1.2z^{-2} - 0.1z^{-3}) - 1.2z^{-2}(1 - 0.7z^{-1} + 0.1z^{-2}) = 0.74z^{-3} - 0.12z^{-4}$
3. $0.74z^{-3} / 1 = \\mathbf{0.74z^{-3}}$
   Remainder: $(0.74z^{-3} - 0.12z^{-4}) - 0.74z^{-3}(1 - 0.7z^{-1} + 0.1z^{-2}) = 0.398z^{-4} - 0.074z^{-5}$
4. $0.398z^{-4} / 1 = \\mathbf{0.398z^{-4}}$

This yields the sequence for $H(z)$:
$$H(z) = 0 + 1z^{-1} + 1.2z^{-2} + 0.74z^{-3} + 0.398z^{-4} + \\dots$$
The first five terms of the impulse response $h[n]$ (for $n=0,1,2,3,4$) are:
**$h = [0, 1, 1.2, 0.74, 0.398]$**

### 📌 Problem 13: FIR and IIR Filters Explained
- **FIR (Finite Impulse Response) Filters:** Their impulse response settles to zero in finite time. They are strictly non-recursive (no feedback).
- **IIR (Infinite Impulse Response) Filters:** Their impulse response continues indefinitely. They are recursive (use feedback).

**Main Differences:**
1. **Complexity:** FIR filters generally require a much higher filter order (more taps and thus more memory) to achieve the same sharp cutoff characteristics as an IIR filter. IIR filters require a lower order for the same magnitude specifications.
2. **Efficiency:** Because they need a lower order, IIR filters are computationally more efficient per sample (fewer multiplications/additions).
3. **Stability:** FIR filters are inherently stable because they have no feedback (all poles are at the origin). IIR filters can become unstable if quantization errors or design choices push their poles outside the unit circle.
4. **Phase Response:** FIR filters can be easily designed to have exactly linear phase, preventing phase distortion. IIR filters have non-linear phase, which causes phase distortion and may require all-pass equalizers to correct.

### 📌 Problem 14: Frequency Response of $H(z) = \\frac{z+1}{z-0.5}$ at $f_s = 8$ Hz
The discrete frequency $\\omega = \\frac{2\\pi f}{f_s}$. Substitute $z = e^{j\\omega}$.
**1. At $f = 0$ Hz:**
$\\omega = 0 \\implies z = e^{j0} = 1$.
$$H(1) = \\frac{1+1}{1-0.5} = \\frac{2}{0.5} = 4$$
- **Gain:** $4$
- **Phase:** $0$ rad ($0^\\circ$)

**2. At $f = 1$ Hz:**
$\\omega = \\frac{2\\pi(1)}{8} = \\frac{\\pi}{4}$. $z = e^{j\\pi/4} = \\frac{1}{\\sqrt{2}} + j\\frac{1}{\\sqrt{2}}$.
$$H(e^{j\\pi/4}) = \\frac{\\frac{1}{\\sqrt{2}} + 1 + j\\frac{1}{\\sqrt{2}}}{\\frac{1}{\\sqrt{2}} - 0.5 + j\\frac{1}{\\sqrt{2}}}$$
Magnitude of numerator: $\\sqrt{(\\frac{1}{\\sqrt{2}} + 1)^2 + (\\frac{1}{\\sqrt{2}})^2} = \\sqrt{2+\\sqrt{2}} \\approx 1.848$
Phase of numerator: $\\arctan\\left(\\frac{1/\\sqrt{2}}{1 + 1/\\sqrt{2}}\\right) = \\frac{\\pi}{8}$ rad ($22.5^\\circ$)
Magnitude of denominator: $\\sqrt{(\\frac{1}{\\sqrt{2}} - 0.5)^2 + (\\frac{1}{\\sqrt{2}})^2} = \\sqrt{1.25 - \\frac{1}{\\sqrt{2}}} \\approx 0.737$
Phase of denominator: $\\arctan\\left(\\frac{1/\\sqrt{2}}{1/\\sqrt{2} - 0.5}\\right) = \\frac{3\\pi}{8}$ rad ($67.5^\\circ$)
- **Gain:** $\\frac{1.848}{0.737} \\approx 2.508$
- **Phase:** $\\frac{\\pi}{8} - \\frac{3\\pi}{8} = -\\frac{\\pi}{4}$ rad ($-45^\\circ$)

**3. At $f = 2$ Hz:**
$\\omega = \\frac{2\\pi(2)}{8} = \\frac{\\pi}{2}$. $z = e^{j\\pi/2} = j$.
$$H(j) = \\frac{j+1}{j-0.5} = \\frac{1+j}{-0.5+j}$$
Magnitude of numerator: $\\sqrt{1^2 + 1^2} = \\sqrt{2} \\approx 1.414$
Phase of numerator: $\\arctan(1) = \\frac{\\pi}{4}$ rad ($45^\\circ$)
Magnitude of denominator: $\\sqrt{(-0.5)^2 + 1^2} = \\sqrt{1.25} \\approx 1.118$
Phase of denominator: $\\pi + \\arctan(-2) \\approx 116.57^\\circ = 2.034$ rad
- **Gain:** $\\frac{\\sqrt{2}}{\\sqrt{1.25}} = \\sqrt{1.6} \\approx 1.265$
- **Phase:** $45^\\circ - 116.57^\\circ = -71.57^\\circ$ ($\\approx -1.249$ rad)

### 📌 Problem 15: Frequency Response of $H(z) = \\frac{1 - 0.8z^{-1}}{1 - 0.5z^{-1}}$ at $f_s = 10$ Hz
$\\omega = \\frac{2\\pi f}{f_s}$. Evaluate $z^{-1} = e^{-j\\omega} = \\cos(\\omega) - j\\sin(\\omega)$.

**1. At $f = 0$ Hz:**
$\\omega = 0 \\implies z^{-1} = 1$.
$$H(1) = \\frac{1 - 0.8}{1 - 0.5} = \\frac{0.2}{0.5} = 0.4$$
- **Gain:** $0.4$
- **Phase:** $0$ rad ($0^\\circ$)

**2. At $f = 1$ Hz:**
$\\omega = \\frac{2\\pi(1)}{10} = \\frac{\\pi}{5}$ rad ($36^\\circ$).
$z^{-1} = \\cos(36^\\circ) - j\\sin(36^\\circ) \\approx 0.8090 - j0.5878$.
$$H(e^{j\\pi/5}) = \\frac{1 - 0.8(0.8090 - j0.5878)}{1 - 0.5(0.8090 - j0.5878)} = \\frac{0.3528 + j0.4702}{0.5955 + j0.2939}$$
Numerator: $|N| = \\sqrt{0.3528^2 + 0.4702^2} \\approx 0.5879$, $\\angle N = \\arctan(0.4702/0.3528) \\approx 53.12^\\circ$
Denominator: $|D| = \\sqrt{0.5955^2 + 0.2939^2} \\approx 0.6641$, $\\angle D = \\arctan(0.2939/0.5955) \\approx 26.27^\\circ$
- **Gain:** $\\frac{0.5879}{0.6641} \\approx 0.885$
- **Phase:** $53.12^\\circ - 26.27^\\circ = 26.85^\\circ$ ($\\approx 0.469$ rad)

**3. At $f = 2$ Hz:**
$\\omega = \\frac{2\\pi(2)}{10} = \\frac{2\\pi}{5}$ rad ($72^\\circ$).
$z^{-1} = \\cos(72^\\circ) - j\\sin(72^\\circ) \\approx 0.3090 - j0.9511$.
$$H(e^{j2\\pi/5}) = \\frac{1 - 0.8(0.3090 - j0.9511)}{1 - 0.5(0.3090 - j0.9511)} = \\frac{0.7528 + j0.7609}{0.8455 + j0.4755}$$
Numerator: $|N| = \\sqrt{0.7528^2 + 0.7609^2} \\approx 1.070$, $\\angle N = \\arctan(0.7609/0.7528) \\approx 45.31^\\circ$
Denominator: $|D| = \\sqrt{0.8455^2 + 0.4755^2} \\approx 0.970$, $\\angle D = \\arctan(0.4755/0.8455) \\approx 29.35^\\circ$
- **Gain:** $\\frac{1.070}{0.970} \\approx 1.103$
- **Phase:** $45.31^\\circ - 29.35^\\circ = 15.96^\\circ$ ($\\approx 0.279$ rad)

---

## 💻 Lab 09 Walkthrough: Z-Transforms & Frequency Response Analysis

Welcome to Lab 09! In this session, we map the theory of discrete linear systems to practical code, implementing frequency response evaluation and pole-zero mapping using \`scipy.signal\`.

### 1. Introduction to Pole-Zero Mapping in Python
Understanding the structural resonance and nulls of an LTI system hinges on mapping its transfer function roots. In Python, a digital filter defined by $H(z) = \\frac{B(z)}{A(z)}$ can be processed using \`scipy.signal.tf2zpk\`, which converts transfer function coefficients directly into Zeros, Poles, and Gain (ZPK format).

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Define a simple IIR notch filter
# Numerator: B(z) = 1 - 1.5z^{-1} + z^{-2}
# Denominator: A(z) = 1 - 0.9z^{-1} + 0.8z^{-2}
b = [1, -1.5, 1]
a = [1, -0.9, 0.8]

# Calculate Zeros, Poles, and Gain
zeros, poles, gain = signal.tf2zpk(b, a)

print(f"Zeros are located at: {zeros}")
print(f"Poles are located at: {poles}")

# The function below plots the unit circle and the extracted roots
def plot_pz(zeros, poles):
    plt.figure(figsize=(5,5))
    unit_circle = plt.Circle((0,0), 1, color='black', fill=False, linestyle='--')
    plt.gca().add_patch(unit_circle)
    
    plt.plot(np.real(zeros), np.imag(zeros), 'bo', fillstyle='none', markersize=10, label='Zeros')
    plt.plot(np.real(poles), np.imag(poles), 'rx', markersize=10, label='Poles')
    
    plt.title('Pole-Zero Plot')
    plt.xlabel('Real')
    plt.ylabel('Imaginary')
    plt.grid(True)
    plt.legend()
    plt.axis('equal')
    plt.show()

plot_pz(zeros, poles)
\`\`\`
**Lab Exercise Tip:** Verify visually that all red 'x' marks (poles) lie within the black dashed circle. If they touch or cross the boundary, the designed filter is unstable!

### 2. Frequency Response via \`freqz\`
Instead of manually calculating the complex division at specific frequencies (like we did in the homework), we can use \`scipy.signal.freqz\` to evaluate the entire spectrum spanning from $0$ to the Nyquist frequency $\\pi$.

\`\`\`python
# Compute frequency response evaluating over 512 points
w, h = signal.freqz(b, a, worN=512)

# w contains the normalized frequencies (0 to pi)
# h contains the complex response. We must extract magnitude and phase!
magnitude_db = 20 * np.log10(np.abs(h))
phase_rad = np.angle(h)

# Plotting the Bode-like response
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6))

ax1.plot(w / np.pi, magnitude_db, color='blue')
ax1.set_ylabel('Magnitude (dB)')
ax1.set_title('Frequency Response')
ax1.grid()

ax2.plot(w / np.pi, phase_rad, color='green')
ax2.set_xlabel('Normalized Frequency (x $\\pi$ rad/sample)')
ax2.set_ylabel('Phase (radians)')
ax2.grid()

plt.tight_layout()
plt.show()
\`\`\`

### 3. Simulating the System with \`lfilter\`
Once the filter is verified stable and the frequency response meets requirements, we can pass real signals through it. \`scipy.signal.lfilter\` runs the discrete difference equation $y[n] = \\sum b_k x[n-k] - \\sum a_k y[n-k]$ highly efficiently.

\`\`\`python
# Create a test signal: a combination of low frequency and high frequency
n = np.arange(100)
x = np.sin(0.1 * np.pi * n) + 0.5 * np.cos(0.8 * np.pi * n)

# Apply the difference equation using lfilter
y = signal.lfilter(b, a, x)

plt.figure(figsize=(10,4))
plt.plot(n, x, label='Input Signal $x[n]$', alpha=0.7)
plt.plot(n, y, label='Filtered Output $y[n]$', linewidth=2)
plt.title('Filter Application in the Time Domain')
plt.xlabel('Samples (n)')
plt.ylabel('Amplitude')
plt.legend()
plt.grid()
plt.show()
\`\`\`
**Lab Exercise Takeaway:** The time-domain application perfectly reflects our frequency-domain analysis. Frequencies situated near our Zeros (the notches) are completely attenuated from the output \`y\`, while the remaining signal propagates through.

**End of Lab 09 Walkthrough**


### 🧠 Knowledge Check

\`\`\`quiz
question: What distinguishes an Infinite Impulse Response (IIR) filter from a Finite Impulse Response (FIR) filter?
a: An IIR filter only requires feed-forward coefficients.
b: An IIR filter utilizes feedback (poles), causing its impulse response to theoretically continue indefinitely.
c: An IIR filter inherently possesses exactly linear phase.
answer: b
\`\`\`
\`\`\`quiz
question: The Bilinear Transform is a popular method for IIR filter design. What does it do?
a: It converts a continuous-time (analog) filter transfer function H(s) into a discrete-time digital filter H(z).
b: It transforms a time-domain signal directly into the frequency domain.
c: It ensures that the resulting digital filter has finite impulse response.
answer: a
\`\`\`
\`\`\`quiz
question: Which of the following analog filter prototypes is characterized by a "maximally flat" passband with no ripple?
a: Chebyshev Type I
b: Elliptic
c: Butterworth
answer: c
\`\`\`
`,
    labWalkthrough: `

`,

    keyFormulas: `## Week 9 Key Formulas

| Formula | Description |
|---------|-------------|
| $H(z) = \\frac{B(z)}{A(z)} = \\frac{\\sum b_k z^{-k}}{1 + \\sum a_k z^{-k}}$ | IIR transfer function |
| $s = \\frac{2}{T_s} \\frac{1-z^{-1}}{1+z^{-1}}$ | Bilinear transform |
| $\\omega = 2\\arctan(\\Omega T_s / 2)$ | Frequency warping |
| $\\|H_B(j\\Omega)\\|^2 = \\frac{1}{1+(\\Omega/\\Omega_c)^{2N}}$ | Butterworth response |`,
  },
];
