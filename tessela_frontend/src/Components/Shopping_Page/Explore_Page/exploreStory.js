import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom';

function ExploreStory() {
    const { weavingType } = useParams();

    const weavingTypeInfo = {
        Inabel: {
            description: "Inabel is a traditional handwoven fabric from the Ilocos region, known for its softness, durability, and intricate patterns. Made from cotton and crafted on hardwood pedal looms, inabel showcases designs like binakul, pinilian, and ikat, each reflecting the artistry and heritage of Ilocano weavers."
        },
        Ikat: {
            description: "Ikat (pronounced: E–cot) is a method for coloring fabric in patterns by resist dyeing. The pattern is not applied to the surface of a finished fabric, nor is it woven into the fabric structurally. Instead, parts of the yarns for the warp and/or weft are protected with a resist before dyeing. The dye then colors the yarn everywhere except under the binding. After dyeing, the bindings are removed and the pattern appears undyed on a colored ground. When dyeing is complete, the yarn is then woven into fabric, often in a relatively simple structure and at a density that highlights the warp."
        },
        Kalinga: {
            description: "Kalinga weaving, centered in Mabilong, Lubuagan, is a thriving tradition of backstrap loom weaving. Known for its bold red and black stripes, symbolic motifs, and beadwork, Kalinga textiles reflect bravery, the earth, and fertility preserving cultural meanings passed down through generations."
        },
    };

    const { description } = weavingTypeInfo[weavingType] 

    return (
        <Container className="mt-1">
            <Row className="justify-content-center w-100">
                <Col md={12}>
                    <h1 className="card-title">Fun Fact</h1>
                    <p className="card-text">{description}</p>
                </Col>
            </Row>
        </Container>
    );
}

export default ExploreStory;