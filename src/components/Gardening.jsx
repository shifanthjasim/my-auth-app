import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Spinner } from 'react-bootstrap';

const Gardening = ({ onBack, supabase }) => {
  // --- 1. STATE MANAGEMENT ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('task'); // 'task', 'plant', or 'plan'
  const [formData, setFormData] = useState({ name: '', notes: '' });

  // --- 2. THE DOWNLINK (Fetch by Category) ---
  const fetchGardenData = async () => {
    if (!supabase) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('category', 'Gardening')
      .order('created_at', { ascending: false });

    if (error) console.error("❌ BOTANY_FETCH_ERROR:", error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGardenData();
  }, [supabase]);

  // --- 3. THE UPLINK (Save with Sub-Types) ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const { error } = await supabase
      .from('missions')
      .insert([{ 
        mission_name: formData.name,
        text: formData.notes,
        category: 'Gardening',
        priority_level: modalType // We use this column to sort into Maintenance/Plants/Plans
      }]);

    if (error) {
      alert("⚠️ UPLINK_FAILED: " + error.message);
    } else {
      setShowModal(false);
      setFormData({ name: '', notes: '' });
      fetchGardenData();
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("ERASE_RECORD: Permanently remove from Maryland?")) {
      await supabase.from('missions').delete().eq('id', id);
      fetchGardenData();
    }
  };

  // Helper filters for the UI columns
  const tasks = items.filter(i => i.priority_level === 'task');
  const plants = items.filter(i => i.priority_level === 'plant');
  const plans = items.filter(i => i.priority_level === 'plan');

  return (
    <div className="gardening-wrapper bg-black text-white p-3" style={{ minHeight: '70vh' }}>
      <Container fluid>
        {/* HEADER */}
        <div className="d-flex align-items-center mb-4 border-bottom border-secondary pb-3">
          <Button variant="outline-success" size="sm" className="me-3" onClick={onBack}>← BACK</Button>
          <h4 className="fw-bold text-success mb-0" style={{ letterSpacing: '1px' }}>BOTANY_LOG.SYS</h4>
          {loading && <Spinner animation="border" variant="success" size="sm" className="ms-3" />}
        </div>

        <Row className="g-3">
          {/* COLUMN 1: MAINTENANCE */}
          <Col lg={4}>
            <div className="d-flex justify-content-between align-items-center mb-3 bg-dark p-2 border border-secondary">
              <span className="text-info fw-bold small">MAINTENANCE_LOG</span>
              <Button size="xs" variant="outline-info" style={{fontSize: '0.7rem'}} onClick={() => { setModalType('task'); setShowModal(true); }}>+ LOG</Button>
            </div>
            {tasks.map(t => (
              <Card key={t.id} className="bg-dark border-info mb-2 win-border small">
                <Card.Body className="p-2">
                  <div className="d-flex justify-content-between text-info fw-bold">
                    <span>{t.mission_name}</span>
                    <span style={{cursor:'pointer'}} onClick={() => deleteItem(t.id)}>×</span>
                  </div>
                  <p className="mb-0 opacity-75 mt-1">{t.text}</p>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* COLUMN 2: CURRENT PLANTS */}
          <Col lg={4}>
            <div className="d-flex justify-content-between align-items-center mb-3 bg-dark p-2 border border-secondary">
              <span className="text-success fw-bold small">CURRENT_PLANTS</span>
              <Button size="xs" variant="outline-success" style={{fontSize: '0.7rem'}} onClick={() => { setModalType('plant'); setShowModal(true); }}>+ ADD</Button>
            </div>
            {plants.map(p => (
              <Card key={p.id} className="bg-dark border-success mb-2 win-border small">
                <Card.Body className="p-2">
                  <div className="d-flex justify-content-between text-success fw-bold">
                    <span>{p.mission_name}</span>
                    <span style={{cursor:'pointer'}} onClick={() => deleteItem(p.id)}>×</span>
                  </div>
                  <p className="mb-0 opacity-75 mt-1">{p.text}</p>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* COLUMN 3: FUTURE UPGRADES */}
          <Col lg={4}>
            <div className="d-flex justify-content-between align-items-center mb-3 bg-dark p-2 border border-secondary">
              <span className="text-warning fw-bold small">FUTURE_UPGRADES</span>
              <Button size="xs" variant="outline-warning" style={{fontSize: '0.7rem'}} onClick={() => { setModalType('plan'); setShowModal(true); }}>+ PLAN</Button>
            </div>
            {plans.map(plan => (
              <Card key={plan.id} className="bg-dark border-warning mb-2 win-border small">
                <Card.Body className="p-2">
                  <div className="d-flex justify-content-between text-warning fw-bold">
                    <span>{plan.mission_name}</span>
                    <span style={{cursor:'pointer'}} onClick={() => deleteItem(plan.id)}>×</span>
                  </div>
                  <p className="mb-0 opacity-75 mt-1">{plan.text}</p>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>

        {/* MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary win-border">
          <Form onSubmit={handleSave}>
            <Modal.Header closeButton closeVariant="white" className="border-secondary bg-black p-2">
              <Modal.Title className="small fw-bold text-uppercase">{modalType}_ENTRY</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-black">
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted">IDENTIFIER</Form.Label>
                <Form.Control required className="bg-dark text-white border-secondary small" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted">DATA_NOTES</Form.Label>
                <Form.Control as="textarea" className="bg-dark text-white border-secondary small" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-black border-secondary p-2">
              <Button variant="success" type="submit" className="w-100 btn-sm fw-bold">COMMIT_TO_CLOUD</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Gardening;