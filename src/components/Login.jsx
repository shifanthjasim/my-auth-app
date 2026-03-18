import React, { useState, useEffect } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);

  const terminalCodes = [
    "> INITIALIZING AXON_NODE UPLINK...",
    "> ESTABLISHING QUANTUM HANDSHAKE...",
    "> SCANNING BIOMETRIC SIGNATURE...",
    "> LOCATION_ID: KANDY_SRI_LANKA",
    "> ENCRYPTION_KEY: AES-256_VERIFIED",
    "> BYPASSING REGIONAL FIREWALLS...",
    "> LOADING LANGLEY_REPORTS.SYS",
    "> ACCESS_GRANTED: WELCOME SHIFANTH",
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() !== 'user' || password.toLowerCase() !== 'user') {
      setError('AUTHENTICATION_FAILURE');
      return;
    }
    setError('');
    startSequence();
  };

  const startSequence = () => {
    setIsInitializing(true);
    let logIndex = 0;
    
    const interval = setInterval(() => {
      if (logIndex < terminalCodes.length) {
        setLoadingLogs(prev => [...prev, terminalCodes[logIndex]]);
        setScanProgress((logIndex + 1) * 12.5); // Progress bar logic
        logIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => onLoginSuccess(), 800);
      }
    }, 400);
  };

  return (
    <div className="login-master" style={styles.container}>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
        .terminal-text { font-family: 'Courier New', monospace; text-shadow: 0 0 8px #0f0; }
        .glass-input:focus { border-color: #00f2ff !important; box-shadow: 0 0 15px rgba(0, 242, 255, 0.3); }
        .scanline {
          width: 100%; height: 2px; background: rgba(0, 255, 0, 0.1);
          position: absolute; animation: scanline 4s linear infinite;
        }
      `}</style>

      {/* 🟢 THE ADVANCED INITIALIZATION SCREEN */}
      {isInitializing ? (
        <div style={styles.terminalWrapper}>
          <div className="scanline" />
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #111', paddingBottom: '10px' }}>
            <span style={{ color: '#0f0', fontWeight: 'bold' }}>[ AXON_SECURE_BOOT_v4.0 ]</span>
          </div>
          <div className="terminal-text" style={{ color: '#0f0', fontSize: '0.9rem' }}>
            {loadingLogs.map((log, i) => <div key={i} style={{ marginBottom: '8px' }}>{log}</div>)}
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressBar, width: `${scanProgress}%` }} />
          </div>
        </div>
      ) : (
        /* ⚪ THE MODERN GLASS LOGIN */
        <div style={styles.glassCard}>
          <div style={styles.logoOuter}>
            <div style={styles.logoInner}>SJ</div>
          </div>
          
          <h2 style={styles.title}>SHIFANTH JASIM</h2>
          <p style={styles.subtitle}>Enter credentials for Maryland Uplink</p>

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <input 
              type="text" 
              className="glass-input" 
              style={styles.input} 
              placeholder="IDENTIFIER" 
              autoComplete="off"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
              type="password" 
              className="glass-input" 
              style={styles.input} 
              placeholder="PASSCODE" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            
            {error && <div style={styles.error}>{error}</div>}
            
            <button type="submit" style={styles.button}>
              INITIALIZE_SESSION
            </button>
          </form>

          <div style={styles.footer}>
            © 2026 AXON_NODE | SECURED_BY_SJ
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#02040a', overflow: 'hidden', padding: '20px'
  },
  glassCard: {
    width: '100%', maxWidth: '400px', padding: '40px 30px',
    background: 'rgba(13, 17, 23, 0.8)', backdropFilter: 'blur(15px)',
    borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
  },
  logoOuter: {
    width: '85px', height: '85px', borderRadius: '24px',
    background: 'linear-gradient(135deg, #00f2ff 0%, #0060ff 100%)',
    margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2px', boxShadow: '0 0 30px rgba(0, 242, 255, 0.3)'
  },
  logoInner: {
    width: '100%', height: '100%', borderRadius: '22px', background: '#0d1117',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: '800', color: '#fff', letterSpacing: '-1px'
  },
  title: { fontSize: '1.5rem', fontWeight: '800', letterSpacing: '2px', color: '#fff', marginBottom: '8px' },
  subtitle: { fontSize: '0.8rem', color: '#8b949e', marginBottom: '30px', textTransform: 'uppercase' },
  input: {
    width: '100%', padding: '15px 20px', marginBottom: '15px', borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s'
  },
  button: {
    width: '100%', padding: '16px', marginTop: '10px', borderRadius: '14px',
    border: 'none', background: '#fff', color: '#000', fontWeight: '800',
    fontSize: '0.85rem', cursor: 'pointer', transition: 'transform 0.2s',
    letterSpacing: '1px'
  },
  terminalWrapper: {
    width: '100%', maxWidth: '500px', height: '350px', background: '#000',
    padding: '30px', borderRadius: '20px', border: '1px solid #111',
    position: 'relative', overflow: 'hidden'
  },
  progressTrack: { width: '100%', height: '4px', background: '#111', marginTop: '30px', borderRadius: '2px' },
  progressBar: { height: '100%', background: '#0f0', transition: 'width 0.3s ease', boxShadow: '0 0 10px #0f0' },
  error: { color: '#ff4444', fontSize: '0.75rem', marginBottom: '15px', fontWeight: 'bold' },
  footer: { marginTop: '40px', fontSize: '0.65rem', color: '#484f58', letterSpacing: '1px' }
};

export default Login;