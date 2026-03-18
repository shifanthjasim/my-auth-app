import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';

const Notes = ({ onBack }) => {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('sj_notes')) || []);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'Normal' });

  useEffect(() => {
    localStorage.setItem('sj_notes', JSON.stringify(notes));
  }, [notes]);

  const handleSave = (e) => {
    e.preventDefault();
    const newNote = { ...formData, id: Date.now(), date: new Date().toLocaleDateString() };
    setNotes([newNote, ...notes]);
    setShowModal(false);
    setFormData({ title: '', content: '', priority: 'Normal' });
  };

  const deleteNote = (id) => {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  return (
    <div className="page-view-wrapper" style={{ paddingTop: '100px' }}>
      <Container className="py-5 text-white">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="d-flex align-items-center">
            <Button variant="outline-info" className="me-4 rounded-circle back-btn" onClick={onBack}>←</Button>
            <h2 className="display-4 fw-bold name-gradient mb-0">System Notes</h2>
          </div>
          <Button variant="info" className="rounded-pill px-4" onClick={() => setShowModal(true)}>
            + New Note
          </Button>
        </div>

        {/* NOTES GRID */}
        <Row className="g-4">
          {notes.length === 0 && <p className="text-muted ps-3">No notes found. System is clear.</p>}
          {notes.map(note => (
            <Col md={4} key={note.id}>
              <Card className={`garden-card h-100 ${note.priority === 'High' ? 'border-danger shadow-urgent' : ''}`}>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="text-info mb-0">{note.title}</h5>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>{note.date}</small>
                  </div>
                  <Card.Text className="small opacity-75 flex-grow-1">
                    {note.content}
                  </Card.Text>
                  <div className="mt-3 pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                    <span className={`badge ${note.priority === 'High' ? 'bg-danger' : 'bg-dark border border-secondary'}`}>
                      {note.priority}
                    </span>
                    <Button variant="link" className="text-danger p-0 small" onClick={() => deleteNote(note.id)}>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ADD NOTE MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
          <Modal.Header closeButton closeVariant="white" className="border-secondary">
            <Modal.Title>Create Note</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label className="small text-info">TITLE</Form.Label>
                <Form.Control 
                  required 
                  className="bg-transparent text-white border-secondary" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="small text-info">PRIORITY</Form.Label>
                {/* CHANGED THIS SECTION TO Form.Select */}
                <Form.Select 
                  className="bg-dark text-white border-secondary"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High (Urgent)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small text-info">CONTENT</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4}
                  className="bg-transparent text-white border-secondary" 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-secondary">
              <Button variant="info" type="submit" className="w-100">Save to System</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Notes;