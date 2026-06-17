import re

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Define the boundaries to replace
start_marker = "    homeworkGuide: `## 📝 Homework 4 Solutions"
end_marker = "  // ═══════════════════════════════════════════════════\n  // WEEK 5:"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

new_content = r"""    homeworkGuide: `## 📝 Homework 4 Solutions

> **Core Theme:** Aliasing, FT properties, and numeric vs. analytic Fourier transforms.

### 📌 Problem 1: Prove Aliasing
**Question:** Prove that $\cos(2\pi f t)$ and $\cos(2\pi(f+kf_s)t)$ yield the exact same samples when sampled at $f_s$.

**Proof:**
Let $x_1(t) = \cos(2\pi f t)$ and $x_2(t) = \cos(2\pi(f + k f_s)t)$ where $k \in \mathbb{Z}$.
Sampling at $f_s$ means evaluating at $t = n T_s = n / f_s$ for integer $n$.
For $x_1(t)$:
$$ x_1[n] = x_1(n/f_s) = \cos\left(2\pi f \frac{n}{f_s}\right) $$
For $x_2(t)$:
$$ x_2[n] = x_2(n/f_s) = \cos\left(2\pi (f + k f_s) \frac{n}{f_s}\right) = \cos\left(2\pi f \frac{n}{f_s} + 2\pi k n\right) $$
Since $k$ and $n$ are both integers, their product $k n$ is an integer. The cosine function is periodic with period $2\pi$, meaning $\cos(\theta + 2\pi m) = \cos(\theta)$ for any integer $m$.
Therefore:
$$ x_2[n] = \cos\left(2\pi f \frac{n}{f_s}\right) = x_1[n] $$
Both signals produce the exact same discrete sequence.

### 📌 Problem 2: Script Demonstrating Aliasing
**Question:** Write a script demonstrating aliasing with continuous and discrete plots.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

fs = 10.0           # Sampling frequency
T = 1.0 / fs        # Sampling period
t_cont = np.linspace(0, 1, 1000) # "Continuous" time
n_disc = np.arange(0, 1 + T/2, T) # Discrete sample times

f = 2.0             # Base frequency
k = 1               # Integer multiple
f_alias = f + k*fs  # 12.0 Hz

# Continuous signals
x1 = np.cos(2 * np.pi * f * t_cont)
x2 = np.cos(2 * np.pi * f_alias * t_cont)

# Sampled signal (they are identical at these points)
x_samp = np.cos(2 * np.pi * f * n_disc)

plt.figure(figsize=(10, 4))
plt.plot(t_cont, x1, 'b-', label='2 Hz (Base)')
plt.plot(t_cont, x2, 'r-', alpha=0.5, label='12 Hz (Alias)')
plt.stem(n_disc, x_samp, linefmt='k-', markerfmt='ko', basefmt='k-', label='Samples at fs=10 Hz')
plt.title('Demonstration of Aliasing')
plt.xlabel('Time (s)')
plt.legend()
plt.grid(True)
plt.show()
\`\`\`

### 📌 Problem 3: Show Various FT Identities
**Question:** Show various FT identities (a-k).

**(a) $\int e^{j2\pi ft} df = \delta(t)$:**
This is the standard integral representation of the Dirac delta function, which derives from the inverse Fourier transform of $X(f) = 1$.

**(b) $\mathcal{F}\{\delta(t-\tau)\}$:**
$$ \int_{-\infty}^{\infty} \delta(t-\tau) e^{-j2\pi ft} dt = e^{-j2\pi f\tau} $$
Using the sifting property of the Dirac delta.

**(c) $\mathcal{F}\{\text{rect}(t)\}$:**
$$ \int_{-1/2}^{1/2} 1 \cdot e^{-j2\pi ft} dt = \left[ \frac{e^{-j2\pi ft}}{-j2\pi f} \right]_{-1/2}^{1/2} = \frac{e^{-j\pi f} - e^{j\pi f}}{-j2\pi f} = \frac{\sin(\pi f)}{\pi f} = \text{sinc}(f) $$

**(d) Sinc orthogonality:**
$$ \int_{-\infty}^{\infty} \text{sinc}(t-n)\text{sinc}(t-m) dt $$
By Parseval's theorem, this equals the integral of their Fourier transforms. $\mathcal{F}\{\text{sinc}(t-n)\} = \text{rect}(f)e^{-j2\pi f n}$.
$$ \int_{-1/2}^{1/2} e^{-j2\pi f n} e^{j2\pi f m} df = \int_{-1/2}^{1/2} e^{j2\pi f (m-n)} df $$
If $m=n$, the integral is 1. If $m \neq n$, it integrates to 0. Thus, it equals $\delta_{nm}$.

**(e) Spectrum of Sampled Signal:**
Ideal sampling is multiplication by an impulse train: $x_s(t) = x(t) \sum \delta(t-nT_s)$.
Multiplication in time is convolution in frequency:
$$ X_s(f) = X(f) * \mathcal{F}\left\{\sum \delta(t-nT_s)\right\} = X(f) * f_s \sum \delta(f-k f_s) = f_s \sum X(f-k f_s) $$

**(f) Reconstruction Formula:**
To reconstruct $x(t)$ from $x_s(t)$, we apply an ideal lowpass filter $H(f) = T_s \text{rect}(f/f_s)$.
In the time domain, this is convolution with $h(t) = \text{sinc}(f_s t)$.
$$ x(t) = \sum_{n} x[n] \delta(t-nT_s) * \text{sinc}(t/T_s) = \sum_{n} x[n] \text{sinc}\left(\frac{t - nT_s}{T_s}\right) $$

**(g) $\mathcal{F}\{\cos(2\pi f_0 t)\}$:**
Euler's formula: $\cos(2\pi f_0 t) = \frac{1}{2}(e^{j2\pi f_0 t} + e^{-j2\pi f_0 t})$.
Transforming each exponential gives: $\frac{1}{2}(\delta(f-f_0) + \delta(f+f_0))$.

**(h) $\mathcal{F}\{\sin(2\pi f_0 t)\}$:**
Euler's formula: $\sin(2\pi f_0 t) = \frac{1}{2j}(e^{j2\pi f_0 t} - e^{-j2\pi f_0 t})$.
Transforming gives: $\frac{1}{2j}(\delta(f-f_0) - \delta(f+f_0))$.

**(i) Linearity:**
$\int [a x(t) + b y(t)] e^{-j2\pi ft} dt = a \int x(t) e^{-j2\pi ft} dt + b \int y(t) e^{-j2\pi ft} dt = aX(f) + bY(f)$.

**(j) Time Scaling:**
$\mathcal{F}\{x(at)\} = \int x(at) e^{-j2\pi ft} dt$. Let $u = at, du = a dt$.
$= \frac{1}{|a|} \int x(u) e^{-j2\pi f(u/a)} du = \frac{1}{|a|} X(f/a)$.

**(k) Frequency Shift:**
$\mathcal{F}\{x(t)e^{j2\pi f_0 t}\} = \int x(t) e^{j2\pi f_0 t} e^{-j2\pi ft} dt = \int x(t) e^{-j2\pi (f-f_0)t} dt = X(f-f_0)$.

### 📌 Problem 4: Demonstrate FT Pairs Numerically
**Question:** Use Python to demonstrate specific FT pairs numerically.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

def plot_pair(t, x, f_ana, X_ana, title):
    dt = t[1] - t[0]
    # Numeric FFT (centered)
    X_num = dt * np.fft.fft(np.fft.fftshift(x))
    f_num = np.fft.fftfreq(len(t), dt)
    
    plt.figure(figsize=(8, 3))
    plt.plot(np.fft.fftshift(f_num), np.fft.fftshift(np.abs(X_num)), 'o', label='Numeric FFT')
    plt.plot(f_ana, np.abs(X_ana), '-', label='Analytic')
    plt.title(title)
    plt.xlim(-10, 10)
    plt.legend()
    plt.grid(True)
    plt.show()

# Time and frequency grids
t = np.arange(-20, 20, 0.05)
f_ana = np.linspace(-10, 10, 1000)

# (a) Gaussian: exp(-pi*t^2) <-> exp(-pi*f^2)
x_gauss = np.exp(-np.pi * t**2)
X_gauss_ana = np.exp(-np.pi * f_ana**2)
plot_pair(t, x_gauss, f_ana, X_gauss_ana, '(a) Gaussian')

# (b) Rect <-> Sinc
x_rect = (np.abs(t) <= 0.5).astype(float)
X_rect_ana = np.sinc(f_ana) # numpy sinc includes pi
plot_pair(t, x_rect, f_ana, X_rect_ana, '(b) Rect <-> Sinc')

# (c) Sinc <-> Rect
x_sinc = np.sinc(t)
X_sinc_ana = (np.abs(f_ana) <= 0.5).astype(float)
plot_pair(t, x_sinc, f_ana, X_sinc_ana, '(c) Sinc <-> Rect')

# (d) 1/(1+t^2) <-> pi*exp(-2*pi*|f|) (Lorentzian)
x_lor = 1 / (1 + t**2)
X_lor_ana = np.pi * np.exp(-2 * np.pi * np.abs(f_ana))
plot_pair(t, x_lor, f_ana, X_lor_ana, '(d) 1/(1+t^2)')

# (e) exp(-|t|) <-> 2/(1+(2*pi*f)^2)
x_exp = np.exp(-np.abs(t))
X_exp_ana = 2 / (1 + (2 * np.pi * f_ana)**2)
plot_pair(t, x_exp, f_ana, X_exp_ana, '(e) exp(-|t|)')
\`\`\`
`,

    labWalkthrough: `## 🔬 Lab 04: FFT of Rect and Gaussian

> **Objective:** Explore the numerical nuances of the FFT, particularly how time-domain centering affects the presence of imaginary components in the spectrum, and analyze Gaussian transforms.

### Step 1: The Symmetry Problem with Rectangles
We know the Fourier transform of a real and even (symmetric) function should be purely real. Let's try it with a rectangle.
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

T = 0.15
t = np.arange(-10, 10, T)
rect = (np.abs(t) <= 0.5).astype(int)

# Check number of ones
print("Number of ones:", rect.sum()) # Even number of ones

Frect = T * np.fft.fft(rect)
print("Max imaginary part:", np.max(np.abs(np.imag(Frect))))
\`\`\`
**Explanation:** If the rectangle has an *even* number of ones, there is no single center sample. The FFT interprets the array starting at index 0 as $t=0$. Because our array starts at $t=-10$, the rectangle is completely shifted in the FFT's eyes, causing massive phase shifts (imaginary parts).

### Step 2: Fixing Symmetry with Odd Samples and fftshift
To get a purely real transform, we need an *odd* number of ones so there is a true center, AND we must shift the center of the array to index 0 using \`fftshift\`.
\`\`\`python
T = 0.13
t = np.arange(-10, 10, T)
rect = (np.abs(t) <= 0.5).astype(int)
print("Number of ones:", rect.sum()) # Odd number. Yeee!!

# Shift the function so it's centered at index 0
Frect = T * np.fft.fft(np.fft.fftshift(rect))
print("Max imaginary part:", np.max(np.abs(np.imag(Frect)))) # Practically 0!

f = np.fft.fftfreq(len(rect), T)
plt.plot(np.fft.fftshift(f), np.fft.fftshift(np.real(Frect)), '.-')
plt.title('Correctly Centered Rect FFT (Purely Real)')
plt.show()
\`\`\`

### Step 3: Gaussian Transform Verification
A Gaussian is its own Fourier transform. Let's verify $\mathcal{F}\{e^{-t^2}\} = \sqrt{\pi}e^{-\pi^2 f^2}$.
\`\`\`python
T = 0.1
t = np.arange(-10, 10, T)
x = np.exp(-t**2)

# Verify the peak is at index 0 after shift
x_shifted = np.fft.fftshift(x)

X = T * np.fft.fft(x_shifted)
f = np.fft.fftfreq(len(x), T)

# Check if it's real
print("Max imaginary part:", np.max(np.abs(np.imag(X))))

# Plot against theory
plt.plot(np.fft.fftshift(f), np.fft.fftshift(np.abs(X)), '.-', label='Numeric FFT')

ff = np.linspace(f.min(), f.max(), 1000)
X_theory = np.sqrt(np.pi) * np.exp(-np.pi**2 * ff**2)
plt.plot(ff, X_theory, label='Theory')

plt.legend()
plt.title('Gaussian Transform')
plt.show()
\`\`\`
**Explanation:** The FFT perfectly matches the theoretical analytic curve, provided we scale by $T$ and properly align the time-domain signal to index 0 using \`fftshift\` before passing it to \`fft\`.
`,
"""

text = text[:start_idx] + new_content + text[end_idx:]

# Need to escape backslashes so they are correctly parsed in JS
# We want \\ to literally be \\ in JS, which means \\\\ on disk.
# But wait, the python string `new_content` above already has \cos, \pi etc.
# Which will become \cos and \pi on disk.
# That will cause `react-markdown` to lose them!
# We MUST double escape the backslashes in `new_content`.
new_content_escaped = new_content.replace("\\", "\\\\")

text = text[:start_idx] + new_content_escaped + text[end_idx:]

with open('dsp-app/frontend/src/content/weeks1to5.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
