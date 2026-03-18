import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal, Badge, Spinner } from 'react-bootstrap';

const Diary = ({ onBack, supabase }) => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', mood: '😊 Happy' });

  const fetchDiaryEntries = async () => {
    if (!supabase) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('missions')
      .select('*')
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
    fetchDiaryEntries();
  }, [supabase]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    const { error } = await supabase
      .from('missions')
      .insert([{ 
        mission_name: formData.title,
        text: formData.content,
        category: formData.mood 
      }]);

    if (error) {
      alert("⚠️ UPLINK_FAILED: " + error.message);
    } else {
      setFormData({ title: '', content: '', mood: '😊 Happy' });
      setShowModal(false);
      fetchDiaryEntries();
    }
    setLoading(false);
  };

  const deleteEntry = async (id) => {
    if (window.confirm("CONFIRM_ERASURE: Permanently delete from Maryland Cloud?")) {
      const { error } = await supabase.from('missions').delete().eq('id', id);
      if (!error) fetchDiaryEntries();
    }
  };

  return (
    <div className="diary-wrapper p-2 p-md-4 bg-black text-white" style={{ minHeight: '80vh' }}>
      <Container fluid className="px-1">
        
        {/* 🛠️ RESPONSIVE HEADER: Title stacks on top of button on iPhone */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 border-bottom border-secondary pb-3 gap-3">
          <div className="d-flex align-items-center">
            <Button variant="outline-info" size="sm" className="me-2 me-md-3" onClick={onBack}>← BACK</Button>
            <div>
              <h2 className="text-info fw-bold mb-0" style={{ letterSpacing: '1px', fontSize: 'clamp(1.1rem, 5vw, 1.8rem)' }}>
                SECRET_DIARY.LOG
              </h2>
              <small className="text-muted d-block" style={{ fontSize: '0.65rem' }}>
                STATUS: {loading ? 'SYNCING...' : 'ENCRYPTED_UPLINK'}
              </small>
            </div>
          </div>
          <Button 
            variant="info" 
            size="sm" 
            className="fw-bold px-3 py-2 shadow-sm" 
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => setShowModal(true)}
          >
            + NEW_ENTRY
          </Button>
        </div>

        <div className="diary-list">
          {loading && entries.length === 0 ? (
            <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
          ) : entries.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted italic small">No data detected in Maryland Hub...</p>
            </div>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="mb-3 bg-dark border-secondary text-white shadow-sm win-border">
                <Card.Body className="p-3" style={{ backgroundColor: '#000' }}>
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <h5 className="text-info mb-0 fw-bold" style={{ fontSize: '1rem' }}>{entry.mission_name}</h5>
                    <Badge bg="info" text="dark" style={{ fontSize: '0.6rem' }}>{entry.category || 'LOG'}</Badge>
                  </div>
                  <hr className="border-secondary my-2" />
                  <p className="small mb-3" style={{ whiteSpace: 'pre-wrap', opacity: 0.9, lineHeight: '1.4' }}>
                    {entry.text}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                    <small className="text-muted" style={{ fontSize: '0.6rem' }}>
                      {new Date(entry.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </small>
                    <Button variant="link" className="text-danger p-0 small text-decoration-none" style={{ fontSize: '0.7rem' }} onClick={() => deleteEntry(entry.id)}>
                      [ERASE_MEMORY]
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Container>

      {/* MODAL - Adjusted for Mobile width */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-info win-border mx-2">
        <Modal.Header closeButton closeVariant="white" className="border-secondary bg-black p-2">
          <Modal.Title className="text-info small fw-bold">CREATE_NEW_LOG_ENTRY</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="bg-black p-3">
            <Form.Group className="mb-3">
              <Form.Label className="text-info small">TITLE / OBJECTIVE</Form.Label>
              <Form.Control className="bg-dark text-white border-secondary small" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-info small">MOOD_PROTOCOL</Form.Label>
              <Form.Select className="bg-dark text-white border-secondary small" value={formData.mood} onChange={e => setFormData({...formData, mood: e.target.value})}>
                <option>😊 Happy</option>
                <option>🚀 Productive</option>
                <option>🤔 Thoughtful</option>
                <option>😴 Tired</option>
                <option>🔥 Stressed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-info small">ENTRY_CONTENT</Form.Label>
              <Form.Control as="textarea" rows={6} className="bg-dark text-white border-secondary small" required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-secondary bg-black p-2">
            <Button variant="info" type="submit" className="w-100 fw-bold">COMMIT_TO_CLOUD</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Diary;