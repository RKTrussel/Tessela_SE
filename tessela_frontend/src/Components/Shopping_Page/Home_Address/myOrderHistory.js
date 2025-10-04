import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Alert,
  Container,
  Modal,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import api from "../../../api";

export default function MyOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // ⭐ Rating Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    setErr(null);
    try {
      const statusMap = {
        all: "All",
        to_ship: "pending",
        to_receive: "processed",
        completed: "delivered",
        cancelled: "cancelled",
      };
      const { data } = await api.get("/orders", {
        params: { status: statusMap[activeTab] || "All" },
      });
      setOrders(data);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      setErr("Unable to load your orders right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleRate = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setComment("");
    setShowModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct || rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/products/${selectedProduct.product_id}/reviews`, {
        rating,
        comment,
      });
      alert("✅ Review submitted successfully!");
      setShowModal(false);
      await fetchOrders(); // Refresh to show new rating immediately
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("❌ Failed to submit review. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCompletionDate = (order) => {
    const created = new Date(order.created_at);
    const completion = new Date(created);
    if (order.status === "pending") completion.setDate(created.getDate() + 3);
    else if (order.status === "processed") completion.setDate(created.getDate() + 5);
    else if (order.status === "delivered") return "Delivered";
    return completion.toLocaleDateString();
  };

  return (
    <Container className="mt-4" style={{ minHeight: "75vh" }}>
      <h4 className="mb-3 fw-semibold">My Orders</h4>

      {/* ✅ Tabs always visible */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        fill
      >
        <Tab eventKey="all" title="All" />
        <Tab eventKey="to_ship" title="To Ship" />
        <Tab eventKey="to_receive" title="To Receive" />
        <Tab eventKey="completed" title="Completed" />
        <Tab eventKey="cancelled" title="Cancelled" />
      </Tabs>

      {/* ✅ Main content area */}
      <div style={{ minHeight: "400px" }}>
        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-5">
            <Spinner animation="border" />
          </div>
        ) : err ? (
          <Alert variant="danger" className="py-2">
            {err}
          </Alert>
        ) : !orders.length ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "48px" }}>📦</div>
            <div>No Orders Found</div>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.order_id} className="mb-4 shadow-sm border-0">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center border-bottom">
                <div className="fw-semibold">Order #{order.order_id}</div>
                <Badge
                  bg={
                    order.status === "delivered"
                      ? "success"
                      : order.status === "processed"
                      ? "info"
                      : order.status === "pending"
                      ? "warning"
                      : order.status === "cancelled"
                      ? "secondary"
                      : "dark"
                  }
                >
                  {order.status.toUpperCase()}
                </Badge>
              </Card.Header>

              <Card.Body className="pt-3">
                {order.items.map((item, idx) => (
                  <Row key={idx} className="align-items-center py-3 border-bottom">
                    {/* Image */}
                    <Col
                      xs={3}
                      md={2}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Link to={`/product/${item.product_id}`}>
                        <img
                          src={
                            item.product?.images?.[0]
                              ? `http://localhost:8000/storage/${item.product.images[0].path}`
                              : "/no-image.png"
                          }
                          alt={item.product?.name}
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            background: "#fff",
                          }}
                        />
                      </Link>
                    </Col>

                    {/* Product Info */}
                    <Col xs={6} md={7}>
                      <div className="fw-semibold">{item.product?.name}</div>
                      <div className="text-muted small">x{item.quantity}</div>

                      {/* ⭐ Show existing rating */}
                      {item.product?.reviews?.length > 0 && (
                        <div className="mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={18}
                              color={
                                i < item.product.reviews[0].rating
                                  ? "#ffc107"
                                  : "#e4e5e9"
                              }
                            />
                          ))}
                          <span className="text-muted small ms-2">
                            You rated this
                          </span>
                        </div>
                      )}
                    </Col>

                    {/* Price */}
                    <Col xs={3} md={3} className="text-end">
                      <div className="fw-bold text-danger">
                        ₱{item.price.toLocaleString()}
                      </div>
                    </Col>
                  </Row>
                ))}

                {/* Order Summary */}
                <Row className="mt-3 align-items-center">
                  <Col md={6}>
                    {order.status === "delivered" ? (
                      <div className="text-success small">
                        ✅ Parcel delivered — you can now rate your products.
                      </div>
                    ) : (
                      <div className="text-muted small">
                        Estimated completion by{" "}
                        <strong>{getCompletionDate(order)}</strong>
                      </div>
                    )}
                  </Col>

                  <Col
                    md={6}
                    className="d-flex justify-content-end align-items-center gap-2"
                  >
                    <div className="fw-bold">
                      Total: <span className="text-danger">₱{order.total}</span>
                    </div>
                  </Col>
                </Row>

                {/* Actions */}
                <Row className="mt-3">
                  <Col className="d-flex justify-content-end gap-2">
                    {order.status === "delivered" ? (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={order.items[0].product?.reviews?.length > 0}
                          onClick={() => handleRate(order.items[0].product)}
                        >
                          {order.items[0].product?.reviews?.length > 0
                            ? "Already Rated"
                            : "Rate"}
                        </Button>
                      </>
                    ) : order.status === "pending" ? (
                      <Badge bg="warning" text="dark">
                        To Ship
                      </Badge>
                    ) : order.status === "processed" ? (
                      <Badge bg="info">To Receive</Badge>
                    ) : order.status === "cancelled" ? (
                      <Badge bg="secondary">Cancelled</Badge>
                    ) : null}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* ⭐ Rating Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setComment("");
          setRating(0);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Rate Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={
                    selectedProduct.images?.[0]
                      ? `http://localhost:8000/storage/${selectedProduct.images[0].path}`
                      : "/no-image.png"
                  }
                  alt={selectedProduct.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <div className="fw-semibold">{selectedProduct.name}</div>
                  <div className="text-muted small">Rate your purchase</div>
                </div>
              </div>

              {/* ⭐ Star Rating */}
              <div className="d-flex mb-3">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <FaStar
                      key={starValue}
                      size={28}
                      style={{ cursor: "pointer", marginRight: 4 }}
                      color={
                        starValue <= (hover || rating)
                          ? "#ffc107"
                          : "#e4e5e9"
                      }
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHover(starValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  );
                })}
              </div>

              {/* 💬 Comment Box */}
              <Form.Group className="mb-3" controlId="reviewComment">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Share your thoughts about this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={submitting}
            onClick={handleSubmitReview}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}