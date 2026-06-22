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
        name: 'Filter Specifications and Terminology',
        explanation: `Fundamental terminology is required to describe the frequency response of a filter:
* **Passband**: The frequency range where the filter gain is approximately $1$.
* **Stopband**: The frequency range where the filter gain is approximately $0$.
* **Cutoff Frequency ($f_C$)**: The frequency at which the output signal has one-half the power of the input signal (also called the $-3$ dB frequency, corresponding to an amplitude multiplier of $1/\\sqrt{2}$).
* **Bandwidth**: The range between the higher ($f_H$) and lower ($f_L$) cutoff frequencies for band-pass or band-reject filters.
* **Transition Band**: The finite-width frequency range between the passband and stopband.
* **Order of a Filter**: Denotes the number of poles used in the $z$-domain, which directly corresponds to the number of delay elements required in its implementation.
* **Ripple**: Variation in attenuation (in dB) within the pass-band or stop-band.
* **Rolloff**: The slope of the filter's magnitude response in the transition region, specified in dB/octave or dB/decade.
* **Insertion Loss (IL)**: The minimum attenuation in the pass-band.
* **Notch Depth**: The maximum attenuation between two pass-bands in a notch filter, specified in dB.`
      },
      {
        name: 'Filter Classification',
        explanation: `Filters can be classified based on multiple orthogonal properties:
* **Domain**: Analog vs. Digital; Time vs. Frequency.
* **Structure**: Finite Impulse Response (FIR) vs. Infinite Impulse Response (IIR).
* **Frequency Type**: Low-pass, high-pass, band-pass, band-stop, and all-pass.
* **Stability and Causality**: Stable/unstable, causal/non-causal.
* **Phase Characteristics**: Linear-phase, minimum-phase, or all-pass (typically used for delay shaping).
* **Design Family**: Classic forms such as Butterworth, Chebyshev (Type I and II), Elliptic, and Bessel.
* **Realization Architecture**: Direct form, cascade (biquad sections), parallel, and lattice implementations.
* **Adaptivity**: Fixed filters vs. Adaptive filters (e.g., LMS, RLS algorithms).`
      },
      {
        name: 'Direct Design of Infinite Impulse Response (IIR) Filters',
        explanation: `The direct design method for IIR filters involves manually placing poles and zeros on the complex $z$-plane to explicitly shape the frequency response. This approach is highly suitable for simple digital filters.
* **Transfer Function Realization**: A digital filter transfer function takes the form $H(z)$. For example, a simple first-order lowpass filter can be formulated as $H(z) = k \\frac{z+a}{z+b}$. By evaluating design constraints—such as demanding a unity DC gain ($H(1) = 1$) and a predefined cutoff frequency where the gain drops appropriately—the coefficients $a$, $b$, and the scaling factor $k$ can be analytically solved.
* **Notch Filter Design Example**: To completely reject a specific notch frequency $f_N$, zeros are placed precisely on the unit circle at complex conjugate angles corresponding to $f_N$. To ensure the notch bandwidth is exceedingly narrow without affecting the rest of the passband, poles are placed closely behind the zeros on the exact same radial lines (e.g., at a radius of $r = 0.92$). The resulting transfer function will incorporate conjugate pairs to maintain strictly real-valued coefficients.`
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
The **cut-off frequency** ($\\omega_c$ or $f_c$) is the boundary frequency that separates the passband from the transition band. Mathematically, it is typically defined as the frequency at which the filter's magnitude response drops to $\\frac{1}{\\sqrt{2}}$ (approx. 0.707) of its maximum passband value. This corresponds to a signal power reduction of half, often referred to as the **-3dB point**.

**Q4. Explain the concept of rolloff in filter design. How is it measured, and what does it indicate about a filter’s performance?**
Rolloff refers to the steepness or the rate of attenuation in the transition band of a filter, bridging the passband and stopband. It is typically measured in decibels per decade (dB/decade) or decibels per octave (dB/octave). A higher (steeper) rolloff means the filter transitions more quickly from passing signals to stopping them, which indicates a sharper and more ideal frequency separation. Higher rolloff usually requires a higher-order filter.

**Q5. Define the following terms in the context of filter design: passband, stopband, cutoff frequency, bandwidth, ripple, rolloff, insertion loss, and stop-band attenuation.**
- **Passband**: The range of frequencies that a filter allows to pass through with minimal or no attenuation.
- **Stopband**: The range of frequencies that the filter highly attenuates or rejects.
- **Cutoff frequency ($f_c$)**: The frequency boundary that defines the edge of the passband. It's conventionally the point where the signal power is reduced to half ($-3$ dB point) of the passband value.
- **Bandwidth**: The width of the passband, defined as the difference between the upper and lower cutoff frequencies (for bandpass filters) or just the cutoff frequency itself (for low-pass).
- **Ripple**: Small, periodic fluctuations in the amplitude response within the passband or stopband.
- **Rolloff**: The rate at which the filter's attenuation increases in the transition region between the passband and stopband.
- **Insertion loss**: The loss of signal power resulting from the insertion of a filter into a circuit or transmission line, typically expressed in decibels (dB).
- **Stop-band attenuation**: The minimum amount of attenuation applied to frequencies in the stopband, describing how effectively unwanted frequencies are blocked.

**Q6. Explain the significance of the order of a filter. How does it relate to the number of poles in the z-domain?**
The order of a filter dictates the mathematical complexity of its transfer function and determines how sharply the filter rolls off between the passband and stopband. A higher-order filter achieves a steeper rolloff and better frequency separation at the cost of increased computational complexity, phase distortion, and potential instability. In the z-domain, the order of an IIR filter corresponds to the maximum number of poles (or zeros, whichever is greater). For instance, an $N$-th order IIR filter has up to $N$ poles, which define the feedback terms in the time domain.

**Q7. What is ripple in the context of filter design? How does it affect the filter’s performance in the passband and stopband?**
Ripple refers to the periodic fluctuation in the magnitude of a filter's frequency response. 
- **Passband ripple** causes some passing frequencies to be slightly amplified or attenuated relative to others, introducing amplitude distortion. 
- **Stopband ripple** means the attenuation fluctuates; some stopband frequencies are attenuated less than others, though still meeting a minimum attenuation spec. 
Allowing ripple (e.g., in Chebyshev or Elliptic filters) often yields a much steeper transition band for a given filter order compared to monotonic filters with no ripple (e.g., Butterworth).

**Q8. Describe the trade-offs involved in filter design between the transition band, filter order, and ripple amplitude.**
In filter design, achieving a narrow transition band (a steep rolloff) requires either increasing the filter order or allowing larger ripple amplitude:
- **Increasing filter order**: Improves steepness without introducing ripple, but it costs more computational resources, increases group delay, and may lead to numerical instability.
- **Increasing ripple**: Allowing larger ripple in the passband or stopband can significantly sharpen the transition band without requiring a higher filter order, but it introduces amplitude distortion at the specific frequencies where ripples peak or trough.

**Q9. Explain the concept of a chirp signal. Sketch its waveform and also the effect of different types of filters on it (low-, high-, bandpass).**
A chirp signal is a signal in which the frequency continuously increases (up-chirp) or decreases (down-chirp) over time. Its waveform visually resembles a sine wave that gets progressively compressed (higher frequency) or expanded (lower frequency) as time advances.
- **Low-pass Filter**: When an up-chirp is passed through a low-pass filter, the output amplitude starts high and then gradually attenuates to zero as the chirp's frequency sweeps past the filter's cutoff.
- **High-pass Filter**: The output amplitude starts heavily attenuated (near zero) and then grows to unity as the chirp sweeps up into the high-frequency passband.
- **Band-pass Filter**: The output amplitude starts low, increases as the chirp enters the passband, and then attenuates again as the chirp frequency exceeds the upper cutoff boundary.

**Q10. What are the different approaches to designing an IIR filter?**
Common approaches include:
1. **Direct Design (Pole-Zero Placement)**: Geometrically placing poles and zeros directly in the z-plane based on desired resonances and anti-resonances.
2. **Analog Prototype Transformation**: Designing a continuous-time analog filter (e.g., Butterworth, Chebyshev, Elliptic) and transforming it into the discrete-time z-domain. 
3. **Optimization/Numerical Methods**: Using iterative algorithms to find filter coefficients that minimize the error between the desired and actual frequency response.

**Q11. Describe the process of digitizing an analog filter. What are the common methods used for this purpose?**
Digitizing an analog filter involves mapping a continuous-time transfer function $H(s)$ to a discrete-time transfer function $H(z)$ while preserving key characteristics like the frequency response shape or the impulse response. 
Common methods include:
1. **Bilinear Transform**: Maps the entire $j\omega$ axis in the s-plane to the unit circle in the z-plane. It avoids aliasing and guarantees stability but warps the frequency scale.
2. **Impulse Invariance Method**: Maps the continuous impulse response $h(t)$ directly to discrete time $h[n] = h(nT)$. It preserves time-domain characteristics but is susceptible to frequency aliasing.
3. **Matched Z-Transform**: Maps the poles and zeros directly from the s-plane to the z-plane via $z = e^{sT}$.

**Q12. What is the significance of the Nyquist frequency in digital filter design? How does it relate to the sampling rate? How is it represented in the z-plane?**
The Nyquist frequency is exactly half the sampling rate ($f_s / 2$). It represents the absolute highest frequency that can be accurately captured or represented in a discrete-time system without aliasing. In digital filter design, all operable frequency bands and cutoffs must lie between $0$ Hz and the Nyquist frequency. In the z-plane, the Nyquist frequency is represented by the point $z = -1$ on the unit circle (an angle of $\pi$ radians).

**Q13. Design a lowpass filter for signals sampled at 16 Hz such that the direct current gain is unity and the cutoff frequency is at 4Hz. Hint: Use the direct design method with a single zero and pole.**
- **Sampling rate ($f_s$)**: $16$ Hz.
- **Cutoff frequency ($f_c$)**: $4$ Hz.
- The corresponding digital angular frequency is $\omega_c = 2\pi (f_c / f_s) = 2\pi (4 / 16) = \pi / 2$.
- For a first-order low-pass filter, place a zero at $z = -1$ (Nyquist, to stop high frequencies) and a pole at $z = a$ on the real axis.
- The transfer function is $H(z) = K \frac{z + 1}{z - a}$.
- At the cutoff $\omega = \pi/2$, $z = j$. The squared magnitude must be half the DC power ($-3$ dB):
  $$|H(j)|^2 = K^2 \frac{|j + 1|^2}{|j - a|^2} = K^2 \frac{2}{1 + a^2}$$
- At DC ($z = 1$), the gain is unity:
  $$H(1) = K \frac{2}{1 - a} = 1 \implies K = \frac{1 - a}{2}$$
- Substituting $K$ into the magnitude squared equation and setting it to half the DC gain squared ($1/2$):
  $$\left(\frac{1 - a}{2}\right)^2 \frac{2}{1 + a^2} = \frac{1}{2} \implies \frac{(1 - a)^2}{2(1 + a^2)} = \frac{1}{2} \implies (1 - a)^2 = 1 + a^2 \implies a = 0$$
- If $a = 0$, the pole is at the origin, and $K = 1/2$.
- **Resulting Filter**: $H(z) = 0.5 \frac{z + 1}{z} = 0.5 + 0.5z^{-1}$ (A simple two-point moving average).

**Q14. What is a notch filter? What parameters are critical in defining the filter’s characteristics?**
A notch filter is a highly targeted band-stop filter with an extremely narrow stopband. It is used to reject a single frequency or a very narrow band of frequencies (like 60 Hz power-line noise) while leaving the rest of the spectrum intact.
Critical parameters:
- **Notch Frequency ($f_0$)**: The exact frequency targeted for maximum rejection.
- **Bandwidth**: The width of the rejected frequency band, typically measured at $-3$ dB.
- **Q-factor**: The ratio of notch frequency to bandwidth ($f_0 / BW$), indicating the sharpness of the notch.
- **Notch Depth**: The maximum attenuation (in dB) achieved at the notch frequency.

**Q15. Explain the concept of notch depth in the context of notch filters. How is it related to stop-band attenuation?**
Notch depth is the maximum reduction in signal amplitude at the exact center frequency of the notch filter, usually expressed in decibels (dB). Because a notch filter's stopband is effectively just a single point (or a tiny sliver of frequencies), the notch depth serves as the peak stop-band attenuation. A deeper notch indicates a more complete suppression of the unwanted frequency.

**Q16. Design a notch filter with notch frequency of 20 Hz for signals sampled at 160 Hz. Attenuation should be of at least 40 dB and the bandwidth of 4 Hz. The gain in the passband should be unity. Hint: Use the direct design method with two poles and two zeros.**
- **Digital notch frequency**: $\omega_0 = 2\pi (20 / 160) = \pi / 4$.
- Place two zeros on the unit circle at angles $\pm \pi/4$ to create an infinite depth notch:
  $z_{1,2} = e^{\pm j \pi/4}$.
- Place two poles at the same angles but slightly inside the unit circle at radius $r$ to keep the notch narrow:
  $p_{1,2} = r e^{\pm j \pi/4}$.
- Bandwidth relation: $r \approx 1 - \pi \frac{BW}{f_s} = 1 - \pi \left(\frac{4}{160}\right) = 1 - \frac{\pi}{40} \approx 0.9215$.
- The unscaled transfer function is $H_{unscaled}(z) = \frac{(z - e^{j\pi/4})(z - e^{-j\pi/4})}{(z - r e^{j\pi/4})(z - r e^{-j\pi/4})} = \frac{z^2 - 2z\cos(\pi/4) + 1}{z^2 - 2rz\cos(\pi/4) + r^2}$.
- To achieve unity gain at DC ($z = 1$), calculate a scaling factor $K$:
  $$H_{unscaled}(1) = \frac{1 - \sqrt{2} + 1}{1 - \sqrt{2}r + r^2} \approx \frac{0.586}{1 - 1.414(0.9215) + 0.849} \approx \frac{0.586}{0.546} \approx 1.073$$
  $K = 1 / H_{unscaled}(1) \approx 0.932$.
- **Resulting Filter**: $H(z) = 0.932 \frac{z^2 - 1.414z + 1}{z^2 - 1.303z + 0.849}$.

**Q17. Implement a Python script to compute and plot the frequency response of the IIR filter designed in the previous question.**
\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Filter specifications
fs = 160.0
f0 = 20.0
bw = 4.0

# Calculate digital frequency and pole radius
w0 = 2 * np.pi * f0 / fs
r = 1 - (np.pi * bw / fs)

# Transfer function coefficients: H(z) = K * (z^2 - 2*cos(w0)*z + 1) / (z^2 - 2*r*cos(w0)*z + r^2)
b = [1, -2 * np.cos(w0), 1]
a = [1, -2 * r * np.cos(w0), r**2]

# Calculate K to ensure DC gain is 1
K = sum(a) / sum(b)
b = [K * coef for coef in b]

# Compute frequency response
w, h = signal.freqz(b, a, fs=fs)

# Plot magnitude response
plt.figure(figsize=(10, 6))
plt.plot(w, 20 * np.log10(np.abs(h)), 'b', linewidth=2)
plt.title('Frequency Response of Notch Filter (20 Hz)')
plt.ylabel('Magnitude [dB]')
plt.xlabel('Frequency [Hz]')
plt.grid(True)
plt.show()
\`\`\`

**Q18. Explain the bilinear transform method for designing digital filters from analog prototypes. Provide an example.**
The bilinear transform is a mathematical mapping used to convert a continuous-time analog transfer function $H(s)$ into a discrete-time digital transfer function $H(z)$. It Maps the entire $j\omega$ (imaginary) axis in the s-plane onto the unit circle in the z-plane. This mapping avoids aliasing entirely and guarantees that a stable analog filter always produces a stable digital filter.
It works by substituting $s$ with:
$$s = \frac{2}{T} \frac{1 - z^{-1}}{1 + z^{-1}}$$
where $T$ is the sampling period.
**Example**: Digitizing a simple 1st-order analog lowpass filter $H(s) = \frac{\Omega_c}{s + \Omega_c}$:
$$H(z) = \frac{\Omega_c}{\frac{2}{T} \frac{1 - z^{-1}}{1 + z^{-1}} + \Omega_c} = \frac{\Omega_c (1 + z^{-1})}{\frac{2}{T} (1 - z^{-1}) + \Omega_c (1 + z^{-1})}$$
After expanding, you get a valid IIR digital filter function $H(z)$.

**Q19. Derive the bilinear transformation formula.**
The bilinear transform approximates continuous integration using the trapezoidal rule.
The continuous-time integration definition:
$$y(t) = \int_{0}^{t} x(\tau) d\tau$$
In the Laplace domain, integration is represented by $H(s) = \frac{1}{s}$, meaning $Y(s) = \frac{1}{s} X(s)$.
In discrete-time, applying the trapezoidal approximation to the integral gives the difference equation:
$$y[n] = y[n-1] + \frac{T}{2} (x[n] + x[n-1])$$
Taking the Z-transform:
$$Y(z) = z^{-1} Y(z) + \frac{T}{2} (X(z) + z^{-1} X(z))$$
$$Y(z) (1 - z^{-1}) = \frac{T}{2} X(z) (1 + z^{-1})$$
Rearranging for the transfer function $H(z) = \frac{Y(z)}{X(z)}$:
$$H(z) = \frac{T}{2} \frac{1 + z^{-1}}{1 - z^{-1}}$$
Equating the continuous integrator $\frac{1}{s}$ to the discrete integrator $H(z)$:
$$\frac{1}{s} \approx \frac{T}{2} \frac{1 + z^{-1}}{1 - z^{-1}}$$
Solving for $s$ yields the bilinear transform substitution:
$$s = \frac{2}{T} \frac{1 - z^{-1}}{1 + z^{-1}}$$

**Q20. Design a low-pass IIR filter with a cutoff frequency of 5 Hz and a sampling frequency of 20 Hz using the bilinear transform method. Provide the filter coefficients.**
- **Sampling rate**: $f_s = 20$ Hz $\implies T = 0.05$ s.
- **Digital cutoff frequency**: $\omega_c = 2\pi (5 / 20) = \pi/2$ rad/sample.
- **Pre-warped analog cutoff frequency**: 
  $$\Omega_c = \frac{2}{T} \tan\left(\frac{\omega_c}{2}\right) = \frac{2}{0.05} \tan\left(\frac{\pi}{4}\right) = 40 \times 1 = 40 \text{ rad/s}$$
- **Analog prototype** (1st-order Butterworth):
  $$H(s) = \frac{\Omega_c}{s + \Omega_c} = \frac{40}{s + 40}$$
- **Apply Bilinear Transform substitution**:
  $$H(z) = \frac{40}{40 \frac{1 - z^{-1}}{1 + z^{-1}} + 40} = \frac{1}{\frac{1 - z^{-1}}{1 + z^{-1}} + 1}$$
  $$H(z) = \frac{1 + z^{-1}}{(1 - z^{-1}) + (1 + z^{-1})} = \frac{1 + z^{-1}}{2} = 0.5 + 0.5z^{-1}$$
- **Coefficients**:
  - Numerator: $b_0 = 0.5$, $b_1 = 0.5$
  - Denominator: $a_0 = 1.0$, $a_1 = 0.0$

**Q21. Describe the concept of pre-warping in the bilinear transform method. Why is it necessary and how is it applied?**
Because the bilinear transform compresses the infinite analog frequency domain into the finite digital frequency domain ($0$ to Nyquist), the mapping between analog frequencies ($\Omega$) and digital frequencies ($\omega$) is highly non-linear. This distortion is called "frequency warping".
If we map an analog filter directly, its cutoff frequency will land at the wrong digital frequency. To compensate, we use **pre-warping**: we intentionally shift the analog design cutoff frequency so that, after the non-linear transformation, it lands exactly at our target digital cutoff frequency.
It is applied by designing the analog prototype using the pre-warped frequency:
$$\Omega_c = \frac{2}{T} \tan\left(\frac{\omega_c}{2}\right)$$

**Q22. Estimate the correction in the cutoff frequency $\omega_c$ for a sampling rate of 100 Hz using the prewarping method.**
Let the desired digital cutoff frequency be $f_c$. The digital angular frequency is $\omega_c = \frac{2\pi f_c}{100}$.
Without prewarping (linear mapping), the corresponding analog frequency would be $\Omega_{linear} = \frac{\omega_c}{T} = 200\pi \frac{f_c}{100} = 2\pi f_c$.
Using prewarping, the corrected analog frequency is:
$$\Omega_{prewarped} = \frac{2}{T} \tan\left(\frac{\omega_c}{2}\right) = 200 \tan\left(\frac{\pi f_c}{100}\right)$$
For small $f_c$ (low frequencies), $\tan(x) \approx x$, so $\Omega_{prewarped} \approx 2\pi f_c$, requiring very little correction. However, as $f_c$ approaches the Nyquist frequency ($50$ Hz), $\tan(x)$ grows non-linearly toward infinity. For instance, at $f_c = 25$ Hz, $\Omega_{linear} = 50\pi \approx 157$ rad/s, while $\Omega_{prewarped} = 200 \tan(\pi/4) = 200$ rad/s. The correction accommodates for the divergence of the tangent function as frequencies increase.

**Q23. Derive up to second order the pre-warp correction using the MacLaurin series.**
The pre-warping relationship is:
$$\Omega = \frac{2}{T} \tan\left(\frac{\omega}{2}\right)$$
Using the Maclaurin series expansion for the tangent function ($\tan(x) \approx x + \frac{x^3}{3} + \frac{2x^5}{15} + \dots$):
Substitute $x = \frac{\omega}{2}$:
$$\tan\left(\frac{\omega}{2}\right) = \left(\frac{\omega}{2}\right) + \frac{1}{3} \left(\frac{\omega}{2}\right)^3 + \dots = \frac{\omega}{2} + \frac{\omega^3}{24} + \dots$$
Then $\Omega$ is expanded as:
$$\Omega = \frac{2}{T} \left( \frac{\omega}{2} + \frac{\omega^3}{24} + \dots \right) = \frac{\omega}{T} + \frac{\omega^3}{12T}$$
Since $\frac{\omega}{T}$ is simply the desired linear analog frequency $\Omega_{linear}$, the pre-warped frequency $\Omega$ can be rewritten as:
$$\Omega \approx \Omega_{linear} + \frac{T^2 \Omega_{linear}^3}{12}$$
Because the MacLaurin series for tangent only contains odd power terms, the second-order term ($\omega^2$) is strictly zero. The first non-linear correction factor is the cubic term $\frac{\omega^3}{12T}$.

**Q24. Explain the impulse-invariant method for designing IIR filters. How does it work and what are its main advantages and disadvantages?**
The impulse-invariant method creates a digital IIR filter by directly sampling the impulse response of a continuous-time analog filter prototype.
- **How it works**: An analog filter $H(s)$ is transformed to its time-domain impulse response $h(t)$. This response is then sampled at regular intervals $T$ to yield a discrete sequence $h[n] = h(nT)$. The Z-transform is then applied to $h[n]$ to produce the digital transfer function $H(z)$. In practice, analog poles $s_k$ are mapped to digital poles $z_k = e^{s_k T}$.
- **Advantages**: It perfectly preserves the shape of the analog filter's impulse response in the time domain. Because the frequency mapping is entirely linear ($\omega = \Omega T$), it avoids the frequency warping introduced by the bilinear transform.
- **Disadvantages**: The periodic sampling causes the frequency response to alias. The continuous frequency response copies and wraps around every multiple of the sampling rate, making it inappropriate for designing high-pass or band-stop filters that don't naturally attenuate high frequencies prior to Nyquist.

**Q25. Given the transfer function $H(z) = \frac{0.465z}{z-0.535}$, verify the correctness of this representation for a low-pass filter designed using the impulse-invariant method.**
Rewrite $H(z)$:
$$H(z) = \frac{0.465z}{z - 0.535} = \frac{0.465}{1 - 0.535z^{-1}}$$
The inverse Z-transform yields the impulse response:
$$h[n] = 0.465 \cdot (0.535)^n u[n]$$
This is an exponentially decaying sequence, typical of a sampled 1st-order analog low-pass filter $H(s) = \frac{A}{s + a}$, whose impulse response is $h(t) = A e^{-at} u(t)$.
In the impulse-invariant method, the continuous response is sampled as $h[n] = T h(nT) = AT e^{-anT} u[n]$:
- The pole mapping checks out: $e^{-aT} = 0.535 \implies -aT = \ln(0.535) < 0$. The pole is at $0.535$, which is purely real and inside the unit circle, confirming standard stable low-pass behavior.
- Next, we check the DC gain at $\omega = 0$ ($z = 1$):
  $$H(1) = \frac{0.465}{1 - 0.535} = \frac{0.465}{0.465} = 1$$
Because the DC gain is exactly unity and the system is stable with a positive real pole modeling exponential decay, it confirms the representation is correct for a normalized digital low-pass filter designed via impulse invariance.

**Q26. Describe the process of mapping poles and zeros from the s-plane to the z-plane. Why is this important in digital filter design?**
Mapping poles and zeros translates the stability criteria and frequency responses from the continuous-time domain (s-plane) to the discrete-time domain (z-plane).
- **Process**: The exact mapping depends on the discretization method.
  - In the **Bilinear Transform**, $s$ is substituted with $\frac{2}{T} \frac{1 - z^{-1}}{1 + z^{-1}}$. This mathematically maps the left half of the s-plane (stable region) to the interior of the unit circle ($|z| < 1$) in the z-plane, and maps the imaginary $j\omega$ axis entirely onto the perimeter of the unit circle.
  - In the **Impulse-Invariant Method**, analog poles $s_k$ map to digital poles at $z_k = e^{s_k T}$. Zeros are not mapped directly but derived via partial fraction expansion.
- **Importance**: This mapping is critical because it ensures that a stable analog prototype directly yields a stable digital filter. It dictates how resonances, attenuation, and phase shifts behave in the sampled system relative to the continuous original. Any pole with a negative real part in the s-plane *must* map inside the unit circle in the z-plane to maintain stability.

---

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
    labWalkthrough: `## 🔬 Lab 10 Walkthrough
This section provides a walkthrough of the provided code for Lab 10, exploring the characteristics and behavior of continuous and discrete Linear Time-Invariant (LTI) filters using \`scipy.signal\`.

### Continuous LTI System Impulse Response (Cell 0)
\`\`\`python
# impulse response of a simple cont. LTI
cs = signal.lti([10], [1, 10])
t, sig = cs.impulse(T = arange(0, 10, 0.01))    
plot(t, sig, '.')
yscale('log')
plot(t, 10*exp(-10*t))
\`\`\`
- **What it does**: Defines a 1st-order continuous-time LTI system with the transfer function $H(s) = \frac{10}{s + 10}$.
- **Observations**: It computes the impulse response of the system and plots it. The theoretical impulse response is an exponential decay: $h(t) = 10e^{-10t}u(t)$. The code overlays the simulated response with the mathematical theoretical curve to show they match perfectly. The use of \`yscale('log')\` maps the exponential decay to a linearly descending straight line, making verification easy.

### Discrete LTI System Impulse Response (Cell 1 & 2)
\`\`\`python
ds = signal.dlti([1], [1, -0.5])
n, h = ds.impulse()
stem(n, h[0], 'o')
show()
\`\`\`
- **What it does**: Defines a discrete-time LTI filter using numerator \`[1]\` and denominator \`[1, -0.5]\`, producing the transfer function $H(z) = \frac{1}{1 - 0.5z^{-1}}$. This is a simple recursive moving average (low-pass) filter.
- **Observations**: In Cell 1, \`ds.impulse()\` calculates the discrete impulse response, plotting it via a \`stem\` plot. The response is a decaying sequence. 
- **Cell 2 Verification**: Cell 2 constructs the theoretical array $0.5^n$ using \`ht[1:] = 0.5**arange(...)\` and plots it against the measured impulse response. The plots perfectly overlap, verifying the expected geometric decay formula for a real pole at $z = 0.5$.

### Second-Order Discrete System and Oscillation (Cell 3, 4, 5)
\`\`\`python
w, h = signal.freqz([1], [1, -1, 0.5])
ds = signal.dlti([1], [1, -1, 0.5])
n, hn = ds.impulse()
\`\`\`
- **What it does**: Evaluates a 2nd-order discrete IIR filter with transfer function $H(z) = \frac{1}{1 - z^{-1} + 0.5z^{-2}}$.
- **Poles**: The roots of $z^2 - z + 0.5 = 0$ are at $z = 0.5 \pm 0.5j$. Converting to polar form, the radius is $r = \frac{1}{\sqrt{2}} \approx 0.707$ and the angle is $\theta = \pm \pi/4$.
- **Analytical Overlay**: Because the poles have a non-zero imaginary component, the impulse response is an underdamped, exponentially decaying sinusoid. Cell 4 implements the theoretical closed-form solution:
  $$h[n] = 2 \sin((n-1)\pi/4) \cdot \left(\frac{1}{\sqrt{2}}\right)^{n-1}$$
  The plot clearly shows the red analytical line intercepting exactly at the stems. 
- **Logarithmic View (Cell 5)**: Cell 5 plots the absolute value of the analytical sequence on a semi-logarithmic scale. The peaks of the oscillation fall perfectly along a straight line, explicitly illustrating that the envelope decays exponentially.

### Analyzing Poles, Zeros, and Frequency Response (Cell 6 & 7)
\`\`\`python
# to_zpk() method of an LTI system returns the zeros and poles
print(ds.to_zpk())

# to verify the frequency response (magnitude and phase)
w, H = ds.freqresp() # complex freq. response including both
w, gain, phase = ds.bode(w = w)
semilogy(w, 20*log10(abs(H)), 'r-', linewidth=15, alpha=0.3)
semilogy(w, gain, 'k-', linewidth=2, alpha=1)
\`\`\`
- **Pole-Zero Extraction**: Cell 6 uses the \`.to_zpk()\` method to automatically calculate and output the exact zeros and poles of the transfer function.
- **Frequency Response Verification**: Cell 7 calculates the frequency response of the filter using two distinct SciPy functions:
  1. \`freqresp()\`: Computes the complex array $H(e^{j\omega})$ from which magnitude is manually derived using $20\log_{10}(|H|)$.
  2. \`bode()\`: Directly calculates the magnitude gain in decibels.
- **Observations**: Plotting the manually calculated dB magnitude (thick red line) beneath the direct output of \`bode()\` (thin black line) shows a 100% overlap, verifying that both methods correctly compute the exact same frequency domain magnitude response.`,
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
        name: 'IIR Filter Design via Analogue Prototypes',
        explanation: `For sophisticated digital IIR filters, direct $z$-plane design is too complex. Instead, established continuous-time analogue filter prototypes $H_a(s)$ are designed first, and then transformed into discrete-time digital filters $H_d(z)$ via $s$-to-$z$ mapping techniques. The main analogue prototype families are:
* **Butterworth Filters**: Deliver a monotonically decreasing gain with absolutely no ripples in either the passband or stopband. However, they suffer from a relatively slow rolloff.
* **Chebyshev Type I**: Distribute the gain error uniformly as equiripples in the passband while remaining monotonic in the stopband.
* **Chebyshev Type II**: Distribute the gain error uniformly as equiripples in the stopband while remaining monotonic in the passband.
* **Elliptic Filters**: Feature equiripple behavior in both the passband and stopband, yielding the mathematically steepest transition-band rolloff for any given filter order.`
      },
      {
        name: 'Bilinear Transform and Frequency Pre-warping',
        explanation: `The Bilinear Transform is a standard $s$-to-$z$ domain mapping that converts the entire infinite continuous $s$-plane into the discrete $z$-plane by using the substitution $s = \\frac{2}{T}\\frac{z-1}{z+1}$. 
* **Derivation**: It originates from the first-order Maclaurin series approximation of the exact logarithmic mapping $s = \\frac{1}{T}\\ln(z)$. It structurally preserves system stability because the left-half $s$-plane maps strictly to the inside of the unit circle in the $z$-plane.
* **Frequency Warping**: Because the infinite frequency range $(0, \\infty)$ of the analogue filter is non-linearly compressed into the finite Nyquist interval $[0, f_s/2]$, a severe frequency distortion occurs near the Nyquist limit.
* **Pre-warping**: To ensure that a critical digital cutoff frequency $\\omega_c$ perfectly matches the design target, the analogue prototype must be intentionally designed using an artificially pre-warped frequency: $\\omega_c' = \\frac{2}{T}\\tan\\left(\\frac{\\omega_c T}{2}\\right)$.`
      },
      {
        name: 'Impulse-Invariant and Pole-Zero Matching Methods',
        explanation: `* **Impulse-Invariant Method**: This mapping guarantees that the discrete impulse response perfectly matches the sampled continuous impulse response: $h[n] = h(nT)$. For a first-order pole $H_a(s) = \\frac{\\omega_c}{s+\\omega_c}$, the continuous time-domain response $h(t) = \\omega_c e^{-\\omega_c t}$ translates in the $z$-domain to $H_d(z) = \\frac{\\omega_c T}{1 - e^{-\\omega_c T}z^{-1}}$. While it preserves time-domain shape, it heavily suffers from spectral aliasing and requires normalization to maintain unity DC gain.
* **Pole-Zero Matching Technique**: The analogue poles and zeros $s_k$ are directly mapped to digital poles and zeros using the exact exponential relation $z_k = e^{s_k T}$. Because this naive mapping does not natively place zeros at the Nyquist frequency ($z = -1$), artificial zeros are often manually appended to the transfer function, followed by the derivation of a gain scaling factor $k$ to perfectly match the filter gain at a chosen reference frequency (like $\\omega=0$ or $\\omega_N$).`
      },
    ],

    homeworkGuide: `## 📝 Homework 11 Solutions\n\n[Open HW PDF →](/pdfs/hw11.pdf)\n\n## 📝 Homework 11 Solutions

### 📌 Problem 1: What do we mean by a finite impulse response (FIR) filter? How does it differ from IIR filters in terms of their linear constant-coefficient difference equation?
A **Finite Impulse Response (FIR)** filter is a filter whose impulse response $h[n]$ is of finite duration, meaning it settles to zero in finite time. In terms of the linear constant-coefficient difference equation (LCCDE), the output of an FIR filter depends only on the current and past input values, and not on past output values.
For an FIR filter, the difference equation is given by:
$$ y[n] = \\sum_{k=0}^{N} b_k x[n-k] $$
In contrast, an **Infinite Impulse Response (IIR)** filter depends on both past inputs and past outputs (it has feedback). Its difference equation is:
$$ y[n] = \\sum_{k=0}^{N} b_k x[n-k] - \\sum_{k=1}^{M} a_k y[n-k] $$
Thus, the main difference in the LCCDE is that FIR filters have $a_k = 0$ for all $k \\ge 1$, which means they have no feedback terms.

### 📌 Problem 2: Compare FIR and IIR filters.
- **Impulse Response Duration**: FIR filters have a finite impulse response, whereas IIR filters have an infinite duration impulse response.
- **Phase Response**: FIR filters can be easily designed to have exact linear phase (which implies a constant group delay). IIR filters typically have a non-linear phase response.
- **Stability**: FIR filters are inherently strictly bounded-input bounded-output (BIBO) stable since their poles are located at the origin (in the $z$-domain). IIR filters can become unstable if their poles move outside the unit circle.
- **Filter Order and Complexity**: For a given set of magnitude specifications (e.g., sharp cutoff), FIR filters generally require a much higher filter order (more coefficients) compared to IIR filters, which means higher computational cost (more multiplications and additions per sample).
- **Feedback**: FIR filters are non-recursive (no feedback), while IIR filters are recursive (feedback is present).

### 📌 Problem 3: Explain the ad
<truncated 27928 bytes>
 are:
$$ b_{\\text{low, norm}}[n] = \\frac{b_{\\text{low}}[n]}{\\sum_{n=0}^N b_{\\text{low}}[n]} $$

### 📌 Problem 29: Show that, to normalize the Nyquist-frequency gain of a high-pass FIR filter, the coefficients $b_{\\text{high}}[n]$ should be divided by $|\\sum_{n=0}^N (-1)^n b_{\\text{high}}[n]|$.
The Nyquist frequency corresponds to the normalized angular frequency $\\omega = \\pi$.
The frequency response at the Nyquist frequency is:
$$ H(e^{j\\pi}) = \\sum_{n=0}^{N} b_{\\text{high}}[n] e^{-j\\pi n} $$
Since $e^{-j\\pi} = -1$, this becomes:
$$ H(e^{j\\pi}) = \\sum_{n=0}^{N} b_{\\text{high}}[n] (-1)^n $$
To normalize the gain at the Nyquist frequency to $1$, we need to ensure that the magnitude $|H(e^{j\\pi})|$ equals $1$. We divide all coefficients by the absolute value of the unnormalized gain:
$$ \\text{Normalized Gain} = \\frac{|H(e^{j\\pi})|}{\\left| \\sum_{n=0}^{N} (-1)^n b_{\\text{high}}[n] \\right|} = 1 $$
Thus, we divide the coefficients by $\\left| \\sum_{n=0}^N (-1)^n b_{\\text{high}}[n] \\right|$.

### 📌 Problem 30: Show that, to normalize the gain of a band-pass FIR filter at the center frequency $f_0$, the coefficients $b_{\\text{band}}[n]$ should be divided by $|\\sum_{n=0}^N b_{\\text{band}}[n] e^{-j 2\\pi f_0 n / f_s}|$, $f_0 = \\frac{f_l + f_h}{2}$.
The center frequency of the band-pass filter is $f_0$. In terms of normalized angular frequency, $\\omega_0 = 2\\pi \\frac{f_0}{f_s}$.
The frequency response at $\\omega_0$ is:
$$ H(e^{j\\omega_0}) = \\sum_{n=0}^{N} b_{\\text{band}}[n] e^{-j \\omega_0 n} = \\sum_{n=0}^{N} b_{\\text{band}}[n] e^{-j 2\\pi \\frac{f_0}{f_s} n} $$
To normalize the filter such that the magnitude of the gain at the center frequency is exactly $1$, we divide the filter coefficients by the magnitude of the current gain at $f_0$.
Thus, each coefficient is divided by:
$$ \\left| H(e^{j\\omega_0}) \\right| = \\left| \\sum_{n=0}^{N} b_{\\text{band}}[n] e^{-j 2\\pi f_0 n / f_s} \\right| $$
This scaling factor ensures that the peak transmission strictly hits unity (0 dB).

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
    labWalkthrough: `## 🔬 Lab 11 Walkthrough
In this lab, we will manually design a second-order IIR notch filter, normalize its DC gain, and then use the Fourier (window) method to design low-pass, high-pass, and band-pass FIR filters.

## 1. Manually designed second-order notch filter

We want a digital notch filter with the following properties:
- attenuation of at least 40 dB at $f_0=20 $ Hz
- bandwidth of $\Delta f = 4 $ Hz
- the gain at 0 Hz should be 0 dB. 
- sampling frequency is $f_s=160 $ Hz

Let's find out the form of the transfer function $H(z)$.

\`\`\`python
from pylab import *
from scipy import signal

fs = 160
fn = fs/2
d = 1 - pi/40

# Define filter using poles and zeros mapping
ds = signal.dlti([1, -sqrt(2), 1], [1, -sqrt(2)*d, d**2])
w, gain, phase = ds.bode()
f = w/(2*pi)*fs

plot(f, gain, '.-', label='bode')
hlines([-3], [0], [80], color='red')
vlines([18, 22], [0, 0], [-200, -200],color='red')
grid()
\`\`\`

Let's zoom in to see how well we satisfied the requirements (DC gain + cut off freq. gain):

\`\`\`python
plot(f, gain, '.-', label='bode')
hlines([-3], [0], [80], color='red')
vlines([18, 22], [0, 0], [-200, -200],color='red')
xlim([0.0, 25])
ylim([-10, 1])
grid()
\`\`\`

### Normalizing the DC gain

However, at 0 Hz the gain is not exactly unity. We can fix it by reintroducing $k$ such that $|H(e^{j0})| = 1$: 

$$
k = \left|\frac{1 - 0.92\sqrt{2}+0.92^2}{2 - \sqrt{2}}\right|\approx 0.965
$$

Thus the filter coefficients are updated:

\`\`\`python
k = (1+d**2 - 2*d/sqrt(2))/(2 - sqrt(2))
print(f"Gain k: {k}")

ds = signal.dlti(k*array([1, -sqrt(2), 1]), [1, -sqrt(2)*d, d**2])
w, gain, phase = ds.bode()
f = w/(2*pi)*fs

plot(f, gain, '.-', label='bode')
axvline(18, linestyle=':', color='red')
axvline(22, linestyle=':', color='red')
axhline(-3, linestyle=':', color='red')
xlim([0, 25])
ylim([-10, 1])
grid()
\`\`\`

Observe that by normalizing the DC gain we (negligibly) distorted the gain at the cutoff frequency.

---

## 2. Designing a lowpass FIR filter using the Fourier (window) method

First, we generate an ideal lowpass filter (the sinc function) and apply a Hann window.

\`\`\`python
from pylab import *
from scipy import signal

fs, fl, N = 100, 20, 51
n = arange(N) - N//2 + 1e-12 # tiny shift so that we don't get 0/0

# Ideal sinc response
b_l = sin(2*pi*n*fl/fs)/(n*pi)

# Hann window
w = signal.windows.hann(N)
plot(n, w, '-', label='window')
plot(n, b_l, 'o-', label='sinc')

# Apply window
b_l *= w
plot(n, b_l, 'k.-', label='sinc * window')
legend()
grid()
\`\`\`

We normalize the DC gain and plot the Bode magnitude and phase response:

\`\`\`python
b_l /= b_l.sum() # Ensure that the gain at 0Hz is 1. 
ds = signal.dlti(b_l, [1], dt=1/fs)
o, gain, phase = ds.bode(w=1000)

fc = fl # Cutoff frequency
plot(o/(2*pi), gain)
axvline(fc, linestyle=':')
axhline(-3, linestyle=':')
grid()
\`\`\`

\`\`\`python
plot(o/(2*pi), phase)
grid()
\`\`\`

---

## 3. Designing a highpass FIR filter based on the above lowpass filter

To create a highpass filter, we subtract the ideal lowpass from a unit impulse.

\`\`\`python
fh = 40
n = arange(N) - N//2+1e-12 # tiny shift so that we don't get 0/0

# Ideal lowpass for high cutoff
b_h = sin(2*pi*n*fh/fs)/(n*pi)

# Apply window
b_h *= w

# Transform lowpass to highpass: delta[n] - h_lp[n]
b_h *= -1
b_h[N//2] += 1

# Normalize gain at Nyquist
b_h /= np.abs(np.sum(b_h * (-1) ** np.arange(N))) 

ds = signal.dlti(b_h, [1], dt=1/fs)
o, gain, phase = ds.bode(w=1000)
f = o/(2*pi)

plot(f, gain)
axvline(fh, linestyle=':')
axhline(-3, linestyle=':')
grid()
\`\`\`

Let's check the gain at the Nyquist frequency to ensure it's properly normalized:

\`\`\`python
# gain at the highest freq. close to unity (0dB) because the last freq. is not exactly pi
print(f"Gain at Nyquist: {gain[-1]} dB")

# Checking that indeed the gain at Nyquist is unity
o, H = signal.freqz(b_h, worN=array([pi]))
print(f"Absolute Gain at Nyquist: {abs(H)}")
\`\`\`

---

## 4. Designing a bandpass FIR filter based on the above lowpass filter

To build a bandpass filter, we subtract an ideal high-cutoff lowpass filter from a low-cutoff lowpass filter.

\`\`\`python
n = arange(N) - N//2+1e-12 # tiny shift so that we don't get 0/0

b_l = sin(2*pi*n*fl/fs)/(n*pi)
b_h = sin(2*pi*n*fh/fs)/(n*pi)

# Bandpass = LP_high_cut - LP_low_cut
b = b_l - b_h

# Taper with window
b *= w

# Normalization at center frequency
f0 = (fl + fh)/2
omega0 = 2*pi*f0/fs
H0 = np.sum(b * np.exp(-1j * omega0 * np.arange(N)))
b /= abs(H0)

ds = signal.dlti(b, [1], dt=1/fs)
o, gain, phase = ds.bode(w=1000)
f = o/(2*pi)

plot(f, gain)
axvline(fl, linestyle=':')
axvline(fh, linestyle=':')
axhline(-3, linestyle=':')
grid()
\`\`\`

This completes the FIR filter design walkthrough.`,
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
        name: 'Finite Impulse Response (FIR) Filters Overview',
        explanation: `FIR filters are non-recursive systems fully characterized by a difference equation evaluated over a finite history of inputs: $y[n] = \\sum_{k=0}^{M} b_k x[n-k]$.
* **Advantages**: They are unconditionally stable (as they entirely lack feedback poles), can be designed to possess exact linear phase (preventing phase distortion and providing a constant group delay across all frequencies), and are highly insensitive to numerical coefficient quantization.
* **Disadvantages**: To achieve steep transition bands equivalent to IIR filters, FIR filters demand a drastically higher order. This leads to intensive computational overhead, elevated memory usage for delay lines, and a substantial group delay of exactly $M/2$ samples.
* **Linear Phase Theorem**: A filter is mathematically guaranteed to exhibit a strictly linear phase response if its impulse response coefficients exhibit perfect symmetry (or perfect antisymmetry): $h[n] = h[N-1-n]$.`
      },
      {
        name: 'Fourier and Windowing Method for FIR Filter Design',
        explanation: `FIR filters are systematically designed by taking the continuous infinite impulse response of an ideal filter and adapting it for discrete, causal implementation.
* **Continuous Ideal Filter**: An ideal continuous low-pass filter with cutoff $f_c$ exhibits a perfectly rectangular frequency response $H(f) = \\text{rect}(f/2f_c)$. The inverse Fourier transform yields an infinite $sinc$ impulse response: $h(t) = 2f_c \\text{sinc}(\\pi(2tf_c))$.
* **Truncation and Shifting**: The continuous function is sampled at interval $T$. Because calculating an infinite series is impossible, it is symmetrically truncated to a finite range $-N/2 \\le n \\le N/2$. The sequence is then temporally shifted by $N/2$ samples to enforce causality: $b_n = h[n-N/2]$.
* **Windowing Optimization**: Abrupt boxcar truncation introduces severe spectral leakage and rippling (Gibbs phenomenon). To vastly improve the frequency response—widening the main lobe slightly while aggressively suppressing side lobes—the truncated coefficients are multiplicatively smoothed by a taper window $w[n]$: $b_{new}[n] = b[n] \\cdot w[n]$.
* Through algebraic combination of rectangular frequency blocks, High-pass, Band-pass, and Band-stop filters are easily formulated using superposition of corresponding $sinc$ impulse responses.`
      },
      {
        name: 'Short Time Fourier Transform (STFT) and Heisenberg Uncertainty',
        explanation: `The standard Fourier Transform completely integrates over time, losing all temporal localization of transient spectral phenomena. 
* **STFT Framework**: To counter this, STFT utilizes a sliding temporal window $w(t-\\tau)$ to analyze localized frequency content: $X(\\nu, \\tau) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^{\\infty} x(t) e^{-2\\pi i \\nu t} w(t-\\tau) dt$. The magnitude square of STFT yields the spectrogram.
* **Heisenberg Uncertainty Principle**: This principle dictates an immovable fundamental limit on time-frequency resolution: $\\sigma_t \\sigma_\\nu \\ge \\frac{1}{4\\pi}$. Consequently, a narrow window provides excellent time resolution but terrible frequency resolution, whereas a wide window isolates frequencies perfectly but obscures the precise timing of events.`
      },
      {
        name: 'Wavelet Transforms (CWT and DWT)',
        explanation: `Wavelet transforms resolve the fixed-window limitation of STFT by employing dynamic, scalable time-frequency atoms.
* **Continuous Wavelet Transform (CWT)**: Utilizes a localized 'mother wavelet' $\\psi(t)$ that is both translated by $\\tau$ and scaled by $s$: $\\psi_{\\tau, s}(t) = \\frac{1}{\\sqrt{s}} \\psi\\left(\\frac{t-\\tau}{s}\\right)$. This yields the projection: $W_\\psi[f](s, \\tau) = \\int_{-\\infty}^{\\infty} f(t) \\psi_{\\tau, s}^*(t) dt$. The wavelet must satisfy the exact admissibility criterion $\\int \\frac{|\\hat{\\psi}(\\omega)|^2}{|\\omega|} d\\omega < \\infty$ (which forces zero mean: $\\int \\psi(t) dt = 0$). Increasing the number of vanishing moments ($t^k \\psi(t) dt = 0$) improves noise suppression and polynomial trend elimination. CWT is a highly redundant, continuous representation equivalent to applying a bank of bandpass filters.
* **Discrete Wavelet Transform (DWT)**: Formulates an orthonormal computational basis using strict dyadic scales ($s = 2^m$) and translations ($\\tau = n 2^m$). Signal decomposition is efficiently performed using a dual-filter framework: a lowpass 'father wavelet' (scaling function $\\phi$) that extracts smooth approximations, and a bandpass 'mother wavelet' (wavelet function $\\psi$) that captures high-frequency details. Examples include the Haar and Daubechies families.`
      },
    ],

    homeworkGuide: `## 📝 Homework 12 Solutions\n\n[Open HW PDF →](/pdfs/hw12.pdf)\n\n## 📝 Homework 12 Solutions

### 📌 Problem 1: Filtering White Noise with a Bandpass FIR Filter

**Question:** Implement a Python script to filter white noise with a bandpass FIR filter and compare spectra.

**Solution:**

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import firwin, lfilter, welch

# 1. Generate white noise
fs = 1000  # Sampling frequency in Hz
t = np.arange(0, 10, 1/fs)  # 10 seconds of data
# Generate normally distributed white noise
white_noise = np.random.randn(len(t))

# 2. Design a bandpass FIR filter
lowcut = 100.0   # Lower cutoff frequency in Hz
highcut = 300.0  # Upper cutoff frequency in Hz
numtaps = 101    # Filter order + 1 (must be odd for bandpass)
# The firwin function calculates the FIR filter coefficients
# fs specifies the sampling rate, pass_zero=False creates a bandpass filter
fir_coeff = firwin(numtaps, [lowcut, highcut], fs=fs, pass_zero=False)

# 3. Apply the filter to the white noise
# lfilter applies the digital filter defined by fir_coeff to the noise array
filtered_noise = lfilter(fir_coeff, 1.0, white_noise)

# 4. Compare the spectra using Welch's method
# Calculate Power Spectral Density (PSD) for the original noise
f_orig, Pxx_orig = welch(white_noise, fs, nperseg=1024)
# Calculate PSD for the filtered noise
f_filt, Pxx_filt = welch(filtered_noise, fs, nperseg=1024)

# 5. Plot the results
plt.figure(figsize=(10, 6))
# Plot original noise spectrum
plt.semilogy(f_orig, Pxx_orig, label='Original White Noise')
# Plot filtered noise spectrum
plt.semilogy(f_filt, Pxx_filt, label='Filtered Noise (100-300 Hz Bandpass)')
plt.title('Power Spectral Density Comparison')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Power/Frequency (V^2/Hz)')
plt.legend()
plt.grid(True, which="both", ls="-", alpha=0.5)
plt.show()
\`\`\`

### 📌 Problem 2: Determining Sampling Frequency from EEG Power-Line Interference

**Question:** Load the data from the eeg.bin file, which contains a continuous sequence of 32-bit floating-point EEG samples. Determine the sampling frequency of the recording. Hint: EEG recordings often contain a narrow spectral peak caused by power-line interference.

**Solution:**

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# 1. Load the EEG signal
# The eeg.bin file contains 32-bit floating-point samples
# np.fromfile reads the binary data directly into a NumPy array
file_path = 'eeg.bin'
try:
    eeg_data = np.fromfile(file_path, dtype=np.float32)
except FileNotFoundError:
    # Creating dummy data for demonstration if file is missing
    print("eeg.bin not found. Using simulated data for demonstration.")
    fs_sim = 250  # Simulated sampling frequency
    t_sim = np.arange(0, 10, 1/fs_sim)
    eeg_data = np.sin(2 * np.pi * 50 * t_sim) + 0.1 * np.random.randn(len(t_sim))

# 2. Calculate the Fast Fourier Transform (FFT) to find the spectral peak
N = len(eeg_data)
# Applying a Hanning window to reduce spectral leakage
windowed_data = eeg_data * np.hanning(N)
spectrum = np.abs(np.fft.fft(windowed_data))

# Since the signal is purely real, we only need the first half of the spectrum
half_N = N // 2
spectrum = spectrum[:half_N]

# 3. Determine the normalized frequency peak
# Find the index of the maximum peak in the spectrum
# We skip the DC component (index 0) to avoid false positives
peak_index = np.argmax(spectrum[1:]) + 1 

# Normalized frequency (cycles per sample) corresponding to the peak
normalized_freq = peak_index / N

# 4. Infer the sampling frequency
# EEG recordings in Europe typically have power-line interference at 50 Hz.
# Assuming 50 Hz based on prior coursework context (e.g., notch filter applications):
power_line_freq = 50.0  # Hz

# We know the relation: normalized_freq * fs = true_freq
# Therefore: fs = true_freq / normalized_freq
estimated_fs = power_line_freq / normalized_freq

print(f"Index of spectral peak: {peak_index}")
print(f"Normalized frequency of peak: {normalized_freq:.6f} cycles/sample")
print(f"Estimated Sampling Frequency: {estimated_fs:.2f} Hz")

# 5. Plot the spectrum against normalized frequency
plt.figure(figsize=(10, 4))
normalized_freq_axis = np.arange(half_N) / N
plt.plot(normalized_freq_axis, spectrum)
plt.axvline(x=normalized_freq, color='r', linestyle='--', label='50 Hz Peak')
plt.title('Spectrum of EEG Signal (Normalized Frequency)')
plt.xlabel('Normalized Frequency (cycles/sample)')
plt.ylabel('Magnitude')
plt.legend()
plt.grid(True)
plt.show()
\`\`\`

### 📌 Problem 3: Low-pass Filtering EEG Data and Phase Shift Mitigation

**Question:** Load the EEG signal from the eeg.bin file and apply both a low-pass FIR filter and a low-pass IIR filter with a cutoff frequency of 2 Hz. Demonstrate the effect of phase shift in the outputs of the two filters and compare their phase characteristics. Then apply forward–backward filtering and show how it mitigates phase distortion in both cases.

**Solution:**

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import firwin, butter, lfilter, filtfilt

# 1. Load the EEG signal
file_path = 'eeg.bin'
try:
    eeg_data = np.fromfile(file_path, dtype=np.float32)
except FileNotFoundError:
    print("eeg.bin not found. Using simulated data.")
    fs_sim = 250
    t_sim = np.arange(0, 10, 1/fs_sim)
    # Simulate a low frequency (1Hz) base signal with higher frequency noise
    eeg_data = np.sin(2 * np.pi * 1 * t_sim) + 0.5 * np.sin(2 * np.pi * 10 * t_sim)

# Assume the sampling frequency is exactly 250 Hz based on previous analysis
fs = 250.0  
cutoff = 2.0  # Cutoff frequency of 2 Hz

# 2. Design the FIR filter
numtaps = 101  # Length of the FIR filter (number of coefficients)
fir_coeff = firwin(numtaps, cutoff, fs=fs)

# 3. Design the IIR filter
iir_order = 4  # Order of the Butterworth filter
# butter returns numerator (b) and denominator (a) polynomials of the IIR filter
b_iir, a_iir = butter(iir_order, cutoff, btype='low', fs=fs)

# 4. Apply forward filtering (introduces phase shift / time delay)
# lfilter processes the data sequentially in one direction
eeg_fir_forward = lfilter(fir_coeff, 1.0, eeg_data)
eeg_iir_forward = lfilter(b_iir, a_iir, eeg_data)

# 5. Apply forward-backward filtering (zero-phase filtering)
# filtfilt processes data forwards then backwards, neutralizing phase distortion
eeg_fir_zerophase = filtfilt(fir_coeff, 1.0, eeg_data)
eeg_iir_zerophase = filtfilt(b_iir, a_iir, eeg_data)

# 6. Plotting to demonstrate the phase shift and its mitigation
t_axis = np.arange(len(eeg_data)) / fs
window_start = int(1.0 * fs)
window_end = int(4.0 * fs)

t_window = t_axis[window_start:window_end]
orig_window = eeg_data[window_start:window_end]

plt.figure(figsize=(14, 8))

# Subplot 1: Forward filtering shows phase distortion (shift in time)
plt.subplot(2, 1, 1)
plt.plot(t_window, orig_window, label='Original EEG', color='lightgray', linewidth=2)
plt.plot(t_window, eeg_fir_forward[window_start:window_end], label='FIR Forward (lfilter)', linestyle='--')
plt.plot(t_window, eeg_iir_forward[window_start:window_end], label='IIR Forward (lfilter)', linestyle=':')
plt.title('Forward Filtering (Demonstrating Phase Shift / Time Delay)')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.legend()
plt.grid(True)

# Subplot 2: Forward-backward filtering corrects the phase shift
plt.subplot(2, 1, 2)
plt.plot(t_window, orig_window, label='Original EEG', color='lightgray', linewidth=2)
plt.plot(t_window, eeg_fir_zerophase[window_start:window_end], label='FIR Zero-Phase (filtfilt)', linestyle='--')
plt.plot(t_window, eeg_iir_zerophase[window_start:window_end], label='IIR Zero-Phase (filtfilt)', linestyle=':')
plt.title('Forward-Backward Filtering (Mitigated Phase Distortion)')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()
\`\`\`

### 📌 Problem 4: Purpose of the Short Time Fourier Transform (STFT)

**Question:** Describe the purpose of the Short Time Fourier Transform (STFT).

**Solution:**
The purpose of the Short Time Fourier Transform (STFT) is to analyze the spectral content of non-stationary signals where frequency components change over time. By segmenting a long signal into shorter, overlapping windows and applying the Fourier Transform to each segment, the STFT provides a time-frequency representation (often visualized as a spectrogram). This allows us to observe not only *what* frequencies are present in a signal, but *when* they occur.

### 📌 Problem 5: Heisenberg Uncertainty Principle in Signal Processing

**Question:** What is the Heisenberg Uncertainty Principle in the context of signal processing?

**Solution:**
In signal processing, the Heisenberg Uncertainty Principle (also known as the Gabor limit) dictates that a signal cannot be perfectly localized in both the time and frequency domains simultaneously. Mathematically, it is expressed as:

$\\Delta t \\cdot \\Delta f \\geq \\frac{1}{4\\pi}$

This principle imposes a fundamental trade-off in time-frequency analysis (like the STFT): 
- A short time window gives excellent time resolution ($\\Delta t$ is small) but poor frequency resolution ($\\Delta f$ is large).
- A long time window gives excellent frequency resolution ($\\Delta f$ is small) but poor time resolution ($\\Delta t$ is large).

### 📌 Problem 6: Continuous Wavelet Transform (CWT) Formula

**Question:** Write up the continuous wavelet transform (CWT) formula and explain its components.

**Solution:**
The Continuous Wavelet Transform (CWT) of a signal $x(t)$ is defined as:

$X_w(a, b) = \\frac{1}{\\sqrt{|a|}} \\int_{-\\infty}^{\\infty} x(t) \\psi^*\\left(\\frac{t-b}{a}\\right) dt$

**Components:**
- **$x(t)$**: The continuous-time signal being analyzed.
- **$\\psi(t)$**: The "mother wavelet", a continuous waveform with limited duration and zero mean.
- **$\\psi^*$**: The complex conjugate of the mother wavelet.
- **$a$**: The scale parameter. It controls the dilation (stretching) or compression of the wavelet. High scales correspond to low frequencies (stretched wavelet), and low scales correspond to high frequencies (compressed wavelet).
- **$b$**: The translation parameter. It determines the temporal position of the wavelet as it slides along the signal.
- **$\\frac{1}{\\sqrt{|a|}}$**: A normalization factor that ensures the energy of the scaled wavelet remains the same across all scales $a$.

### 📌 Problem 7: Relationship between CWT and Bandpass Filtering

**Question:** Explain the relationship between the Continuous Wavelet Transform (CWT) and bandpass filtering.

**Solution:**
The CWT can be interpreted as passing the signal $x(t)$ through a continuous bank of bandpass filters. The scaled and translated wavelet $\\psi\\left(\\frac{t-b}{a}\\right)$ essentially acts as the impulse response of a bandpass filter. 
As the scale parameter $a$ varies, both the center frequency and the bandwidth of the filter change. However, their ratio remains invariant, meaning the CWT behaves as a **constant-Q** filter bank (where $Q = \\frac{\\text{Center Frequency}}{\\text{Bandwidth}}$ is constant). This makes it highly effective: it uses narrow bandwidths for low frequencies (yielding high frequency resolution) and wide bandwidths for high frequencies (yielding high time resolution).

### 📌 Problem 8: Concept of Vanishing Moments

**Question:** Explain the concept of vanishing moments in wavelet theory.

**Solution:**
A wavelet $\\psi(t)$ is said to have $p$ vanishing moments if it is orthogonal to polynomials up to degree $p-1$. Mathematically:

$\\int_{-\\infty}^{\\infty} t^k \\psi(t) dt = 0 \\quad \\text{for } k = 0, 1, \\dots, p-1$

In practice, if a signal contains a smooth, polynomial trend of degree up to $p-1$, a wavelet with $p$ vanishing moments will yield wavelet coefficients equal to zero for that trend. This property allows wavelets to naturally suppress low-frequency background trends and isolate higher-frequency variations, transients, or singularities in the signal.

### 📌 Problem 9: Admissibility Criterion implies Zero-Mean Condition

**Question:** Show that the admissibility criterion implies the zero-mean condition.

**Solution:**
The admissibility criterion ensures that a function $\\psi(t)$ can be used as a wavelet and that its inverse transform exists. It is given by:

$C_\\psi = \\int_{-\\infty}^{\\infty} \\frac{|\\Psi(f)|^2}{|f|} df < \\infty$

where $\\Psi(f)$ is the Fourier transform of the wavelet $\\psi(t)$.

For this integral to be finite, the integrand must not blow up at the origin $f = 0$. Because there is a $1/|f|$ term, the numerator $|\\Psi(f)|^2$ must approach $0$ fast enough to cancel the singularity. Therefore, we must strictly have:

$\\Psi(0) = 0$

By the definition of the Fourier transform evaluated at $f = 0$:

$\\Psi(0) = \\int_{-\\infty}^{\\infty} \\psi(t) e^{-j2\\pi(0)t} dt = \\int_{-\\infty}^{\\infty} \\psi(t) dt$

Setting this to zero yields:

$\\int_{-\\infty}^{\\infty} \\psi(t) dt = 0$

This proves that the admissibility criterion strictly requires the wavelet to have a zero mean.

### 📌 Problem 10: Main Purpose of Wavelet Transform

**Question:** What is the main purpose of wavelet transform in signal processing?

**Solution:**
The main purpose of the wavelet transform is to provide a multi-resolution time-frequency analysis of non-stationary signals. Unlike the STFT, which uses a fixed-size analysis window resulting in rigid time-frequency tradeoffs, the wavelet transform utilizes variable window sizes. It uses long windows for capturing low-frequency components (giving high frequency resolution) and short windows for capturing high-frequency transients (giving high time resolution). This makes it exceptional for analyzing signals with sudden spikes, discontinuities, or varying frequency characteristics.

### 📌 Problem 11: Scaling Function in Wavelet Transforms

**Question:** Define the term "scaling function" in the context of wavelet transforms.

**Solution:**
In Multi-Resolution Analysis (MRA) for wavelet transforms, the scaling function (often denoted as $\\phi(t)$ and called the "father wavelet") represents the low-pass, coarse approximation of the signal. While the wavelet function $\\psi(t)$ acts as a high-pass filter that captures the fine "detail" between different scales, the scaling function acts as a low-pass filter that captures the baseline background up to a specific scale. Linear combinations of translated scaling functions allow the representation of the signal at any given resolution level.

### 📌 Problem 12: Difference between CWT and DWT

**Question:** What is the difference between the Continuous Wavelet Transform (CWT) and the Discrete Wavelet Transform (DWT)?

**Solution:**
- **Continuous Wavelet Transform (CWT):** Evaluates the wavelet coefficients over continuous ranges of both the scale $a$ and translation $b$ parameters. The output is highly redundant and produces a dense, continuous 2D time-scale surface, making it ideal for feature extraction and visual analysis of signals.
- **Discrete Wavelet Transform (DWT):** Evaluates the transform only at a discrete subset of scales and translations (usually using dyadic powers of 2). It forms an orthogonal or bi-orthogonal basis, resulting in a non-redundant and highly efficient representation. It is typically implemented via fast digital filter banks (successive low-pass and high-pass filtering) and is the primary tool for signal compression (e.g., JPEG2000) and denoising.

### 📌 Problem 13: Haar Scaling and Wavelet Functions

**Question:** For the Haar scaling function:
$\\phi(t) = 1$ for $0 \\leq t < 1$, and $0$ otherwise.
Show that the two-scale relation $\\phi(t) = \\phi(2t) + \\phi(2t-1)$ is satisfied. Then, using $\\psi(t) = \\phi(2t) - \\phi(2t-1)$, derive the Haar wavelet function explicitly.

**Solution:**
First, we analyze the components of the right-hand side of the two-scale relation:

For the first term, $\\phi(2t)$:
$\\phi(2t) = 1$ when $0 \\leq 2t < 1 \\implies 0 \\leq t < 0.5$
$\\phi(2t) = 0$ otherwise.

For the second term, $\\phi(2t-1)$:
$\\phi(2t-1) = 1$ when $0 \\leq 2t-1 < 1$
Adding 1: $1 \\leq 2t < 2$
Dividing by 2: $0.5 \\leq t < 1$
$\\phi(2t-1) = 0$ otherwise.

Adding the two components together:
$\\phi(2t) + \\phi(2t-1) = \\begin{cases} 1 + 0 = 1, & \\text{for } 0 \\leq t < 0.5 \\\\ 0 + 1 = 1, & \\text{for } 0.5 \\leq t < 1 \\\\ 0 + 0 = 0, & \\text{otherwise} \\end{cases}$

Combining the intervals $0 \\leq t < 0.5$ and $0.5 \\leq t < 1$, we get:
$\\phi(2t) + \\phi(2t-1) = 1$ for $0 \\leq t < 1$ (and $0$ otherwise).
This exactly matches the definition of $\\phi(t)$, thus proving the two-scale relation is satisfied.

**Deriving the Haar Wavelet Function $\\psi(t)$:**
Using the given equation $\\psi(t) = \\phi(2t) - \\phi(2t-1)$:
Subtracting the two previously defined terms:

For $0 \\leq t < 0.5$: $\\psi(t) = 1 - 0 = 1$
For $0.5 \\leq t < 1$: $\\psi(t) = 0 - 1 = -1$
Otherwise: $\\psi(t) = 0 - 0 = 0$

Thus, the explicit form of the Haar wavelet function is:
$\\psi(t) = \\begin{cases} 1, & 0 \\leq t < 0.5 \\\\ -1, & 0.5 \\leq t < 1 \\\\ 0, & \\text{otherwise} \\end{cases}$

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
    labWalkthrough: `## 🔬 Lab 12 Walkthrough

This lab walks through practical implementations of the concepts covered in this week's homework. The following code demonstrates step-by-step applications.

### Step 1: Implementation

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

fs = 44100
fc = 500
order = 6

# Butterworth low-pass filter
b, a = signal.butter(
    order,
    fc,
    btype='lowpass',
    fs=fs
)

ds = signal.dlti(b, a,  dt=1/fs)
w, gain, phase = ds.bode()
plt.plot(w/2/np.pi, gain, '.-', label='default res.')
# the same with higher resolution
w, gain, phase = ds.bode(w=1000)
plt.plot(w/2/np.pi, gain, label='high res.')
plt.axhline(-3, linestyle=':')
plt.axvline(fc, linestyle=':')
plt.xlim([0, 5000])
plt.ylim([-100, 10])
plt.grid()
plt.legend()
\`\`\`

*Explanation*: Butterworth low-pass filter the same with higher resolution

### Step 2: Implementation

\`\`\`python
# Frequency response 
w, h = signal.freqz(b, a, worN=1000, fs=fs)
plt.figure(figsize=(8, 4))
plt.plot(w, 20*np.log10(np.maximum(np.abs(h), 1e-12)))
plt.axvline(fc, linestyle='--', label='2000 Hz cutoff')
plt.axhline(-3.0103, linestyle=':', label='-3 dB')
plt.xlabel("Frequency [Hz]")
plt.ylabel("Magnitude [dB]")
plt.title("Butterworth  filter")
plt.grid(True)
plt.legend()
plt.xlim([0, 5000])
plt.ylim([-100, 10])
\`\`\`

*Explanation*: Frequency response

### Step 3: Implementation

\`\`\`python
from scipy.io import wavfile
import scipy.io
fs, data = wavfile.read("02. School Boy-9.wav")
print(fs, data.shape)
print(data[:,0])
print(data.min(), data.max())
\`\`\`

### Step 4: Implementation

\`\`\`python
x = data[:, 0]
plt.plot(x)
y = signal.lfilter(b, a, x)
plt.plot(y)
plt.xlim([0,5000])
\`\`\`

### Step 5: Implementation

\`\`\`python
f, sx = signal.welch(
    x,
    fs=fs,
    window="hann",
    nperseg=2**15,
    noverlap=2**14,
    detrend="constant",
    scaling="density"
)
f, sy = signal.welch(
    y,
    fs=fs,
    window="hann",
    nperseg=2**15,
    noverlap=2**14,
    detrend="constant",
    scaling="density"
)
plt.loglog(f, sx)
plt.loglog(f, sy)
plt.grid()
#plt.xlim([0, 250])
#plt.ylim([10**(-5), 10**(7)])
\`\`\`

*Explanation*: plt.xlim([0, 250]) plt.ylim([10**(-5), 10**(7)])

### Step 6: Implementation

\`\`\`python
data_filtered = signal.lfilter(b, a, data, axis=0)
data_filtered /= np.max(np.abs(data_filtered))
# normalize safely to int16 range

stereo_int16 = np.int16(data_filtered * 32767)
print(stereo_int16)
wavfile.write("output_filtered.wav", fs, stereo_int16)
\`\`\`

*Explanation*: normalize safely to int16 range

### Step 7: Implementation

\`\`\`python
f, sy = signal.welch(
    data_filtered[:,0],
    fs=fs,
    window="hann",
    nperseg=2**15,
    noverlap=2**14,
    detrend="constant",
    scaling="density"
)
plt.loglog(f, sy)
plt.grid()
\`\`\`

### Step 8: Implementation

\`\`\`python
from pylab import *
from scipy import signal
fs, fl, N = 44100, 500, 251
n = arange(N) - N//2 + 1e-12 # tiny shift so that we don't get 0/0
b_l = sin(2*pi*n*fl/fs)/(n/pi)
w = signal.windows.hann(N)
b_l *= w
b_l /= b_l.sum() # Ensure that the gain at 0Hz is 1. 

ds = signal.dlti(b_l, [1], dt=1/fs)
\`\`\`

### Step 9: Implementation

\`\`\`python
data_filtered = signal.lfilter(b_l, [1], data, axis=0)
data_filtered /= np.max(np.abs(data_filtered))

stereo_int16 = np.int16(data_filtered * 32767)
print(stereo_int16)
wavfile.write("output_filtered.wav", fs, stereo_int16)
\`\`\`

### Step 10: Implementation

\`\`\`python
# Demonstrate the phase delay introduced by FIR filters
# and fixing it by forward-backward filtering using 'signal.filtfilt'
from pylab import *
from scipy import signal

# Load EEG
fs = 200.0
x = fromfile("eeg.bin", dtype=float32)

# FIR low-pass design
fc = 2.0
fc = 2.0
numtaps = 401              # odd length
delay = (numtaps - 1) // 2 # samples

b = signal.firwin(
    numtaps,
    fc,
    fs=fs,
    window="hamming",
    pass_zero="lowpass"
)

# FIR band-pass design
#fc = [9,15]
#numtaps = 401              # odd length
#delay = (numtaps - 1) // 2 # samples

#b = signal.firwin(
#    numtaps,
#    fc,
#    fs=fs,
#    window="hamming",
#    pass_zero="bandpass"
#)

# Causal (forward) FIR filtering: introduces linear phase delay 
y = signal.lfilter(b, 1, x)

# Delay-compensated version
y_aligned = roll(y, -delay)
y_aligned[-delay:] = nan

# Zero-phase reference: forward-backward filtering
y_zero = signal.filtfilt(b, 1, x)

# Time axis
t = arange(len(x)) / fs

# Plot a short segment
i0 = 1000
i1 = int(15 * fs)

figure(figsize=(12, 5))
plot(t[i0:i1], x[i0:i1], alpha=0.4, label="raw EEG")
plot(t[i0:i1], y[i0:i1], label="FIR output")
plot(t[i0:i1], y_aligned[i0:i1], label="FIR shifted back")
plot(t[i0:i1], y_zero[i0:i1], "--", label="filtfilt")
xlabel("Time [s]")
ylabel("Amplitude")
title(f"Low-pass FIR, fc={fc} Hz, delay={delay} samples = {delay/fs:.3f} s")
legend()
grid()
show()
\`\`\`

*Explanation*: Demonstrate the phase delay introduced by FIR filters and fixing it by forward-backward filtering using 'signal.filtfilt' Load EEG FIR low-pass design FIR band-pass design fc = [9,15] numtaps = 401              # odd length delay = (numtaps - 1) // 2 # samples b = signal.firwin( numtaps, fc, fs=fs, window="hamming", pass_zero="bandpass" ) Causal (forward) FIR filtering: introduces linear phase delay Delay-compensated version Zero-phase reference: forward-backward filtering Time axis Plot a short segment

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
        name: 'Taxonomy of Colored Noises',
        explanation: `Random stochastic signals are rigorously classified by the shape of their Power Spectral Density (PSD), $S(f)$:
* **White Noise**: Exhibits perfectly flat, equal power across all frequencies ($S(f) \\propto f^0$). The signal is completely uncorrelated in time (impulsive autocorrelation).
* **Pink Noise (1/f Noise)**: Distributes equal power across every octave ($S(f) \\propto 1/f$). It is ubiquitous in biological systems, fractal mathematics, and music production.
* **Brown / Red Noise**: Exhibits a steep spectral drop-off ($S(f) \\propto 1/f^2$). Mathematically generated by taking the cumulative integral sum of white noise (Brownian motion), producing a deep, rumbling auditory character.
* **Blue Noise**: Displays power proportional to frequency ($S(f) \\propto f$), resulting in a harsh, high-pitched hiss.
* **Violet / Purple Noise**: Exhibits power scaling with the square of frequency ($S(f) \\propto f^2$), creating an extremely sharp and intense high-pitched sound.
* **Gray Noise**: Sourced from white noise but heavily filtered via psychoacoustic curves to sound perceptually equally loud across all frequencies to the human ear.
* **Green Noise**: A specialized band-limited variant of pink noise with a pronounced PSD peak concentrated in the mid-frequencies ($500$ Hz to $2000$ Hz), corresponding to the peak sensitivity of human hearing.`
      },
      {
        name: 'Nonlinear Dynamical Systems and Attractors',
        explanation: `Complex signals are often generated by deterministic nonlinear dynamical systems, modeled continuously via differential equations $\\dot{X} = \\Phi(X, t)$ or discretely via iterative maps $X_{n+1} = \\Phi(X_n, n)$.
* **Attractor Topology**: When a system dissipates energy, its long-term trajectories settle onto specific geometrical manifolds called attractors. These are classified into four distinct types: Fixed point attractors, periodic limit cycles, quasi-periodic tori, and chaotic (strange) attractors.
* **Paradigmatic Examples**: The **Lorenz system** is a classic continuous 3D chaotic system initially developed for atmospheric convection modeling, defined by $\\dot{x} = \\sigma(y-x)$, $\\dot{y} = x(\\rho-z)-y$, $\\dot{z} = xy-\\beta z$. The **Henon map** serves as a fundamental 2D discrete chaotic attractor model defined by $x_{n+1} = 1 - a x_n^2 + y_n$.`
      },
      {
        name: 'Time Delay Embedding and Takens\' Theorem',
        explanation: `Often, only a single 1D scalar observation time series $x(t)$ is measurable from a highly complex, multidimensional system. **Takens' Embedding Theorem** provides a rigorous mathematical framework to perfectly reconstruct the hidden phase space topology of the original multidimensional dynamics.
* **Reconstruction**: The multi-dimensional state vector is built using delayed copies of the scalar signal: $X(t) = [x(t), x(t+\\tau), \\dots, x(t+(m-1)\\tau)]$.
* **Parameter Selection**: The time delay lag $\\tau$ is optimally chosen where the signal's autocorrelation function hits its first null point (ensuring linear independence of coordinates). The embedding dimension $m$ must satisfy $m > 2d_A$ (where $d_A$ is the true attractor dimension), effectively estimated using algorithmic approaches like the False Nearest Neighbors method.`
      },
      {
        name: 'Surrogate Data Testing for Nonlinearity',
        explanation: `To rigorously assert that a time series is driven by nonlinear chaotic dynamics rather than just correlated linear noise, one must employ Surrogate Data Testing.
* **Methodology**: The original time series is subjected to a Fourier transform, its amplitude spectrum is exactly preserved, but its phase spectrum is uniformly randomized, followed by an inverse Fourier transform. 
* **Null Hypothesis Testing**: The resulting 'surrogate' perfectly mimics all linear statistics of the original data—such as its exact Power Spectral Density and Autocorrelation function—but totally destroys any nonlinear determinism. By comparing nonlinear metrics (e.g., fractal dimension, predictability error) between the surrogate ensemble and the original data, one can statistically reject the null hypothesis of linearity.`
      },
      {
        name: 'Functional Connectivity and Statistical Dependence Measures',
        explanation: `To ascertain how multiple time series (like multi-channel EEG signals) interact, several mathematical connectivity measures are calculated:
* **Covariance and Correlation**: Measures linear synchronization. Covariance is defined as $c_{xy} = \\langle (x-\\langle x \\rangle)(y-\\langle y \\rangle) \\rangle$. Pearson's correlation coefficient normalizes this to be scale-invariant: $r_{xy} = \\frac{c_{xy}}{\\sigma_x \\sigma_y} \\in [-1, 1]$.
* **Cross-Correlation**: Evaluates signal similarity as a function of temporal lag $\\tau$, defined strictly as $c_{xy}(\\tau) = \\int_{-\\infty}^{\\infty} x^*(t)y(t+\\tau) dt$.
* **Wiener-Khinchin Theorem**: A foundational proof establishing that the Power Spectral Density $P_x(\\nu)$ is exactly equal to the Fourier transform of the signal's Autocorrelation function $c_{xx}(\\tau)$.
* **Phase Coherence**: Evaluates the stability of phase differences across independent frequency bands between two signals. It is defined in the frequency domain as $\\text{Coh}_{xy}(\\nu) = \\frac{|C_{xy}(\\nu)|}{\\sqrt{P_x(\\nu) P_y(\\nu)}} \\in [0, 1]$, where $C_{xy}(\\nu)$ is the complex cross-spectral density.`
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
  }  ,{
    id: 14,
    title: 'Final Exam Walkthrough',
    bigPicture: `## Complete Exam Solution\n\nThis section provides the full solutions for the final exam.`,
    concepts: [],
    homeworkGuide: `# 🚀 Exam 2024 Solution Guide

This section covers the comprehensive solutions to the July 10, 2024 Exam, including Theoretical Questions, Analytical Problems, and the Programming Tasks.

---

## Part 1: Theoretical Questions

### 1. Physical representations of a signal
A signal is any physical quantity that varies with time, space, or any other independent variable. Examples include:
*   **Acoustic:** Sound waves (air pressure variations over time).
*   **Electrical:** Voltage or current in a circuit over time.
*   **Electromagnetic:** Radio waves, Wi-Fi signals.
*   **Optical:** Light intensity hitting a camera sensor (images/video).
*   **Biological:** EEG (brainwaves), ECG (heart electrical activity).

### 2. Fourier transform of the Dirac comb
The Dirac comb (or impulse train) is defined as $III_T(t) = \\sum_{k=-\\infty}^{\\infty} \\delta(t - kT)$.
Its continuous Fourier transform is also a Dirac comb in the frequency domain, scaled by the fundamental frequency $f_s = 1/T$:
$$ \\mathcal{F}\\{III_T(t)\\} = f_s \\sum_{k=-\\infty}^{\\infty} \\delta(f - k f_s) = \\frac{1}{T} \\sum_{k=-\\infty}^{\\infty} \\delta\\left(f - \\frac{k}{T}\\right) $$
This property is fundamental to the mathematical proof of the sampling theorem.

### 3. What do we mean by the Nyquist limit?
The Nyquist limit (or Nyquist frequency) is the highest frequency component of a continuous-time signal that can be unambiguously represented by a discrete sampling system. It is exactly half the sampling frequency ($f_{Nyquist} = f_s / 2$). If a signal contains frequencies above the Nyquist limit, sampling it will result in **aliasing**, where high frequencies fold back and masquerade as lower frequencies.

### 4. Anti-aliasing vs. Reconstruction filters
*   **Anti-aliasing filter:** An analog low-pass filter applied *before* the Analog-to-Digital Converter (ADC). It removes all frequency components above the Nyquist frequency ($f_s / 2$) from the continuous signal to prevent aliasing during sampling.
*   **Reconstruction filter:** An analog low-pass filter applied *after* the Digital-to-Analog Converter (DAC). It smooths out the "staircase" output of the DAC by removing the high-frequency image replicas created by the discrete sampling process, reconstructing the smooth continuous-time signal.

### 5. Impulse response and relevance to LTI systems
The impulse response, $h(t)$ or $h[n]$, is the output of a system when presented with a Dirac delta function $\\delta(t)$ or unit impulse $\\delta[n]$ as its input.
*   **Relevance:** For any Linear Time-Invariant (LTI) system, the impulse response completely characterizes the system. The output to *any* arbitrary input signal can be found simply by convolving the input with the impulse response: $y[n] = x[n] * h[n]$.

### 6. What is a decibel?
A decibel (dB) is a logarithmic unit used to express the ratio of two values of a physical quantity, typically power or intensity.
*   For power ratios: $L_{dB} = 10 \\log_{10}(P_1 / P_0)$
*   For amplitude/voltage ratios: $L_{dB} = 20 \\log_{10}(A_1 / A_0)$
It is widely used in DSP to represent the magnitude of frequency responses (Bode plots) because it allows vast dynamic ranges (e.g., a filter attenuating by a factor of 100,000) to be represented compactly (-100 dB).

### 7. Laplace transform poles and signal characteristics
The locations of poles in the s-plane ($s = \\sigma + j\\omega$) dictate the time-domain behavior of the signal $e^{st}$:
*   **(a) Negative real part:** The signal decays exponentially to zero as $t \\to \\infty$ (Stable).
    **Positive real part:** The signal grows exponentially to infinity as $t \\to \\infty$ (Unstable).
*   **(b) Imaginary component:** The signal has an oscillatory (sinusoidal) component.
*   **(c) Lying on the imaginary axis:** The signal is a pure, sustained sinusoid (marginal stability).
    **Lying on the real axis:** The signal has no oscillation; it purely decays or grows exponentially.
*   **(d) In the origin:** The signal is the unit step function $u(t)$ (a constant value for $t \\ge 0$).

### 8. Mapping techniques for IIR filters
*   **Bilinear Transform:** A conformal mapping $s = \\frac{2}{T} \\frac{1 - z^{-1}}{1 + z^{-1}}$ that maps the entire left half of the continuous s-plane into the inside of the unit circle in the discrete z-plane. It completely avoids aliasing but introduces frequency warping, which is corrected via pre-warping.
*   **Impulse Invariant Method:** The digital filter is designed such that its impulse response is an exact sampled version of the analog filter's impulse response: $h[n] = T_s h_a(nT_s)$. Because the analog frequency response is aliased (summed shifted copies), this method is only suitable for strictly bandlimited analog filters (like lowpass or bandpass).

### 9. Wavelet functions, scaling functions, and filters
In Multi-Resolution Analysis (MRA) using Discrete Wavelet Transforms:
*   The **Scaling Function** $\\phi(t)$ captures the low-frequency, coarse-grained approximations of the signal. It corresponds to passing the signal through a discrete **Low-pass filter** $h[n]$.
*   The **Wavelet Function** $\\psi(t)$ captures the high-frequency, fine details of the signal. It corresponds to passing the signal through a discrete **High-pass filter** $g[n]$.
Together, these functions form an orthogonal filter bank (Quadrature Mirror Filters) that decomposes the signal into distinct frequency bands while preserving time localization.

---

## Part 2: Analytical Problems

### 1. System Properties ($y[n]$ with input $x[n]$)
**(a) $y[n] = x[n]u[n]$**
*   **Linearity:** Linear. $a x_1[n]u[n] + b x_2[n]u[n] = (a x_1[n] + b x_2[n])u[n]$.
*   **Time-Invariance:** Time-Varying. A shift in the input by $k$ yields $y_1[n] = x[n-k]u[n]$. A shift in the system yields $y[n-k] = x[n-k]u[n-k]$. Since $y_1 \\neq y[n-k]$, it is time-varying.
*   **Causality:** Causal. $y[n]$ only depends on $x[n]$ at the current time $n$.
*   **Memory:** Memoryless. Depends only on the present input.
*   **Stability:** Stable. If $|x[n]| < M$, then $|y[n]| = |x[n]u[n]| \\le M$.

**(b) $y[n] = \\prod_{k=0}^5 a[k]x[n-k]$**
*   **Linearity:** Non-linear. The product of inputs means scaling the input by $c$ scales the output by $c^6$, not $c$.
*   **Time-Invariance:** Time-Invariant. The coefficients $a[k]$ are constant.
*   **Causality:** Causal. It depends on inputs $x[n], x[n-1], ..., x[n-5]$ (only present and past).
*   **Memory:** Has memory (it uses past 5 samples).
*   **Stability:** Stable. If $|x[n]| \\le M$, the product is bounded by $M^6 \\prod |a[k]|$.

### 2. Discrete-Time Signal $x(n)$
$x(n) = -0.3\\delta(n+2) + 2.0\\delta(n) + 1.5\\delta(n-3) - \\delta(n-5)$

**(a) Sketch $x(n)$:**
It has amplitude $-0.3$ at $n=-2$, $2.0$ at $n=0$, $1.5$ at $n=3$, and $-1.0$ at $n=5$. All other values are zero.

**(b) Z-transform $X(z)$:**
Using $\\mathcal{Z}\\{\\delta(n-k)\\} = z^{-k}$:
$X(z) = -0.3z^{2} + 2.0 + 1.5z^{-3} - z^{-5}$

**(c) Define $G(z) = z^{-2}X(z)$ and sketch $g(n)$:**
$G(z) = z^{-2}(-0.3z^{2} + 2.0 + 1.5z^{-3} - z^{-5}) = -0.3 + 2.0z^{-2} + 1.5z^{-5} - z^{-7}$
Thus, $g(n) = -0.3\\delta(n) + 2.0\\delta(n-2) + 1.5\\delta(n-5) - \\delta(n-7)$.
This is simply $x(n)$ shifted to the right (delayed) by 2 samples.

### 3. Ideal Continuous-Time Band-Stop Filter
$H^f(\\omega) = 1$ for $|\\omega| \\le \\omega_1$ and $|\\omega| \\ge \\omega_2$, and $0$ otherwise.

**(a) Sketch $H^f(\\omega)$:**
It is a "V-shaped" block. It equals 1 from $-\\omega_1$ to $\\omega_1$ (a lowpass region), then drops to 0, and jumps back to 1 from $-\\infty$ to $-\\omega_2$ and $\\omega_2$ to $\\infty$ (a highpass region).

**(b) Impulse response $h(t)$:**
Using the linearity of the Inverse Fourier Transform, we split $H^f(\\omega)$ into a lowpass filter (LPF) with cutoff $\\omega_1$ and a highpass filter (HPF) with cutoff $\\omega_2$.
$h_{LPF}(t) = \\frac{\\omega_1}{\\pi} \\text{sinc}(\\omega_1 t / \\pi)$
$h_{HPF}(t) = \\delta(t) - \\frac{\\omega_2}{\\pi} \\text{sinc}(\\omega_2 t / \\pi)$
$h(t) = h_{LPF}(t) + h_{HPF}(t) = \\delta(t) + \\frac{\\omega_1}{\\pi} \\text{sinc}(\\omega_1 t / \\pi) - \\frac{\\omega_2}{\\pi} \\text{sinc}(\\omega_2 t / \\pi)$

**(c) Implementation using LPF and HPF:**
A band-stop filter passes low frequencies and high frequencies but blocks the middle. Because the passbands are parallel, it is implemented by passing the input signal through an ideal LPF (cutoff $\\omega_1$) and an ideal HPF (cutoff $\\omega_2$) **in parallel**, and summing their outputs together.

### 4. Transfer Function Analysis
$H(z) = \\frac{z(z + 2)}{(z - 1/2)(z + 4)}$

**(a) Find the frequency response $H^f(\\omega)$:**
We are told the system is "stable". It has poles at $z=1/2$ and $z=-4$. For an LTI system to be stable, the Region of Convergence (ROC) must include the unit circle ($|z|=1$). This implies the ROC is $1/2 < |z| < 4$.
To find the frequency response, we evaluate $H(z)$ on the unit circle by substituting $z = e^{j\\omega}$:
$H^f(\\omega) = H(e^{j\\omega}) = \\frac{e^{j\\omega}(e^{j\\omega} + 2)}{(e^{j\\omega} - 1/2)(e^{j\\omega} + 4)}$

**(b) Calculate value at $\\omega = 0.2\\pi$:**
Substitute $\\omega = 0.2\\pi$:
$e^{j0.2\\pi} \\approx 0.809 + j0.588$
$H^f(0.2\\pi) = \\frac{(0.809 + j0.588)(2.809 + j0.588)}{(-0.309 + j0.588)(4.809 + j0.588)}$
Let's compute the magnitude and phase programmatically or carefully by hand:
Numerator magnitude: $|1 \\angle 0.2\\pi| \\cdot \\sqrt{2.809^2 + 0.588^2} \\approx 1 \\cdot 2.87 = 2.87$
Denominator magnitude: $\\sqrt{(-0.309)^2 + 0.588^2} \\cdot \\sqrt{4.809^2 + 0.588^2} \\approx 0.664 \\cdot 4.845 \\approx 3.217$
Magnitude $|H(e^{j0.2\\pi})| \\approx 2.87 / 3.217 \\approx 0.892$

**(c) Find output $y(n)$ for $x(n) = \\cos(0.2\\pi n)$:**
For an LTI system, a cosine input results in a cosine output scaled by the magnitude of $H(e^{j\\omega})$ and shifted by its phase:
$y(n) = |H^f(0.2\\pi)| \\cos(0.2\\pi n + \\angle H^f(0.2\\pi))$
$y(n) \\approx 0.892 \\cos(0.2\\pi n + \\phi)$ where $\\phi$ is the calculated phase angle.

---
`,
    labWalkthrough: `# 🚀 Final Exam Programming Solutions

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

We now sample the continuous signal. The Nyquist theorem states that we must sample at least twice the maximum frequency present in the signal to avoid aliasing. Our maximum frequency component is at index \`4\`, meaning we need a sampling rate of at least $f_s \\ge 8$.

\`\`\`python
# 1(c) & (d): Demonstrate sampling and Nyquist reconstruction
fs_good = 16  # Above Nyquist rate (8)
fs_bad = 6    # Below Nyquist rate (Aliasing!)

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
`,
    keyFormulas: `## Exam Walkthrough\n\nPlease check the Homework and Lab Code tabs for the solutions.`
  }
];