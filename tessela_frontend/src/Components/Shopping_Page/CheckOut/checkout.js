import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

const php = (n) => {
  const num = Number(n || 0);
  try {
    return num.toLocaleString("en-PH", { style: "currency", currency: "PHP" });
  } catch {
    return `₱${num.toFixed(2)}`;
  }
};

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postal, setPostal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Load items selected from Cart
    const raw = sessionStorage.getItem("checkoutItems");
    if (!raw) {
      navigate("/cart");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        navigate("/cart");
        return;
      }
      setItems(parsed);
    } catch {
      navigate("/cart");
    }
  }, [navigate]);

  const subTotal = useMemo(
    () => items.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0),
    [items]
  );

  // Example shipping rule: ₱0 shipping if subtotal ≥ ₱2,000, else ₱99
  const shippingFee = useMemo(() => (subTotal >= 2000 ? 0 : (items.length ? 99 : 0)), [subTotal, items.length]);
  const grandTotal = useMemo(() => subTotal + shippingFee, [subTotal, shippingFee]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!items.length) {
      setErrorMsg("Your checkout is empty. Please select items from your cart.");
      return;
    }
    if (!fullName || !phone || !address1 || !city || !province || !postal) {
      setErrorMsg("Please complete the required shipping fields.");
      return;
    }

    const payload = {
      items: items.map(i => ({
        product_id: i.id,
        quantity: Number(i.quantity || 1),
        price: Number(i.price || 0),
      })),
      shipping: {
        full_name: fullName,
        email,
        phone,
        address_line1: address1,
        address_line2: address2,
        city,
        province,
        postal_code: postal,
      },
      payment: {
        method: paymentMethod,
      },
      notes,
      amounts: {
        subtotal: subTotal,
        shipping_fee: shippingFee,
        total: grandTotal,
        currency: "PHP",
      },
    };

    try {
      setSubmitting(true);
      // Adjust endpoint to your backend
      // Common patterns you can support server-side:
      //  - POST /orders
      //  - POST /cart/checkout
      const { data } = await api.post("/orders", payload);

      const orderId =
        data?.order_id ??
        data?.id ??
        data?.order?.id ??
        null;

      setSuccessMsg(`Order placed successfully${orderId ? ` (Order #${orderId})` : ""}!`);
      sessionStorage.removeItem("checkoutItems");

      // Optionally, clear selected items on the server:
      // await api.post("/cart/clear-selected", { items: payload.items.map(i => i.product_id) });

      // Navigate to a thank-you route if you have one:
      // navigate(`/orders/${orderId || 'thank-you'}`);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to place order. Please try again.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Checkout</h3>

      {errorMsg && <Alert variant="danger" className="mt-3">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success" className="mt-3">{successMsg}</Alert>}

      <Row className="mt-3">
        <Col lg={8}>
          <Card className="mb-3">
            <Card.Header>Shipping Information</Card.Header>
            <Card.Body>
              <Form onSubmit={handlePlaceOrder}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      required
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Phone *</Form.Label>
                    <Form.Control
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09XXXXXXXXX"
                      required
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Label>Address Line 1 *</Form.Label>
                    <Form.Control
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      placeholder="House/Unit/Street"
                      required
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      placeholder="Subdivision/Barangay"
                    />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>City/Municipality *</Form.Label>
                    <Form.Control
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>Province *</Form.Label>
                    <Form.Control
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>Postal Code *</Form.Label>
                    <Form.Control
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Label>Order Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Landmark, delivery instructions, etc."
                    />
                  </Col>
                </Row>

                <Card className="mt-3">
                  <Card.Header>Payment</Card.Header>
                  <Card.Body>
                    <Form.Check
                      type="radio"
                      label="Cash on Delivery (COD)"
                      name="payment"
                      id="payment-cod"
                      className="mb-2"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                  </Card.Body>
                </Card>

                <div className="d-flex gap-2 mt-3">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/cart")}
                    disabled={submitting}
                  >
                    Edit Cart
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting || items.length === 0}
                  >
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Placing Order...
                      </>
                    ) : (
                      `Place Order (${php(grandTotal)})`
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-3">
            <Card.Header>Order Summary</Card.Header>
            <ListGroup variant="flush">
              {items.map(i => (
                <ListGroup.Item key={i.id} className="d-flex justify-content-between">
                  <div style={{maxWidth: '70%'}}>
                    <div className="fw-semibold">{i.name}</div>
                    <div className="text-muted small">Qty: {i.quantity}</div>
                  </div>
                  <div className="text-end">
                    {php((Number(i.price)||0) * (Number(i.quantity)||0))}
                  </div>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Subtotal</span>
                <strong>{php(subTotal)}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Shipping</span>
                <strong>{shippingFee === 0 ? "FREE" : php(shippingFee)}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Total</span>
                <strong>{php(grandTotal)}</strong>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}