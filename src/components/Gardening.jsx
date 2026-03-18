import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';

const Gardening = ({ onBack }) => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('sj_garden_tasks')) || []);
  const [plants, setPlants] = useState(() => JSON.parse(localStorage.getItem('sj_plants')) || []);
  const [plans, setPlans] = useState(() => JSON.parse(localStorage.getItem('sj_garden_plans')) || []);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('task');
  const [formData, setFormData] = useState({ name: '', notes: '' });

  useEffect(() => {
    localStorage.setItem('sj_garden_tasks', JSON.stringify(tasks));
    localStorage.setItem('sj_plants', JSON.stringify(plants));
    localStorage.setItem('sj_garden_plans', JSON.stringify(plans));
  }, [tasks, plants, plans]);

  const handleSave = (e) => {
    e.preventDefault();
    const newItem = { ...formData, id: Date.now() };
    if (modalType === 'task') setTasks([newItem, ...tasks]);
    if (modalType === 'plant') setPlants([newItem, ...plants]);
    if (modalType === 'plan') setPlans([newItem, ...plans]);
    setShowModal(false);
    setFormData({ name: '', notes: '' });
  };

  return (
    <Container className="py-5 mt-5">
      <div className="d-flex align-items-center mb-5">
        <Button variant="outline-info" className="me-4 rounded-circle back-btn" onClick={onBack}>←</Button>
        <h2 className="display-4 fw-bold name-gradient mb-0">Botany Log</h2>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <div className="garden-section-header">
            <h4>MAINTENANCE_LOG</h4>
            <Button size="sm" variant="outline-success" onClick={() => { setModalType('task'); setShowModal(true); }}>+ Log</Button>
          </div>
          {tasks.map(t => (
            <Card key={t.id} className="garden-card mb-3"><Card.Body><h6 className="text-info">{t.name}</h6><p className="small mb-0">{t.notes}</p></Card.Body></Card>
          ))}
        </Col>
        <Col lg={4}>
          <div className="garden-section-header">
            <h4>CURRENT_PLANTS</h4>
            <Button size="sm" variant="outline-info" onClick={() => { setModalType('plant'); setShowModal(true); }}>+ Add</Button>
          </div>
          {plants.map(p => (
            <Card key={p.id} className="garden-card mb-3"><Card.Body><h6 className="text-white">{p.name}</h6><p className="small mb-0">{p.notes}</p></Card.Body></Card>
          ))}
        </Col>
        <Col lg={4}>
          <div className="garden-section-header">
            <h4>FUTURE_UPGRADES</h4>
            <Button size="sm" variant="outline-warning" onClick={() => { setModalType('plan'); setShowModal(true); }}>+ Plan</Button>
          </div>
          {plans.map(p => (
            <Card key={p.id} className="garden-card mb-3"><Card.Body><h6 className="text-warning">{p.name}</h6><p className="small mb-0">{p.notes}</p></Card.Body></Card>
          ))}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control required className="bg-transparent text-white border-secondary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" className="bg-transparent text-white border-secondary" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer><Button variant="info" type="submit" className="w-100">Commit Changes</Button></Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Gardening;