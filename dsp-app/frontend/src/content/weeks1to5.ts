export interface ConceptBlock {
  name: string;
  explanation: string;
}

export interface WeekContent {
  id: number;
  title: string;
  bigPicture: string;
  concepts: ConceptBlock[];
  homeworkGuide: string;
  labWalkthrough: string;
  keyFormulas: string;
}

export const weeks1to5: WeekContent[] = [
  // ═══════════════════════════════════════════════════
  // WEEK 1: Introduction & Basic Concepts
  // ═══════════════════════════════════════════════════
  {
    id: 1,
    title: 'Introduction & Basic Concepts',
    bigPicture: `## Why DSP Matters

Digital Signal Processing is everywhere — your phone's noise cancellation, Spotify's audio compression, medical ECG monitors, even the WiFi signal you're using right now. DSP takes **real-world signals** (sound, images, sensor data) and processes them digitally using math and algorithms.

This week we lay the foundation: what signals are, what systems do to them, and how to classify both. Every concept you learn here will come back in later weeks — the distinction between **continuous and discrete** is the entire reason the rest of this course exists.

> **Key insight**: The whole course is about one idea — representing signals in different "views" (time domain, frequency domain, z-domain) and processing them using systems.`,

    concepts: [
      {
        name: 'Signals: Continuous vs Discrete',
        explanation: `### What is a Signal?

A **signal** is any quantity that varies with one or more independent variables. A sound wave varies with time. An image varies with spatial coordinates.

**Continuous-time signal** $x(t)$: defined for every real value of $t$. Example: an analog microphone voltage.

**Discrete-time signal** $x[n]$: defined only at integer indices $n = \\ldots, -1, 0, 1, 2, \\ldots$ — this is what computers actually work with.

The entire point of DSP is that we **sample** continuous signals to get discrete ones, process them with algorithms, and (optionally) convert back.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Continuous signal (simulated with dense sampling)
t = np.linspace(0, 1, 1000)
x_cont = np.sin(2 * np.pi * 5 * t)  # 5 Hz sine wave

# Discrete signal (sampled at 20 Hz)
n = np.arange(0, 1, 1/20)
x_disc = np.sin(2 * np.pi * 5 * n)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 5))
ax1.plot(t, x_cont, 'b-')
ax1.set_title('Continuous-time signal x(t)')
ax1.set_xlabel('t (seconds)')

ax2.stem(n, x_disc, linefmt='r-', markerfmt='ro', basefmt='k-')
ax2.set_title('Discrete-time signal x[n]')
ax2.set_xlabel('n (sample index)')
plt.tight_layout()
plt.show()
\`\`\``
      },
      {
        name: 'System Properties',
        explanation: `### What is a System?

A **system** takes an input signal and produces an output signal: $y[n] = T\\{x[n]\\}$.

The key properties that matter for DSP:

| Property | Meaning | Why it matters |
|----------|---------|---------------|
| **Linearity** | $T\\{ax_1 + bx_2\\} = aT\\{x_1\\} + bT\\{x_2\\}$ | Superposition works — analyze one frequency at a time |
| **Time-Invariance** | Shifting input shifts output by same amount | System behavior doesn't change over time |
| **Causality** | Output depends only on present and past inputs | Can be implemented in real-time |
| **Stability (BIBO)** | Bounded input → bounded output | Output doesn't blow up |

A system that is **both Linear and Time-Invariant (LTI)** is the gold standard of DSP — it can be fully characterized by its **impulse response** $h[n]$.

\`\`\`python
import numpy as np

# Example: Check if y[n] = 2*x[n] + 3 is linear
# Test: T{x1 + x2} vs T{x1} + T{x2}
x1 = np.array([1, 2, 3])
x2 = np.array([4, 5, 6])

def system(x):
    return 2 * x + 3  # This is NOT linear (the +3 breaks it)

T_sum = system(x1 + x2)         # T{x1 + x2}
sum_T = system(x1) + system(x2) # T{x1} + T{x2}

print(f"T{{x1+x2}}  = {T_sum}")
print(f"T{{x1}}+T{{x2}} = {sum_T}")
print(f"Linear? {np.allclose(T_sum, sum_T)}")  # False!
\`\`\``
      },
      {
        name: 'Energy and Power Signals',
        explanation: `### Energy vs Power

Every signal falls into one of these categories:

**Energy signal**: Total energy is finite. These signals "die out" eventually.
$$E = \\sum_{n=-\\infty}^{\\infty} |x[n]|^2 < \\infty$$

**Power signal**: Average power is finite but total energy is infinite. These signals go on forever (like a sine wave).
$$P = \\lim_{N \\to \\infty} \\frac{1}{2N+1} \\sum_{n=-N}^{N} |x[n]|^2$$

> **Rule of thumb**: If a signal has finite duration, it's probably an energy signal. If it repeats forever, it's a power signal.

\`\`\`python
import numpy as np

# Energy signal: decaying exponential
n = np.arange(0, 50)
x_energy = 0.9**n  # decays to zero

E = np.sum(np.abs(x_energy)**2)
print(f"Decaying exponential: Energy = {E:.4f} (finite → energy signal)")

# Power signal: cosine (repeats forever, approximate with long sequence)
N = 10000
n2 = np.arange(-N, N+1)
x_power = np.cos(2 * np.pi * 0.1 * n2)

P = np.sum(np.abs(x_power)**2) / (2*N + 1)
print(f"Cosine: Power = {P:.4f} (should be ~0.5)")
\`\`\``
      },
      {
        name: 'Basic Signal Operations',
        explanation: `### Manipulating Discrete Signals

Four fundamental operations you'll use constantly:

1. **Time shift**: $y[n] = x[n - k]$ — delays the signal by $k$ samples
2. **Time reversal**: $y[n] = x[-n]$ — flips the signal around $n=0$
3. **Amplitude scaling**: $y[n] = a \\cdot x[n]$
4. **Addition**: $y[n] = x_1[n] + x_2[n]$

Two fundamental signals that are building blocks for everything:

- **Unit impulse**: $\\delta[n] = 1$ if $n=0$, else $0$
- **Unit step**: $u[n] = 1$ if $n \\geq 0$, else $0$

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

N = 21
n = np.arange(N) - N//2  # centered around 0

# Unit impulse
delta = np.zeros(N)
delta[N//2] = 1

# Unit step
step = np.zeros(N)
step[N//2:] = 1

# Shifted impulse: delta[n-3]
delta_shifted = np.zeros(N)
delta_shifted[N//2 + 3] = 1

fig, axes = plt.subplots(1, 3, figsize=(12, 3))
axes[0].stem(n, delta)
axes[0].set_title('Unit impulse δ[n]')
axes[1].stem(n, step)
axes[1].set_title('Unit step u[n]')
axes[2].stem(n, delta_shifted)
axes[2].set_title('Shifted impulse δ[n-3]')
plt.tight_layout()
plt.show()
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 1 Solutions

> **Core Theme:** Signal and system fundamentals — classification, representation, and testing for LTI properties.

---

### 📌 Problem 1: Brief Answers (a–n)

**(a) Signal Classification:**
Signals can be classified along several axes:
- **Continuous-time** vs **Discrete-time** (independent variable)
- **Continuous-valued (analog)** vs **Discrete-valued (digital)** (dependent variable)
- **Deterministic** vs **Stochastic (random)**
- **Energy** vs **Power** signals
- **Periodic** vs **Aperiodic**
- **Even** vs **Odd** symmetry
- **Causal** vs **Non-causal** (zero for $t<0$ or not)

**(b) Mathematical vs Physical Representation:**
A **mathematical** representation is an idealized formula (e.g., $x(t) = A\\sin(2\\pi f_0 t)$) that describes the signal exactly. A **physical** representation is the actual measurable quantity (e.g., a voltage waveform on an oscilloscope) that is always subject to noise, finite precision, and bandwidth limitations.

**(c) Continuous-time, Discrete-time, and Digital Signals:**
- **Continuous-time**: $x(t)$ is defined for every real $t \\in \\mathbb{R}$ and takes continuous values. Example: microphone voltage.
- **Discrete-time**: $x[n]$ is defined only at integer indices $n \\in \\mathbb{Z}$ but can take any continuous value. Example: sampled sensor readings.
- **Digital**: $x[n]$ is defined at integer indices AND takes only a finite set of discrete values (quantized). Example: 16-bit audio stored on disk.

**(d) Concept of a System:**
A **system** is a transformation $T$ that maps an input signal $x$ to an output signal $y$:
$$y(t) = T\\{x(t)\\} \\quad \\text{or} \\quad y[n] = T\\{x[n]\\}$$
Mathematically, it is an operator/functional that takes a function and produces a function.

**(e) Continuous-time vs Discrete-time System Examples:**
- **Continuous-time**: An analog RC lowpass filter: $y(t) = \\frac{1}{RC}\\int_{-\\infty}^{t} x(\\tau) e^{-(t-\\tau)/RC} d\\tau$.
- **Discrete-time**: A moving average filter: $y[n] = \\frac{1}{3}(x[n] + x[n-1] + x[n-2])$.

**(f) Is a continuous-time system also called an analog system?**
Not always. A continuous-time system processes continuous-time signals, but "analog" specifically implies continuous-valued signals as well. Strictly speaking, a system processing continuous-time but quantized-value signals would be continuous-time but not truly analog. In practice, however, the terms are often used interchangeably.

**(g) Interface Systems:**
Interface systems are needed at the boundary between analog and digital domains. They are required whenever a digital system must interact with the physical (analog) world — e.g., in audio recording (microphone → A/D → computer → D/A → speaker), medical imaging, telecommunications, and control systems.

**(h) A/D Converter:**
An **Analog-to-Digital (A/D) converter** transforms a continuous-time, continuous-valued signal into a discrete-time, discrete-valued (digital) signal. It involves three steps:
1. **Sampling**: Convert continuous-time to discrete-time (take values at regular intervals $T$).
2. **Quantization**: Map continuous amplitude values to a finite set of levels.
3. **Coding**: Represent each quantized level as a binary number.

**(i) D/A Converter:**
A **Digital-to-Analog (D/A) converter** transforms a digital signal back into a continuous-time, continuous-valued signal. It converts each binary code word to a voltage level (reconstruction), then applies an analog smoothing (reconstruction) filter to interpolate between samples.

**(j) Practical vs Ideal A/D and D/A:**
- **Ideal A/D**: Instantaneous sampling (Dirac impulses), infinite quantization levels, perfect anti-aliasing filter.
- **Practical A/D**: Finite sample-and-hold time, finite bit depth (e.g., 16-bit = 65536 levels), imperfect anti-aliasing filter with transition band.
- **Ideal D/A**: Perfect sinc interpolation, instant reconstruction.
- **Practical D/A**: Zero-order hold followed by an imperfect analog reconstruction filter; introduces staircase artifacts and slight frequency response roll-off.

**(k) Signal Processing and its Forms:**

**Signal processing** is the manipulation of signals to extract information, enhance quality, compress, or transform them. Forms include:
- **Filtering** (noise removal, frequency selection)
- **Spectral analysis** (finding frequency content)
- **Compression** (reducing data size)
- **Modulation/demodulation** (for communication)
- **Feature extraction** (for pattern recognition)

**(l) ASP with Block Diagram:**

**Analog Signal Processing (ASP)**: The entire processing chain stays in the analog domain.
$$x(t) \\xrightarrow{\\text{Analog System}} y(t)$$
Example: An analog equalizer receives an analog audio signal and outputs the filtered analog signal. All operations use resistors, capacitors, inductors, and op-amps.

**(m) DSP with Block Diagram:**

**Digital Signal Processing (DSP)**: The signal is converted to digital, processed, and converted back.
$$x(t) \\xrightarrow{\\text{A/D}} x[n] \\xrightarrow{\\text{Digital Processor}} y[n] \\xrightarrow{\\text{D/A}} y(t)$$
The digital processor implements algorithms (filtering, FFT, etc.) on the discrete samples using arithmetic operations.

**(n) Why DSP is Preferred over ASP:**
1. **Perfect reproducibility**: Digital operations are exact; no component tolerances.
2. **Flexibility**: Algorithms can be changed via software without hardware redesign.
3. **No drift**: Digital systems don't degrade with temperature, aging, or humidity.
4. **Complex algorithms**: Non-linear, adaptive, and AI-based processing is straightforward digitally but nearly impossible in analog.
5. **Storage**: Digital signals can be stored and retrieved without degradation.
6. **Cost**: Mass-produced digital chips are cheap.

\`\`\`quiz
question: What is the primary advantage of Digital Signal Processing over Analog Signal Processing?
a: It uses less power in all cases
b: It allows for perfect reproducibility and flexibility via software
c: It requires fewer interface systems (A/D and D/A)
d: It operates strictly in continuous time
answer: b
\`\`\`

---

### 📌 Problem 2: Python Script (No Loops)

**(a)** Generate array from 0.5 to 10 in steps of 0.5.

**(b)** Write text file with array values and their sine.

**(c)** Write binary file with 32-bit floats.

\`\`\`python
import numpy as np

# (a) Generate array from 0.5 to 10.0 (inclusive) with step 0.5
x = np.arange(0.5, 10.5, 0.5)   # [0.5, 1.0, 1.5, ..., 10.0], 20 elements
y = np.sin(x)                    # sin of each element, no loops needed

# (b) Write text file: two columns (x and sin(x))
data = np.column_stack((x, y))   # shape (20, 2)
np.savetxt("signal_data.txt", data, header="x  sin(x)", fmt="%.6f")

# (c) Write binary file with 32-bit float representation
y.astype(np.float32).tofile("signal_data.bin")
# tofile writes raw binary — 20 values × 4 bytes = 80 bytes total
\`\`\`

---

### 📌 Problem 3: Python Script — Read & Plot (No Loops)

**(a)** Read the binary file back.

**(b)** Plot sine with labels, grid, legend, and title.

**(c)** Save the figure.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# (a) Read binary file back
y_read = np.fromfile("signal_data.bin", dtype=np.float32)
x = np.arange(0.5, 10.5, 0.5)

# (b) Plot with all required elements
plt.figure(figsize=(10, 5))
plt.plot(x, y_read, 'b-o', linewidth=1.5, markersize=5, label='sin(x)')
plt.xlabel('x')                # x-axis label
plt.ylabel('sin(x)')          # y-axis label
plt.title('Sine Function from Binary File')  # title
plt.grid(True, alpha=0.3)     # grid
plt.legend(loc='upper right') # legend

# (c) Save figure to file
plt.savefig("sine_plot.png", dpi=150, bbox_inches='tight')
plt.show()
\`\`\`

---

### 📌 Problem 4: System Properties Testing

For each system, we test four properties:
- **Linearity**: Does $T\\{a x_1 + b x_2\\} = a T\\{x_1\\} + b T\\{x_2\\}$?
- **Time-Invariance**: Does shifting input by $k$ shift output by $k$?
- **Causality**: Does output at $n$ depend only on present/past inputs?
- **Memory**: Does output depend on past/future inputs (not just current)?

---

**(a) $y[n] = \\cos(x[n]) + n$**

**Linearity:** Let $y_1[n] = T\\{a x[n]\\} = \\cos(a x[n]) + n$. Compare with $a T\\{x[n]\\} = a(\\cos(x[n]) + n)$. Since $\\cos(a x[n]) \\neq a \\cos(x[n])$ in general, the system is **Non-linear**. ✗

**Time-Invariance:** Shift input: $y_1[n] = \\cos(x[n-k]) + n$. Shift output: $y[n-k] = \\cos(x[n-k]) + (n-k)$. Since $n \\neq n-k$, we have $y_1[n] \\neq y[n-k]$. The system is **Time-Varying**. ✗

**Causality:** Output $y[n]$ depends only on $x[n]$ (current input) and $n$. **Causal**. ✓

**Memory:** Output depends only on $x[n]$, not on any past or future values. **Memoryless**. ✓

---

**(b) $y[n] = 2^{-n} x[n]$**

**Linearity:** $T\\{a x_1 + b x_2\\} = 2^{-n}(a x_1[n] + b x_2[n]) = a \\cdot 2^{-n} x_1[n] + b \\cdot 2^{-n} x_2[n] = a T\\{x_1\\} + b T\\{x_2\\}$. **Linear**. ✓

**Time-Invariance:** Shift input: $y_1[n] = 2^{-n} x[n-k]$. Shift output: $y[n-k] = 2^{-(n-k)} x[n-k]$. Since $2^{-n} \\neq 2^{-(n-k)}$ for $k \\neq 0$, the system is **Time-Varying**. ✗

**Causality:** Depends only on $x[n]$. **Causal**. ✓

**Memory:** Depends only on current input. **Memoryless**. ✓

---

**(c) $y[n] = \\sum_{k=0}^{n} 0.9^k x[n-k]$**

**Linearity:** $T\\{a x_1 + b x_2\\} = \\sum_{k=0}^{n} 0.9^k (a x_1[n-k] + b x_2[n-k]) = a \\sum_{k=0}^{n} 0.9^k x_1[n-k] + b \\sum_{k=0}^{n} 0.9^k x_2[n-k] = a T\\{x_1\\} + b T\\{x_2\\}$. **Linear**. ✓

**Time-Invariance:** Shift input: $x'[n] = x[n - n_0]$, then $y'[n] = \\sum_{k=0}^{n} 0.9^k x[n-k-n_0]$. Shift output: $y[n-n_0] = \\sum_{k=0}^{n-n_0} 0.9^k x[n-n_0-k]$. The upper limits differ ($n$ vs $n-n_0$), so the system is **Time-Varying**. ✗

**Causality:** The sum runs from $k=0$ to $n$, so $y[n]$ depends on $x[n], x[n-1], \\ldots, x[0]$ — all present/past. **Causal**. ✓

**Memory:** Depends on past inputs $x[n-1], x[n-2], \\ldots$ **Has Memory**. ✓

---

**(d) $y[n] = \\frac{x[n]}{1 + |x[n]|}$**

**Linearity:** $T\\{a x[n]\\} = \\frac{a x[n]}{1 + |a x[n]|}$. Compare: $a T\\{x[n]\\} = \\frac{a x[n]}{1 + |x[n]|}$. Since $|a x[n]| \\neq |x[n]|$ in general, $T\\{a x\\} \\neq a T\\{x\\}$. **Non-linear**. ✗

**Time-Invariance:** Shift input: $y_1[n] = \\frac{x[n-k]}{1+|x[n-k]|}$. Shift output: $y[n-k] = \\frac{x[n-k]}{1+|x[n-k]|}$. These are equal! **Time-Invariant**. ✓

**Causality:** Depends only on $x[n]$. **Causal**. ✓

**Memory:** Depends only on current input. **Memoryless**. ✓

---

**(e) $y[n] = (x[n])^3$**

**Linearity:** $T\\{a x[n]\\} = (a x[n])^3 = a^3 (x[n])^3$, but $a T\\{x[n]\\} = a(x[n])^3$. Since $a^3 \\neq a$ in general, **Non-linear**. ✗

**Time-Invariance:** Shift input: $y_1[n] = (x[n-k])^3$. Shift output: $y[n-k] = (x[n-k])^3$. Equal! **Time-Invariant**. ✓

**Causality:** Depends only on $x[n]$. **Causal**. ✓

**Memory:** Depends only on current input. **Memoryless**. ✓

---

**(f) $y[n] = x[n] - x[n-1] + 0.5 y[n-1]$**

**Linearity:** This is a linear difference equation (all terms are linear in $x$ and $y$, no products or nonlinear functions). By superposition: if $y_1$ corresponds to $x_1$ and $y_2$ to $x_2$, then $a y_1[n] + b y_2[n]$ satisfies the equation for input $a x_1[n] + b x_2[n]$. **Linear**. ✓

**Time-Invariance:** The coefficients (1, -1, 0.5) do not depend on $n$. Shifting input by $k$ shifts output by $k$. **Time-Invariant**. ✓

**Causality:** Output $y[n]$ depends on $x[n]$, $x[n-1]$, and $y[n-1]$ — all present/past. **Causal**. ✓

**Memory:** Depends on $x[n-1]$ and $y[n-1]$. **Has Memory**. ✓

---

**(g) $y[n] = x[n]$ if $|x[n]| \\leq 1$, else $0$**

**Linearity:** Let $x[n] = 0.5$ (so $|x[n]| \\leq 1$, $y = 0.5$). Now $T\\{3 \\cdot 0.5\\} = T\\{1.5\\} = 0$ (since $|1.5| > 1$), but $3 T\\{0.5\\} = 3 \\cdot 0.5 = 1.5$. Not equal. **Non-linear**. ✗

**Time-Invariance:** Shift input: $y_1[n] = x[n-k]$ if $|x[n-k]| \\leq 1$, else 0. Shift output: $y[n-k] = x[n-k]$ if $|x[n-k]| \\leq 1$, else 0. Same! **Time-Invariant**. ✓

**Causality:** Depends only on $x[n]$. **Causal**. ✓

**Memory:** Current input only. **Memoryless**. ✓

---

**(h) $y[n] = e^{x[n]} - 1$**

**Linearity:** $T\\{a x[n]\\} = e^{a x[n]} - 1$. But $a T\\{x[n]\\} = a(e^{x[n]} - 1) = a e^{x[n]} - a$. Since $e^{a x} \\neq a e^x$ in general, **Non-linear**. ✗

**Time-Invariance:** Shift input: $y_1[n] = e^{x[n-k]} - 1$. Shift output: $y[n-k] = e^{x[n-k]} - 1$. Equal! **Time-Invariant**. ✓

**Causality:** Depends only on $x[n]$. **Causal**. ✓

**Memory:** Current input only. **Memoryless**. ✓

---

### Summary Table

| System | Linear | Time-Invariant | Causal | Memoryless |
|--------|--------|----------------|--------|------------|
| (a) $\\cos(x[n]) + n$ | ✗ | ✗ | ✓ | ✓ |
| (b) $2^{-n}x[n]$ | ✓ | ✗ | ✓ | ✓ |
| (c) $\\sum 0.9^k x[n-k]$ | ✓ | ✗ | ✓ | ✗ |
| (d) $x[n]/(1+|x[n]|)$ | ✗ | ✓ | ✓ | ✓ |
| (e) $(x[n])^3$ | ✗ | ✓ | ✓ | ✓ |
| (f) $x[n]-x[n-1]+0.5y[n-1]$ | ✓ | ✓ | ✓ | ✗ |
| (g) hard limiter | ✗ | ✓ | ✓ | ✓ |
| (h) $e^{x[n]}-1$ | ✗ | ✓ | ✓ | ✓ |



### 🧠 Knowledge Check

\`\`\`quiz
question: What is the primary difference between continuous-time and discrete-time signals?
a: Continuous-time signals are always periodic, while discrete-time signals are aperiodic.
b: Continuous-time signals are defined for all real values of time, whereas discrete-time signals are defined only at integer indices.
c: Continuous-time signals can only have positive amplitudes.
d: Discrete-time signals must be quantized in amplitude, while continuous-time signals are not.
answer: b
explanation: Continuous-time signals x(t) are defined for every real value of t, while discrete-time signals x[n] exist only at integer indices n. Option (a) is wrong because periodicity is independent of signal type — both can be periodic or aperiodic. Option (c) is wrong because amplitude can be any real value for either type. Option (d) confuses discrete-time with digital signals; a discrete-time signal can still take continuous amplitude values.
\`\`\`
\`\`\`quiz
question: A system is considered Linear Time-Invariant (LTI) if it satisfies which two mathematical properties?
a: Superposition (additivity/scaling) and shift-invariance.
b: Causality and Bounded-Input Bounded-Output (BIBO) stability.
c: Memoryless operation and invertibility.
d: Linearity and energy conservation.
answer: a
explanation: An LTI system must satisfy (1) linearity — meaning T{ax₁ + bx₂} = aT{x₁} + bT{x₂} (superposition) — and (2) time-invariance — meaning a shifted input produces an equally shifted output. Option (b) describes desirable properties but not the defining ones; a system can be LTI yet unstable. Option (c) is wrong because LTI systems can have memory (e.g., FIR filters). Option (d) is wrong because energy conservation is not a requirement for LTI systems.
\`\`\`
\`\`\`quiz
question: How is a Power Signal distinguished from an Energy Signal?
a: A power signal has finite energy and zero average power.
b: A power signal has infinite average power and finite energy.
c: A power signal has finite average power but infinite total energy (e.g., a continuous sine wave).
d: A power signal must be periodic, while an energy signal must be aperiodic.
answer: c
explanation: A power signal has finite nonzero average power but infinite total energy — it persists forever without dying out (e.g., a sine wave). Option (a) describes an energy signal (finite energy, zero average power). Option (b) inverts the relationship — power signals have finite average power, not infinite. Option (d) is wrong because while many power signals are periodic, it is not a strict requirement, and non-periodic signals can also be power signals.
\`\`\`
\`\`\`quiz
question: The system y[n] = x[n] · x[n-1] is tested for linearity. What is the correct conclusion?
a: It is linear because it uses only past and present input values.
b: It is nonlinear because the output involves a product of two input terms, violating superposition.
c: It is linear because it satisfies time-invariance.
d: It is nonlinear because it has memory.
answer: b
explanation: Multiplying two input-dependent terms creates a nonlinear operation. If you test superposition with input ax₁[n] + bx₂[n], the product (ax₁[n]+bx₂[n])(ax₁[n-1]+bx₂[n-1]) expands to cross-terms that violate additivity. Option (a) confuses causality with linearity. Option (c) confuses time-invariance with linearity — they are independent properties. Option (d) is wrong because having memory does not imply nonlinearity (e.g., moving average filters have memory but are linear).
\`\`\`
\`\`\`quiz
question: Which of the following signals is an energy signal?
a: x[n] = cos(0.2πn) for all n
b: x[n] = (0.7)ⁿ u[n], where u[n] is the unit step
c: x[n] = 3 for all n
d: x[n] = (-1)ⁿ for all n
answer: b
explanation: The decaying exponential x[n] = (0.7)ⁿu[n] has finite total energy E = Σ(0.7)²ⁿ = 1/(1-0.49) ≈ 1.96, making it an energy signal. Option (a) is a cosine that persists forever — it has infinite energy but finite average power (power signal). Option (c) is a constant for all n, giving infinite energy and finite power P = 9 (power signal). Option (d) alternates ±1 forever — it also has infinite energy and finite power P = 1 (power signal).
\`\`\`
`,
    labWalkthrough: `## 🔬 Lab 01: Python Basics for DSP

> **Objective:** Familiarization with interactive Python, data structures, \`numpy\` arrays, and \`matplotlib\` plotting for digital signals.

### Step 1: Basic Math and Variables
In Jupyter/interactive environments, the last expression is printed automatically.
\`\`\`python
2 + 3          # 5
print(2 + 3)   # Explicitly prints 5
a, b = 2, 3
print(a + b)   # 5
\`\`\`

**Explanation:** Python handles basic arithmetic effortlessly. Variable assignment can be unpacked \`a, b = 2, 3\`.

### Step 2: Lists and Slicing
Lists in Python can hold mixed types.
\`\`\`python
l = [1, 3, [0, 1], 'c', lambda x: x*x]
print(l[0])      # 1
print(len(l))    # 5
print(l[-1])     # The lambda function (last element)
\`\`\`

**Explanation:** Negative indices slice from the end (\`-1\` is the last element, \`-2\` is the second to last). Slicing syntax is \`start:stop:step\`:
\`\`\`python
l[2:4]           # Elements at index 2 and 3
m = list(range(10)) # [0, 1, 2, ..., 9]
m[::2]           # Every second element: [0, 2, 4, 6, 8]
m[::-1]          # Reversed list
\`\`\`

### Step 3: Functions vs Arrays
Multiplying a standard Python list by an integer tiles the list. To do element-wise math (which is critical for DSP), we use \`numpy\`.
\`\`\`python
def f(x):
    return 2*x

print(f(m))  # Returns [0, 1, ..., 9, 0, 1, ..., 9] (Tiling!)

import numpy as np
m_arr = np.array(m)
print(f(m_arr))  # Returns [0, 2, 4, ..., 18] (Element-wise operations)
\`\`\`

**Explanation:** In DSP, we need to scale signals, not repeat them. \`numpy.array\` ensures math operators act element-by-element.

### Step 4: Plotting Signals
We use \`matplotlib.pyplot\` to visualize signals.
\`\`\`python
import matplotlib.pyplot as plt
x = [0, 1]
y = [1, 2]

# Plotting with different styles
plt.plot(x, y)               # Solid line
plt.plot(x, y, '.')          # Dots
plt.plot(x, y, '.-')         # Dots with line
plt.plot(x, y, 'bo-', linewidth=2, markersize=8, label='myline')
plt.grid(True)
plt.legend()
plt.show()
\`\`\`

**Explanation:** The format string \`'bo-'\` means **b**lue color, **o** (circle) markers, and **-** (solid) line. Adding grids and legends makes signal analysis much clearer.

### Step 5: Generating Discrete Signals (Impulse and Step)
For discrete-time signals $x[n]$, we represent time on the x-axis and amplitude on the y-axis. The \`stem\` plot is perfect for this.
\`\`\`python
N = 10
# Generating a Unit Impulse \\delta[n]
impulse = np.zeros(N)
impulse[0] = 1

# Generating a time axis from -N/2 to N/2 - 1
n = np.arange(N) - N//2

# Generating a Unit Step u[n]
step = np.zeros(N)
step[N//2:] = 1

plt.stem(n, impulse[n])  # Plots the impulse
plt.stem(n, step[n])     # Plots the step
\`\`\`

**Explanation:**
- \`np.zeros(N)\` initializes an array of N zeros.
- Setting \`impulse[0] = 1\` creates the Kronecker delta $\\delta[n]$.
- \`plt.stem\` plots vertical lines with markers at the top, accurately representing the discrete nature of digital signals.
- \`np.roll(array, shift)\` circularly shifts the array, useful for delaying signals.
\`\`\`

`,
    keyFormulas: `## Week 1 Key Formulas

| Formula | Description |
|---------|-------------|
| $E = \\sum_{n=-\\infty}^{\\infty} \\|x[n]\\|^2$ | Signal energy |
| $P = \\lim_{N \\to \\infty} \\frac{1}{2N+1} \\sum_{n=-N}^{N} \\|x[n]\\|^2$ | Signal power |
| $\\delta[n] = \\begin{cases} 1 & n=0 \\ 0 & \\text{otherwise} \\end{cases}$ | Unit impulse |
| $u[n] = \\begin{cases} 1 & n \\geq 0 \\ 0 & n < 0 \\end{cases}$ | Unit step |
| $T\\{ax_1 + bx_2\\} = aT\\{x_1\\} + bT\\{x_2\\}$ | Linearity test |`,
  },

  // ═══════════════════════════════════════════════════
  // WEEK 2: LTI Systems & Convolution
  // ═══════════════════════════════════════════════════
  {
    id: 2,
    title: 'LTI Systems & Convolution',
    bigPicture: `## From Impulse Response to Convolution

Last week we learned what LTI systems are. This week is the **payoff**: if a system is LTI, you can completely describe it with just one thing — its **impulse response** $h[n]$ (what it outputs when you feed it $\\delta[n]$).

Why? Because any signal can be written as a sum of shifted impulses: $x[n] = \\sum_k x[k] \\cdot \\delta[n-k]$. Since the system is linear and time-invariant, the output is: $y[n] = \\sum_k x[k] \\cdot h[n-k]$. This is **convolution** — the most fundamental operation in DSP.

> **The big idea**: Convolution in time = multiplication in frequency. This one fact drives the entire rest of the course.`,

    concepts: [
      {
        name: 'Convolution Sum',
        explanation: `### The Convolution Formula

The output of an LTI system with impulse response $h[n]$ when given input $x[n]$:

$$y[n] = (x * h)[n] = \\sum_{k=-\\infty}^{\\infty} x[k] \\cdot h[n-k]$$

**How to think about it**: For each output sample $y[n]$:
1. Flip $h[k]$ to get $h[-k]$
2. Shift it to position $n$ to get $h[n-k]$
3. Multiply element-wise with $x[k]$
4. Sum all products

\`\`\`python
import numpy as np

def convolve(x, y):
    """Compute linear convolution of x and y."""
    N, M = len(x), len(y)
    result = np.zeros(N + M - 1)
    for n in range(N + M - 1):
        for k in range(N):
            if 0 <= n - k < M:
                result[n] += x[k] * y[n - k]
    return result

# Example
x = np.array([1, 2, 3, 4, 5])
h = np.array([-1, 2, 1])
y = convolve(x, h)
print(f"x = {x}")
print(f"h = {h}")
print(f"x * h = {y}")
print(f"Verify with NumPy: {np.convolve(x, h)}")
\`\`\`

**Output length**: If $x$ has $N$ samples and $h$ has $M$ samples, then $y$ has $N + M - 1$ samples.`
      },
      {
        name: 'Properties of Convolution',
        explanation: `### Why These Properties Matter

| Property | Formula | Use case |
|----------|---------|----------|
| **Commutative** | $x * h = h * x$ | Order doesn't matter |
| **Associative** | $(x * h_1) * h_2 = x * (h_1 * h_2)$ | Cascade systems |
| **Distributive** | $x * (h_1 + h_2) = x*h_1 + x*h_2$ | Parallel systems |
| **Identity** | $x * \\delta = x$ | Impulse does nothing |

The **identity property** is powerful: convolving with $\\delta[n]$ gives back the original signal. This is why $h[n]$ is called the impulse response — it's literally what you get when you convolve $\\delta[n]$ with the system.

\`\`\`python
import numpy as np

x = np.array([1, 2, 3, 4, 5])
delta = np.array([0, 0, 1, 0, 0])  # delta[n] centered

# Identity: x * delta = x
result = np.convolve(x, [1])  # delta = [1]
print(f"x * delta = {result}")  # Same as x!

# Commutativity
h = np.array([1, -1, 0.5])
print(f"x * h = {np.convolve(x, h)}")
print(f"h * x = {np.convolve(h, x)}")  # Same result!
\`\`\``
      },
      {
        name: 'BIBO Stability',
        explanation: `### When Does an LTI System Blow Up?

An LTI system is **BIBO stable** (Bounded Input → Bounded Output) if and only if its impulse response is **absolutely summable**:

$$\\sum_{n=-\\infty}^{\\infty} |h[n]| < \\infty$$

**Intuition**: If the impulse response dies out fast enough, the system can't accumulate energy indefinitely, so bounded inputs stay bounded.

**Example**: $h[n] = (0.5)^n u[n]$ is stable because $\\sum (0.5)^n = 2 < \\infty$.

**Counterexample**: $h[n] = u[n]$ (integrator) is **unstable** because $\\sum 1 = \\infty$.

\`\`\`python
import numpy as np

# Stable system: h[n] = 0.5^n * u[n]
n = np.arange(0, 50)
h_stable = 0.5**n
print(f"Stable: sum|h| = {np.sum(np.abs(h_stable)):.4f} (finite)")

# Unstable system: h[n] = u[n] (accumulator)
h_unstable = np.ones(1000)
print(f"Unstable: sum|h| = {np.sum(np.abs(h_unstable))} (grows forever)")
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 2 Solutions

> **Core Theme:** Convolution sum, its mathematical properties, and implementation in discrete time.

---

### 📌 Problem 1: Time-Invariance of Convolution Sum

**Question:** Test the time-invariance of the convolution sum $z[n] = (x * y)[n]$.

**Proof:**
Let the system be $T\\{x[n]\\} = \\sum_{k=-\\infty}^{\\infty} x[k] y[n-k] = z[n]$.
If we delay the input by $n_0$, the new input is $x'[n] = x[n-n_0]$.
The new output is:
$$z'[n] = \\sum_{k=-\\infty}^{\\infty} x'[k] y[n-k] = \\sum_{k=-\\infty}^{\\infty} x[k-n_0] y[n-k]$$
Let $m = k - n_0$, which means $k = m + n_0$. Substituting this into the sum:
$$z'[n] = \\sum_{m=-\\infty}^{\\infty} x[m] y[n - (m + n_0)] = \\sum_{m=-\\infty}^{\\infty} x[m] y[(n - n_0) - m]$$
By definition of convolution, the RHS is exactly $z[n - n_0]$.
Since $T\\{x[n-n_0]\\} = z[n-n_0]$, the convolution operation is strictly **Time-Invariant**.

---

### 📌 Problem 2: Properties of Convolution

**(a) Identity:** $x[n] * \\delta[n] = x[n]$

*Proof:* $(x * \\delta)[n] = \\sum_k x[k] \\delta[n-k]$. The term $\\delta[n-k]$ is 1 only when $k=n$ and 0 otherwise. Thus, the only surviving term in the sum is when $k=n$, yielding $x[n] \\cdot 1 = x[n]$.

**(b) Delay:** $x[n] * \\delta[n-n_0] = x[n-n_0]$

*Proof:* $(x * \\delta_{n_0})[n] = \\sum_k x[k] \\delta[n-n_0-k]$. The delta is non-zero only when $n-n_0-k=0 \\implies k=n-n_0$. Substituting gives $x[n-n_0]$.

**(c) Commutative:** $x[n] * h[n] = h[n] * x[n]$

*Proof:* $(x * h)[n] = \\sum_k x[k]h[n-k]$. Let $m = n-k \\implies k = n-m$. As $k$ goes from $-\\infty$ to $\\infty$, $m$ goes from $\\infty$ to $-\\infty$. The sum becomes $\\sum_m x[n-m]h[m] = \\sum_m h[m]x[n-m] = (h * x)[n]$.

**(d) Associative:** $(x[n] * h_1[n]) * h_2[n] = x[n] * (h_1[n] * h_2[n])$

*Proof:*
Let $w[n] = (x * h_1)[n] = \\sum_k x[k] h_1[n-k]$.
Now convolve $w$ with $h_2$: $(w * h_2)[n] = \\sum_m w[m] h_2[n-m] = \\sum_m (\\sum_k x[k] h_1[m-k]) h_2[n-m]$.
Let $l = m-k \\implies m = l+k$. Substitute $m$:
$= \\sum_l \\sum_k x[k] h_1[l] h_2[n - (l+k)] = \\sum_k x[k] ( \\sum_l h_1[l] h_2[(n-k)-l] ) = \\sum_k x[k] (h_1 * h_2)[n-k] = x * (h_1 * h_2)$.

**(e) Bilinear (Distributive):** $x[n] * (a h_1[n] + b h_2[n]) = a(x * h_1)[n] + b(x * h_2)[n]$

*Proof:* $\\sum_k x[k](a h_1[n-k] + b h_2[n-k]) = a \\sum_k x[k] h_1[n-k] + b \\sum_k x[k] h_2[n-k]$.

---

### 📌 Problem 3: Finite-Length Sequences
Let $x[n]$ have length $k$ (non-zero for $n \\in [i, I]$) and $y[n]$ have length $l$ (non-zero for $n \\in [j, J]$).

**(a)** Maximum possible length of $z[n] = (x*y)[n]$ is $k + l - 1$.

**(b)** If $x[0]$ is at index $z_x$ in array $X$ and $y[0]$ is at index $z_y$ in array $Y$, then $z[0]$ will occur at index $z_x + z_y$ in the resulting array $Z$.

**(c)** $z[n]$ can be non-zero for $n = i+j$ up to $n = I+J$.

---

### 📌 Problem 4: Matrix Multiplication Formulation
$x[n] = \\{1, 2, 3, 2, 1\\}$, $h[n] = \\{-1, 2, 1\\}$.
Lengths are 5 and 3. The convolution $y$ will have length $5+3-1 = 7$.
We can express $y = H \\cdot x$, where $H$ is a Toeplitz matrix formed from $h$:
$$
\\begin{bmatrix}
y[0] \\\\ y[1] \\\\ y[2] \\\\ y[3] \\\\ y[4] \\\\ y[5] \\\\ y[6]
\\end{bmatrix}
=
\\begin{bmatrix}
-1 & 0 & 0 & 0 & 0 \\\\
2 & -1 & 0 & 0 & 0 \\\\
1 & 2 & -1 & 0 & 0 \\\\
0 & 1 & 2 & -1 & 0 \\\\
0 & 0 & 1 & 2 & -1 \\\\
0 & 0 & 0 & 1 & 2 \\\\
0 & 0 & 0 & 0 & 1
\\end{bmatrix}
\\begin{bmatrix}
1 \\\\ 2 \\\\ 3 \\\\ 2 \\\\ 1
\\end{bmatrix}
$$
Calculating this out yields $y = \\{-1, 0, 2, 8, 8, 4, 1\\}$.

---

### 📌 Problem 5: Python Script for Convolution

**(a) Explicit Loops, (b) External Loop + Vector, (c) Only Vector Ops**

\`\`\`python
import numpy as np

x = np.array([1, 2, 3, 4, 5])
y = np.array([-1, 2, 1])
Nx, Ny = len(x), len(y)
Nz = Nx + Ny - 1

# (a) Explicit loops
z_a = np.zeros(Nz)
for n in range(Nz):
    for k in range(Nx):
        if n - k >= 0 and n - k < Ny:
            z_a[n] += x[k] * y[n - k]

# (b) External explicit loop + Vector operations
z_b = np.zeros(Nz)
for n in range(Nz):
    k_min = max(0, n - Ny + 1)
    k_max = min(n + 1, Nx)
    k = np.arange(k_min, k_max)
    z_b[n] = np.sum(x[k] * y[n - k])

# (c) Only vector operations (using meshgrid/Toeplitz concept)
i, j = np.arange(Nz), np.arange(Nx)
I, J = np.meshgrid(j, i)
indices = J - I
H = np.zeros((Nz, Nx))
mask = (indices >= 0) & (indices < Ny)
H[mask] = y[indices[mask]]
z_c = np.dot(H, x)

# Compare with numpy.convolve
z_np = np.convolve(x, y)
print("Explicit: ", z_a)
print("Vector + Loop: ", z_b)
print("Full Vector: ", z_c)
print("NumPy: ", z_np)
\`\`\`

---

### 📌 Problem 6: Plotting Convolution
\`\`\`python
import matplotlib.pyplot as plt

x = np.array([1, 2, 3, 4, 5])
r = np.array([1, 1, 1])
y = np.convolve(x, r)

n_x = np.arange(len(x))
n_r = np.arange(len(r))
n_y = np.arange(len(y))

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(8, 6))
ax1.stem(n_x, x); ax1.set_title('x[n]')
ax2.stem(n_r, r); ax2.set_title('r[n]')
ax3.stem(n_y, y); ax3.set_title('x[n] * r[n]')
plt.tight_layout()
plt.show()
\`\`\`




### 🧠 Knowledge Check

\`\`\`quiz
question: What property of the convolution sum indicates that the order of the signals does not matter (i.e., x[n] * h[n] = h[n] * x[n])?
a: Associative Property
b: Commutative Property
c: Distributive Property
d: Identity Property
answer: b
explanation: The commutative property states x * h = h * x — you can swap the roles of input and impulse response. This is proven by variable substitution in the convolution sum. Option (a), the associative property, concerns grouping of cascaded convolutions: (x*h₁)*h₂ = x*(h₁*h₂). Option (c), the distributive property, concerns parallel systems: x*(h₁+h₂) = x*h₁ + x*h₂. Option (d), the identity property, states x*δ = x, which is about the unit impulse acting as an identity element.
\`\`\`
\`\`\`quiz
question: If you convolve a signal x[n] with a shifted unit impulse δ[n-k], what is the resulting output?
a: The original signal x[n].
b: The signal shifted by k, x[n-k].
c: A single impulse at n=k with amplitude x[k].
d: The signal x[n] scaled by the factor k.
answer: b
explanation: The sifting property of convolution gives x[n]*δ[n-k] = x[n-k]. The impulse "picks out" the signal and shifts it to position k. Option (a) would be the result of convolving with δ[n] (unshifted). Option (c) confuses convolution with the sifting property of the delta under multiplication/inner product. Option (d) is incorrect — convolving with a shifted delta never scales the signal; it only shifts it.
\`\`\`
\`\`\`quiz
question: In terms of its impulse response h[n], what is the condition for an LTI system to be causal?
a: h[n] = 0 for all n < 0.
b: The sum of the absolute values of h[n] is finite.
c: h[n] must be purely real and even.
d: h[n] must be nonzero only at n = 0.
answer: a
explanation: A causal system’s output depends only on present and past inputs, which requires the impulse response to be zero for all negative time indices. Option (b) is the condition for BIBO stability, not causality — a system can be causal but unstable. Option (c) would describe a very specific symmetric filter, unrelated to causality. Option (d) describes a memoryless system (y[n] = h[0]·x[n]), which is a special case of causal but far too restrictive.
\`\`\`
\`\`\`quiz
question: Two finite-length sequences x[n] of length N=4 and h[n] of length M=3 are convolved. What is the length of the output y[n] = x[n] * h[n]?
a: 4 (same as the longer input)
b: 3 (same as the shorter input)
c: 7 (N + M = 4 + 3)
d: 6 (N + M - 1 = 4 + 3 - 1)
answer: d
explanation: The linear convolution of two finite sequences of lengths N and M produces a result of length N + M - 1. Here, 4 + 3 - 1 = 6. This comes from the fact that the first non-zero output occurs when the two sequences first overlap, and the last non-zero output occurs when they last overlap. Option (a) would suggest no spreading of the output, which is wrong. Option (b) is too short. Option (c) applies N+M instead of N+M-1 — a common off-by-one error.
\`\`\`
\`\`\`quiz
question: An LTI system has impulse response h[n] = u[n] (the unit step function). Is this system BIBO stable?
a: Yes, because u[n] is bounded (it never exceeds 1).
b: Yes, because it is causal.
c: No, because Σ|h[n]| = Σu[n] = ∞, violating the absolute summability condition.
d: No, because h[n] has values at negative indices.
answer: c
explanation: BIBO stability requires the impulse response to be absolutely summable: Σ|h[n]| < ∞. For h[n] = u[n], the sum is 1+1+1+... = ∞, so the system is unstable. A bounded constant input like x[n]=1 produces y[n] that grows without bound (accumulator). Option (a) confuses boundedness of h[n] with absolute summability — being bounded is necessary but not sufficient. Option (b) confuses causality with stability; they are independent properties. Option (d) is factually wrong — u[n] = 0 for n < 0.
\`\`\`
`,
    labWalkthrough: `## 🔬 Lab 02: Convolution Implementations

> **Objective:** Explore the mechanics of the convolution sum by implementing it in Python with progressive levels of vectorization, culminating in a matrix-multiplication approach.

### Step 1: Basic Convolution (Nested Loops)
The mathematical formula is $z[n] = \\sum_{k} x[k] y[n-k]$. In pure Python, we can calculate this by scanning an unnecessarily large index range and skipping out-of-bounds calculations using \`continue\`.
\`\`\`python
x = [1, 2, 3, 4, 5]
y = [-1, 2, 1]

for n in range(-10, 10): 
    s = 0
    for k in range(-10, 10):
        if k >= len(x) or n - k >= len(y) or k < 0 or n-k < 0:
            continue
        else:
            s += x[k]*y[n-k]
    print(s, end=",")
\`\`\`

**Explanation:** This works, but it's wildly inefficient. We check many out-of-bounds indices.

### Step 2: Intelligent Indexing Bounds
We know $k$ must be $\\ge 0$ and $k < \\text{len}(x)$. Also, $n-k \\ge 0 \\implies k \\le n$ and $n-k < \\text{len}(y) \\implies k > n - \\text{len}(y)$. Consolidating these bounds:
\`\`\`python
for n in range(len(x) + len(y) - 1):
    s = 0
    # Strict index bounds: max(0, n-len(y)+1) to min(n+1, len(x))
    for k in range(max(n - len(y)+1, 0), min(n+1, len(x))):
            s += x[k]*y[n-k]
    print(s, end=",")
\`\`\`

### Step 3: Loop + Vectorized Operation
Instead of the inner \`k\` loop, we can use NumPy array multiplication.
\`\`\`python
import numpy as np
x = np.array([1, 2, 3, 4, 5])
y = np.array([-1, 2, 1])

for n in range(len(x) + len(y) - 1):
    k = np.arange(max(n - len(y)+1, 0), min(n+1, len(x)))
    print((x[k]*y[n-k]).sum(), end=",")
\`\`\`

**Explanation:** \`x[k]*y[n-k]\` multiplies corresponding elements instantly. \`.sum()\` adds them up. This replaces the inner loop entirely.

### Step 4: Matrix Multiplication Approach (Fully Vectorized)
Convolution is a linear operation, so it can be expressed as a matrix multiplication $y = Hx$. We can construct $H$ by placing shifted copies of $y$ into a matrix.
\`\`\`python
n, m = len(x), len(y)
i, j = np.arange(n+m-1), np.arange(n)
I, J = np.meshgrid(j, i)

tmp = J - I          # Calculate n - k for all elements
tmp[tmp >= m] = -1   # Mark out-of-bounds indices
ind = np.where(tmp >= 0)

H = np.zeros([n + m - 1, n], dtype=int)
H[ind] = y[tmp[ind]] # Build the Toeplitz matrix
print(np.array(np.mat(H)*np.mat(x).T).flatten())
\`\`\`

**Explanation:** \`meshgrid\` generates coordinates. We use \`J-I\` to determine what index of $y$ maps to each location in the Toeplitz matrix $H$. We then perform a fast matrix multiplication. This is incredibly fast in Python compared to loops.

### Step 5: Verification
Convolving a signal with the impulse $\\delta[n]$ should return the signal.
\`\`\`python
N = 10
impulse = np.zeros(N)
impulse[0] = 1
print(convolve(x, impulse)) # Returns [1, 2, 3, 4, 5, 0...]
\`\`\`

**Explanation:** The empirical proof of the identity property $x * \\delta = x$.

`,
    keyFormulas: `## Week 2 Key Formulas

| Formula | Description |
|---------|-------------|
| $y[n] = \\sum_{k=-\\infty}^{\\infty} x[k] h[n-k]$ | Convolution sum |
| Output length: $N + M - 1$ | For inputs of length $N$ and $M$ |
| $\\sum_{n} \\|h[n]\\| < \\infty$ | BIBO stability condition |
| $x * \\delta = x$ | Convolution identity |
| $x * h = h * x$ | Commutativity |`,
  },

  // ═══════════════════════════════════════════════════
  // WEEK 3: Fourier Series & Transform
  // ═══════════════════════════════════════════════════
  {
    id: 3,
    title: 'Fourier Series & Fourier Transform',
    bigPicture: `## The Frequency Domain Revolution

Up to now, we've worked in the **time domain** — looking at signals as sequences of values over time. This week we discover an entirely different way to look at signals: the **frequency domain**.

**The core insight**: Any signal can be decomposed into a sum of sinusoids at different frequencies. The Fourier Transform tells you **which frequencies are present** and **how strong each one is**.

This is like a prism splitting white light into a rainbow — except instead of light, we're splitting signals into their constituent frequencies. This view makes filtering, compression, and analysis dramatically easier.

> **Connection to Week 2**: Remember that convolution in time is multiplication in frequency? This week we learn the tool (Fourier Transform) that makes that statement precise.`,

    concepts: [
      {
        name: 'Fourier Series',
        explanation: `### Decomposing Periodic Signals

A **periodic** signal $x(t)$ with period $T_0$ can be written as a sum of harmonics:

$$x(t) = \\sum_{k=-\\infty}^{\\infty} c_k \\, e^{j 2\\pi k f_0 t}$$

where $f_0 = 1/T_0$ is the fundamental frequency and the coefficients are:

$$c_k = \\frac{1}{T_0} \\int_{0}^{T_0} x(t) \\, e^{-j 2\\pi k f_0 t} \\, dt$$

**Intuition**: Imagine a musical chord. It sounds like one complex tone, but it's actually 3+ pure notes (sinusoids) added together. The Fourier coefficients $c_k$ tell you the amplitude and phase of each note.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Build a square wave from its Fourier series
t = np.linspace(0, 2, 1000)
f0 = 1  # 1 Hz fundamental

# Square wave = sum of odd harmonics: sin(f) + sin(3f)/3 + sin(5f)/5 + ...
x = np.zeros_like(t)
for k in range(1, 20, 2):  # odd harmonics: 1, 3, 5, ...
    x += (4 / (np.pi * k)) * np.sin(2 * np.pi * k * f0 * t)

plt.figure(figsize=(10, 4))
plt.plot(t, x, 'b-', label='Sum of 10 harmonics')
plt.title('Square wave from Fourier Series')
plt.xlabel('t (seconds)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
\`\`\``
      },
      {
        name: 'Fourier Transform',
        explanation: `### From Periodic to Aperiodic

The **Fourier Transform** extends the Fourier Series to **non-periodic** signals:

$$X(f) = \\int_{-\\infty}^{\\infty} x(t) \\, e^{-j 2\\pi f t} \\, dt$$

$$x(t) = \\int_{-\\infty}^{\\infty} X(f) \\, e^{j 2\\pi f t} \\, df$$

$X(f)$ is a **complex function** — its magnitude $|X(f)|$ is the **amplitude spectrum** and its angle $\\angle X(f)$ is the **phase spectrum**.

### The Most Important FT Pair

$$\\text{rect}(t) \\longleftrightarrow \\text{sinc}(f) = \\frac{\\sin(\\pi f)}{\\pi f}$$

A rectangular pulse in time has a sinc shape in frequency, and vice versa. This is the foundation of all filtering.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Compute FT of a rect pulse numerically using FFT
dt = 0.001  # fine time resolution
t = np.arange(-5, 5, dt)
rect = np.where(np.abs(t) <= 0.5, 1.0, 0.0)  # rect(t)

# FFT approximation of continuous FT
X = dt * np.fft.fft(rect)
f = np.fft.fftfreq(len(t), dt)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
ax1.plot(t, rect)
ax1.set_title('Time domain: rect(t)')
ax1.set_xlabel('t')

ax2.plot(np.fft.fftshift(f), np.fft.fftshift(np.abs(X)))
ax2.set_xlim(-10, 10)
ax2.set_title('Frequency domain: |sinc(f)|')
ax2.set_xlabel('f (Hz)')
plt.tight_layout()
plt.show()
\`\`\``
      },
      {
        name: 'Key FT Properties',
        explanation: `### Properties That Make Life Easy

| Property | Time Domain | Frequency Domain |
|----------|-------------|------------------|
| **Linearity** | $ax_1(t) + bx_2(t)$ | $aX_1(f) + bX_2(f)$ |
| **Time shift** | $x(t - t_0)$ | $X(f) e^{-j2\\pi f t_0}$ |
| **Frequency shift** | $x(t) e^{j2\\pi f_0 t}$ | $X(f - f_0)$ |
| **Convolution** | $x(t) * h(t)$ | $X(f) \\cdot H(f)$ |
| **Parseval** | $\\int |x(t)|^2 dt$ | $= \\int |X(f)|^2 df$ |

The **convolution theorem** is the most important: filtering in time (convolution with $h$) is just multiplication by $H(f)$ in frequency. This is why we care about frequency domain — it turns a hard operation into an easy one!

\`\`\`python
import numpy as np

# Demonstrate convolution theorem
N = 256
x = np.random.randn(N)
h = np.array([0.25, 0.5, 0.25])  # simple smoothing filter

# Time domain: convolution
y_time = np.convolve(x, h, mode='same')

# Frequency domain: multiply spectra
X = np.fft.fft(x, N)
H = np.fft.fft(h, N)  # zero-pad h to length N
Y = X * H
y_freq = np.real(np.fft.ifft(Y))

print(f"Max difference: {np.max(np.abs(y_time - y_freq)):.2e}")
# Should be very small (floating point precision)
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 3 Solutions

> **Core Theme:** Fourier series, continuous Fourier transforms, symmetry properties, and Dirac delta parametrization.

---

### 📌 Problem 1: Dirac Delta Parametrization
Prove the parametrized functions satisfy the Dirac delta distributions: (1) Unit area, (2) zero everywhere except the origin in the limit.

**(a)** $\\delta(\\alpha, x) = \\frac{1}{\\pi} \\frac{\\alpha}{x^2 + \\alpha^2}$ as $\\alpha \\to 0$.

**Proof:** 
1. Area: $\\int_{-\\infty}^{\\infty} \\frac{\\alpha}{\\pi(x^2 + \\alpha^2)} dx = \\frac{1}{\\pi} \\left[ \\arctan\\left(\\frac{x}{\\alpha}\\right) \\right]_{-\\infty}^{\\infty} = \\frac{1}{\\pi} \\left( \\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right) \\right) = 1$.
2. Limit: For $x \\neq 0$, $\\lim_{\\alpha \\to 0} \\frac{\\alpha}{\\pi(x^2 + \\alpha^2)} = \\frac{0}{x^2} = 0$.
Thus, it approaches $\\delta(x)$.

**(b)** $\\delta(\\alpha, x) = \\frac{1}{\\alpha\\sqrt{\\pi}} e^{-(x/\\alpha)^2}$ as $\\alpha \\to 0$.

**Proof:**
1. Area: Let $u = x/\\alpha$, $dx = \\alpha du$. The integral becomes $\\frac{1}{\\alpha\\sqrt{\\pi}} \\int_{-\\infty}^{\\infty} e^{-u^2} \\alpha du = \\frac{1}{\\sqrt{\\pi}} \\sqrt{\\pi} = 1$.
2. Limit: For $x \\neq 0$, $e^{-(x/\\alpha)^2} \\to e^{-\\infty} = 0$. Thus, it approaches $\\delta(x)$.

**(c)** $\\delta(\\alpha, x) = \\frac{\\alpha}{2} \\frac{1}{\\cosh^2(\\alpha x)}$ as $\\alpha \\to \\infty$.

**Proof:**
1. Area: $\\int_{-\\infty}^{\\infty} \\frac{\\alpha}{2} \\text{sech}^2(\\alpha x) dx = \\frac{1}{2} \\left[ \\tanh(\\alpha x) \\right]_{-\\infty}^{\\infty} = \\frac{1}{2} (1 - (-1)) = 1$.
2. Limit: For $x \\neq 0$, as $\\alpha \\to \\infty$, $\\cosh^2(\\alpha x) \\to \\infty$, so the function approaches $0$. Thus, it is $\\delta(x)$.

---

### 📌 Problem 2: Properties of Periodic Functions
Let $f_P(x)$ and $g_P(x)$ be periodic with period $P$. By definition, $f_P(x+P) = f_P(x)$.

**(a) Scaling:** $h_P(x) = \\alpha f_P(x) \\implies h_P(x+P) = \\alpha f_P(x+P) = \\alpha f_P(x) = h_P(x)$.

**(b) Shifting value:** $h_P(x) = \\alpha + f_P(x) \\implies h_P(x+P) = \\alpha + f_P(x+P) = \\alpha + f_P(x) = h_P(x)$.

**(c) Shifting time:** $h_P(x) = f_P(x+\\alpha) \\implies h_P(x+P) = f_P(x+P+\\alpha) = f_P(x+\\alpha) = h_P(x)$.

**(d) Addition:** $f_P(x+P) + g_P(x+P) = f_P(x) + g_P(x)$.

**(e) Multiplication:** $f_P(x+P) \\cdot g_P(x+P) = f_P(x) \\cdot g_P(x)$.

**(f) Functions of periodic functions:** $\\mathcal{F}(f_P(x+P)) = \\mathcal{F}(f_P(x))$.

**(g) Time-scaling:** $h(x) = f_P(\\alpha x)$. $h(x + P/\\alpha) = f_P(\\alpha(x + P/\\alpha)) = f_P(\\alpha x + P) = f_P(\\alpha x) = h(x)$. Thus the new period is $P/\\alpha$.

**(h) Harmonic addition:** $g_{kP}(x)$ has period $kP$. $f_P(x)$ repeats every $P$, so it also repeats every $kP$. Their sum has period $kP$.

**(i) Commensurate periods:** The sum of two periodic functions is periodic if their periods $P_1, P_2$ have a common multiple $P = n P_1 = m P_2$.

---

### 📌 Problem 3: Fourier Series of $\\cos(ax)$
Find the Fourier series of $f(x) = \\cos(ax)$ over $(-\\pi, \\pi)$. The domain interval is $T = 2\\pi$.
The Fourier coefficients are $c_k = \\frac{1}{2\\pi} \\int_{-\\pi}^{\\pi} \\cos(ax) e^{-jkx} dx$.
Using Euler's formula $\\cos(ax) = \\frac{e^{jax} + e^{-jax}}{2}$:
$$c_k = \\frac{1}{4\\pi} \\int_{-\\pi}^{\\pi} (e^{j(a-k)x} + e^{-j(a+k)x}) dx$$
Evaluating the integral:
$$c_k = \\frac{1}{4\\pi} \\left[ \\frac{e^{j(a-k)x}}{j(a-k)} + \\frac{e^{-j(a+k)x}}{-j(a+k)} \\right]_{-\\pi}^{\\pi}$$
$$= \\frac{1}{2\\pi} \\left[ \\frac{\\sin((a-k)\\pi)}{a-k} + \\frac{\\sin((a+k)\\pi)}{a+k} \\right]$$
Since $\\sin(a\\pi - k\\pi) = (-1)^k \\sin(a\\pi)$ and $\\sin(a\\pi + k\\pi) = (-1)^k \\sin(a\\pi)$:
$$c_k = \\frac{(-1)^k \\sin(a\\pi)}{2\\pi} \\left( \\frac{1}{a-k} + \\frac{1}{a+k} \\right) = (-1)^k \\frac{a \\sin(a\\pi)}{\\pi(a^2 - k^2)}$$

---

### 📌 Problem 4: Poisson Summation / Dirac Comb
Prove $\\sum_{n=-\\infty}^{\\infty} e^{in \\frac{2\\pi}{L} x} = L \\sum_{n=-\\infty}^{\\infty} \\delta(x - nL)$.

**Proof:** 
The right side is a periodic pulse train (Dirac comb) with period $L$. We can express it as a Fourier series.
$c_k = \\frac{1}{L} \\int_{-L/2}^{L/2} L \\delta(x) e^{-jk \\frac{2\\pi}{L} x} dx = 1$.
Reconstructing the signal from the Fourier series:
$f(x) = \\sum_{n=-\\infty}^{\\infty} c_n e^{in \\frac{2\\pi}{L} x} = \\sum_{n=-\\infty}^{\\infty} 1 \\cdot e^{in \\frac{2\\pi}{L} x}$.
Thus, the sum of complex exponentials exactly yields the periodic Dirac comb.

---

### 📌 Problem 5: Properties of the Fourier Transform

**(a) Time Scaling:** $\\mathcal{F}\\{f(at)\\} = \\int f(at)e^{-j2\\pi ft} dt$. Let $u=at, du=a\\,dt$. $= \\frac{1}{|a|} \\int f(u)e^{-j2\\pi \\frac{f}{a} u} du = \\frac{1}{|a|}\\hat{f}\\left(\\frac{f}{a}\\right)$.

**(b) Frequency Shift:** $\\mathcal{F}\\{f(t)e^{i a t}\\} = \\int f(t)e^{i a t}e^{-j\\omega t} dt = \\int f(t)e^{-j(\\omega-a)t} dt = \\hat{f}(\\omega-a)$.

**(c) Time Derivative:** $\\mathcal{F}\\{f'(t)\\} = \\int f'(t)e^{-j\\omega t} dt$. Integration by parts gives $j\\omega \\hat{f}(\\omega)$.

**(e) Convolution:** $\\mathcal{F}\\{f * g\\} = \\iint f(\\tau)g(t-\\tau)e^{-j\\omega t} d\\tau dt$. Let $u=t-\\tau$. The integral separates: $\\int f(\\tau)e^{-j\\omega \\tau} d\\tau \\int g(u)e^{-j\\omega u} du = \\hat{f}(\\omega)\\cdot\\hat{g}(\\omega)$.

---

### 📌 Problem 6: Symmetry Properties

**(a) Real:** $x(t)$ is real. $X(-f) = \\int x(t)e^{j2\\pi ft} dt = \\left( \\int x(t)e^{-j2\\pi ft} dt \\right)^* = X^*(f)$.

**(c) Even:** $x(-t) = x(t)$. $X(f) = \\int x(-t)e^{-j2\\pi ft} dt = \\int x(\\tau)e^{j2\\pi f\\tau} d\\tau = X(-f)$. $X(f)$ is even.

**(f) Real & Odd:** Since real, $X(-f) = X^*(f)$. Since odd, $X(f)$ is odd. Thus $X(f) = -X(-f) = -X^*(f)$. This means $X(f)$ must be purely imaginary.

---

### 📌 Problem 7: Convolution Properties

**(b) $\\mathcal{F}\\{f * g\\} = \\hat{f} \\cdot \\hat{g}$**: Proven in Problem 5e.

**(c) $f \\cdot g = \\mathcal{F}^{-1}\\{\\hat{f} * \\hat{g}\\}$**: By duality of the Fourier transform.

**(d) $f * \\delta = f$**: $\\int f(\\tau)\\delta(t-\\tau) d\\tau = f(t)$.

**(e) $f * \\delta(t-t_0) = f(t-t_0)$**: Sifting property of the Dirac delta.

**(f) $f * q_T = \\sum f(t-nT)$**: $q_T(t) = T \\sum \\delta(t-nT)$. Convolving $f(t)$ with a sum of deltas yields a sum of shifted $f(t)$'s.




### 🧠 Knowledge Check

\`\`\`quiz
question: What does the Fourier Series represent?
a: The conversion of a continuous-time signal into a sequence of discrete samples.
b: The decomposition of a periodic signal into an infinite sum of harmonically related complex exponentials (sines and cosines).
c: The time delay of a signal at various frequency points.
d: The approximation of any signal using polynomial basis functions.
answer: b
explanation: The Fourier Series expresses a periodic signal x(t) as a weighted sum of complex exponentials e^{j2πkf₀t} at integer multiples of the fundamental frequency f₀ = 1/T₀. Option (a) describes sampling (A/D conversion), not Fourier analysis. Option (c) is not what any Fourier representation does. Option (d) describes polynomial approximation (e.g., Taylor series), which uses powers of t rather than sinusoidal/exponential basis functions.
\`\`\`
\`\`\`quiz
question: For a real-valued signal, what symmetry property do its Fourier coefficients exhibit?
a: They are purely real and even.
b: They exhibit conjugate symmetry (c_k = c_{-k}^*).
c: They are purely imaginary and odd.
d: They satisfy c_k = c_{k+1} for all k.
answer: b
explanation: When x(t) is real, taking the complex conjugate of the Fourier Series shows that c_{-k} = c_k*. This means the magnitude spectrum |c_k| is even and the phase ∠c_k is odd. Option (a) is only true for the special case of real and even signals. Option (c) is only true for real and odd signals. Option (d) would imply all coefficients are equal, which has no basis in Fourier theory.
\`\`\`
\`\`\`quiz
question: Which transform is used to analyze aperiodic, continuous-time signals?
a: Continuous-Time Fourier Series (CTFS)
b: Continuous-Time Fourier Transform (CTFT)
c: Discrete Fourier Transform (DFT)
d: Z-Transform
answer: b
explanation: The CTFT extends the Fourier Series to non-periodic (aperiodic) continuous-time signals by letting the period T₀ → ∞, turning the discrete harmonics into a continuous spectrum X(f). Option (a) is specifically for periodic signals. Option (c) is for finite-length discrete sequences. Option (d) is a generalization of the DTFT to the complex z-plane, not for continuous-time signals.
\`\`\`
\`\`\`quiz
question: The convolution theorem states that convolution in the time domain corresponds to what operation in the frequency domain?
a: Convolution in the frequency domain as well.
b: Differentiation in the frequency domain.
c: Multiplication in the frequency domain.
d: Integration in the frequency domain.
answer: c
explanation: The convolution theorem is one of the most powerful results in signal processing: if y(t) = x(t)*h(t), then Y(f) = X(f)·H(f). This is why filtering is so efficient in the frequency domain — instead of computing a costly convolution sum, you just multiply spectra point by point. Option (a) is the dual result: multiplication in time corresponds to convolution in frequency. Options (b) and (d) correspond to different FT properties (time-domain differentiation/integration), not convolution.
\`\`\`
\`\`\`quiz
question: If a real-valued signal x(t) is also an odd function (x(-t) = -x(t)), what can be said about its Fourier Transform X(f)?
a: X(f) is purely real and even.
b: X(f) is purely imaginary and odd.
c: X(f) has constant magnitude across all frequencies.
d: X(f) is a real and odd function.
answer: b
explanation: For a real signal, X(-f) = X*(f) (conjugate symmetry). For an odd signal, X(-f) = -X(f) (the FT of an odd function is odd). Combining these: X*(f) = -X(f), which means X(f) = -X*(f). This is only possible if X(f) is purely imaginary. Since X(-f) = -X(f), it is also odd. Option (a) would be true for a real and even signal. Option (c) describes an allpass system, unrelated to signal symmetry. Option (d) would require X(f) to be real, but conjugate symmetry plus oddness forces it to be imaginary.
\`\`\`
`,
    labWalkthrough: `## 🔬 Lab 03: FFT as Numerical Fourier Transform

> **Objective:** Understand how to compute continuous Fourier Transforms numerically using Python's discrete \`numpy.fft\` module, properly scaling axes to maintain physical units.

### Step 1: Generating Frequency Axes
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

print(np.fft.fftfreq(2)) # [ 0. , -0.5]
print(np.fft.fftfreq(4)) # [ 0.  ,  0.25, -0.5 , -0.25]
\`\`\`

**Explanation:** The FFT outputs results in a strange order: DC (0 Hz) first, then positive frequencies, then the Nyquist frequency, and finally negative frequencies moving back towards zero. \`fftfreq\` generates the exact frequency labels corresponding to these bins.

### Step 2: Centering the Spectrum
\`\`\`python
f_raw = np.fft.fftfreq(8, 0.1)
f_centered = np.fft.fftshift(f_raw)
print(f_centered) # [-5., -3.75, -2.5, -1.25, 0., 1.25, 2.5, 3.75]
\`\`\`

**Explanation:** To plot the spectrum intuitively (negative to positive), we use \`fftshift\`. This function shifts the zero-frequency component to the center of the array. You must apply \`fftshift\` to BOTH the frequency axis AND the FFT output to keep them aligned!

### Step 3: Numeric vs Analytic Fourier Transform
The Continuous Fourier Transform (CFT) is an integral. The Discrete Fourier Transform (DFT/FFT) is a sum. To approximate the CFT using the FFT, we multiply the FFT output by the sampling period $T_s$.

$$ X(f) \\approx T_s \\cdot \\text{FFT}\\{x[n]\\} $$

\`\`\`python
# Sampling grid
fs = 1000.0        # Sampling frequency
T = 1 / fs         # Sampling period
N = 1024           # Number of samples
t = np.arange(N) * T # Time vector

# Signal
x = np.cos(2 * np.pi * 50 * t) + np.sin(2 * np.pi * 120 * t)

# Numerical FT
X_fft = np.fft.fft(x) * T
freqs = np.fft.fftfreq(N, T)

# Centered Plot
plt.plot(np.fft.fftshift(freqs), np.abs(np.fft.fftshift(X_fft)))
plt.xlim(-150, 150)
plt.grid(True)
plt.show()
\`\`\`

**Explanation:** 
1. We define a high $f_s$ and large $N$ to get a dense grid.
2. We compute the FFT and explicitly multiply by $T$ to get the correct amplitude scaling.
3. We \`fftshift\` both arrays and plot the magnitude spectrum. We see clear spikes at $\\pm 50$ Hz and $\\pm 120$ Hz.
`,
    keyFormulas: `## Week 3 Key Formulas

| Formula | Description |
|---------|-------------|
| $c_k = \\frac{1}{T_0}\\int_0^{T_0} x(t) e^{-j2\\pi k f_0 t} dt$ | Fourier Series coefficients |
| $X(f) = \\int_{-\\infty}^{\\infty} x(t) e^{-j2\\pi ft} dt$ | Fourier Transform |
| $x(t) * h(t) \\leftrightarrow X(f) \\cdot H(f)$ | Convolution theorem |
| $\\text{rect}(t) \\leftrightarrow \\text{sinc}(f)$ | Key transform pair |
| $\\int |x(t)|^2 dt = \\int |X(f)|^2 df$ | Parseval's theorem |`,
  },

  // ═══════════════════════════════════════════════════
  // WEEK 4: Discrete-Time Fourier Transform
  // ═══════════════════════════════════════════════════
  {
    id: 4,
    title: 'Discrete-Time Fourier Transform',
    bigPicture: `## The Frequency View for Discrete Signals

Week 3 gave us the Fourier Transform for continuous signals. But in DSP, we work with **discrete** signals $x[n]$. The **DTFT** is the frequency analysis tool specifically designed for discrete-time signals.

$$X(e^{j\\omega}) = \\sum_{n=-\\infty}^{\\infty} x[n] \\, e^{-j\\omega n}$$

The DTFT output is a **continuous function of frequency** $\\omega$ (even though the input is discrete). It's also **periodic with period** $2\\pi$ — this periodicity is a direct consequence of sampling.

> **Connection**: When you evaluate the Z-transform (Week 5) on the unit circle ($z = e^{j\\omega}$), you get the DTFT.`,

    concepts: [
      {
        name: 'DTFT Definition',
        explanation: `### Analysis and Synthesis

**Analysis** (time → frequency):
$$X(e^{j\\omega}) = \\sum_{n=-\\infty}^{\\infty} x[n] \\, e^{-j\\omega n}$$

**Synthesis** (frequency → time):
$$x[n] = \\frac{1}{2\\pi} \\int_{-\\pi}^{\\pi} X(e^{j\\omega}) \\, e^{j\\omega n} \\, d\\omega$$

The variable $\\omega$ is the **normalized angular frequency** in radians/sample. It relates to physical frequency by $\\omega = 2\\pi f / f_s$.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Compute DTFT of a finite sequence
x = np.array([1, 2, 3, 2, 1])  # symmetric sequence
omega = np.linspace(-np.pi, np.pi, 1000)

# DTFT: sum x[n] * e^{-j*omega*n}
X = np.zeros(len(omega), dtype=complex)
for n in range(len(x)):
    X += x[n] * np.exp(-1j * omega * n)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 5))
ax1.plot(omega/np.pi, np.abs(X))
ax1.set_title('|X(e^{jω})| — Magnitude spectrum')
ax1.set_xlabel('ω/π')
ax2.plot(omega/np.pi, np.angle(X))
ax2.set_title('∠X(e^{jω}) — Phase spectrum')
ax2.set_xlabel('ω/π')
plt.tight_layout()
plt.show()
\`\`\``
      },
      {
        name: 'Frequency Response of LTI Systems',
        explanation: `### The Power of H(e^{jω})

For an LTI system with impulse response $h[n]$, the **frequency response** is just the DTFT of $h[n]$:

$$H(e^{j\\omega}) = \\sum_{n=-\\infty}^{\\infty} h[n] e^{-j\\omega n}$$

If the input is a pure sinusoid $x[n] = e^{j\\omega_0 n}$, the output is:
$$y[n] = H(e^{j\\omega_0}) \\cdot e^{j\\omega_0 n}$$

The system **scales** the amplitude by $|H(e^{j\\omega_0})|$ and **shifts** the phase by $\\angle H(e^{j\\omega_0})$. This is filtering!

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Simple moving average filter: h[n] = [1/3, 1/3, 1/3]
h = np.array([1/3, 1/3, 1/3])
omega = np.linspace(-np.pi, np.pi, 1000)

# Frequency response
H = np.zeros(len(omega), dtype=complex)
for n in range(len(h)):
    H += h[n] * np.exp(-1j * omega * n)

plt.figure(figsize=(10, 4))
plt.plot(omega/np.pi, 20*np.log10(np.abs(H) + 1e-10))
plt.title('Moving average filter: |H(e^{jω})| in dB')
plt.xlabel('ω/π')
plt.ylabel('Magnitude (dB)')
plt.grid(True, alpha=0.3)
plt.show()
# Notice: it's a lowpass filter! Attenuates high frequencies.
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 4 Solutions

> **Core Theme:** Aliasing, FT properties, and numeric vs. analytic Fourier transforms.

### 📌 Problem 1: Prove Aliasing
**Question:** Prove that $\\cos(2\\pi f t)$ and $\\cos(2\\pi(f+kf_s)t)$ yield the exact same samples when sampled at $f_s$.

**Proof:**
Let $x_1(t) = \\cos(2\\pi f t)$ and $x_2(t) = \\cos(2\\pi(f + k f_s)t)$ where $k \\in \\mathbb{Z}$.
Sampling at $f_s$ means evaluating at $t = n T_s = n / f_s$ for integer $n$.
For $x_1(t)$:
$$ x_1[n] = x_1(n/f_s) = \\cos\\left(2\\pi f \\frac{n}{f_s}\\right) $$
For $x_2(t)$:
$$ x_2[n] = x_2(n/f_s) = \\cos\\left(2\\pi (f + k f_s) \\frac{n}{f_s}\\right) = \\cos\\left(2\\pi f \\frac{n}{f_s} + 2\\pi k n\\right) $$
Since $k$ and $n$ are both integers, their product $k n$ is an integer. The cosine function is periodic with period $2\\pi$, meaning $\\cos(\\theta + 2\\pi m) = \\cos(\\theta)$ for any integer $m$.
Therefore:
$$ x_2[n] = \\cos\\left(2\\pi f \\frac{n}{f_s}\\right) = x_1[n] $$
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

**(a) $\\int e^{j2\\pi ft} df = \\delta(t)$:**
This is the standard integral representation of the Dirac delta function, which derives from the inverse Fourier transform of $X(f) = 1$.

**(b) $\\mathcal{F}\\{\\delta(t-\\tau)\\}$:**
$$ \\int_{-\\infty}^{\\infty} \\delta(t-\\tau) e^{-j2\\pi ft} dt = e^{-j2\\pi f\\tau} $$
Using the sifting property of the Dirac delta.

**(c) $\\mathcal{F}\\{\\text{rect}(t)\\}$:**
$$ \\int_{-1/2}^{1/2} 1 \\cdot e^{-j2\\pi ft} dt = \\left[ \\frac{e^{-j2\\pi ft}}{-j2\\pi f} \\right]_{-1/2}^{1/2} = \\frac{e^{-j\\pi f} - e^{j\\pi f}}{-j2\\pi f} = \\frac{\\sin(\\pi f)}{\\pi f} = \\text{sinc}(f) $$

**(d) Sinc orthogonality:**
$$ \\int_{-\\infty}^{\\infty} \\text{sinc}(t-n)\\text{sinc}(t-m) dt $$
By Parseval's theorem, this equals the integral of their Fourier transforms. $\\mathcal{F}\\{\\text{sinc}(t-n)\\} = \\text{rect}(f)e^{-j2\\pi f n}$.
$$ \\int_{-1/2}^{1/2} e^{-j2\\pi f n} e^{j2\\pi f m} df = \\int_{-1/2}^{1/2} e^{j2\\pi f (m-n)} df $$
If $m=n$, the integral is 1. If $m \\neq n$, it integrates to 0. Thus, it equals $\\delta_{nm}$.

**(e) Spectrum of Sampled Signal:**
Ideal sampling is multiplication by an impulse train: $x_s(t) = x(t) \\sum \\delta(t-nT_s)$.
Multiplication in time is convolution in frequency:
$$ X_s(f) = X(f) * \\mathcal{F}\\left\\{\\sum \\delta(t-nT_s)\\right\\} = X(f) * f_s \\sum \\delta(f-k f_s) = f_s \\sum X(f-k f_s) $$

**(f) Reconstruction Formula:**
To reconstruct $x(t)$ from $x_s(t)$, we apply an ideal lowpass filter $H(f) = T_s \\text{rect}(f/f_s)$.
In the time domain, this is convolution with $h(t) = \\text{sinc}(f_s t)$.
$$ x(t) = \\sum_{n} x[n] \\delta(t-nT_s) * \\text{sinc}(t/T_s) = \\sum_{n} x[n] \\text{sinc}\\left(\\frac{t - nT_s}{T_s}\\right) $$

**(g) $\\mathcal{F}\\{\\cos(2\\pi f_0 t)\\}$:**
Euler's formula: $\\cos(2\\pi f_0 t) = \\frac{1}{2}(e^{j2\\pi f_0 t} + e^{-j2\\pi f_0 t})$.
Transforming each exponential gives: $\\frac{1}{2}(\\delta(f-f_0) + \\delta(f+f_0))$.

**(h) $\\mathcal{F}\\{\\sin(2\\pi f_0 t)\\}$:**
Euler's formula: $\\sin(2\\pi f_0 t) = \\frac{1}{2j}(e^{j2\\pi f_0 t} - e^{-j2\\pi f_0 t})$.
Transforming gives: $\\frac{1}{2j}(\\delta(f-f_0) - \\delta(f+f_0))$.

**(i) Linearity:**
$\\int [a x(t) + b y(t)] e^{-j2\\pi ft} dt = a \\int x(t) e^{-j2\\pi ft} dt + b \\int y(t) e^{-j2\\pi ft} dt = aX(f) + bY(f)$.

**(j) Time Scaling:**
$\\mathcal{F}\\{x(at)\\} = \\int x(at) e^{-j2\\pi ft} dt$. Let $u = at, du = a dt$.
$= \\frac{1}{|a|} \\int x(u) e^{-j2\\pi f(u/a)} du = \\frac{1}{|a|} X(f/a)$.

**(k) Frequency Shift:**
$\\mathcal{F}\\{x(t)e^{j2\\pi f_0 t}\\} = \\int x(t) e^{j2\\pi f_0 t} e^{-j2\\pi ft} dt = \\int x(t) e^{-j2\\pi (f-f_0)t} dt = X(f-f_0)$.

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




### 🧠 Knowledge Check

\`\`\`quiz
question: The Discrete-Time Fourier Transform (DTFT) takes a discrete-time signal and produces a spectrum that is:
a: Discrete and periodic.
b: Continuous and periodic with period 2π.
c: Continuous and aperiodic.
d: Discrete and aperiodic.
answer: b
explanation: The DTFT sums x[n]e^{-jωn} over all integer n, producing a continuous function of the real variable ω. This function is inherently periodic with period 2π because e^{-j(ω+2π)n} = e^{-jωn} for integer n. Option (a) describes the DFT, which samples the DTFT at N equally-spaced points. Option (c) describes the continuous-time Fourier Transform. Option (d) does not correspond to any standard transform.
\`\`\`
\`\`\`quiz
question: What happens to the DTFT of a signal if the signal is delayed in the time domain by k samples (i.e., x[n-k])?
a: The spectrum is multiplied by a linear phase shift e^{-jωk}.
b: The spectrum is circularly shifted by k bins.
c: The amplitude of the spectrum decreases by a factor of k.
d: The magnitude spectrum changes but the phase remains the same.
answer: a
explanation: The time-shift property of the DTFT states that if x[n] has DTFT X(e^{jω}), then x[n-k] has DTFT e^{-jωk}·X(e^{jω}). The magnitude |X(e^{jω})| is unchanged — only the phase is affected by the linear term -ωk. Option (b) describes circular shift, which applies to the DFT, not general DTFT delays. Option (c) is wrong because delay doesn’t attenuate. Option (d) has it backwards — the magnitude stays the same while the phase changes.
\`\`\`
\`\`\`quiz
question: If a discrete-time sequence is purely real and even, what can be said about its DTFT?
a: It is purely imaginary and odd.
b: It is purely real and even.
c: It has a constant magnitude of 1 across all frequencies.
d: It is complex with nonzero imaginary part.
answer: b
explanation: For real signals, the DTFT has conjugate symmetry: X(e^{jω}) = X*(e^{-jω}). For even signals, X(e^{jω}) = X(e^{-jω}). Combining these: X(e^{jω}) = X*(e^{jω}), which means X is equal to its own conjugate — i.e., it must be purely real. And since X(e^{jω}) = X(e^{-jω}), it is even. Option (a) would apply to a real and odd sequence. Option (c) describes an allpass filter, unrelated to time-domain symmetry. Option (d) contradicts the conjugate symmetry constraint.
\`\`\`
\`\`\`quiz
question: A continuous signal with maximum frequency f_max = 4 kHz is sampled at f_s = 6 kHz. What happens?
a: Perfect reconstruction is possible since f_s > f_max.
b: Aliasing occurs because f_s < 2·f_max, causing frequency components above 3 kHz to fold back into the 0–3 kHz range.
c: The signal is automatically bandlimited to 3 kHz with no distortion.
d: The sampling process amplifies frequencies near f_max.
answer: b
explanation: The Nyquist theorem requires f_s > 2f_max = 8 kHz for alias-free sampling. At f_s = 6 kHz, the Nyquist frequency is only 3 kHz. Frequency content between 3–4 kHz folds (aliases) back into the 2–3 kHz range, corrupting the signal irreversibly. Option (a) is wrong because f_s = 6 kHz < 8 kHz. Option (c) is wrong because sampling doesn’t filter — it creates spectral copies that overlap. Option (d) is wrong because sampling doesn’t amplify any frequencies.
\`\`\`
\`\`\`quiz
question: The frequency response H(e^{jω}) of a 3-point moving average filter h[n] = [1/3, 1/3, 1/3] behaves as what type of filter?
a: A highpass filter that attenuates low frequencies.
b: A bandpass filter centered at ω = π.
c: A lowpass filter that attenuates high frequencies.
d: An allpass filter with unity magnitude at all frequencies.
answer: c
explanation: The moving average filter averages neighboring samples, which smooths out rapid fluctuations (high frequencies) while preserving slow variations (low frequencies). Its frequency response is H(e^{jω}) = (1/3)(1 + e^{-jω} + e^{-2jω}), which has maximum magnitude at ω=0 (DC) and nulls at ω = ±2π/3. Option (a) is the opposite behavior. Option (b) is wrong — there is no passband centered at π. Option (d) is wrong because |H| clearly varies with ω.
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
A Gaussian is its own Fourier transform. Let's verify $\\mathcal{F}\\{e^{-t^2}\\} = \\sqrt{\\pi}e^{-\\pi^2 f^2}$.
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
    keyFormulas: `## Week 4 Key Formulas

No specific formulas are listed.`
  },
  // ══════════════════════
  {
    id: 5,
    title: 'Z-Transform',
    bigPicture: `## The General Tool for Discrete Systems

The DTFT evaluates signals on the **unit circle** ($|z|=1$). The **Z-transform** generalizes this to the entire complex plane:

$$X(z) = \\sum_{n=-\\infty}^{\\infty} x[n] \\, z^{-n}$$

When you set $z = e^{j\\omega}$, you get back the DTFT. But the Z-transform is more powerful — it lets us analyze **stability** (are all poles inside the unit circle?) and design **transfer functions** $H(z)$.

> **Connection**: The Z-transform is to discrete systems what the Laplace transform is to continuous systems. It converts difference equations into algebraic equations.`,

    concepts: [
      {
        name: 'Z-Transform & ROC',
        explanation: `### Definition and Region of Convergence

$$X(z) = \\sum_{n=-\\infty}^{\\infty} x[n] z^{-n}$$

The **Region of Convergence (ROC)** is the set of $z$ values where the sum converges. The ROC determines which signal the Z-transform corresponds to!

**Common pairs**:
- $a^n u[n] \\leftrightarrow \\frac{1}{1-az^{-1}}$, ROC: $|z| > |a|$
- $-a^n u[-n-1] \\leftrightarrow \\frac{1}{1-az^{-1}}$, ROC: $|z| < |a|$

Same formula, different ROC → different signal! The ROC is essential.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Z-transform of x[n] = (0.8)^n u[n]
# X(z) = 1/(1 - 0.8*z^{-1}), ROC: |z| > 0.8

a = 0.8
n = np.arange(0, 30)
x = a**n  # causal exponential

# Verify: DTFT is Z-transform on unit circle
omega = np.linspace(-np.pi, np.pi, 500)
z = np.exp(1j * omega)
X_z = 1 / (1 - a * z**(-1))  # closed-form

# Compare with direct DTFT computation
X_dtft = np.zeros(len(omega), dtype=complex)
for ni in range(len(x)):
    X_dtft += x[ni] * np.exp(-1j * omega * ni)

plt.figure(figsize=(10, 4))
plt.plot(omega/np.pi, np.abs(X_z), 'b-', label='Z-transform on unit circle')
plt.plot(omega/np.pi, np.abs(X_dtft), 'r--', label='Direct DTFT')
plt.title('Z-transform evaluated on unit circle = DTFT')
plt.xlabel('ω/π')
plt.legend()
plt.show()
\`\`\``
      },
      {
        name: 'Transfer Function H(z)',
        explanation: `### From Difference Equation to Transfer Function

A difference equation like:
$$y[n] = b_0 x[n] + b_1 x[n-1] - a_1 y[n-1]$$

becomes, after Z-transform:
$$Y(z) = b_0 X(z) + b_1 z^{-1} X(z) - a_1 z^{-1} Y(z)$$

$$H(z) = \\frac{Y(z)}{X(z)} = \\frac{b_0 + b_1 z^{-1}}{1 + a_1 z^{-1}}$$

The **poles** (roots of denominator) determine stability: system is stable if **all poles are inside the unit circle**.
The **zeros** (roots of numerator) determine which frequencies are blocked.

\`\`\`python
import numpy as np

# Transfer function: H(z) = (1 + 0.5z^{-1}) / (1 - 0.8z^{-1})
b = [1, 0.5]    # numerator coefficients
a = [1, -0.8]   # denominator coefficients

zeros = np.roots(b)
poles = np.roots(a)

print(f"Zeros: {zeros}")
print(f"Poles: {poles}")
print(f"Stable? {all(np.abs(poles) < 1)}")  # All poles inside unit circle?
\`\`\``
      },
      {
        name: 'Inverse Z-Transform',
        explanation: `### Getting Back to Time Domain

The most common method: **partial fraction decomposition**.

Given $X(z) = \\frac{z}{(z-0.5)(z-0.8)}$, decompose:

$$\\frac{X(z)}{z} = \\frac{1}{(z-0.5)(z-0.8)} = \\frac{A}{z-0.5} + \\frac{B}{z-0.8}$$

Find $A$ and $B$, then use the known pair $\\frac{z}{z-a} \\leftrightarrow a^n u[n]$.

\`\`\`python
import numpy as np
from numpy.polynomial import polynomial as P

# Partial fraction decomposition using residues
# H(z) = z / ((z - 0.5)(z - 0.8))
# scipy.signal has tools for this
from scipy.signal import residuez

b = [1, 0]          # numerator: z
a = [1, -1.3, 0.4]  # denominator: z^2 - 1.3z + 0.4 = (z-0.5)(z-0.8)

r, p, k = residuez(b, a)
print("Residues:", r)
print("Poles:", p)
print("Direct term:", k)
# x[n] = r[0]*p[0]^n + r[1]*p[1]^n  for n >= 0
\`\`\``
      },
    ],

    homeworkGuide: `## 📝 Homework 5 Solutions

### 📌 Problem 1: Sampling and Reconstruction of a Continuous Signal
Diagrammatically, the process involves two main stages: Analog-to-Digital (Sampling) and Digital-to-Analog (Reconstruction).

1. **Continuous Signal $x(t)$**: The original analog signal.
2. **Ideal C/D Converter (Multiplier)**: Multiplies $x(t)$ by an impulse train $s(t) = \\sum_{n=-\\infty}^{\\infty} \\delta(t - nT_s)$, where $T_s$ is the sampling period.
3. **Sampled Signal $x_p(t)$**: The result is a discrete sequence of impulses $x_p(t) = \\sum_{n=-\\infty}^{\\infty} x(nT_s) \\delta(t - nT_s)$.
4. **Ideal D/C Converter (Low-pass Filter)**: To reconstruct, $x_p(t)$ is passed through an ideal brick-wall low-pass filter with a cutoff frequency $f_c = f_s / 2$.
5. **Reconstructed Signal $\\hat{x}(t)$**: The filter interpolates the samples using a sum of scaled sinc functions, yielding the continuous signal $\\hat{x}(t)$. If Nyquist is satisfied, $\\hat{x}(t) = x(t)$.

### 📌 Problem 2: Condition for Reconstructibility
A continuous signal $x(t)$ can be exactly reconstructed from its discrete-time samples if it is strictly bandlimited to some maximum frequency $f_{max}$ (i.e., $X(f) = 0$ for $|f| > f_{max}$), and the sampling rate $f_s$ satisfies the **Nyquist-Shannon Sampling Theorem**:
$$f_s > 2 f_{max}$$
or equivalently, $T_s < \\frac{1}{2 f_{max}}$.

\`\`\`quiz
question: According to the Nyquist-Shannon Sampling Theorem, if a signal contains frequencies up to 10 kHz, what is the absolute minimum sampling rate required for exact reconstruction?
a: 5 kHz
b: 10 kHz
c: 20 kHz
d: 40 kHz
answer: c
\`\`\`

### 📌 Problem 3: Antialiasing Filter and its Role
An **antialiasing filter** is an analog low-pass filter placed *before* the sampling stage.
- **Role & Benefits**: It restricts the bandwidth of the continuous signal so that $f_{max} < f_s / 2$. By attenuating frequencies above the Nyquist frequency, it prevents **aliasing**—a phenomenon where high-frequency components "fold back" into the baseband and irreversibly corrupt the sampled signal.
- **Limitations**: Ideal "brick-wall" filters are physically unrealizable. Real filters have a finite transition band (roll-off) and introduce phase distortions. Because the cutoff isn't perfectly sharp, one must either sample at a higher rate (oversampling) or accept some residual aliasing and signal attenuation near the cutoff frequency.

### 📌 Problem 4: Python Script for Sampling Process Demonstration
Below is the complete, runnable Python script that addresses all sub-questions (a) through (e).

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from numpy.fft import fft, ifft, fftfreq, fftshift

# General Setup
dt = 0.001          # Fine time step simulating continuous time
fs_sim = 1 / dt     # Simulation sampling frequency
N = 4096            # Number of points
f0 = 5.0            # Max frequency of our parabola

# --- (a) Create and represent the continuous function spectrum X(f) ---
f = fftfreq(N, dt)
X_f = np.zeros(N)
# X(f) = f0^2 - f^2 for |f| < f0
mask = np.abs(f) < f0
X_f[mask] = f0**2 - f[mask]**2

plt.figure(figsize=(12, 4))
plt.plot(fftshift(f), fftshift(X_f), 'b', label="$X(f)$")
plt.title("(a) Parabolic Spectrum $X(f)$")
plt.xlabel("Frequency (Hz)")
plt.xlim(-10, 10)
plt.grid(True); plt.legend()
plt.show()

# --- (b) Compute and represent the x(t) signal ---
x_t = fs_sim * np.real(ifft(X_f))

# Explicitly create a properly shifted time vector
t_shifted = np.arange(-N//2, N//2) * dt
x_t_shifted = fftshift(x_t)

plt.figure(figsize=(12, 4))
plt.plot(t_shifted, x_t_shifted, 'k', label="$x(t)$")
plt.title("(b) Continuous Signal $x(t)$")
plt.xlabel("Time (s)")
plt.xlim(-1, 1)
plt.grid(True); plt.legend()
plt.show()

# --- (c) Demonstrate the sampling process ---
fs_samp = 8.0 
m = int(fs_sim / fs_samp) 
Ts = dt * m

# Offset the slice to ensure we grab the exact center peak at t=0
offset = (N // 2) % m
x_sampled = x_t_shifted[offset::m]
t_sampled = t_shifted[offset::m]

plt.figure(figsize=(12, 4))
plt.plot(t_shifted, x_t_shifted, 'k', alpha=0.3, label="Continuous $x(t)$")
plt.stem(t_sampled, x_sampled, linefmt='r-', markerfmt='ro', basefmt=" ", label="Sampled Signal")
plt.title(f"(c) Sampled Signal (fs = {fs_samp} Hz)")
plt.xlabel("Time (s)")
plt.xlim(-1, 1)
plt.grid(True); plt.legend()
plt.show()

# --- (d) Compute the Fourier transform of the sampled signal ---
X_sampled_f = fft(x_sampled)
f_samp = fftfreq(len(x_sampled), Ts)

plt.figure(figsize=(12, 4))
plt.plot(fftshift(f_samp), fftshift(np.abs(X_sampled_f)) * Ts, 'r', label="Sampled Spectrum")
plt.title("(d) Fourier Transform of Sampled Signal (Notice Aliasing)")
plt.xlabel("Frequency (Hz)")
plt.grid(True); plt.legend()
plt.show()

# --- (e) Reconstruct the original signal ---
def whittaker_shannon_interp(x_s, t_s, t_eval, T_samp):
    x_rec = np.zeros(len(t_eval))
    for n, val in enumerate(x_s):
        x_rec += val * np.sinc((t_eval - t_s[n]) / T_samp)
    return x_rec

x_reconstructed = whittaker_shannon_interp(x_sampled, t_sampled, t_shifted, Ts)

plt.figure(figsize=(12, 4))
plt.plot(t_shifted, x_t_shifted, 'k', alpha=0.4, label="Original $x(t)$")
plt.plot(t_shifted, x_reconstructed, 'g--', label="Reconstructed Signal")
plt.title(f"(e) Reconstruction (Incomplete since $f_0={5.0}$ Hz > $f_s/2={4.0}$ Hz)")
plt.xlabel("Time (s)")
plt.xlim(-1, 1)
plt.grid(True); plt.legend()
plt.show()
\`\`\`

### 📌 Problem 5: Uniform Sampling Leads to a Periodic Fourier Transform
Let $x_p(t)$ be the sampled signal, formed by multiplying $x(t)$ with an impulse train $s(t)$:
$$x_p(t) = x(t) \\sum_{n=-\\infty}^{\\infty} \\delta(t - nT_s)$$
Multiplication in the time domain corresponds to convolution in the frequency domain. The Fourier transform of $s(t)$ is:
$$S(f) = \\frac{1}{T_s} \\sum_{k=-\\infty}^{\\infty} \\delta(f - kf_s)$$
where $f_s = 1/T_s$. Convolving $X(f)$ with $S(f)$ yields:
$$X_p(f) = X(f) * S(f) = \\frac{1}{T_s} \\sum_{k=-\\infty}^{\\infty} X(f - kf_s)$$
Since $X_p(f)$ consists of infinite shifted replicas of $X(f)$ spaced by $f_s$, shifting the entire sum by $m f_s$ (where $m$ is an integer) does not change the result:
$$X_p(f - mf_s) = \\frac{1}{T_s} \\sum_{k=-\\infty}^{\\infty} X(f - (k+m)f_s) = X_p(f)$$
Thus, the Fourier transform of uniformly sampled data is periodic.

### 📌 Problem 6: Period of the Fourier Transform of a Sampled Signal
As demonstrated in Problem 5, the period of the Fourier transform $X_p(f)$ is precisely the sampling frequency $f_s$ (or $\\omega_s = \\frac{2\\pi}{T_s}$ in angular frequency).

### 📌 Problem 7: A Periodic Signal has a Sampled Fourier Transform
Let $x(t)$ be a periodic signal with fundamental period $T_0$. We can express it as a Fourier series:
$$x(t) = \\sum_{k=-\\infty}^{\\infty} c_k e^{j 2\\pi k f_0 t}$$
where $f_0 = 1/T_0$ is the fundamental frequency.
Taking the continuous Fourier transform of both sides yields:
$$X(f) = \\sum_{k=-\\infty}^{\\infty} c_k \\delta(f - k f_0)$$
This equation shows that $X(f)$ consists solely of Dirac delta functions spaced $f_0$ apart. It is effectively zero everywhere except at discrete multiples of $f_0$. Thus, the Fourier transform of a periodic signal is discrete (sampled).

### 📌 Problem 8: Sampling Period of the Fourier Transform of a Periodic Signal
The sampling period (or distance between impulses) in the frequency domain is $f_0 = \\frac{1}{T_0}$, where $T_0$ is the fundamental period of the time-domain signal.

### 📌 Problem 9: Derivation of the Discrete Fourier Transform (DFT) and Inverse (IDFT)
Let $x(t)$ be an $NT$-periodic signal. When sampled every $T$ seconds, the discrete sequence $x[n] = x(nT)$ is $N$-periodic.
The continuous periodic signal can be represented by a discrete Fourier series. Since the sequence only contains $N$ independent samples per period, there are exactly $N$ distinct frequency components.
We define the synthesis equation (IDFT) as a sum over $N$ frequencies:
$$x[n] = \\frac{1}{N} \\sum_{k=0}^{N-1} X[k] e^{j \\frac{2\\pi}{N} k n}$$
To find $X[k]$, we multiply both sides by $e^{-j \\frac{2\\pi}{N} m n}$ and sum over one period $n=0$ to $N-1$:
$$\\sum_{n=0}^{N-1} x[n] e^{-j \\frac{2\\pi}{N} m n} = \\sum_{n=0}^{N-1} \\left( \\frac{1}{N} \\sum_{k=0}^{N-1} X[k] e^{j \\frac{2\\pi}{N} k n} \\right) e^{-j \\frac{2\\pi}{N} m n}$$
Rearranging the summations:
$$= \\frac{1}{N} \\sum_{k=0}^{N-1} X[k] \\sum_{n=0}^{N-1} e^{j \\frac{2\\pi}{N} (k - m) n}$$
Using the orthogonality property proved in Problem 12, the inner sum is $N$ only when $k=m$, and $0$ otherwise.
$$= \\frac{1}{N} X[m] (N) = X[m]$$
Replacing $m$ with $k$ gives the DFT equation:
$$X[k] = \\sum_{n=0}^{N-1} x[n] e^{-j \\frac{2\\pi}{N} k n}$$

### 📌 Problem 10: Frequency Resolution of the DFT
For an $N$-point DFT of a signal sampled at an interval $T$, the frequency resolution (the spacing between consecutive frequency bins) is given by:
$$\\Delta f = \\frac{f_s}{N} = \\frac{1}{NT}$$

### 📌 Problem 11: Frequency Limits (Min/Max) of the DFT
For a $T$-sampled signal using an $N$-point DFT:
- **Minimum measurable non-DC frequency**: $\\Delta f = \\frac{1}{NT}$
- **Maximum frequency (Nyquist Limit)**: $f_{max} = \\frac{f_s}{2} = \\frac{1}{2T}$
Overall, the standard DFT frequency bins span from $0$ up to $f_s - \\Delta f$. Due to periodicity and aliasing, the upper half of the bins ($N/2$ to $N-1$) correspond to negative frequencies from $-\\frac{1}{2T}$ to $-\\Delta f$.

### 📌 Problem 12: Proof of Exponential Sum Orthogonality
We need to evaluate the sum $S = \\sum_{k=0}^{N-1} e^{j \\frac{2\\pi (m-n)}{N} k}$.
Let $l = m - n$. The sum becomes $S = \\sum_{k=0}^{N-1} \\left( e^{j \\frac{2\\pi l}{N}} \\right)^k$.

**Case 1: $m = n$**
$l = 0$, meaning the common ratio is $e^0 = 1$.
$$S = \\sum_{k=0}^{N-1} 1 = N$$

**Case 2: $m \\neq n$** (assuming $|m-n| < N$)
This is a geometric series $\\sum_{k=0}^{N-1} r^k = \\frac{1 - r^N}{1 - r}$, with $r = e^{j \\frac{2\\pi l}{N}}$.
$$S = \\frac{1 - \\left( e^{j \\frac{2\\pi l}{N}} \\right)^N}{1 - e^{j \\frac{2\\pi l}{N}}} = \\frac{1 - e^{j 2\\pi l}}{1 - e^{j \\frac{2\\pi l}{N}}}$$
Since $l = m-n$ is a non-zero integer, $e^{j 2\\pi l} = \\cos(2\\pi l) + j\\sin(2\\pi l) = 1$.
The numerator is $1 - 1 = 0$. Since $|l| < N$, $r \\neq 1$, so the denominator is non-zero.
Thus, $S = 0$.

### 📌 Problem 13: Test Restoring Original Signal via DFT and IDFT
We start with the IDFT formula and substitute the DFT definition into it to verify it returns $x[n]$.
$$x[n] = \\frac{1}{N} \\sum_{k=0}^{N-1} X[k] e^{j \\frac{2\\pi}{N} k n}$$
Substitute $X[k] = \\sum_{m=0}^{N-1} x[m] e^{-j \\frac{2\\pi}{N} k m}$:
$$x[n] = \\frac{1}{N} \\sum_{k=0}^{N-1} \\left( \\sum_{m=0}^{N-1} x[m] e^{-j \\frac{2\\pi}{N} k m} \\right) e^{j \\frac{2\\pi}{N} k n}$$
Swap the order of summation:
$$x[n] = \\frac{1}{N} \\sum_{m=0}^{N-1} x[m] \\left( \\sum_{k=0}^{N-1} e^{j \\frac{2\\pi}{N} k (n-m)} \\right)$$
Based on the proof in Problem 12, the inner sum equals $N$ when $n=m$ and $0$ otherwise. Thus, the outer sum collapses to a single non-zero term where $m=n$:
$$x[n] = \\frac{1}{N} x[n] (N) = x[n]$$
This proves that applying the DFT and its inverse perfectly restores the original sampled sequence.

---

## 🔬 Lab 05 Walkthrough: Sampling and Reconstruction Code

This section conceptually breaks down the provided Python script to demonstrate the mathematics of the Whittaker-Shannon interpolation formula.

### 1. Setup & High-Resolution Frequency Domain
\`\`\`python
dt = 0.001 
fs = 1/dt # resolution of the 'continuous' signal
fmax = 4.0 # maximum frequency (half width of the triangle)
N = 4096 # the size of our 'continuous' signal: N points, i.e. N*T long
\`\`\`
We define a highly resolute temporal grid (\`dt = 0.001\`) to emulate a continuous analog signal on a digital computer.

### 2. Creating the Triangular Spectrum
\`\`\`python
f = fftfreq(N, dt)
X = zeros(N)
X[abs(f) <= fmax] = (1 - abs(f)/fmax)[abs(f) <= fmax] # triangle shape
\`\`\`
We use \`numpy.fft.fftfreq\` to generate the frequency axis. We then explicitly create a bounded, bandlimited triangular spectrum $X(f)$ which exists strictly within $|f| \\leq 4.0$ Hz. This perfectly limits $f_{max}$, satisfying the preconditions for the Nyquist theorem.

### 3. Transforming to the Time Domain
\`\`\`python
# get the signal as inverse Fourier transform
x = fs*real(ifft(X)) # N*(fs/N)*ifft(X)
t = fftfreq(N, fs/N)
\`\`\`
Using the Inverse Fast Fourier Transform (\`ifft\`), we convert $X(f)$ back into an analog time-domain signal $x(t)$. We scale the result by \`fs\` to maintain mathematical equivalence with the continuous Fourier transform amplitude scaling.

### 4. The Sampling Process (Decimation)
\`\`\`python
# Let's sample it by keeping only every 16th points
m = 16
T = dt*m # this is the sampling period
xhat  = x[::m] # sampled (discrete time) signal
tsamp = t[::m] # sampled time
\`\`\`
We simulate uniform sampling by keeping only every $16^{th}$ point of our continuous signal array. Our new physical sampling period is $T_{samp} = 0.016$ seconds, meaning our sampling frequency is roughly $62.5$ Hz. Since $62.5 > 2(4.0)$, the Nyquist requirement is easily satisfied, and aliasing is avoided.

### 5. Sinc Interpolation (Reconstruction)
\`\`\`python
def sincpi(x):
    x[x == 0] = 1e-13 # to avoid problems when dividing with it
    return sin(pi*x)/(pi*x)

Nsamp = N//m # size of the sampled signal (the same as len(xhat))
xrec = zeros(len(t)) # the reconstructed signal ('continuous')
for n in arange(-Nsamp//2, Nsamp//2):
    xrec += xhat[n]*sincpi(t/T - n)
\`\`\`
Finally, we iterate over the sampled discrete sequence \`xhat\` and multiply each point by a time-shifted continuous \`sinc\` function. When all these overlapping sinc functions are summed together across the temporal grid (\`xrec += ...\`), they perfectly blend to reconstruct our original continuous triangular-spectrum signal.


### 🧠 Knowledge Check

\`\`\`quiz
question: The Z-transform is a generalization of which other transform?
a: The Discrete Fourier Transform (DFT).
b: The Discrete-Time Fourier Transform (DTFT), evaluated along the complex plane z = r*e^{jω}.
c: The Laplace Transform for continuous-time signals.
d: The Continuous-Time Fourier Transform (CTFT).
answer: b
explanation: The Z-transform X(z) = Σx[n]z^{-n} generalizes the DTFT by allowing z to be any complex number, not just z = e^{jω}. When you restrict z to the unit circle (r=1), you recover the DTFT exactly. Option (a) is wrong because the DFT is a sampled version of the DTFT, not the parent transform. Option (c) describes the continuous-time analog of the Z-transform, but the Z-transform is not a generalization of it — they operate in different domains. Option (d) is for continuous-time signals, while the Z-transform is for discrete-time.
\`\`\`
\`\`\`quiz
question: For a causal LTI system to be Bounded-Input Bounded-Output (BIBO) stable, where must all its poles lie in the z-plane?
a: Strictly outside the unit circle (|z| > 1).
b: On the unit circle (|z| = 1).
c: Strictly inside the unit circle (|z| < 1).
d: At the origin (z = 0).
answer: c
explanation: For a causal system, the ROC extends outward from the outermost pole. For the ROC to include the unit circle (required for BIBO stability, since the DTFT must exist), all poles must satisfy |p| < 1. Option (a) would place the poles outside the ROC for a causal system, making it unstable. Option (b) means the ROC boundary touches the unit circle, leading to marginally unstable behavior (e.g., undamped oscillations). Option (d) is too restrictive — poles at z=0 correspond to pure delay elements, which is a special case.
\`\`\`
\`\`\`quiz
question: What defines the Region of Convergence (ROC) for a Z-transform?
a: The set of all values of z for which the Z-transform summation converges to a finite value.
b: The frequencies where the phase response is linear.
c: The area inside the unit circle exclusively.
d: The set of z values where the transfer function H(z) equals zero.
answer: a
explanation: The ROC is the set of complex values z for which the infinite sum Σx[n]z^{-n} converges absolutely. The ROC is critical because different signals can share the same algebraic Z-transform expression but differ only in their ROC. Option (b) is about linear phase filters, which is unrelated to convergence. Option (c) is wrong because the ROC can be inside, outside, or a ring in the z-plane depending on the signal. Option (d) describes zeros, not the ROC.
\`\`\`
\`\`\`quiz
question: Two signals share the same Z-transform expression X(z) = 1/(1 - 0.5z^{-1}), but have different ROCs. What distinguishes them?
a: They have different magnitudes but the same phase.
b: One is a right-sided (causal) signal a^n u[n] with ROC |z| > 0.5, and the other is a left-sided (anti-causal) signal -a^n u[-n-1] with ROC |z| < 0.5.
c: They are actually the same signal — the ROC does not matter.
d: They differ only in their DC values (at n=0).
answer: b
explanation: The ROC uniquely determines which time-domain signal corresponds to a given Z-transform. For X(z) = 1/(1-0.5z^{-1}), ROC: |z|>0.5 gives the causal signal (0.5)^n u[n], while ROC: |z|<0.5 gives the anti-causal signal -(0.5)^n u[-n-1]. These are completely different signals! Option (a) is wrong because they differ in their entire time-domain behavior, not just magnitude/phase. Option (c) is fundamentally wrong — the ROC is essential. Option (d) is wrong because the signals differ at all time indices.
\`\`\`
\`\`\`quiz
question: When the DFT is applied to a finite-length signal with rectangular windowing, spectral leakage occurs. What causes this leakage?
a: The sampling rate is too low, causing aliasing.
b: Truncating an infinite-duration signal with a rectangular window convolves its spectrum with a sinc function, spreading energy to adjacent frequency bins.
c: The DFT computes the wrong frequencies due to quantization error.
d: Leakage only occurs when the signal contains noise.
answer: b
explanation: Multiplying a signal by a rectangular window (i.e., observing only a finite segment) is multiplication in time, which becomes convolution with the window’s spectrum (a sinc function) in frequency. The sinc’s sidelobes spread spectral energy beyond the true frequency bins, creating leakage. Option (a) confuses aliasing (too-low sample rate) with leakage (finite observation). Option (c) is wrong — the DFT computes exact frequencies; leakage is a windowing artifact. Option (d) is wrong because leakage occurs even for perfectly clean sinusoidal signals.
\`\`\`
`,
    labWalkthrough: `

`,

    keyFormulas: `## Week 5 Key Formulas

| Formula | Description |
|---------|-------------|
| $X(z) = \\sum_{n=-\\infty}^{\\infty} x[n] z^{-n}$ | Z-Transform |
| $a^n u[n] \\leftrightarrow \\frac{1}{1-az^{-1}}, \\|z\\|>\\|a\\|$ | Key Z-transform pair |
| $H(z) = \\frac{Y(z)}{X(z)} = \\frac{B(z)}{A(z)}$ | Transfer function |
| Stable iff all poles $\\|p_i\\| < 1$ | Stability condition |
| $z = e^{j\\omega}$ gives DTFT | Z-transform on unit circle |`,
  },
];
