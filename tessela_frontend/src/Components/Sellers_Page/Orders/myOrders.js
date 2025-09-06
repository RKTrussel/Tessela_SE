import { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav, Button, Table } from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import api from '../../../api';

const MyOrders = () => {
  const location = useLocation();
  const initialStatus = location.state?.status || "pending";
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState(initialStatus);
  const [shippingPriority, setShippingPriority] = useState("All");
  const [orderId, setOrderId] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders", {
        params: {
          status: status !== "All" ? status : undefined,
          order_id: orderId || undefined,
          
          priority: shippingPriority !== "All" ? shippingPriority : undefined,
        },
      });
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [status, shippingPriority, orderId]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); 
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <Container fluid>
      <Row className="my-4">
        <Col>
          <h4>Orders (Admin)</h4>
        </Col>
      </Row>

      {/* Tabs */}
      <Row className="mb-4">
        <Col>
          <Tab.Container id="order-tabs" activeKey={status} onSelect={(k) => setStatus(k)}>
            <Nav variant="pills" className="gap-2">
              <Nav.Item>
                <Nav.Link eventKey="pending">To Ship</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="processed">Processed</Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <input
            type="text"
            className="form-control"
            placeholder="Input order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </Col>
        <Col md={8} className="d-flex flex-row gap-2 justify-content-end">
          <Button variant="outline-secondary" onClick={() => { setShippingPriority("All"); setOrderId(""); }}>Reset</Button>
        </Col>
      </Row>

      {/* Orders Table */}
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product(s)</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <div>
                      <div style={{ fontSize: "48px" }}>📦</div>
                      No Orders Found
                      <div className="mt-2">
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>
                      {order.items?.map((i) => (
                        <div key={i.product_id}>
                          {i.product?.name} × {i.quantity}
                        </div>
                      ))}
                    </td>
                    <td>₱{order.total}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      {order.status !== "processed" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleUpdateStatus(order.order_id, "processed")}
                        >
                          Mark as Processed
                        </Button>
                      )}
                    </td>
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
