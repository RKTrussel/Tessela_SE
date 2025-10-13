import React, { useMemo, useState } from "react";
import api from "../../api";
import { Row, Col, Form, InputGroup, Button, Alert, Spinner } from "react-bootstrap";
import { fmtMoneyNoDecimals } from "./utils";

export default function DonateForm({ campaignId, onDone, goal, raised}) {
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastPreset, setLastPreset] = useState(null);

  const presets = useMemo(() => {
    const g = Number(goal) || 0;
    if (g <= 0) return [];
    const values = [
      Math.round(g * 0.05),
      Math.round(g * 0.10),
      Math.round(g * 0.25),
      Math.round(g * 0.50),
    ];
    return [...new Set(values.filter(v => Number.isFinite(v) && v > 0))];
  }, [goal]);

  const remaining = useMemo(() => {
    const g = Number(goal) || 0;
    const r = Number(raised) || 0;
    return Math.max(0, g - r);
  }, [goal, raised]);

  const submit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (amount > remaining) {
      setError(`This campaign only needs ₱${fmtMoneyNoDecimals(remaining)} more to reach its goal.`);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await api.post(`/campaigns/${campaignId}/donations`, {
        amount: Number(amount),
        message,
      });
      setResult(data);
      onDone?.();
      setMessage("");
      setAmount(0);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={submit} noValidate>
      <Row className="gy-3">
        <Col xs={12}>
          <Form.Label className="fw-semibold">Amount (PHP)</Form.Label>
          <InputGroup>
            <InputGroup.Text>₱</InputGroup.Text>
            <Form.Control
              type="number"
              min="1"
              step="0.01"
              value={amount || ""}
              onChange={(e) => {
                setAmount(Number(e.target.value));
                setLastPreset(null);
              }}
              required
              placeholder="Enter amount"
            />
          </InputGroup>

          <div className="mt-2 d-flex flex-wrap gap-2">
            {presets.map((p) => (
              <Button 
                key={p}
                variant={lastPreset === p ? "success" : "outline-secondary"}
                onClick={() => {
                  setAmount(prev => (Number(prev) || 0) + p);
                  setLastPreset(p);
                }}
                type="button"
              >
                ₱{fmtMoneyNoDecimals(p)}
              </Button>
            ))}
            {amount > 0 && (
              <Button
                variant="outline-danger"
                type="button"
                onClick={() => {
                  setAmount(0);
                  setLastPreset(null);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </Col>

        <Col xs={12}>
          <Form.Label>Message (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a note with your donation"
          />
        </Col>

        {error && (
          <Col xs={12}>
            <Alert variant="danger" className="mb-0">
              {error}
            </Alert>
          </Col>
        )}
        {result && (
          <Col xs={12}>
            <Alert
              variant={result.payment_status === "paid" ? "success" : "warning"}
              className="mb-0"
            >
              {result.payment_status === "paid" ? (
                <>🎉 Thank you! Ref: <strong>{result.payment_ref}</strong></>
              ) : (
                <>Status: <strong>{result.payment_status}</strong></>
              )}
            </Alert>
          </Col>
        )}

        <Col xs={12} className="d-flex justify-content-center">
          <Button
            type="submit"
            variant="success"
            size="sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing…
              </>
            ) : (
              "Donate Now"
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}