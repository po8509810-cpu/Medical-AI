import React from 'react';

const RAGContextPanel = ({ contextItems, isRetrieving }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <h3 style={{ 
        color: 'var(--accent-color)', 
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Retrieved Context
      </h3>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingRight: '0.5rem'
      }}>
        {isRetrieving ? (
          <div className="animate-fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '80px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                animation: 'pulse-glow 2s infinite'
              }}></div>
            ))}
          </div>
        ) : contextItems && contextItems.length > 0 ? (
          contextItems.map((item, index) => (
            <div key={item.id} className="animate-fade-in" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--surface-border)',
              borderRadius: '12px',
              padding: '1rem',
              position: 'relative',
              animationDelay: `${index * 0.1}s`
            }}>
              <div style={{
                position: 'absolute',
                top: '-0.5rem',
                right: '1rem',
                background: 'var(--success-glow)',
                color: 'var(--success)',
                border: '1px solid var(--success)',
                borderRadius: '20px',
                padding: '0.1rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {(item.confidence * 100).toFixed(0)}% Match
              </div>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                lineHeight: '1.5',
                marginTop: '0.25rem'
              }}>
                "{item.text}"
              </p>
            </div>
          ))
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            textAlign: 'center',
            opacity: 0.5
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p>Ask a question to see relevant context retrieved from the medical report.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RAGContextPanel;
