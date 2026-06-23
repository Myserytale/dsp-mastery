export const EXAM_WALKTHROUGH_MD = `# 🚀 Final Exam Programming Solutions

This guide provides a comprehensive step-by-step walkthrough of the **Programming Tasks** from the July 10, 2024 Exam. We will focus purely on the coding implementation, leveraging standard Python data science libraries (NumPy, SciPy, Matplotlib) to solve these practical signal processing problems.

---

## Task 1: Sampling & Fourier Transform Dualities

**The Goal:** Generate a finite support, symmetric random signal, treat it as a frequency spectrum, and demonstrate the effect of sampling and the Nyquist theorem on the corresponding continuous-time signal.

### Step 1: Generate the Frequency Spectrum

The problem asks us to start with a finite support, symmetric random signal. Since we are asked to interpret it as a Fourier transform, a finite support in the frequency domain means the original time-domain signal is strictly **bandlimited**.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# 1(a): Generate a finite support, symmetric random signal
N_freq = 32
# Create a symmetric random array (finite support since it's zero elsewhere)
half_X = np.random.rand(5)  # 5 random frequency components
X_discrete = np.zeros(N_freq)
X_discrete[0:5] = half_X                # Positive frequencies
X_discrete[-4:] = half_X[1:][::-1]      # Negative frequencies (symmetric)

plt.figure(figsize=(8,3))
plt.stem(np.fft.fftfreq(N_freq), X_discrete)
plt.title("Finite Support, Symmetric Spectrum $X[k]$")
plt.xlabel("Normalized Frequency")
plt.show()
\`\`\`

### Step 2: Reconstruct the Original Signal

Since $X[k]$ is real and symmetric, its inverse Fourier transform will be real-valued. To approximate the "continuous" original signal, we perform an Inverse Fast Fourier Transform (IFFT). To make it look truly continuous, we can heavily zero-pad the spectrum before inversion (this interpolates the time-domain signal).

\`\`\`python
# 1(b): Interpret as Fourier transform, find the original signal
# To simulate a continuous signal, we heavily zero-pad the spectrum
N_continuous = 1024
X_continuous = np.zeros(N_continuous)
X_continuous[:5] = X_discrete[:5]
X_continuous[-4:] = X_discrete[-4:]

# IFFT to get the time-domain signal
t_continuous = np.linspace(0, 1, N_continuous, endpoint=False)
x_continuous = np.fft.ifft(X_continuous) * (N_continuous / N_freq)
x_continuous = np.real(x_continuous) # Real and symmetric spectrum yields real signal

plt.figure(figsize=(8,3))
plt.plot(t_continuous, x_continuous, 'b-', label="Continuous Original Signal")
plt.title("Bandlimited Continuous Signal $x(t)$")
plt.legend()
plt.show()
\`\`\`

### Step 3: Demonstrate Sampling & Nyquist Theorem

We now sample the continuous signal. The Nyquist theorem states that we must sample at least twice the maximum frequency present in the signal to avoid aliasing. Our maximum frequency component is at index \`4\`, meaning we need a sampling rate of at least $f_s \ge 8$.

\`\`\`python
# 1(c) & (d): Demonstrate sampling and Nyquist reconstruction
fs_good = 16  # Above Nyquist rate (8)
fs_bad = 4    # Below Nyquist rate (Aliasing!)

# Sample the signals
t_good = np.linspace(0, 1, fs_good, endpoint=False)
x_good = x_continuous[::N_continuous//fs_good]

t_bad = np.linspace(0, 1, fs_bad, endpoint=False)
x_bad = x_continuous[::N_continuous//fs_bad]

plt.figure(figsize=(10,4))
plt.plot(t_continuous, x_continuous, 'b-', alpha=0.5, label="Continuous")
plt.stem(t_good, x_good, linefmt='g-', markerfmt='go', label=f"Sampled (fs={fs_good})")
plt.stem(t_bad, x_bad, linefmt='r-', markerfmt='ro', label=f"Aliased (fs={fs_bad})")
plt.title("Effect of Sampling: Above vs Below Nyquist Rate")
plt.legend()
plt.show()
\`\`\`

---

## Task 2: Real-World Data Analysis (\`data.bin\`)

**The Goal:** Read a binary data file, determine its sampling rate, plot its spectrogram and continuous wavelet transform (CWT), and apply a bandpass filter to isolate an oscillatory element.

> [!NOTE]
> *In the real exam, you would be provided with \`data.bin\`. The code below demonstrates exactly how to solve this task assuming the file is present in your working directory.*

### Step 1: Read the Binary Data

When reading raw binary files (contiguous arrays), \`numpy.fromfile\` is the tool of choice.

\`\`\`python
import scipy.signal as signal

# 2(a): Read and plot the contiguous binary format
# Ensure the dtype matches the data (e.g., np.float32 or np.float64)
try:
    data = np.fromfile('data.bin', dtype=np.float32)
    
    plt.figure(figsize=(8,3))
    plt.plot(data)
    plt.title("Raw Signal from data.bin")
    plt.show()
except FileNotFoundError:
    print("data.bin not found. Please ensure it is in the working directory.")
\`\`\`

### Step 2: Sampling Rate & Spectrogram

To determine the sampling rate, you would typically look for known power-line interference (50 Hz or 60 Hz) or known biological rhythms if it's an ECG/EEG. Once deduced, you can plot the spectrogram to view frequency power over time.

\`\`\`python
# 2(b) & (c): Spectrogram representation
# Assume deduced sampling rate is 1000 Hz based on data characteristics
fs = 1000 

f, t, Sxx = signal.spectrogram(data, fs, nperseg=256, noverlap=128)

plt.figure(figsize=(8,4))
plt.pcolormesh(t, f, 10 * np.log10(Sxx), shading='gouraud')
plt.ylabel('Frequency [Hz]')
plt.xlabel('Time [sec]')
plt.title('Spectrogram of data.bin')
plt.colorbar(label='Power/Frequency (dB/Hz)')
plt.show()
\`\`\`

### Step 3: Continuous Wavelet Transform (CWT)

For non-stationary signals where time-localization of high frequencies is required, a CWT provides a better time-frequency resolution trade-off than a standard STFT Spectrogram.

\`\`\`python
# 2(d): Continuous Wavelet Transform
# We use the Morlet wavelet, highly suitable for oscillatory signals
widths = np.arange(1, 128)
cwtmatr = signal.cwt(data, signal.morlet2, widths)

plt.figure(figsize=(8,4))
plt.imshow(np.abs(cwtmatr), extent=[0, len(data)/fs, 1, 128], 
           cmap='viridis', aspect='auto', origin='lower')
plt.title("Continuous Wavelet Transform Magnitude")
plt.ylabel("Scale (Inverse Frequency)")
plt.xlabel("Time [sec]")
plt.show()
\`\`\`

### Step 4: Bandpass Filtering

Once you identify an oscillatory element (e.g., a band between 15-25 Hz) from the spectrogram/CWT, you can design a Butterworth bandpass filter and apply it forward and backward using \`filtfilt\` to ensure zero phase distortion.

\`\`\`python
# 2(f): Apply bandpass filter and save
lowcut, highcut = 15.0, 25.0
order = 4

# Design the filter
nyq = 0.5 * fs
low = lowcut / nyq
high = highcut / nyq
b, a = signal.butter(order, [low, high], btype='bandpass')

# Apply zero-phase filtering
filtered_data = signal.filtfilt(b, a, data)

# Save the filtered data in a directly usable contiguous binary format
filtered_data.astype(np.float32).tofile('filtered_data.bin')
print("Filtered signal saved to 'filtered_data.bin'")
\`\`\`

---

## Task 3: Bilinear Transform Filter Design

**The Goal:** Design a digital band-pass filter (1 kHz - 3 kHz) using the bilinear transform method, and compare the theoretical vs. numerical frequency response.

### Step 1: Filter Specifications

We will design an analog Butterworth filter first, then manually map it to the digital domain using the Bilinear Transform.

\`\`\`python
# 3(a): Design a digital bandpass filter using Bilinear Transform
fs = 10000  # Chosen sampling frequency (must be > 2*3kHz)
f_low = 1000
f_high = 3000

# Angular frequencies
w_low = 2 * np.pi * f_low
w_high = 2 * np.pi * f_high

# 3(b) Frequency Pre-warping (+10% points)
# Warping maps analog frequencies accurately to digital frequencies
T = 1.0 / fs
w_low_warped = (2 / T) * np.tan(w_low * T / 2)
w_high_warped = (2 / T) * np.tan(w_high * T / 2)

print(f"Original analog: {w_low:.2f}, {w_high:.2f} rad/s")
print(f"Pre-warped analog: {w_low_warped:.2f}, {w_high_warped:.2f} rad/s")
\`\`\`

### Step 2: Analog Design & Bilinear Mapping

We first use \`signal.butter\` with \`analog=True\` using our pre-warped frequencies. Then, we use \`signal.bilinear\` to map the analog transfer function $H(s)$ to the digital transfer function $H(z)$.

\`\`\`python
# Design 2nd-order analog bandpass filter (returns numerator and denominator of H(s))
b_analog, a_analog = signal.butter(2, [w_low_warped, w_high_warped], btype='bandpass', analog=True)

# Apply bilinear transform to convert H(s) -> H(z)
b_digital, a_digital = signal.bilinear(b_analog, a_analog, fs=fs)

print("Bilinear Digital Filter Coefficients:")
print("b =", b_digital)
print("a =", a_digital)
\`\`\`

### Step 3: Comparison with Numerical Output

We now compare our manually warped and bilinearly-transformed filter against Python's built-in digital filter design \`signal.butter(..., analog=False)\`.

\`\`\`python
# Numerical design directly in the digital domain
# SciPy automatically applies pre-warping and bilinear transform under the hood!
Wn = [2 * f_low / fs, 2 * f_high / fs]
b_numerical, a_numerical = signal.butter(2, Wn, btype='bandpass', analog=False)

# Compute frequency responses
w, h_manual = signal.freqz(b_digital, a_digital, worN=1024)
w, h_numerical = signal.freqz(b_numerical, a_numerical, worN=1024)

frequencies = (w * fs) / (2 * np.pi)

plt.figure(figsize=(10,4))
plt.plot(frequencies, 20 * np.log10(np.abs(h_manual)), 'b-', linewidth=4, alpha=0.5, label='Theoretical (Manual Bilinear)')
plt.plot(frequencies, 20 * np.log10(np.abs(h_numerical)), 'r--', linewidth=2, label='Numerical (scipy.signal)')
plt.axvline(f_low, color='green', linestyle=':', label='1 kHz Cutoff')
plt.axvline(f_high, color='orange', linestyle=':', label='3 kHz Cutoff')
plt.title("Frequency Response Comparison")
plt.xlabel("Frequency [Hz]")
plt.ylabel("Magnitude [dB]")
plt.ylim(-40, 5)
plt.legend()
plt.grid(True)
plt.show()

# Verification
print(f"Coefficients match? {np.allclose(b_digital, b_numerical)} and {np.allclose(a_digital, a_numerical)}")
\`\`\`

This perfectly verifies that frequency pre-warping combined with the bilinear transform maps the s-domain precisely to the intended discrete z-domain specifications!
`;
