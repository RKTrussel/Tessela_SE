import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import api from "../../../api";

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        api.get("/products/newest")
        .then(res => setProducts(res.data.products))
        .catch(err => console.error(err));
    }, []);

    return (
        <div style={{ padding: "0 5rem" }}>
            <h1 className="text-center mb-4">New Arrivals</h1>
            <Row>
                {products.map((product) => (
                    <Col key={product.product_id} xs={12} sm={6} md={4} className="mb-4">
                        <Link to={`/product/${product.product_id}`} style={{ textDecoration: "none", color: "inherit" }} >
                            <Card
                            className="h-100 border-0"
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => setHovered(product.product_id)}
                            onMouseLeave={() => setHovered(null)}
                            >
                                <div style={{ height: "25rem", overflow: "hidden" }}>
                                    <Card.Img
                                        variant="top"
                                        src={product.images[0]?.url}
                                        alt={product.name}
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            objectFit: "cover",
                                            transition: "transform 0.4s ease",
                                            borderRadius: "0",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.transform = "scale(1.1)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.transform = "scale(1)")
                                        }
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Title
                                        style={{
                                            textDecoration:
                                            hovered === product.product_id ? "underline" : "none",
                                            transition: "text-decoration 0.2s ease",
                                        }}
                                    >
                                        {product.name}
                                    </Card.Title>
                                    <Card.Text className="text-muted">
                                        ₱{product.price.toLocaleString()}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
}