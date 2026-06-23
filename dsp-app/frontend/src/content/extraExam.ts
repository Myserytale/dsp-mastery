import type { WeekContent } from './index';

export const extraExam: WeekContent[] = [
  {
    id: 16,
    title: 'Extra Exam Solutions',
    bigPicture: '',
    concepts: [],
    homeworkGuide: `
# Extra Exam Solutions

This section contains comprehensive solutions to the requested theoretical and practical problems.

## 1. Theoretical Questions

### Q1: Sampling Frequency vs Period vs Rate
* **Sampling Frequency ($f_s$):** The number of samples obtained in one second, expressed in Hertz (Hz).
* **Sampling Period ($T_s$):** The time interval between two consecutive samples. It is the exact reciprocal of the sampling frequency ($T_s = 1/f_s$), expressed in seconds.
* **Sampling Rate:** A broader term often used interchangeably with sampling frequency, but it can refer specifically to the velocity at which data is collected (e.g., "samples per second").

### Q2: Convolution Operation
**Continuous-Time Convolution:**
$$ (f * g)(t) = \\int_{-\\infty}^{\\infty} f(\\tau)g(t-\\tau) d\\tau $$
**Discrete-Time Convolution:**
$$ (f * g)[n] = \\sum_{k=-\\infty}^{\\infty} f[k]g[n-k] $$
**Role in Signal Processing:** Convolution calculates the output of any Linear Time-Invariant (LTI) system. By convolving an input signal with the system's impulse response, we can determine exactly how the system will react to that input.

### Q3: FIR System
A **Finite Impulse Response (FIR)** system is a discrete-time filter whose impulse response settles to zero in finite time. Its output depends only on present and past inputs, making it inherently stable and capable of perfect linear phase.

**Difference Equation / Signal Flow:**
$$ y[n] = \\sum_{k=0}^{M} b_k x[n-k] $$
*(A block diagram would consist of a tapped delay line with $z^{-1}$ blocks, multiplied by coefficients $b_k$, and summed together).*

### Q4: Z-Transform
**Definition:** 
$$ X(z) = \\sum_{n=-\\infty}^{\\infty} x[n] z^{-n} $$
**Role:** It is the discrete-time equivalent of the Laplace transform. It converts linear difference equations into simple algebraic equations, allowing us to easily analyze system stability and frequency response by plotting poles and zeros in the complex z-plane.

### Q5: Computational Complexity of FFT
The computational complexity of the Fast Fourier Transform (FFT) is $\\mathcal{O}(N \\log_2 N)$, where $N$ is the number of points. This is a massive improvement over the $\\mathcal{O}(N^2)$ complexity of the naive Discrete Fourier Transform (DFT).

### Q6: Bode Plot
A **Bode plot** is a graph of the frequency response of a system. 
**Key Components:**
1. **Magnitude Plot:** Gain (in decibels, dB) plotted against a logarithmic frequency axis.
2. **Phase Plot:** Phase shift (in degrees or radians) plotted against a logarithmic frequency axis.
**Usage:** It is used to quickly evaluate continuous-time system stability (identifying gain and phase margins) and to characterize filter cutoff frequencies and roll-off rates.

### Q7: Invariant Impulse Response Method
The **Impulse Invariance Method** is a technique to design a digital filter directly from an analog filter. It involves sampling the impulse response of the analog filter:
$$ h[n] = T_s h_a(n T_s) $$
This yields a digital filter that identically matches the time-domain impulse response of the analog prototype. However, its major drawback is that it can suffer from severe frequency **aliasing** if the analog filter is not strictly bandlimited.

### Q8: Fourier/Window Method for FIR Filters
1. **Ideal Response:** Start with the ideal frequency response (e.g., a perfect rectangle for a low-pass filter).
2. **Inverse Fourier Transform:** Calculate the Inverse Discrete-Time Fourier Transform (IDTFT) to get the ideal impulse response (which is a sinc function). This ideal response is infinitely long and non-causal.
3. **Truncation & Shifting:** Truncate the response to a finite length and shift it to the right to make it causal.
4. **Windowing:** Multiply the truncated impulse response by a smoothing window function (like Hamming, Hann, or Blackman). This tapers the ends to zero, dramatically reducing the "Gibbs phenomenon" (the ringing/ripples in the frequency response caused by abrupt truncation).

### Q9: Wavelets, Scaling Functions, and Filters
In Multi-Resolution Analysis (MRA) for the Discrete Wavelet Transform (DWT):
* **Scaling Functions** correspond to **Low-Pass Filters**. They capture the coarse approximation (the low-frequency trend) of the signal.
* **Wavelet Functions** correspond to **High-Pass Filters**. They capture the fine details (the high-frequency fluctuations) of the signal.
Together, they form a **filter bank** that recursively decomposes a signal into different frequency bands at different resolutions.

---

## 2. Problems

### Q1: System Properties: $y[n] = |x[n]|$
Let's test the system for the five key properties:
* **Linearity (Non-linear):** 
  If $x_1[n] = 1 \\implies y_1[n] = 1$. 
  If $x_2[n] = -1 \\implies y_2[n] = 1$. 
  The sum of outputs is $1 + 1 = 2$. The output of the sum is $|1 + (-1)| = 0$. Since $2 \\neq 0$, the system is **non-linear**.
* **Time-Invariance (Time-invariant):** Delaying the input by $k$ gives $|x[n-k]|$. Delaying the output gives $y[n-k] = |x[n-k]|$. They are identical, so it is **time-invariant**.
* **Causality (Causal):** The output at time $n$ depends only on the input at the exact same time $n$. It does not look into the future, so it is **causal**.
* **Memory (Memoryless):** The output at time $n$ depends *only* on the current input at time $n$ (not past inputs). It is **memoryless**.
* **Stability (BIBO Stable):** If the input is bounded ($|x[n]| \\le B_x$), then the output is also bounded ($|y[n]| = |x[n]| \\le B_x$). It is **stable**.

---

### Q2: Discrete-Time Signal $x(n)$
Given: $x(n) = -0.3\\delta(n+2) + 2.0\\delta(n) + 1.5\\delta(n-3) - \\delta(n-5)$

**(a) Sketch $x(n)$**
The signal consists of four discrete impulses (stems) at specific indices:
* At $n = -2$, amplitude is $-0.3$
* At $n = 0$, amplitude is $2.0$
* At $n = 3$, amplitude is $1.5$
* At $n = 5$, amplitude is $-1.0$
*(All other values are exactly 0).*

**(b) Z-transform $X(z)$**
Using the property $Z[\\delta(n-k)] = z^{-k}$:
$$ X(z) = -0.3z^2 + 2.0 + 1.5z^{-3} - z^{-5} $$

**(c) Define $G(z) = z^{-2} X(z)$. Sketch $g(n)$**
Multiplying by $z^{-2}$ acts as a time delay of 2 samples:
$$ G(z) = z^{-2}(-0.3z^2 + 2.0 + 1.5z^{-3} - z^{-5}) = -0.3 + 2.0z^{-2} + 1.5z^{-5} - z^{-7} $$
Taking the inverse Z-transform yields:
$$ g(n) = -0.3\\delta(n) + 2.0\\delta(n-2) + 1.5\\delta(n-5) - \\delta(n-7) $$
*Sketch:* This is the exact same signal as $x(n)$, but every stem has been shifted **to the right by 2 samples**.

---

### Q3: Continuous-Time System
Given transfer function: 
$$ H(s) = \\frac{s+1}{s^2+2s+2} $$

**(a) Determine the impulse response $h(t)$**
Complete the square in the denominator: $s^2 + 2s + 2 = (s^2 + 2s + 1) + 1 = (s+1)^2 + 1$.
$$ H(s) = \\frac{s+1}{(s+1)^2 + 1} $$
Using standard Laplace tables (specifically $\\frac{s-a}{(s-a)^2 + \\omega^2} \\iff e^{at} \\cos(\\omega t) u(t)$), we find:
$$ h(t) = e^{-t} \\cos(t) u(t) $$

**(b) Determine the output $y(t)$ for input $x(t) = e^{-t} u(t)$**
The Laplace transform of the input is $X(s) = \\frac{1}{s+1}$.
The output in the s-domain is $Y(s) = H(s)X(s)$:
$$ Y(s) = \\frac{s+1}{(s+1)^2+1} \\cdot \\frac{1}{s+1} = \\frac{1}{(s+1)^2+1} $$
Using standard Laplace tables (specifically $\\frac{\\omega}{(s-a)^2 + \\omega^2} \\iff e^{at} \\sin(\\omega t) u(t)$), we find:
$$ y(t) = e^{-t} \\sin(t) u(t) $$

**(c) Pole-Zero Diagram and Gain/Phase Responses**
* **Poles:** Roots of $(s+1)^2 + 1 = 0 \\implies (s+1)^2 = -1 \\implies s = -1 \\pm j$.
* **Zero:** Root of $s+1 = 0 \\implies s = -1$.
*(The diagram has a zero at $(-1, 0)$ and two complex conjugate poles at $(-1, 1)$ and $(-1, -1)$).*

To find the frequency response, evaluate $H(s)$ at $s = j\\omega$:
$$ H(j\\omega) = \\frac{j\\omega+1}{(j\\omega)^2+2j\\omega+2} = \\frac{1+j\\omega}{(2-\\omega^2) + 2j\\omega} $$

* **At $\\omega = 0$ rad/s:** 
  $H(j0) = \\frac{1}{2}$. 
  **Gain = 0.5, Phase = $0^\\circ$**
* **At $\\omega = 1$ rad/s:** 
  $H(j1) = \\frac{1+j}{1+2j} = \\frac{(1+j)(1-2j)}{1^2+2^2} = \\frac{1 - 2j + j - 2j^2}{5} = \\frac{3-j}{5} = 0.6 - 0.2j$.
  **Gain** $= \\sqrt{0.6^2 + (-0.2)^2} = \\sqrt{0.36 + 0.04} = \\sqrt{0.4} \\approx 0.632$
  **Phase** $= \\arctan\\left(\\frac{-0.2}{0.6}\\right) = \\arctan(-1/3) \\approx -18.4^\\circ$
* **At $\\omega = 2$ rad/s:** 
  $H(j2) = \\frac{1+2j}{(2-4)+4j} = \\frac{1+2j}{-2+4j} = \\frac{(1+2j)(-2-4j)}{(-2)^2+4^2} = \\frac{-2 - 4j - 4j - 8j^2}{4+16} = \\frac{6-8j}{20} = 0.3 - 0.4j$.
  **Gain** $= \\sqrt{0.3^2 + (-0.4)^2} = \\sqrt{0.09 + 0.16} = \\sqrt{0.25} = 0.5$
  **Phase** $= \\arctan\\left(\\frac{-0.4}{0.3}\\right) \\approx -53.1^\\circ$
* **At $\\omega \\to \\infty$:** 
  $H(j\\infty) \\approx \\frac{j\\omega}{-\\omega^2} = \\frac{1}{j\\omega} \\to 0$. 
  **Gain $\\to 0$, Phase $\\to -90^\\circ$**

**(d) Bilinear Transform Digital Filter Design ($T=1$)**
The Bilinear Transform substitution is:
$$ s = \\frac{2}{T} \\frac{1-z^{-1}}{1+z^{-1}} = 2 \\frac{1-z^{-1}}{1+z^{-1}} \\quad \\text{(since } T=1\\text{)} $$
Substitute into $H(s) = \\frac{s+1}{s^2+2s+2}$:
$$ H(z) = \\frac{ 2\\left(\\frac{1-z^{-1}}{1+z^{-1}}\\right) + 1 }{ 4\\left(\\frac{1-z^{-1}}{1+z^{-1}}\\right)^2 + 4\\left(\\frac{1-z^{-1}}{1+z^{-1}}\\right) + 2 } $$
Multiply numerator and denominator by $(1+z^{-1})^2$:
**Numerator:** 
$= [2(1-z^{-1}) + (1+z^{-1})] \\cdot (1+z^{-1})$
$= (3 - z^{-1})(1+z^{-1}) = 3 + 3z^{-1} - z^{-1} - z^{-2} = 3 + 2z^{-1} - z^{-2}$
**Denominator:**
$= 4(1-z^{-1})^2 + 4(1-z^{-1})(1+z^{-1}) + 2(1+z^{-1})^2$
$= 4(1 - 2z^{-1} + z^{-2}) + 4(1 - z^{-2}) + 2(1 + 2z^{-1} + z^{-2})$
$= (4 - 8z^{-1} + 4z^{-2}) + (4 - 4z^{-2}) + (2 + 4z^{-1} + 2z^{-2})$
$= 10 - 4z^{-1} + 2z^{-2}$

**Digital Transfer Function $H(z)$:**
$$ H(z) = \\frac{3 + 2z^{-1} - z^{-2}}{10 - 4z^{-1} + 2z^{-2}} $$
Normalize by dividing by 10 to get the standard form:
$$ H(z) = \\frac{Y(z)}{X(z)} = \\frac{0.3 + 0.2z^{-1} - 0.1z^{-2}}{1 - 0.4z^{-1} + 0.2z^{-2}} $$

**Difference Equation:**
Cross-multiply to get:
$$ Y(z)(1 - 0.4z^{-1} + 0.2z^{-2}) = X(z)(0.3 + 0.2z^{-1} - 0.1z^{-2}) $$
$$ y[n] - 0.4y[n-1] + 0.2y[n-2] = 0.3x[n] + 0.2x[n-1] - 0.1x[n-2] $$
Rearranging to solve for $y[n]$:
$$ y[n] = 0.4y[n-1] - 0.2y[n-2] + 0.3x[n] + 0.2x[n-1] - 0.1x[n-2] $$

---

## 3. Programming Tasks

### Task 1: Signal Generation & Sampling Theorem
This task involves generating a finite support, symmetric random signal in the frequency domain, interpreting it via the inverse Fourier transform, and demonstrating the Nyquist sampling theorem.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
import scipy.signal as signal

# (a) Generate a finite support, symmetric random signal (in frequency space)
N = 128
half_N = N // 2
np.random.seed(42)
X_half = np.random.randn(half_N)
# Make it perfectly symmetric
X_freq = np.concatenate([X_half, X_half[::-1]])

plt.figure(figsize=(10, 3))
plt.plot(X_freq, 'g')
plt.title("(a) Finite Support Symmetric Signal $X(f)$")
plt.show()

# (b) Find the original continuous signal (Inverse FFT)
# Since X(f) is real and symmetric, x(t) will be real and symmetric
x_t = np.fft.ifft(X_freq)
x_t = np.fft.fftshift(np.real(x_t)) # Shift to center

plt.figure(figsize=(10, 3))
plt.plot(x_t)
plt.title("(b) Original Signal $x(t)$ (Time Domain)")
plt.show()

# (c) Demonstrate the effect of sampling
M = 4 # Downsampling factor
# Sample the signal by taking every M-th point
x_sampled = x_t[::M]

plt.figure(figsize=(10, 3))
plt.stem(np.arange(0, N, M), x_sampled, basefmt=" ")
plt.title("(c) Sampled Signal $x[n]$")
plt.show()

# (d) Reconstruct the original continuous signal (Nyquist Theorem)
# We can accurately reconstruct using sinc interpolation (zero-padding in frequency domain)
# scipy.signal.resample performs exactly this FFT-based reconstruction!
x_reconstructed = signal.resample(x_sampled, N)

plt.figure(figsize=(10, 4))
plt.plot(x_t, label="Original $x(t)$", alpha=0.7)
plt.plot(np.arange(0, N, M), x_sampled, 'ro', label="Samples")
plt.plot(x_reconstructed, '--', label="Reconstructed", alpha=0.7)
plt.title("(d) Reconstruction from Samples")
plt.legend()
plt.show()
\`\`\`

### Task 2: Spectral Analysis & Filtering
We will generate a non-stationary signal with overlapping 50Hz and 100Hz components, and analyze it using spectrograms and wavelets.

\`\`\`python
import numpy as np
import scipy.signal as signal
import matplotlib.pyplot as plt

# (a) Generate the signal
fs = 500
t = np.arange(0, 20, 1/fs) # 20 seconds

# 50 Hz from 0 to 10s
sig50 = np.sin(2 * np.pi * 50 * t) * (t < 10)
# 100 Hz from 5 to 20s
sig100 = np.sin(2 * np.pi * 100 * t) * ((t >= 5) & (t < 20))

sig = sig50 + sig100

# (b) Spectrogram
f_spec, t_spec, Sxx = signal.spectrogram(sig, fs, nperseg=512, noverlap=256)

plt.figure(figsize=(10, 4))
plt.pcolormesh(t_spec, f_spec, 10 * np.log10(Sxx), shading='gouraud', cmap='viridis')
plt.title("(b) Spectrogram of Original Signal")
plt.ylabel('Frequency [Hz]')
plt.xlabel('Time [sec]')
plt.ylim(0, 150)
plt.colorbar(label='Power/Frequency (dB/Hz)')
plt.show()

# (c) Continuous Wavelet Transform (CWT)
widths = np.arange(1, 40)
# Using Morlet wavelet which is excellent for frequency localization
cwtmatr = signal.cwt(sig, signal.morlet2, widths, w=5.0)

plt.figure(figsize=(10, 4))
plt.pcolormesh(t, widths, np.abs(cwtmatr), shading='gouraud', cmap='magma')
plt.title("(c) Continuous Wavelet Transform (CWT Magnitude)")
plt.ylabel('Scale (Width)')
plt.xlabel('Time [sec]')
plt.show()

# (d) Apply a Bandpass Filter to isolate the 100 Hz oscillation
# Butterworth bandpass filter [90Hz, 110Hz]
b_bp, a_bp = signal.butter(4, [90, 110], btype='bandpass', fs=fs)
sig_filtered = signal.filtfilt(b_bp, a_bp, sig)

# Filtered PSD
f_psd, Pxx = signal.welch(sig_filtered, fs, nperseg=1024)
plt.figure(figsize=(10, 3))
plt.semilogy(f_psd, Pxx)
plt.title("(d) PSD of Filtered Signal (100 Hz Isolated)")
plt.xlim(0, 150)
plt.show()

# Filtered Spectrogram
f_spec_filt, t_spec_filt, Sxx_filt = signal.spectrogram(sig_filtered, fs, nperseg=512)
plt.figure(figsize=(10, 4))
plt.pcolormesh(t_spec_filt, f_spec_filt, 10 * np.log10(Sxx_filt), shading='gouraud')
plt.title("(d) Spectrogram of Filtered Signal")
plt.ylim(0, 150)
plt.show()
\`\`\`

### Task 3: Digital IIR Filter Design (Bilinear Transform)
Designing a first-order low-pass filter with $f_c = 1\\text{ kHz}$ at $f_s = 8\\text{ kHz}$.

\`\`\`python
import numpy as np
import scipy.signal as signal
import matplotlib.pyplot as plt

fc = 1000
fs = 8000
Omega_c = 2 * np.pi * fc
T = 1 / fs

# (a) Analytical Bilinear Transform
# s = (2/T) * (1 - z^-1) / (1 + z^-1)
# Plugging this into H(s) = Omega_c / (s + Omega_c) yields:
denom = 8 + np.pi
b_th = [np.pi / denom, np.pi / denom]
a_th = [1.0, -(8 - np.pi) / denom]

print(f"(a) Theoretical Denominator (a): {a_th}")
print(f"(a) Theoretical Numerator (b): {b_th}\\n")

# (b) Numerical check with Scipy
b_num, a_num = signal.bilinear([Omega_c], [1, Omega_c], fs=fs)
print(f"(b) Scipy Denominator (a): {a_num}")
print(f"(b) Scipy Numerator (b): {b_num}\\n")

# (c) Prewarping to fix Frequency Warping
# The exact digital cutoff shifts slightly due to the non-linear mapping of the Bilinear Transform.
# We correct this by "pre-warping" the analog cutoff frequency!
Omega_prewarped = (2 / T) * np.tan(Omega_c * T / 2)
print(f"(c) Original Analog Cutoff:  {Omega_c:.2f} rad/s")
print(f"(c) Prewarped Analog Cutoff: {Omega_prewarped:.2f} rad/s\\n")

# Redesign using the prewarped cutoff
b_pre, a_pre = signal.bilinear([Omega_prewarped], [1, Omega_prewarped], fs=fs)

# Frequency Responses
w, h = signal.freqz(b_num, a_num, worN=1024, fs=fs)
w_pre, h_pre = signal.freqz(b_pre, a_pre, worN=1024, fs=fs)

plt.figure(figsize=(10, 5))
plt.plot(w, 20 * np.log10(abs(h)), label="No Prewarping (Cutoff shifted)")
plt.plot(w_pre, 20 * np.log10(abs(h_pre)), '--', label="Prewarped (Exact 1 kHz Cutoff)")
plt.axvline(1000, color='r', linestyle=':', label="Target Cutoff (1 kHz)")
plt.axhline(-3, color='k', linestyle=':', label="-3 dB Point")
plt.title("(c) Frequency Response Comparison")
plt.ylabel("Magnitude (dB)")
plt.xlabel("Frequency (Hz)")
plt.xlim(0, 4000)
plt.ylim(-20, 2)
plt.legend()
plt.grid(True)
plt.show()
\`\`\`

`,
    labWalkthrough: '',
    keyFormulas: ''
  }
];
