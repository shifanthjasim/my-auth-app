import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this path is correct
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';

const Diary = ({ onBack }) => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', mood: '😊 Happy' });

  // --- 1. FETCH FROM SUPABASE ---
  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('missions') // Using your missions table
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Sync Error:", error.message);
    else setEntries(data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // --- 2. SAVE TO SUPABASE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('missions')
      .insert([{ 
        mission_name: formData.title, // Maps to your mission_name column
        text: formData.content,       // Ensure you have a 'text' column in SQL
        category: formData.mood 
      }]);

    if (error) {
      alert("Handshake Failed: " + error.message);
    } else {
      setShowModal(false);
      setFormData({ title: '', content: '', mood: '😊 Happy' });
      fetchEntries(); // Refresh the list for both devices
    }
    setLoading(false);
  };

  // --- 3. DELETE FROM SUPABASE ---
  const deleteEntry = async (id) => {
    if (window.confirm("Delete this memory?")) {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) console.error("Erase Error:", error.message);
      else fetchEntries();
    }
  };

  return (
    <div className="page-view-wrapper" style={{ paddingTop: '100px' }}>
      <Container className="py-5 text-white">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="d-flex align-items-center">
            <Button variant="outline-info" className="me-4 rounded-circle back-btn" onClick={onBack}>←</Button>
            <h2 className="display-4 fw-bold name-gradient mb-0">Personal Diary</h2>
          </div>
          <Button variant="info" className="rounded-pill px-4 shadow-cyan" onClick={() => setShowModal(true)}>
            + Write Today's Story
          </Button>
        </div>

        <div className="diary-timeline">
          {entries.length === 0 && <p className="text-muted text-center py-5">Connecting to Maryland... if empty, start writing!</p>}
          {entries.map((entry) => (
            <div key={entry.id} className="diary-item mb-5">
              <div className="diary-meta">
                <div className="diary-dot"></div>
                <span className="diary-date">{new Date(entry.created_at).toLocaleDateString()}</span>
                <span className="diary-time">{new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <Card className="garden-card diary-card border-0 shadow-lg bg-dark text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 className="text-info h4 mb-0">{entry.mission_name}</h3>
                    <Badge bg="dark" className="border border-info text-info">{entry.category}</Badge>
                  </div>
                  <p className="diary-content">{entry.text}</p>
                  <div className="text-end">
                    <Button variant="link" className="text-danger p-0 small" onClick={() => deleteEntry(entry.id)}>
                      Erase Memory
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {/* ENTRY MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary shadow-lg">
          <Modal.Header closeButton closeVariant="white" className="border-secondary">
            <Modal.Title>New Diary Entry</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-info">TITLE</Form.Label>
                    <Form.Control required className="bg-transparent text-white border-secondary" placeholder="What happened today?" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-info">MOOD</Form.Label>
                    <Form.Select className="bg-dark text-white border-secondary" value={formData.mood} onChange={e => setFormData({...formData, mood: e.target.value})}>
                      <option>😊 Happy</option>
                      <option>🚀 Productive</option>
                      <option>😴 Tired</option>
                      <option>🤔 Thoughtful</option>
                      <option>🔥 Stressed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="small text-info">THE STORY</Form.Label>
                <Form.Control as="textarea" rows={6} required className="bg-transparent text-white border-secondary" placeholder="Write your heart out..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-secondary">
              <Button variant="info" type="submit" className="w-100" disabled={loading}>
                {loading ? 'Uplinking...' : 'Save Entry to Cloud'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Diary;