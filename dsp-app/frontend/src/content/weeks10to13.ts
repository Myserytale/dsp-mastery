import type { WeekContent } from './weeks1to5';

export const weeks10to13: WeekContent[] = [
  // ═══════════════════════════════════════════════════
  // WEEK 10: FIR Filter Design
  // ═══════════════════════════════════════════════════
  {
    id: 10,
    title: 'FIR Filter Design',
    bigPicture: `## Filters Without Feedback

Last week we designed IIR filters — powerful but potentially unstable. **FIR (Finite Impulse Response)** filters use only feedforward:

$$y[n] = \\sum_{k=0}^{M} b_k \\, x[n-k]$$

No feedback means **always stable** and can have **linear phase** (all frequencies delayed equally). The tradeoff: you need more coefficients for the same sharpness.

> **Connection to Week 2**: An FIR filter IS just convolution with a finite-length $h[n]$. Everything we learned about convolution applies directly.`,

    concepts: [
      {
        name: 'Window Method',
        explanation: `### Designing FIR Filters by Truncation

The ideal lowpass filter has impulse response:
$$h_{\\text{ideal}}[n] = \\frac{\\sin(\\omega_c n)}{\\pi n} = \\omega_c / \\pi \\cdot \\text{sinc}(\\omega_c n / \\pi)$$

This is infinite and non-causal. The **window method**:
1. Truncate to $M+1$ samples
2. Apply a window function to reduce ripple
3. Shift by $M/2$ to make causal

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import freqz

def fir_lowpass(M, wc, window='hamming'):
    """Design FIR lowpass filter using window method."""
    n = np.arange(M + 1)
    mid = M / 2
    
    # Ideal impulse response (handle n=mid separately)
    h = np.where(n == mid, wc/np.pi, 
                 np.sin(wc * (n - mid)) / (np.pi * (n - mid)))
    
    # Apply window
    if window == 'hamming':
        w = np.hamming(M + 1)
    elif window == 'blackman':
        w = np.blackman(M + 1)
    else:
        w = np.ones(M + 1)  # rectangular
    
    return h * w

# Compare windows
fig, ax = plt.subplots(figsize=(10, 4))
wc = 0.4 * np.pi  # cutoff frequency

for win_name in ['rectangular', 'hamming', 'blackman']:
    h = fir_lowpass(40, wc, win_name)
    w, H = freqz(h, 1, worN=1024)
    ax.plot(w/np.pi, 20*np.log10(np.abs(H)+1e-10), label=win_name.capitalize())

ax.set_xlabel('Normalized frequency (×π)')
ax.set_ylabel('Magnitude (dB)')
ax.set_ylim(-80, 5)
ax.legend()
ax.grid(True, alpha=0.3)
ax.set_title('Window method: tradeoff between main lobe and sidelobes')
plt.show()
\`\`\``
      },
      {
        name: 'Window Functions Compared',
        explanation: `### Choosing the Right Window

Every window trades **main lobe width** (frequency resolution) for **sidelobe level** (spectral leakage):

| Window | Main lobe width | First sidelobe | Use when |
|--------|----------------|----------------|----------|
| **Rectangular** | $4\\pi/(M+1)$ | -13 dB | Maximum resolution needed |
| **Hamming** | $8\\pi/(M+1)$ | -43 dB | General purpose (most common) |
| **Hanning** | $8\\pi/(M+1)$ | -32 dB | Spectral analysis |
| **Blackman** | $12\\pi/(M+1)$ | -58 dB | Maximum sidelobe rejection |
| **Kaiser** | Variable ($\\beta$) | Variable | Tunable tradeoff |

> **Rule of thumb**: Start with Hamming. If sidelobes matter more (e.g., weak signal near strong one), use Blackman. If resolution matters more, use rectangular.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

M = 64
windows = {
    'Rectangular': np.ones(M),
    'Hamming': np.hamming(M),
    'Hanning': np.hanning(M),
    'Blackman': np.blackman(M),
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
for name, w in windows.items():
    ax1.plot(w, label=name)
    # Frequency response of window itself
    W = np.fft.fft(w, 1024)
    W_db = 20*np.log10(np.abs(np.fft.fftshift(W))/np.max(np.abs(W))+1e-10)
    f = np.linspace(-0.5, 0.5, 1024)
    ax2.plot(f, W_db, label=name)

ax1.set_title('Window shapes')
ax1.legend()
ax2.set_title('Window spectra (dB)')
ax2.set_ylim(-80, 5)
ax2.set_xlim(-0.15, 0.15)
ax2.legend()
plt.tight_layout()
plt.show()
\`\`\``
      },
      {
        name: 'Linear Phase & Filter Order',
        explanation: `### Why Linear Phase Matters

A filter has **linear phase** if $\\angle H(e^{j\\omega}) = -\\omega M/2$ — all frequencies are delayed by the same amount ($M/2$ samples). This means the signal shape is preserved; only the timing shifts.

**Condition**: FIR filter has linear phase if $h[n]$ is **symmetric**: $h[n] = h[M-n]$.

All FIR filters designed by the window method are symmetric → linear phase!

### Choosing Filter Order
More taps $M$ → sharper transition but more computation:
- **Transition bandwidth** $\\approx \\Delta\\omega$: $M \\approx \\frac{4}{\\Delta\\omega / \\pi}$ (Hamming)
- Need 1 Hz transition at 1000 Hz sampling? $\\Delta\\omega = 2\\pi/1000$, so $M \\approx 2000$ taps.

\`\`\`python
import numpy as np
from scipy.signal import firwin, freqz
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 4))
for M in [15, 31, 63, 127]:
    h = firwin(M, 0.3)  # cutoff at 0.3*Nyquist
    w, H = freqz(h, 1, worN=2048)
    ax.plot(w/np.pi, 20*np.log10(np.abs(H)+1e-10), label=f'M={M}')

ax.set_xlabel('Normalized frequency (×π)')
ax.set_ylabel('Magnitude (dB)')
ax.set_ylim(-80, 5)
ax.legend()
ax.grid(True, alpha=0.3)
ax.set_title('More taps → sharper transition')
plt.show()
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 10 Solutions

### 📌 Problem 1: Filter Classes
Filters are generally classified into four main categories based on the frequency regions they pass or attenuate:
1. **Low-pass Filter (LPF)**: Passes frequencies from DC (0 Hz) up to a cutoff frequency (\`\\omega_c\`), and attenuates higher frequencies.
2. **High-pass Filter (HPF)**: Attenuates frequencies below the cutoff frequency (\`\\omega_c\`) and passes frequencies above it.
3. **Band-pass Filter (BPF)**: Passes frequencies within a specific range (\`\\omega_{c1}\` to \`\\omega_{c2}\`) and attenuates frequencies outside this band.
4. **Band-stop / Notch Filter (BSF)**: Attenuates frequencies within a specific range and passes all other frequencies.

*Conceptual Frequency Response Curves (Magnitude $|H(\\omega)|$ vs Frequency $\\omega$):*
- **LPF**: High near $\\omega=0$, drops to zero after $\\omega_c$.
- **HPF**: Zero near $\\omega=0$, rises to high after $\\omega_c$.
- **BPF**: Bell-like shape, peaking between $\\omega_{c1}$ and $\\omega_{c2}$.
- **BSF**: High everywhere except a deep dip (notch) between $\\omega_{c1}$ and $\\omega_{c2}$.

### 📌 Problem 2: Passband vs Stopband
- **Passband**: The range of frequencies that a filter allows to pass through with minimal attenuation (gain is close to unity or 0 dB).
- **Stopband**: The range of frequencies that a filter significantly attenuates or blocks (gain is close to zero or highly negative in dB). 
The key difference is their functional role: the passband preserves the signal's frequency components, while the stopband suppresses unwanted components.

### 📌 Problem 3: Cut-off Frequency
The **cut-off frequency** (\`\\omega_c\` or \`f_c\`) is the boundary frequency that separates the passband from the transition band. Mathematically, it is typically defined as the frequency at which the filter's magnitude response drops to \`\\frac{1}{\\sqrt{2}}\` (approx. 0.707) of its maximum passband value. This corresponds to a signal power reduction of half, often referred to a
<truncated 18691 bytes>
ist, btype='low', analog=False)

# Apply filter using filtfilt to achieve zero-phase distortion
y_low = filtfilt(b_low, a_low, x_noisy)
\`\`\`
*Lab Insight*: If you plot \`y_low\`, you will notice that the chirp amplitude is preserved for the first second (up to 100 Hz), after which it rapidly attenuates. The 4th order configuration guarantees an $-80$ dB/decade rolloff.

### Step 3: Notch Filter Implementation
As solved in Problem 16, a notch filter suppresses a very specific frequency band. Here we target the \`50 Hz\` interference tone.

\`\`\`python
# Design an IIR Notch Filter
f0_notch = 50.0   # Frequency to remove
Q = 30.0          # Quality factor (controls bandwidth)

# iirnotch directly returns the b and a coefficients 
b_notch, a_notch = iirnotch(w0=f0_notch, Q=Q, fs=fs)

# Clean the signal
y_clean = filtfilt(b_notch, a_notch, y_low)
\`\`\`

### Step 4: Visualizing the Results
Plotting the time series allows us to visually inspect the behavior of our IIR designs.

\`\`\`python
plt.figure(figsize=(12, 8))

# Subplot 1: Noisy Chirp
plt.subplot(3, 1, 1)
plt.plot(t, x_noisy, color='gray')
plt.title('Original Chirp Signal with 50 Hz Interference')
plt.ylabel('Amplitude')

# Subplot 2: After Lowpass
plt.subplot(3, 1, 2)
plt.plot(t, y_low, color='blue')
plt.title('After Butterworth Low-pass (Attenuates frequencies > 100 Hz)')
plt.ylabel('Amplitude')

# Subplot 3: After Lowpass AND Notch
plt.subplot(3, 1, 3)
plt.plot(t, y_clean, color='green')
plt.title('After 50 Hz Notch Filter (Cleaned Signal)')
plt.xlabel('Time [sec]')
plt.ylabel('Amplitude')

plt.tight_layout()
plt.show()
\`\`\`

### 💡 Lab Conclusion
By executing this code, students can see directly how the theories discussed in Homework 10 map into digital reality. 
1. The **Bilinear transform** inside \`butter\` successfully scaled the chirp off after 1 second (100 Hz mark).
2. The **Notch filter**, utilizing complex conjugate zeros directly on the unit circle at precisely $50$ Hz, perfectly hollowed out the interference, validating our math on direct pole-zero placement.

### 🧠 Knowledge Check

\`\`\`quiz
question: Which of the following is a major advantage of FIR filters over IIR filters?
a: They require fewer coefficients to achieve the same sharp cutoff.
b: They can be designed to have an exactly linear phase response, preserving waveform shapes.
c: They are computationally cheaper than IIR filters for complex frequency responses.
d: They always have a narrower transition band for a given filter order.
answer: b
explanation: FIR filters can guarantee exactly linear phase when their impulse response is symmetric, meaning all frequencies experience identical group delay and the waveform shape is perfectly preserved. Option (a) is backwards — IIR filters need fewer coefficients for the same sharpness; FIR filters typically require many more taps. Option (c) is also incorrect because FIR filters generally require more multiply-accumulate operations. Option (d) is wrong because IIR filters achieve narrower transition bands for a given order.
\`\`\`
\`\`\`quiz
question: In the Window Method for FIR filter design, what is the consequence of truncating the ideal infinite impulse response with a rectangular window?
a: It produces the sharpest possible transition band but suffers from significant Gibbs phenomenon ripples in the passband and stopband.
b: It produces a completely smooth transition band with no ripples.
c: It forces the filter to become an IIR filter.
d: It eliminates all sidelobes in the frequency response.
answer: a
explanation: A rectangular window simply chops off the ideal impulse response, which is equivalent to convolving the ideal frequency response with a sinc function in frequency. This yields the narrowest possible main lobe (sharpest transition) but introduces Gibbs phenomenon — oscillatory ripples of about 9% overshoot that do not diminish as filter order increases. Option (b) is wrong because smoothness requires tapered windows like Hamming or Blackman. Option (c) is wrong because truncation still yields a finite-length (FIR) filter. Option (d) is wrong because the rectangular window has the worst sidelobes (-13 dB) of all standard windows.
\`\`\`
\`\`\`quiz
question: A linear-phase FIR filter requires its impulse response h[n] to have what specific property?
a: It must be strictly positive.
b: It must be an exponentially decaying sequence.
c: It must be symmetric or anti-symmetric around its midpoint.
d: It must have an even number of taps.
answer: c
explanation: Linear phase requires that all frequency components experience the same group delay. This is guaranteed when h[n] = h[M-n] (symmetric, Types I and II) or h[n] = -h[M-n] (anti-symmetric, Types III and IV). Option (a) is wrong — coefficients can be negative. Option (b) describes IIR-like decay, not FIR symmetry. Option (d) is wrong because both even and odd length FIR filters can have linear phase (Type I is odd length, Type II is even length).
\`\`\`
\`\`\`quiz
question: A Type II linear-phase FIR filter (even number of taps, symmetric coefficients) has a guaranteed zero in its frequency response at which frequency?
a: At DC (ω = 0)
b: At the passband center frequency
c: At ω = π (the Nyquist frequency)
d: It has no guaranteed zeros at any specific frequency
answer: c
explanation: For a Type II FIR filter (even length M+1, symmetric h[n] = h[M-n]), the frequency response can be written as H(e^{jω}) = e^{-jωM/2} · H_r(ω), where H_r(π) = 0 always. This built-in zero at ω = π means Type II filters cannot be used as highpass or bandstop filters. Option (a) is wrong — the zero at DC occurs for Type IV (odd anti-symmetric). Option (b) is wrong — the passband center is where the response is near unity. Option (d) is wrong because this zero is a fundamental structural property.
\`\`\`
\`\`\`quiz
question: In the Parks-McClellan (Remez exchange) algorithm for FIR filter design, what key property distinguishes it from the window method?
a: It minimizes the maximum error (equiripple design) over the passband and stopband, achieving the optimal filter for a given order.
b: It always produces filters with fewer taps than the window method.
c: It can only design lowpass filters.
d: It uses an IIR prototype filter and converts it to FIR.
answer: a
explanation: The Parks-McClellan algorithm uses the Chebyshev approximation (minimax criterion) to produce an equiripple FIR filter — one where the approximation error oscillates equally between its maximum and minimum values across the bands. This is provably optimal: no other FIR filter of the same order can achieve a smaller maximum error. Option (b) is misleading — while equiripple designs are often shorter than window-based designs for the same specs, this is a consequence, not the defining property. Option (c) is wrong because Parks-McClellan can design any filter type. Option (d) describes IIR-to-FIR conversion techniques, not the Remez algorithm.
\`\`\`
`,
    labWalkthrough: `

`,

    keyFormulas: `## Week 10 Key Formulas

| Formula | Description |
|---------|-------------|
| $y[n] = \\sum_{k=0}^{M} b_k x[n-k]$ | FIR filter (no feedback) |
| $h[n] = h_d[n] \\cdot w[n]$ | Window method |
| $h_d[n] = \\frac{\\sin(\\omega_c(n-M/2))}{\\pi(n-M/2)}$ | Ideal lowpass impulse response |
| $h[n] = h[M-n]$ | Linear phase condition |
| $M \\approx \\frac{A - 7.95}{14.36 \\Delta f / f_s}$ | Kaiser order estimate |`,
  },

  // ═══════════════════════════════════════════════════
  // WEEK 11: Filter Structures & Implementation
  // ═══════════════════════════════════════════════════
  {
    id: 11,
    title: 'Filter Structures & Implementation',
    bigPicture: `## From Math to Hardware

You've designed a filter (coefficients $b_k, a_k$). But **how** you implement it matters for numerical precision, memory, and computational efficiency.

The same transfer function $H(z)$ can be realized in multiple ways — Direct Form I, Direct Form II, cascade, parallel — each with different tradeoffs in quantization noise and overflow behavior.

This week also covers **notch filters** — a practical design technique for removing a specific frequency (like 50/60 Hz power line noise from biomedical signals).

> **Connection**: This is where theory meets practice. A mathematically identical filter can behave differently on real hardware due to finite precision arithmetic.`,

    concepts: [
      {
        name: 'Direct Form I & II',
        explanation: `### Implementing the Difference Equation

**Direct Form I**: Directly implements
$$y[n] = \\sum_{k=0}^{M} b_k x[n-k] - \\sum_{k=1}^{N} a_k y[n-k]$$

Needs $M + N$ delay elements (memory).

**Direct Form II** (transposed): Rearranges to use only $\\max(M, N)$ delay elements — saves memory!

The key insight: factor $H(z) = B(z) / A(z)$ and compute in two stages:
1. First pass through $1/A(z)$ (feedback section)
2. Then through $B(z)$ (feedforward section)

\`\`\`python
import numpy as np

def direct_form_1(b, a, x):
    """Direct Form I implementation."""
    M, N = len(b), len(a)
    y = np.zeros(len(x))
    
    for n in range(len(x)):
        # Feedforward (FIR part)
        for k in range(M):
            if n - k >= 0:
                y[n] += b[k] * x[n - k]
        # Feedback (IIR part)
        for k in range(1, N):
            if n - k >= 0:
                y[n] -= a[k] * y[n - k]
    return y

# Test: simple first-order IIR
b = np.array([1.0, 0.5])
a = np.array([1.0, -0.8])
x = np.zeros(20); x[0] = 1  # impulse

y = direct_form_1(b, a, x)
print("Impulse response (first 10):", np.round(y[:10], 4))

# Verify with scipy
from scipy.signal import lfilter
y_scipy = lfilter(b, a, x)
print("scipy verification:          ", np.round(y_scipy[:10], 4))
\`\`\``
      },
      {
        name: 'Cascade & Parallel Forms',
        explanation: `### Breaking Filters into Sections

**Cascade (Series) Form**: Factor $H(z)$ into second-order sections (SOS):
$$H(z) = \\prod_{i} \\frac{b_{0i} + b_{1i}z^{-1} + b_{2i}z^{-2}}{1 + a_{1i}z^{-1} + a_{2i}z^{-2}}$$

Each 2nd-order section is called a **biquad**. Benefits:
- Less sensitive to coefficient quantization
- Each section is easy to implement and test
- Industry standard for audio processing

**Parallel Form**: Partial fraction expansion:
$$H(z) = k + \\sum_i \\frac{r_i}{1 - p_i z^{-1}}$$

\`\`\`python
import numpy as np
from scipy.signal import butter, zpk2sos, sosfilt, freqz, sosfreqz
import matplotlib.pyplot as plt

# Design a 6th-order Butterworth
b, a = butter(6, 0.3)

# Convert to second-order sections (cascade form)
sos = butter(6, 0.3, output='sos')  # direct SOS output
print(f"SOS shape: {sos.shape}")  # (3, 6) = 3 biquad sections
print("Each row: [b0, b1, b2, 1, a1, a2]")

# Compare frequency responses
w1, h1 = freqz(b, a, worN=1024)
w2, h2 = sosfreqz(sos, worN=1024)

plt.figure(figsize=(10, 4))
plt.plot(w1/np.pi, 20*np.log10(np.abs(h1)+1e-10), label='Direct form')
plt.plot(w2/np.pi, 20*np.log10(np.abs(h2)+1e-10), '--', label='Cascade (SOS)')
plt.legend()
plt.title('Same filter, different structure — identical response')
plt.ylabel('Magnitude (dB)')
plt.xlabel('Normalized frequency (×π)')
plt.grid(True, alpha=0.3)
plt.show()
\`\`\``
      },
      {
        name: 'Notch Filter Design',
        explanation: `### Removing a Specific Frequency

A **notch filter** rejects a single frequency $f_0$ while passing everything else. Design strategy:

1. Place **zeros on the unit circle** at the target frequency: $z = e^{\\pm j\\omega_0}$
2. Place **poles just inside** at the same angle: $z = r \\cdot e^{\\pm j\\omega_0}$ with $r$ close to 1

The closer $r$ is to 1, the narrower the notch:

$$H(z) = \\frac{(1 - e^{j\\omega_0}z^{-1})(1 - e^{-j\\omega_0}z^{-1})}{(1 - re^{j\\omega_0}z^{-1})(1 - re^{-j\\omega_0}z^{-1})}$$

$$= \\frac{1 - 2\\cos(\\omega_0)z^{-1} + z^{-2}}{1 - 2r\\cos(\\omega_0)z^{-1} + r^2z^{-2}}$$

\`\`\`python
import numpy as np
from scipy.signal import freqz
import matplotlib.pyplot as plt

def notch_filter(f_notch, fs, r=0.95):
    """Design a notch filter to remove frequency f_notch."""
    w0 = 2 * np.pi * f_notch / fs
    b = np.array([1, -2*np.cos(w0), 1])
    a = np.array([1, -2*r*np.cos(w0), r**2])
    return b, a

# Remove 50 Hz hum from a signal sampled at 500 Hz
fs = 500
b, a = notch_filter(50, fs, r=0.95)
w, H = freqz(b, a, worN=2048, fs=fs)

plt.figure(figsize=(10, 4))
plt.plot(w, 20*np.log10(np.abs(H)+1e-10))
plt.axvline(50, color='r', linestyle='--', alpha=0.5, label='50 Hz')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude (dB)')
plt.title('Notch filter: removes 50 Hz, passes everything else')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
\`\`\``
      },
    ],

    homeworkGuide: `Created At: 2026-06-17T00:35:41Z
Completed At: 2026-06-17T00:35:41Z
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks10to13.ts","LineNumber":159,"LineContent":"    homeworkGuide: \`## 📝 Homework 10 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks10to13.ts","LineNumber":380,"LineContent":"    homeworkGuide: \`## 📝 Homework 11 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks10to13.ts","LineNumber":566,"LineContent":"    homeworkGuide: \`## 📝 Homework 12 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks10to13.ts","LineNumber":821,"LineContent":"    homeworkGuide: \`## 📝 Comprehensive Exam Overview \\u0026 Solved Examples"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks6to9.ts","LineNumber":134,"LineContent":"    homeworkGuide: \`## 📝 Homework 6 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks6to9.ts","LineNumber":407,"LineContent":"    homeworkGuide: \`## 📝 Homework 7 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks6to9.ts","LineNumber":679,"LineContent":"    homeworkGuide: \`## 📝 Homework 8 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks6to9.ts","LineNumber":958,"LineContent":"    homeworkGuide: \`## 📝 Homework 9 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":185,"LineContent":"    homeworkGuide: \`## 📝 Homework 1 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":664,"LineContent":"    homeworkGuide: \`## 📝 Homework 2 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":1039,"LineContent":"    homeworkGuide: \`## 📝 Homework 3 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":1309,"LineContent":"    homeworkGuide: \`## 📝 Homework 4 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":1657,"LineContent":"    homeworkGuide: \`## 📝 Homework 5 Solutions"}

### 🧠 Knowledge Check

\`\`\`quiz
question: What is the main difference between Direct Form I and Direct Form II realizations of an IIR filter?
a: Direct Form I requires double the number of multipliers compared to Direct Form II.
b: Direct Form II shares the delay elements (memory) between the feedforward and feedback paths, saving memory compared to Direct Form I.
c: Direct Form II can only be used for FIR filters.
d: Direct Form I always has better numerical precision than Direct Form II.
answer: b
explanation: Direct Form I uses M + N separate delay elements (one set for the input history, another for the output history), while Direct Form II rearranges the computation so both paths share a single set of max(M, N) delay elements. Option (a) is wrong — both forms use the same number of multipliers; it's the memory (delays) that differs. Option (c) is wrong — Direct Form II works for both IIR and FIR filters. Option (d) is actually backwards — Direct Form II can have worse numerical behavior due to large intermediate values in the shared state, which is why the Transposed Direct Form II is often preferred.
\`\`\`
\`\`\`quiz
question: When implementing digital filters in fixed-point hardware, what issue arises from the quantization of filter coefficients?
a: The filter's phase response becomes non-linear.
b: The actual poles and zeros shift from their designed locations, potentially causing instability in IIR filters.
c: The sampling rate of the signal is unintentionally reduced.
d: The filter automatically converts from IIR to FIR type.
answer: b
explanation: Quantizing coefficients to finite precision means the polynomial coefficients change slightly, which moves the roots (poles and zeros) of the transfer function. For IIR filters, if a pole that was just inside the unit circle gets pushed outside, the filter becomes unstable. This is especially dangerous for high-order direct-form implementations where small coefficient changes cause large pole movements. Option (a) is misleading — while quantization affects phase indirectly through pole/zero shifts, non-linear phase is a design property, not a quantization artifact. Option (c) is wrong — coefficient quantization doesn't affect sampling rate. Option (d) is wrong — the filter structure type doesn't change.
\`\`\`
\`\`\`quiz
question: Why might a cascade (series) realization of second-order sections (biquads) be preferred over a high-order Direct Form realization?
a: It requires fewer overall multipliers and adders.
b: It is significantly less sensitive to coefficient quantization errors and numerical instability.
c: It automatically makes an IIR filter act like an FIR filter.
d: It eliminates the need for feedback paths in IIR filters.
answer: b
explanation: In a high-order direct form, all poles are determined jointly by all denominator coefficients, so quantizing any single coefficient shifts every pole. In the cascade form, each biquad controls only its own pair of poles, and second-order polynomials are far less sensitive to coefficient perturbation. This dramatically reduces the risk of instability. Option (a) is wrong — cascade form actually uses slightly more multipliers due to gain factors between sections. Option (c) is wrong — each biquad section still has its own feedback (denominator). Option (d) is wrong — feedback is still present within each second-order section.
\`\`\`
\`\`\`quiz
question: In a notch filter designed by placing zeros on the unit circle at z = e^{±jω₀} and poles at z = r·e^{±jω₀}, what happens to the notch bandwidth as r approaches 1?
a: The notch bandwidth increases, rejecting a wider range of frequencies.
b: The filter becomes unstable because the poles reach the unit circle.
c: The notch becomes narrower, rejecting only a very small band around ω₀.
d: The notch disappears and the filter becomes all-pass.
answer: c
explanation: The poles pull the magnitude response back up toward unity on either side of the notch frequency. As r → 1, the poles get closer to the zeros on the unit circle, so they "cancel" the zeros' effect at frequencies very close to (but not exactly at) ω₀, making the notch extremely narrow. At exactly ω₀, the zeros still force the response to zero. Option (a) is wrong — closer poles mean narrower notch, not wider. Option (b) is wrong — r < 1 keeps poles strictly inside the unit circle, so the filter remains stable (instability only at r = 1 exactly). Option (d) is wrong — the zeros on the unit circle always create a null at ω₀ regardless of r.
\`\`\`
\`\`\`quiz
question: What is "limit cycle oscillation" in the context of recursive (IIR) digital filter implementations?
a: The natural oscillation frequency of the filter at its pole locations.
b: A sustained, low-level parasitic oscillation caused by nonlinear effects of rounding or truncation in the feedback loop, even when the input is zero.
c: The maximum frequency a digital filter can process before aliasing occurs.
d: An oscillation that occurs only during the transient startup phase of the filter.
answer: b
explanation: In a recursive filter with finite-precision arithmetic, rounding or truncation of intermediate values introduces small nonlinear perturbations in the feedback path. These can trap the filter output in a repeating cycle of nonzero values even with zero input — a sustained parasitic oscillation called a limit cycle. This is a fundamentally nonlinear phenomenon that linear stability analysis cannot predict. Option (a) confuses limit cycles with the filter's natural modes (which decay for stable filters). Option (c) describes the Nyquist frequency constraint, unrelated to quantization. Option (d) is wrong because limit cycles are sustained indefinitely, not transient.
\`\`\`
`,
    labWalkthrough: `

`,

    keyFormulas: `## Week 11 Key Formulas

| Formula | Description |
|---------|-------------|
| $H(z) = \\frac{1 - 2\\cos(\\omega_0)z^{-1} + z^{-2}}{1 - 2r\\cos(\\omega_0)z^{-1} + r^2 z^{-2}}$ | Notch filter |
| Direct Form I: $M + N$ delays | Memory requirement |
| Direct Form II: $\\max(M, N)$ delays | Reduced memory |
| Cascade: $H(z) = \\prod H_i(z)$ | Second-order sections |`,
  },

  // ═══════════════════════════════════════════════════
  // WEEK 12: Advanced Topics & Applications
  // ═══════════════════════════════════════════════════
  {
    id: 12,
    title: 'Advanced Topics & Applications',
    bigPicture: `## DSP in the Real World

Everything we've learned comes together when we process **real signals** — audio recordings, EEG brain signals, communication channels. This week covers:

1. **Multirate processing** — changing the sampling rate (decimation/interpolation)
2. **Spectrograms** — seeing how frequency content changes over time
3. **Applying filters** to real audio and biomedical data

> **The journey**: Signals (W1) → Systems (W2) → Frequency analysis (W3-8) → Filter design (W9-11) → **Real applications** (this week).`,

    concepts: [
      {
        name: 'Decimation & Interpolation',
        explanation: `### Changing the Sampling Rate

**Decimation** (downsample by $M$): Keep every $M$-th sample, discard the rest.
- Must lowpass filter first to prevent aliasing!
- Output rate: $f_s / M$

**Interpolation** (upsample by $L$): Insert $L-1$ zeros between samples, then lowpass filter.
- Output rate: $f_s \\times L$

\`\`\`python
import numpy as np
from scipy.signal import resample, decimate
import matplotlib.pyplot as plt

# Original signal: 100 Hz + 200 Hz, sampled at 1000 Hz
fs = 1000
t = np.arange(0, 0.1, 1/fs)
x = np.sin(2*np.pi*100*t) + 0.5*np.sin(2*np.pi*200*t)

# Decimate by 4 (new rate: 250 Hz)
x_dec = decimate(x, 4)  # includes anti-aliasing filter!
t_dec = np.arange(len(x_dec)) / (fs/4)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 5))
ax1.plot(t*1000, x, 'b-')
ax1.set_title(f'Original (fs={fs} Hz, {len(x)} samples)')
ax1.set_xlabel('Time (ms)')

ax2.plot(t_dec*1000, x_dec, 'r-o', markersize=3)
ax2.set_title(f'Decimated by 4 (fs={fs//4} Hz, {len(x_dec)} samples)')
ax2.set_xlabel('Time (ms)')
plt.tight_layout()
plt.show()
\`\`\``
      },
      {
        name: 'STFT & Spectrogram',
        explanation: `### Time-Frequency Analysis

The FFT tells you **what** frequencies are present but not **when**. The **Short-Time Fourier Transform (STFT)** slides a window across the signal and computes FFT of each segment:

$$\\text{STFT}\\{x[n]\\}(m, k) = \\sum_{n} x[n] \\, w[n-mR] \\, e^{-j2\\pi kn/N}$$

A **spectrogram** displays $|\\text{STFT}|^2$ as a 2D image: time on x-axis, frequency on y-axis, color = magnitude.

> **Uncertainty principle**: Short window → good time resolution but poor frequency resolution. Long window → opposite. You can't have both!

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Create a chirp signal (frequency increases with time)
fs = 4000
t = np.arange(0, 2, 1/fs)
f_start, f_end = 100, 1000
x = np.sin(2*np.pi * (f_start + (f_end-f_start)*t/(2*t[-1])) * t)

plt.figure(figsize=(10, 5))
plt.specgram(x, Fs=fs, NFFT=256, noverlap=200, cmap='magma')
plt.xlabel('Time (s)')
plt.ylabel('Frequency (Hz)')
plt.title('Spectrogram of a chirp signal')
plt.colorbar(label='Power/Freq (dB/Hz)')
plt.show()
\`\`\``
      },
      {
        name: 'Real-World Filtering',
        explanation: `### Processing Audio and Biomedical Signals

**Audio**: Remove noise from recordings, equalize frequency bands, detect pitch.

**EEG**: Extract brain rhythms (delta 1-4 Hz, theta 4-8 Hz, alpha 8-13 Hz, beta 13-30 Hz), detect sleep spindles, remove artifacts.

\`\`\`python
import numpy as np
from scipy.signal import butter, sosfilt, welch
import matplotlib.pyplot as plt

# Simulate noisy EEG with alpha rhythm (10 Hz) + noise
fs = 256  # typical EEG sampling rate
t = np.arange(0, 5, 1/fs)
alpha = 0.5 * np.sin(2*np.pi*10*t)  # alpha rhythm
noise = 0.3 * np.random.randn(len(t))
eeg = alpha + noise

# Bandpass filter for alpha band (8-13 Hz)
sos = butter(4, [8, 13], btype='bandpass', fs=fs, output='sos')
alpha_filtered = sosfilt(sos, eeg)

fig, axes = plt.subplots(3, 1, figsize=(10, 7))
axes[0].plot(t, eeg, 'gray', alpha=0.7)
axes[0].set_title('Raw EEG (alpha + noise)')

axes[1].plot(t, alpha_filtered, 'b-')
axes[1].set_title('Filtered: alpha band (8-13 Hz)')

# PSD comparison
f, psd_raw = welch(eeg, fs, nperseg=512)
f, psd_filt = welch(alpha_filtered, fs, nperseg=512)
axes[2].semilogy(f, psd_raw, alpha=0.5, label='Raw')
axes[2].semilogy(f, psd_filt, label='Filtered')
axes[2].set_xlim(0, 50)
axes[2].set_xlabel('Frequency (Hz)')
axes[2].set_title('Power Spectral Density')
axes[2].legend()
plt.tight_layout()
plt.show()
\`\`\``
      },
    ],

    homeworkGuide: `Created At: 2026-06-17T00:35:41Z
Completed At: 2026-06-17T00:35:41Z
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks10to13.ts","LineNumber":159,"LineContent":"    homeworkGuide: \`## 📝 Homework 10 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks10to13.ts","LineNumber":380,"LineContent":"    homeworkGuide: \`## 📝 Homework 11 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks10to13.ts","LineNumber":566,"LineContent":"    homeworkGuide: \`## 📝 Homework 12 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks10to13.ts","LineNumber":821,"LineContent":"    homeworkGuide: \`## 📝 Comprehensive Exam Overview \\u0026 Solved Examples"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks6to9.ts","LineNumber":134,"LineContent":"    homeworkGuide: \`## 📝 Homework 6 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks6to9.ts","LineNumber":407,"LineContent":"    homeworkGuide: \`## 📝 Homework 7 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks6to9.ts","LineNumber":679,"LineContent":"    homeworkGuide: \`## 📝 Homework 8 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks6to9.ts","LineNumber":958,"LineContent":"    homeworkGuide: \`## 📝 Homework 9 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":185,"LineContent":"    homeworkGuide: \`## 📝 Homework 1 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":664,"LineContent":"    homeworkGuide: \`## 📝 Homework 2 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":1039,"LineContent":"    homeworkGuide: \`## 📝 Homework 3 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":1309,"LineContent":"    homeworkGuide: \`## 📝 Homework 4 Solutions"}
{"File":"/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app/frontend/src/content/weeks1to5.ts","LineNumber":1657,"LineContent":"    homeworkGuide: \`## 📝 Homework 5 Solutions"}

### 🧠 Knowledge Check

\`\`\`quiz
question: What is the purpose of decimation in multirate digital signal processing?
a: To increase the sampling rate of a signal by inserting zeros.
b: To reduce the sampling rate of a signal by discarding samples, usually preceded by low-pass filtering to prevent aliasing.
c: To convert a digital signal back into an analog signal.
d: To apply a bandpass filter centered at the decimation frequency.
answer: b
explanation: Decimation reduces the effective sampling rate by keeping only every M-th sample. However, downsampling alone would cause aliasing if the original signal has content above the new Nyquist frequency (π/M), so a lowpass anti-aliasing filter must be applied first. Option (a) describes interpolation (upsampling), the opposite operation. Option (c) describes D/A conversion, which is a separate process entirely. Option (d) is fabricated — decimation is about rate reduction, not bandpass filtering.
\`\`\`
\`\`\`quiz
question: In interpolation (upsampling), what is the crucial step immediately following the insertion of zero-valued samples between original samples?
a: Applying a high-pass filter.
b: Applying a low-pass (anti-imaging) filter to remove spectral replicas created by the zero-insertion.
c: Performing a Fast Fourier Transform.
d: Applying a median filter to smooth the inserted zeros.
answer: b
explanation: Zero-insertion creates L-1 spectral images (replicas of the original spectrum) between 0 and 2π. A lowpass filter with cutoff π/L and gain L removes these images, effectively interpolating smooth values in place of the inserted zeros. Option (a) is wrong — a highpass filter would remove the baseband signal and keep the images. Option (c) is wrong — the FFT is an analysis tool, not a filtering step. Option (d) is wrong — a median filter is nonlinear and does not properly remove spectral images; only a linear lowpass filter correctly shapes the interpolated spectrum.
\`\`\`
\`\`\`quiz
question: Why is Welch's method (periodogram averaging) often preferred over a single, standard periodogram for spectral density estimation of noisy signals?
a: It computes the FFT significantly faster than a standard periodogram.
b: It completely eliminates bias in the spectral estimate.
c: It reduces the variance of the spectral estimate by averaging overlapping, windowed segments of the signal.
d: It increases the frequency resolution compared to a single long FFT.
answer: c
explanation: A single periodogram of a noisy signal has high variance — the estimate fluctuates wildly. Welch's method divides the signal into overlapping, windowed segments, computes a periodogram for each, and averages them. By the law of large numbers, averaging K segments reduces the variance by approximately 1/K. Option (a) is wrong — Welch actually computes multiple FFTs, so it is computationally more expensive. Option (b) is wrong — windowing introduces some bias through spectral leakage, which Welch does not eliminate. Option (d) is wrong — shorter segments actually reduce frequency resolution (Δf = fs/segment_length); this is the fundamental tradeoff of the method.
\`\`\`
\`\`\`quiz
question: When performing sampling rate conversion by a non-integer factor L/M (e.g., converting 44.1 kHz to 48 kHz), what is the correct order of operations?
a: Decimate by M first, then interpolate by L.
b: Interpolate by L first, then decimate by M, with a single lowpass filter at cutoff min(π/L, π/M).
c: Apply the FFT, resample in the frequency domain, then apply the inverse FFT.
d: Simply drop or duplicate samples to approximate the new rate.
answer: b
explanation: The correct approach is to first upsample by L (inserting L-1 zeros) and then downsample by M (keeping every M-th sample), with a lowpass filter at cutoff min(π/L, π/M) applied between the two stages (in practice, a single combined filter). Interpolating first avoids aliasing because the intermediate rate is L·fs, which is higher than both the input and output rates. Option (a) is wrong — decimating first could cause aliasing if the signal bandwidth exceeds π/M at the original rate. Option (c) is not standard multirate processing and introduces circular artifacts. Option (d) produces severe distortion and is not a valid DSP technique.
\`\`\`
\`\`\`quiz
question: What is the "uncertainty principle" tradeoff in Short-Time Fourier Transform (STFT) / spectrogram analysis?
a: Longer signals always produce better spectrograms than shorter signals.
b: You cannot simultaneously achieve arbitrarily good time resolution and frequency resolution — improving one degrades the other.
c: The spectrogram can only be computed for stationary signals.
d: Increasing the FFT size always improves both time and frequency resolution.
answer: b
explanation: The time-frequency uncertainty principle (Δt · Δf ≥ 1/4π) is a fundamental limit. A short STFT window gives good time localization (you know when an event happened) but poor frequency resolution (wide frequency bins). A long window gives excellent frequency resolution but smears events in time. Option (a) is wrong — signal length affects total analysis duration, not the time-frequency tradeoff. Option (c) is wrong — the STFT is specifically designed for non-stationary signals by analyzing short quasi-stationary segments. Option (d) is wrong — increasing FFT size with a fixed window only zero-pads (interpolates the spectrum) without truly improving resolution; only a longer window improves frequency resolution, at the cost of time resolution.
\`\`\`
`,
    labWalkthrough: `

`,

    keyFormulas: `## Week 12 Key Formulas

| Formula | Description |
|---------|-------------|
| Decimation by $M$: $y[n] = x[nM]$ | Downsampling |
| Interpolation by $L$: insert $L-1$ zeros | Upsampling |
| Anti-alias cutoff: $\\omega_c = \\pi/M$ | Required before decimation |
| $\\text{STFT}(m,k) = \\sum x[n] w[n-mR] e^{-j2\\pi kn/N}$ | Short-Time FT |
| $\\Delta f \\cdot \\Delta t \\geq \\frac{1}{4\\pi}$ | Uncertainty principle |`,
  },

  // ═══════════════════════════════════════════════════
  // WEEK 13: Review & Exam Preparation
  // ═══════════════════════════════════════════════════
  {
    id: 13,
    title: 'Review & Exam Preparation',
    bigPicture: `## The Complete Picture

Here's how everything connects — the entire DSP course in one flow:

\`\`\`
Real-world signal → [Sample] → x[n]
                                 ↓
                    [Analyze: DTFT / DFT / FFT / Z-transform]
                                 ↓
                         X(e^jω) or X(z)
                                 ↓
                    [Design filter: IIR or FIR]
                                 ↓
                         H(z) = B(z)/A(z)
                                 ↓
                    [Implement: Direct/Cascade/Parallel]
                                 ↓
                    [Apply: Convolution or DFT method]
                                 ↓
                            y[n] (output)
                                 ↓
                    [Reconstruct if needed]
\`\`\`

Every week taught one piece of this pipeline. Now you can go from a real signal to a processed result.`,

    concepts: [
      {
        name: 'Transform Comparison',
        explanation: `### Which Transform When?

| Transform | Input | Output | Key Use |
|-----------|-------|--------|---------|
| **FT** | $x(t)$ continuous | $X(f)$ continuous | Continuous signal analysis |
| **DTFT** | $x[n]$ discrete | $X(e^{j\\omega})$ continuous, periodic | Discrete signal theory |
| **DFT** | $x[n]$ length $N$ | $X[k]$ length $N$ | Computable spectral analysis |
| **FFT** | Same as DFT | Same as DFT | Fast DFT algorithm |
| **Z-Transform** | $x[n]$ discrete | $X(z)$ complex plane | System analysis, stability |

### Key Relationships
- **DFT** = sampled DTFT: $X[k] = X(e^{j\\omega})\\big|_{\\omega = 2\\pi k/N}$
- **DTFT** = Z-transform on unit circle: $X(e^{j\\omega}) = X(z)\\big|_{z=e^{j\\omega}}$
- **FFT** is an algorithm, not a transform — it computes the DFT in $O(N\\log N)$

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Show relationship: DFT samples the DTFT
x = np.array([1, 2, 3, 2, 1, 0.5, 0.2, 0.1])  # 8-point signal

# DTFT (dense)
omega = np.linspace(-np.pi, np.pi, 500)
X_dtft = np.zeros(len(omega), dtype=complex)
for n in range(len(x)):
    X_dtft += x[n] * np.exp(-1j * omega * n)

# DFT (8 points)
N = len(x)
X_dft = np.fft.fft(x)
omega_dft = 2 * np.pi * np.arange(N) / N
# shift to [-pi, pi]
omega_dft = np.where(omega_dft > np.pi, omega_dft - 2*np.pi, omega_dft)

plt.figure(figsize=(10, 4))
plt.plot(omega/np.pi, np.abs(X_dtft), 'b-', label='DTFT (continuous)')
plt.scatter(omega_dft/np.pi, np.abs(X_dft), c='red', s=80, zorder=5, label='DFT (samples)')
plt.xlabel('ω/π')
plt.ylabel('|X|')
plt.title('DFT samples the DTFT')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
\`\`\``
      },
      {
        name: 'IIR vs FIR Decision Guide',
        explanation: `### Choosing Your Filter Type

| Criterion | Choose IIR | Choose FIR |
|-----------|-----------|-----------|
| **Phase** | Non-linear OK | Need linear phase |
| **Computation** | Minimal (few coefficients) | Can afford more taps |
| **Stability** | Can verify | Need guaranteed stability |
| **Sharp cutoff** | Yes, very efficient | Need many taps |
| **Audio** | EQ, simple filters | Phase-critical processing |
| **Control** | Common choice | Less common |
| **Adaptive** | Rare | Standard (LMS, RLS) |

### Design Checklist
1. **Specs**: passband edge, stopband edge, ripple, attenuation
2. **FIR path**: Window method or Parks-McClellan → choose window, compute order
3. **IIR path**: Choose analog prototype → bilinear transform → verify stability
4. **Verify**: Plot frequency response, check phase, test on real data

\`\`\`python
import numpy as np
from scipy.signal import butter, firwin, freqz
import matplotlib.pyplot as plt

# Same spec, IIR vs FIR
fc = 0.2  # cutoff at 0.2*Nyquist

# IIR: 4th-order Butterworth (9 coefficients total)
b_iir, a_iir = butter(4, fc)
n_coef_iir = len(b_iir) + len(a_iir)

# FIR: Hamming window (need ~74 taps for similar stopband)
b_fir = firwin(74, fc)
n_coef_fir = len(b_fir)

w_iir, H_iir = freqz(b_iir, a_iir, worN=2048)
w_fir, H_fir = freqz(b_fir, 1, worN=2048)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))
ax1.plot(w_iir/np.pi, 20*np.log10(np.abs(H_iir)+1e-10), label=f'IIR ({n_coef_iir} coefs)')
ax1.plot(w_fir/np.pi, 20*np.log10(np.abs(H_fir)+1e-10), label=f'FIR ({n_coef_fir} coefs)')
ax1.set_ylabel('Magnitude (dB)')
ax1.set_ylim(-80, 5)
ax1.legend()
ax1.set_title('Magnitude response')
ax1.grid(True, alpha=0.3)

ax2.plot(w_iir/np.pi, np.unwrap(np.angle(H_iir))*180/np.pi, label='IIR (nonlinear)')
ax2.plot(w_fir/np.pi, np.unwrap(np.angle(H_fir))*180/np.pi, label='FIR (linear!)')
ax2.set_xlabel('Normalized frequency (×π)')
ax2.set_ylabel('Phase (degrees)')
ax2.legend()
ax2.set_title('Phase response — FIR is perfectly linear')
ax2.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
\`\`\``
      },
      {
        name: 'Problem-Solving Strategies',
        explanation: `### Common Exam Patterns

**1. "Compute the output"**
- Given $x[n]$ and $h[n]$, find $y[n] = x * h$
- Strategy: Use convolution table or frequency domain ($Y = X \\cdot H$)

**2. "Find the frequency response"**
- Given $H(z)$, substitute $z = e^{j\\omega}$
- Plot magnitude: $|H(e^{j\\omega})|$ and phase: $\\angle H(e^{j\\omega})$

**3. "Is the system stable?"**
- Find poles (roots of denominator)
- Check: all $|p_i| < 1$?

**4. "Design a filter"**
- Determine type (LP, HP, BP, notch)
- Choose IIR or FIR
- Compute coefficients
- Verify the response meets specs

**5. "What is the sampling rate?"**
- Find $f_{\\max}$ in the signal
- $f_s \\geq 2 f_{\\max}$ (Nyquist)
- If aliasing: $f_{\\text{alias}} = |f - kf_s|$

\`\`\`python
# Quick reference: key numpy/scipy functions
import numpy as np
from scipy import signal

# Convolution
y = np.convolve(x, h)

# FFT spectrum
X = np.fft.fft(x)
f = np.fft.fftfreq(len(x), 1/fs)

# Filter design
b, a = signal.butter(N, Wn)           # IIR Butterworth
b = signal.firwin(numtaps, cutoff)     # FIR window method
sos = signal.butter(N, Wn, output='sos')  # cascade form

# Filter application  
y = signal.lfilter(b, a, x)           # direct form
y = signal.sosfilt(sos, x)            # cascade form (recommended)

# Frequency response
w, H = signal.freqz(b, a)

# Pole-zero
zeros, poles, gain = signal.tf2zpk(b, a)

# Spectral analysis
f, Pxx = signal.welch(x, fs)          # PSD
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Comprehensive Exam Overview & Solved Examples

> **Core Theme:** Master the core problem types spanning the entire course.

---

### 📌 Topic 1: LTI Systems & Convolution

**Potential Question:** Given an LTI system with $h[n] = \\{1, -1, 2\\}$ (origin at first sample) and input $x[n] = \\{2, 1, 3\\}$. Compute the output $y[n]$. Is this system stable? Is it causal?

**Solution:**
1. **Convolution:** $y[n] = x[n] * h[n]$. Length will be $3+3-1 = 5$.
   - $y[0] = x[0]h[0] = 2(1) = 2$
   - $y[1] = x[0]h[1] + x[1]h[0] = 2(-1) + 1(1) = -1$
   - $y[2] = x[0]h[2] + x[1]h[1] + x[2]h[0] = 2(2) + 1(-1) + 3(1) = 6$
   - $y[3] = x[1]h[2] + x[2]h[1] = 1(2) + 3(-1) = -1$
   - $y[4] = x[2]h[2] = 3(2) = 6$
   Result: $y[n] = \\{2, -1, 6, -1, 6\\}$.
2. **Stability:** Check if $\\sum |h[n]| < \\infty$. $|1| + |-1| + |2| = 4 < \\infty$. The system is **stable**.
3. **Causality:** $h[n] = 0$ for $n < 0$. The system is **causal**.

### Topic 2: Nyquist Theorem & Aliasing

**Potential Question:** A continuous-time signal $x(t) = \\cos(400\\pi t) + \\sin(1000\\pi t)$ is sampled at $f_s = 600$ Hz. What frequencies will be present in the sampled signal?

**Solution:**
1. **Identify frequencies:** $f_1 = 400\\pi / 2\\pi = 200$ Hz. $f_2 = 1000\\pi / 2\\pi = 500$ Hz.
2. **Check Nyquist:** $f_s/2 = 300$ Hz.
3. **Evaluate $f_1$:** 200 Hz $< 300$ Hz. It is **not aliased**.
4. **Evaluate $f_2$:** 500 Hz $> 300$ Hz. It will alias. $f_{\\text{alias}} = |f_2 - k f_s| = |500 - 600| = |-100| = 100$ Hz.
Result: The reconstructed signal will have frequencies at **100 Hz** and **200 Hz**.

### Topic 3: Z-Transform and Frequency Response

**Potential Question:** A system is defined by $y[n] = 0.5 y[n-1] + x[n] + x[n-1]$. Find the transfer function $H(z)$, its poles/zeros, and determine if it acts as a lowpass or highpass filter.

**Solution:**
1. **Z-Transform:** $Y(z) = 0.5 z^{-1} Y(z) + X(z) + z^{-1} X(z)$
2. **Transfer Function:** $H(z) = \\frac{Y(z)}{X(z)} = \\frac{1 + z^{-1}}{1 - 0.5 z^{-1}} = \\frac{z + 1}{z - 0.5}$
3. **Poles/Zeros:** Zero at $z = -1$. Pole at $z = 0.5$. Since $|0.5| < 1$, the system is stable.
4. **Filter Type:** Evaluate frequency response magnitude at DC ($\\omega = 0, z=1$) and Nyquist ($\\omega = \\pi, z=-1$).
   - $|H(e^{j0})| = |\\frac{1 + 1}{1 - 0.5}| = 4$
   - $|H(e^{j\\pi})| = |\\frac{-1 + 1}{-1 - 0.5}| = 0$
   Result: High gain at DC, zero gain at Nyquist. This is a **lowpass filter**.

### Topic 4: Filter Design (Bilinear Transform)

**Potential Question:** Given an analog lowpass filter $H(s) = \\frac{1}{s+1}$, use the bilinear transform to design a digital filter $H(z)$ assuming a sampling period $T_s = 2$.

**Solution:**
1. **Bilinear Substitution:** $s = \\frac{2}{T_s} \\frac{1-z^{-1}}{1+z^{-1}}$. Since $T_s = 2$, $s = \\frac{1-z^{-1}}{1+z^{-1}}$.
2. **Substitute into H(s):**
   $$H(z) = \\frac{1}{\\frac{1-z^{-1}}{1+z^{-1}} + 1} = \\frac{1}{\\frac{(1-z^{-1}) + (1+z^{-1})}{1+z^{-1}}}$$
   $$H(z) = \\frac{1+z^{-1}}{2} = 0.5 + 0.5z^{-1}$$
   Result: The digital filter is $y[n] = 0.5x[n] + 0.5x[n-1]$ (a simple moving average!).



### 🧠 Knowledge Check

\`\`\`quiz
question: Across the entire DSP pipeline, if a discrete system is defined as y[n] = x[n] + 0.5*y[n-1], what kind of filter is this?
a: An FIR filter because it has finite terms.
b: An IIR filter because the current output depends on previous outputs (feedback).
c: A non-causal filter.
d: A non-linear filter because it combines input and output.
answer: b
explanation: The equation y[n] = x[n] + 0.5·y[n-1] has a feedback term (y[n-1] on the right side), making the impulse response infinite in duration: h[n] = (0.5)^n · u[n], which never exactly reaches zero. This is the hallmark of an IIR filter. Option (a) is wrong — having finite terms in the difference equation does not make it FIR; what matters is whether the impulse response is finite. Option (c) is wrong — the system only uses past outputs (n-1), so it is causal. Option (d) is wrong — the system is linear because it satisfies superposition; linearity is about scaling and additivity, not about mixing input and output.
\`\`\`
\`\`\`quiz
question: Which of the following correctly orders the transforms from strictly continuous to strictly discrete (both time and frequency)?
a: DFT -> DTFT -> CTFT
b: CTFT (continuous time/freq) -> DTFT (discrete time, continuous freq) -> DFT (discrete time/freq)
c: Z-Transform -> Laplace Transform -> Fourier Series
d: DFT -> Z-Transform -> CTFT -> Laplace Transform
answer: b
explanation: The CTFT (Continuous-Time Fourier Transform) operates on continuous-time signals and produces a continuous frequency spectrum. The DTFT takes discrete-time signals but still produces a continuous (and periodic) frequency spectrum. The DFT takes finite-length discrete sequences and produces discrete frequency samples. This progression — continuous→discrete in time, then continuous→discrete in frequency — is the correct ordering. Option (a) reverses the order. Option (c) mixes transforms that serve different purposes (Z-transform is the discrete analog of the Laplace transform, not a step in the same continuum). Option (d) jumbles the hierarchy arbitrarily.
\`\`\`
\`\`\`quiz
question: Ultimately, what is the fundamental mathematical operation at the heart of filtering a signal in the time domain?
a: Cross-correlation
b: Differentiation
c: Convolution
d: Matrix inversion
answer: c
explanation: For any LTI system, the output y[n] = Σ x[k]·h[n-k] is convolution of the input with the impulse response. This is the defining operation of linear time-invariant filtering. In the frequency domain, convolution becomes multiplication: Y(ω) = H(ω)·X(ω). Option (a) is close — cross-correlation is similar to convolution but without time-reversal of one signal; it measures similarity rather than filtering. Option (b) is wrong — differentiation is one specific system, not the general filtering operation. Option (d) is wrong — while matrix methods appear in adaptive filtering and least-squares problems, the fundamental filtering operation is convolution.
\`\`\`
\`\`\`quiz
question: A system has transfer function H(z) = (1 - z^{-1}) / (1 - 0.9z^{-1}). At DC (ω = 0) and at Nyquist (ω = π), what are the magnitude responses?
a: |H(e^{j0})| = 0, |H(e^{jπ})| = 2/1.9 ≈ 1.05 — this is a highpass filter.
b: |H(e^{j0})| = 1, |H(e^{jπ})| = 1 — this is an allpass filter.
c: |H(e^{j0})| = 2, |H(e^{jπ})| = 0 — this is a lowpass filter.
d: |H(e^{j0})| = 0, |H(e^{jπ})| = 0 — this filter blocks all frequencies.
answer: a
explanation: Substitute z = e^{j0} = 1: H(1) = (1-1)/(1-0.9) = 0/0.1 = 0. Substitute z = e^{jπ} = -1: H(-1) = (1-(-1))/(1-(-0.9)) = 2/1.9 ≈ 1.05. Zero gain at DC and near-unity gain at Nyquist means this is a highpass filter. The zero at z = 1 blocks DC, and the pole at z = 0.9 boosts frequencies near Nyquist. Option (b) is wrong — the gains are clearly different at DC vs Nyquist. Option (c) reverses the filter type. Option (d) is wrong — the filter passes high frequencies.
\`\`\`
\`\`\`quiz
question: You need to design a filter that preserves the shape of a QRS complex in an ECG signal while removing 50 Hz power line interference. Which approach is most appropriate?
a: A high-order IIR bandpass filter with very sharp cutoffs.
b: A linear-phase FIR notch filter centered at 50 Hz.
c: An IIR allpass filter with poles near z = 1.
d: Decimation by a factor of 50 to remove the 50 Hz component.
answer: b
explanation: Preserving the QRS waveform shape requires linear phase (equal group delay at all frequencies), which rules out IIR filters for this critical application. A notch filter at 50 Hz removes only the interference while passing all other frequencies including the QRS complex components. FIR design guarantees the linear phase needed for waveform fidelity. Option (a) is wrong — IIR filters have non-linear phase, which distorts the QRS shape, and a bandpass is the wrong topology for removing a single frequency. Option (c) is wrong — an allpass filter changes phase but not magnitude, so it cannot remove the 50 Hz interference. Option (d) is wrong — decimation reduces the sampling rate and would cause aliasing, not frequency-selective removal.
\`\`\`
`,
    labWalkthrough: `## Course Lab Summary

| Lab | Topic | Key Functions |
|-----|-------|---------------|
| 01 | Python/NumPy basics | \`np.zeros\`, \`plt.stem\` |
| 02 | Convolution (5 ways) | \`np.convolve\`, loops, matrix |
| 03 | FFT as FT approximation | \`np.fft.fft\`, \`fftfreq\`, \`fftshift\` |
| 04 | Rect/sinc FFT | Symmetry, frequency axis |
| 05 | Sampling/reconstruction | \`ifft\`, sinc interpolation |
| 06 | FFT implementation | Radix-2 DIT recursive |
| 07 | Welch PSD | Windowing, averaging |
| 08 | Bode plots | \`scipy.signal.bode\` |
| 09 | Z-transform stability | ROC, partial fractions |
| 10 | Pole-zero plots | \`np.roots\`, unit circle |
| 11 | Notch filter | Pole-zero placement |
| 12 | Audio/EEG filtering | \`lfilter\`, \`sosfilt\` |
| 13 | Spectrograms | \`plt.specgram\`, STFT |

All labs build on each other. The final labs (12-13) use techniques from every previous lab.`,

    keyFormulas: `## Master Formula Sheet

### Transforms
| Formula | Name |
|---------|------|
| $X(e^{j\\omega}) = \\sum_n x[n] e^{-j\\omega n}$ | DTFT |
| $X[k] = \\sum_{n=0}^{N-1} x[n] e^{-j2\\pi kn/N}$ | DFT |
| $X(z) = \\sum_n x[n] z^{-n}$ | Z-Transform |

### Convolution & Filtering
| Formula | Name |
|---------|------|
| $y[n] = \\sum_k x[k] h[n-k]$ | Convolution |
| $Y(z) = H(z) \\cdot X(z)$ | Freq. domain filtering |
| Stable iff $\\sum \\|h[n]\\| < \\infty$ | BIBO stability |
| Stable iff all poles $\\|p_i\\| < 1$ | Pole condition |

### Sampling
| Formula | Name |
|---------|------|
| $f_s \\geq 2f_{\\max}$ | Nyquist theorem |
| $\\Delta f = f_s / N$ | Frequency resolution |

### Filter Design
| Formula | Name |
|---------|------|
| $H(z) = \\frac{B(z)}{A(z)}$ | Transfer function |
| $s = \\frac{2}{T}\\frac{1-z^{-1}}{1+z^{-1}}$ | Bilinear transform |
| Notch: zeros at $e^{\\pm j\\omega_0}$ | Notch filter |`,
  },
];
