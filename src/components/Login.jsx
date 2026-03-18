import React, { useState, useEffect } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [flavorText, setFlavorText] = useState('');

  // 📂 CINEMATIC & FUNNY MESSAGES (Cycles every 1s)
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

  // 📂 TECHNICAL LOGS (Timed for ~8-10 seconds total)
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
    
    // 🎭 Cycle funny flavor text
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      if (msgIndex < funnyMessages.length) {
        setFlavorText(funnyMessages[msgIndex]);
        msgIndex++;
      } else {
        clearInterval(msgInterval);
      }
    }, 900);

    // 📟 Run the Technical Terminal Logs
    let logIndex = 0;
    const showNextLog = () => {
      if (logIndex < terminalCodes.length) {
        setLoadingLogs(prev => [...prev, terminalCodes[logIndex].text]);
        setScanProgress(((logIndex + 1) / terminalCodes.length) * 100);
        setTimeout(showNextLog, terminalCodes[logIndex].delay);
        logIndex++;
      } else {
        // 🚀 THE CLEAN EXIT: Small delay before entering App.jsx
        setTimeout(() => {
          onLoginSuccess();
          window.scrollTo(0, 0); 
        }, 800);
      }
    };
    showNextLog();
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes glow { 0% { text-shadow: 0 0 5px #0f0; } 50% { text-shadow: 0 0 15px #0f0; } 100% { text-shadow: 0 0 5px #0f0; } }
        @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse-border { 0% { border-color: rgba(0, 242, 255, 0.2); } 50% { border-color: rgba(0, 242, 255, 0.8); } 100% { border-color: rgba(0, 242, 255, 0.2); } }
        
        .hacker-grid { 
          background-image: linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px); 
          background-size: 30px 30px; 
        }
        .scanline {
          width: 100%; height: 4px; background: rgba(0, 255, 0, 0.07);
          position: absolute; animation: scanline 4s linear infinite; z-index: 10;
        }
        .blink { animation: glow 1.5s infinite; }
        .funny-msg { animation: slideUp 0.4s ease-out; color: #00f2ff; font-weight: 800; letter-spacing: 2px; font-size: 0.75rem; }
      `}</style>

      {isInitializing ? (
        /* 🕵️‍♂️ THE GOD-MODE TERMINAL */
        <div style={styles.terminalWrapper} className="hacker-grid">
          <div className="scanline" />
          
          <div style={styles.terminalHeader}>
            <span style={{ color: '#0f0' }}>● AXON_SECURE_UPLINK</span>
            <span style={{ color: '#444' }}>STATION: KANDY_LKA</span>
          </div>

          <div style={styles.mainLoadingArea}>
            {/* Dynamic Flavor Text Section */}
            <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <p className="funny-msg text-center mb-0">{flavorText}</p>
            </div>

            <div style={styles.logWrapper}>
              {loadingLogs.map((log, i) => (
                <div key={i} style={{ 
                  color: log.includes('DANGER') || log.includes('WARNING') ? '#ff003c' : '#0f0', 
                  marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace'
                }}>
                  {log}
                </div>
              ))}
              <div style={{ color: '#0f0' }} className="blink">█</div>
            </div>
          </div>

          <div style={styles.footerSection}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#0f0', marginBottom: '8px', fontWeight: 'bold' }}>
                <span>DECRYPTING_NODE_DATA</span>
                <span>{Math.round(scanProgress)}%</span>
             </div>
             <div style={styles.progressTrack}>
                <div style={{ ...styles.progressBar, width: `${scanProgress}%` }} />
             </div>
          </div>
        </div>
      ) : (
        /* ⚪ THE ULTRA-MODERN PREMIUM LOGIN */
        <div style={styles.glassCard}>
          <div style={styles.logoHex}>SJ</div>
          <h2 style={styles.title}>AXON_NODE</h2>
          <p style={styles.subtitle}>System Access Protocol 4.0.2</p>

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
    width: '100%', maxWidth: '380px', padding: '55px 35px',
    background: 'rgba(10, 12, 18, 0.9)', backdropFilter: 'blur(30px)',
    borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'center', boxShadow: '0 30px 100px rgba(0,0,0,0.9)'
  },
  logoHex: {
    width: '85px', height: '85px', background: 'linear-gradient(135deg, #00f2ff, #0060ff)',
    borderRadius: '26px', margin: '0 auto 30px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '2.2rem', fontWeight: '900', color: '#fff',
    boxShadow: '0 0 50px rgba(0, 242, 255, 0.25)'
  },
  title: { fontSize: '1.7rem', fontWeight: '900', letterSpacing: '4px', color: '#fff', marginBottom: '8px' },
  subtitle: { fontSize: '0.7rem', color: '#444', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '1px' },
  input: {
    width: '100%', padding: '18px 22px', marginBottom: '15px', borderRadius: '18px',
    background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff', fontSize: '1rem', outline: 'none'
  },
  button: {
    width: '100%', padding: '20px', marginTop: '10px', borderRadius: '18px', border: 'none',
    background: '#fff', color: '#000', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', transition: '0.2s'
  },
  terminalWrapper: {
    width: '100%', maxWidth: '600px', height: '480px', background: '#000',
    padding: '35px', borderRadius: '25px', border: '1px solid #111',
    position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 0 40px rgba(0, 255, 0, 0.1)'
  },
  terminalHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '25px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px', fontWeight: 'bold' },
  mainLoadingArea: { flexGrow: 1, display: 'flex', flexDirection: 'column' },
  logWrapper: { height: '240px', overflow: 'hidden', padding: '10px 0' },
  footerSection: { marginTop: '25px' },
  progressTrack: { width: '100%', height: '4px', background: '#111', borderRadius: '4px' },
  progressBar: { height: '100%', background: '#0f0', boxShadow: '0 0 15px #0f0', transition: 'width 0.4s ease' },
  error: { color: '#ff4444', fontSize: '0.75rem', marginBottom: '15px', fontWeight: 'bold' },
  footer: { marginTop: '40px', fontSize: '0.6rem', color: '#222', letterSpacing: '3px' }
};

export default Login;