import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

export default function ExploreImage() {
    return (
        <Container >
            <Row className="justify-content-center">
                <Col md={8}>
                    <Image 
                        src="https://your-image-url.com/inabel.jpg" 
                        alt="Inabel Textile" 
                        fluid 
                        rounded 
                    />
                </Col>
            </Row>
        </Container>
    );
}