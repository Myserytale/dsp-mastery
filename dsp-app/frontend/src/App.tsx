import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import PdfViewer from './PdfViewer';
import MarkdownRenderer from './MarkdownRenderer';
import type { WeekContent } from './content';
import { getAllWeeks } from './content';

// Global Pyodide instance
declare global {
  interface Window {
    loadPyodide: any;
    pyodideInstance: any;
  }
}

type ContentTab = 'lesson' | 'homework' | 'lab' | 'formulas';
type RightTab = 'pdf' | 'editor';

const WEEK_META = [
  { id: 1, title: 'Introduction & Basic Concepts', slide: 'dsp01.pdf', hw: 'dsp_homework01.pdf' },
  { id: 2, title: 'LTI Systems & Convolution', slide: 'dsp02.pdf', hw: 'dsp_homework02.pdf' },
  { id: 3, title: 'Fourier Series & Transform', slide: 'dsp03.pdf', hw: 'dsp_homework03.pdf' },
  { id: 4, title: 'Discrete-Time Fourier Transform', slide: 'dsp04.pdf', hw: 'dsp_homework04.pdf' },
  { id: 5, title: 'Z-Transform', slide: 'dsp05.pdf', hw: 'dsp_homework05.pdf' },
  { id: 6, title: 'Sampling & Reconstruction', slide: 'dsp06.pdf', hw: 'dsp_homework06.pdf' },
  { id: 7, title: 'Discrete Fourier Transform', slide: 'dsp07.pdf', hw: 'dsp_homework07.pdf' },
  { id: 8, title: 'Fast Fourier Transform', slide: 'dsp08.pdf', hw: 'dsp_homework08.pdf' },
  { id: 9, title: 'IIR Filter Design', slide: 'dsp09.pdf', hw: 'dsp_homework09.pdf' },
  { id: 10, title: 'FIR Filter Design', slide: 'dsp10.pdf', hw: 'dsp_homework10.pdf' },
  { id: 11, title: 'Filter Structures', slide: 'dsp11.pdf', hw: 'dsp_homework11.pdf' },
  { id: 12, title: 'Advanced Topics', slide: 'dsp12.pdf', hw: 'dsp_homework12.pdf' },
  { id: 13, title: 'Review & Exam Prep', slide: 'dsp13.pdf', hw: null },
];

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  const [allWeeks, setAllWeeks] = useState<WeekContent[]>([]);
  const [activeWeekId, setActiveWeekId] = useState<number | null>(null);
  const [contentTab, setContentTab] = useState<ContentTab>('lesson');
  const [rightTab, setRightTab] = useState<RightTab>('pdf');
  const [expandedConcept, setExpandedConcept] = useState<number | null>(null);

  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfLabel, setActivePdfLabel] = useState('');

  const [code, setCode] = useState(`import numpy as np
import matplotlib.pyplot as plt

# Example: Generate and plot a sinusoid
fs = 1000
t = np.arange(0, 0.1, 1/fs)
x = np.sin(2 * np.pi * 50 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)

plt.figure(figsize=(10, 4))
plt.plot(t * 1000, x)
plt.xlabel('Time (ms)')
plt.title('50 Hz + 120 Hz')
plt.grid(True, alpha=0.3)
plt.show()`);
  const [codeOutput, setCodeOutput] = useState('');
  const [codeImages, setCodeImages] = useState<string[]>([]);
  const [codeRunning, setCodeRunning] = useState(false);

  // Resizable pane state
  const [rightPaneWidth, setRightPaneWidth] = useState(480);
  const [isResizing, setIsResizing] = useState(false);

  const [outputHeight, setOutputHeight] = useState(250);
  const [isResizingOutput, setIsResizingOutput] = useState(false);

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  
  const startResizingOutput = useCallback(() => setIsResizingOutput(true), []);
  const stopResizingOutput = useCallback(() => setIsResizingOutput(false), []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        // Calculate new width: window inner width - mouse X position
        const newWidth = document.body.clientWidth - mouseMoveEvent.clientX;
        if (newWidth > 300 && newWidth < 1200) {
          setRightPaneWidth(newWidth);
        }
      }
      if (isResizingOutput) {
        // Calculate new height: window inner height - mouse Y position
        const newHeight = document.body.clientHeight - mouseMoveEvent.clientY;
        if (newHeight > 100 && newHeight < document.body.clientHeight - 100) {
          setOutputHeight(newHeight);
        }
      }
    },
    [isResizing, isResizingOutput]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    window.addEventListener('mouseup', stopResizingOutput);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('mouseup', stopResizingOutput);
    };
  }, [resize, stopResizing, stopResizingOutput]);

  useEffect(() => {
    getAllWeeks().then(setAllWeeks).catch(console.error);
  }, []);

  const activeWeek = allWeeks.find(w => w.id === activeWeekId) || null;
  const weekMeta = WEEK_META.find(w => w.id === activeWeekId);

  const selectWeek = (id: number) => {
    setActiveWeekId(id);
    setContentTab('lesson');
    setExpandedConcept(null);
    const meta = WEEK_META.find(w => w.id === id);
    if (meta) {
      setActivePdfUrl(`${API_BASE}/static/slides/${meta.slide}`);
      setActivePdfLabel(`Week ${id} Slides`);
    }
  };

  const loadPdf = (type: 'slide' | 'homework') => {
    if (!weekMeta) return;
    if (type === 'slide') {
      setActivePdfUrl(`${API_BASE}/static/slides/${weekMeta.slide}`);
      setActivePdfLabel(`Week ${weekMeta.id} Slides`);
    } else if (weekMeta.hw) {
      const folder = String(weekMeta.id).padStart(2, '0');
      setActivePdfUrl(`${API_BASE}/static/homework/${folder}/${weekMeta.hw}`);
      setActivePdfLabel(`Homework ${weekMeta.id}`);
    }
    setRightTab('pdf');
  };

  const [pyodideLoadingMsg, setPyodideLoadingMsg] = useState('');

  const initPyodide = async () => {
    if (window.pyodideInstance) return window.pyodideInstance;
    setPyodideLoadingMsg('⏳ Initializing Pyodide (this may take a minute on first run)...');
    try {
      const pyodide = await window.loadPyodide();
      setPyodideLoadingMsg('⏳ Loading Python packages (numpy, scipy, matplotlib)...');
      await pyodide.loadPackage(['numpy', 'scipy', 'matplotlib']);
      window.pyodideInstance = pyodide;
      setPyodideLoadingMsg('');
      return pyodide;
    } catch (e) {
      console.error(e);
      setPyodideLoadingMsg('❌ Failed to load Pyodide.');
      throw e;
    }
  };

  useEffect(() => {
    // Preload pyodide in background
    initPyodide().catch(() => {});
  }, []);

  const handleCopyToIDE = useCallback((codeText: string) => {
    setCode(codeText);
    setRightTab('editor');
    setCodeOutput('✅ Code copied! Press Ctrl+Enter or click ▶ Run to execute.');
    setCodeImages([]);
  }, []);

  const handleRunCode = async () => {
    if (codeRunning) return;
    setCodeRunning(true);
    setCodeOutput('⏳ Running locally via WebAssembly...');
    setCodeImages([]);
    
    try {
      const pyodide = await initPyodide();
      
      // Inject setup code for matplotlib
      const setupCode = `
import sys
import io
import base64
from contextlib import redirect_stdout
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

plt.clf()
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`;
      await pyodide.runPythonAsync(setupCode);

      // Run user code
      try {
        await pyodide.runPythonAsync(code);
      } catch (err: any) {
        // Output the error
        const stderr = await pyodide.runPythonAsync(`sys.stderr.getvalue()`);
        setCodeOutput(`❌ Error:\n${err}\n${stderr}`);
        setCodeRunning(false);
        return;
      }

      // Capture output and figures
      const captureCode = `
import json
output = sys.stdout.getvalue()
figures = []
for i in plt.get_fignums():
    fig = plt.figure(i)
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    figures.append(base64.b64encode(buf.read()).decode('utf-8'))
    plt.close(fig)
json.dumps({"output": output, "figures": figures})
`;
      const resultJson = await pyodide.runPythonAsync(captureCode);
      const { output, figures } = JSON.parse(resultJson);
      
      setCodeOutput(output || '✅ Executed successfully (no output).');
      if (figures?.length) setCodeImages(figures);

    } catch (e: any) {
      setCodeOutput(`❌ Pyodide Error:\n${e}`);
    } finally {
      setCodeRunning(false);
    }
  };

  const CONTENT_TABS: { key: ContentTab; label: string; accent: string }[] = [
    { key: 'lesson', label: '📖 Lesson', accent: 'bg-nord-frost-1' },
    { key: 'homework', label: '📝 Homework', accent: 'bg-nord-aurora-yellow' },
    { key: 'lab', label: '🧪 Lab Code', accent: 'bg-nord-aurora-green' },
    { key: 'formulas', label: '📐 Formulas', accent: 'bg-nord-aurora-purple' },
  ];

  const renderContent = () => {
    if (!activeWeek) {
      return (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-5">📚</div>
            <h2 className="text-2xl font-bold text-nord-snow-2 mb-3">DSP Mastery</h2>
            <p className="text-sm text-nord-polar-3 leading-relaxed mb-6">
              13 weeks of comprehensive DSP teaching — concepts with intuitive explanations, LaTeX math, 
              runnable Python code, homework hints, and lab walkthroughs. All pre-written and instantly available.
            </p>
            <p className="text-xs text-nord-polar-3/60">← Select a week from the sidebar to begin</p>
          </div>
        </div>
      );
    }

    switch (contentTab) {
      case 'lesson':
        return (
          <div className="p-6 space-y-4">
            <div className="mb-6">
              <MarkdownRenderer content={activeWeek.bigPicture} onCopyToIDE={handleCopyToIDE} />
            </div>
            <h2 className="text-xs font-bold text-nord-frost-1 uppercase tracking-[0.15em] mb-3">
              Core Concepts ({activeWeek.concepts.length})
            </h2>
            <div className="space-y-1.5">
              {activeWeek.concepts.map((concept, idx) => (
                <div key={idx} className="border border-nord-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedConcept(expandedConcept === idx ? null : idx)}
                    className="w-full text-left px-4 py-3 bg-nord-elevated hover:bg-nord-polar-0/30 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[0.65rem] font-bold text-nord-frost-1 bg-nord-frost-1/10 w-5 h-5 flex items-center justify-center rounded">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-sm text-nord-snow-1 group-hover:text-nord-snow-2 transition-colors">
                        {concept.name}
                      </span>
                    </div>
                    <svg className={`w-4 h-4 text-nord-polar-3 transition-transform duration-200 ${expandedConcept === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedConcept === idx && (
                    <div className="px-5 py-4 border-t border-nord-border bg-nord-surface/50 animate-slide-up">
                      <MarkdownRenderer content={concept.explanation} onCopyToIDE={handleCopyToIDE} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'homework':
        return (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xs font-bold text-nord-aurora-yellow uppercase tracking-[0.15em]">Homework Guide</h2>
              {weekMeta?.hw && (
                <button onClick={() => loadPdf('homework')} className="text-[0.7rem] font-semibold text-nord-frost-1 bg-nord-frost-1/10 px-2.5 py-1 rounded-md hover:bg-nord-frost-1/20 transition-colors">
                  📄 Open HW PDF →
                </button>
              )}
            </div>
            <MarkdownRenderer content={activeWeek.homeworkGuide} onCopyToIDE={handleCopyToIDE} />
          </div>
        );

      case 'lab':
        return (
          <div className="p-6">
            <h2 className="text-xs font-bold text-nord-aurora-green uppercase tracking-[0.15em] mb-5">Lab Code Walkthrough</h2>
            <MarkdownRenderer content={activeWeek.labWalkthrough} onCopyToIDE={handleCopyToIDE} />
          </div>
        );

      case 'formulas':
        return (
          <div className="p-6">
            <h2 className="text-xs font-bold text-nord-aurora-purple uppercase tracking-[0.15em] mb-5">Key Formulas — Quick Reference</h2>
            <MarkdownRenderer content={activeWeek.keyFormulas} onCopyToIDE={handleCopyToIDE} />
          </div>
        );
    }
  };

  return (
    <div 
      className="flex h-screen w-full bg-nord-bg text-nord-snow-0 font-sans overflow-hidden"
      style={{ userSelect: (isResizing || isResizingOutput) ? 'none' : 'auto' }}
    >

      {/* ═══ Left: Week Navigator ═══ */}
      <div className="w-52 bg-nord-surface border-r border-nord-border flex flex-col shrink-0">
        <div className="p-3 border-b border-nord-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-nord-frost-1 to-nord-frost-3 flex items-center justify-center text-xs font-bold text-nord-bg">Σ</div>
            <div>
              <h1 className="text-sm font-bold text-nord-snow-2">DSP Mastery</h1>
              <p className="text-[0.55rem] text-nord-polar-3 font-medium tracking-wider uppercase">Interactive Tutor</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-1.5 px-1.5 space-y-0.5">
          {WEEK_META.map(meta => (
            <button
              key={meta.id}
              onClick={() => selectWeek(meta.id)}
              className={`week-card w-full text-left px-2.5 py-2 rounded-lg transition-all text-[0.73rem] leading-snug ${
                activeWeekId === meta.id
                  ? 'active bg-nord-frost-1/10 text-nord-snow-2'
                  : 'text-nord-snow-0/50 hover:bg-nord-elevated hover:text-nord-snow-0/80'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`text-[0.55rem] font-bold w-5 text-center py-0.5 rounded shrink-0 mt-0.5 ${
                  activeWeekId === meta.id ? 'bg-nord-frost-1/20 text-nord-frost-1' : 'bg-nord-polar-0/40 text-nord-polar-3'
                }`}>
                  {meta.id}
                </span>
                <span className="font-medium">{meta.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Middle: Teaching Content ═══ */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-nord-border">
        <div className="flex border-b border-nord-border bg-nord-surface shrink-0">
          {CONTENT_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setContentTab(tab.key); setExpandedConcept(null); }}
              className={`px-4 py-2.5 text-[0.78rem] font-semibold transition-all relative ${
                contentTab === tab.key ? 'text-nord-snow-2' : 'text-nord-polar-3 hover:text-nord-snow-0'
              }`}
            >
              {tab.label}
              {contentTab === tab.key && <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.accent}`} />}
            </button>
          ))}
          <div className="flex-1" />
          {weekMeta && (
            <div className="flex items-center gap-1 pr-2">
              <button onClick={() => loadPdf('slide')} className="text-[0.65rem] font-medium text-nord-frost-0/50 hover:text-nord-frost-1 px-2 py-1 rounded transition-colors">
                📖 Slides
              </button>
              {weekMeta.hw && (
                <button onClick={() => loadPdf('homework')} className="text-[0.65rem] font-medium text-nord-aurora-yellow/50 hover:text-nord-aurora-yellow px-2 py-1 rounded transition-colors">
                  📝 HW
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>

      {/* ═══ Resizer ═══ */}
      <div
        className={`w-1.5 hover:bg-nord-frost-1 cursor-col-resize shrink-0 z-10 transition-colors ${isResizing ? 'bg-nord-frost-1' : 'bg-nord-border'}`}
        onMouseDown={startResizing}
      />

      {/* ═══ Right: PDF + IDE ═══ */}
      <div 
        className="flex flex-col bg-nord-bg shrink-0"
        style={{ width: `${rightPaneWidth}px` }}
      >
        <div className="flex border-b border-nord-border bg-nord-surface shrink-0">
          {([
            { key: 'pdf' as RightTab, label: '📄 PDF Viewer' },
            { key: 'editor' as RightTab, label: '💻 Code IDE' },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setRightTab(tab.key)}
              className={`px-4 py-2.5 text-[0.78rem] font-semibold transition-all relative ${
                rightTab === tab.key ? 'text-nord-snow-2' : 'text-nord-polar-3 hover:text-nord-snow-0'
              }`}
            >
              {tab.label}
              {rightTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-nord-frost-1" />}
            </button>
          ))}
          {rightTab === 'pdf' && activePdfLabel && (
            <div className="flex-1 flex items-center justify-end pr-3">
              <span className="text-[0.6rem] text-nord-polar-3 truncate max-w-[200px]">{activePdfLabel}</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden relative">
          {rightTab === 'pdf' && (
            <div className="absolute inset-0 bg-nord-surface/30">
              <PdfViewer pdfUrl={activePdfUrl} />
            </div>
          )}

          {rightTab === 'editor' && (
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 min-h-0">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    padding: { top: 12 },
                    lineHeight: 22,
                    renderLineHighlight: 'gutter',
                    scrollBeyondLastLine: false,
                  }}
                  onMount={(editor) => {
                    editor.addAction({
                      id: 'run-code',
                      label: 'Run Code',
                      keybindings: [2048 | 3], // Ctrl+Enter
                      run: () => handleRunCode(),
                    });
                      }}
                    />
                  </div>
                  {/* Vertical Resizer */}
                  <div
                    className={`h-1.5 hover:bg-nord-frost-1 cursor-row-resize shrink-0 z-10 transition-colors ${isResizingOutput ? 'bg-nord-frost-1' : 'bg-nord-border'}`}
                    onMouseDown={startResizingOutput}
                  />
                  <div 
                    className="border-t border-nord-border bg-nord-bg flex flex-col shrink-0"
                    style={{ height: `${outputHeight}px` }}
                  >
                    <div className="flex justify-between items-center px-3 py-1.5 bg-nord-surface border-b border-nord-border">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-nord-aurora-red/60" />
                      <div className="w-2 h-2 rounded-full bg-nord-aurora-yellow/60" />
                      <div className="w-2 h-2 rounded-full bg-nord-aurora-green/60" />
                    </div>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-nord-polar-3">Output</span>
                  </div>
                  <button
                    onClick={handleRunCode}
                    disabled={codeRunning}
                    className="btn-glow bg-nord-aurora-green/20 hover:bg-nord-aurora-green/30 text-nord-aurora-green px-3 py-1 rounded text-xs font-bold border border-nord-aurora-green/20 transition-all disabled:opacity-50"
                  >
                    {codeRunning ? '⏳ Running...' : '▶ Run'}
                  </button>
                </div>
                <div className="flex-1 p-3 overflow-auto font-mono text-xs whitespace-pre-wrap text-nord-snow-0/80">
                  {pyodideLoadingMsg && <div className="text-nord-aurora-yellow mb-2">{pyodideLoadingMsg}</div>}
                  {codeOutput || <span className="text-nord-polar-3">Press Ctrl+Enter or click ▶ Run to execute code</span>}
                  {codeImages.map((img, i) => (
                    <div key={i} className="mt-3 rounded-lg overflow-hidden border border-nord-border bg-nord-snow-0 p-1">
                      <img src={`data:image/png;base64,${img}`} alt={`Plot ${i + 1}`} className="max-w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
