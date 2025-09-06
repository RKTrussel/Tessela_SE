import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import InputGroup from "react-bootstrap/InputGroup";
import Pagination from "react-bootstrap/Pagination";
import api from "../../api";
import { ArrowCounterclockwise } from "react-bootstrap-icons";

export default function CampaignDirectory({ onOpen }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const pageSize = 8;

   // ✅ Memoize the loader so effects can safely depend on it
  const load = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setErr(null);
        const res = await api.get("/campaigns", {
          params: { q: q || undefined, status: status !== "all" ? status : undefined },
          signal, // axios v1 cancellation
        });
        const data = res?.data;
        setItems(Array.isArray(data) ? data : data?.data || []);
        setPage(1);
      } catch (e) {
        if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load campaigns";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    },
    [q, status] // 👈 re-create loader only when these change
  );

  // initial load (no debounce)
  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  // debounced reload on q/status change (because `load` changes when q/status change)
  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => load(ctrl.signal), 300);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [load]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((c) => {
      const okStatus = status === "all" ? true : c.status === status;
      const okQ =
        !needle ||
        (c.name && c.name.toLowerCase().includes(needle)) ||
        (c.description && c.description.toLowerCase().includes(needle));
      return okStatus && okQ;
    });
  }, [items, q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h1 className="h3 m-0">Donation Campaigns</h1>
        </Col>
        <Col xs="auto">
            <Button
                variant="outline-primary"
                onClick={() => load()}
                disabled={loading}
                >
                {loading ? (
                    <Spinner animation="border" size="sm" />
                ) : (
                    <ArrowCounterclockwise />
                )}
            </Button>
        </Col>
      </Row>

      <Row className="g-2 mb-3">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text id="search-label">Search</InputGroup.Text>
            <Form.Control
              aria-labelledby="search-label"
              placeholder="Search campaigns…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </Form.Select>
        </Col>
      </Row>

      {loading && (
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          <span>Loading…</span>
        </div>
      )}

      {!!err && (
        <Alert variant="danger">
          <strong>Oops!</strong> {err}
        </Alert>
      )}

      {!loading && !err && (
        <>
          {filtered.length === 0 ? (
            <Alert variant="secondary" className="text-center">
              No campaigns found.
            </Alert>
          ) : (
            <>
              <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                {slice.map((c) => (
                  <Col key={c.campaign_id}>
                    <Card className="h-100 shadow-sm">
                      <Thumb imagePath={c.images?.[0]?.image_path} alt={c.name} />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="mb-1">{c.name}</Card.Title>
                        <div className="text-muted small mb-2">
                          {fmtDate(c.start_date)} – {fmtDate(c.end_date)} ·{" "}
                          <StatusBadge status={c.status} />
                        </div>

                        <ProgressWithText raised={c.raised} goal={c.goalAmount} />

                        <Card.Text className="mt-2 mb-3">{trim(c.description, 120)}</Card.Text>

                        <div className="mt-auto d-grid">
                          <Button
                            variant="success"
                            onClick={() => (window.location.href = `/donate/${c.campaign_id}`)}
                          >
                            View / Donate
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="d-flex flex-end justify-content-center mt-4">
                <Pagination>
                  <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} />
                  <Pagination.Item active>{page}</Pagination.Item>
                  <Pagination.Next
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  />
                </Pagination>
              </div>
              <div className="text-center text-muted small">Page {page} of {totalPages}</div>
            </>
          )}
        </>
      )}
    </Container>
  );
}

/* --- helpers / subcomponents --- */

function Thumb({ imagePath, alt }) {
  if (!imagePath) {
    return (
      <div
        className="bg-light d-flex align-items-center justify-content-center"
        style={{ height: 160 }}
      >
        <span className="text-muted small">No image</span>
      </div>
    );
  }
  // derive http://127.0.0.1:8000 from your api baseURL "http://127.0.0.1:8000/api"
  const API_ORIGIN = (api.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const src = `${API_ORIGIN}/storage/${imagePath}`;

  return (
    <Card.Img
      variant="top"
      src={src}
      alt={alt}
      style={{ height: 160, objectFit: "cover" }}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

function StatusBadge({ status }) {
  const map = {
    active: "success",
    closed: "dark",
  };
  return <Badge bg={map[status] ?? "secondary"} className="text-uppercase">{status}</Badge>;
}

function ProgressWithText({ raised, goal }) {
  const percent = pct(raised ?? 0, goal ?? 0);
  return (
    <>
      <ProgressBar now={percent} animated={percent > 0 && percent < 100} className="mb-1" />
      <div className="d-flex justify-content-between small">
        <span>₱{fmtMoney(raised || 0)}</span>
        <span className="text-muted">{percent}%</span>
        <span>₱{fmtMoney(goal || 0)}</span>
      </div>
    </>
  );
}

/* --- utils --- */
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
function pct(raised, goal) {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((Number(raised) / Number(goal)) * 100));
}
function trim(txt = "", n = 120) {
  const s = String(txt);
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}