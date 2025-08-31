import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ProductsFilters({
  search,
  weaving_type,
  onChange,
  onApply,
  onReset,
  disabled,
}) {
  return (
    <Row className="mb-3 g-2">
      <Col md={3}>
        <Form.Control
          placeholder="Search Product Name, SKU, Item ID"
          value={search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col md={2}>
        <Form.Control
          placeholder="Search by Weaving type"
          value={weaving_type}
          onChange={(e) => onChange({ weaving_type: e.target.value })}
        />
      </Col>
      <Col md="auto" className="d-flex gap-2">
        <Button variant="outline-secondary" onClick={onApply} disabled={disabled}>
          Apply
        </Button>
        <Button variant="outline-secondary" onClick={onReset} disabled={disabled}>
          Reset
        </Button>
      </Col>
    </Row>
  );
}