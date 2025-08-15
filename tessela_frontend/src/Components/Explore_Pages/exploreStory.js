import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function ExploreStory() {
    return (
        <Container className="mt-1">
            <Row className="justify-content-center w-100">
                <Col md={12}>
                    <h1 className="card-title">Welcome to Inabel Page</h1>
                    <p className="card-text">
                        This is a simple React component styled with Bootstrap.
                    </p>
                    <Button className="btn btn-primary">Learn More</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ExploreStory;