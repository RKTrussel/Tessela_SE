import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../api";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";

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

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ✅ Load checkout items from sessionStorage
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

  // ✅ Fetch addresses from API
  useEffect(() => {
    api.get("/addresses")
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
    payment: {
      method: paymentMethod,
    },
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
      setSuccessMsg(`Order placed successfully${orderId ? ` (Order #${orderId})` : ""}!`);

      // ✅ clear checkout session
      sessionStorage.removeItem("checkoutItems");

      // redirect to cart after 2 seconds
      setTimeout(() => {
        navigate("/shoppingBag");
      }, 2000);

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
        {/* Shipping + Payment */}
        <Col lg={8}>
          <Card className="mb-3">
            <Card.Header>Shipping Address</Card.Header>
            <Card.Body>
              {selectedAddress ? (
                <>
                  <p><strong>{selectedAddress.name}</strong></p>
                  <p>{selectedAddress.phone}</p>
                  <p>{selectedAddress.email}</p>
                  <p>
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
                  <Button
                    variant="link"
                    onClick={() => navigate("/account")}
                  >
                    Manage Addresses
                  </Button>
                </>
              ) : (
                <p>No address found. <Link to="/account">Add one here</Link></p>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
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
              onClick={() => navigate("/shoppingBag")}
              disabled={submitting}
            >
              Edit Cart
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={submitting || items.length === 0}
              onClick={handlePlaceOrder}
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
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="mb-3">
            <Card.Header>Order Summary</Card.Header>
            <ListGroup variant="flush">
              {items.map((i) => (
                <ListGroup.Item key={i.id} className="d-flex justify-content-between">
                  <div style={{ maxWidth: "70%" }}>
                    <div className="fw-semibold">{i.name}</div>
                    <div className="text-muted small">Qty: {i.quantity}</div>
                  </div>
                  <div className="text-end">
                    {php((Number(i.price) || 0) * (Number(i.quantity) || 0))}
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