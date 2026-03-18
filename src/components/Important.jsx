import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Spinner } from 'react-bootstrap';

const Important = ({ onBack, supabase }) => {
  const [groceries, setGroceries] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Fetch Data on Mount
  useEffect(() => {
    fetchHubData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchHubData = async () => {
    setLoading(true);
    try {
      const { data: grocData } = await supabase.from('groceries').select('*').order('created_at', { ascending: false });
      const { data: eventData } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (grocData) setGroceries(grocData);
      if (eventData) setEvents(eventData);
    } catch (error) {
      console.error("Error fetching Hub data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Real-time Clock Helper
  const formatTime = (tz) => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  };

  // 3. Supabase Actions: Groceries
  const addGrocery = async (e) => {
    e.preventDefault();
    const name = e.target.item.value;
    if (!name) return;

    const { data, error } = await supabase.from('groceries').insert([{ name }]).select();
    if (!error) setGroceries([data[0], ...groceries]);
    e.target.reset();
  };

  const deleteGrocery = async (id) => {
    const { error } = await supabase.from('groceries').delete().eq('id', id);
    if (!error) setGroceries(groceries.filter(g => g.id !== id));
  };

  // 4. Supabase Actions: Events
  const addEvent = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const date = e.target.date.value;

    const { data, error } = await supabase.from('events').insert([{ title, date }]).select();
    if (!error) setEvents([...events, data[0]].sort((a, b) => new Date(a.date) - new Date(b.date)));
    e.target.reset();
  };

  const deleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) setEvents(events.filter(ev => ev.id !== id));
  };

  return (
    <div className="page-view-wrapper">
      <Container className="py-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Button variant="outline-info" className="me-3 back-btn" onClick={onBack}>BACK</Button>
            <div>
              <h2 className="terminal-text mb-0 scanline-text">IMPORTANT_HUB</h2>
              <span className="small opacity-50 text-uppercase">Supabase Live Uplink // Kandy Node</span>
            </div>
          </div>
          {loading && <Spinner animation="border" size="sm" variant="info" />}
        </div>

        <Row className="g-3">
          {/* TIMEZONE SYNC */}
          <Col md={6}>
            <Card className="hud-card">
              <Card.Body>
                <span className="sig-label">U.S. SYNC (MARYLAND)</span>
                <div className="display-5 terminal-text scanline-text text-info">{formatTime('America/New_York')}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="hud-card">
              <Card.Body>
                <span className="sig-label">FAMILY SYNC (NZ)</span>
                <div className="display-5 terminal-text scanline-text text-primary">{formatTime('Pacific/Auckland')}</div>
              </Card.Body>
            </Card>
          </Col>

          {/* EVENTS TABLE */}
          <Col md={8}>
            <Card className="hud-card h-100">
              <Card.Body>
                <h6 className="sig-label mb-4 text-white">CRITICAL_TIMELINE</h6>
                <Form onSubmit={addEvent} className="row g-2 mb-4">
                  <Col><Form.Control name="title" placeholder="TASK_ID" className="hud-input" required /></Col>
                  <Col><Form.Control name="date" type="date" className="hud-input" required /></Col>
                  <Col xs="auto"><Button type="submit" variant="info">ADD</Button></Col>
                </Form>
                
                <Table className="hud-table" variant="dark">
                  <thead>
                    <tr><th>OBJECTIVE</th><th className="text-end">DEADLINE</th><th /></tr>
                  </thead>
                  <tbody>
                    {events.map(ev => (
                      <tr key={ev.id}>
                        <td className="text-white opacity-75">{ev.title}</td>
                        <td className="text-info text-end font-monospace">{ev.date}</td>
                        <td className="text-end"><Button variant="link" className="text-danger p-0" onClick={() => deleteEvent(ev.id)}>×</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* GROCERY LIST */}
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
                {groceries.map(g => (
                  <div key={g.id} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-black border border-secondary border-opacity-25 rounded">
                    <span className="small opacity-75">{g.name}</span>
                    <span className="text-danger cursor-pointer" onClick={() => deleteGrocery(g.id)}>×</span>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Important;