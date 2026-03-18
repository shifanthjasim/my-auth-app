import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Tab, Tabs } from 'react-bootstrap';

const Books = ({ onBack }) => {
  const [library, setLibrary] = useState(() => JSON.parse(localStorage.getItem('sj_library')) || []);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('sj_bookmarks')) || []);
  const [bestBooks, setBestBooks] = useState(() => JSON.parse(localStorage.getItem('sj_best')) || []);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', category: '', page: '', notes: '' });

  useEffect(() => {
    localStorage.setItem('sj_library', JSON.stringify(library));
    localStorage.setItem('sj_bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('sj_best', JSON.stringify(bestBooks));
  }, [library, bookmarks, bestBooks]);

  const handleSave = (e) => {
    e.preventDefault();
    if (activeTab === 'library') {
      editItem ? setLibrary(library.map(b => b.id === editItem.id ? {...formData, id: b.id} : b))
               : setLibrary([...library, { ...formData, id: Date.now() }]);
    } else if (activeTab === 'bookmarks') {
      editItem ? setBookmarks(bookmarks.map(b => b.id === editItem.id ? {...formData, id: b.id} : b))
               : setBookmarks([...bookmarks, { ...formData, id: Date.now() }]);
    } else {
      editItem ? setBestBooks(bestBooks.map(b => b.id === editItem.id ? {...formData, id: b.id} : b))
               : setBestBooks([...bestBooks, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  const deleteItem = (id, type) => {
    if (window.confirm("Remove this entry?")) {
      if (type === 'library') setLibrary(library.filter(b => b.id !== id));
      if (type === 'bookmarks') setBookmarks(bookmarks.filter(b => b.id !== id));
      if (type === 'best') setBestBooks(bestBooks.filter(b => b.id !== id));
    }
  };

  const openModal = (item = null) => {
    if (item) { setEditItem(item); setFormData(item); } 
    else { setFormData({ title: '', author: '', category: '', page: '', notes: '' }); }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditItem(null); };

  return (
    <Container className="py-5 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div className="d-flex align-items-center">
          <Button variant="outline-info" className="me-4 rounded-circle back-btn" onClick={onBack}>←</Button>
          <h2 className="display-4 fw-bold name-gradient mb-0">Book Vault</h2>
        </div>
        <Button variant="info" className="rounded-pill px-4" onClick={() => openModal()}>+ Add Entry</Button>
      </div>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 custom-tabs">
        <Tab eventKey="library" title="Library">
          <Row className="g-4 mt-2">
            {library.map(book => (
              <Col md={4} key={book.id}>
                <Card className="book-card-alt">
                  <Card.Body>
                    <div className="category-tag">{book.category}</div>
                    <Card.Title>{book.title}</Card.Title>
                    <div className="d-flex gap-2 mt-3">
                      <Button size="sm" variant="outline-primary" onClick={() => openModal(book)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => deleteItem(book.id, 'library')}>Remove</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
        {/* ... Similar structure for other tabs ... */}
      </Tabs>

      <Modal show={showModal} onHide={closeModal} centered contentClassName="bg-dark text-white border-secondary">
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control required className="bg-transparent text-white border-secondary" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </Form.Group>
            {/* ... other form groups ... */}
          </Modal.Body>
          <Modal.Footer><Button variant="info" type="submit">Save</Button></Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Books;