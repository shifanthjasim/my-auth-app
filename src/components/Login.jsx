import React, { useState, useEffect } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [flavorText, setFlavorText] = useState('');

  // 📂 CINEMATIC FLAVOR MESSAGES (Appears one after another)
  const funnyMessages = [
    "INITIALIZING COVERT PROTOCOLS...",
    "HIDING BROWSER HISTORY FROM ISP...",
    "ORDERING COFFEE FROM KANDY CITY CENTRE...",
    "CALIBRATING RETINAL SCANNERS...",
    "LOCATING MARYLAND HUB... FOUND.",
    "DELETING EVIDENCE OF PROCRASTINATION...",
    "UPDATING KERNEL (PLEASE DON'T UNPLUG)...",
    "BYPASSING SECURE_GATEWAY_04...",
    "CONVINCING THE DATABASE TO WAKE UP...",
    "READY_TO_OPERATE."
  ];

  const terminalCodes = [
    { text: ">> KERNEL_UPLINK: ONLINE", delay: 100 },
    { text: ">> NODE: KANDY_LKA_STATION", delay: 300 },
    { text: ">> [DANGER] UNAUTHORIZED PING DETECTED", delay: 600 },
    { text: ">> DEPLOYING DECOY DATA... [SUCCESS]", delay: 500 },
    { text: ">> TUNNELING VIA NEW_ZEALAND_PROXY...", delay: 800 },
    { text: ">> SCANNING BIOMETRICS: JASIM, S.", delay: 900 },
    { text: ">> DECRYPTING VAULT: BOOKS/NOTES/DIARY", delay: 1200 },
    { text: ">> RSA_DECRYPTION_KEY: FOUND", delay: 400 },
    { text: ">> AXON_NODE: FULL CONTROL ESTABLISHED", delay: 300 },
    { text: ">> WELCOME_MASTER_OPERATIVE.", delay: 500 }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() !== 'user' || password.toLowerCase() !== 'user') {
      setError('IDENTITY_UNVERIFIED');
      return;
    }
    setError('');
    startAdvancedSequence();
  };

  const startAdvancedSequence = () => {
    setIsInitializing(true);
    
    // Cycle through funny messages every 1 second
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      if (msgIndex < funnyMessages.length) {
        setFlavorText(funnyMessages[msgIndex]);
        msgIndex++;
      } else {
        clearInterval(msgInterval);
      }
    }, 1000);

    // Run the terminal logs
    let logIndex = 0;
    const showNextLog = () => {
      if (logIndex < terminalCodes.length) {
        setLoadingLogs(prev => [...prev, terminalCodes[logIndex].text]);
        setScanProgress(((logIndex + 1) / terminalCodes.length) * 100);
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
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes flicker { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
        @keyframes glow { 0% { text-shadow: 0 0 5px #0f0; } 50% { text-shadow: 0 0 20px #0f0; } 100% { text-shadow: 0 0 5px #0f0; } }
        @keyframes slideIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .terminal-box { animation: flicker 0.1s infinite; position: relative; }
        .funny-msg { animation: slideIn 0.3s ease-out; color: #00f2ff; font-weight: bold; letter-spacing: 2px; }
        .hacker-grid { background-image: linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px); background-size: 30px 30px; }
      `}</style>

      {isInitializing ? (
        /* 🕵️‍♂️ THE CINEMATIC TERMINAL */
        <div style={styles.terminalWrapper} className="hacker-grid">
          <div style={styles.scanline} />
          
          <div style={styles.terminalHeader}>
            <span style={{ color: '#0f0' }}>● CORE_SYNC_ACTIVE</span>
            <span style={{ color: '#666' }}>[NODE_SRI_LANKA]</span>
          </div>

          <div style={styles.mainLoadingArea}>
            {/* Dynamic Funny Messages */}
            <div style={{ height: '40px', textAlign: 'center' }}>
               <p className="funny-msg small">{flavorText}</p>
            </div>

            <div style={styles.logWrapper}>
              {loadingLogs.map((log, i) => (
                <div key={i} style={{ 
                  color: log.includes('DANGER') || log.includes('WARNING') ? '#ff003c' : '#0f0', 
                  marginBottom: '6px', fontSize: '0.75rem', animation: 'glow 2s infinite' 
                }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div style={styles.footerSection}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#0f0', marginBottom: '8px' }}>
                <span>DECRYPTING_MARYLAND_VAULT</span>
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
          <div style={styles.footer}>KANDY_LKA // MD_CLOUD</div>
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
    background: 'rgba(12, 14, 20, 0.9)', backdropFilter: 'blur(25px)',
    borderRadius: '35px', border: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'center', boxShadow: '0 30px 100px rgba(0,0,0,0.9)'
  },
  logoHex: {
    width: '80px', height: '80px', background: 'linear-gradient(135deg, #00f2ff, #0060ff)',
    borderRadius: '24px', margin: '0 auto 30px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '2rem', fontWeight: '900', color: '#fff',
    boxShadow: '0 0 40px rgba(0, 242, 255, 0.2)'
  },
  title: { fontSize: '1.6rem', fontWeight: '900', letterSpacing: '4px', color: '#fff', marginBottom: '8px' },
  subtitle: { fontSize: '0.75rem', color: '#555', marginBottom: '35px', textTransform: 'uppercase' },
  input: {
    width: '100%', padding: '16px 20px', marginBottom: '15px', borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff', fontSize: '1rem', outline: 'none'
  },
  button: {
    width: '100%', padding: '18px', marginTop: '10px', borderRadius: '16px', border: 'none',
    background: '#fff', color: '#000', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer'
  },
  terminalWrapper: {
    width: '100%', maxWidth: '600px', height: '450px', background: '#000',
    padding: '30px', borderRadius: '20px', border: '1px solid #111',
    position: 'relative', display: 'flex', flexDirection: 'column'
  },
  scanline: { width: '100%', height: '4px', background: 'rgba(0, 255, 0, 0.05)', position: 'absolute', animation: 'scanline 5s linear infinite', left: 0 },
  terminalHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: '20px', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px' },
  mainLoadingArea: { flexGrow: 1, display: 'flex', flexDirection: 'column' },
  logWrapper: { height: '220px', overflow: 'hidden', padding: '10px 0' },
  footerSection: { marginTop: '20px' },
  progressTrack: { width: '100%', height: '4px', background: '#111', borderRadius: '2px' },
  progressBar: { height: '100%', background: '#0f0', boxShadow: '0 0 15px #0f0', transition: 'width 0.4s ease' },
  error: { color: '#ff4444', fontSize: '0.75rem', marginBottom: '15px', fontWeight: 'bold' },
  footer: { marginTop: '40px', fontSize: '0.6rem', color: '#333', letterSpacing: '2px' }
};

export default Login;