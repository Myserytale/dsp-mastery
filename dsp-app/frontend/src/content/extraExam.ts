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
`,
    labWalkthrough: '',
    keyFormulas: ''
  }
];
