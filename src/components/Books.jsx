import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Tab, Tabs, Spinner, Badge } from 'react-bootstrap';

const Books = ({ onBack, supabase }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('library'); 
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', notes: '' });

  // --- 🛰️ THE DOWNLINK (Fetch everything in one go) ---
  const fetchBooks = async () => {
    if (!supabase) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('category', 'Books'); // No more secondary filters here

    if (error) {
      console.error("❌ VAULT_FETCH_ERROR:", error.message);
    } else {
      console.log("✅ DATA_SYNC_FROM_MARYLAND:", data);
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [supabase]); // Removed activeTab to prevent unnecessary re-fetches

  // --- 🚀 THE UPLINK (Force Cloud Write) ---
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookData = {
      mission_name: formData.title,
      text: `${formData.author} | ${formData.notes}`, 
      category: 'Books',
      priority_level: activeTab, 
    };

    let result;
    if (editItem) {
      result = await supabase
        .from('missions')
        .update(bookData)
        .eq('id', editItem.id)
        .select();
    } else {
      result = await supabase
        .from('missions')
        .insert([bookData])
        .select();
    }

    if (result.error) {
      console.error("❌ UPLINK_CRASHED:", result.error.message);
      alert("⚠️ CLOUD_SYNC_ERROR: " + result.error.message);
    } else {
      console.log("📡 UPLINK_SUCCESS:", result.data);
      closeModal();
      fetchBooks(); // Force global refresh
    }
    setLoading(false);
  };

  const deleteItem = async (id) => {
    if (window.confirm("ERASE_RECORD: Remove from Maryland Hub?")) {
      const { error } = await supabase.from('missions').delete().eq('id', id);
      if (!error) fetchBooks();
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      const [author, ...notesArr] = (item.text || "").split(' | ');
      setFormData({ 
        title: item.mission_name, 
        author: author || '', 
        notes: notesArr.join(' | ') || '' 
      });
    } else {
      setFormData({ title: '', author: '', notes: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditItem(null); };

  // Filter items in the UI (keeps things fast)
  const filteredItems = items.filter(item => item.priority_level === activeTab);

  return (
    <div className="books-wrapper bg-black text-white p-3" style={{ minHeight: '70vh' }}>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
          <div className="d-flex align-items-center">
            <Button variant="outline-info" size="sm" className="me-3" onClick={onBack}>← BACK</Button>
            <h4 className="fw-bold text-info mb-0" style={{ letterSpacing: '1px' }}>BOOK_VAULT.LOG</h4>
          </div>
          <Button variant="info" size="sm" className="fw-bold" onClick={() => openModal()}>+ ADD_ENTRY</Button>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onSelect={(k) => setActiveTab(k)} 
          className="mb-4 custom-tabs border-secondary"
        >
          <Tab eventKey="library" title="LIBRARY" />
          <Tab eventKey="bookmarks" title="BOOKMARKS" />
          <Tab eventKey="best" title="BEST_OF_ALL_TIME" />
        </Tabs>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
        ) : (
          <Row className="g-3">
            {filteredItems.length === 0 && (
              <Col className="text-center py-5 text-muted small italic">Satellite link active. No records in {activeTab}.</Col>
            )}
            {filteredItems.map(book => (
              <Col md={6} lg={4} key={book.id}>
                <Card className="bg-dark border-secondary h-100 win-border shadow-sm">
                  <Card.Body className="p-3" style={{backgroundColor: '#000'}}>
                    <div className="d-flex justify-content-between">
                      <h6 className="text-info fw-bold mb-1">{book.mission_name}</h6>
                      <Badge bg="info" text="dark" style={{fontSize: '0.6rem'}}>{activeTab.toUpperCase()}</Badge>
                    </div>
                    <p className="small text-muted mb-2">{book.text?.split(' | ')[0]}</p>
                    <hr className="border-secondary my-2" />
                    <p className="small text-white opacity-75 mb-3">{book.text?.split(' | ')[1]}</p>
                    <div className="d-flex gap-2 mt-auto">
                      <Button size="xs" variant="outline-primary" style={{fontSize: '0.7rem'}} onClick={() => openModal(book)}>EDIT</Button>
                      <Button size="xs" variant="outline-danger" style={{fontSize: '0.7rem'}} onClick={() => deleteItem(book.id)}>ERASE</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* MODAL */}
        <Modal show={showModal} onHide={closeModal} centered contentClassName="bg-dark text-white border-info win-border">
          <Form onSubmit={handleSave}>
            <Modal.Header closeButton closeVariant="white" className="border-secondary bg-black p-2">
              <Modal.Title className="small fw-bold text-info">{editItem ? 'EDIT_RECORD' : 'NEW_VAULT_ENTRY'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-black">
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">BOOK_TITLE</Form.Label>
                <Form.Control required className="bg-dark text-white border-secondary small" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">AUTHOR</Form.Label>
                <Form.Control className="bg-dark text-white border-secondary small" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">INSIGHTS / NOTES</Form.Label>
                <Form.Control as="textarea" rows={3} className="bg-dark text-white border-secondary small" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-black border-secondary p-2">
              <Button variant="info" type="submit" className="w-100 btn-sm fw-bold" disabled={loading}>
                {loading ? 'SYNCING...' : 'COMMIT_TO_MARYLAND'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Books;