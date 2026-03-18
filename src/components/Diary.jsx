import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal, Badge } from 'react-bootstrap';

const Diary = ({ onBack, supabase }) => {
  // --- 1. STATE INITIALIZATION (Empty by default, no LocalStorage) ---
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', mood: '😊 Happy' });

  // --- 2. THE DOWNLINK (Fetch from Maryland) ---
  const fetchEntries = async () => {
    if (!supabase) return;
    
    console.log("🛰️ AXON_NODE: Requesting data from Maryland...");
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ UPLINK_ERROR:", error.message);
    } else {
      console.log("✅ DATA_RECOVERED:", data.length, "entries found.");
      setEntries(data || []);
    }
  };

  // Run fetch as soon as the component loads
  useEffect(() => {
    fetchEntries();
  }, [supabase]);

  // --- 3. THE UPLINK (Save to Maryland) ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    console.log("🚀 UPLINKING_ENTRY...");

    const { error } = await supabase
      .from('missions')
      .insert([{ 
        mission_name: formData.title, // Matches your Schema
        text: formData.content,       // Matches your Schema
        category: formData.mood       // Matches your Schema
      }]);

    if (error) {
      alert("⚠️ UPLINK_FAILED: " + error.message);
    } else {
      console.log("✅ COMMIT_SUCCESSFUL");
      setFormData({ title: '', content: '', mood: '😊 Happy' });
      setShowModal(false);
      fetchEntries(); // Refresh list from the cloud
    }
    setLoading(false);
  };

  // --- 4. THE ERASE COMMAND ---
  const deleteEntry = async (id) => {
    if (window.confirm("CONFIRM_ERASURE: Permanently delete from Maryland Cloud?")) {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) console.error("❌ ERASE_ERROR:", error.message);
      else fetchEntries();
    }
  };

  return (
    <div className="diary-wrapper p-4 bg-black text-white" style={{ minHeight: '80vh', fontFamily: 'Tahoma, sans-serif' }}>
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
        <div>
          <h2 className="text-info fw-bold mb-0" style={{ letterSpacing: '2px' }}>SECRET_DIARY.LOG</h2>
          <small className="text-muted">STATUS: {entries.length > 0 ? 'SYNCHRONIZED' : 'IDLE'}</small>
        </div>
        <Button variant="outline-info" size="sm" className="win-btn" onClick={() => setShowModal(true)}>
          + NEW_ENTRY
        </Button>
      </div>

      {/* TIMELINE LIST */}
      <div className="diary-list">
        {entries.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted italic">No data detected in Maryland Hub...</p>
            <small className="text-info">Start a new mission to begin synchronization.</small>
          </div>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="mb-3 bg-dark border-secondary text-white shadow-sm win-border">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="text-info mb-0">{entry.mission_name}</h5>
                  <Badge bg="info" text="dark" className="ms-2">{entry.category}</Badge>
                </div>
                <hr className="border-secondary my-2" />
                <p className="small mb-3" style={{ whiteSpace: 'pre-wrap' }}>{entry.text}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    TIMESTAMP: {new Date(entry.created_at).toLocaleString()}
                  </small>
                  <Button variant="link" className="text-danger p-0 small text-decoration-none" onClick={() => deleteEntry(entry.id)}>
                    [ERASE_MEMORY]
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* NEW ENTRY MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-info win-border">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="text-info small fw-bold">CREATE_NEW_LOG_ENTRY</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="bg-black">
            <Form.Group className="mb-3">
              <Form.Label className="text-info small">TITLE / OBJECTIVE</Form.Label>
              <Form.Control 
                className="bg-dark text-white border-secondary" 
                required 
                placeholder="Entry name..."
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-info small">MOOD_PROTOCOL</Form.Label>
              <Form.Select 
                className="bg-dark text-white border-secondary" 
                value={formData.mood} 
                onChange={e => setFormData({...formData, mood: e.target.value})}
              >
                <option>😊 Happy</option>
                <option>🚀 Productive</option>
                <option>🤔 Thoughtful</option>
                <option>😴 Tired</option>
                <option>🔥 Stressed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-info small">ENTRY_CONTENT</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5} 
                className="bg-dark text-white border-secondary" 
                required 
                placeholder="Write the story..."
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-secondary bg-black">
            <Button variant="info" type="submit" className="w-100 fw-bold" disabled={loading}>
              {loading ? "UPLINKING_TO_MARYLAND..." : "COMMIT_TO_CLOUD"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Diary;