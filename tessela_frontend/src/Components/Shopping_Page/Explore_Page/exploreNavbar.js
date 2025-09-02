import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

function ExploreNavbar({ sort, setSort, productCount }) {
    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    return (
        <Container fluid>
            <Row className="align-items-center">
                <Col xs={10} className="d-flex justify-content-center">
                    <p style={{ marginLeft: '21rem', fontSize: '2rem' }}>{productCount > 0 ? `${productCount} Products` : 'No Products Found'}</p>
                </Col>
                <Col xs={2} className="d-flex justify-content-center">
                    <select className="form-select" style={{ width: '80%' }} value={sort} onChange={handleSortChange}>
                        <option value="default">Sort By</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A-Z</option>
                        <option value="name-desc">Name: Z-A</option>
                    </select>
                </Col>
            </Row>
        </Container>
    );
}

export default ExploreNavbar;
