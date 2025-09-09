import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import ProgressBar from "react-bootstrap/ProgressBar";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";

export default function CampaignDonate({ campaignId }) {
  const [campaign, setCampaign] = useState(null);
  const [progress, setProgress] = useState({ raised: 0, goal: 0 });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const ctrl = new AbortController();
      const [cRes, dRes] = await Promise.all([
        api.get(`/campaigns/${campaignId}`, { signal: ctrl.signal }),
        api.get(`/campaigns/${campaignId}/donations`, { signal: ctrl.signal }),
      ]);

      const c = Array.isArray(cRes.data)
        ? cRes.data.find((x) => x.campaign_id === campaignId)
        : cRes.data;

      setCampaign(c || null);
      setProgress(dRes.data?.progress || { raised: 0, goal: c?.goalAmount || 0 });
      setDonations(dRes.data?.donations || []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const pct = useMemo(() => {
    const { raised, goal } = progress;
    if (!goal || goal <= 0) return 0;
    return Math.min(100, Math.round((Number(raised) / Number(goal)) * 100));
  }, [progress]);

  if (loading) {
    return (
      <Container className="py-4">
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Loading…</span>
        </div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger"><strong>Oops!</strong> {error}</Alert>
      </Container>
    );
  }
  if (!campaign) {
    return (
      <Container className="py-4">
        <Alert variant="secondary">Campaign not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 1000 }}>
      <Row className="mb-3">
        <Col>
          <h1 className="h3 mb-1">{campaign.name}</h1>
          <div className="text-muted">
            From {fmtDate(campaign.start_date)} to {fmtDate(campaign.end_date)} ·{" "}
            <Badge bg={statusColor(campaign.status)} className="text-uppercase">
              {campaign.status}
            </Badge>
          </div>
        </Col>
        <Col xs="auto">
            <Button variant="secondary" onClick={() => navigate(-1)}>
                ← Back
            </Button>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Text className="mb-3">{campaign.description}</Card.Text>

              <div className="mb-2">
                <ProgressBar now={pct} animated={pct > 0 && pct < 100} />
              </div>
              <div className="d-flex justify-content-between small mb-3">
                <span>₱{fmtMoney(progress.raised)} raised</span>
                <span className="text-muted">{pct}% funded</span>
                <span>Goal: ₱{fmtMoney(campaign.goalAmount)}</span>
              </div>

              <DonateForm campaignId={campaignId} onDone={fetchAll} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="h5">Recent Donations</Card.Title>
              <RecentDonations donations={donations} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

/* ---------- Donate Form ---------- */
/* ---------- Donate Form ---------- */
function DonateForm({ campaignId, onDone }) {
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastPreset, setLastPreset] = useState(null);

  const presets = [50, 100, 500, 1000];

  const submit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
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
              onChange={(e) => setAmount(Number(e.target.value))}
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
                  setAmount((prev) => Number(prev) + p);
                  setLastPreset(p);
                }}
                type="button"
              >
                +₱{fmtMoney(p)}
              </Button>
            ))}
            {amount > 0 && (
              <Button
                variant="outline-danger"
                type="button"
                onClick={() => {
                  setAmount(0);
                  setLastPreset(null); // ✅ proper null
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

        <Col xs={12} className="d-grid">
          <Button type="submit" variant="success" disabled={loading}>
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

/* ---------- Recent Donations ---------- */
function RecentDonations({ donations }) {
  if (!donations?.length) {
    return <div className="text-muted fst-italic">No donations yet.</div>;
  }
  return (
    <ListGroup variant="flush" className="mt-2">
      {donations.map((d) => (
        <ListGroup.Item key={d.donation_id} className="py-2">
          <div className="d-flex justify-content-between">
            <div>
              <span className="fw-bold text-success">₱{fmtMoney(d.amount)}</span>
              <div className="text-muted small">{fmtDate(d.created_at)}</div>
              {d.message && (
                <div className="mt-1 fst-italic text-dark">“{d.message}”</div>
              )}
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

/* ---------- utils ---------- */
function statusColor(s) {
  switch (s) {
    case "active":
      return "success";
    case "draft":
      return "secondary";
    case "closed":
      return "dark";
    default:
      return "secondary";
  }
}
function fmtMoney(n) {
  return Number(n || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}