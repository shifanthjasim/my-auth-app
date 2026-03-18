import React, { useState, useEffect, Suspense } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js'; 

// Components
import Login from './components/Login';
import Home from './components/Home';
import Books from './components/Books';
import Gardening from './components/Gardening';
import Coding from './components/Coding';
import Notes from './components/Notes';
import Diary from './components/Diary'; 
import Important from './components/Important';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// --- SUPABASE_CONFIG ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('currentView') || 'home');
  const [liveTime, setLiveTime] = useState(new Date());
  const [navExpanded, setNavExpanded] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000); 
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    setIsRedirecting(true);
    localStorage.setItem('isLoggedIn', 'true');
    
    // Safety: Clear any stuck scroll positions
    window.scrollTo(0, 0);

    setTimeout(() => {
      setIsLoggedIn(true);
      setSessionKey(prev => prev + 1);
      setTimeout(() => {
        setIsRedirecting(false);
      }, 150);
    }, 600); // Increased to 600ms for heavy processing
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsRedirecting(false);
    setSessionKey(prev => prev + 1);
  };

  const renderView = () => {
    // Protect against missing Supabase
    const props = { onBack: () => setCurrentView('home'), supabase };

    switch (currentView) {
      case 'coding': return <Coding {...props} />;
      case 'notes': return <Notes {...props} />;
      case 'important': return <Important {...props} />;
      case 'diary': return <Diary {...props} />;
      case 'books': return <Books {...props} />;
      case 'gardening': return <Gardening {...props} />;
      default: return <Home />;
    }
  };

  return (
    <div className="App" key={sessionKey} style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      {(!isLoggedIn || isRedirecting) ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <div className="viewport-lock" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          
          <Navbar expand="lg" expanded={navExpanded} className="custom-nav px-4">
            <Container fluid>
              <Navbar.Brand className="fw-bold brand-sj" onClick={() => setCurrentView('home')}>
                AXON_NODE
              </Navbar.Brand>
              <Navbar.Toggle onClick={() => setNavExpanded(!navExpanded)} />
              <Navbar.Collapse>
                <Nav className="mx-auto">
                  {['home', 'books', 'gardening', 'coding', 'notes', 'diary', 'important'].map((id) => (
                    <Nav.Link 
                      key={id}
                      className={currentView === id ? 'active-link' : ''} 
                      onClick={() => { setCurrentView(id); setNavExpanded(false); }}
                    >
                      {id.toUpperCase()}
                    </Nav.Link>
                  ))}
                </Nav>
                <Button variant="outline-dark" size="sm" onClick={handleLogout}>LOGOFF</Button>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <main className="intelligence-shell" style={{ flex: 1, overflowY: 'auto' }}>
            <Container className="py-4">
              {['coding', 'important', 'notes', 'diary', 'books', 'gardening'].includes(currentView) ? (
                <div className="win-border">
                  <div className="win-header">
                    <span>SYSTEM_ACTIVE // {currentView.toUpperCase()}</span>
                    <span onClick={() => setCurrentView('home')} style={{cursor:'pointer'}}>X</span>
                  </div>
                  <div className="win-content-area p-3">
                    {renderView()}
                  </div>
                </div>
              ) : (
                <div className="page-transition-wrapper">
                  <Home />
                </div>
              )}
            </Container>
          </main>

          <div className="taskbar-status">
            <span>NODE: KANDY_LKA</span>
            <span className="ms-auto">{liveTime.toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;