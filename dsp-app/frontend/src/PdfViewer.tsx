import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure the PDF worker to load from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfUrl?: string | null;
}

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pageInput, setPageInput] = useState<string>('1');

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInput('1');
  }

  const goToPage = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(page, numPages));
    setPageNumber(clamped);
    setPageInput(String(clamped));
  }, [numPages]);

  const handlePageInput = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInput);
      if (!isNaN(page)) goToPage(page);
    }
  }, [pageInput, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Only handle if no input is focused
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPage(pageNumber - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToPage(pageNumber + 1);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pageNumber, goToPage]);

  // Update page input when page changes externally
  useEffect(() => {
    setPageInput(String(pageNumber));
  }, [pageNumber]);

  if (!pdfUrl) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center h-full">
        <div className="max-w-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-nord-polar-1/40 flex items-center justify-center">
            <svg className="w-8 h-8 text-nord-frost-1/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-nord-snow-1 mb-2">Course Materials</h2>
          <p className="text-sm text-nord-polar-3 leading-relaxed">
            Select a week from the sidebar to view lecture slides, or click a source link from the AI tutor to jump to a specific page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full bg-nord-bg pt-3 w-full">
      {/* Navigation bar */}
      <div className="mb-3 flex items-center gap-3 glass px-4 py-2 rounded-lg">
        {/* Previous button */}
        <button
          disabled={pageNumber <= 1}
          onClick={() => goToPage(pageNumber - 1)}
          className="p-1.5 rounded-md text-nord-frost-1 hover:bg-nord-frost-1/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Previous page (←)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page input */}
        <div className="flex items-center gap-1.5 text-sm">
          <input
            type="text"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={handlePageInput}
            onBlur={() => {
              const page = parseInt(pageInput);
              if (!isNaN(page)) goToPage(page);
              else setPageInput(String(pageNumber));
            }}
            className="w-10 text-center bg-nord-elevated border border-nord-border rounded px-1.5 py-0.5 text-nord-snow-1 font-mono text-xs focus:border-nord-frost-1 focus:outline-none transition-colors"
          />
          <span className="text-nord-polar-3 text-xs font-medium">/ {numPages}</span>
        </div>

        {/* Next button */}
        <button
          disabled={pageNumber >= numPages}
          onClick={() => goToPage(pageNumber + 1)}
          className="p-1.5 rounded-md text-nord-frost-1 hover:bg-nord-frost-1/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Next page (→)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-nord-border" />

        {/* Zoom controls */}
        <button
          onClick={() => setScale(s => Math.max(0.5, s - 0.15))}
          className="p-1.5 rounded-md text-nord-snow-0/60 hover:text-nord-frost-1 hover:bg-nord-frost-1/10 transition-all"
          title="Zoom out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-xs font-mono text-nord-polar-3 w-10 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale(s => Math.min(2.0, s + 0.15))}
          className="p-1.5 rounded-md text-nord-snow-0/60 hover:text-nord-frost-1 hover:bg-nord-frost-1/10 transition-all"
          title="Zoom in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => setScale(1.0)}
          className="px-2 py-0.5 rounded text-[0.65rem] font-semibold text-nord-polar-3 hover:text-nord-frost-1 border border-nord-border hover:border-nord-frost-1/30 transition-all"
          title="Reset zoom"
        >
          Reset
        </button>
      </div>

      {/* PDF content */}
      <div className="flex-1 overflow-auto w-full flex justify-center pb-8">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="mt-16 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-nord-frost-1/30 border-t-nord-frost-1 rounded-full animate-spin" />
              <span className="text-sm text-nord-polar-3">Loading PDF...</span>
            </div>
          }
          className="shadow-2xl"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            scale={scale}
            width={780}
          />
        </Document>
      </div>
    </div>
  );
}
