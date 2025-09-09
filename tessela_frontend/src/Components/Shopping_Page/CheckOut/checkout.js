import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../api";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";

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
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ✅ Load checkout items
  useEffect(() => {
    const raw = sessionStorage.getItem("checkoutItems");
    if (!raw) {
      navigate("/shoppingBag");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        navigate("/shoppingBag");
        return;
      }
      setItems(parsed);
    } catch {
      navigate("/shoppingBag");
    }
  }, [navigate]);

  // ✅ Fetch addresses
  useEffect(() => {
    api
      .get("/addresses")
      .then((res) => {
        setAddresses(res.data);
        const def = res.data.find((a) => a.is_default) || res.data[0];
        setSelectedAddress(def || null);
      })
      .catch((err) => console.error("Failed to load addresses", err));
  }, []);

  const subTotal = useMemo(
    () => items.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0),
    [items]
  );
  const shippingFee = useMemo(
    () => (subTotal >= 2000 ? 0 : items.length ? 99 : 0),
    [subTotal, items.length]
  );
  const grandTotal = useMemo(() => subTotal + shippingFee, [subTotal, shippingFee]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!items.length) {
      setErrorMsg("Your checkout is empty. Please select items from your cart.");
      return;
    }
    if (!selectedAddress) {
      setErrorMsg("Please add or select a shipping address.");
      return;
    }

    const payload = {
      items: items.map((i) => ({
        product_id: i.product_id ?? i.id,
        quantity: Number(i.quantity || 1),
        price: Number(i.price || 0),
      })),
      shipping: {
        full_name: selectedAddress.name,
        email: selectedAddress.email,
        phone: selectedAddress.phone,
        address_line1: selectedAddress.address_line1,
        city: selectedAddress.city,
        province: selectedAddress.province,
        postal_code: selectedAddress.postal_code,
      },
      payment: { method: paymentMethod },
      amounts: {
        subtotal: subTotal,
        shipping_fee: shippingFee,
        total: grandTotal,
      },
    };

    try {
      setSubmitting(true);
      const { data } = await api.post("/orders", payload);
      const orderId = data?.order_id ?? data?.id ?? data?.order?.id ?? null;
      setSuccessMsg(
        `🎉 Order placed successfully${orderId ? ` (Order #${orderId})` : ""}!`
      );
      sessionStorage.removeItem("checkoutItems");

      setTimeout(() => navigate("/shoppingBag"), 2000);
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
    <Container className="mt-4 mb-5">
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Row className="mt-3 g-4">
        {/* Shipping + Payment */}
        <Col lg={8}>
          {/* Shipping */}
          <Card className="mb-4 shadow-sm rounded-3">
            <Card.Header className="fw-semibold">📦 Shipping Address</Card.Header>
            <Card.Body>
              {selectedAddress ? (
                <>
                  <p className="mb-1 fw-bold">{selectedAddress.name}</p>
                  <p className="mb-1">{selectedAddress.phone}</p>
                  <p className="mb-1">{selectedAddress.email}</p>
                  <p className="mb-3 text-muted">
                    {selectedAddress.address_line1}, {selectedAddress.city},{" "}
                    {selectedAddress.province}, {selectedAddress.postal_code}
                  </p>

                  <Form.Select
                    className="mb-3"
                    value={selectedAddress.address_id}
                    onChange={(e) =>
                      setSelectedAddress(
                        addresses.find((a) => a.address_id === Number(e.target.value))
                      )
                    }
                  >
                    {addresses.map((a) => (
                      <option key={a.address_id} value={a.address_id}>
                        {a.name} – {a.city}, {a.province}
                        {a.is_default ? " (Default)" : ""}
                      </option>
                    ))}
                  </Form.Select>

                  <Button variant="outline-primary" size="sm" onClick={() => navigate("/account")}>
                    Manage Addresses
                  </Button>
                </>
              ) : (
                <p>
                  No address found. <Link to="/account">Add one here</Link>
                </p>
              )}
            </Card.Body>
          </Card>

          {/* Payment */}
          <Card className="mb-4 shadow-sm rounded-3">
            <Card.Header className="fw-semibold">💳 Payment Method</Card.Header>
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

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-4">
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => navigate("/shoppingBag")}
              disabled={submitting}
            >
              🛒 Edit Cart
            </Button>
            <Button
              variant="success"
              size="lg"
              className="px-4 shadow-sm"
              disabled={submitting || items.length === 0}
              onClick={handlePlaceOrder}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Placing Order...
                </>
              ) : (
                `✅ Checkout (${php(grandTotal)})`
              )}
            </Button>
          </div>
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="shadow-sm rounded-3">
            <Card.Header className="fw-semibold">🧾 Order Summary</Card.Header>
            <ListGroup variant="flush">
              {items.map((i) => (
                <ListGroup.Item
                  key={i.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div style={{ maxWidth: "70%" }}>
                    <div className="fw-semibold">{i.name}</div>
                    <div className="text-muted small">Qty: {i.quantity}</div>
                  </div>
                  <div className="fw-bold">{php((i.price || 0) * (i.quantity || 0))}</div>
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
              <ListGroup.Item className="d-flex justify-content-between bg-light">
                <span className="fw-semibold">Total</span>
                <span className="fw-bold text-success">{php(grandTotal)}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}