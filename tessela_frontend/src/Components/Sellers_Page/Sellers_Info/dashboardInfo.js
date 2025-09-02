import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function SellerDashboard() {
    const navigate = useNavigate();

    return (
        <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa' }}>

        {/* To Do List Summary */}
        <div className="p-4 bg-white rounded shadow-sm mb-5">
            <h5 className="mb-4 text-muted text-uppercase">To Do List</h5>
            <Row className="text-center">
                <Col md={6}>
                   <Button
                        variant="outline-light"
                        className="w-100 py-3 rounded"
                        onClick={() => navigate("/dashboard/myOrder", { state: { status: "pending" } })}
                        >
                        <h4 className="text-primary mb-1">0</h4>
                        <small className="text-muted">To-Process Shipment</small>
                    </Button>
                </Col>
                <Col md={6}>
                    <Button
                    variant="outline-light"
                    className="w-100 py-3 rounded"
                    onClick={() => navigate("/dashboard/myOrder", { state: { status: "processed" } })}
                    >
                    <h4 className="text-success mb-1">0</h4>
                    <small className="text-muted">Processed Shipment</small>
                    </Button>
                </Col>
            </Row>
        </div>

        </Container>
    );
}

export default SellerDashboard;