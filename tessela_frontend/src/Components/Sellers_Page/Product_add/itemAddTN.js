import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function ItemAddTN() {
    return (
        <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm" style={{ minHeight: '5vh' }}>
            <Container fluid className="px-3">
                <Navbar.Brand >Tessela</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default ItemAddTN;