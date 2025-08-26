import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';

export function TopCustomNav() {
    const navigate = useNavigate();

    return (
        <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm" style={{ minHeight: '5vh' }}>
            <Container fluid className="px-3 d-flex align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <Navbar.Brand>Tessela</Navbar.Brand>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 bg-transparent" style={{ "--bs-breadcrumb-divider": "'>'" }}>
                            <li className="breadcrumb-item"><span onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>Home</span></li>
                            <li className="breadcrumb-item"><span onClick={() => navigate('/dashboard/myProduct')} style={{cursor: 'pointer'}}>My Products</span></li>
                            <li className="breadcrumb-item active" aria-current="page">Add a New Product</li>
                        </ol>
                    </nav>
                </div>
            </Container>
        </Navbar>
    );
}

export function TopCustomNav2() {
    const navigate = useNavigate();

    return (
        <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm" style={{ minHeight: '5vh' }}>
            <Container fluid className="px-3 d-flex align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <Navbar.Brand>Tessela</Navbar.Brand>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 bg-transparent" style={{ "--bs-breadcrumb-divider": "'>'" }}>
                            <li className="breadcrumb-item"><span onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>Home</span></li>
                            <li className="breadcrumb-item active" aria-current="page">My Products</li>
                        </ol>
                    </nav>
                </div>
            </Container>
        </Navbar>
    );
}

export function TopCustomNav3() {
    const navigate = useNavigate();

    return (
        <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm" style={{ minHeight: '5vh' }}>
            <Container fluid className="px-3 d-flex align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <Navbar.Brand>Tessela</Navbar.Brand>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 bg-transparent" style={{ "--bs-breadcrumb-divider": "'>'" }}>
                            <li className="breadcrumb-item"><span onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>Home</span></li>
                            <li className="breadcrumb-item active" aria-current="page">My Orders</li>
                        </ol>
                    </nav>
                </div>
            </Container>
        </Navbar>
    );
}