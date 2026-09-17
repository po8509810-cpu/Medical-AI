import React, { useState } from 'react';

const ReportInput = ({ onAnalyze, onCancel }) => {
  const [reportText, setReportText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reportText.trim()) {
      onAnalyze({ text: reportText });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // In a real app, parse the PDF or image. For now, mock text.
      setReportText("Extracted text from uploaded file: \nVitals: BP 120/80 mmHg, HR 72 bpm\nLipid Panel: Total Cholesterol 185 mg/dL, HDL 55 mg/dL, LDL 110 mg/dL.");
    }
  };

  return (
    <div className="animate-fade-in glass-panel" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2.5rem',
      position: 'relative'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Upload Medical Report</h2>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
        Paste your medical report text below, or drag and drop a file to begin the AI analysis.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-color)' : 'var(--surface-border)'}`,
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            background: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '64px', height: '64px',
            borderRadius: '50%',
            background: 'var(--surface-color-solid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            color: 'var(--accent-color)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <h3 style={{ margin: '0 0 0.5rem' }}>Drag & Drop your report here</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supports PDF, JPG, PNG, or raw text</p>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-0.75rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--surface-color-solid)',
            padding: '0 1rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>OR PASTE TEXT</div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--surface-border)', margin: '1.5rem 0' }} />
        </div>

        <div>
          <textarea
            className="input-field"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Paste raw medical report text here..."
            style={{ 
              minHeight: '200px', 
              resize: 'vertical',
              fontFamily: 'monospace'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={!reportText.trim()}
            style={{ opacity: !reportText.trim() ? 0.5 : 1, cursor: !reportText.trim() ? 'not-allowed' : 'pointer' }}
          >
            Start Analysis
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportInput;
