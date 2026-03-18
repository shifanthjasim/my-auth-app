import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js'; // 🛰️ New
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
// Use your Supabase keys from previous projects here
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('currentView') || 'home');
  const [isWorkMode, setIsWorkMode] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());

  // Logic to check Work Shift (5 PM - 2 AM Kandy Time)
  const checkWorkTime = () => {
    const hour = new Date().getHours();
    const working = hour >= 17 || hour < 2;
    setIsWorkMode(working);
  };

  useEffect(() => {
    checkWorkTime();
    const timer = setInterval(() => {
      checkWorkTime();
      setLiveTime(new Date());
    }, 1000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentView');
    setIsLoggedIn(false);
    setCurrentView('home'); 
  };

  const goHome = () => setCurrentView('home');

  return (
    <div className="App">
      <style>{`
        /* 🕵️ CIA Win98 Style Overrides */
        .intelligence-shell {
          background-color: ${isWorkMode ? '#008080' : '#f0f0f0'};
          min-height: 100vh;
          transition: background-color 1s ease;
          padding-top: 80px;
        }
        .win-border { 
          background: #c0c0c0; border: 2px solid;
          border-color: #dfdfdf #000 #000 #dfdfdf;
          box-shadow: inset 1px 1px #fff, inset -1px -1px #808080;
          padding: 2px;
          margin-top: 20px;
        }
        .win-header {
          background: linear-gradient(90deg, #000080, #1084d0);
          color: white; font-weight: bold; padding: 2px 8px; font-size: 0.75rem;
          display: flex; justify-content: space-between;
        }
        .custom-nav {
          background: #c0c0c0 !important;
          border-bottom: 2px solid #808080;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .brand-sj { color: #000080 !important; font-family: 'Tahoma', sans-serif; }
        .nav-link { color: #000 !important; font-size: 0.9rem; }
        .active-link { background: #dfdfdf; border: 1px inset #808080; }
        .taskbar-status {
          position: fixed; bottom: 0; width: 100%; height: 30px;
          background: #c0c0c0; border-top: 2px solid #dfdfdf;
          display: flex; align-items: center; padding: 0 15px;
          font-size: 0.7rem; font-weight: bold; z-index: 1000;
        }
      `}</style>

      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <div className={`intelligence-shell ${isWorkMode ? 'work-mode' : 'rest-mode'}`}>
          
          <Navbar variant="light" expand="lg" className="custom-nav py-2 px-4" fixed="top">
            <Container fluid>
              <Navbar.Brand className="fw-bold brand-sj" onClick={goHome} style={{ cursor: 'pointer' }}>
                <i className="bi bi-shield-shaded me-2"></i>AXON_NODE
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto fw-medium">
                  {[
                    { id: 'home', label: 'Home' },
                    { id: 'books', label: 'Books' },
                    { id: 'gardening', label: 'Gardening' },
                    { id: 'coding', label: 'Coding' },
                    { id: 'notes', label: 'Notes' },
                    { id: 'diary', label: 'Diary' },
                    { id: 'important', label: 'Important' }
                  ].map((item) => (
                    <div 
                      key={item.id}
                      className={`nav-link px-3 ${currentView === item.id ? 'active-link' : ''}`} 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => setCurrentView(item.id)}
                    >
                      {item.label.toUpperCase()}
                    </div>
                  ))}
                </Nav>
                <Button variant="outline-dark" size="sm" className="px-3" onClick={handleLogout}>
                  LOGOFF
                </Button>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Container className="main-content pb-5">
            {/* Wrap high-priority pages in the "Win98 Window" */}
            {['coding', 'important', 'notes'].includes(currentView) ? (
              <div className="win-border shadow-lg">
                <div className="win-header">
                  <span>C:\LANGLEY\REPORTS\{currentView.toUpperCase()}.EXE</span>
                  <span>X</span>
                </div>
                <div className="bg-white p-3" style={{ minHeight: '60vh' }}>
                  {currentView === 'coding' && <Coding onBack={goHome} supabase={supabase} />}
                  {currentView === 'notes' && <Notes onBack={goHome} supabase={supabase} />}
                  {currentView === 'important' && <Important onBack={goHome} supabase={supabase} />}
                </div>
              </div>
            ) : (
              /* Standard view for lifestyle pages */
              <div className="page-transition-wrapper py-4" key={currentView}>
                {currentView === 'home' && <Home />}
                {currentView === 'books' && <Books onBack={goHome} />}
                {currentView === 'gardening' && <Gardening onBack={goHome} />}
                {currentView === 'diary' && <Diary onBack={goHome} />}
              </div>
            )}
          </Container>

          {/* SYSTEM TASKBAR STATUS */}
          <div className="taskbar-status">
            <span className="me-3"><i className="bi bi-cpu"></i> CPU_LOAD: 12%</span>
            <span className="me-3"><i className="bi bi-geo-alt"></i> NODE: KANDY_LKA</span>
            <span className="text-primary me-3"><i className="bi bi-broadcast"></i> UPLINK: MARYLAND_USA</span>
            <span className="ms-auto border-start ps-3 border-dark">
              {liveTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;