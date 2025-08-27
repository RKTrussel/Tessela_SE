import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Inabel from '../Files/inabel.jpg';
import Ikat from '../Files/ikat.jpg';
import Kalinga from '../Files/kalinga.jpg';

export default function ExploreImage() {
    const { category } = useParams(); // Get category from the URL

    // Map categories to their respective image URLs
    const categoryImages = {
        Inabel,
        Ikat,
        Kalinga
    };

    // Default image if the category is not found
    const imageUrl = categoryImages[category] || "https://your-image-url.com/default.jpg";

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={5} >
                    <Image
                        src={imageUrl} 
                        alt={category ? `${category} Textile` : "Textile"}
                        fluid
                        rounded
                    />
                </Col>
            </Row>
        </Container>
    );
}