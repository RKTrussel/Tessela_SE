import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useParams, Link } from 'react-router-dom';
import api from '../../../api';

function ExploreArea({ sort }) { // Receive sort from parent
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = { category };

                // Map sort state to backend expected format
                if (sort === 'price-asc') params.sort = 'price_asc';
                if (sort === 'price-desc') params.sort = 'price_desc';
                if (sort === 'name-asc') params.sort = 'name_asc';
                if (sort === 'name-desc') params.sort = 'name_desc';

                const response = await api.get('/products', { params });
                setProducts(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, sort]);

    if (loading) return <div>Loading...</div>;

    return (
        <Container fluid>
            <Row className="mb-4 gx-3">
                <Col xs={11}>
                    <Row className="gx-3 gy-3">
                        {products.map(product => (
                            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card h-100" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
                                        <img
                                            src={product.images[0]?.url}
                                            className="card-img-top mb-3"
                                            alt={product.name}
                                            style={{ objectFit: 'cover', height: '15rem', cursor: 'pointer', margin: '0 auto' }}
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