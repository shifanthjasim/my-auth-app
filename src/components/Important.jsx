import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';

const Important = ({ onBack }) => {
  const [groceries, setGroceries] = useState(() => JSON.parse(localStorage.getItem('sj_groceries')) || []);
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('sj_events')) || []);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('sj_groceries', JSON.stringify(groceries));
    localStorage.setItem('sj_events', JSON.stringify(events));
  }, [groceries, events]);

  const formatTime = (tz) => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  };

  const addGrocery = (e) => {
    e.preventDefault();
    const item = e.target.item.value;
    if (item) setGroceries([...groceries, { id: Date.now(), name: item }]);
    e.target.reset();
  };

  const addEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      title: e.target.title.value,
      date: e.target.date.value,
    };
    setEvents([...events, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date)));
    e.target.reset();
  };

  return (
    <div className="page-view-wrapper">
      <Container className="py-4">
        {/* TOP HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Button variant="outline-info" className="me-3 back-btn" onClick={onBack}>BACK</Button>
            <div>
              <h2 className="terminal-text mb-0 scanline-text">IMPORTANT_HUB</h2>
              <span className="small opacity-50 text-uppercase tracking-widest">Command Center // Kandy Node</span>
            </div>
          </div>
          <div className="text-end d-none d-md-block">
            <div className="blink-dot d-inline-block me-2"></div>
            <span className="small terminal-text opacity-75">SYSTEM_LIVE</span>
          </div>
        </div>

        <Row className="g-3">
          {/* 🕒 TIMEZONE SYNC - TOP ROW */}
          <Col md={6}>
            <Card className="hud-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="sig-label">U.S. COMPANY SYNC (MARYLAND)</span>
                  <span className="small text-info">EST</span>
                </div>
                <div className="display-5 terminal-text scanline-text text-info">
                  {formatTime('America/New_York')}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="hud-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="sig-label">FAMILY CONNECTION (NZ)</span>
                  <span className="small text-primary">NZDT</span>
                </div>
                <div className="display-5 terminal-text scanline-text text-primary">
                  {formatTime('Pacific/Auckland')}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* 📅 CRITICAL EVENTS - MAIN AREA */}
          <Col md={8}>
            <Card className="hud-card h-100">
              <Card.Body>
                <h6 className="sig-label mb-4 text-white">CRITICAL_TIMELINE</h6>
                <Form onSubmit={addEvent} className="row g-2 mb-4">
                  <Col><Form.Control name="title" placeholder="TASK_ID" className="hud-input" required /></Col>
                  <Col><Form.Control name="date" type="date" className="hud-input" required /></Col>
                  <Col xs="auto"><Button type="submit" variant="info" className="px-4">ADD</Button></Col>
                </Form>
                
                <div className="table-responsive" style={{maxHeight: '300px'}}>
                  <Table className="hud-table" variant="dark">
                    <thead>
                      <tr>
                        <th>OBJECTIVE</th>
                        <th className="text-end">DEADLINE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(ev => (
                        <tr key={ev.id}>
                          <td className="text-white opacity-75">{ev.title}</td>
                          <td className="text-info text-end font-monospace">{ev.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* 📦 GROCERY RADAR */}
          <Col md={4}>
            <Card className="hud-card h-100">
              <Card.Body>
                <h6 className="sig-label mb-4 text-white">LOGISTICS_RADAR</h6>
                <Form onSubmit={addGrocery} className="mb-3">
                  <div className="input-group">
                    <Form.Control name="item" placeholder="Item..." className="hud-input" />
                    <Button type="submit" variant="outline-info">ADD</Button>
                  </div>
                </Form>
                <div style={{maxHeight: '280px', overflowY: 'auto'}}>
                  {groceries.map(g => (
                    <div key={g.id} className="d-flex justify-content-between align-items-center p-2 mb-2 border border-secondary border-opacity-25 rounded bg-black">
                      <span className="small opacity-75">{g.name}</span>
                      <span className="text-danger cursor-pointer px-2" onClick={() => setGroceries(groceries.filter(i => i.id !== g.id))}>×</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Important;