import React from 'react';

const Dashboard = ({ onStartAnalysis }) => {
  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      gap: '2rem'
    }}>
      <div style={{
        position: 'relative',
        display: 'inline-block'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '140%',
          height: '140%',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 0
        }}></div>
        <h1 style={{
          fontSize: '4rem',
          margin: 0,
          background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'relative',
          zIndex: 1
        }}>
          Medical AI Analyzer
        </h1>
      </div>
      
      <p style={{
        fontSize: '1.25rem',
        color: 'var(--text-muted)',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        Harness the power of Retrieval-Augmented Generation (RAG) and Large Language Models to instantly analyze, understand, and converse with your medical reports.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button className="btn-primary" onClick={onStartAnalysis} style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
          Start Analysis
        </button>
        <a href="#how-it-works" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          How it works
        </a>
      </div>
      
      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        marginTop: '4rem'
      }}>
        {[
          { title: 'Instant Analysis', desc: 'Get immediate insights into biomarkers and vitals.', icon: '⚡' },
          { title: 'RAG Powered', desc: 'Our AI grounds its answers directly in your report data.', icon: '🧠' },
          { title: 'Conversational', desc: 'Ask specific questions and get detailed, contextual answers.', icon: '💬' }
        ].map((feature, i) => (
          <div key={i} className="glass-panel" style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            animationDelay: `${i * 0.15}s`
          }}>
            <div style={{ fontSize: '2.5rem' }}>{feature.icon}</div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
