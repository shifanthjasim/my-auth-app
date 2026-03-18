import React, { useState, useEffect } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [flavorText, setFlavorText] = useState('');

  const funnyMessages = [
    "ESTABLISHING SECURE HANDSHAKE...",
    "HIDING BROWSER HISTORY FROM ISP...",
    "ORDERING SHORT-EATS FROM KCC...",
    "CALIBRATING RETINAL SCANNERS...",
    "LOCATING MARYLAND HUB... FOUND.",
    "DELETING EVIDENCE OF PROCRASTINATION...",
    "CONVINCING THE DATABASE TO WAKE UP...",
    "BYPASSING KANDY_PROXIES...",
    "SCRUBBING DIGITAL FOOTPRINTS...",
    "SYSTEM_READY. WELCOME OPERATIVE."
  ];

  const terminalCodes = [
    { text: ">> KERNEL_UPLINK: ONLINE", delay: 200 },
    { text: ">> NODE_ID: KANDY_LKA_STATION_04", delay: 400 },
    { text: ">> [DANGER] UNAUTHORIZED PING DETECTED", delay: 700 },
    { text: ">> DEPLOYING DECOY DATA... [SUCCESS]", delay: 500 },
    { text: ">> TUNNELING VIA NEW_ZEALAND_RELAY...", delay: 800 },
    { text: ">> SCANNING BIOMETRICS: JASIM, S.", delay: 1000 },
    { text: ">> DECRYPTING VAULT: BOOKS/NOTES/DIARY", delay: 1200 },
    { text: ">> INJECTING RSA_DECRYPTION_KEY...", delay: 600 },
    { text: ">> AXON_NODE: FULL CONTROL ESTABLISHED", delay: 500 },
    { text: ">> HANDSHAKE_COMPLETE. REDIRECTING...", delay: 400 }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() !== 'user' || password.toLowerCase() !== 'user') {
      setError('ACCESS_DENIED: IDENTITY_UNVERIFIED');
      return;
    }
    setError('');
    startAdvancedSequence();
  };

  const startAdvancedSequence = () => {
    setIsInitializing(true);
    
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      if (msgIndex < funnyMessages.length) {
        setFlavorText(funnyMessages[msgIndex]);
        msgIndex++;
      } else {
        clearInterval(msgInterval);
      }
    }, 900);

    let logIndex = 0;
    const showNextLog = () => {
      if (logIndex < terminalCodes.length) {
        setLoadingLogs(prev => [...prev, terminalCodes[logIndex].text]);
        setScanProgress(((logIndex + 1) / terminalCodes.length) * 100);
        setTimeout(showNextLog, terminalCodes[logIndex].delay);
        logIndex++;
      } else {
        // 🚀 THE CLEAN EXIT HANDSHAKE
        setTimeout(() => {
          onLoginSuccess();
        }, 800);
      }
    };
    showNextLog();
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes fingerprint-glow { 0% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0.3; transform: scale(0.9); } }
        @keyframes blinker { 50% { opacity: 0; } }
        .hacker-grid { 
          background-image: linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px); 
          background-size: 30px 30px; 
        }
        .scanline {
          width: 100%; height: 4px; background: rgba(0, 255, 0, 0.1);
          position: absolute; animation: scanline 4s linear infinite; z-index: 10;
        }
        .fingerprint-icon {
          font-size: 4rem; color: #0f0; animation: fingerprint-glow 2s infinite;
          margin-bottom: 20px; text-shadow: 0 0 20px #0f0;
        }
        .blink-cursor { animation: blinker 1s step-end infinite; }
        .funny-msg { color: #00f2ff; font-weight: 800; letter-spacing: 2px; font-size: 0.75rem; text-transform: uppercase; }
      `}</style>

      {isInitializing ? (
        <div style={styles.terminalWrapper} className="hacker-grid">
          <div className="scanline" />
          
          <div style={styles.terminalHeader}>
            <span style={{ color: '#0f0' }}>● AXON_SECURE_UPLINK</span>
            <span style={{ color: '#444' }}>STATUS: ENCRYPTING</span>
          </div>

          <div style={styles.mainLoadingArea}>
            {/* 🛡️ BIOMETRIC SCANNER ANIMATION */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
               <i className="bi bi-fingerprint fingerprint-icon"></i>
               <p className="funny-msg">{flavorText}</p>
            </div>

            <div style={styles.logWrapper}>
              {loadingLogs.map((log, i) => (
                <div key={i} style={{ 
                  color: log.includes('DANGER') ? '#ff003c' : '#0f0', 
                  marginBottom: '6px', fontSize: '0.75rem', fontFamily: 'monospace'
                }}>
                  {log}
                </div>
              ))}
              <span style={{ color: '#0f0' }} className="blink-cursor">█</span>
            </div>
          </div>

          <div style={styles.footerSection}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#0f0', marginBottom: '8px', fontWeight: 'bold' }}>
                <span>DATA_STREAM_DECRYPTED</span>
                <span>{Math.round(scanProgress)}%</span>
             </div>
             <div style={styles.progressTrack}>
                <div style={{ ...styles.progressBar, width: `${scanProgress}%` }} />
             </div>
          </div>
        </div>
      ) : (
        <div style={styles.glassCard}>
          <div style={styles.logoHex}>SJ</div>
          <h2 style={styles.title}>AXON_NODE</h2>
          <p style={styles.subtitle}>Enter Passcode for Central Command</p>

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <input 
              type="text" style={styles.input} placeholder="IDENTIFIER" autoComplete="off"
              value={username} onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
              type="password" style={styles.input} placeholder="PASSCODE" 
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={styles.button}>INITIALIZE_UPLINK</button>
          </form>
          <div style={styles.footer}>KANDY_LKA // MD_CLOUD_UPLINK</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#010204', overflow: 'hidden', padding: '15px'
  },
  glassCard: {
    width: '100%', maxWidth: '380px', padding: '50px 30px',
    background: 'rgba(10, 12, 18, 0.95)', backdropFilter: 'blur(30px)',
    borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'center', boxShadow: '0 30px 100px rgba(0,0,0,0.9)'
  },
  logoHex: {
    width: '80px', height: '80px', background: 'linear-gradient(135deg, #00f2ff, #0060ff)',
    borderRadius: '24px', margin: '0 auto 30px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '2rem', fontWeight: '900', color: '#fff',
    boxShadow: '0 0 40px rgba(0, 242, 255, 0.3)'
  },
  title: { fontSize: '1.7rem', fontWeight: '900', letterSpacing: '4px', color: '#fff', marginBottom: '8px' },
  subtitle: { fontSize: '0.75rem', color: '#444', marginBottom: '35px', textTransform: 'uppercase' },
  input: {
    width: '100%', padding: '16px 22px', marginBottom: '15px', borderRadius: '18px',
    background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff', fontSize: '1rem', outline: 'none'
  },
  button: {
    width: '100%', padding: '18px', marginTop: '10px', borderRadius: '18px', border: 'none',
    background: '#fff', color: '#000', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer'
  },
  terminalWrapper: {
    width: '100%', maxWidth: '600px', height: '520px', background: '#000',
    padding: '30px', borderRadius: '25px', border: '1px solid #111',
    position: 'relative', display: 'flex', flexDirection: 'column'
  },
  terminalHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: '20px', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px' },
  mainLoadingArea: { flexGrow: 1, display: 'flex', flexDirection: 'column' },
  logWrapper: { height: '220px', overflowY: 'auto', padding: '10px 0' },
  footerSection: { marginTop: '20px' },
  progressTrack: { width: '100%', height: '4px', background: '#111', borderRadius: '2px' },
  progressBar: { height: '100%', background: '#0f0', boxShadow: '0 0 15px #0f0', transition: 'width 0.4s ease' },
  error: { color: '#ff4444', fontSize: '0.75rem', marginBottom: '15px', fontWeight: 'bold' },
  footer: { marginTop: '40px', fontSize: '0.6rem', color: '#222', letterSpacing: '3px' }
};

export default Login;