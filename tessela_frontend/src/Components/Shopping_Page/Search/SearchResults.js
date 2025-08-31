// src/components/Search/SearchResults.jsx
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Spinner, Button } from "react-bootstrap";

const php = (n) => {
  const num = Number(n || 0);
  try { return num.toLocaleString("en-PH", { style: "currency", currency: "PHP" }); }
  catch { return `₱${num.toFixed(2)}`; }
};

export default function SearchResults({ q, loading, products, suggestions, onHide }) {
  const navigate = useNavigate();
  const hasResults = products.length > 0;

  return (
    <Row className="g-4">
      {/* Suggestions */}
      <Col md={3}>
        <div className="fw-semibold mb-2">Suggestions</div>
        {q && suggestions.length === 0 && !loading && (
          <div className="text-muted small">No suggestions</div>
        )}
        <ListGroup variant="flush">
          {suggestions.map((s, i) => (
            <ListGroup.Item
              key={`${s}-${i}`}
              action
              onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
              className="px-0"
            >
              {s}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>

      {/* Products */}
      <Col md={9}>
        <div className="fw-semibold mb-3">Products</div>

        {loading && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <Spinner animation="border" size="sm" /> <span>Searching…</span>
          </div>
        )}

        {!loading && !hasResults && q && (
          <div className="text-muted">No products found for “{q}”.</div>
        )}

        <Row xs={2} md={3} lg={4} className="g-4">
          {products.map(p => (
            <Col key={p.id}>
              <Link
                to={`/product/${p.slug ?? p.id}`}
                className="text-decoration-none text-reset"
                onClick={onHide}
              >
                <div className="position-relative">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 6, background: "#f5f5f5" }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center text-muted"
                      style={{ width: "100%", height: 220, borderRadius: 6, background: "#f5f5f5", fontSize: 12 }}
                    >
                      No image
                    </div>
                  )}
                  {p.compare_at > p.price && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">ON SALE</span>
                  )}
                  {p.sold_out && (
                    <span className="badge bg-secondary position-absolute top-0 end-0 m-2">SOLD OUT</span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="small">{p.title}</div>
                  <div className="d-flex gap-2 align-items-baseline fw-semibold">
                    <span>{php(p.price)}</span>
                    {p.compare_at > p.price && (
                      <span className="text-muted text-decoration-line-through fw-normal">
                        {php(p.compare_at)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>

        {(hasResults || q) && (
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="dark"
              onClick={() => { onHide(); navigate(`/search?q=${encodeURIComponent(q)}`); }}
            >
              VIEW ALL RESULTS
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
}
