import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';

const Diary = ({ onBack, supabase }) => { // 🛰️ Receiving supabase from App.jsx
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', mood: '😊 Happy' });

  // --- FETCH FROM CLOUD ONLY ---
  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Cloud Fetch Error:", error.message);
    else setEntries(data || []);
  };

  useEffect(() => {
    if (supabase) fetchEntries();
  }, [supabase]);

  // --- SAVE TO CLOUD ONLY ---
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('missions')
      .insert([{ 
        mission_name: formData.title,
        text: formData.content,
        category: formData.mood 
      }]);

    if (error) {
      alert("Maryland Uplink Failed: " + error.message);
    } else {
      setFormData({ title: '', content: '', mood: '😊 Happy' });
      setShowModal(false);
      fetchEntries(); // Refresh list from DB
    }
    setLoading(false);
  };

  const deleteEntry = async (id) => {
    if (window.confirm("Erase from Maryland Cloud?")) {
      const { error } = await supabase.from('missions').delete().eq('id', id);
      if (!error) fetchEntries();
    }
  };

  return (
    <div className="diary-wrapper p-4 bg-black text-white" style={{ minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-info fw-bold">SECRET_DIARY.LOG</h2>
        <Button variant="outline-info" size="sm" onClick={() => setShowModal(true)}>+ NEW_ENTRY</Button>
      </div>

      <div className="diary-list">
        {entries.length === 0 && <p className="text-muted">No data found in Maryland Hub...</p>}
        {entries.map((entry) => (
          <Card key={entry.id} className="mb-3 bg-dark border-secondary text-white shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <h5 className="text-info">{entry.mission_name}</h5>
                <Badge bg="info" text="dark">{entry.category}</Badge>
              </div>
              <p className="small mt-2">{entry.text}</p>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">{new Date(entry.created_at).toLocaleString()}</small>
                <Button variant="link" className="text-danger p-0 small" onClick={() => deleteEntry(entry.id)}>DELETE</Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Modal remains the same but calls handleSave */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-info">
        <Modal.Header closeButton closeVariant="white"><Modal.Title>WRITE_MEMORY</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>TITLE</Form.Label>
              <Form.Control className="bg-black text-white border-secondary" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>MOOD</Form.Label>
              <Form.Select className="bg-black text-white border-secondary" value={formData.mood} onChange={e => setFormData({...formData, mood: e.target.value})}>
                <option>😊 Happy</option><option>🚀 Productive</option><option>🤔 Thoughtful</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CONTENT</Form.Label>
              <Form.Control as="textarea" rows={4} className="bg-black text-white border-secondary" required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" type="submit" className="w-100" disabled={loading}>
              {loading ? "UPLINKING..." : "COMMIT TO CLOUD"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Diary;