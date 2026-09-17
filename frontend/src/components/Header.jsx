const Header = ({ onViewChange }) => {
  return (
    <header className="glass-panel" style={{ 
      margin: '1rem', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => onViewChange('dashboard')}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'linear-gradient(135deg, var(--accent-color), var(--success))', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          +
        </div>
        <h1 style={{ fontSize: '1.5rem', margin: 0, letterSpacing: '-0.5px' }}>MediAI<span style={{ color: 'var(--accent-color)' }}>Analyzer</span></h1>
      </div>
      
      <nav>
        <button 
          onClick={() => onViewChange('dashboard')} 
          style={{ 
            background: 'transparent', 
            color: 'var(--text-main)', 
            fontWeight: '500', 
            fontSize: '1rem', 
            marginRight: '1rem' 
          }}
        >
          Dashboard
        </button>
        <button className="btn-primary" onClick={() => onViewChange('input')}>
          New Analysis
        </button>
      </nav>
    </header>
  );
};

export default Header;
