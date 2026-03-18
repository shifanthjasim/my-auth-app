import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Tab, Tabs, Spinner, Badge } from 'react-bootstrap';

const Books = ({ onBack, supabase }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('reading'); // Default to what you're reading now
  const [editItem, setEditItem] = useState(null);
  
  // Expanded Form Data
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    notes: '', 
    page: '', 
    review: '' 
  });

  const fetchBooks = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('category', 'Books')
      .order('created_at', { ascending: false });

    if (error) console.error("❌ VAULT_FETCH_ERROR:", error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [supabase]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🧠 DATA PACKING: We combine Author, Page, and Review into the 'text' column using |
    const packedText = `${formData.author} | ${formData.page} | ${formData.review} | ${formData.notes}`;

    const bookData = {
      mission_name: formData.title,
      text: packedText, 
      category: 'Books',
      priority_level: activeTab, 
    };

    let result;
    if (editItem) {
      result = await supabase.from('missions').update(bookData).eq('id', editItem.id).select();
    } else {
      result = await supabase.from('missions').insert([bookData]).select();
    }

    if (result.error) {
      alert("⚠️ UPLINK_FAILED: " + result.error.message);
    } else {
      closeModal();
      fetchBooks();
    }
    setLoading(false);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      // 🧠 DATA UNPACKING
      const [author, page, review, notes] = (item.text || "").split(' | ');
      setFormData({ 
        title: item.mission_name, 
        author: author || '', 
        page: page || '', 
        review: review || '', 
        notes: notes || '' 
      });
    } else {
      setFormData({ title: '', author: '', page: '', review: '', notes: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const deleteItem = async (id) => {
    if (window.confirm("ERASE_RECORD?")) {
      await supabase.from('missions').delete().eq('id', id);
      fetchBooks();
    }
  };

  const filteredItems = items.filter(item => item.priority_level === activeTab);

  return (
    <div className="books-wrapper bg-black text-white p-3" style={{ minHeight: '70vh' }}>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
          <div className="d-flex align-items-center">
            <Button variant="outline-info" size="sm" className="me-3" onClick={onBack}>← BACK</Button>
            <h4 className="fw-bold text-info mb-0">BOOK_VAULT.LOG</h4>
          </div>
          <Button variant="info" size="sm" className="fw-bold" onClick={() => openModal()}>+ ADD_NEW</Button>
        </div>

        {/* 📚 NEW CATEGORIES */}
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 custom-tabs border-secondary">
          <Tab eventKey="reading" title="📖 READING_NOW" />
          <Tab eventKey="library" title="📚 MY_COLLECTION" />
          <Tab eventKey="finished" title="✅ FINISHED" />
          <Tab eventKey="bookmarks" title="📍 BOOKMARKS" />
        </Tabs>

        <Row className="g-3">
          {filteredItems.map(book => {
            const [author, page, review, notes] = (book.text || "").split(' | ');
            return (
              <Col md={6} lg={4} key={book.id}>
                <Card className="bg-dark border-secondary h-100 win-border shadow-sm">
                  <Card.Body className="p-3" style={{ background: '#000' }}>
                    <div className="d-flex justify-content-between">
                      <h6 className="text-info fw-bold mb-1">{book.mission_name}</h6>
                      {page && <Badge bg="warning" text="dark">PG: {page}</Badge>}
                    </div>
                    <p className="small text-white-50 mb-2">BY: {author}</p>
                    
                    {review && (
                      <div className="p-2 mb-2 bg-dark border border-secondary small italic text-warning">
                        " {review} "
                      </div>
                    )}

                    <p className="small text-white opacity-75">{notes}</p>
                    
                    <div className="d-flex gap-2 mt-3 pt-2 border-top border-secondary">
                      <Button size="xs" variant="outline-primary" style={{fontSize: '0.7rem'}} onClick={() => openModal(book)}>UPDATE</Button>
                      <Button size="xs" variant="outline-danger" style={{fontSize: '0.7rem'}} onClick={() => deleteItem(book.id)}>ERASE</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* MODAL WITH NEW FIELDS */}
        <Modal show={showModal} onHide={closeModal} centered contentClassName="bg-dark text-white border-info win-border">
          <Form onSubmit={handleSave}>
            <Modal.Header closeButton closeVariant="white" className="border-secondary bg-black">
              <Modal.Title className="small fw-bold text-info">LOG_BOOK_DATA</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-black">
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">TITLE</Form.Label>
                <Form.Control required className="bg-dark text-white border-secondary small" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label className="small text-muted">AUTHOR</Form.Label>
                    <Form.Control className="bg-dark text-white border-secondary small" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small text-muted">CURRENT_PAGE</Form.Label>
                    <Form.Control type="number" className="bg-dark text-white border-secondary small" value={formData.page} onChange={e => setFormData({...formData, page: e.target.value})} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">MY_REVIEW / RATING</Form.Label>
                <Form.Control className="bg-dark text-white border-secondary small" value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">GENERAL_NOTES</Form.Label>
                <Form.Control as="textarea" rows={3} className="bg-dark text-white border-secondary small" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-black border-secondary">
              <Button variant="info" type="submit" className="w-100 btn-sm fw-bold">UPDATE_VAULT</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Books;