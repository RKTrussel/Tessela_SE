import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ProductsFilters({
  search,
  onChange,
  onReset,
  disabled,
}) {
  return (
    <Row className="mb-3 g-2 align-items-center">
      <Col md={3}>
        <Form.Control
          placeholder="Search Product Name, SKU, Item ID"
          value={search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col md={9} className="d-flex justify-content-end">
        <Button
          variant="outline-secondary"
          onClick={onReset}
          disabled={disabled}
        >
          Reset
        </Button>
      </Col>
    </Row>
  );
}