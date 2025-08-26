import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';

export default function MyProducts() {
  const [filter, setFilter] = useState({ search: "", category: "", label: "" });
  const navigate = useNavigate();

  return (
    <Container fluid className="p-3">
      <h4 className="mb-3">My Products</h4>

      {/* Toolbar */}
      <Row className="align-items-center my-3">
        <Col className="text-end">
          <Button variant="danger" onClick={() => navigate('/dashboard/myProduct')}>+ Add a New Product</Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            placeholder="Search Product Name, SKU, Item ID"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            placeholder="Search by category"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          />
        </Col>
        <Col md="auto" className="d-flex gap-2">
          <Button variant="outline-secondary">Apply</Button>
          <Button variant="outline-secondary">Reset</Button>
        </Col>
      </Row>

      {/* Products Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>  
              Product(s)
            </th>
            <th>Sales</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Content Quality</th>
          </tr>
        </thead>
        <tbody>
          {/* Empty state */}
          <tr>
            <td colSpan={6} className="text-center py-5 text-muted">
              <div>
                <div style={{ fontSize: "48px" }}>📦</div>
                No Product Found
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}
