import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';

const Notes = ({ onBack, supabase }) => {
  // --- 1. STATE MANAGEMENT (Cloud-First) ---
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'Normal' });

  // --- 2. THE DOWNLINK (Fetch from Maryland) ---
  const fetchNotes = async () => {
    if (!supabase) return;
    
    console.log("🛰️ Requesting System Notes from Maryland...");
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('category', 'Note') // Filter only for Notes
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ FETCH_ERROR:", error.message);
    } else {
      setNotes(data || []);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [supabase]);

  // --- 3. THE UPLINK (Save to Maryland) ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    const { error } = await supabase
      .from('missions')
      .insert([{ 
        mission_name: formData.title, // Map title to mission_name
        text: formData.content,       // Map content to text
        category: 'Note',             // Hardcoded category
        priority_level: formData.priority // Optional: if you added this column
      }]);

    if (error) {
      alert("⚠️ UPLINK_FAILED: " + error.message);
    } else {
      setFormData({ title: '', content: '', priority: 'Normal' });
      setShowModal(false);
      fetchNotes();
    }
    setLoading(false);
  };

  // --- 4. THE ERASE COMMAND ---
  const deleteNote = async (id) => {
    if (window.confirm("ERASE_NOTE: Permanently remove from Maryland Cloud?")) {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) console.error("❌ DELETE_ERROR:", error.message);
      else fetchNotes();
    }
  };

  return (
    <div className="notes-wrapper bg-black text-white p-3" style={{ minHeight: '65vh' }}>
      <Container fluid>
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
          <div className="d-flex align-items-center">
            <Button variant="outline-info" size="sm" className="me-3" onClick={onBack}>← BACK</Button>
            <h4 className="fw-bold text-info mb-0" style={{ letterSpacing: '1px' }}>SYSTEM_NOTES.LOG</h4>
          </div>
          <Button variant="info" size="sm" className="fw-bold" onClick={() => setShowModal(true)}>
            + NEW_NOTE
          </Button>
        </div>

        {/* NOTES GRID */}
        <Row className="g-3">
          {notes.length === 0 ? (
            <Col className="text-center py-5">
              <p className="text-muted small italic">Satellite coverage active. No notes detected in Maryland...</p>
            </Col>
          ) : (
            notes.map(note => (
              <Col md={6} lg={4} key={note.id}>
                <Card className="bg-dark border-secondary h-100 win-border shadow-sm">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="text-info fw-bold mb-0">{note.mission_name}</h6>
                      <Badge bg={note.priority_level === 'High' ? 'danger' : 'secondary'} style={{fontSize: '0.6rem'}}>
                        {note.priority_level || 'NORMAL'}
                      </Badge>
                    </div>
                    <hr className="border-secondary my-2" />
                    <p className="small text-white opacity-90 mb-3" style={{ whiteSpace: 'pre-wrap', minHeight: '60px' }}>
                      {note.text}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                      <small className="text-muted" style={{ fontSize: '0.65rem' }}>
                        {new Date(note.created_at).toLocaleDateString()}
                      </small>
                      <Button variant="link" className="text-danger p-0 small text-decoration-none" onClick={() => deleteNote(note.id)}>
                        [ERASE]
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* ADD NOTE MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-info win-border">
          <Modal.Header closeButton closeVariant="white" className="border-secondary bg-black">
            <Modal.Title className="small fw-bold text-info">ENCRYPT_NEW_NOTE</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body className="bg-black">
              <Form.Group className="mb-3">
                <Form.Label className="small text-info">IDENTIFIER</Form.Label>
                <Form.Control 
                  required 
                  className="bg-dark text-white border-secondary small" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="small text-info">PRIORITY_LEVEL</Form.Label>
                <Form.Select 
                  className="bg-dark text-white border-secondary small"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High (Urgent)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small text-info">CONTENT_BODY</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4}
                  className="bg-dark text-white border-secondary small" 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-secondary bg-black">
              <Button variant="info" type="submit" className="w-100 fw-bold" disabled={loading}>
                {loading ? 'UPLINKING...' : 'SAVE_TO_CLOUD'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Notes;