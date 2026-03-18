import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Table } from 'react-bootstrap';

const Important = ({ onBack }) => {
  const [groceries, setGroceries] = useState(() => JSON.parse(localStorage.getItem('sj_groceries')) || []);
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('sj_events')) || []);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clocks every second for a "live" feel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('sj_groceries', JSON.stringify(groceries));
    localStorage.setItem('sj_events', JSON.stringify(events));
  }, [groceries, events]);

  // Helper function to format strings for specific timezones
  const formatTime = (tz) => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
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
    <div className="page-view-wrapper" style={{ paddingTop: '100px' }}>
      <Container className="py-5">
        <div className="d-flex align-items-center mb-5">
          <Button variant="outline-info" className="me-4 rounded-circle back-btn" onClick={onBack}>←</Button>
          <h2 className="display-4 fw-bold name-gradient mb-0">Important Hub</h2>
        </div>

        <Row className="g-4">
          {/* GADGET 1: WASHINGTON D.C. (US Company Time) */}
          <Col md={6}>
            <Card className="garden-card h-100 border-info shadow-sm">
              <Card.Body className="text-center py-4">
                <h6 className="text-info mb-3 fw-bold letter-spacing-2">WASHINGTON D.C. // EST</h6>
                <div className="display-4 fw-bold text-info" style={{ textShadow: '0 0 10px rgba(0, 242, 254, 0.5)' }}>
                  {formatTime('America/New_York')}
                </div>
                <p className="small text-white opacity-50 mt-2">Remote Work Sync</p>
              </Card.Body>
            </Card>
          </Col>

          {/* GADGET 2: HAMILTON, NZ (Family Time) */}
          <Col md={6}>
            <Card className="garden-card h-100 border-primary">
              <Card.Body className="text-center py-4">
                <h6 className="text-primary mb-3 fw-bold letter-spacing-2">HAMILTON, NZ // NZDT</h6>
                <div className="display-4 fw-bold text-primary" style={{ textShadow: '0 0 10px rgba(13, 110, 253, 0.5)' }}>
                  {formatTime('Pacific/Auckland')}
                </div>
                <p className="small text-white opacity-50 mt-2">Family Connection</p>
              </Card.Body>
            </Card>
          </Col>

          {/* GADGET 3: UPCOMING EVENTS */}
          <Col md={7}>
            <Card className="garden-card h-100">
              <Card.Body>
                <h6 className="text-info mb-4">SYSTEM_CRITICAL_EVENTS</h6>
                <Form onSubmit={addEvent} className="d-flex gap-2 mb-4">
                  <Form.Control name="title" placeholder="Event" size="sm" className="bg-transparent text-white border-secondary" required />
                  <Form.Control name="date" type="date" size="sm" className="bg-transparent text-white border-secondary" required />
                  <Button type="submit" size="sm" variant="info">Add</Button>
                </Form>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <Table variant="dark" hover size="sm" className="mb-0 border-secondary">
                    <thead>
                      <tr>
                        <th className="border-secondary text-muted small">TASK</th>
                        <th className="border-secondary text-muted small text-end">DEADLINE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(ev => (
                        <tr key={ev.id}>
                          <td className="border-secondary text-white">{ev.title}</td>
                          <td className="border-secondary text-info text-end">{ev.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* GADGET 4: GROCERY RADAR */}
          <Col md={5}>
            <Card className="garden-card h-100">
              <Card.Body>
                <h6 className="text-info mb-4">GROCERY_RADAR</h6>
                <Form onSubmit={addGrocery} className="d-flex gap-2 mb-3">
                  <Form.Control name="item" placeholder="Item..." className="bg-transparent text-white border-secondary" />
                  <Button type="submit" variant="outline-info" size="sm">Add</Button>
                </Form>
                <div className="grocery-list-scroll" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  <Row className="g-2">
                    {groceries.map(g => (
                      <Col xs={12} key={g.id}>
                        <div className="p-2 border border-secondary rounded d-flex justify-content-between align-items-center bg-dark-subtle">
                          <span className="small text-white">{g.name}</span>
                          <Button variant="link" className="text-danger p-0 px-2 text-decoration-none" onClick={() => setGroceries(groceries.filter(i => i.id !== g.id))}>×</Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
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