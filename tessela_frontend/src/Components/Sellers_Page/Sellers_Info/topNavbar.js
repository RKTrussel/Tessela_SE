import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function TopNavbar() {
    return (
        <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm" style={{ minHeight: '5vh' }}>
            <Container fluid className="px-3">
                <Navbar.Brand >Tessela</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default TopNavbar;