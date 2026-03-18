import React, { useState, useEffect } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);

  // 📂 ELITE OPERATIVE LOGS (7-10 Seconds Total)
  const terminalCodes = [
    { text: ">> KERNEL_UPLINK: ONLINE", delay: 100 },
    { text: ">> NODE_LOCATION: KANDY_LKA (CENTRAL_PROVINCE)", delay: 400 },
    { text: ">> IP_MASKING: ACTIVE [LAYER_4_TUNNEL]", delay: 500 },
    { text: ">> INJECTING_SQL_PAYLOAD... BYPASSING_ADMIN", delay: 800 },
    { text: ">> [SYSTEM] RETINA_SCAN_IN_PROGRESS...", delay: 1200 },
    { text: ">> JASIM, SHIFANTH: IDENTITY_CONFIRMED", delay: 600 },
    { text: ">> WARNING: MARYLAND_HUB_FIREWALL_DETECTED", delay: 300 },
    { text: ">> EXECUTING_BRUTE_FORCE_OVERRIDE...", delay: 900 },
    { text: ">> DOWNLOADING_REPORTS: [BOOKS/DIARY/GARDEN]", delay: 1000 },
    { text: ">> PARSING_ENCRYPTED_JS_METADATA...", delay: 400 },
    { text: ">> RSA_DECRYPTION_KEY: FOUND", delay: 300 },
    { text: ">> CLEARING_SYSTEM_EVENT_LOGS...", delay: 600 },
    { text: ">> AXON_NODE: FULL_CONTROL_ESTABLISHED", delay: 400 },
    { text: ">> WELCOME_BACK_MASTER_OPERATIVE.", delay: 500 }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() !== 'user' || password.toLowerCase() !== 'user') {
      setError('ACCESS_DENIED_UNAUTHORIZED_ENTITY');
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
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes neon-glow { 0% { box-shadow: 0 0 5px #0f0; } 50% { box-shadow: 0 0 20px #0f0; } 100% { box-shadow: 0 0 5px #0f0; } }
        .blink { animation: pulse 1s infinite; }
        .terminal-glow { text-shadow: 0 0 10px rgba(0,255,0,0.8), 0 0 20px rgba(0,255,0,0.5); }
        .glass-card:hover { transform: translateY(-5px); border-color: rgba(0, 242, 255, 0.4) !important; }
        .hacker-bg { background-image: linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px); background-size: 20px 20px; }
      `}</style>

      {isInitializing ? (
        /* 🕵️‍♂️ THE "GOD MODE" TERMINAL */
        <div style={styles.terminalContainer} className="hacker-bg">
          <div style={styles.scanline} />
          
          <div style={styles.terminalHeader}>
            <div style={{ color: '#0f0' }}>● CORE_ACTIVE</div>
            <div style={{ color: '#0f0' }}>UPLINK_STATUS: SECURE</div>
          </div>

          <div style={styles.logWrapper}>
            {loadingLogs.map((log, i) => (
              <div key={i} className="terminal-glow" style={{ 
                color: log.includes('WARNING') ? '#ff003c' : '#0f0', 
                marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold' 
              }}>
                {log}
              </div>
            ))}
            <div style={{ color: '#0f0' }} className="blink">█</div>
          </div>

          <div style={styles.statusFooter}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#0f0', marginBottom: '5px' }}>
              <span>DECRYPTING_PACKETS</span>
              <span>{Math.round(scanProgress)}%</span>
            </div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressBar, width: `${scanProgress}%` }} />
            </div>
          </div>
        </div>
      ) : (
        /* ⚪ THE ULTRA-PREMIUM GLASS LOGIN */
        <div style={styles.glassCard} className="glass-card">
          <div style={styles.logoContainer}>
            <div style={styles.logoHex}>
              <span style={{ color: '#fff', fontSize: '2rem', fontWeight: '900' }}>SJ</span>
            </div>
          </div>

          <h1 style={styles.title}>AXON_NODE</h1>
          <p style={styles.subtitle}>System Access Protocol 4.0.2</p>

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <div style={styles.inputWrapper}>
              <input 
                type="text" style={styles.input} placeholder="IDENTIFIER" autoComplete="off"
                value={username} onChange={(e) => setUsername(e.target.value)} 
              />
              <i className="bi bi-person" style={styles.inputIcon}></i>
            </div>
            <div style={styles.inputWrapper}>
              <input 
                type="password" style={styles.input} placeholder="PASSCODE" 
                value={password} onChange={(e) => setPassword(e.target.value)} 
              />
              <i className="bi bi-lock" style={styles.inputIcon}></i>
            </div>
            
            {error && <div style={styles.errorText}>{error}</div>}
            
            <button type="submit" style={styles.button}>
              <span style={{ marginRight: '10px' }}>⚡</span> INITIALIZE UPLINK
            </button>
          </form>

          <div style={styles.footerText}>
            KANDY_HUB // MD_SECURE_CLOUD
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#010204', padding: '20px', overflow: 'hidden'
  },
  glassCard: {
    width: '100%', maxWidth: '400px', padding: '60px 40px', background: 'rgba(10, 10, 15, 0.9)',
    backdropFilter: 'blur(30px) saturate(150%)', borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', transition: 'all 0.4s ease'
  },
  logoHex: {
    width: '90px', height: '90px', background: 'linear-gradient(135deg, #00f2ff, #0060ff)',
    margin: '0 auto 30px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 40px rgba(0, 242, 255, 0.2)', animation: 'neon-glow 3s infinite'
  },
  title: { fontSize: '1.8rem', fontWeight: '900', color: '#fff', letterSpacing: '4px', marginBottom: '10px' },
  subtitle: { fontSize: '0.7rem', color: '#555', letterSpacing: '2px', marginBottom: '40px', textTransform: 'uppercase' },
  inputWrapper: { position: 'relative', marginBottom: '15px' },
  input: {
    width: '100%', padding: '18px 20px 18px 50px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'rgba(255, 255, 255, 0.03)', color: '#fff', fontSize: '1rem', outline: 'none', transition: '0.3s'
  },
  inputIcon: { position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#444' },
  button: {
    width: '100%', padding: '