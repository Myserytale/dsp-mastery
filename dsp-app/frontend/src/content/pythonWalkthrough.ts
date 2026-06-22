import type { WeekContent } from './weeks1to5';

export const pythonWalkthrough: WeekContent[] = [
  {
    id: 15,
    title: 'Python Coding Walkthrough',
    bigPicture: `## DSP with Python: The Engineer's Toolkit

Digital Signal Processing is heavily math-oriented, but actually implementing those algorithms requires a robust set of tools. In modern DSP, **Python** is the industry standard for prototyping and analysis.

This walkthrough serves as your ultimate guide to solving DSP coding problems. We will explore the holy trinity of libraries:
1. **NumPy** (\`numpy\`): For creating time vectors, arrays, and running the Fast Fourier Transform (FFT).
2. **SciPy** (\`scipy.signal\`): The powerhouse that contains all filter design algorithms (FIR, IIR), filtering functions, and spectrogram analysis.
3. **Matplotlib** (\`matplotlib.pyplot\`): For visualizing signals in the time and frequency domains.

> **Key insight**: Every DSP coding problem follows the same three-step architecture: **1) Generate/Load the Signal**, **2) Process the Signal** (Filter/Transform), and **3) Analyze/Plot the Results**. Once you master this workflow, no coding exam problem will intimidate you!`,
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
        name: '2. Frequency Analysis (FFT)',
        explanation: `To see what frequencies are present in a signal, we use the Fast Fourier Transform (FFT). This is the most crucial diagnostic tool in your arsenal.

### 📌 Problem 3: Plotting an Accurate Spectrum
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
> Always plot spectra using absolute magnitude \`np.abs()\`. The raw FFT output is complex (containing both magnitude and phase).`
      },
      {
        name: '3. Filter Design and Application',
        explanation: `SciPy provides two main ways to process signals: **FIR** (Finite Impulse Response) and **IIR** (Infinite Impulse Response) filters.

### 📌 Problem 4: Designing FIR Filters using Window Method
\`scipy.signal.firwin\` is the go-to function for designing FIR filters. It requires the number of taps (coefficients) and the cutoff frequency. Note that \`firwin\` expects the cutoff frequency relative to the Nyquist frequency ($f_s / 2$).

\`\`\`python
from scipy.signal import firwin, freqz, lfilter

# Design a 101-tap Lowpass FIR filter with a 150 Hz cutoff
num_taps = 101
cutoff_hz = 150
nyquist = fs / 2

# cutoff must be between 0 and 1 (1 = Nyquist)
b = firwin(num_taps, cutoff_hz / nyquist, pass_zero='lowpass')
a = [1.0] # FIR filters always have a = [1.0]

# Apply the filter to a noisy signal!
filtered_x = lfilter(b, a, x + noise)
\`\`\`

### 📌 Problem 5: Designing IIR Filters (Butterworth)
For IIR filters, we typically use analog prototypes like Butterworth, Chebyshev, or Elliptic, which are digitized using the Bilinear Transform.

\`\`\`python
from scipy.signal import butter, filtfilt

# Design a 4th-order Bandpass Butterworth filter (50 Hz to 200 Hz)
order = 4
low_cut = 50
high_cut = 200

# butter returns both 'b' (numerator) and 'a' (denominator) coefficients
b_iir, a_iir = butter(order, [low_cut/nyquist, high_cut/nyquist], btype='band')

# Tip: Use filtfilt instead of lfilter for IIR filters!
# filtfilt runs the filter forwards and backwards, resulting in ZERO phase distortion.
zero_phase_filtered = filtfilt(b_iir, a_iir, x + noise)
\`\`\`
`
      },
      {
        name: '4. Frequency Response (Bode Plots)',
        explanation: `Once you've designed a filter (found the \`b\` and \`a\` coefficients), you need to verify it actually works by checking its frequency response.

### 📌 Problem 6: Visualizing the Filter Response
Use \`scipy.signal.freqz\` to compute the frequency response of a digital filter.

\`\`\`python
# Compute frequency response of our FIR filter
w, h = freqz(b, a, worN=8000)

# Convert digital angular frequency 'w' (0 to pi) back to physical Hz
freqs_hz = (w / np.pi) * nyquist

# Plot Magnitude Response
plt.figure()
plt.plot(freqs_hz, 20 * np.log10(np.abs(h)))
plt.title("FIR Filter Frequency Response")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Gain (dB)")
plt.axvline(150, color='red', linestyle='--', label='Cutoff (150Hz)')
plt.legend()
plt.grid()
plt.show()

# Plot Phase Response
plt.figure()
# np.unwrap prevents phase jumps from +pi to -pi
phase_degrees = np.unwrap(np.angle(h)) * (180 / np.pi)
plt.plot(freqs_hz, phase_degrees)
plt.title("FIR Filter Phase Response")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Phase (Degrees)")
plt.grid()
plt.show()
\`\`\`
`
      }
    ],
    homeworkGuide: `## Exam-Style Coding Walkthroughs

The best way to prepare for DSP coding exams is to recognize common patterns. Let's walk through an entire end-to-end exam problem.

### 📌 Scenario: The Humming Biosignal
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
> Notice the deep dip at exactly 50 Hz in the magnitude spectrum! This proves your filter design was flawless. Always use spectral verification in your exams.`,
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
`,
    keyFormulas: `## Python API Quick Reference

Here are the most critical functions you will use over and over again:

### NumPy
*   \`np.arange(start, stop, step)\`: Generate a time vector.
*   \`np.zeros(N)\`: Generate an array of zeros.
*   \`np.fft.fft(x)\`: Compute the Discrete Fourier Transform.
*   \`np.fft.fftshift(X)\`: Shift the zero-frequency component to the center of the spectrum.
*   \`np.fft.fftfreq(N, d)\`: Return the Discrete Fourier Transform sample frequencies. $d$ is the sample spacing ($1/f_s$).

### SciPy Signal
*   \`scipy.signal.firwin(numtaps, cutoff)\`: FIR filter design using the window method. Cutoff is expressed as a fraction of the Nyquist frequency.
*   \`scipy.signal.butter(N, Wn, btype)\`: Butterworth digital filter design. Returns \`b, a\`.
*   \`scipy.signal.iirnotch(w0, Q)\`: Design a second-order IIR notch digital filter.
*   \`scipy.signal.freqz(b, a)\`: Compute the frequency response of a digital filter.
*   \`scipy.signal.lfilter(b, a, x)\`: Filter data along one-dimension with an IIR or FIR filter (causes phase shift).
*   \`scipy.signal.filtfilt(b, a, x)\`: Apply a digital filter forward and backward to a signal (zero phase distortion).`
  }
];
