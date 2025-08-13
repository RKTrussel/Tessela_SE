import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function inabelStory() {
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title">Welcome to Inabel Page</h1>
                            <p className="card-text">
                                This is a simple React component styled with Bootstrap.
                            </p>
                            <Button className="btn btn-primary">Learn More</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default inabelStory;