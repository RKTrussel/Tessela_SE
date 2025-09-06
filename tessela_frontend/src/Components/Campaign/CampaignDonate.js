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
import ButtonGroup from "react-bootstrap/ButtonGroup";
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
function DonateForm({ campaignId, onDone }) {
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState("");
  const [forceFail, setForceFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const presets = [100, 250, 500, 1000];

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await api.post(`/campaigns/${campaignId}/donations`, {
        amount: Number(amount),
        message,
        force_fail: forceFail,
      });
      setResult(data);
      onDone?.();
      // optional: reset message
      setMessage("");
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={submit} noValidate>
      <Row className="g-3">
        <Col xs={12}>
          <Form.Label>Amount (PHP)</Form.Label>
          <InputGroup>
            <InputGroup.Text>₱</InputGroup.Text>
            <Form.Control
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </InputGroup>
          <div className="mt-2">
            <ButtonGroup>
              {presets.map((p) => (
                <Button
                  key={p}
                  variant="outline-secondary"
                  onClick={() => setAmount(p)}
                  type="button"
                >
                  ₱{fmtMoney(p)}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Col>

        <Col xs={12}>
          <Form.Label>Message (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a note to your donation"
          />
        </Col>

        {error && (
          <Col xs={12}>
            <Alert variant="danger" className="mb-0">{error}</Alert>
          </Col>
        )}
        {result && (
          <Col xs={12}>
            <Alert variant={result.payment_status === "paid" ? "success" : "warning"} className="mb-0">
              {result.payment_status === "paid"
                ? <>Thank you! Ref: <strong>{result.payment_ref}</strong></>
                : <>Status: <strong>{result.payment_status}</strong></>}
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
              "Donate"
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
    return <div className="text-muted">No donations yet.</div>;
  }
  return (
    <ListGroup variant="flush" className="mt-2">
      {donations.map((d) => (
        <ListGroup.Item key={d.donation_id}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong>₱{fmtMoney(d.amount)}</strong>
              <div className="text-muted small">{fmtDate(d.created_at)}</div>
              {d.message && <div className="mt-1 fst-italic">“{d.message}”</div>}
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