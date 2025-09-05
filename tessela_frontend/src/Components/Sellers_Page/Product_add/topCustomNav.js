import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';

export function TopCustomNav({ breadcrumbs }) {
    const navigate = useNavigate();

    return (
        <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm" style={{ minHeight: '5vh' }}>
            <Container fluid className="px-3 d-flex align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <Navbar.Brand>Tessela</Navbar.Brand>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 bg-transparent" style={{ "--bs-breadcrumb-divider": "'>'" }}>
                            {breadcrumbs.map((crumb, index) => (
                                <li
                                    key={index}
                                    className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? "active" : ""}`}
                                    aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
                                >
                                    {crumb.path ? (
                                        <span
                                            onClick={() => navigate(crumb.path)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {crumb.label}
                                        </span>
                                    ) : (
                                        crumb.label
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>
            </Container>
        </Navbar>
    );
}