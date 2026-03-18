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

// --- SECURE_UPLINK_CONFIG ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('currentView') || 'home');
  const [liveTime, setLiveTime] = useState(new Date());
  const [navExpanded, setNavExpanded] = useState(false);
  
  // ⚡ THE REFRESH FIX: Forces React to re-draw the dashboard after login
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setSessionKey(prev => prev + 1); // 🛰️ The "Wake Up" signal
    setCurrentView('home'); 
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
    <div className="App" key={sessionKey}>
      <style>{`
        .intelligence-shell {
          background: radial-gradient(circle at center, #0d1117 0%, #010409 100%);
          background-attachment: fixed;
          min-height: 100vh;
          padding-top: 80px;
          color: #fff;
        }
        
        .win-content-area {
          background-color: #000 !important;
          color: #fff !important;
          min-height: 60vh;
          border: 1px solid #30363d;
        }

        .win-border { 
          background: #c0c0c0; border: 2px solid;
          border-color: #dfdfdf #000 #000 #dfdfdf;
          box-shadow: 8px 8px 0px rgba(0,0,0,0.4);
          padding: 2px;
          margin-top: 20px;
        }

        .win-header {
          background: linear-gradient(90deg, #000080, #1084d0);
          color: white; font-weight: bold; padding: 4px 8px; font-size: 0.75rem;
          display: flex; justify-content: space-between;
          text-transform: uppercase;
        }

        /* 📱 MOBILE TAB SCROLL FIX */
        @media (max-width: 768px) {
          .custom-tabs {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
            gap: 5px;
          }
          .custom-tabs .nav-item { flex: 0 0 auto; }
        }

        /* 🕵️‍♂️ TAB VISIBILITY PATCH */
        .custom-tabs .nav-link {
          color: #000 !important; font-weight: bold; font-size: 0.7rem;
          background: #c0c0c0; border: 2px solid;
          border-color: #dfdfdf #808080 #808080 #dfdfdf !important;
        }
        .custom-tabs .nav-link.active {
          color: #00f2ff !important; background: #000 !important; border-bottom: none !important;
        }

        .custom-nav {
          background: #c0c0c0 !important;
          border-bottom: 2px solid #808080;
        }

        .brand-sj { color: #000080 !important; cursor: pointer; letter-spacing: 1px; }
        .nav-link { color: #000 !important; cursor: pointer; font-size: 0.85rem; font-weight: bold; }
        .active-link { background: #dfdfdf; border: 1px inset #808080; color: #000080 !important; }

        .taskbar-status {
          position: fixed; bottom: 0; width: 100%; height: 30px;
          background: #c0c0c0; border-top: 2px solid #dfdfdf;
          display: flex; align-items: center; padding: 0 15px;
          font-size: 0.7rem; font-weight: bold; z-index: 1000; color: #333;
        }
      `}</style>

      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <div className="intelligence-shell">
          <Navbar 
            expand="lg" 
            expanded={navExpanded} 
            onToggle={(next) => setNavExpanded(next)} 
            className="custom-nav py-2 px-4" 
            fixed="top"
          >
            <Container fluid>
              <Navbar.Brand className="fw-bold brand-sj" onClick={goHome}>
                <i className="bi bi-shield-shaded me-2"></i>AXON_NODE
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto fw-medium">
                  {['home', 'books', 'gardening', 'coding', 'notes', 'diary', 'important'].map((id) => (
                    <div 
                      key={id}
                      className={`nav-link px-3 ${currentView === id ? 'active-link' : ''}`} 
                      onClick={() => {
                        setCurrentView(id);
                        setNavExpanded(false); 
                      }}
                    >
                      {id.toUpperCase()}
                    </div>
                  ))}
                </Nav>
                <Button variant="outline-dark" size="sm" onClick={() => { handleLogout(); setNavExpanded(false); }}>LOGOFF</Button>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Container className="main-content pb-5">
            {['coding', 'important', 'notes', 'diary', 'books', 'gardening'].includes(currentView) ? (
              <div className="win-border shadow-lg">
                <div className="win-header">
                  <span>C:\\LANGLEY\\REPORTS\\{currentView.toUpperCase()}.EXE</span>
                  <span onClick={goHome} style={{cursor:'pointer', padding: '0 5px'}}>X</span>
                </div>
                <div className="win-content-area p-3">
                  {currentView === 'coding' && <Coding key="coding" onBack={goHome} supabase={supabase} />}
                  {currentView === 'notes' && <Notes key="notes" onBack={goHome} supabase={supabase} />}
                  {currentView === 'important' && <Important key="imp" onBack={goHome} supabase={supabase} />}
                  {currentView === 'diary' && <Diary key="diary" onBack={goHome} supabase={supabase} />}
                  {currentView === 'books' && <Books key="books" onBack={goHome} supabase={supabase} />}
                  {currentView === 'gardening' && <Gardening key="gardening" onBack={goHome} supabase={supabase} />}
                </div>
              </div>
            ) : (
              <div className="page-transition-wrapper py-4">
                {currentView === 'home' && <Home />}
              </div>
            )}
          </Container>

          <div className="taskbar-status">
            <span className="me-3 text-uppercase">NODE: KANDY_LKA</span>
            <span className="text-primary me-3 text-uppercase">UPLINK: {supabase ? 'MARYLAND_ENCRYPTED' : 'OFFLINE'}</span>
            <span className="ms-auto">{liveTime.toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;