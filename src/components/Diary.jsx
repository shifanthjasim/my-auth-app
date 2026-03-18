import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal, Badge, Spinner } from 'react-bootstrap';

const Diary = ({ onBack, supabase }) => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', mood: '😊 Happy' });

  // --- 🛰️ THE DOWNLINK (Fixed function name) ---
  const fetchDiaryEntries = async () => {
    if (!supabase) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      // 🎯 We keep 'Diary' and NULL entries, but we also need to allow the 'Moods'
      .or('category.eq.Diary,category.is.null,category.ilike.%😊%,category.ilike.%🚀%,category.ilike.%🤔%,category.ilike.%😴%,category.ilike.%🔥%') 
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ DIARY_SYNC_ERROR:", error.message);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDiaryEntries(); // 👈 Fixed name here
  }, [supabase]);

  // --- 🚀 THE UPLINK ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    const { error } = await supabase
      .from('missions')
      .insert([{ 
        mission_name: formData.title,
        text: formData.content,
        category: formData.mood // Saving mood to category
      }]);

    if (error) {
      alert("⚠️ UPLINK_FAILED: " + error.message);
    } else {
      setFormData({ title: '', content: '', mood: '😊 Happy' });
      setShowModal(false);
      fetchDiaryEntries(); // 👈 Fixed name here
    }
    setLoading(false);
  };

  const deleteEntry = async (id) => {
    if (window.confirm("CONFIRM_ERASURE: Permanently delete from Maryland Cloud?")) {
      const { error } = await supabase.from('missions').delete().eq('id', id);
      if (!error) fetchDiaryEntries(); // 👈 Fixed name here
    }
  };

  return (
    <div className="diary-wrapper p-4 bg-black text-white" style={{ minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
        <div>
          <h2 className="text-info fw-bold mb-0" style={{ letterSpacing: '2px' }}>SECRET_DIARY.LOG</h2>
          <small className="text-muted">STATUS: {loading ? 'SYNCING...' : 'ENCRYPTED'}</small>
        </div>
        <Button variant="outline-info" size="sm" onClick={() => setShowModal(true)}>+ NEW_ENTRY</Button>
      </div>

      <div className="diary-list">
        {loading && entries.length === 0 ? (
          <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
        ) : entries.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted italic">No data detected in Maryland Hub...</p>
          </div>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="mb-3 bg-dark border-secondary text-white shadow-sm win-border">
              <Card.Body style={{ backgroundColor: '#000' }}>
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="text-info mb-0">{entry.mission_name}</h5>
                  <Badge bg="info" text="dark">{entry.category || 'Legacy'}</Badge>
                </div>
                <hr className="border-secondary my-2" />
                <p className="small mb-3" style={{ whiteSpace: 'pre-wrap', opacity: 0.9 }}>{entry.text}</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>
                    {new Date(entry.created_at).toLocaleString()}
                  </small>
                  <Button variant="link" className="text-danger p-0 small text-decoration-none" onClick={() => deleteEntry(entry.id)}>
                    [ERASE]
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* MODAL CODE REMAINS THE SAME */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-info win-border">
        <Modal.Header closeButton closeVariant="white" className="border-secondary bg-black">
          <Modal.Title className="text-info small fw-bold">CREATE_NEW_LOG_ENTRY</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="bg-black">
            <Form.Group className="mb-3">
              <Form.Label className="text-info small">TITLE / OBJECTIVE</Form.Label>
              <Form.Control className="bg-dark text-white border-secondary" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-info small">MOOD_PROTOCOL</Form.Label>
              <Form.Select className="bg-dark text-white border-secondary" value={formData.mood} onChange={e => setFormData({...formData, mood: e.target.value})}>
                <option>😊 Happy</option>
                <option>🚀 Productive</option>
                <option>🤔 Thoughtful</option>
                <option>😴 Tired</option>
                <option>🔥 Stressed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-info small">ENTRY_CONTENT</Form.Label>
              <Form.Control as="textarea" rows={5} className="bg-dark text-white border-secondary" required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-secondary bg-black">
            <Button variant="info" type="submit" className="w-100 fw-bold" disabled={loading}>COMMIT_TO_CLOUD</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Diary;