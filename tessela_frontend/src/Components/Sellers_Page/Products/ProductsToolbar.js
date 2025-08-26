import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function ProductsToolbar({ onAdd }) {
  return (
    <Row className="align-items-center my-3">
      <Col className="text-end">
        <Button variant="danger" onClick={onAdd}>
          + Add a New Product
        </Button>
      </Col>
    </Row>
  );
}