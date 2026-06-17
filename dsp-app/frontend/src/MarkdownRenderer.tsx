import { useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';

function extractText(node: any): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (node && node.props && node.props.children) {
    return extractText(node.props.children);
  }
  return '';
}

interface MarkdownRendererProps {
  content: string;
  onCopyToIDE?: (code: string) => void;
}

const MATH_GLOSSARY: Record<string, string> = {
  'H(z)': 'Transfer Function: Defines the system response in the Z-domain. Roots of its numerator are zeros, roots of its denominator are poles.',
  'H(s)': 'Continuous Transfer Function: Defines the system response in the Laplace S-domain.',
  'f_s': 'Sampling Frequency: The rate at which a continuous signal is sampled, measured in Hertz (samples per second).',
  'f_c': 'Cutoff Frequency: The boundary in a filter\'s frequency response where energy begins to be significantly attenuated (usually at -3 dB).',
  'T_s': 'Sampling Period: The time duration between consecutive samples ($T_s = 1 / f_s$).',
  '\\omega': 'Angular Frequency: Radian frequency of a continuous signal ($\\omega = 2\\pi f$).',
  '\\omega_c': 'Angular Cutoff Frequency: Cutoff frequency expressed in radians per second.',
  'X(f)': 'Frequency Spectrum: The continuous Fourier transform of a signal $x(t)$.',
  'x[n]': 'Discrete Signal: A sequence of values indexed by integer $n$, usually obtained by sampling a continuous signal.',
  'y[n]': 'Output Signal: The discrete-time output sequence produced by a digital system or filter.',
  'h[n]': 'Impulse Response: The output of a digital filter when the input is a single unit impulse (Kronecker delta).',
  '\\delta(t)': 'Dirac Delta Function: A continuous mathematical impulse with infinite height, zero width, and an area of exactly 1.',
  '\\delta[n]': 'Kronecker Delta: A discrete impulse that is 1 exactly at $n=0$ and 0 everywhere else.',
};

function CodeBlock({ children, rawCode, className, onCopyToIDE }: {
  children: ReactNode;
  rawCode: string;
  className?: string;
  onCopyToIDE?: (code: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const codeToCopy = rawCode.replace(/\n$/, '');
  const language = className?.replace('language-', '') || '';
  const isPython = language === 'python' || language === 'py' || language === '';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeToCopy]);

  const handleCopyToIDE = useCallback(() => {
    onCopyToIDE?.(codeToCopy);
  }, [codeToCopy, onCopyToIDE]);

  return (
    <div className="code-block-wrapper group">
      <div className="flex items-center justify-between px-3 py-1.5 bg-nord-polar-0/60 border-b border-nord-border text-[0.7rem]">
        <span className="text-nord-frost-1 font-mono font-medium uppercase tracking-wider">
          {language || 'code'}
        </span>
        <div className="flex gap-1.5">
          {isPython && onCopyToIDE && (
            <button
              onClick={handleCopyToIDE}
              className="px-2 py-0.5 rounded text-nord-aurora-green hover:bg-nord-aurora-green/10 border border-nord-aurora-green/20 hover:border-nord-aurora-green/40 transition-all font-sans font-semibold"
            >
              → IDE
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`px-2 py-0.5 rounded transition-all font-sans font-semibold ${
              copied
                ? 'text-nord-aurora-green border border-nord-aurora-green/30'
                : 'text-nord-snow-0/60 hover:text-nord-frost-1 border border-nord-border hover:border-nord-frost-1/30'
            }`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="!mt-0 !rounded-t-none">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function QuizCard({ rawCode }: { rawCode: string }) {
  // Parse format:
  // question: What is...
  // a: option 1
  // b: option 2
  // answer: a
  // explanation: Why a is correct...
  const [selected, setSelected] = useState<string | null>(null);

  const lines = rawCode.split('\n').filter(l => l.trim());
  let question = '';
  let answer = '';
  let explanation = '';
  const options: { key: string; text: string }[] = [];

  lines.forEach(line => {
    const match = line.match(/^([a-z]+|question|answer|explanation):\s*(.*)$/i);
    if (match) {
      const key = match[1].toLowerCase();
      const val = match[2];
      if (key === 'question') question = val;
      else if (key === 'answer') answer = val;
      else if (key === 'explanation') explanation = val;
      else options.push({ key, text: val });
    }
  });

  if (!question || options.length === 0 || !answer) {
    return <div className="text-nord-aurora-red">Invalid quiz format</div>;
  }

  const isCorrect = selected === answer;
  const isAnswered = selected !== null;

  const handleReset = () => setSelected(null);

  return (
    <div className="my-6 p-5 border border-nord-border rounded-xl bg-nord-surface shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-nord-aurora-yellow text-lg">❓</span>
        <h4 className="text-sm font-bold text-nord-snow-1 m-0">{question}</h4>
      </div>
      <div className="space-y-2 mt-4">
        {options.map(opt => {
          const isSelected = selected === opt.key;
          const isCorrectOption = opt.key === answer;
          
          let btnClass = "w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ";
          
          if (!isAnswered) {
            btnClass += "border-nord-border hover:border-nord-frost-1/50 bg-nord-polar-0/30 hover:bg-nord-polar-0/60 text-nord-snow-0 cursor-pointer";
          } else {
            if (isCorrectOption) {
              btnClass += "border-nord-aurora-green bg-nord-aurora-green/10 text-nord-aurora-green font-medium";
            } else if (isSelected) {
              btnClass += "border-nord-aurora-red bg-nord-aurora-red/10 text-nord-aurora-red font-medium";
            } else {
              btnClass += "border-nord-border/50 bg-nord-polar-0/10 text-nord-polar-3 opacity-50";
            }
          }

          return (
            <button 
              key={opt.key}
              onClick={() => !isAnswered && setSelected(opt.key)}
              disabled={isAnswered}
              className={btnClass}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[0.6rem] font-bold shrink-0 ${
                    isAnswered && isCorrectOption ? 'border-nord-aurora-green bg-nord-aurora-green/20 text-nord-aurora-green' :
                    isAnswered && isSelected && !isCorrectOption ? 'border-nord-aurora-red bg-nord-aurora-red/20 text-nord-aurora-red' :
                    isAnswered ? 'border-nord-border/30 text-nord-polar-3/50' :
                    'border-nord-polar-3/40 text-nord-polar-3'
                  }`}>{opt.key.toUpperCase()}</span>
                  <span>{opt.text}</span>
                </div>
                {isAnswered && isCorrectOption && <span className="text-nord-aurora-green">✓</span>}
                {isAnswered && isSelected && !isCorrectOption && <span className="text-nord-aurora-red">✗</span>}
              </div>
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div className="mt-4 space-y-3 animate-slide-up">
          <div className={`flex items-center gap-2 text-xs font-semibold ${isCorrect ? 'text-nord-aurora-green' : 'text-nord-aurora-red'}`}>
            {isCorrect ? '✨ Correct!' : `❌ Incorrect — the answer is ${answer.toUpperCase()}.`}
          </div>
          {explanation && (
            <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
              isCorrect 
                ? 'bg-nord-aurora-green/5 border-nord-aurora-green/20 text-nord-snow-0' 
                : 'bg-nord-aurora-red/5 border-nord-aurora-red/20 text-nord-snow-0'
            }`}>
              <p className={`text-[0.65rem] font-bold uppercase tracking-wider mb-1.5 ${isCorrect ? 'text-nord-aurora-green' : 'text-nord-aurora-red'}`}>
                💡 Explanation
              </p>
              {explanation}
            </div>
          )}
          <button 
            onClick={handleReset}
            className="text-[0.7rem] font-semibold text-nord-frost-1 hover:text-nord-frost-2 transition-colors flex items-center gap-1"
          >
            ↻ Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default function MarkdownRenderer({ content, onCopyToIDE }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; visible: boolean }>({
    text: '', x: 0, y: 0, visible: false
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const katexEls = containerRef.current.querySelectorAll('.katex');
    
    const handleEnter = (e: Event, text: string) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      setTooltip({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        visible: true
      });
    };

    const handleLeave = () => {
      setTooltip(t => ({ ...t, visible: false }));
    };

    const listeners: { el: Element; enter: any; leave: any }[] = [];

    katexEls.forEach(el => {
      const annotation = el.querySelector('annotation[encoding="application/x-tex"]');
      if (annotation) {
        let tex = annotation.textContent?.trim();
        if (tex) {
          // Some rehype-katex outputs might have trailing whitespace or wrap in {}. We do a loose match or exact match.
          // Let's remove outer {} if present for matching
          if (tex.startsWith('{') && tex.endsWith('}')) tex = tex.slice(1, -1);
          
          if (MATH_GLOSSARY[tex]) {
            const htmlNode = el.querySelector('.katex-html') as HTMLElement;
            if (htmlNode) {
              htmlNode.classList.add('cursor-help', 'border-b', 'border-dashed', 'border-nord-aurora-yellow/70', 'hover:bg-nord-aurora-yellow/10', 'rounded', 'transition-colors');
              const enter = (e: Event) => handleEnter(e, MATH_GLOSSARY[tex!]);
              const leave = () => handleLeave();
              htmlNode.addEventListener('mouseenter', enter);
              htmlNode.addEventListener('mouseleave', leave);
              listeners.push({ el: htmlNode, enter, leave });
            }
          }
        }
      }
    });

    return () => {
      listeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, [content]);

  return (
    <div className="markdown-body relative" ref={containerRef}>
      {tooltip.visible && (
        <div 
          className="fixed z-50 px-3 py-2 text-[0.75rem] max-w-xs leading-tight bg-nord-polar-1 text-nord-snow-1 rounded shadow-xl border border-nord-border pointer-events-none transform -translate-x-1/2 -translate-y-full transition-opacity"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-nord-border"></div>
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkBreaks]}
        rehypePlugins={[
          rehypeKatex,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={{
          // Custom code block rendering with copy buttons
          code({ children, className, ...props }) {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');

            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            const rawCode = extractText(children);
            
            if (className?.includes('language-quiz')) {
              return <QuizCard rawCode={rawCode} />;
            }

            return (
              <CodeBlock
                className={className}
                rawCode={rawCode}
                onCopyToIDE={onCopyToIDE}
              >
                {children}
              </CodeBlock>
            );
          },
          // Render pre as-is (CodeBlock handles the wrapper)
          pre({ children }) {
            return <>{children}</>;
          },
          // Style blockquotes as "key insight" callouts
          blockquote({ children }) {
            return (
              <div className="my-3 p-3 rounded-lg border-l-[3px] border-nord-frost-1 bg-nord-frost-1/[0.06]">
                <div className="flex items-start gap-2">
                  <span className="text-nord-frost-1 text-sm mt-0.5 shrink-0">💡</span>
                  <div className="text-nord-snow-1 [&>p]:m-0">{children}</div>
                </div>
              </div>
            );
          },
          // Style h2 with concept icons
          h2({ children }) {
            const text = String(children);
            let icon = '📖';
            if (/intuition|analog|why/i.test(text)) icon = '💡';
            else if (/math|formula|equation|deriv/i.test(text)) icon = '📐';
            else if (/code|python|implement/i.test(text)) icon = '💻';
            else if (/homework|hw|exercise/i.test(text)) icon = '📝';
            else if (/lab|experiment|practice/i.test(text)) icon = '🧪';
            else if (/exam|quiz|test|question/i.test(text)) icon = '🎯';
            else if (/connect|link|bridge/i.test(text)) icon = '🔗';
            else if (/think|puzzle|challenge/i.test(text)) icon = '🤔';
            else if (/summary|recap|key/i.test(text)) icon = '⭐';

            return (
              <h2 className="flex items-center gap-2">
                <span className="text-base">{icon}</span>
                <span>{children}</span>
              </h2>
            );
          },
          // Style h3 for exercises/problems to give them clear separation
          h3({ children, ...props }) {
            const text = String(children);
            if (text.includes('📌') || text.includes('Problem') || text.includes('Step ')) {
              return (
                <div className="mt-14 mb-6 pt-7 border-t-2 border-nord-polar-2/50 relative">
                  <h3 className="absolute -top-[15px] left-4 inline-flex items-center bg-nord-surface px-4 py-1 text-nord-frost-1 font-bold text-[0.95rem] rounded-full border border-nord-polar-2/50 shadow-sm" {...props}>
                    {children}
                  </h3>
                </div>
              );
            }
            return <h3 className="text-nord-frost-1 font-semibold mt-8 mb-4 text-lg" {...props}>{children}</h3>;
          },
          // Make links open in new tab
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-nord-frost-1 hover:text-nord-frost-0 underline decoration-nord-frost-1/30 underline-offset-2 transition-colors">
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
