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
        name: 'Fast Fourier Transform (FFT) - Cooley-Tukey Algorithm',
        explanation: `The Cooley-Tukey Radix-2 Decimation-In-Time (DIT) algorithm reduces the computational complexity of the Discrete Fourier Transform (DFT) from $O(N^2)$ to $O(N \log_2 N)$. This is achieved by dividing the sequence $x[n]$ into even and odd-indexed halves. The DFT is expressed as:

$$X[k] = \sum_{m=0}^{N/2-1} x[2m] e^{-i \frac{2\pi}{N/2} m k} + e^{-i \frac{2\pi}{N} k} \sum_{m=0}^{N/2-1} x[2m+1] e^{-i \frac{2\pi}{N/2} m k}$$

This yields $X[k] = E[k] + W_N^k O[k]$, where $E[k]$ and $O[k]$ are the DFTs of the even and odd sub-sequences. By exploiting the periodicity of the twiddle factors ($W_N^k = e^{-i 2\pi k/N}$), we can efficiently compute the upper half of the frequencies: $X[k + N/2] = E[k] - W_N^k O[k]$. This halving procedure is applied recursively, requiring the input size to be a power of two ($N = 2^p$).`
      },
      {
        name: 'Zero Padding and Spectral Resolution',
        explanation: `Zero padding involves extending a sequence length to the next higher power of two, e.g., to $2^{\lceil \log_2 N \rceil}$, by appending zeros. The zero-padded DFT $X_M[k]$ evaluates the Discrete-Time Fourier Transform (DTFT) $X(e^{j\omega})$ on a denser frequency grid. 

Crucially, zero padding **interpolates** the spectrum without altering its fundamental shape or improving the true spectral resolution (the main-lobe width remains unchanged). The original signal samples are preserved, but more points are generated in the frequency domain, resulting in a smoother spectral appearance.`
      },
      {
        name: 'FFT-Based Convolution',
        explanation: `Discrete convolution involves $O(p \cdot q)$ operations for two sequences of lengths $p$ and $q$. Using FFT, we can compute linear convolution much faster in $O(N \log N)$ operations. By zero-padding the sequences to length $N = p + q - 1$ to prevent circular wrap-around, linear convolution is obtained via:

$$z[n] = \text{iFFT} \big( \text{FFT}(x_{\text{padded}}) \cdot \text{FFT}(y_{\text{padded}}) \big)$$

For continuous data streams or sequences that are too long for a single FFT, techniques like the **Overlap-Add method** are employed. The signal is split into blocks of length $L$, independently convolved with the impulse response of length $M$, and the overlapping sections of the resulting blocks (of length $L+M-1$) are summed sequentially.`
      },
      {
        name: 'Deconvolution and Noise Amplification',
        explanation: `Deconvolution aims to recover an original signal $x(t)$ from the system output $y(t) = [x * h](t) + s(t)$, where $h(t)$ is the impulse response and $s(t)$ is additive noise. In the frequency domain, this is expressed as $Y = X \cdot H + S$, and inverse filtering yields $\tilde{X} = X + \frac{S}{H}$. 

A fundamental problem arises at frequencies where the magnitude of the system's frequency response $|H(f)|$ is close to zero. At these frequencies, the noise component $\frac{S}{H}$ is dramatically amplified, destroying the estimate $\tilde{x}$.`
      },
      {
        name: 'Spectral Estimation: Leakage and Scalloping',
        explanation: `When estimating the spectrum of a finite sampled signal, two main artifacts occur:

- **Spectral Leakage:** Caused by the inherent windowing (finite observation) of the signal. In the frequency domain, the true spectrum is convolved with the Fourier transform of the window $W(f)$, causing energy to spread from the main signal frequency into adjacent bins.
- **Scalloping Loss:** Refers to the amplitude underestimation that happens because the DFT samples the continuous spectrum at discrete frequency bins. If the signal's frequency is not a perfect multiple of the frequency resolution $\Delta f = f_s/N$ (non-coherent sampling), the peak falls between bins.

Coherent sampling ($f_0 = k \frac{f_s}{N}$) visually hides these effects because the DFT bins align precisely with the peak and the zero-crossings of the window's spectrum.`
      },
      {
        name: 'Window Functions',
        explanation: `To mitigate spectral leakage, sequences are multiplied by tapering window functions $w[n]$ that smoothly decay at the edges, replacing the default rectangular (Dirichlet) window. Common windows include:

- **Triangular (Bartlett):** $w[n] = 1 - \left| \frac{n - N/2}{N/2} \right|$
- **Hann:** $w[n] = 0.5 \left( 1 - \cos \left( \frac{2\pi n}{N} \right) \right) = \sin^2 \left( \frac{\pi n}{N} \right)$
- **Hamming:** $w[n] = 0.54 - 0.46 \cos \left( \frac{2\pi n}{N} \right)$
- **Welch:** Parabolic window.

More advanced windows can be expressed as a linear combination of cosines: $w[n] = a_0 - a_1 \cos \left( \frac{2\pi n}{N-1} \right) + a_2 \cos \left( \frac{4\pi n}{N-1} \right) - \dots$`
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

---`,
    labWalkthrough: `## 🔬 Lab 06 Walkthrough: FFT Implementation and Analysis

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
d: fs = π * f_max
answer: b
explanation: The Nyquist-Shannon theorem states that perfect reconstruction requires fs ≥ 2·f_max. Option (a) fs = f_max would only provide one sample per cycle, which is insufficient to distinguish a sine from a constant. Option (c) fs = 4·f_max is more than necessary (oversampling). Option (d) fs = π·f_max has no theoretical basis in sampling theory.
\`\`\`
\`\`\`quiz
question: What is aliasing in the context of signal sampling?
a: The loss of high-frequency energy due to low-pass filtering.
b: High-frequency components folding back and impersonating lower frequencies because the sampling rate was too low.
c: The quantization noise introduced by analog-to-digital converters.
d: The time delay introduced when converting between analog and digital domains.
answer: b
explanation: Aliasing occurs when the sampling rate violates the Nyquist criterion (fs < 2·f_max), causing frequencies above fs/2 to "fold" back into the baseband and become indistinguishable from lower frequencies. Option (a) describes the effect of a filter, not aliasing itself. Option (c) refers to quantization error, a separate phenomenon. Option (d) describes latency, which is unrelated to frequency misrepresentation.
\`\`\`
\`\`\`quiz
question: What is the primary purpose of an anti-aliasing filter placed before an Analog-to-Digital Converter (ADC)?
a: To eliminate all background noise in the signal.
b: To amplify the highest frequencies of the signal for better resolution.
c: To strictly limit the bandwidth of the continuous signal to less than half the sampling rate.
d: To convert the analog signal into a digital representation before sampling.
answer: c
explanation: An anti-aliasing filter is a lowpass filter that attenuates all frequency components above the Nyquist frequency (fs/2) before sampling occurs, preventing those components from folding back as aliases. Option (a) is incorrect because the filter targets bandwidth limitation, not general noise removal. Option (b) is the opposite of what the filter does — it attenuates, not amplifies, high frequencies. Option (d) confuses the filter's role with that of the ADC itself.
\`\`\`
\`\`\`quiz
question: A continuous signal contains frequency components at 200 Hz, 800 Hz, and 1400 Hz. If sampled at fs = 1000 Hz, which frequencies will appear in the sampled signal?
a: 200 Hz, 800 Hz, and 1400 Hz (all preserved)
b: 200 Hz, 200 Hz, and 400 Hz (aliased versions)
c: 200 Hz, 200 Hz, and 600 Hz (aliased versions)
d: Only 200 Hz survives; the others are eliminated
answer: b
explanation: The Nyquist frequency is fs/2 = 500 Hz. The 200 Hz component is below Nyquist and passes through unchanged. The 800 Hz component aliases to |800 - 1000| = 200 Hz. The 1400 Hz component aliases to |1400 - 1000| = 400 Hz. So the sampled signal contains 200 Hz (appearing twice, from the original 200 Hz and the aliased 800 Hz) and 400 Hz. Option (a) is wrong because frequencies above 500 Hz cannot be faithfully represented. Option (c) miscalculates the alias of 1400 Hz. Option (d) is wrong because aliased components still appear, they are not removed.
\`\`\`
\`\`\`quiz
question: In ideal sinc interpolation reconstruction, why is the sinc function used specifically as the interpolation kernel?
a: Because sinc is computationally cheap and easy to implement in hardware.
b: Because the sinc function is the time-domain representation of an ideal rectangular (brick-wall) lowpass filter, which is exactly what perfect reconstruction requires.
c: Because sinc functions have finite support, making them practical for real-time systems.
d: Because the sinc function eliminates quantization noise during reconstruction.
answer: b
explanation: The Fourier transform of a rectangular function in frequency (an ideal brick-wall lowpass filter passing everything below fs/2) is the sinc function in time. Since perfect reconstruction requires an ideal lowpass filter, sinc interpolation is the theoretically exact method. Option (a) is wrong — sinc is actually impractical because it extends to infinity and requires infinite computation. Option (c) is wrong because sinc has infinite support (it never truly reaches zero), which is one of its main practical drawbacks. Option (d) confuses reconstruction with quantization error correction, which are separate concerns.
\`\`\`
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
        name: 'Periodogram and Spectral Density Estimation',
        explanation: `The Periodogram provides an estimate of the signal's power distribution over frequencies. For a discrete sequence $x[n]$ of length $N$, it is defined as $P_x(f_k) = \frac{1}{N} |X[k]|^2$, where $X[k]$ is the DFT. 

By Parseval's theorem, the power spectral density (PSD) captures the signal power in the frequency domain. However, a raw periodogram computed directly from a noisy sequence suffers from high variance (noisy spectrum) and inconsistency.`
      },
      {
        name: 'Bartlett\'s Method for Spectral Estimation',
        explanation: `To overcome the high variance of the raw periodogram, the Bartlett method splits the observed data record of length $N$ into $M$ non-overlapping segments, each of length $L = N/M$. 

The periodogram is computed for each segment, and the final estimate is the average of these $M$ periodograms: $S_B[k] = \frac{1}{M} \sum_{m=1}^M I_m[k]$. This reduces variance (smoothing the spectrum) and computational cost to $O(N \log L)$, but it decreases the frequency resolution to $\Delta f = f_s / L$ and introduces higher bias (leakage) due to shorter segments.`
      },
      {
        name: 'Welch\'s Method',
        explanation: `Welch's method improves upon Bartlett's by allowing overlapping segments and applying a taper (window) to each segment before taking the DFT. The overlap increases the number of segments (improving statistical averaging), while the window minimizes spectral leakage caused by segment truncation.

The steps are:
1. **Segmentation:** Divide the signal into overlapping segments.
2. **Detrending:** Remove the mean or linear trend to prevent a large DC spike (Dirac delta) from polluting low frequencies.
3. **Windowing:** Multiply by a normalized window $w[n]$.
4. **Zero Padding:** Pad segments to refine the DFT frequency grid.
5. **DFT & PSD Normalization:** Compute the squared magnitude and scale by $\frac{1}{f_s \sum w^2[n]}$.
6. **Averaging:** Average the modified periodograms to yield the Welch PSD estimator $\hat{S}_{xx}(f_m)$.`
      },
      {
        name: 'The Laplace Transform',
        explanation: `The Laplace transform maps a continuous-time signal $f(t)$ to the complex frequency domain $s = \sigma + i\omega$. It is defined for $t \ge 0$ as:

$$F(s) = \mathcal{L}[f] = \int_0^\infty f(t) e^{-st} dt$$

It is a linear integral transform extensively used to solve linear constant-coefficient differential equations. Important properties include:
- **Shift in s-domain:** $\mathcal{L}[e^{ct} f(t)] = F(s-c)$
- **Time scaling:** $\mathcal{L}[f(ct)] = \frac{1}{c} F(\frac{s}{c})$
- **Multiplication by $t$:** $\mathcal{L}[(-t)^n f(t)] = \frac{d^n}{ds^n} F(s)$`
      },
      {
        name: 'Convolution in the Laplace Domain',
        explanation: `The convolution of two causal signals $f(t)$ and $g(t)$ is $f * g = \int_0^t f(\tau) g(t-\tau) d\tau$. The Laplace transform simplifies convolution in the time domain into algebraic multiplication in the complex frequency domain:

$$\mathcal{L}[f * g] = \mathcal{L}[f] \cdot \mathcal{L}[g] = F(s) G(s)$$

This property is the foundation for analyzing Linear Time-Invariant (LTI) systems using transfer functions.`
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
d: The DFT requires infinite-length input sequences, while the DTFT works on finite ones.
answer: b
explanation: The DFT takes N time-domain samples and produces N frequency-domain samples — both are discrete and finite. The DTFT, by contrast, produces a continuous frequency spectrum from a discrete-time input. Option (a) reverses the relationship — the DFT operates on discrete, finite signals. Option (c) swaps the properties of DFT and DTFT. Option (d) is backwards — the DFT specifically handles finite-length sequences while the DTFT can handle infinite ones.
\`\`\`
\`\`\`quiz
question: In the context of the DFT, what does the phenomenon of "spectral leakage" refer to?
a: Energy from a frequency component spreading into adjacent frequency bins because the signal length is not an integer multiple of the period.
b: The loss of low-frequency components when using a high-pass filter.
c: The aliasing of high frequencies into the low-frequency range.
d: The reduction in frequency resolution caused by using too few samples.
answer: a
explanation: Spectral leakage occurs when a signal's frequency doesn't align exactly with a DFT bin, meaning the observation window truncates non-integer cycles. This abrupt truncation creates discontinuities that spread energy across many bins in the frequency domain. Option (b) describes filtering, not leakage. Option (c) describes aliasing, a different sampling artifact. Option (d) describes poor frequency resolution, which is related to short observation time but is conceptually distinct from leakage — leakage is about energy spreading, not bin spacing.
\`\`\`
\`\`\`quiz
question: How is spectral leakage typically mitigated when applying the DFT to real-world signals?
a: By increasing the sampling rate.
b: By multiplying the time-domain signal with a windowing function (e.g., Hamming or Hanning) before computing the DFT.
c: By applying a high-pass filter.
d: By performing zero-padding to increase the number of frequency bins.
answer: b
explanation: Window functions taper the signal smoothly to zero at its edges, reducing the abrupt discontinuities that cause leakage. This trades a wider main lobe (slightly worse resolution) for dramatically lower sidelobes. Option (a) increases the Nyquist frequency but does nothing about the truncation discontinuity. Option (c) is unrelated — filtering removes frequency content rather than addressing spectral spreading. Option (d) interpolates the spectrum for smoother visualization but does not reduce leakage; the underlying sinc-like spreading remains.
\`\`\`
\`\`\`quiz
question: Why does multiplying two DFTs and taking the inverse DFT produce circular convolution rather than linear convolution?
a: Because the FFT algorithm introduces rounding errors that corrupt the convolution result.
b: Because the DFT implicitly treats the input sequence as periodic with period N, so the convolution wraps around at the boundaries.
c: Because the DFT only computes positive frequencies, discarding the negative frequency information needed for linear convolution.
d: Because circular convolution is simply the frequency-domain equivalent of multiplication, and they are identical operations.
answer: b
explanation: The DFT assumes the input signal is one period of a periodic sequence with period N. When you multiply DFTs and invert, the resulting convolution "wraps around" — the tail of the convolution folds back to the beginning, as if the signal repeated. To obtain linear convolution via DFT, you must zero-pad both sequences to length ≥ N + M − 1 to prevent this overlap. Option (a) is wrong — this is a mathematical property, not a numerical artifact. Option (c) is wrong — the DFT computes all N frequency points representing the full spectrum of one period. Option (d) confuses the issue — circular and linear convolution are different operations that only coincide when there is sufficient zero-padding.
\`\`\`
\`\`\`quiz
question: A signal of length N = 100 is analyzed with a DFT at sampling rate fs = 1000 Hz. What is the frequency resolution (bin spacing), and can zero-padding to N = 1000 improve it?
a: Δf = 10 Hz; yes, zero-padding to 1000 improves resolution to 1 Hz.
b: Δf = 10 Hz; no, zero-padding only interpolates the spectrum — true resolution remains 10 Hz.
c: Δf = 100 Hz; no, resolution is fixed by the sampling rate alone.
d: Δf = 1 Hz; yes, the resolution is always fs/N regardless of the original signal length.
answer: b
explanation: Frequency resolution is determined by the observation time T = N/fs = 0.1 s, giving Δf = 1/T = 10 Hz. Zero-padding increases the number of DFT bins (reducing bin spacing to fs/N_padded = 1 Hz), creating a smoother-looking spectrum, but it does not add new information — you still cannot resolve two frequency components closer than 10 Hz apart. Option (a) incorrectly claims zero-padding improves true resolution. Option (c) miscalculates the resolution. Option (d) confuses bin spacing with true resolution — they are only equal when no zero-padding is applied.
\`\`\`
`,
    labWalkthrough: `## 🔬 Lab 07 Walkthrough

This lab walks through practical implementations of the concepts covered in this week's homework. The following code demonstrates step-by-step applications.

### Step 1: Implementation

\`\`\`python
#--------------------------------------------------------------------------------------------
from pylab import *
import numpy as np
import types

#----------------------------------------------------------------    
def apply_window(x, window):
    """
    Apply a window to signal x.

    'window' can be:
    1. A function: window(x) returns a windowed version of x
    2. An array: same shape as x, applied multiplicatively

    In DSP terms:
    x_w[n] = x[n] * w[n]
    """
    if type(window) == types.FunctionType:
        # Window is a function that internally applies the weighting
        return window(x)
    else:
        # Window is an array → pointwise multiplication
        return window * x


#----------------------------------------------------------------    
def _spectral_helper(x, NFFT=256, Fs=2, detrend=detrend_none,
                 window=window_hanning, noverlap=0, pad_to=None):

    """
    Compute windowed, segmented FFT slices of a signal.

    This is a low-level routine used in spectral estimation (e.g. Welch PSD).

    Pipeline:
    1. Split signal into overlapping segments of length NFFT
    2. Detrend each segment
    3. Apply window (length NFFT!)
    4. Zero-pad to length pad_to (>= NFFT, power of 2)
    5. Compute FFT
    6. Keep only positive frequencies (one-sided spectrum)
    7. Apply proper normalization (window + Fs + one-sided scaling)

    Returns:
    - FFTSlices: normalized complex spectra (per segment)
    - freqs: frequency axis (0 → Fs/2)
    """

    # Original signal length
    n = len(x)

    #------------------------------------------------------------
    # Ensure we have at least one full segment
    #------------------------------------------------------------
    if len(x) < NFFT:
        # Resize to NFFT and zero-pad the rest
        x = np.resize(x, (NFFT,))
        x[n:] = 0
        # NOTE: np.resize may repeat data, but we overwrite with zeros

    #------------------------------------------------------------
    # FFT length selection
    #------------------------------------------------------------
    if pad_to is None:
        pad_to = NFFT

    # Force FFT length to next power of 2 (computational efficiency)
    pad_to = 2**int(np.ceil(np.log2(pad_to)))

    # Number of frequencies in one-sided spectrum
    # (DC → Nyquist)
    numFreqs = pad_to // 2 + 1

    #------------------------------------------------------------
    # Segment indexing (overlapping windows)
    #------------------------------------------------------------
    # Step size = hop = NFFT - noverlap
    ind = list(range(0, n - NFFT + 1, NFFT - noverlap))

    # Number of segments
    numSlices = len(ind)

    # Allocate array:
    # rows → time segments
    # cols → frequency bins
    FFTSlices = np.zeros((numSlices, numFreqs), dtype=np.complex_)

    # Simple list of indices for looping
    slices = list(range(numSlices))

    #------------------------------------------------------------
    # Window normalization (VERY IMPORTANT)
    #------------------------------------------------------------
    # Apply window to a constant signal of ones → yields window itself
    # Then compute L2 norm:
    # normVal = sqrt(sum w[n]^2)
    #
    # This ensures energy normalization:
    # compensates for attenuation introduced by the window
    normVal = np.linalg.norm(apply_window(np.ones(NFFT), window))

    #------------------------------------------------------------
    # Main loop: process each segment
    #------------------------------------------------------------
    for iSlice in slices:

        # Extract segment of length NFFT
        segment = x[ind[iSlice]:ind[iSlice] + NFFT]

        # Remove mean / trend if needed
        segment = detrend(segment)

        # Apply window (length NFFT!)
        segment = apply_window(segment, window)

        # Compute FFT:
        # - zero-padded to length pad_to
        # - gives finer frequency grid (interpolation), not higher resolution
        spectrum = np.fft.fft(segment, n=pad_to)

        # Keep only positive frequencies (one-sided spectrum)
        FFTSlices[iSlice, :] = spectrum[:numFreqs]

    #------------------------------------------------------------
    # Frequency axis
    #------------------------------------------------------------
    # f_k = k * Fs / pad_to
    freqs = float(Fs) / pad_to * np.arange(numFreqs)

    #------------------------------------------------------------
    # One-sided spectrum correction
    #------------------------------------------------------------
    # We removed negative frequencies.
    # For real signals:
    # |X(-f)|^2 = |X(f)|^2
    #
    # To preserve total energy:
    # double the power of interior bins
    # → multiply amplitudes by sqrt(2)
    #
    # DO NOT scale:
    # - DC (index 0)
    # - Nyquist (last index)
    FFTSlices[:, 1:-1] *= np.sqrt(2)

    #------------------------------------------------------------
    # Final normalization
    #------------------------------------------------------------
    # Divide by:
    # 1. normVal → window energy normalization
    # 2. sqrt(Fs) → ensures PSD units (V^2 / Hz after squaring)
    #
    # After this:
    # |FFTSlices|^2 behaves like a properly scaled PSD contribution
    return FFTSlices / normVal / np.sqrt(Fs), freqs

    #------------------------------------------------------------
    # NOTE (commented original line):
    # Pxx = mean(|Slices|^2)
    #
    # This function returns the building blocks for PSD:
    # averaging over slices is done outside
    #------------------------------------------------------------

#--------------------------------------------------------------------------------------------
def psd(x, NFFT=256, Fs=2, detrend=detrend_none, window=window_hanning, noverlap=0, pad_to=None):
    X, f =     _spectral_helper(x, NFFT, Fs, detrend, window, noverlap, pad_to)
    Pxx = np.abs(X)**2
    return Pxx.mean(axis=0), f
\`\`\`

*Explanation*: -------------------------------------------------------------------------------------------- ---------------------------------------------------------------- Window is a function that internally applies the weighting Window is an array → pointwise multiplication ---------------------------------------------------------------- Original signal length ------------------------------------------------------------ Ensure we have at least one full segment ------------------------------------------------------------ Resize to NFFT and zero-pad the rest NOTE: np.resize may repeat data, but we overwrite with zeros ------------------------------------------------------------ FFT length selection ------------------------------------------------------------ Force FFT length to next power of 2 (computational efficiency) Number of frequencies in one-sided spectrum (DC → Nyquist) ------------------------------------------------------------ Segment indexing (overlapping windows) ------------------------------------------------------------ Step size = hop = NFFT - noverlap Number of segments Allocate array: rows → time segments cols → frequency bins Simple list of indices for looping ------------------------------------------------------------ Window normalization (VERY IMPORTANT) ------------------------------------------------------------ Apply window to a constant signal of ones → yields window itself Then compute L2 norm: normVal = sqrt(sum w[n]^2)  This ensures energy normalization: compensates for attenuation introduced by the window ------------------------------------------------------------ Main loop: process each segment ------------------------------------------------------------ Extract segment of length NFFT Remove mean / trend if needed Apply window (length NFFT!) Compute FFT: - zero-padded to length pad_to - gives finer frequency grid (interpolation), not higher resolution Keep only positive frequencies (one-sided spectrum) ------------------------------------------------------------ Frequency axis ------------------------------------------------------------ f_k = k * Fs / pad_to ------------------------------------------------------------ One-sided spectrum correction ------------------------------------------------------------ We removed negative frequencies. For real signals: |X(-f)|^2 = |X(f)|^2  To preserve total energy: double the power of interior bins → multiply amplitudes by sqrt(2)  DO NOT scale: - DC (index 0) - Nyquist (last index) ------------------------------------------------------------ Final normalization ------------------------------------------------------------ Divide by: 1. normVal → window energy normalization 2. sqrt(Fs) → ensures PSD units (V^2 / Hz after squaring)  After this: |FFTSlices|^2 behaves like a properly scaled PSD contribution ------------------------------------------------------------ NOTE (commented original line): Pxx = mean(|Slices|^2)  This function returns the building blocks for PSD: averaging over slices is done outside ------------------------------------------------------------ --------------------------------------------------------------------------------------------

### Step 2: Implementation

\`\`\`python
from scipy.io import wavfile
import scipy.io
samplerate, data = wavfile.read("02. School Boy-9.wav")
print(samplerate, data.shape)
\`\`\`

### Step 3: Implementation

\`\`\`python
plot(data[10000:50000, 0])
\`\`\`

### Step 4: Implementation

\`\`\`python
s, f = psd(data[:, 0], Fs=samplerate, NFFT=2**15, noverlap=2**14, detrend=detrend_none)
figure(1)
semilogy(f, s)
#xlim([0, 10])
#ylim([0,100])
grid()
s
\`\`\`

*Explanation*: xlim([0, 10]) ylim([0,100])

### Step 5: Implementation

\`\`\`python
len(f) # NFFT//2 + 1
\`\`\`

### Step 6: Implementation

\`\`\`python
from scipy.signal import welch

f, s = welch(
    data[:, 0],
    fs=samplerate,
    window='hann',
    nperseg=2**15,
    noverlap=2**14,
    detrend=False,
    nfft=2**15,          # matches pad_to = NFFT
    return_onesided=True,
    scaling='density'    # ensures V^2/Hz
)
s
\`\`\`

### Step 7: Implementation

\`\`\`python
semilogy(f, s)
\`\`\`

### Step 9: Implementation

\`\`\`python
freq, Pxx = signal.welch(data[:, 0], fs=samplerate, nperseg=2**10, noverlap=2**9, window='box', detrend='constant')
semilogy(freq, Pxx)
#semilogy(f, s)
xlim([0, 5000])
print(s, Pxx)
print(len(s), len(Pxx))

--- Markdown Cell 10 ---
## Parseval theorem


$$
\\int_{-\\infty}^{\\infty} |x(t)|^2 \\, dt
=
\\int_{-\\infty}^{\\infty} |X(f)|^2 \\, df
$$
$$
\\sum_{n=0}^{N-1} |x[n]|^2
\`\`\`

*Explanation*: semilogy(f, s) Parseval theorem

### Step 10: Implementation

\`\`\`python
### Using FFT
import numpy as np

x = data[:, 0].astype(float)
N = len(x)

#------------------------------------------------------------
# Time-domain energy
#------------------------------------------------------------
E_time = np.sum(np.abs(x)**2)

#------------------------------------------------------------
# Frequency-domain energy
#------------------------------------------------------------
X = np.fft.fft(x)

E_freq = (1.0 / N) * np.sum(np.abs(X)**2)

E_time,  E_freq
\`\`\`

*Explanation*: Using FFT ------------------------------------------------------------ Time-domain energy ------------------------------------------------------------ ------------------------------------------------------------ Frequency-domain energy ------------------------------------------------------------

### Step 11: Implementation

\`\`\`python
### Using power spectral density

import numpy as np

x = data[:, 0].astype(float)
N = len(x)

# ------------------------------------------------------------
# Time-domain average power
# ------------------------------------------------------------
P_time = np.mean(np.abs(x)**2)

# ------------------------------------------------------------
# PSD from your routine
# no detrend, no window, no padding, no overlap
# ------------------------------------------------------------
s, f = psd(
    x,
    Fs=samplerate,
    NFFT=N,
    noverlap=0,
    detrend=detrend_none,
    window=ones(N),
    pad_to=N
)

# ------------------------------------------------------------
# Frequency-domain power from PSD
# ------------------------------------------------------------
P_freq_sum = np.sum(s) * (f[1] - f[0])

P_time, P_freq_sum
\`\`\`

*Explanation*: Using power spectral density ------------------------------------------------------------ Time-domain average power ------------------------------------------------------------ ------------------------------------------------------------ PSD from your routine no detrend, no window, no padding, no overlap ------------------------------------------------------------ ------------------------------------------------------------ Frequency-domain power from PSD ------------------------------------------------------------

### Step 12: Implementation

\`\`\`python
f, s = welch(
    x,
    fs=samplerate,
    window='boxcar',
    nperseg=N,
    noverlap=0,
    detrend=False,
    nfft=N,          # matches pad_to = NFFT
    return_onesided=True,
    scaling='density'    # ensures V^2/Hz
)
P_freq_sum = np.sum(s) * (f[1] - f[0])
P_time, P_freq_sum
\`\`\`

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
        name: 'Inverse Laplace Transform and System Poles',
        explanation: `The Inverse Laplace Transform, often solved via partial fraction expansion, characterizes the time-domain components of a signal based on the poles (roots of the denominator polynomial) of its transform $Y(s)$:

- Real pole at $s = a$: Corresponds to an exponential term $e^{at}$. If $a > 0$, the signal grows (unstable); if $a < 0$, it decays (stable).
- Complex conjugate poles at $s = \pm i\omega$: Correspond to constant-amplitude harmonic oscillations ($\sin \omega t$, $\cos \omega t$).
- Poles at the origin ($s=0$): Correspond to step functions (DC, non-oscillating).
- Higher-order poles (multiplicity $k > 1$): Correspond to the basic term multiplied by $t^{k-1}$, e.g., $\frac{1}{(s-a)^2} \iff t e^{at}$.`
      },
      {
        name: 'Solving Differential Equations with Laplace Transform',
        explanation: `The Laplace transform converts linear differential equations into algebraic equations, automatically incorporating initial conditions. Using the derivative property $\mathcal{L}[y'] = sY(s) - y(0)$ and $\mathcal{L}[y''] = s^2Y(s) - sy(0) - y'(0)$, the system equation becomes $Y(s) = \frac{\text{Initial Conditions}}{P(s)} + \frac{G(s)}{P(s)}$.

The inverse transform of the resulting expression separates naturally into the **transient response** (decaying terms generated by initial conditions and system poles) and the **steady-state response** (driven by the input function $g(t)$).`
      },
      {
        name: 'Frequency Response of Continuous LTI Systems',
        explanation: `For an LTI system defined by a transfer function $H(s) = \mathcal{L}[h(t)]$, the steady-state response to an oscillatory input $x(t) = e^{i\omega t}$ is governed by $H(i\omega)$, which is $H(s)$ evaluated along the imaginary axis ($s = i\omega$).

The output is $y(t) = |H(i\omega)| e^{i(\omega t + \theta(\omega))}$. This gives rise to the **Bode Plot**, which visualizes:
- **Gain:** $|H(i\omega)|$ plotted in decibels (dB).
- **Phase:** $\angle H(i\omega) = \theta(\omega)$ plotted in degrees.
All-pole filters $H(s) = 1/P(s)$ can only function as low-pass or band-pass filters.`
      },
      {
        name: 'Polynomial Representation and the z-Transform',
        explanation: `A discrete sequence $x[n]$ can be represented as coefficients of a polynomial or a power series. The convolution of two sequences corresponds directly to the algebraic multiplication of their representative polynomials. 

The z-transform formalizes this concept for infinite sequences:
$$X(z) = \sum_{n=-\infty}^\infty x[n] z^{-n}, \quad z \in \mathbb{C}$$
$z^n$ acts as an eigenvector of the LTI convolution operator, with the eigenvalue being the transfer function evaluated at $z$. The z-transform is uniquely defined only when paired with its Region of Convergence (ROC).`
      },
      {
        name: 'Relationship between z-Transform and Fourier Transform',
        explanation: `The z-transform is a generalization of the Discrete-Time Fourier Transform (DTFT). The DTFT is obtained by restricting the z-transform strictly to the unit circle in the complex plane, i.e., $z = e^{i\omega}$. Thus, $X(e^{i\omega})$ is the DTFT. If the Region of Convergence (ROC) does not include the unit circle, the Fourier transform of the sequence does not converge.`
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
d: A lossy compression of the DFT that trades accuracy for speed.
answer: b
explanation: The FFT computes the exact same result as the DFT — it is an algorithm, not a different transform. The Cooley-Tukey algorithm exploits symmetries in the twiddle factors to reduce O(N²) multiplications to O(N log N). Option (a) is wrong because the FFT produces exactly the same output as the direct DFT, not an approximation. Option (c) is wrong — the FFT is a computational algorithm, not hardware. Option (d) is wrong because the FFT is lossless; it gives bit-identical results to the naive DFT computation.
\`\`\`
\`\`\`quiz
question: What is the primary effect of zero-padding a signal in the time domain before computing its FFT?
a: It fundamentally increases the true frequency resolution (ability to distinguish close frequencies).
b: It removes spectral leakage and the need for a windowing function.
c: It interpolates the frequency spectrum, providing a smoother visual representation with more frequency bins, but does not improve true resolution.
d: It increases the signal-to-noise ratio of the FFT output.
answer: c
explanation: Zero-padding appends zeros to the time-domain signal, increasing the DFT length and thus reducing bin spacing (more frequency samples). This produces a smoother-looking spectrum by interpolating between the original frequency samples, but the underlying resolution — determined by the original signal duration — remains unchanged. Option (a) is a common misconception; true resolution depends on observation time, not DFT length. Option (b) is wrong because leakage is caused by truncation, which zero-padding does not fix. Option (d) is wrong — adding zeros doesn't add signal information, so SNR doesn't improve.
\`\`\`
\`\`\`quiz
question: Which structural property of the DFT matrix is exploited by radix-2 FFT algorithms?
a: The fact that it is a sparse matrix with mostly zeros.
b: The symmetry and periodicity of the "twiddle factors" (complex roots of unity).
c: The fact that it only contains real numbers.
d: The orthogonality of the DFT matrix rows, which allows parallel row computation.
answer: b
explanation: The radix-2 FFT exploits two key properties of twiddle factors W_N^k = e^{-j2πk/N}: (1) periodicity — W_N^{k+N} = W_N^k, and (2) symmetry — W_N^{k+N/2} = -W_N^k. These properties allow the N-point DFT to be recursively split into two N/2-point DFTs, reusing computed values. Option (a) is wrong — the DFT matrix is dense (all entries are nonzero complex exponentials). Option (c) is wrong — the DFT matrix contains complex numbers. Option (d) describes a real property of the DFT matrix but is not what enables the FFT's divide-and-conquer speedup.
\`\`\`
\`\`\`quiz
question: In the radix-2 DIT-FFT butterfly operation, the two outputs are computed as X[k] = G[k] + W_N^k · H[k] and X[k+N/2] = G[k] - W_N^k · H[k]. Why does the second equation use subtraction instead of a different twiddle factor?
a: Subtraction is used as an approximation to save computation, introducing a small acceptable error.
b: Because W_N^{k+N/2} = -W_N^k due to the half-period symmetry of complex exponentials, so the second half naturally uses the negated twiddle factor.
c: Because the odd-indexed samples are always subtracted from even-indexed samples by convention.
d: Because the imaginary parts of twiddle factors are always zero for the second half of the DFT.
answer: b
explanation: The critical identity W_N^{k+N/2} = e^{-j2π(k+N/2)/N} = e^{-j2πk/N} · e^{-jπ} = -W_N^k means that the twiddle factor for index k+N/2 is simply the negative of the twiddle factor for index k. This eliminates the need for a separate multiplication — you compute W_N^k · H[k] once and use it twice (added and subtracted). Option (a) is wrong — there is no approximation; the result is exact. Option (c) is wrong — it's not a convention but a mathematical identity. Option (d) is wrong — twiddle factors are generally complex numbers with nonzero imaginary parts.
\`\`\`
\`\`\`quiz
question: An 8-point radix-2 FFT requires how many stages of butterfly operations, and how many complex multiplications total?
a: 2 stages, 8 multiplications
b: 3 stages, 12 multiplications
c: 8 stages, 64 multiplications
d: 4 stages, 16 multiplications
answer: b
explanation: For N = 8 = 2³, the radix-2 FFT requires log₂(8) = 3 stages. Each stage contains N/2 = 4 butterfly operations, and each butterfly requires 1 complex multiplication. Total multiplications = 3 × 4 = 12 = (N/2)·log₂(N). Compare this to the direct DFT which would require N² = 64 multiplications. Option (a) undercounts both stages and multiplications. Option (c) describes the brute-force DFT cost, not the FFT. Option (d) overcounts the stages — log₂(8) = 3, not 4.
\`\`\`
`,
    labWalkthrough: `## 🔬 Lab 08 Walkthrough

This lab walks through practical implementations of the concepts covered in this week's homework. The following code demonstrates step-by-step applications.

### Step 1: Bode Plot Implementation

\`\`\`python
from pylab import *
from scipy import signal

# Define Transfer Function: H(s) = (s+1)/(s+2)
num, den = [1, 1], [1, 2]

# Compute empirical Bode plot
w, gain, phase = signal.bode((num, den))

# Define theoretical functions
def gain_theory(w):
    return 20*log10(sqrt(w**2 + 1)/sqrt(w**2+4))
    
def phase_theory(w):
    return (arctan(w) - arctan(w/2))*180/pi

# Plotting the results
plot(w, gain, linewidth=7, alpha=0.5, label='gain numeric') 
plot(w, gain_theory(w), 'k-', label='gain theory')
plot([0], [gain_theory(0)], 'ro', [2], [gain_theory(2)], 'go')
grid()
legend()
\`\`\`

*Explanation*: This code constructs a continuous-time transfer function $H(s)$ and utilizes \`scipy.signal.bode\` to compute its frequency response. We overlay the theoretical calculations of magnitude and phase to verify the empirical result.
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
        name: 'Mapping from s-Plane to z-Plane',
        explanation: `Sampling a continuous-time signal with period $T$ maps the Laplace transform variable $s = \sigma + i\omega$ to the z-transform variable $z$ via the exponential mapping:

$$z = e^{sT} = e^{\sigma T} e^{i\omega T} = |z| e^{i\omega T}$$

This mapping transforms the left half of the s-plane ($\sigma < 0$, continuous stability region) strictly into the interior of the unit circle in the z-plane ($|z| < 1$, discrete stability region). The imaginary axis ($\sigma = 0$) maps precisely onto the unit circle ($|z| = 1$).`
      },
      {
        name: 'Transfer Functions of FIR and IIR Filters',
        explanation: `The transfer function $H(z) = Y(z)/X(z)$ describes an LTI system in the z-domain.

- **FIR (Finite Impulse Response) Filters:** Governed by non-recursive difference equations $y[n] = \sum a_l x[n-l]$. The transfer function $H(z) = \sum a_l z^{-l}$ has only zeros (and poles at the origin). FIR filters are inherently stable and can maintain perfectly linear phase.
- **IIR (Infinite Impulse Response) Filters:** Characterized by recursive feedback $\sum b_l y[n-l] = \sum a_l x[n-l]$. The transfer function is a rational polynomial $H(z) = A(z)/B(z)$. The roots of $B(z)$ become the poles of the system. IIR filters require fewer coefficients to achieve steep roll-offs but face stability issues and non-linear phase distortion.`
      },
      {
        name: 'System Stability in the z-Domain',
        explanation: `For a causal discrete-time LTI system to be bounded-input bounded-output (BIBO) stable, all the poles of its transfer function $H(z)$ must reside strictly inside the unit circle on the complex z-plane. If any pole is outside the unit circle ($|z| > 1$), the impulse response grows exponentially; if a pole lies exactly on the unit circle ($|z| = 1$), the system is marginally stable (oscillates perpetually).`
      },
      {
        name: 'Frequency Response from the z-Plane',
        explanation: `The frequency response of a digital filter is determined by evaluating $H(z)$ along the unit circle ($z = e^{i\omega T}$). As frequency increases from $0$ to the Nyquist frequency $f_s/2$, the evaluation point moves counter-clockwise along the upper half of the unit circle from $z = 1$ (DC) to $z = -1$.

Geometrically, the response at any frequency point on the unit circle can be calculated using the distances to the system's poles and zeros:
- **Gain:** Proportional to $\frac{\prod \text{zero distances}}{\prod \text{pole distances}}$
- **Phase Angle:** $\sum \text{zero angles} - \sum \text{pole angles}$`
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
d: An IIR filter is always unstable, while an FIR filter is always stable.
answer: b
explanation: IIR filters have feedback paths (nonzero denominator coefficients a_k), which create poles in the transfer function. These poles cause the impulse response to decay exponentially but never truly reach zero — hence "infinite" impulse response. Option (a) is wrong — IIR filters require both feed-forward (b_k) and feedback (a_k) coefficients; it's FIR filters that only use feed-forward coefficients. Option (c) is wrong — IIR filters generally have nonlinear phase; it's FIR filters that can achieve exactly linear phase. Option (d) is wrong — IIR filters can be stable if all poles lie inside the unit circle, which is the normal design goal.
\`\`\`
\`\`\`quiz
question: The Bilinear Transform is a popular method for IIR filter design. What does it do?
a: It converts a continuous-time (analog) filter transfer function H(s) into a discrete-time digital filter H(z).
b: It transforms a time-domain signal directly into the frequency domain.
c: It ensures that the resulting digital filter has finite impulse response.
d: It maps the unit circle of the z-plane to the imaginary axis of the s-plane.
answer: a
explanation: The bilinear transform substitutes s = (2/Ts)·(1 - z⁻¹)/(1 + z⁻¹) into an analog prototype H(s) to produce a digital filter H(z). This mapping takes a well-understood analog design (e.g., Butterworth) and converts it to a digital implementation. Option (b) describes the Fourier transform, not the bilinear transform. Option (c) is wrong — the bilinear transform preserves the IIR nature of analog filters (they become digital IIR, not FIR). Option (d) has the mapping direction reversed — the bilinear transform maps the imaginary axis of the s-plane to the unit circle of the z-plane (stable analog → stable digital).
\`\`\`
\`\`\`quiz
question: Which of the following analog filter prototypes is characterized by a "maximally flat" passband with no ripple?
a: Chebyshev Type I
b: Elliptic
c: Butterworth
d: Bessel
answer: c
explanation: The Butterworth filter is defined by its maximally flat magnitude response — the first 2N−1 derivatives of |H(jΩ)|² are zero at Ω = 0, ensuring no passband ripple. Option (a) is wrong — Chebyshev Type I deliberately introduces equiripple in the passband to achieve a steeper rolloff. Option (b) is wrong — Elliptic (Cauer) filters have ripple in both passband and stopband for the sharpest possible transition. Option (d) is a good distractor — the Bessel filter is maximally flat in its group delay (phase), not its magnitude response.
\`\`\`
\`\`\`quiz
question: When using the bilinear transform, why is "pre-warping" the critical frequency necessary?
a: To compensate for the nonlinear frequency mapping between the analog Ω-axis and the digital ω-axis, ensuring the cutoff frequency lands at the correct digital frequency.
b: To prevent the digital filter from becoming unstable due to pole migration.
c: To convert the filter from lowpass to highpass or bandpass configurations.
d: To reduce the computational complexity of the resulting digital filter.
answer: a
explanation: The bilinear transform compresses the entire infinite analog frequency axis (−∞ to ∞) onto the finite digital frequency range (−π to π). This mapping is nonlinear: ω = 2·arctan(Ω·Ts/2). Without pre-warping, the designed cutoff frequency would shift to the wrong location in the digital domain. Pre-warping adjusts the analog prototype's cutoff to Ω_pre = (2/Ts)·tan(ω_c/2) so that after the nonlinear mapping, the digital cutoff lands exactly where intended. Option (b) is wrong — the bilinear transform inherently preserves stability (left half-plane maps to inside unit circle). Option (c) describes frequency transformation, not pre-warping. Option (d) is wrong — pre-warping affects accuracy, not complexity.
\`\`\`
\`\`\`quiz
question: For a causal digital IIR filter to be BIBO (Bounded-Input Bounded-Output) stable, what condition must its poles satisfy?
a: All poles must lie on the unit circle in the z-plane.
b: All poles must have positive real parts.
c: All poles must lie strictly inside the unit circle (|z| < 1) in the z-plane.
d: The number of poles must equal the number of zeros.
answer: c
explanation: For a causal system, BIBO stability requires that the impulse response be absolutely summable, which occurs when all poles have magnitude strictly less than 1 (inside the unit circle). Poles inside the unit circle produce exponentially decaying modes in the impulse response. Option (a) is wrong — poles on the unit circle (|z| = 1) produce sustained oscillations (marginally stable), and repeated poles on the unit circle cause growing oscillations (unstable). Option (b) describes s-plane instability conditions for continuous systems, not z-plane. Option (d) is unrelated — the number of poles vs. zeros affects the transfer function's high-frequency behavior but has nothing to do with stability.
\`\`\`
`,
    labWalkthrough: `## 🔬 Lab 09 Walkthrough

This lab walks through practical implementations of the concepts covered in this week's homework. The following code demonstrates step-by-step applications.

### Step 1: IIR Filter Design (Butterworth)

\`\`\`python
import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

# Design specifications
fs = 1000       # Sampling frequency in Hz
fc = 100        # Cutoff frequency in Hz
order = 4       # Filter order

# Design a 4th-order lowpass Butterworth IIR filter
b, a = signal.butter(order, fc, btype='low', fs=fs)

# Compute frequency response
w, h = signal.freqz(b, a, fs=fs)

# Plot magnitude response
plt.figure()
plt.plot(w, 20 * np.log10(abs(h)))
plt.title('Butterworth Lowpass Filter Response')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude (dB)')
plt.grid()
plt.axvline(fc, color='red', linestyle='--')
plt.show()
\`\`\`

*Explanation*: We use the \`signal.butter\` function to design an IIR filter. It calculates the difference equation coefficients (b for feedforward, a for feedback). We then compute the frequency response using \`signal.freqz\` and plot it, confirming the -3dB cutoff at exactly 100 Hz.
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
