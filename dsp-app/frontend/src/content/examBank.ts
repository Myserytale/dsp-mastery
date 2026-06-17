export interface ExamTheoretical {
  title: string;
  problem: string;
  trap_hint: string;
  solution: string;
}

export interface ExamCoding {
  title: string;
  description: string;
  starter_code: string;
  solution_code: string;
}

export interface WeekExam {
  week: number;
  theoretical: ExamTheoretical[];
  coding: ExamCoding[];
}

export const EXAM_BANK: Record<number, WeekExam> = {
  1: {
    week: 1,
    theoretical: [
      {
        title: "System Property Analysis",
        problem: "Given the discrete-time system $y[n] = n x[n] + 2$, determine if it is: (a) Linear, (b) Time-Invariant, (c) Causal, and (d) Stable.",
        trap_hint: "Check superposition for the +2 constant bias. For time-invariance, test if shifting the input also shifts the 'n' multiplier.",
        solution: "**Step 1: Linearity Test**\n\nLet the response to $x_1[n]$ be $y_1[n] = n x_1[n] + 2$.\nLet the response to $x_2[n]$ be $y_2[n] = n x_2[n] + 2$.\nNow, apply the linear combination $x_3[n] = a x_1[n] + b x_2[n]$.\nThe system response is $y_3[n] = n(a x_1[n] + b x_2[n]) + 2 = a n x_1[n] + b n x_2[n] + 2$.\nHowever, a linear combination of the outputs is $a y_1[n] + b y_2[n] = a(n x_1[n] + 2) + b(n x_2[n] + 2) = a n x_1[n] + b n x_2[n] + 2a + 2b$.\nSince $y_3[n] \\neq a y_1[n] + b y_2[n]$ for all $a, b$, the system is **Non-linear**.\n\n**Step 2: Time-Invariance Test**\n\nLet the delayed input be $x_d[n] = x[n-k]$.\nThe output to this delayed input is $y_d[n] = n x_d[n] + 2 = n x[n-k] + 2$.\nNow, delay the original output by $k$: $y[n-k] = (n-k) x[n-k] + 2$.\nSince $y_d[n] \\neq y[n-k]$, the $n$ coefficient depends on absolute time. The system is **Time-variant**.\n\n**Step 3: Causality Test**\n\nThe output at time $n$ depends only on the input at the same time $n$ (because of $x[n]$). It does not depend on future inputs like $x[n+1]$. Therefore, the system is **Causal**.\n\n**Step 4: Stability Test (BIBO)**\n\nAssume the input is bounded, meaning $|x[n]| \\leq B_x < \\infty$ for all $n$.\nThe output is $|y[n]| = |n x[n] + 2| \\leq |n| |x[n]| + 2 \\leq |n| B_x + 2$.\nAs $n \\to \\infty$, $|y[n]| \\to \\infty$. The output grows without bound, so the system is **Unstable**."
      },
      {
        title: "Energy and Power",
        problem: "Determine the energy and average power of the signal $x[n] = \\left(\\frac{1}{2}\\right)^n u[n]$.",
        trap_hint: "Energy signals have zero average power. Use the infinite geometric series formula carefully.",
        solution: "**Step 1: Determine the Signal Type**\n\nThe signal is an exponentially decaying sequence due to the factor $(1/2)^n$ for $n \\geq 0$. We expect it to be an energy signal, meaning finite energy and zero average power.\n\n**Step 2: Calculate Total Energy $E_x$**\n\nThe definition of energy is $E_x = \\sum_{n=-\\infty}^{\\infty} |x[n]|^2$.\nSince $u[n] = 0$ for $n < 0$, we sum from $n=0$ to $\\infty$:\n$E_x = \\sum_{n=0}^{\\infty} \\left| \\left(\\frac{1}{2}\\right)^n \\right|^2 = \\sum_{n=0}^{\\infty} \\left(\\frac{1}{4}\\right)^n$\nThis is a standard infinite geometric series of the form $\\sum_{n=0}^{\\infty} a^n = \\frac{1}{1-a}$ for $|a| < 1$.\nHere, $a = 1/4$, so:\n$E_x = \\frac{1}{1 - 1/4} = \\frac{1}{3/4} = \\frac{4}{3}$ Joules.\nThe energy is finite ($E_x = 4/3 < \\infty$).\n\n**Step 3: Calculate Average Power $P_x$**\n\nThe definition of power is $P_x = \\lim_{N \\to \\infty} \\frac{1}{2N+1} \\sum_{n=-N}^{N} |x[n]|^2$.\nSince the total sum $\\sum |x[n]|^2$ converges to a finite value ($4/3$), dividing a finite number by an infinitely growing denominator ($2N+1$) yields zero.\n$P_x = \\lim_{N \\to \\infty} \\frac{4/3}{2N+1} = 0$.\n\n**Conclusion:** The signal has an energy of $4/3$ and an average power of $0$."
      }
    ],
    coding: [
      {
        title: "Signal Generation and Verification",
        description: "Write a script to generate 50 samples of the signal $x[n] = e^{-0.1n} \\sin(0.2\\pi n) u[n]$ and compute its empirical energy.",
        starter_code: "import numpy as np\n# Generate n from 0 to 49\nn = np.arange(50)\n# Compute x\nx = np.zeros_like(n, dtype=float)\n",
        solution_code: "import numpy as np\n\n# Generate time indices\nn = np.arange(50)\n\n# Compute the signal elements\n# The unit step u[n] is 1 for all generated indices since n >= 0\nx = np.exp(-0.1 * n) * np.sin(0.2 * np.pi * n)\n\n# Compute the energy (sum of squared magnitudes)\nenergy = np.sum(np.abs(x)**2)\n\nprint(f\"Computed Energy over 50 samples: {energy:.4f}\")\n"
      }
    ]
  },
  2: {
    week: 2,
    theoretical: [
      {
        title: "Linear Convolution Sum",
        problem: "Compute the linear convolution $y[n] = x[n] * h[n]$ where $x[n] = \\{1, 2, -1\\}$ and $h[n] = \\{2, 1\\}$. The origin (n=0) is the first element for both.",
        trap_hint: "Determine the output length first: L_y = L_x + L_h - 1. Then use the sliding window or polynomial multiplication method.",
        solution: "**Step 1: Determine the lengths and ranges**\n\nLength of $x[n]$ is $L_x = 3$. Elements are at $n = 0, 1, 2$.\nLength of $h[n]$ is $L_h = 2$. Elements are at $n = 0, 1$.\nThe length of the output $y[n]$ is $L_y = L_x + L_h - 1 = 3 + 2 - 1 = 4$.\nThe output will be defined for $n = 0$ to $n = 3$.\n\n**Step 2: Apply the Convolution Formula**\n\n$y[n] = \\sum_{k=0}^{n} x[k] h[n-k]$\nLet's calculate each term individually:\n\nFor $n=0$: $y[0] = x[0]h[0] = (1)(2) = 2$\nFor $n=1$: $y[1] = x[0]h[1] + x[1]h[0] = (1)(1) + (2)(2) = 1 + 4 = 5$\nFor $n=2$: $y[2] = x[0]h[2] + x[1]h[1] + x[2]h[0]$. Since $h[2] = 0$, $y[2] = (2)(1) + (-1)(2) = 2 - 2 = 0$\nFor $n=3$: $y[3] = x[1]h[2] + x[2]h[1] + x[3]h[0]$. Here $h[2]=0$ and $x[3]=0$, so $y[3] = (-1)(1) = -1$\n\n**Step 3: Final Output Sequence**\n\nThe resulting sequence is $y[n] = \\{2, 5, 0, -1\\}$ for $n \\in [0, 3]$."
      },
      {
        title: "Properties of Convolution",
        problem: "Prove that the convolution operator is commutative: $x[n] * h[n] = h[n] * x[n]$.",
        trap_hint: "Start with the sum definition $\\sum x[k]h[n-k]$ and use a change of variables $m = n-k$.",
        solution: "**Step 1: State the Definition**\n\nThe discrete linear convolution of two sequences is defined as:\n$y[n] = x[n] * h[n] = \\sum_{k=-\\infty}^{\\infty} x[k] h[n-k]$\n\n**Step 2: Change of Variables**\n\nTo prove commutativity, we need to show this sum is equivalent to $\\sum h[m] x[n-m]$.\nLet's introduce a new summation index $m = n - k$.\nFrom this, we can express $k$ in terms of $m$: $k = n - m$.\n\n**Step 3: Evaluate Summation Limits**\n\nAs $k \\to \\infty$, $m = n - \\infty \\to -\\infty$.\nAs $k \\to -\\infty$, $m = n - (-\\infty) \\to \\infty$.\nThe limits of summation simply flip, covering the same infinite range $(-\\infty, \\infty)$.\n\n**Step 4: Substitute and Reorder**\n\nSubstitute $m$ into the summation:\n$y[n] = \\sum_{m=\\infty}^{-\\infty} x[n-m] h[m]$\nSince the order of summation for an absolutely convergent series doesn't matter, we rewrite it from $-\\infty$ to $\\infty$:\n$y[n] = \\sum_{m=-\\infty}^{\\infty} h[m] x[n-m]$\nThis matches the exact definition of $h[n] * x[n]$. Thus, the convolution is commutative."
      }
    ],
    coding: [
      {
        title: "Matrix Method for Convolution",
        description: "Implement the linear convolution of $x=[1, 2, 3]$ and $h=[4, 5, 6]$ by constructing a Toeplitz convolution matrix from $h$ and multiplying it by the column vector $x$.",
        starter_code: "import numpy as np\nfrom scipy.linalg import toeplitz\nx = np.array([1, 2, 3])\nh = np.array([4, 5, 6])\n# Create the Toeplitz matrix and multiply\n",
        solution_code: "import numpy as np\nfrom scipy.linalg import toeplitz\n\nx = np.array([1, 2, 3])\nh = np.array([4, 5, 6])\n\n# L_y = L_x + L_h - 1 = 3 + 3 - 1 = 5\n# Pad h with zeros to length L_y for the first column of the Toeplitz matrix\nc = np.pad(h, (0, len(x) - 1))\n\n# The first row of the Toeplitz matrix has h[0] followed by zeros\nr = np.zeros(len(x))\nr[0] = h[0]\n\n# Construct the convolution matrix\nH_matrix = toeplitz(c, r)\n\n# Compute the convolution using matrix-vector multiplication\ny = H_matrix.dot(x)\n\nprint(\"Convolution Matrix H:\")\nprint(H_matrix)\nprint(\"Resulting y:\", y)\n"
      }
    ]
  },
  3: {
    week: 3,
    theoretical: [
      {
        title: "Fourier Series Expansion",
        problem: "Find the Continuous-Time Fourier Series (CTFS) coefficients $c_k$ for a periodic rectangular pulse train $x(t)$ with period $T=2$ and pulse width $\\tau = 1$ centered at $t=0$ (amplitude 1).",
        trap_hint: "The function is even, so expect the imaginary parts of $c_k$ to be zero (resulting in a real sinc function).",
        solution: "**Step 1: Define the Signal and Fundamental Frequency**\n\nThe signal $x(t) = 1$ for $-0.5 \\leq t \\leq 0.5$ and $x(t) = 0$ for $0.5 < |t| \\leq 1$, repeating every $T=2$.\nThe fundamental angular frequency is $\\omega_0 = \\frac{2\\pi}{T} = \\pi$.\n\n**Step 2: Calculate the DC Component ($c_0$)**\n\n$c_0 = \\frac{1}{T} \\int_{-T/2}^{T/2} x(t) dt$\n$c_0 = \\frac{1}{2} \\int_{-0.5}^{0.5} 1 dt = \\frac{1}{2} [t]_{-0.5}^{0.5} = \\frac{1}{2} (0.5 - (-0.5)) = 0.5$.\nThe DC component is the average value, which is 0.5.\n\n**Step 3: Calculate the $k$-th Harmonic ($c_k$)**\n\n$c_k = \\frac{1}{T} \\int_{-T/2}^{T/2} x(t) e^{-jk\\omega_0 t} dt$\n$c_k = \\frac{1}{2} \\int_{-0.5}^{0.5} e^{-jk\\pi t} dt$\n$= \\frac{1}{2} \\left[ \\frac{e^{-jk\\pi t}}{-jk\\pi} \\right]_{-0.5}^{0.5}$\n$= \\frac{-1}{j2k\\pi} (e^{-jk\\pi/2} - e^{jk\\pi/2})$\nUsing Euler's identity $\\sin(\\theta) = \\frac{e^{j\\theta} - e^{-j\\theta}}{2j}$, we can rewrite the terms:\n$= \\frac{1}{k\\pi} \\frac{e^{jk\\pi/2} - e^{-jk\\pi/2}}{2j} = \\frac{\\sin(k\\pi/2)}{k\\pi}$\n\n**Step 4: Final Expression**\n\nThe Fourier coefficients are $c_k = \\frac{\\sin(k\\pi/2)}{k\\pi}$ for $k \\neq 0$, and $c_0 = 0.5$. Notice that this can be written using the $\\text{sinc}$ function: $c_k = 0.5 \\text{sinc}(k/2)$, where $\\text{sinc}(x) = \\sin(\\pi x)/(\\pi x)$."
      },
      {
        title: "Parseval's Theorem",
        problem: "Using Parseval's Theorem, determine the total power of the signal $x(t) = 2 + 4\\cos(3t) + 6\\sin(5t)$.",
        trap_hint: "Parseval's theorem in terms of power states that total power is the sum of the squared magnitudes of the complex Fourier coefficients. Alternatively, for real sinusoids, use the RMS power formula.",
        solution: "**Step 1: Understand Parseval's Theorem for Power**\n\nParseval's theorem states that the average power in the time domain equals the sum of the power in all frequency components:\n$P = \\sum_{k=-\\infty}^{\\infty} |c_k|^2$\nAlternatively, for a signal expressed as a trigonometric Fourier series $x(t) = A_0 + \\sum_{n=1}^{\\infty} (A_n \\cos(n\\omega_0 t) + B_n \\sin(n\\omega_0 t))$, the power is:\n$P = A_0^2 + \\frac{1}{2}\\sum_{n=1}^{\\infty} (A_n^2 + B_n^2)$.\n\n**Step 2: Identify the Components**\n\nThe signal is $x(t) = 2 + 4\\cos(3t) + 6\\sin(5t)$.\n- DC Component: $A_0 = 2$. Power $= 2^2 = 4$.\n- First Harmonic Component: $4\\cos(3t)$. Power $= \\frac{4^2}{2} = \\frac{16}{2} = 8$.\n- Second Harmonic Component: $6\\sin(5t)$. Power $= \\frac{6^2}{2} = \\frac{36}{2} = 18$.\n\n**Step 3: Sum the Power**\n\nTotal Power $P = 4 + 8 + 18 = 30$ Watts.\n\n**Verification using Complex Coefficients:**\n$x(t) = 2 + 2e^{j3t} + 2e^{-j3t} - 3je^{j5t} + 3je^{-j5t}$\nCoefficients: $c_0 = 2$, $c_1 = 2$, $c_{-1} = 2$, $c_2 = -3j$, $c_{-2} = 3j$.\n$|c_0|^2 = 4$\n$|c_1|^2 + |c_{-1}|^2 = 4 + 4 = 8$\n$|c_2|^2 + |c_{-2}|^2 = 9 + 9 = 18$\nTotal $= 4 + 8 + 18 = 30$. Matches perfectly!"
      }
    ],
    coding: [
      {
        title: "Gibbs Phenomenon",
        description: "Write a script to reconstruct a square wave from its first 5, 20, and 100 harmonics. Observe the overshoot (Gibbs phenomenon) at the discontinuities.",
        starter_code: "import numpy as np\nimport matplotlib.pyplot as plt\nt = np.linspace(-1, 1, 1000)\n# Construct harmonics here\n",
        solution_code: "import numpy as np\nimport matplotlib.pyplot as plt\n\nt = np.linspace(-1, 1, 1000)\n\ndef square_wave(harmonics):\n    # DC component is 0 for a standard symmetric square wave\n    x = np.zeros_like(t)\n    for k in range(1, harmonics * 2, 2):  # Only odd harmonics\n        # Coefficient is 4/(pi * k)\n        x += (4 / (np.pi * k)) * np.sin(k * np.pi * t)\n    return x\n\nplt.figure(figsize=(10, 6))\nplt.plot(t, square_wave(5), label='5 Harmonics')\nplt.plot(t, square_wave(20), label='20 Harmonics')\nplt.plot(t, square_wave(100), label='100 Harmonics', alpha=0.7)\nplt.title(\"Gibbs Phenomenon in Fourier Series\")\nplt.xlabel(\"Time\")\nplt.ylabel(\"Amplitude\")\nplt.grid(True)\nplt.legend()\nplt.show()\n# Observation: The overshoot amplitude near the edges (~9%) does not disappear, it only gets narrower.\n"
      }
    ]
  },
  4: {
    week: 4,
    theoretical: [
      {
        title: "DTFT Evaluation",
        problem: "Compute the Discrete-Time Fourier Transform (DTFT) of the sequence $x[n] = a^n u[n]$ for $|a| < 1$.",
        trap_hint: "Use the definition of the DTFT and the infinite geometric series sum formula. Make sure to specify the convergence condition.",
        solution: "**Step 1: Apply the DTFT Definition**\n\nThe DTFT is defined as $X(e^{j\\omega}) = \\sum_{n=-\\infty}^{\\infty} x[n] e^{-j\\omega n}$.\nSubstitute the given signal $x[n] = a^n u[n]$:\n$X(e^{j\\omega}) = \\sum_{n=-\\infty}^{\\infty} a^n u[n] e^{-j\\omega n}$\n\n**Step 2: Adjust Summation Limits**\n\nBecause $u[n]$ is the unit step sequence ($0$ for $n<0$, $1$ for $n\\geq 0$), the summation limits change to $0$ to $\\infty$:\n$X(e^{j\\omega}) = \\sum_{n=0}^{\\infty} a^n e^{-j\\omega n} = \\sum_{n=0}^{\\infty} (a e^{-j\\omega})^n$\n\n**Step 3: Evaluate the Geometric Series**\n\nThis is an infinite geometric series of the form $\\sum_{n=0}^{\\infty} r^n = \\frac{1}{1-r}$, which converges strictly if $|r| < 1$.\nHere, $r = a e^{-j\\omega}$. The magnitude is $|r| = |a| |e^{-j\\omega}| = |a| \\cdot 1 = |a|$.\nWe are given that $|a| < 1$, so the series converges.\nApplying the sum formula:\n$X(e^{j\\omega}) = \\frac{1}{1 - a e^{-j\\omega}}$\n\n**Step 4: Magnitude and Phase**\n\nTo find the magnitude $|X(e^{j\\omega})|$:\n$|X(e^{j\\omega})| = \\frac{1}{|1 - a\\cos\\omega + ja\\sin\\omega|} = \\frac{1}{\\sqrt{(1 - a\\cos\\omega)^2 + (a\\sin\\omega)^2}}$\n$= \\frac{1}{\\sqrt{1 - 2a\\cos\\omega + a^2\\cos^2\\omega + a^2\\sin^2\\omega}} = \\frac{1}{\\sqrt{1 - 2a\\cos\\omega + a^2}}$\nThis provides the complete frequency response envelope of the decaying exponential."
      },
      {
        title: "Nyquist Sampling Theorem",
        problem: "A continuous-time signal $x(t) = \\cos(100\\pi t) + \\sin(300\\pi t)$ is sampled at a rate of $f_s = 200$ Hz. Determine the resulting discrete-time signal and identify any aliasing.",
        trap_hint: "Convert continuous frequencies to discrete frequencies using $\\omega = 2\\pi f / f_s$. Check if any $\\omega$ exceeds $\\pi$.",
        solution: "**Step 1: Identify Continuous Frequencies**\n\nThe signal has two components:\n- $f_1 = 100\\pi / 2\\pi = 50$ Hz\n- $f_2 = 300\\pi / 2\\pi = 150$ Hz\nThe maximum frequency is $f_{max} = 150$ Hz. According to Nyquist, we need $f_s > 300$ Hz to avoid aliasing. Since $f_s = 200$ Hz, aliasing will definitely occur for the second component.\n\n**Step 2: Sample the Signal**\n\nReplace $t$ with $nT_s = n/f_s = n/200$:\n$x[n] = x(n/200) = \\cos\\left(100\\pi \\frac{n}{200}\\right) + \\sin\\left(300\\pi \\frac{n}{200}\\right)$\n$x[n] = \\cos\\left(\\frac{\\pi}{2} n\\right) + \\sin\\left(\\frac{3\\pi}{2} n\\right)$\n\n**Step 3: Address Aliasing**\n\nIn discrete time, frequencies are periodic every $2\\pi$. The principal range is $[-\\pi, \\pi]$.\nThe first component has $\\omega_1 = \\pi/2$. This is inside $[-\\pi, \\pi]$, so no aliasing. It remains $\\cos(\\frac{\\pi}{2} n)$.\n\nThe second component has $\\omega_2 = 3\\pi/2$. This is outside the principal range (it exceeds $\\pi$).\nWe find its alias by subtracting $2\\pi$ until it falls in the range:\n$\\omega_{2,alias} = \\frac{3\\pi}{2} - 2\\pi = -\\frac{\\pi}{2}$.\n\nSo, $\\sin(\\frac{3\\pi}{2} n) = \\sin(-\\frac{\\pi}{2} n) = -\\sin(\\frac{\\pi}{2} n)$.\n\n**Step 4: Final Discrete Signal**\n\n$x[n] = \\cos\\left(\\frac{\\pi}{2} n\\right) - \\sin\\left(\\frac{\\pi}{2} n\\right)$\nBecause of undersampling, the 150 Hz component folded back and appeared as a -50 Hz component, distorting the signal."
      }
    ],
    coding: [
      {
        title: "Aliasing Demonstration",
        description: "Write a script to plot a 10 Hz sine wave sampled properly at 100 Hz, and an undersampled 90 Hz sine wave sampled at 100 Hz. Show that their discrete sample points perfectly overlap.",
        starter_code: "import numpy as np\nimport matplotlib.pyplot as plt\nfs = 100\n",
        solution_code: "import numpy as np\nimport matplotlib.pyplot as plt\n\nfs = 100\nt_cont = np.linspace(0, 0.2, 1000) # High-res time for \"analog\" signal\nn = np.arange(0, 0.2 * fs)         # Discrete samples\nt_samp = n / fs\n\n# 10 Hz signal (Properly sampled)\nf1 = 10\nx1_cont = np.sin(2 * np.pi * f1 * t_cont)\nx1_samp = np.sin(2 * np.pi * f1 * t_samp)\n\n# 90 Hz signal (Undersampled, will alias to -10 Hz)\nf2 = 90\nx2_cont = np.sin(2 * np.pi * f2 * t_cont)\nx2_samp = np.sin(2 * np.pi * f2 * t_samp)\n\nplt.figure(figsize=(12, 5))\nplt.plot(t_cont, x1_cont, 'b-', label='10 Hz Continuous', alpha=0.5)\nplt.plot(t_cont, x2_cont, 'r-', label='90 Hz Continuous', alpha=0.5)\n\n# The samples for both signals will perfectly align!\nplt.plot(t_samp, x1_samp, 'bo', markersize=8, label='10 Hz Samples')\nplt.plot(t_samp, x2_samp, 'rx', markersize=8, label='90 Hz Samples')\n\nplt.title(\"Aliasing: 90 Hz sampled at 100 Hz looks identical to a 10 Hz signal\")\nplt.xlabel(\"Time (s)\")\nplt.legend()\nplt.grid(True)\nplt.show()\n"
      }
    ]
  },
  5: {
    week: 5,
    theoretical: [
      {
        title: "Inverse Z-Transform via Partial Fractions",
        problem: "Find the inverse Z-transform of $X(z) = \\frac{z}{z^2 - 1.5z + 0.5}$ for the causal Region of Convergence (ROC) $|z| > 1$.",
        trap_hint: "Always perform partial fraction expansion on X(z)/z to avoid messy z^{-1} algebra.",
        solution: "**Step 1: Divide by z**\n\nTo make partial fractions easier and align with standard tables, work with $\\frac{X(z)}{z}$:\n$\\frac{X(z)}{z} = \\frac{1}{z^2 - 1.5z + 0.5}$\n\n**Step 2: Factor the Denominator**\n\nRoots of $z^2 - 1.5z + 0.5 = 0$ are $z=1$ and $z=0.5$.\n$\\frac{X(z)}{z} = \\frac{1}{(z-1)(z-0.5)}$\n\n**Step 3: Partial Fraction Expansion**\n\n$\\frac{1}{(z-1)(z-0.5)} = \\frac{A}{z-1} + \\frac{B}{z-0.5}$\nSolve for $A$ using the cover-up method: multiply by $(z-1)$ and evaluate at $z=1$.\n$A = \\left. \\frac{1}{z-0.5} \\right|_{z=1} = \\frac{1}{1-0.5} = 2$\nSolve for $B$: multiply by $(z-0.5)$ and evaluate at $z=0.5$.\n$B = \\left. \\frac{1}{z-1} \\right|_{z=0.5} = \\frac{1}{0.5-1} = -2$\nSo, $\\frac{X(z)}{z} = \\frac{2}{z-1} - \\frac{2}{z-0.5}$\n\n**Step 4: Multiply by z and Apply Inverse Transform**\n\n$X(z) = 2\\frac{z}{z-1} - 2\\frac{z}{z-0.5}$\nUsing the standard pair $a^n u[n] \\leftrightarrow \\frac{z}{z-a}$ for $|z| > |a|$:\nThe ROC is $|z| > 1$, which satisfies both $|z|>1$ and $|z|>0.5$, indicating a right-sided (causal) sequence.\n$x[n] = 2(1)^n u[n] - 2(0.5)^n u[n]$\n$x[n] = 2(1 - 0.5^n) u[n]$"
      },
      {
        title: "Stability from Z-Plane Poles",
        problem: "Determine the stability of a causal LTI system with transfer function $H(z) = \\frac{z^2 + 1}{z^2 - 0.25}$.",
        trap_hint: "For a causal system, stability depends entirely on the magnitude of the poles relative to the unit circle.",
        solution: "**Step 1: Identify the Poles**\n\nThe poles are the roots of the denominator polynomial $D(z) = z^2 - 0.25 = 0$.\n$z^2 = 0.25 \\implies z = \\pm 0.5$.\nThe system has two real poles: $p_1 = 0.5$ and $p_2 = -0.5$.\n\n**Step 2: Check the ROC for a Causal System**\n\nFor a causal system, the Region of Convergence (ROC) extends outward from the outermost pole.\nThe outermost pole has a magnitude of $|\\pm 0.5| = 0.5$.\nThus, the ROC is $|z| > 0.5$.\n\n**Step 3: Evaluate BIBO Stability**\n\nA discrete-time LTI system is Bounded-Input Bounded-Output (BIBO) stable if and only if its ROC includes the unit circle ($|z| = 1$).\nSince the ROC is $|z| > 0.5$, it completely encompasses the unit circle $|z|=1$.\nEquivalently, for causal systems, stability requires all poles to lie strictly *inside* the unit circle ($|p_i| < 1$).\nSince $|0.5| < 1$ and $|-0.5| < 1$, both poles are safely inside the unit circle.\n\n**Conclusion:** The system is **Stable**."
      }
    ],
    coding: [
      {
        title: "Poles and Zeros Plotting",
        description: "Write a script using scipy.signal to compute the poles and zeros of $H(z) = \\frac{z^2 - 1}{z^2 - 0.5z + 0.5}$ and plot them on the complex plane with a unit circle.",
        starter_code: "import numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy.signal import tf2zpk\nnum = [1, 0, -1]\nden = [1, -0.5, 0.5]\n",
        solution_code: "import numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy.signal import tf2zpk\n\nnum = [1, 0, -1]\nden = [1, -0.5, 0.5]\n\n# Extract Zeros, Poles, and Gain\nzeros, poles, gain = tf2zpk(num, den)\n\nfig, ax = plt.subplots(figsize=(6, 6))\n# Draw the unit circle\ntheta = np.linspace(0, 2*np.pi, 100)\nax.plot(np.cos(theta), np.sin(theta), 'k--', label='Unit Circle')\n\n# Plot zeros (blue circles) and poles (red crosses)\nax.plot(np.real(zeros), np.imag(zeros), 'bo', markersize=10, fillstyle='none', label='Zeros')\nax.plot(np.real(poles), np.imag(poles), 'rx', markersize=10, label='Poles')\n\nax.axhline(0, color='black', lw=0.5)\nax.axvline(0, color='black', lw=0.5)\nax.set_aspect('equal')\nax.set_xlim(-1.5, 1.5)\nax.set_ylim(-1.5, 1.5)\nax.legend()\nax.grid(True)\nplt.title(\"Pole-Zero Diagram\")\nplt.show()\n# Since the red crosses (poles) are inside the unit circle, the causal system is stable.\n"
      }
    ]
  },
  6: {
    week: 6,
    theoretical: [
      {
        title: "DFT Matrix and Linearity",
        problem: "Given a 4-point signal $x[n] = \\{1, 0, -1, 0\\}$, compute its 4-point DFT $X[k]$ manually using the DFT matrix formulation.",
        trap_hint: "The DFT matrix $W_N$ has entries $W_N^{nk} = e^{-j 2\\pi nk / N}$. For N=4, the fundamental twiddle factor is $W_4 = e^{-j\\pi/2} = -j$.",
        solution: "**Step 1: Construct the 4-point DFT Matrix**\n\nThe 4-point DFT is given by $X = W_4 x$, where the matrix elements are $w^{nk}$ with $w = e^{-j 2\\pi / 4} = -j$.\nLet's evaluate $w^{nk}$ for $n,k \\in \\{0, 1, 2, 3\\}$:\n- Row 0 (k=0): $w^0 = 1$ for all n.\n- Row 1 (k=1): $1, -j, (-j)^2, (-j)^3 = 1, -j, -1, j$.\n- Row 2 (k=2): $1, -1, 1, -1$.\n- Row 3 (k=3): $1, j, -1, -j$.\n\nMatrix $W_4 = \\begin{bmatrix} 1 & 1 & 1 & 1 \\\\ 1 & -j & -1 & j \\\\ 1 & -1 & 1 & -1 \\\\ 1 & j & -1 & -j \\end{bmatrix}$\n\n**Step 2: Matrix Multiplication**\n\n$x = \\begin{bmatrix} 1 \\\\ 0 \\\\ -1 \\\\ 0 \\end{bmatrix}$\n\n$X[0] = 1(1) + 1(0) + 1(-1) + 1(0) = 0$\n$X[1] = 1(1) + (-j)(0) + (-1)(-1) + j(0) = 1 + 1 = 2$\n$X[2] = 1(1) + (-1)(0) + 1(-1) + (-1)(0) = 1 - 1 = 0$\n$X[3] = 1(1) + j(0) + (-1)(-1) + (-j)(0) = 1 + 1 = 2$\n\n**Step 3: Final Answer**\n\nThe 4-point DFT is $X[k] = \\{0, 2, 0, 2\\}$. This makes sense intuitively: the input is a discrete cosine at the Nyquist frequency, which corresponds to the $k=1$ and $k=3$ (aliased $-1$) bins in a 4-point DFT."
      },
      {
        title: "Circular Convolution",
        problem: "Compute the 4-point circular convolution of $x[n] = \\{1, 2, 0, 0\\}$ and $h[n] = \\{3, 1, 0, 0\\}$ using the time-domain matrix method.",
        trap_hint: "Construct a circulant matrix from h[n] where each column is circularly shifted down by one.",
        solution: "**Step 1: Construct the Circulant Matrix**\n\nThe circular convolution $y = h \\circledast x$ can be written as $y = H_{circ} x$, where $H_{circ}$ is a circulant matrix formed by cyclically shifting $h[n] = \\{3, 1, 0, 0\\}$ rightward down the columns.\n\n$H_{circ} = \\begin{bmatrix} h[0] & h[3] & h[2] & h[1] \\\\ h[1] & h[0] & h[3] & h[2] \\\\ h[2] & h[1] & h[0] & h[3] \\\\ h[3] & h[2] & h[1] & h[0] \\end{bmatrix} = \\begin{bmatrix} 3 & 0 & 0 & 1 \\\\ 1 & 3 & 0 & 0 \\\\ 0 & 1 & 3 & 0 \\\\ 0 & 0 & 1 & 3 \\end{bmatrix}$\n\n**Step 2: Multiply with the Input Vector**\n\n$x = \\begin{bmatrix} 1 \\\\ 2 \\\\ 0 \\\\ 0 \\end{bmatrix}$\n\n$y[0] = 3(1) + 0(2) + 0(0) + 1(0) = 3$\n$y[1] = 1(1) + 3(2) + 0(0) + 0(0) = 7$\n$y[2] = 0(1) + 1(2) + 3(0) + 0(0) = 2$\n$y[3] = 0(1) + 0(2) + 1(0) + 3(0) = 0$\n\n**Step 3: Verify Linear Equivalence**\n\nSince $x$ has length 2 and $h$ has length 2, their linear convolution length is $2+2-1=3$. Because we are doing a 4-point circular convolution and $4 > 3$, the circular convolution exactly equals the linear convolution padded with zeros. The result is $y[n] = \\{3, 7, 2, 0\\}$."
      }
    ],
    coding: [
      {
        title: "Spectral Leakage and Zero Padding",
        description: "Show how zero-padding interpolates the DFT spectrum and makes spectral leakage more visible.",
        starter_code: "import numpy as np\nimport matplotlib.pyplot as plt\n# Create a 16-point sine wave with 2.5 cycles (will leak)\n",
        solution_code: "import numpy as np\nimport matplotlib.pyplot as plt\n\n# 16-point sine wave with 2.5 cycles (frequency bin 2.5)\nn = np.arange(16)\nx = np.sin(2 * np.pi * 2.5 * n / 16)\n\n# 16-point DFT (Original)\nX_16 = np.abs(np.fft.fft(x))\n\n# 256-point DFT (Zero-padded to interpolate the spectrum)\nX_256 = np.abs(np.fft.fft(x, 256))\n\n# Frequency axes mapped to bins [0, 15]\nk_16 = np.arange(16)\nk_256 = np.linspace(0, 16, 256, endpoint=False)\n\nplt.figure(figsize=(10, 4))\n# Plot smooth zero-padded curve\nplt.plot(k_256, X_256, 'r-', label='Zero-padded (Interpolated)')\n# Plot original sparse bins\nplt.stem(k_16, X_16, linefmt='b-', markerfmt='bo', basefmt='k-', label='Original 16-point DFT')\n\nplt.title(\"Spectral Leakage Revealed by Zero-Padding\")\nplt.xlabel(\"Frequency Bin (k)\")\nplt.ylabel(\"Magnitude\")\nplt.legend()\nplt.grid()\nplt.show()\n"
      }
    ]
  },
  7: {
    week: 7,
    theoretical: [
      {
        title: "Decimation-in-Time Radix-2 FFT",
        problem: "Determine the computational savings of an 8-point Radix-2 FFT compared to a direct 8-point DFT computation.",
        trap_hint: "Direct DFT requires N^2 complex multiplications. Radix-2 FFT requires (N/2)*log2(N) complex multiplications.",
        solution: "**Step 1: Compute Direct DFT Complexity**\n\nThe direct DFT formula is $X[k] = \\sum_{n=0}^{N-1} x[n] W_N^{nk}$.\nFor each frequency bin $k$ (out of $N$ bins), we must perform $N$ complex multiplications and $N-1$ complex additions.\nTotal complex multiplications $= N^2 = 8^2 = 64$.\nTotal complex additions $= N(N-1) = 8(7) = 56$.\n\n**Step 2: Compute Radix-2 FFT Complexity**\n\nThe Radix-2 Cooley-Tukey algorithm breaks the DFT into $\\log_2(N)$ stages.\nFor $N=8$, there are $\\log_2(8) = 3$ stages.\nIn each stage, we compute $N/2 = 4$ \"butterfly\" operations.\nEach butterfly operation involves exactly 1 complex multiplication (by the twiddle factor $W_N^k$) and 2 complex additions (one addition, one subtraction).\nTotal complex multiplications $= \\frac{N}{2} \\log_2(N) = 4 \\times 3 = 12$.\nTotal complex additions $= N \\log_2(N) = 8 \\times 3 = 24$.\n\n**Step 3: Analyze the Savings**\n\nMultiplication savings: Reduced from 64 to 12. The FFT requires only $12/64 = 18.75\\%$ of the multiplications of the direct method.\nAs $N$ gets larger, the ratio $(N/2 \\log_2 N) / N^2 = (\\log_2 N) / 2N$ approaches zero, which is why the FFT is ranked among the top 10 algorithms of the 20th century."
      },
      {
        title: "FFT Twiddle Factors",
        problem: "Evaluate the twiddle factors $W_8^0, W_8^1, W_8^2,$ and $W_8^4$. Express them in rectangular form.",
        trap_hint: "The definition is W_N^k = e^{-j 2\\pi k / N} = \\cos(-2\\pi k/N) + j\\sin(-2\\pi k/N).",
        solution: "**Step 1: Apply the Twiddle Factor Definition**\n\nThe N-point twiddle factor is defined as $W_N = e^{-j 2\\pi / N}$.\nFor $N=8$, $W_8 = e^{-j 2\\pi / 8} = e^{-j \\pi / 4}$.\n\n**Step 2: Evaluate Each Term**\n\n- **$k=0$:** $W_8^0 = e^0 = 1 + j0$.\n- **$k=1$:** $W_8^1 = e^{-j \\pi / 4} = \\cos(-\\pi/4) + j\\sin(-\\pi/4) = \\frac{\\sqrt{2}}{2} - j\\frac{\\sqrt{2}}{2} \\approx 0.707 - j0.707$.\n- **$k=2$:** $W_8^2 = e^{-j 2\\pi / 4} = e^{-j \\pi / 2} = \\cos(-\\pi/2) + j\\sin(-\\pi/2) = 0 - j1 = -j$.\n- **$k=4$:** $W_8^4 = e^{-j 4\\pi / 4} = e^{-j \\pi} = \\cos(-\\pi) + j\\sin(-\\pi) = -1 + j0 = -1$.\n\n**Step 3: Significance in FFT**\n\nNotice the symmetry: $W_8^4 = -W_8^0$. This is the half-wave symmetry property $W_N^{k+N/2} = -W_N^k$. The FFT exploits this property so that computing the lower half of the butterfly naturally gives you the factors needed for the upper half, eliminating redundant multiplications."
      }
    ],
    coding: [
      {
        title: "Recursive Radix-2 FFT Implementation",
        description: "Implement a basic recursive Radix-2 Decimation-In-Time FFT algorithm in Python without using np.fft (except for verification).",
        starter_code: "import numpy as np\ndef custom_fft(x):\n    # Recursive DIT FFT\n    pass\n",
        solution_code: "import numpy as np\n\ndef custom_fft(x):\n    x = np.asarray(x, dtype=float)\n    N = x.shape[0]\n    \n    # Base case: 1-point DFT is just the point itself\n    if N <= 1:\n        return x\n    \n    # Decimate in time: split into even and odd indexed elements\n    even = custom_fft(x[0::2])\n    odd = custom_fft(x[1::2])\n    \n    # Compute the twiddle factors for half the length\n    k = np.arange(N // 2)\n    twiddle = np.exp(-2j * np.pi * k / N)\n    \n    # Butterfly operations\n    first_half = even + twiddle * odd\n    second_half = even - twiddle * odd\n    \n    return np.concatenate([first_half, second_half])\n\n# Test the function\nx_test = np.random.random(8)\nfft_custom = custom_fft(x_test)\nfft_numpy = np.fft.fft(x_test)\n\nprint(\"Custom FFT matches NumPy?\", np.allclose(fft_custom, fft_numpy))\n"
      }
    ]
  },
  8: {
    week: 8,
    theoretical: [
      {
        title: "Welch Method for PSD Estimation",
        problem: "Explain how Welch's method calculates the Power Spectral Density (PSD) and detail why it provides a lower variance estimate than a standard periodogram.",
        trap_hint: "Focus on the bias-variance trade-off. Mention slicing, overlapping, and windowing.",
        solution: "**Step 1: The Problem with the Standard Periodogram**\n\nThe standard periodogram is computed by taking the magnitude-squared of the DFT of the entire signal, $P(f) = \\frac{1}{N}|X(f)|^2$. It is an inconsistent estimator because its variance does not decrease as the signal length $N$ increases; instead, it just calculates more, equally noisy frequency bins.\n\n**Step 2: The Welch Algorithm Steps**\n\nWelch's method addresses this by:\n1. **Slicing**: Dividing the data sequence of length $N$ into $K$ overlapping segments of length $M$.\n2. **Windowing**: Multiplying each segment by a smoothing window (e.g., Hamming or Hann) to reduce spectral leakage caused by the sharp boundaries of the slices.\n3. **FFT**: Computing the periodogram of each windowed segment individually.\n4. **Averaging**: Averaging the $K$ periodograms together to form the final PSD estimate.\n\n**Step 3: Variance Reduction (The Trade-off)**\n\nBy averaging $K$ quasi-independent segments, the variance of the PSD estimate drops by a factor roughly proportional to $K$. This creates a much smoother, statistically reliable frequency plot.\nHowever, this triggers the **bias-variance trade-off**: because each FFT is now performed on a shorter segment of length $M$ (where $M < N$), the frequency bins are wider ($\\Delta f = f_s / M$). Thus, frequency resolution is degraded (bias is increased) to obtain a smoother curve (variance is decreased)."
      },
      {
        title: "One-Sided PSD Scaling",
        problem: "Why must positive frequencies be multiplied by $\\sqrt{2}$ (or power by 2) when converting a two-sided PSD to a one-sided PSD? Provide mathematical justification.",
        trap_hint: "Think about Parseval's theorem and the conjugate symmetry of real signals.",
        solution: "**Step 1: Conjugate Symmetry**\n\nFor any real-valued time-domain signal $x[n]$, its Fourier transform exhibits conjugate symmetry: $X(-f) = X^*(f)$.\nConsequently, the Power Spectral Density, which is the magnitude squared $|X(f)|^2$, is perfectly symmetric: $P_{xx}(f) = P_{xx}(-f)$.\nThis means that half of the signal's total energy resides in the positive frequencies, and the exact redundant half resides in the negative frequencies.\n\n**Step 2: Discarding Negative Frequencies**\n\nIn practical engineering (like Welch's method), we only plot the \"one-sided\" spectrum from $f = 0$ to the Nyquist frequency $f_s / 2$, because negative frequencies offer no additional information for real signals. We simply discard them.\n\n**Step 3: Conserving Total Power**\n\nAccording to Parseval's theorem, the sum of the PSD across all frequencies must equal the total physical time-domain power.\nIf we simply throw away the negative frequencies, our sum will yield only half the actual power.\nTo conserve energy, the power of every discarded negative frequency bin is added to its positive counterpart. Since $P_{xx}(f) = P_{xx}(-f)$, we just multiply the power of all strictly positive frequencies by 2.\nIn terms of amplitude spectra (FFT magnitude), since power is proportional to amplitude squared, we multiply the amplitudes by $\\sqrt{2}$.\n*(Note: DC ($f=0$) and the exact Nyquist bin are unique and not doubled, because they do not have a separate negative counterpart in the discrete spectrum).* "
      }
    ],
    coding: [
      {
        title: "Custom Welch Implementation",
        description: "Implement a simplified Welch PSD estimator that slices an array into 50% overlapping segments, applies a Hann window, and averages their periodograms.",
        starter_code: "import numpy as np\ndef simple_welch(x, nperseg):\n    pass\n",
        solution_code: "import numpy as np\nimport matplotlib.pyplot as plt\n\ndef simple_welch(x, nperseg):\n    step = nperseg // 2  # 50% overlap\n    window = np.hanning(nperseg)\n    periodograms = []\n    \n    # Slice and compute\n    for i in range(0, len(x) - nperseg + 1, step):\n        segment = x[i:i+nperseg]\n        # Detrend (remove mean)\n        segment = segment - np.mean(segment)\n        # Window\n        windowed = segment * window\n        # FFT Magnitude squared\n        X = np.fft.rfft(windowed)\n        Pxx = np.abs(X)**2\n        periodograms.append(Pxx)\n        \n    # Average them\n    Pxx_avg = np.mean(periodograms, axis=0)\n    \n    # Normalize (Window energy compensation + One-sided doubling)\n    # Simplified normalization for demonstration\n    U = np.sum(window**2)\n    Pxx_avg = Pxx_avg / U\n    Pxx_avg[1:-1] *= 2\n    \n    f = np.fft.rfftfreq(nperseg)\n    return f, Pxx_avg\n\n# Test with noisy sine\nt = np.linspace(0, 10, 1000)\nx = np.sin(2 * np.pi * 15 * t) + np.random.randn(1000) * 2\nf, p = simple_welch(x, 256)\nplt.plot(f * 100, p)\nplt.title(\"Welch PSD Estimate\")\nplt.show()\n"
      }
    ]
  },
  9: {
    week: 9,
    theoretical: [
      {
        title: "IIR Filter Topologies: Butterworth vs Chebyshev",
        problem: "Compare the magnitude responses of Butterworth and Chebyshev Type I filters. Discuss their poles in the s-plane.",
        trap_hint: "Butterworth is maximally flat. Chebyshev minimizes the maximum error via equiripple.",
        solution: "**Step 1: Butterworth Filters**\n\nThe Butterworth filter is designed to have a \"maximally flat\" magnitude response in the passband. There are no ripples at all. The tradeoff is that the transition band (rolloff) is relatively wide/slow compared to other topologies of the same order.\nIn the continuous $s$-plane, the poles of a normalized Butterworth filter are arranged perfectly symmetrically on a **circle** of radius $\\omega_c$ in the left half-plane.\n\n**Step 2: Chebyshev Type I Filters**\n\nThe Chebyshev Type I filter is designed to achieve the steepest possible rolloff (sharpest transition band) for a given filter order. To achieve this mathematical optimality, it sacrifices flatness in the passband, exhibiting \"equiripple\" behavior (the magnitude bounces uniformly between $1$ and $1-\\delta$ before plummeting at the cutoff).\nIn the $s$-plane, the poles of a Chebyshev filter are arranged on an **ellipse** in the left half-plane. The major axis of the ellipse is vertical, bringing the poles closer to the $j\\omega$ axis near the cutoff frequency, which causes the steep drop-off and the passband ripples."
      },
      {
        title: "The Bilinear Transform",
        problem: "Transform the analog lowpass prototype $H(s) = \\frac{1}{s+1}$ into a digital IIR filter $H(z)$ using the Bilinear Transform. Assume a sampling period of $T_s = 2$ seconds.",
        trap_hint: "The BLT substitution is s = (2/T) * (1-z^{-1})/(1+z^{-1}).",
        solution: "**Step 1: State the Bilinear Substitution**\n\nThe Bilinear Transform maps the continuous $s$-plane to the discrete $z$-plane using the approximation:\n$s = \\frac{2}{T_s} \\frac{1 - z^{-1}}{1 + z^{-1}}$\nGiven $T_s = 2$, this simplifies beautifully to:\n$s = \\frac{1 - z^{-1}}{1 + z^{-1}}$\n\n**Step 2: Substitute into H(s)**\n\nSubstitute this expression into the analog prototype $H(s) = \\frac{1}{s+1}$:\n$H(z) = \\frac{1}{\\frac{1 - z^{-1}}{1 + z^{-1}} + 1}$\n\n**Step 3: Algebraic Simplification**\n\nMultiply the numerator and the denominator by $(1 + z^{-1})$ to clear the compound fraction:\n$H(z) = \\frac{1 + z^{-1}}{(1 - z^{-1}) + (1 + z^{-1})}$\nCombine the terms in the denominator:\n$H(z) = \\frac{1 + z^{-1}}{2} = 0.5 + 0.5z^{-1}$\n\n**Step 4: Interpret the Result**\n\nThis translates to the difference equation $y[n] = 0.5x[n] + 0.5x[n-1]$. Surprisingly, this specific transformation resulted in an FIR filter (a 2-point moving average), which acts as a gentle lowpass filter. Generally, the BLT yields IIR filters, but the $s+1$ denominator perfectly canceled the feedback terms in this unique, simple case."
      }
    ],
    coding: [
      {
        title: "IIR Filter Design via SciPy",
        description: "Design a 4th-order Butterworth lowpass filter with a cutoff of 0.2 (normalized to Nyquist) using scipy.signal, and plot its frequency response.",
        starter_code: "import numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy import signal\n",
        solution_code: "import numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy import signal\n\n# Design 4th order Butterworth filter\n# Wn is normalized from 0 to 1, where 1 is the Nyquist frequency\nb, a = signal.butter(N=4, Wn=0.2, btype='low', analog=False)\n\n# Compute frequency response\nw, h = signal.freqz(b, a)\n\nplt.figure(figsize=(8, 4))\n# Convert complex response to dB\nplt.plot(w / np.pi, 20 * np.log10(np.maximum(np.abs(h), 1e-10)))\nplt.title('Butterworth Filter Frequency Response')\nplt.xlabel('Normalized Frequency (×π rad/sample)')\nplt.ylabel('Amplitude [dB]')\nplt.axvline(0.2, color='red', linestyle='--', label='Cutoff')\nplt.grid(True)\nplt.legend()\nplt.ylim(-60, 5)\nplt.show()\n"
      }
    ]
  },
  10: {
    week: 10,
    theoretical: [
      {
        title: "FIR Filter Characteristics",
        problem: "List three advantages and one disadvantage of FIR (Finite Impulse Response) filters compared to IIR filters.",
        trap_hint: "Focus on phase, stability, and computational complexity.",
        solution: "**Advantages:**\n1. **Strictly Linear Phase**: FIR filters can be designed to have perfect linear phase (symmetric coefficients $h[n] = h[N-1-n]$). This means all frequency components are delayed by exactly the same amount of time, resulting in zero phase distortion (the shape of waveforms is preserved). IIR filters inherently have non-linear phase.\n2. **Inherent Stability**: Because FIR filters have no feedback loops (all poles are located safely at the origin $z=0$), they are guaranteed to be BIBO stable regardless of coefficient quantization.\n3. **Arbitrary Responses**: The Parks-McClellan algorithm allows FIR filters to be optimized for almost any arbitrary frequency response shape.\n\n**Disadvantage:**\n1. **High Computational Cost**: To achieve steep cutoff rates (sharp transition bands), FIR filters require a much higher filter order (hundreds of taps/multiplications per sample) compared to IIR filters, which can achieve the same cutoff with very few coefficients."
      },
      {
        title: "Window Method for FIR Design",
        problem: "Explain the window method for FIR filter design and the origin of the Gibbs phenomenon.",
        trap_hint: "Start with the ideal brick-wall filter. Why can't it be implemented? What does truncation do in the frequency domain?",
        solution: "**Step 1: The Ideal Prototype**\n\nThe goal is usually an ideal \"brick-wall\" frequency response (e.g., a perfect rectangle passing low frequencies and completely blocking high frequencies). Taking the inverse DTFT of this ideal rectangular frequency response yields the ideal impulse response, which is a $\\text{sinc}$ function in the time domain: $h_{ideal}[n] = \\frac{\\sin(\\omega_c n)}{\\pi n}$.\n\n**Step 2: The Physical Problem**\n\nThe $\\text{sinc}$ function extends from $n = -\\infty$ to $\\infty$. It is both infinite (impossible to compute) and non-causal (requires knowledge of future inputs). To implement it, we must truncate it to a finite length $N$ and shift it rightward to make it causal.\n\n**Step 3: Truncation and the Gibbs Phenomenon**\n\nSimple truncation is mathematically equivalent to multiplying the infinite $\\text{sinc}$ by a rectangular window. In the frequency domain, multiplication in time becomes convolution. Convolving our ideal brick-wall rectangle with the Fourier transform of a rectangular window (which is a narrow $\\text{sinc}$ itself) causes the sharp edges of the brick wall to smear out, creating a wider transition band. Furthermore, the sidelobes of the window's $\\text{sinc}$ function introduce rippling oscillations in both the passband and stopband. These persistent ripples near the discontinuity are known as the **Gibbs phenomenon**.\n\n**Step 4: The Windowing Solution**\n\nTo mitigate the Gibbs ripples, we multiply the truncated impulse response by a tapering window function (like Hamming or Blackman) instead of a harsh rectangular cut. This smoothly brings the ends of the impulse response to zero. It dramatically suppresses the sidelobe ripples (deepening the stopband attenuation), but at the cost of widening the main lobe, which makes the filter's transition band less sharp."
      }
    ],
    coding: [
      {
        title: "FIR Design via Window Method",
        description: "Design a 50-tap lowpass FIR filter with a cutoff of 0.3*Nyquist using the Hamming window method in SciPy.",
        starter_code: "import numpy as np\nfrom scipy import signal\n",
        solution_code: "import numpy as np\nimport matplotlib.pyplot as plt\nfrom scipy import signal\n\n# Number of taps (filter length)\nnumtaps = 51 \n\n# Design the filter using the window method (firwin)\n# cutoff is normalized to Nyquist (1.0 = Nyquist)\nh = signal.firwin(numtaps, cutoff=0.3, window='hamming')\n\n# Calculate frequency response\nw, H = signal.freqz(h)\n\nplt.figure(figsize=(8, 4))\nplt.plot(w / np.pi, 20 * np.log10(np.abs(H)))\nplt.title('FIR Lowpass Filter (Hamming Window)')\nplt.xlabel('Normalized Frequency (×π rad/sample)')\nplt.ylabel('Magnitude (dB)')\nplt.grid(True)\nplt.show()\n"
      }
    ]
  },
  11: {
    week: 11,
    theoretical: [
      {
        title: "Direct Form I vs Direct Form II",
        problem: "Compare the Direct Form I and Direct Form II structures for implementing an IIR filter. Which one requires less memory?",
        trap_hint: "Look at the number of delay elements ($z^{-1}$ blocks) used by each.",
        solution: "**Step 1: Understanding the Difference Equation**\n\nAn IIR filter evaluates $y[n] = \\sum_{k=0}^{M} b_k x[n-k] - \\sum_{k=1}^{N} a_k y[n-k]$.\nThis consists of two parts: a feedforward moving average of the input (the zeros, $b_k$) and a feedback autoregression of the output (the poles, $a_k$).\n\n**Step 2: Direct Form I**\n\nDirect Form I implements this exactly as written. It cascades the feedforward section followed by the feedback section.\nMemory requirements: It needs $M$ delay elements to store past inputs $x[n-k]$ and $N$ delay elements to store past outputs $y[n-k]$. Total memory = $M + N$ delays.\nAdvantage: Highly robust to quantization overflow in fixed-point processors because there is only one central accumulation point.\n\n**Step 3: Direct Form II**\n\nDirect Form II recognizes that because the system is linear and time-invariant, the order of the feedforward and feedback sections can be swapped. By putting the feedback section *first*, the delay lines for the input and output merge into a single, shared central delay line.\nMemory requirements: It requires only $\\max(M, N)$ delay elements.\nConclusion: **Direct Form II is preferred when memory is constrained**, as it uses half the memory of Direct Form I. However, the internal state values in the shared delay line can become very large, requiring careful scaling to avoid overflow in fixed-point math."
      },
      {
        title: "Coefficient Quantization Effects",
        problem: "Explain how quantizing filter coefficients to 16-bit fixed-point formats can compromise the stability of a high-order IIR filter.",
        trap_hint: "Relate the polynomial coefficients to the roots (poles) of the transfer function.",
        solution: "**Step 1: Ideal vs Quantized Coefficients**\n\nWhen an IIR filter is designed analytically (e.g., in MATLAB or Python), its coefficients ($a_k$, $b_k$) are represented in double-precision floating-point. When deploying to embedded DSP hardware, these coefficients are often truncated or rounded to fit into 16-bit or 24-bit fixed-point registers.\n\n**Step 2: The Root Sensitivity Problem**\n\nThe poles of the system are the roots of the denominator polynomial $A(z) = 1 + a_1 z^{-1} + a_2 z^{-2} + \\dots + a_N z^{-N}$.\nIn algebra, the roots of high-order polynomials are *extremely* sensitive to microscopic changes in their coefficients. A tiny rounding error in $a_N$ can cause a massive shift in the location of the poles in the complex $z$-plane.\n\n**Step 3: Loss of Stability**\n\nFor a causal IIR filter to be stable, all poles must lie strictly inside the unit circle ($|z| < 1$). Sharp filters (like narrowband lowpass or notch filters) naturally place their poles extremely close to the unit circle to achieve steep transitions. If quantization shifts one of these poles outward by even a fraction of a percent, it may cross the unit circle ($|z| \\geq 1$). If this happens, the implemented hardware filter will oscillate out of control and blow up, even though the theoretical design was perfectly stable.\n\n*Solution:* To mitigate this, high-order IIR filters are practically never implemented as a single large difference equation. They are broken down into a series of cascaded Second-Order Sections (Biquads), where the roots of a quadratic equation are highly resilient to coefficient quantization."
      }
    ],
    coding: [
      {
        title: "Second Order Sections (SOS)",
        description: "Generate a high-order (8th order) Chebyshev filter and convert it to Second-Order Sections (SOS) to ensure numerical stability.",
        starter_code: "from scipy import signal\n",
        solution_code: "from scipy import signal\nimport numpy as np\n\n# Design an 8th order Chebyshev Type 1 filter\n# Note: output='sos' is highly recommended for orders > 4 to avoid numerical instability\nsos = signal.cheby1(N=8, rp=1, Wn=0.2, btype='low', output='sos')\n\nprint(\"Number of biquad sections:\", sos.shape[0])\nprint(\"SOS Matrix (Each row is [b0, b1, b2, a0, a1, a2]):\")\nfor row in sos:\n    print(np.round(row, 4))\n\n# To apply it to a signal:\n# y = signal.sosfilt(sos, x)\n"
      }
    ]
  },
  12: {
    week: 12,
    theoretical: [
      {
        title: "Decimation and Interpolation",
        problem: "Explain the complete process of reducing the sampling rate of a signal by a factor of M (Decimation) to prevent aliasing.",
        trap_hint: "You cannot simply throw away samples. What must you do before downsampling?",
        solution: "**Step 1: The Threat of Aliasing**\n\nDecimation involves keeping only every $M$-th sample of a discrete signal $x[n]$ to produce $y[n] = x[nM]$. This effectively lowers the sampling rate from $f_s$ to $f_s/M$. According to the Nyquist theorem, the new Nyquist limit is $f_s / (2M)$. If the original signal contains any frequency energy above this new, lower limit, that high-frequency energy will alias (fold back) into the baseband and irreversibly corrupt the signal.\n\n**Step 2: Anti-Aliasing Filter**\n\nTo prevent this, the signal must *first* be passed through a strict digital lowpass filter before any samples are discarded. This filter must have a normalized cutoff frequency of $\\pi/M$ (or physical cutoff $f_s / 2M$). It completely strips away the high frequencies that would otherwise cause aliasing.\n\n**Step 3: Downsampling**\n\nOnce the signal is safely bandlimited, the actual downsampling operation occurs. We systematically discard $M-1$ out of every $M$ samples. The resulting signal $y[n]$ is now perfectly represented at the lower sampling rate without distortion.\n(In practice, Polyphase filtering is used to combine these two steps so we don't waste CPU cycles calculating filtered samples that we immediately plan to throw away)."
      },
      {
        title: "Short-Time Fourier Transform (STFT)",
        problem: "Describe the time-frequency uncertainty principle as it applies to the Short-Time Fourier Transform.",
        trap_hint: "How does the choice of window length affect time resolution versus frequency resolution?",
        solution: "**Step 1: Purpose of STFT**\n\nThe standard Fourier Transform tells us *what* frequencies exist in a signal, but not *when* they occurred. The STFT solves this by sliding a small window function across the time-domain signal and taking the FFT of each chunk, producing a 2D spectrogram (time vs. frequency vs. magnitude).\n\n**Step 2: The Uncertainty Principle**\n\nThe fundamental limitation of STFT is the Gabor limit, or Heisenberg uncertainty principle for signal processing: $\\Delta t \\cdot \\Delta f \\geq \\frac{1}{4\\pi}$. You cannot simultaneously achieve perfect time resolution and perfect frequency resolution.\n\n**Step 3: The Trade-off**\n\n- **Wide Window (Long time duration)**: A long window captures many cycles of a wave, so the FFT produces very narrow, precise frequency bins (Excellent frequency resolution). However, because the window spans a large chunk of time, we don't know exactly when a transient event inside that window occurred (Poor time resolution).\n- **Narrow Window (Short time duration)**: A short window pinpoints the exact millisecond an event occurs (Excellent time resolution). However, it doesn't capture enough cycles to accurately measure low frequencies, resulting in wide, blurry frequency bins (Poor frequency resolution).\nThis rigid, fixed-window compromise is why modern processing sometimes uses the Wavelet Transform, which dynamically scales the window size based on the frequency being analyzed."
      }
    ],
    coding: [
      {
        title: "Plotting a Spectrogram",
        description: "Use SciPy to compute and plot the spectrogram of a linear chirp signal that sweeps from 0 to 500 Hz over 2 seconds.",
        starter_code: "import numpy as np\nfrom scipy import signal\nimport matplotlib.pyplot as plt\n",
        solution_code: "import numpy as np\nfrom scipy import signal\nimport matplotlib.pyplot as plt\n\n# Generate a 2-second chirp signal\nfs = 2000\nt = np.linspace(0, 2, 2 * fs)\n# Chirp sweeps from 0 Hz at t=0 to 500 Hz at t=2\nx = signal.chirp(t, f0=0, t1=2, f1=500, method='linear')\n\n# Compute spectrogram\n# nperseg controls the time/frequency resolution tradeoff!\nf, t_spec, Sxx = signal.spectrogram(x, fs, nperseg=256, noverlap=128)\n\nplt.figure(figsize=(8, 4))\n# Plot as a heatmap\nplt.pcolormesh(t_spec, f, 10 * np.log10(Sxx), shading='gouraud', cmap='inferno')\nplt.title('Spectrogram of a Linear Chirp')\nplt.ylabel('Frequency [Hz]')\nplt.xlabel('Time [sec]')\nplt.colorbar(label='Intensity [dB]')\nplt.ylim(0, 600)\nplt.show()\n"
      }
    ]
  },
  13: {
    week: 13,
    theoretical: [
      {
        title: "Comprehensive System Analysis",
        problem: "An LTI system has the impulse response $h[n] = (0.5)^n u[n]$. Find the output $y[n]$ if the input is $x[n] = e^{j\\pi n / 2}$.",
        trap_hint: "For complex exponential inputs, the output is simply the input scaled by the frequency response evaluated at that frequency.",
        solution: "**Step 1: Identify the Input Frequency**\n\nThe input signal is a complex exponential $x[n] = e^{j\\omega_0 n}$ where $\\omega_0 = \\pi / 2$.\nOne of the most profound properties of LTI systems is that complex exponentials are eigenfunctions. This means the output will just be the same complex exponential, multiplied by a complex scalar. That scalar is the Frequency Response $H(e^{j\\omega})$ evaluated at $\\omega_0$.\n$y[n] = H(e^{j\\pi/2}) e^{j\\pi n / 2}$\n\n**Step 2: Find the Frequency Response $H(e^{j\\omega})$**\n\nThe system's impulse response is $h[n] = (0.5)^n u[n]$.\nTaking the DTFT:\n$H(e^{j\\omega}) = \\sum_{n=0}^{\\infty} (0.5)^n e^{-j\\omega n} = \\frac{1}{1 - 0.5 e^{-j\\omega}}$\n\n**Step 3: Evaluate at $\\omega_0 = \\pi / 2$**\n\nSubstitute $\\omega = \\pi / 2$:\n$e^{-j\\pi/2} = \\cos(-\\pi/2) + j\\sin(-\\pi/2) = -j$\nSo, $H(e^{j\\pi/2}) = \\frac{1}{1 - 0.5(-j)} = \\frac{1}{1 + 0.5j}$\n\n**Step 4: Convert to Polar Form (Optional but useful)**\n\nTo see the exact gain and phase shift applied to the wave:\nDenominator magnitude: $\\sqrt{1^2 + 0.5^2} = \\sqrt{1.25} \\approx 1.118$\nDenominator phase: $\\arctan(0.5/1) \\approx 26.5^\\circ$\n$H = \\frac{1}{1.118 e^{j26.5^\\circ}} = 0.894 e^{-j26.5^\\circ}$\n\n**Step 5: Final Output**\n\n$y[n] = \\left( \\frac{1}{1 + 0.5j} \\right) e^{j\\pi n / 2}$"
      },
      {
        title: "The Big Picture: Filter Design Pipeline",
        problem: "Summarize the step-by-step pipeline an engineer takes to design an IIR filter to remove 60 Hz hum from an ECG signal sampled at 500 Hz.",
        trap_hint: "Start from specs, go to normalized frequencies, pick an analog prototype, use the Bilinear transform, and deploy in SOS.",
        solution: "**Step 1: Specification & Normalization**\n\nThe target is a notch filter at $f_c = 60$ Hz with a narrow bandwidth. The sampling rate is $f_s = 500$ Hz. The Nyquist frequency is $250$ Hz.\nWe normalize the target frequency to radians/sample: $\\omega_c = 2\\pi(60/500) = 0.24\\pi$ rad/sample.\n\n**Step 2: Pre-warping**\n\nBecause the Bilinear Transform compresses frequencies non-linearly, we must pre-warp the digital target frequency into a continuous prototype frequency $\\Omega_c$:\n$\\Omega_c = \\frac{2}{T_s} \\tan\\left(\\frac{\\omega_c}{2}\\right)$.\n\n**Step 3: Analog Prototype Design**\n\nWe design a continuous-time notch filter $H(s)$ centered at $\\Omega_c$. This usually involves placing complex conjugate zeros exactly on the $j\\Omega$ axis at $\\pm j\\Omega_c$, and corresponding poles slightly to the left in the stable half-plane to control the bandwidth.\n\n**Step 4: The Bilinear Transform**\n\nWe map the $s$-plane filter to the $z$-plane using the substitution $s = \\frac{2}{T_s} \\frac{1 - z^{-1}}{1 + z^{-1}}$.\nThe $j\\Omega$ axis maps to the unit circle. Our zeros land precisely at $e^{\\pm j 0.24\\pi}$, creating a perfect null at exactly 60 Hz.\n\n**Step 5: Implementation Architecture**\n\nWe extract the coefficients $b_k$ and $a_k$. To protect the filter from numeric instability caused by fixed-point quantization on the microcontroller, we factor $H(z)$ into Second-Order Sections (biquads). We implement the filter using the Transposed Direct Form II architecture for optimal memory efficiency and numerical robustness."
      }
    ],
    coding: [
      {
        title: "Full Pipeline Execution",
        description: "Write a complete script that simulates a 60Hz noise artifact on a clean signal, designs a 60Hz IIR notch filter, applies it, and plots the results.",
        starter_code: "import numpy as np\nfrom scipy import signal\nimport matplotlib.pyplot as plt\n",
        solution_code: "import numpy as np\nfrom scipy import signal\nimport matplotlib.pyplot as plt\n\nfs = 500\nt = np.linspace(0, 2, 2 * fs)\n# Create a \"clean\" low-frequency physiological signal (e.g., breathing ~ 0.5 Hz)\nclean = np.sin(2 * np.pi * 0.5 * t)\n# Add severe 60 Hz powerline interference\nnoise = 1.5 * np.sin(2 * np.pi * 60 * t)\ncorrupted = clean + noise\n\n# Design Notch Filter using SciPy's automated tool\nf0 = 60.0  # Frequency to remove\nQ = 30.0   # Quality factor (narrowness of notch)\nb, a = signal.iirnotch(w0=f0, Q=Q, fs=fs)\n\n# Apply the filter using zero-phase filtering to prevent phase distortion\nrecovered = signal.filtfilt(b, a, corrupted)\n\n# Plot\nplt.figure(figsize=(10, 6))\nplt.subplot(2, 1, 1)\nplt.plot(t, corrupted, 'r-')\nplt.title(\"Corrupted Signal (Clean + 60Hz Noise)\")\n\nplt.subplot(2, 1, 2)\nplt.plot(t, clean, 'k--', lw=3, label=\"Original Clean\")\nplt.plot(t, recovered, 'b-', alpha=0.8, label=\"Recovered via Notch\")\nplt.title(\"Signal after Notch Filtering\")\nplt.legend()\nplt.tight_layout()\nplt.show()\n"
      }
    ]
  }
};
