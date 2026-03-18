import React, { useState, useEffect } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);

  // 📂 EXHUSTIVE HACKER LOGS
  const terminalCodes = [
    { text: "> AXON_NODE_BOOT_v4.0.2 INITIALIZED...", delay: 200 },
    { text: "> KANDY_LKA_GATEWAY: 192.168.1.104 CONNECTED", delay: 500 },
    { text: "> ATTEMPTING HANDSHAKE WITH MARYLAND_HUB...", delay: 800 },
    { text: "> [!] SECURITY ALERT: PACKET_SNIFFER DETECTED", delay: 400 },
    { text: "> DEPLOYING COUNTER-MEASURES... [OK]", delay: 700 },
    { text: "> TUNNELING THROUGH VPN_STRATA_7...", delay: 600 },
    { text: "> LOADING BIOMETRIC_DATABASE...", delay: 900 },
    { text: "> SCANNING RETINA SIGNATURE: JASIM, S.", delay: 1000 },
    { text: "> ENCRYPTION_LAYER: 4096-BIT RSA...", delay: 500 },
    { text: "> ACCESSING RESTRICTED_FILE: BOOKS.LOG", delay: 400 },
    { text: "> ACCESSING RESTRICTED_FILE: DIARY.LOG", delay: 400 },
    { text: "> ACCESSING RESTRICTED_FILE: CODING.LOG", delay: 400 },
    { text: "> SYNCING SATELLITE_UPLINK [98%]", delay: 1200 },
    { text: "> BYPASSING AUTH_GATEWAY_3...", delay: 800 },
    { text: "> SYSTEM READY. WELCOME BACK, OPERATIVE.", delay: 600 }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() !== 'user' || password.toLowerCase() !== 'user') {
      setError('AUTH_ERROR: IDENTITY_UNVERIFIED');
      return;
    }
    setError('');
    startAdvancedSequence();
  };

  const startAdvancedSequence = () => {
    setIsInitializing(true);
    let logIndex = 0;
    
    const showNextLog = () => {
      if (logIndex < terminalCodes.length) {
        setLoadingLogs(prev => [...prev, terminalCodes[logIndex].text]);
        setScanProgress(((logIndex + 1) / terminalCodes.length) * 100);
        
        // Use the custom delay for each line to make it feel "real"
        setTimeout(showNextLog, terminalCodes[logIndex].delay);
        logIndex++;
      } else {
        setTimeout(() => onLoginSuccess(), 1000);
      }
    };

    showNextLog();
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes flicker {
          0% { opacity: 0.9; } 5% { opacity: 0.5; } 10% { opacity: 0.9; }
          15% { opacity: 0.8; } 100% { opacity: 0.9; }
        }
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
        .terminal-box { 
          animation: flicker 0.15s infinite;
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 5px #0f0;
        }
        .scanline {
          width: 100%; height: 3px; background: rgba(0, 255, 0, 0.05);
          position: absolute; animation: scanline 6s linear infinite; z-index: 10;
        }
        .glass-input:focus { border-color: #00f2ff !important; box-shadow: 0 0 15px rgba(0, 242, 255, 0.2); }
      `}</style>

      {isInitializing ? (
        /* 🕵️‍♂️ THE 10-SECOND HACKER TERMINAL */
        <div style={styles.terminalWrapper} className="terminal-box">
          <div className="scanline" />
          <div style={styles.terminalHeader}>
            <span style={{ color: '#0f0' }}>●</span> SYSTEM_UPLINK_ESTABLISHED
            <span style={{ float: 'right', color: '#666' }}>v4.0.2</span>
          </div>
          
          <div style={styles.logContainer}>
            {loadingLogs.map((log, i) => (
              <div key={i} style={{ 
                marginBottom: '6px', 
                color: log.includes('[!]') ? '#ff4444' : '#0f0',
                fontSize: '0.8rem'
              }}>
                {log}
              </div>
            ))}
            <div style={{ color: '#0f0' }} className="blink">_</div>
          </div>

          <div style={styles.progressSection}>
            <div style={styles.progressLabel}>DECRYPTING_NODE_DATA: {Math.round(scanProgress)}%</div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressBar, width: `${scanProgress}%` }} />
            </div>
          </div>
        </div>
      ) : (
        /* ⚪ THE ULTRA-MODERN LOGIN */
        <div style={styles.glassCard}>
          <div style={styles.logoBadge}>SJ</div>
          <h2 style={styles.title}>AXON_NODE</h2>
          <p style={styles.subtitle}>Secure Access Required</p>

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <input 
              type="text" className="glass-input" style={styles.input} 
              placeholder="IDENTIFIER" autoComplete="off"
              value={username} onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
              type="password" className="glass-input" style={styles.input} 
              placeholder="PASSCODE" 
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={styles.button}>AUTHENTICATE</button>
          </form>
          <div style={styles.footer}>KANDY_LKA // NODE_STATION_04</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#010204', overflow: 'hidden', padding: '20px'
  },
  glassCard: {
    width: '100%', maxWidth: '380px', padding: '50px 30px',
    background: 'rgba(10, 12, 18, 0.9)', backdropFilter: 'blur(20px)',
    borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
  },
  logoBadge: {
    width: '80px', height: '80px', background: 'linear-gradient(135deg, #00f2ff, #0060ff)',
    borderRadius: '24px', margin: '0 auto 30px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '2rem', fontWeight: '900', color: '#fff',
    boxShadow: '0 0 40px rgba(0, 242, 255, 0.2)'
  },
  title: { fontSize: '1.6rem', fontWeight: '900', letterSpacing: '3px', color: '#fff', marginBottom: '5px' },
  subtitle: { fontSize: '0.75rem', color: '#484f58', marginBottom: '35px', textTransform: 'uppercase' },
  input: {
    width: '100%', padding: '16px 20px', marginBottom: '15px', borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff', fontSize: '1rem', outline: 'none'
  },
  button: {
    width: '100%', padding: '18px', marginTop: '10px', borderRadius: '16px', border: 'none',
    background: '#fff', color: '#000', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer'
  },
  terminalWrapper: {
    width: '100%', maxWidth: '600px', height: '420px', background: '#000',
    padding: '25px', borderRadius: '15px', border: '1px solid #1a1a1a',
    position: 'relative', display: 'flex', flexDirection: 'column'
  },
  terminalHeader: { 
    fontSize: '0.7rem', color: '#666', borderBottom: '1px solid #1a1a1a', 
    paddingBottom: '10px', marginBottom: '15px', textTransform: 'uppercase' 
  },
  logContainer: { flexGrow: 1, overflowY: 'hidden' },
  progressSection: { marginTop: '20px' },
  progressLabel: { fontSize: '0.65rem', color: '#0f0', marginBottom: '8px', letterSpacing: '1px' },
  progressTrack: { width: '100%', height: '3px', background: '#111', borderRadius: '2px' },
  progressBar: { height: '100%', background: '#0f0', boxShadow: '0 0 15px #0f0', transition: 'width 0.4s ease' },
  error: { color: '#ff4444', fontSize: '0.75rem', marginBottom: '15px', fontWeight: '800' },
  footer: { marginTop: '40px', fontSize: '0.6rem', color: '#30363d', letterSpacing: '2px' }
};

export default Login;