import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';

function ExploreStory() {
    const { category } = useParams(); // Get category from the URL

    // Dynamically set the title and description based on the category
    const categoryInfo = {
        Inabel: {
            title: "Welcome to the Inabel Page",
            description: "Inabel is a traditional handwoven textile, known for its intricate patterns and cultural significance in the Philippines."
        },
        Ikat: {
            title: "Welcome to the Ikat Page",
            description: "Ikat textiles are known for their beautiful, dyed patterns that create a unique and intricate design."
        },
        Kalinga: {
            title: "Welcome to the Kalinga Page",
            description: "Kalinga textiles represent the rich heritage and craftsmanship of the Kalinga people, known for their vibrant colors and designs."
        },
    };

    const { title, description } = categoryInfo[category] 

    return (
        <Container className="mt-1">
            <Row className="justify-content-center w-100">
                <Col md={12}>
                    <h1 className="card-title">{title}</h1>
                    <p className="card-text">{description}</p>
                    <Button className="btn btn-primary">Learn More</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ExploreStory;