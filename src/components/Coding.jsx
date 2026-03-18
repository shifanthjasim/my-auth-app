import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Accordion, Tab, Nav } from 'react-bootstrap';

const Coding = ({ onBack }) => {
  return (
    <div className="page-view-wrapper" style={{ paddingTop: '100px' }}>
      <Container className="py-5 text-white">
        <div className="d-flex align-items-center mb-5">
          <Button variant="outline-info" className="me-4 rounded-circle back-btn" onClick={onBack}>←</Button>
          <h2 className="display-4 fw-bold name-gradient mb-0">Coding Hub</h2>
        </div>

        <Tab.Container id="coding-tabs" defaultActiveKey="react">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column custom-side-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="react" className="mb-2">React.js</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="python">Python</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            
            <Col sm={9}>
              <Tab.Content>
                {/* REACT TUTORIAL SECTION */}
                <Tab.Pane eventKey="react">
                  <h3 className="text-info mb-4">React Fundamentals</h3>
                  <Accordion defaultActiveKey="0" flush className="coding-accordion">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>1. What is a Component?</Accordion.Header>
                      <Accordion.Body>
                        Components are the building blocks of a React app. They are essentially JavaScript functions that return HTML (via JSX).
                        <pre className="code-block mt-2">
{`function Welcome() {
  return <h1>Hello, Shifanth!</h1>;
}`}
                        </pre>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>2. Handling State (useState)</Accordion.Header>
                      <Accordion.Body>
                        State allows components to "remember" things. 
                        <pre className="code-block mt-2">
{`const [count, setCount] = useState(0);`}
                        </pre>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Tab.Pane>

                {/* PYTHON TUTORIAL SECTION */}
                <Tab.Pane eventKey="python">
                  <h3 className="text-warning mb-4">Python Essentials</h3>
                  <Accordion defaultActiveKey="0" flush className="coding-accordion">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>1. Variables & Data Types</Accordion.Header>
                      <Accordion.Body>
                        Python is dynamically typed. You don't need to declare types.
                        <pre className="code-block mt-2">
{`name = "Shifanth"
age = 25
is_engineer = True`}
                        </pre>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>2. Defining Functions</Accordion.Header>
                      <Accordion.Body>
                        Use the <code>def</code> keyword to create reusable logic.
                        <pre className="code-block mt-2">
{`def greet(user):
    return f"Hello, {user}!"`}
                        </pre>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default Coding;