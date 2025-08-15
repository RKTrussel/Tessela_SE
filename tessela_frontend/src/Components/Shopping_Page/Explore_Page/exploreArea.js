import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

function ExploreArea() {
    // Sample data for demonstration
    const products = [
        { id: 1, name: "Inabel Blanket", price: 1200, image: "/images/inabel1.jpg" },
        { id: 2, name: "Inabel Scarf", price: 800, image: "/images/inabel2.jpg" },
        { id: 3, name: "Inabel Bag", price: 1500, image: "/images/inabel3.jpg" },
        { id: 4, name: "Inabel Bag", price: 1500, image: "/images/inabel3.jpg" }
    ];

    return (
        <Container fluid>
            <Row className="mb-4 gx-3">
                <Col xs={1} className="d-flex justify-content-center align-items-start" style={{ position: 'sticky', top: 0, zIndex: 2, background: 'white' }}>
                    <p> Categories </p>
                </Col>
                <Col xs={11}>
                    <Row className="gx-3 gy-3">
                        {products.map(product => (
                            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card h-100" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
                                        <img
                                            src={product.image}
                                            className="card-img-top mb-3"
                                            alt={product.name}
                                            style={{ objectFit: 'cover', width: '80%', height: '250px', cursor: 'pointer', margin: '0 auto' }}
                                        />
                                        <div className="card-body" style={{ flex: 1 }}>
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">₱{product.price}</p>
                                        </div>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default ExploreArea;