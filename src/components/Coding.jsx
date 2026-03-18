import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; 
import { Container, Row, Col, Card, Button, Accordion, Tab, Nav, ListGroup, Form } from 'react-bootstrap';

const Coding = ({ onBack }) => {
  // --- STATE MANAGEMENT ---
  const [missions, setMissions] = useState([]);
  const [newMission, setNewMission] = useState('');
  const [loading, setLoading] = useState(false);

  // --- THE FETCH HANDSHAKE (Runs on Load) ---
  const fetchMissions = async () => {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Sync Error:", error.message);
    else setMissions(data);
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // --- THE UPLINK (Saves to Maryland) ---
  const handleSaveMission = async (e) => {
    e.preventDefault();
    if (!newMission.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from('missions')
      .insert([{ mission_name: newMission }]); // Matches your table column

    if (error) {
      alert("Uplink Failed: " + error.message);
    } else {
      setNewMission('');
      fetchMissions(); // Refresh the list immediately
    }
    setLoading(false);
  };

  return (
    <div className="page-view-wrapper" style={{ paddingTop: '100px' }}>
      <Container className="py-5 text-white">
        {/* Header */}
        <div className="d-flex align-items-center mb-5">
          <Button variant="outline-info" className="me-4 rounded-circle back-btn" onClick={onBack}>←</Button>
          <h2 className="display-4 fw-bold name-gradient mb-0">Coding Hub</h2>
        </div>

        {/* 🚀 LIVE SYNC INPUT SECTION */}
        <Card className="bg-dark border-info mb-5 shadow-lg animate-fade-in">
          <Card.Body>
            <h5 className="text-info mb-3">Satellite Uplink: Maryland Database</h5>
            <Form onSubmit={handleSaveMission} className="d-flex gap-2 mb-4">
              <Form.Control
                type="text"
                placeholder="Enter new mission data..."
                className="bg-black text-white border-secondary"
                value={newMission}
                onChange={(e) => setNewMission(e.target.value)}
              />
              <Button variant="info" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Sync Mission'}
              </Button>
            </Form>

            <ListGroup variant="flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {missions.length > 0 ? (
                missions.map((m) => (
                  <ListGroup.Item key={m.id} className="bg-transparent text-white border-secondary d-flex justify-content-between">
                    <span>⚡ {m.mission_name}</span>
                    <small className="text-muted">{new Date(m.created_at).toLocaleTimeString()}</small>
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-muted italic">No missions detected in the cloud...</p>
              )}
            </ListGroup>
          </Card.Body>
        </Card>

        {/* TUTORIAL SECTION */}
        <Tab.Container id="coding-tabs" defaultActiveKey="react">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column custom-side-tabs">
                <Nav.Item><Nav.Link eventKey="react" className="mb-2">React.js</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="python">Python</Nav.Link></Nav.Item>
              </Nav>
            </Col>
            
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="react">
                  <h3 className="text-info mb-4">React Fundamentals</h3>
                  <Accordion defaultActiveKey="0" flush className="coding-accordion">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>1. What is a Component?</Accordion.Header>
                      <Accordion.Body>
                        Components are the building blocks of a React app.
                        <pre className="code-block mt-2">{`function Welcome() { return <h1>Hello!</h1>; }`}</pre>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Tab.Pane>

                <Tab.Pane eventKey="python">
                  <h3 className="text-warning mb-4">Python Essentials</h3>
                  <Accordion defaultActiveKey="0" flush className="coding-accordion">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>1. Variables</Accordion.Header>
                      <Accordion.Body>
                        Python is dynamically typed.
                        <pre className="code-block mt-2">{`name = "Shifanth"\nage = 25`}</pre>
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