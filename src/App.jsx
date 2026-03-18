import React, { useState, useEffect } from 'react';
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
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

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

  // 🛠️ FIX: Sync localStorage when view changes
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  const handleLogin = () => {
    setIsRedirecting(true);
    
    // 1. Clear the deck
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setSessionKey(prev => prev + 1); // Force brand new render tree
      
      // 2. Small buffer to let the Home component mount
      setTimeout(() => {
        setIsRedirecting(false);
        // Kick the browser to recalculate height
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsRedirecting(false);
    window.location.reload(); // Hard reset is safest for memory clearing
  };

  const renderView = () => {
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
    <div className="App" style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      {(!isLoggedIn || isRedirecting) ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <div className="viewport-lock" key={sessionKey}>
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
                <div className="text-center mt-2 mt-lg-0">
                  <Button variant="outline-dark" size="sm" onClick={handleLogout}>LOGOFF</Button>
                </div>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <main className="intelligence-shell">
            <Container>
              {currentView === 'home' ? (
                <Home />
              ) : (
                <div className="win-border shadow-lg">
                  <div className="win-header">
                    <span>SYSTEM_ACTIVE // {currentView.toUpperCase()}</span>
                    <span onClick={() => setCurrentView('home')} style={{cursor:'pointer', padding: '0 5px'}}>X</span>
                  </div>
                  <div className="win-content-area p-3">
                    {renderView()}
                  </div>
                </div>
              )}
            </Container>
          </main>

          <div className="taskbar-status">
            <span className="me-2">NODE: KANDY_LKA</span>
            <span className="ms-auto font-monospace">{liveTime.toLocaleTimeString([], { hour12: false })}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;