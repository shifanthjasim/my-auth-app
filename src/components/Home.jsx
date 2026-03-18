import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

const Home = () => {
  const [time, setTime] = useState(new Date());
  const name = "Shifanth Jasim";

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Coding is the closest thing we have to magic.", author: "Drew Houston" },
    { text: "To plant a garden is to believe in tomorrow.", author: "Audrey Hepburn" },
    { text: "Zero to hero is a marathon, not a sprint.", author: "SJ" },
    { text: "Read 500 pages every day. That's how knowledge works.", author: "Warren Buffett" },
    { text: "Consistency is better than rare moments of greatness.", author: "Lore" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Proverb" }
  ];

  return (
    <div className="home-wrapper">
      {/* 1. HERO SECTION */}
      <div className="hero-minimal">
        <Container>
          <div className="welcome-container">
            <span className="welcome-static">Welcome,</span>
            <div className="name-wrapper">
              {name.split("").map((char, index) => (
                <span 
                  key={index} 
                  className="animated-letter" 
                  style={{ 
                    animationDelay: `${index * 0.08}s, 0s` 
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>
          
          <div className="hero-status-container">
            <p className="hero-status">
              <span className="status-item">📍 Kandy, LK</span>
              <span className="status-divider">|</span>
              <span className="status-item text-info">🕒 {time.toLocaleTimeString()}</span>
              <span className="status-divider">|</span>
              <span className="status-item">📅 {time.toLocaleDateString()}</span>
            </p>
          </div>
        </Container>
      </div>

      {/* 2. WISDOM STREAM (UPWARD CRAWL) */}
      <div className="wisdom-stream-container">
        <div className="stream-inner">
          {[...quotes, ...quotes].map((q, i) => (
            <div key={i} className="quote-box">
              <p className="q-text">"{q.text}"</p>
              <h5 className="q-author">— {q.author}</h5>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SIGNATURE FOOTER */}
      <footer className="footer-signature">
        <div className="footer-line"></div>
        <div className="signature-content">
          <div className="sig-left">
            <span className="sig-label">DEVELOPED_BY</span>
            <span className="sig-name">SHIFANTH JASIM</span>
          </div>
          <div className="sig-divider"></div>
          <div className="sig-right">
            <span className="sig-title">REMOTE SOFTWARE ENGINEER</span>
            <span className="sig-location">KANDY, SRI LANKA // BUWELIKADA</span>
          </div>
        </div>
        <div className="system-uptime">
          <span className="blink-dot"></span> SYSTEM_STABLE_v3.2.0
        </div>
      </footer>
    </div>
  );
};

export default Home;