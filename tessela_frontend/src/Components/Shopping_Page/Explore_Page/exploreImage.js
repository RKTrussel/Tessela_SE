import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Inabel from '../Files/inabel.jpg';
import Ikat from '../Files/ikat.jpg';
import Kalinga from '../Files/kalinga.jpg';

export default function ExploreImage() {
    const { weavingType } = useParams();

    // Map categories to their respective image URLs
    const weavingTypeImages = {
        Inabel,
        Ikat,
        Kalinga
    };

    // Default image if the weaving_type is not found
    const imageUrl = weavingTypeImages[weavingType] || "https://your-image-url.com/default.jpg";

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={5} >
                    <Image
                        src={imageUrl} 
                        alt={weavingType ? `${weavingType} Textile` : "Textile"}
                        fluid
                        rounded
                    />
                </Col>
            </Row>
        </Container>
    );
}