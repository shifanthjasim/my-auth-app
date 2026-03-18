import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js'; 
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
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('currentView') || 'home');
  const [liveTime, setLiveTime] = useState(new Date());
  const [navExpanded, setNavExpanded] = useState(false);
  
  // Stability states
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  // 🛠️ THE HEAVY-DUTY LOGIN HANDLER
  const handleLogin = () => {
    // Phase 1: Lock the UI
    setIsRedirecting(true);
    
    // Phase 2: Set Data
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentView('home');

    // Phase 3: Delay the mounting of the dashboard to let Chrome/Safari clear memory
    setTimeout(() => {
      setIsLoggedIn(true);
      setSessionKey(prev => prev + 1);
      
      // Phase 4: Final release of the redirect curtain
      setTimeout(() => {
        setIsRedirecting(false);
        // Ensure browser is at the top of the shell
        const shell = document.querySelector('.intelligence-shell');
        if (shell) shell.scrollTop = 0;
      }, 100);
    }, 400); // 400ms is the "Sweet Spot" for browser stability
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setCurrentView('home'); 
  };

  const goHome = () => { 
    setCurrentView('home'); 
    setNavExpanded(false); 
  };

  return (
    <div className="App" key={sessionKey} style={{ background: '#000', minHeight: '100vh' }}>
      {(!isLoggedIn || isRedirecting) ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <div className="viewport-lock">
          {/* 1. FIXED TOP NAVBAR */}
          <Navbar expand="lg" expanded={navExpanded} className="custom-nav px-4">
            <Container fluid>
              <Navbar.Brand className="fw-bold brand-sj" onClick={goHome}>
                <i className="bi bi-shield-shaded me-2"></i>AXON_NODE
              </Navbar.Brand>
              <Navbar.Toggle onClick={() => setNavExpanded(!navExpanded)} aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto fw-medium">
                  {['home', 'books', 'gardening', 'coding', 'notes', 'diary', 'important'].map((id) => (
                    <Nav.Link 
                      key={id}
                      className={`px-3 ${currentView === id ? 'active-link' : ''}`} 
                      onClick={() => {
                        setCurrentView(id);
                        setNavExpanded(false); 
                      }}
                    >
                      {id.toUpperCase()}
                    </Nav.Link>
                  ))}
                </Nav>
                <div className="mt-2 mt-lg-0 text-center">
                  <Button variant="outline-dark" size="sm" onClick={handleLogout}>LOGOFF</Button>
                </div>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          {/* 2. THE SCROLLING CONTENT BOX */}
          <main className="intelligence-shell">
            <Container className="main-content">
              {['coding', 'important', 'notes', 'diary', 'books', 'gardening'].includes(currentView) ? (
                <div className="win-border shadow-lg">
                  <div className="win-header">
                    <span>C:\\LANGLEY\\REPORTS\\{currentView.toUpperCase()}.EXE</span>
                    <span onClick={goHome} style={{cursor:'pointer', padding: '0 5px'}}>X</span>
                  </div>
                  <div className="win-content-area p-3">
                    {currentView === 'coding' && <Coding onBack={goHome} supabase={supabase} />}
                    {currentView === 'notes' && <Notes onBack={goHome} supabase={supabase} />}
                    {currentView === 'important' && <Important onBack={goHome} supabase={supabase} />}
                    {currentView === 'diary' && <Diary onBack={goHome} supabase={supabase} />}
                    {currentView === 'books' && <Books onBack={goHome} supabase={supabase} />}
                    {currentView === 'gardening' && <Gardening onBack={goHome} supabase={supabase} />}
                  </div>
                </div>
              ) : (
                <div className="page-transition-wrapper">
                  {currentView === 'home' && <Home />}
                </div>
              )}
            </Container>
          </main>

          {/* 3. FIXED BOTTOM TASKBAR */}
          <div className="taskbar-status">
            <span className="me-2 text-uppercase">NODE: KANDY_LKA</span>
            <span className="text-primary d-none d-md-inline ms-2">UPLINK: MARYLAND_ENCRYPTED</span>
            <span className="ms-auto time-display">
              {liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;