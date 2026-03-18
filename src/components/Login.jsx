import React, { useState } from 'react';

// Added { onLoginSuccess } as a prop
const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username !== 'User') {
      triggerError('The username you entered is incorrect.');
    } else if (password !== 'user') {
      triggerError('The password you entered is incorrect.');
    } else {
      setError('');
      // INSTEAD of just an alert, we call the function from App.jsx
      onLoginSuccess(); 
    }
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
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      padding: '40px',
      borderRadius: '24px',
      width: '100%',
      maxWidth: '360px',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.25)', 
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.1s ease-out' 
    },
    logoContainer: {
      marginBottom: '20px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    logoBg: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #2af5ef 0%, #4facfe 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 15px rgba(79, 172, 254, 0.5)'
    },
    logoText: {
      fontSize: '2.2rem',
      fontWeight: '700',
      color: 'white',
      letterSpacing: '-2px',
      position: 'relative',
      top: '-1px'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      margin: '8px 0',
      borderRadius: '10px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.5)',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '12px',
      marginTop: '15px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(135deg, #2af5ef 0%, #4facfe 100%)',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      boxShadow: '0 4px 10px rgba(79, 172, 254, 0.3)'
    },
    errorText: {
      color: '#ff3b30',
      fontSize: '0.85rem',
      marginTop: '10px',
      fontWeight: '500'
    },
    creator: {
      marginTop: '30px',
      fontSize: '0.8rem',
      color: '#555'
    }
  };

  return (
    <div style={styles.container}>
      <div 
        style={styles.card} 
        className={isShaking ? 'shake-animation' : ''}
      >
        <div style={styles.logoContainer}>
          <div style={styles.logoBg} className="logo-animate">
            <span style={styles.logoText}>SJ</span>
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#111', marginBottom: '25px' }}>
          Shifanth Jasim
        </h2>

        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            style={styles.input}
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            style={styles.input}
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <div style={styles.errorText}>{error}</div>}
          
          <button type="submit" style={styles.button}>Sign In</button>
        </form>

        <div style={styles.creator}>
          Designed by **Shifanth Jasim**
        </div>
      </div>
    </div>
  );
};

export default Login;