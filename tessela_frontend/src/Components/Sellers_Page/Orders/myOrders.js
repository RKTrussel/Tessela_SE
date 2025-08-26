import { useState } from 'react';
import { Container, Row, Col, Tab, Nav, Button, Table } from 'react-bootstrap';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("To Ship");
  const [shippingPriority, setShippingPriority] = useState("All");
  const [orderId, setOrderId] = useState("");

  const handleSearch = () => {
    // logic to fetch or filter orders based on search criteria
  };

  return (
    <Container fluid>
      {/* Title */}
      <Row className="my-4">
        <Col>
          <h4>My Orders</h4>
        </Col>
      </Row>

      {/* Order Status Tabs */}
      <Row className="mb-4">
        <Col>
          <Tab.Container id="order-tabs" activeKey={status} onSelect={(k) => setStatus(k)}>
            <Nav variant="pills" className="gap-2">
              <Nav.Item>
                <Nav.Link eventKey="To Ship" className={`text-${status === 'To Ship' ? 'outline-secondary' : 'secondary'}`}>
                  To Ship
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Processed" className={`text-${status === 'Processed' ? 'outline-secondary' : 'secondary'}`}>
                  Processed
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </Col>
      </Row>

      {/* Filters (Shipping Priority, Order ID, Buttons) */}
      <Row className="mb-4">
        <Col md={4}>
          <select 
            className="form-select"
            value={shippingPriority} 
            onChange={(e) => setShippingPriority(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Ship By Today">Ship By Today</option>
            <option value="Ship By Tomorrow">Ship By Tomorrow</option>
          </select>
        </Col>
        <Col md={4}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Input order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </Col>
        <Col md={4} className="d-flex flex-row gap-2 justify-content-end">
          <Button variant="primary" onClick={handleSearch}>Apply</Button>
          <Button variant="outline-secondary" onClick={() => { setShippingPriority("All"); setOrderId(""); }}>Reset</Button>
        </Col>
      </Row>

      {/* Orders Table */}
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            {/* Table Headers */}
            <thead>
              <tr>
                <th>Product(s)</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Countdown</th>
                <th>Shipping Channel</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <p>No Orders Found</p>
                    <Button variant="outline-primary" onClick={() => setOrders([])}>Please Reload</Button>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.product}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.status}</td>
                    <td>{order.countdown}</td>
                    <td>{order.shippingChannel}</td>
                    <td><Button variant="outline-info">Action</Button></td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default MyOrders;