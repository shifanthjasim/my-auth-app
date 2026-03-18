import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';

const Diary = ({ onBack }) => {
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('sj_diary')) || []);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', mood: '😊 Happy' });

  useEffect(() => {
    localStorage.setItem('sj_diary', JSON.stringify(entries));
  }, [entries]);

  const handleSave = (e) => {
    e.preventDefault();
    const now = new Date();
    const newEntry = { 
      ...formData, 
      id: Date.now(), 
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEntries([newEntry, ...entries]);
    setShowModal(false);
    setFormData({ title: '', content: '', mood: '😊 Happy' });
  };

  const deleteEntry = (id) => {
    if (window.confirm("Delete this memory?")) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  return (
    <div className="page-view-wrapper" style={{ paddingTop: '100px' }}>
      <Container className="py-5 text-white">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="d-flex align-items-center">
            <Button variant="outline-info" className="me-4 rounded-circle back-btn" onClick={onBack}>←</Button>
            <h2 className="display-4 fw-bold name-gradient mb-0">Personal Diary</h2>
          </div>
          <Button variant="info" className="rounded-pill px-4 shadow-cyan" onClick={() => setShowModal(true)}>
            + Write Today's Story
          </Button>
        </div>

        {/* TIMELINE VIEW */}
        <div className="diary-timeline">
          {entries.length === 0 && <p className="text-muted text-center py-5">The pages are empty. Start writing...</p>}
          {entries.map((entry, index) => (
            <div key={entry.id} className="diary-item mb-5">
              <div className="diary-meta">
                <div className="diary-dot"></div>
                <span className="diary-date">{entry.date}</span>
                <span className="diary-time">{entry.time}</span>
              </div>
              <Card className="garden-card diary-card border-0 shadow-lg">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 className="text-info h4 mb-0">{entry.title}</h3>
                    <Badge bg="dark" className="border border-info text-info">{entry.mood}</Badge>
                  </div>
                  <p className="diary-content">{entry.content}</p>
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
              <Button variant="info" type="submit" className="w-100">Save Entry</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Diary;