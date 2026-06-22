import type { WeekContent } from './weeks1to5';

export const pythonWalkthrough: WeekContent[] = [
  {
    id: 15,
    title: 'Python Coding Walkthrough',
    bigPicture: `## DSP with Python: The Engineer's Toolkit

Digital Signal Processing is heavily math-oriented, but actually implementing those algorithms requires a robust set of tools. In modern DSP, **Python** is the industry standard for prototyping and analysis.

This walkthrough serves as your ultimate guide to solving DSP coding problems. We will explore the holy trinity of libraries:
1. **NumPy** (\`numpy\`): For creating time vectors, arrays, running the Fast Fourier Transform (FFT), and performing convolutions.
2. **SciPy** (\`scipy.signal\`): The powerhouse that contains all filter design algorithms (FIR, IIR), filtering functions, and spectrogram analysis.
3. **Matplotlib** (\`matplotlib.pyplot\`): For visualizing signals in the time and frequency domains.

> **Key insight**: Every DSP coding problem follows the same three-step architecture: **1) Generate/Load the Signal**, **2) Process the Signal** (Filter/Transform/Analyze), and **3) Visualize the Results**. Once you master this workflow, no coding exam problem will intimidate you!`,
    concepts: [
      {
        name: '1. Generating Time Vectors and Signals',
        explanation: `Before doing any processing, you need a signal! Signals are represented as 1D arrays (lists of numbers). Since digital signals are sampled at specific time intervals, we always start by defining the **sampling frequency** ($f_s$) and the **time vector**.

### 📌 Problem 1: Time Vectors
A time vector \`t\` maps each sample index $n$ to an actual time in seconds. Use \`np.arange\` to create it.
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

fs = 1000  # Sampling frequency in Hz
T = 1.0    # Total duration in seconds

# Generate the time vector: starts at 0, ends just before T, steps by 1/fs
t = np.arange(0, T, 1/fs)

# Now generate a 50 Hz sine wave
f0 = 50
x = np.sin(2 * np.pi * f0 * t)

plt.plot(t[:100], x[:100]) # Plot the first 100 samples
plt.title("50 Hz Sine Wave")
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.grid()
plt.show()
\`\`\`

### 📌 Problem 2: Useful Signals (Impulses, Noise, Chirps)
- **Unit Impulse**: A signal that is 1 at $n=0$ and 0 everywhere else.
- **White Noise**: Random values, typically Gaussian.
- **Chirp**: A signal whose frequency increases over time (great for testing filters).

\`\`\`python
from scipy.signal import chirp

# Unit impulse
impulse = np.zeros(len(t))
impulse[0] = 1.0

# Gaussian White Noise
noise = np.random.normal(0, 1, len(t))

# Swept-frequency cosine (Chirp) from 1Hz to 100Hz over 1 second
sweep = chirp(t, f0=1, f1=100, t1=1, method='linear')
\`\`\`
`
      },
      {
        name: '2. Convolution and LTI Systems',
        explanation: `Convolution is the mathematical foundation of Linear Time-Invariant (LTI) systems. If you know a system's impulse response $h[n]$, you can find its output for *any* input $x[n]$ using convolution.

### 📌 Problem 3: Performing 1D Convolution
Use \`np.convolve\` to compute the convolution of two sequences. 

\`\`\`python
# Let's say we have a simple 3-point moving average filter
h = np.array([1/3, 1/3, 1/3])

# And a simple input signal
x = np.array([1, 2, 3, 4, 5])

# 'full' returns the full linear convolution (length N + M - 1)
# 'same' returns an output the same length as x (centered)
# 'valid' returns only the elements where the signals completely overlap
y_full = np.convolve(x, h, mode='full')
y_same = np.convolve(x, h, mode='same')

print("Input length:", len(x))
print("Output length (full):", len(y_full)) 
\`\`\`
`
      },
      {
        name: '3. Frequency Analysis (FFT) & Windowing',
        explanation: `To see what frequencies are present in a signal, we use the Fast Fourier Transform (FFT). This is the most crucial diagnostic tool in your arsenal.

### 📌 Problem 4: Plotting an Accurate Spectrum
A bare \`np.fft.fft\` gives you complex numbers and the frequencies aren't ordered intuitively. You *must* use \`np.fft.fftfreq\` to get the X-axis and \`np.fft.fftshift\` to center zero frequency (DC) in the middle.

\`\`\`python
# 1. Compute the FFT
X = np.fft.fft(x)

# 2. Shift the zero-frequency component to the center
X_shifted = np.fft.fftshift(X)

# 3. Create the frequency axis
# fftfreq needs the number of points and the sampling period (1/fs)
freqs = np.fft.fftfreq(len(t), 1/fs)
freqs_shifted = np.fft.fftshift(freqs)

# 4. Plot Magnitude (in decibels for better dynamic range!)
magnitude = np.abs(X_shifted)
# Avoid log(0) by adding a tiny number
magnitude_db = 20 * np.log10(magnitude + 1e-12)

plt.plot(freqs_shifted, magnitude_db)
plt.title("Magnitude Spectrum")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude (dB)")
plt.xlim(-100, 100) # Zoom in to see the 50Hz peak
plt.grid()
plt.show()
\`\`\`
> [!TIP]
> Always plot spectra using absolute magnitude \`np.abs()\`. The raw FFT output is complex (containing both magnitude and phase).

### 📌 Problem 5: Windowing and Spectral Leakage
If your signal doesn't perfectly fit into the FFT window (which is almost always true for real-world signals), you will get **spectral leakage**—energy smearing into neighboring frequencies.
We fix this by multiplying the time-domain signal by a **Window Function** before taking the FFT.

\`\`\`python
# Generate a signal that doesn't fit perfectly into the FFT window length
t_leak = np.arange(0, 1.0, 1/1000)
x_leak = np.sin(2 * np.pi * 50.5 * t_leak) # 50.5 Hz doesn't complete a full cycle exactly

# Apply different windows
win_rect = np.ones(len(x_leak))          # No window (Rectangular)
win_hann = np.hanning(len(x_leak))       # Hanning window
win_blackman = np.blackman(len(x_leak))  # Blackman window

# Compute FFTs
X_rect = np.abs(np.fft.fft(x_leak * win_rect))
X_hann = np.abs(np.fft.fft(x_leak * win_hann))

# Plot the difference
freqs = np.fft.fftfreq(len(t_leak), 1/1000)
plt.plot(freqs[:100], 20*np.log10(X_rect[:100] + 1e-12), label='Rectangular (High Leakage)')
plt.plot(freqs[:100], 20*np.log10(X_hann[:100] + 1e-12), label='Hanning (Low Leakage)')
plt.xlim(30, 70)
plt.title("Spectral Leakage Comparison")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude (dB)")
plt.legend()
plt.grid()
plt.show()
\`\`\`
`
      },
      {
        name: '4. Advanced Filter Design',
        explanation: `SciPy provides two main ways to process signals: **FIR** (Finite Impulse Response) and **IIR** (Infinite Impulse Response) filters.

### 📌 Problem 6: Designing FIR Filters
\`scipy.signal.firwin\` is the go-to function for designing FIR filters. Note that \`firwin\` expects the cutoff frequency relative to the Nyquist frequency ($f_s / 2$).

\`\`\`python
from scipy.signal import firwin, lfilter

# Design a 101-tap Lowpass FIR filter with a 150 Hz cutoff
num_taps = 101
cutoff_hz = 150
nyquist = fs / 2

b = firwin(num_taps, cutoff_hz / nyquist, pass_zero='lowpass')
a = [1.0] # FIR filters always have a = [1.0]

filtered_x = lfilter(b, a, x + noise)
\`\`\`

### 📌 Problem 7: Comparing IIR Filter Topologies
Butterworth isn't the only option! Different IIR designs trade off passband ripple, stopband attenuation, and transition band steepness.
- **Butterworth (\`butter\`)**: Maximally flat passband, slow transition.
- **Chebyshev I (\`cheby1\`)**: Steeper transition, but has ripple in the passband.
- **Chebyshev II (\`cheby2\`)**: Steeper transition, flat passband, but ripple in the stopband.
- **Elliptic (\`ellip\`)**: Steepest transition possible, but ripple in BOTH passband and stopband.

\`\`\`python
from scipy.signal import butter, cheby1, ellip, freqz

order = 4
cutoff = 0.3 # Normalized to Nyquist

# Design filters
b_butt, a_butt = butter(order, cutoff)
b_cheb, a_cheb = cheby1(order, rp=3, Wn=cutoff) # rp = max passband ripple in dB
b_ellip, a_ellip = ellip(order, rp=3, rs=40, Wn=cutoff) # rs = min stopband attenuation in dB

# Compute frequency responses
w, h_butt = freqz(b_butt, a_butt)
w, h_cheb = freqz(b_cheb, a_cheb)
w, h_ellip = freqz(b_ellip, a_ellip)

# Plot comparison
plt.plot(w/np.pi, 20*np.log10(np.abs(h_butt) + 1e-12), label='Butterworth')
plt.plot(w/np.pi, 20*np.log10(np.abs(h_cheb) + 1e-12), label='Chebyshev I')
plt.plot(w/np.pi, 20*np.log10(np.abs(h_ellip) + 1e-12), label='Elliptic')
plt.title("IIR Filter Comparisons (Order 4)")
plt.xlabel("Normalized Frequency (x Nyquist)")
plt.ylabel("Magnitude (dB)")
plt.ylim(-60, 5)
plt.axvline(cutoff, color='k', linestyle='--')
plt.legend()
plt.grid()
plt.show()
\`\`\`
`
      },
      {
        name: '5. Multirate DSP & Audio Processing',
        explanation: `Real-world DSP often involves changing sampling rates (Resampling) and processing actual audio files rather than generated arrays.

### 📌 Problem 8: Decimation and Interpolation
**Decimation** reduces the sampling rate. You MUST apply a low-pass anti-aliasing filter before removing samples. Fortunately, \`scipy.signal.decimate\` does both automatically!
**Interpolation** increases the sampling rate. You insert zeros between samples and then low-pass filter to remove spectral imaging.

\`\`\`python
from scipy.signal import decimate, resample

# Let's say we have a signal sampled at 48 kHz
fs_high = 48000
t_high = np.arange(0, 0.01, 1/fs_high)
x_high = np.sin(2 * np.pi * 1000 * t_high) # 1 kHz tone

# Decimate down to 8 kHz (Downsample factor = 6)
# decimate() automatically applies a Chebyshev anti-aliasing filter first!
x_dec = decimate(x_high, q=6)
fs_new = fs_high / 6

# Plot the difference
plt.plot(t_high, x_high, 'o-', label=f'Original (fs={fs_high})', alpha=0.5)
plt.plot(np.arange(len(x_dec))/fs_new, x_dec, 's-', label=f'Decimated (fs={fs_new})')
plt.xlim(0, 0.003)
plt.legend()
plt.title("Signal Decimation")
plt.grid()
plt.show()
\`\`\`

### 📌 Problem 9: Loading and Saving Audio
To process real audio, use \`scipy.io.wavfile\`. 
*Note: The array returned by wavfile.read might be integers. It is heavily recommended to normalize audio to float between -1.0 and 1.0 before processing.*

\`\`\`python
import io
from scipy.io import wavfile

# Creating a mock WAV file in memory (for this example to run)
# In real life, you'd just do: fs, audio = wavfile.read("music.wav")
mock_wav = io.BytesIO()
wavfile.write(mock_wav, 44100, np.random.uniform(-1, 1, 44100).astype(np.float32))
mock_wav.seek(0)

# 1. Load Audio
fs_audio, audio_data = wavfile.read(mock_wav)

# Normalize if it's int16 (max absolute value 32768)
if audio_data.dtype == np.int16:
    audio_data = audio_data.astype(np.float32) / 32768.0

print(f"Loaded audio: {len(audio_data)} samples at {fs_audio} Hz")

# Process audio (e.g., apply a filter here)

# 2. Save Audio
# wavfile.write("output.wav", fs_audio, audio_data)
\`\`\`
`
      },
      {
        name: '6. Advanced Analysis: Poles/Zeros and Spectrograms',
        explanation: `Once you've designed a filter or obtained a system transfer function, analyzing its stability and frequency behavior mathematically is critical.

### 📌 Problem 10: Finding Poles and Zeros
The transfer function is defined by numerator coefficients (\`b\`) and denominator coefficients (\`a\`). The roots of \`b\` are the zeros, and the roots of \`a\` are the poles.
\`\`\`python
# For an IIR filter: H(z) = (1 + 2z^-1 + z^-2) / (1 - 0.5z^-1 + 0.8z^-2)
b_sys = [1.0, 2.0, 1.0]
a_sys = [1.0, -0.5, 0.8]

# Find poles and zeros using np.roots
zeros = np.roots(b_sys)
poles = np.roots(a_sys)

# Check stability (all poles must be inside the unit circle: |p| < 1)
is_stable = all(np.abs(poles) < 1.0)
print(f"Is the system stable? {is_stable}")
\`\`\`

### 📌 Problem 11: The Spectrogram (STFT)
When frequencies change over time (like a chirp or human speech), a standard FFT isn't enough. We use the Short-Time Fourier Transform (STFT) to compute a spectrogram.
\`\`\`python
from scipy.signal import spectrogram

# Compute the spectrogram of a chirp signal
f_spec, t_spec, Sxx = spectrogram(sweep, fs, nperseg=256)

# Plot using pcolormesh
plt.pcolormesh(t_spec, f_spec, 10 * np.log10(Sxx + 1e-12), shading='gouraud')
plt.ylabel('Frequency [Hz]')
plt.xlabel('Time [sec]')
plt.title('Spectrogram of a Chirp')
plt.colorbar(label='Power/Frequency (dB/Hz)')
plt.show()
\`\`\`
`
      }
    ],
    homeworkGuide: `## Exam-Style Coding Walkthroughs

The best way to prepare for DSP coding exams is to recognize common patterns. Let's walk through four entire end-to-end exam problems, ranging from basic filtering to multi-stage real-world implementations.

### 📌 Scenario 1: The Humming Biosignal
**Prompt:** You are given an ECG signal sampled at 1000 Hz. However, it is corrupted by extreme 50 Hz power-line interference. 
1. Generate a mock 1-second ECG signal (a 1 Hz sine wave) corrupted by a massive 50 Hz sine wave.
2. Design a 2nd-order IIR Notch filter to exactly remove the 50 Hz hum. Set the quality factor $Q = 30$.
3. Apply the filter and plot the original vs. filtered signal.
4. Plot the magnitude spectrum of the filtered signal to prove the 50 Hz hum is gone.

#### Step 1: Generating the Mock Signal
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import iirnotch, filtfilt

fs = 1000
t = np.arange(0, 1, 1/fs)

clean_ecg = np.sin(2 * np.pi * 1 * t) # 1 Hz heartbeat
interference = 5 * np.sin(2 * np.pi * 50 * t) # 50 Hz hum (5x stronger!)

corrupted_signal = clean_ecg + interference
\`\`\`

#### Step 2: Designing the Notch Filter
The \`scipy.signal.iirnotch\` function is specifically made for this! It requires the notch frequency and a Quality factor $Q$. Higher $Q$ means a narrower notch.
\`\`\`python
f0 = 50.0  # Frequency to be removed
Q = 30.0   # Quality factor

# Design notch filter
b, a = iirnotch(f0, Q, fs)
\`\`\`

#### Step 3: Applying the Filter
Since this is an IIR filter and we don't want to warp the phase of our ECG, we will use \`filtfilt\`.
\`\`\`python
# Apply zero-phase forward-backward filtering
recovered_ecg = filtfilt(b, a, corrupted_signal)

# Plotting
plt.figure(figsize=(10, 4))
plt.plot(t, corrupted_signal, label='Corrupted (Hum)', alpha=0.5)
plt.plot(t, recovered_ecg, label='Recovered ECG', linewidth=2)
plt.legend()
plt.title("Notch Filter Application")
plt.xlabel("Time (s)")
plt.show()
\`\`\`

#### Step 4: Spectral Verification
\`\`\`python
# Compute FFT of recovered signal
X_rec = np.fft.fftshift(np.fft.fft(recovered_ecg))
freqs = np.fft.fftshift(np.fft.fftfreq(len(t), 1/fs))

plt.figure(figsize=(10, 4))
plt.plot(freqs, 20 * np.log10(np.abs(X_rec) + 1e-12))
plt.xlim(0, 100) # Focus on the 0-100Hz range
plt.title("Recovered Signal Spectrum")
plt.axvline(50, color='red', linestyle=':', label='50 Hz (Notch location)')
plt.legend()
plt.grid()
plt.show()
\`\`\`

> [!TIP]
> Notice the deep dip at exactly 50 Hz in the magnitude spectrum! This proves your filter design was flawless. Always use spectral verification in your exams.

---

### 📌 Scenario 2: The Mystery System
**Prompt:** A black-box digital system operates at $f_s = 48$ kHz. You are given its difference equation: $y[n] = 0.5y[n-1] - 0.25y[n-2] + x[n] + x[n-1]$.
1. Extract the $b$ and $a$ coefficients.
2. Plot the system's poles and zeros on the complex plane. Is the system stable?
3. Plot the Bode plot (Magnitude and Phase response) of this system.

#### Step 1: Extracting Coefficients
First, rearrange the difference equation so all $y$ terms are on the left:
$y[n] - 0.5y[n-1] + 0.25y[n-2] = x[n] + x[n-1]$
The $a$ coefficients correspond to the $y$ terms, and $b$ coefficients correspond to the $x$ terms.
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import freqz

# Coefficients MUST be in ascending powers of delay (z^0, z^-1, z^-2)
b = [1.0, 1.0]          # for x[n], x[n-1]
a = [1.0, -0.5, 0.25]   # for y[n], y[n-1], y[n-2]
fs = 48000
\`\`\`

#### Step 2: Pole-Zero Plot & Stability
\`\`\`python
# Find roots
zeros = np.roots(b)
poles = np.roots(a)

# Draw unit circle
theta = np.linspace(0, 2*np.pi, 100)
plt.plot(np.cos(theta), np.sin(theta), linestyle='--', color='gray')

# Plot poles (x) and zeros (o)
plt.scatter(np.real(zeros), np.imag(zeros), s=100, marker='o', facecolors='none', edgecolors='b', label='Zeros')
plt.scatter(np.real(poles), np.imag(poles), s=100, marker='x', color='r', label='Poles')

plt.axhline(0, color='black', lw=0.5)
plt.axvline(0, color='black', lw=0.5)
plt.title("Pole-Zero Plot")
plt.legend()
plt.axis('equal')
plt.grid()
plt.show()

# Stability check
is_stable = np.all(np.abs(poles) < 1.0)
print(f"System is stable: {is_stable}")
# Output will be True, because both poles are inside the unit circle.
\`\`\`

#### Step 3: Bode Plot (Frequency Response)
\`\`\`python
# Compute frequency response
w, h = freqz(b, a, worN=8000)
freqs_hz = (w / np.pi) * (fs / 2)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6))

# Magnitude Plot
ax1.plot(freqs_hz, 20 * np.log10(np.abs(h)))
ax1.set_title('System Magnitude Response')
ax1.set_ylabel('Gain (dB)')
ax1.grid()

# Phase Plot
phase_rad = np.unwrap(np.angle(h))
ax2.plot(freqs_hz, phase_rad * (180 / np.pi))
ax2.set_title('System Phase Response')
ax2.set_ylabel('Phase (Degrees)')
ax2.set_xlabel('Frequency (Hz)')
ax2.grid()

plt.tight_layout()
plt.show()
\`\`\`

---

### 📌 Scenario 3: Amplitude Modulation (AM)
**Prompt:** A classic communication systems problem. You need to modulate a low-frequency message signal onto a high-frequency carrier.
1. Generate a 5 Hz message signal and a 100 Hz carrier signal, sampled at 1000 Hz.
2. Modulate them using standard AM equation: $y(t) = [1 + m \cdot x(t)] \cdot c(t)$, where $m = 0.8$.
3. Compute and plot the spectrum to verify the carrier and sidebands.

#### Implementation
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

fs = 1000
t = np.arange(0, 2, 1/fs) # 2 seconds of data

# Signals
fm = 5    # Message frequency
fc = 100  # Carrier frequency
m = 0.8   # Modulation index

msg = np.sin(2 * np.pi * fm * t)
carrier = np.sin(2 * np.pi * fc * t)

# AM Modulation
y_am = (1 + m * msg) * carrier

# Spectral Analysis with Hanning Window
win = np.hanning(len(y_am))
Y_am_fft = np.fft.fft(y_am * win)
freqs = np.fft.fftfreq(len(t), 1/fs)

# Keep only positive frequencies for cleaner plot
pos_idx = freqs >= 0
freqs_pos = freqs[pos_idx]
mag_pos = np.abs(Y_am_fft[pos_idx])

# Plotting the Time Domain (First 0.5s)
plt.figure(figsize=(10, 6))
plt.subplot(2, 1, 1)
plt.plot(t[:500], y_am[:500])
plt.plot(t[:500], 1 + m * msg[:500], 'r--', label='Envelope')
plt.title("AM Signal in Time Domain")
plt.legend()
plt.grid()

# Plotting the Frequency Domain
plt.subplot(2, 1, 2)
plt.plot(freqs_pos, 20*np.log10(mag_pos + 1e-12))
plt.xlim(80, 120)
plt.title("AM Spectrum (Notice the Carrier at 100Hz and Sidebands at 95Hz & 105Hz)")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude (dB)")
plt.grid()

plt.tight_layout()
plt.show()
\`\`\`

---

### 📌 Scenario 4: Audio Downsampling (Multirate)
**Prompt:** You are building a system that transmits audio over a low-bandwidth channel. You must decimate a 48 kHz signal down to 8 kHz.
1. Create a mock signal containing a 1 kHz tone (desired) and a 20 kHz tone (noise).
2. Decimate the signal by a factor of 6.
3. Show the FFT of the signal before and after decimation to prove the 20 kHz tone was safely removed by the anti-aliasing filter.

#### Implementation
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import decimate

fs_original = 48000
t_orig = np.arange(0, 0.1, 1/fs_original) # 100 ms

# Composite Signal: 1 kHz target + 20 kHz ultrasonic noise
x_orig = np.sin(2 * np.pi * 1000 * t_orig) + 0.5 * np.sin(2 * np.pi * 20000 * t_orig)

# Decimate by factor of 6 -> new fs = 8000 Hz
factor = 6
fs_new = fs_original / factor
x_down = decimate(x_orig, factor)

# Compute Spectra
f_orig = np.fft.fftfreq(len(x_orig), 1/fs_original)
X_orig = np.abs(np.fft.fft(x_orig))

f_new = np.fft.fftfreq(len(x_down), 1/fs_new)
X_new = np.abs(np.fft.fft(x_down))

# Plot Comparison
plt.figure(figsize=(10, 5))
plt.plot(f_orig[f_orig>=0], X_orig[f_orig>=0], label='Original (48 kHz)', alpha=0.7)
plt.plot(f_new[f_new>=0], X_new[f_new>=0]*factor, label='Decimated (8 kHz)', linewidth=2)
plt.title("Decimation Anti-Aliasing Verification")
plt.xlabel("Frequency (Hz)")
plt.xlim(0, 24000)
plt.legend()
plt.grid()
plt.show()
\`\`\`
`,
    labWalkthrough: `## Quick Reference Templates

Copy and paste these templates directly into the Code IDE to quickly start solving lab or exam problems.

### 📌 Template 1: Standard FFT Analysis
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

def plot_spectrum(x, fs, title="Spectrum"):
    X = np.fft.fftshift(np.fft.fft(x))
    freqs = np.fft.fftshift(np.fft.fftfreq(len(x), 1/fs))
    
    mag_db = 20 * np.log10(np.abs(X) + 1e-12)
    
    plt.figure()
    plt.plot(freqs, mag_db)
    plt.title(title)
    plt.xlabel("Frequency (Hz)")
    plt.ylabel("Magnitude (dB)")
    plt.grid()
    plt.show()
\`\`\`

### 📌 Template 2: Evaluate Any Filter
Given \`b\` and \`a\` coefficients, plot its frequency response instantly.
\`\`\`python
from scipy.signal import freqz
import numpy as np
import matplotlib.pyplot as plt

def plot_filter_response(b, a, fs):
    w, h = freqz(b, a, worN=8000)
    freqs = (w / np.pi) * (fs / 2)
    
    plt.figure()
    plt.plot(freqs, 20 * np.log10(np.abs(h)))
    plt.title("Frequency Response")
    plt.xlabel("Frequency (Hz)")
    plt.ylabel("Gain (dB)")
    plt.grid()
    plt.show()
\`\`\`

### 📌 Template 3: Beautiful Pole-Zero Plot
Given \`b\` and \`a\` coefficients, perfectly visualize the poles and zeros relative to the unit circle.
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

def plot_pzmap(b, a):
    zeros = np.roots(b)
    poles = np.roots(a)
    
    plt.figure(figsize=(5, 5))
    theta = np.linspace(0, 2*np.pi, 100)
    plt.plot(np.cos(theta), np.sin(theta), '--', color='gray', alpha=0.5)
    
    plt.scatter(np.real(zeros), np.imag(zeros), s=100, marker='o', facecolors='none', edgecolors='b', lw=2, label='Zeros')
    plt.scatter(np.real(poles), np.imag(poles), s=100, marker='x', color='r', lw=2, label='Poles')
    
    plt.axhline(0, color='black', lw=1)
    plt.axvline(0, color='black', lw=1)
    
    # Dynamically set limits
    max_val = max(1.5, np.max(np.abs(np.concatenate([zeros, poles, [1]]))) * 1.2)
    plt.xlim(-max_val, max_val)
    plt.ylim(-max_val, max_val)
    
    plt.title("Pole-Zero Map")
    plt.legend()
    plt.grid(alpha=0.3)
    plt.show()
\`\`\`

### 📌 Template 4: Advanced Windowed FFT
Automatically applies a Hanning window and properly scales the amplitude before plotting.
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

def plot_windowed_spectrum(x, fs):
    # Apply Hanning window
    win = np.hanning(len(x))
    x_win = x * win
    
    # Hanning window reduces total amplitude by factor of 2, so we multiply by 2 to compensate
    X = np.fft.fft(x_win) * 2 / len(x)
    freqs = np.fft.fftfreq(len(x), 1/fs)
    
    # Keep positive frequencies
    pos = freqs >= 0
    
    plt.figure()
    plt.plot(freqs[pos], 20 * np.log10(np.abs(X[pos]) + 1e-12))
    plt.title("Windowed Spectrum (Hanning)")
    plt.xlabel("Frequency (Hz)")
    plt.ylabel("Magnitude (dB)")
    plt.grid()
    plt.show()
\`\`\`

### 📌 Template 5: Real-Time Audio Buffering Mockup
Simulates how audio is processed in real-time "chunks" (blocks) rather than all at once.
\`\`\`python
import numpy as np

def realtime_processing_mockup(full_signal, chunk_size=1024):
    num_chunks = len(full_signal) // chunk_size
    output_signal = np.zeros_like(full_signal)
    
    for i in range(num_chunks):
        # Extract chunk
        start_idx = i * chunk_size
        end_idx = start_idx + chunk_size
        chunk = full_signal[start_idx:end_idx]
        
        # --- DO PROCESSING ON CHUNK HERE ---
        # e.g., chunk_processed = my_filter(chunk)
        chunk_processed = chunk * 0.5 # Example: volume reduction
        # -----------------------------------
        
        # Place processed chunk back
        output_signal[start_idx:end_idx] = chunk_processed
        
    return output_signal
\`\`\`
`,
    keyFormulas: `## Python API Quick Reference

Here are the most critical functions you will use over and over again:

### NumPy
*   \`np.arange(start, stop, step)\`: Generate a time vector.
*   \`np.zeros(N)\`: Generate an array of zeros.
*   \`np.hanning(N)\`, \`np.hamming(N)\`, \`np.blackman(N)\`: Generate window functions of length N.
*   \`np.convolve(a, v, mode)\`: Returns the discrete, linear convolution of two one-dimensional sequences.
*   \`np.roots(p)\`: Return the roots of a polynomial with coefficients given in p.
*   \`np.fft.fft(x)\`: Compute the Discrete Fourier Transform.
*   \`np.fft.fftshift(X)\`: Shift the zero-frequency component to the center of the spectrum.
*   \`np.fft.fftfreq(N, d)\`: Return the Discrete Fourier Transform sample frequencies. $d$ is the sample spacing ($1/f_s$).

### SciPy Signal
*   \`scipy.signal.firwin(numtaps, cutoff)\`: FIR filter design using the window method. Cutoff is expressed as a fraction of the Nyquist frequency.
*   \`scipy.signal.butter(N, Wn, btype)\`: Butterworth digital filter design. Returns \`b, a\`.
*   \`scipy.signal.cheby1(N, rp, Wn)\`: Chebyshev Type I filter design (steeper transition, ripple in passband).
*   \`scipy.signal.ellip(N, rp, rs, Wn)\`: Elliptic filter design (steepest transition, ripple in passband and stopband).
*   \`scipy.signal.iirnotch(w0, Q)\`: Design a second-order IIR notch digital filter.
*   \`scipy.signal.freqz(b, a)\`: Compute the frequency response of a digital filter.
*   \`scipy.signal.lfilter(b, a, x)\`: Filter data along one-dimension with an IIR or FIR filter (causes phase shift).
*   \`scipy.signal.filtfilt(b, a, x)\`: Apply a digital filter forward and backward to a signal (zero phase distortion).
*   \`scipy.signal.decimate(x, q)\`: Downsample the signal after applying an anti-aliasing filter.
*   \`scipy.signal.resample(x, num)\`: Resample $x$ to $num$ samples using Fourier method.
*   \`scipy.signal.spectrogram(x, fs)\`: Compute a spectrogram with consecutive Fourier transforms.

### SciPy IO (Audio)
*   \`scipy.io.wavfile.read(filename)\`: Return the sample rate (in samples/sec) and data from a WAV file.
*   \`scipy.io.wavfile.write(filename, rate, data)\`: Write a numpy array as a WAV file.`
  }
];
