const AnalysisResults = ({ results, onNewAnalysis }) => {
  if (!results || results.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>No data provided for analysis.</h2>
        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={onNewAnalysis}>Go Back</button>
      </div>
    );
  }

  const abnormalities = results.filter(r => r.status !== 'normal');
  const hasAbnormalities = abnormalities.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', marginTop: 0 }}>Analysis Complete</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {hasAbnormalities 
              ? `Found ${abnormalities.length} abnormal reading(s).` 
              : 'All your readings are within normal ranges.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {results.map((item, idx) => {
          const isNormal = item.status === 'normal';
          const isHigh = item.status === 'high';
          const isLow = item.status === 'low';
          
          let statusColor = 'var(--success)';
          if (isHigh) statusColor = 'var(--warning)';
          if (isLow) statusColor = 'var(--danger)';

          return (
            <div key={idx} className="glass-panel" style={{ 
              padding: '1.5rem', 
              borderLeft: `4px solid ${statusColor}`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, right: 0, 
                padding: '0.25rem 0.75rem', 
                background: `${statusColor}20`,
                color: statusColor,
                fontWeight: 'bold',
                fontSize: '0.75rem',
                borderBottomLeftRadius: '8px'
              }}>
                {item.status.toUpperCase()}
              </div>
              
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', paddingRight: '4rem' }}>{item.name}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: statusColor, lineHeight: '1' }}>
                  {item.value}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {item.unit}
                </div>
              </div>
              
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
                Reference Range: {item.min} - {item.max} {item.unit}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisResults;
