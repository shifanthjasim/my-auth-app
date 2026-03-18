import React, { useEffect, useState } from 'react';
// ❌ REMOVED: import { supabase } from '../supabaseClient'; 
import { Container, Row, Col, Card, Button, Accordion, Tab, Nav, ListGroup, Form } from 'react-bootstrap';

const Coding = ({ onBack, supabase }) => { // ✅ Receiving supabase as a prop
  const [missions, setMissions] = useState([]);
  const [newMission, setNewMission] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMissions = async () => {
    // Safety check: wait for the uplink to exist
    if (!supabase) return;

    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Sync Error:", error.message);
    else setMissions(data || []);
  };

  useEffect(() => {
    fetchMissions();
  }, [supabase]); // Re-run if the connection resets

  const handleSaveMission = async (e) => {
    e.preventDefault();
    if (!newMission.trim() || !supabase) return;

    setLoading(true);
    const { error } = await supabase
      .from('missions')
      .insert([{ 
        mission_name: newMission,
        category: 'Coding' // 🏷️ Categorizing this for your hub
      }]);

    if (error) {
      alert("Uplink Failed: " + error.message);
    } else {
      setNewMission('');
      fetchMissions();
    }
    setLoading(false);
  };

  return (
    <div className="page-view-wrapper">
      <Container className="py-4 text-white">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <Button variant="outline-info" size="sm" className="me-3" onClick={onBack}>← BACK</Button>
          <h2 className="fw-bold name-gradient mb-0">Coding Hub</h2>
        </div>

        {/* 🚀 LIVE SYNC INPUT SECTION */}
        <Card className="bg-dark border-info mb-4 shadow-lg win-border">
          <Card.Body>
            <h6 className="text-info mb-3 small">SATELLITE_UPLINK: MARYLAND_DATABASE</h6>
            <Form onSubmit={handleSaveMission} className="d-flex gap-2 mb-3">
              <Form.Control
                type="text"
                placeholder="New coding mission..."
                className="bg-black text-white border-secondary"
                value={newMission}
                onChange={(e) => setNewMission(e.target.value)}
              />
              <Button variant="info" size="sm" type="submit" disabled={loading}>
                {loading ? 'SYNCING...' : 'SYNC'}
              </Button>
            </Form>

            <ListGroup variant="flush" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {missions.length > 0 ? (
                missions.map((m) => (
                  <ListGroup.Item key={m.id} className="bg-transparent text-white border-secondary d-flex justify-content-between p-1 small">
                    <span>⚡ {m.mission_name}</span>
                    <small className="text-muted">{new Date(m.created_at).toLocaleTimeString()}</small>
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-muted small italic">Waiting for Maryland Hub...</p>
              )}
            </ListGroup>
          </Card.Body>
        </Card>

        {/* TUTORIAL SECTION */}
        <Tab.Container id="coding-tabs" defaultActiveKey="react">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column custom-side-tabs border-end border-secondary pe-2">
                <Nav.Item><Nav.Link eventKey="react" className="mb-2 py-1 small">React.js</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="python" className="py-1 small">Python</Nav.Link></Nav.Item>
              </Nav>
            </Col>
            
            <Col sm={9}>
              <Tab.Content className="ps-3">
                <Tab.Pane eventKey="react">
                  <h5 className="text-info mb-3">React Fundamentals</h5>
                  <Accordion flush className="coding-accordion small">
                    <Accordion.Item eventKey="0" className="bg-transparent border-secondary text-white">
                      <Accordion.Header className="bg-dark">1. What is a Component?</Accordion.Header>
                      <Accordion.Body className="bg-black">
                        Building blocks of UI. 
                        <pre className="mt-2 text-warning">{`function Welcome() { ... }`}</pre>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Tab.Pane>

                <Tab.Pane eventKey="python">
                  <h5 className="text-warning mb-3">Python Essentials</h5>
                  <Accordion flush className="coding-accordion small">
                    <Accordion.Item eventKey="0" className="bg-transparent border-secondary text-white">
                      <Accordion.Header>1. Dynamic Typing</Accordion.Header>
                      <Accordion.Body className="bg-black">
                        No need to declare types.
                        <pre className="mt-2 text-info">{`name = "Shifanth"`}</pre>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default Coding;