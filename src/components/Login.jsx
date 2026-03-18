import React, { useState, useEffect } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  
  // ⚡ LOADING STATES
  const [isInitializing, setIsInitializing] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState([]);

  // Random "Hacker/System" codes to show during loading
  const terminalCodes = [
    "> CONNECTING TO MARYLAND_HUB...",
    "> BYPASSING KANDY_NODE_FIREWALL...",
    "> AUTHENTICATING AXON_ENCRYPTION...",
    "> DECRYPTING USER_DATA_STREAM...",
    "> STABILIZING SATELLITE_UPLINK...",
    "> ACCESSING LANGLEY_REPORTS.EXE...",
    "> INITIALIZING WIN98_INTERFACE...",
    "> LOGIN_SUCCESS: SHIFANTH_JASIM",
    "> WELCOME_OPERATIVE..."
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username !== 'User') {
      triggerError('Invalid Identity.');
    } else if (password !== 'user') {
      triggerError('Access Denied.');
    } else {
      setError('');
      startInitialization();
    }
  };

  const startInitialization = () => {
    setIsInitializing(true);
    let logIndex = 0;
    
    // Show a new log every 300ms
    const interval = setInterval(() => {
      if (logIndex < terminalCodes.length) {
        setLoadingLogs(prev => [...prev, terminalCodes[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onLoginSuccess(); // Finally enter the app
        }, 500);
      }
    }, 350);
  };

  const triggerError = (msg) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400); 
  };

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isInitializing ? '#000' : 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      fontFamily: '"Courier New", Courier, monospace',
      transition: 'background 0.5s ease'
    },
    card: {
      padding: '40px',
      borderRadius: '24px',
      width: '100%',
      maxWidth: '360px',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.25)', 
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      display: isInitializing ? 'none' : 'block'
    },
    terminal: {
      width: '100%',
      maxWidth: '500px',
      height: '300px',
      padding: '20px',
      background: '#000',
      color: '#0f0',
      textAlign: 'left',
      fontSize: '0.85rem',
      borderRadius: '10px',
      border: '1px solid #333',
      boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
      overflowY: 'auto',
      display: isInitializing ? 'block' : 'none'
    },
    input: {
      width: '100%', padding: '12px 15px', margin: '8px 0',
      borderRadius: '10px', border: '1px solid rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.5)', fontSize: '1rem', outline: 'none'
    },
    button: {
      width: '100%', padding: '12px', marginTop: '15px',
      borderRadius: '10px', border: 'none', color: 'white',
      background: 'linear-gradient(135deg, #2af5ef 0%, #4facfe 100%)',
      fontWeight: '600', cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* 🟢 THE SYSTEM LOADING SCREEN */}
      <div style={styles.terminal}>
        <div style={{color: '#fff', marginBottom: '10px', borderBottom: '1px solid #333'}}>SYSTEM_INITIALIZATION_SEQUENCE...</div>
        {loadingLogs.map((log, i) => (
          <div key={i} style={{marginBottom: '5px'}}>{log}</div>
        ))}
        <div className="blinking-cursor">_</div>
      </div>

      {/* ⚪ THE LOGIN CARD */}
      <div style={styles.card} className={isShaking ? 'shake-animation' : ''}>
        <div style={{marginBottom: '20px'}}>
          <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #2af5ef 0%, #4facfe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
            <span style={{fontSize: '2.2rem', fontWeight: '700', color: 'white'}}>SJ</span>
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#111', marginBottom: '25px' }}>Shifanth Jasim</h2>

        <form onSubmit={handleLogin}>
          <input type="text" style={styles.input} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" style={styles.input} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div style={{color: '#ff3b30', fontSize: '0.85rem', marginTop: '10px'}}>{error}</div>}
          <button type="submit" style={styles.button}>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;