import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, InputGroup } from "react-bootstrap";
import { FiSearch, FiX } from "react-icons/fi";
import SearchResults from "./SearchResults";
import api from "../../../api";

function normalizeProducts(raw) {
  const arr =
    Array.isArray(raw) ? raw :
    Array.isArray(raw.products) ? raw.products :
    Array.isArray(raw.items) ? raw.items :
    Array.isArray(raw.data) ? raw.data : [];
  return arr.map(p => ({
    id: p.id ?? p.product_id,
    title: p.title ?? p.name ?? "—",
    image: p.image_url ?? p.image ?? p.images?.[0]?.url ?? null,
    price: Number(p.price ?? p.min_price ?? 0),
    compare_at: Number(p.compare_at_price ?? p.max_price ?? 0),
    sold_out: p.available === false || p.stock === 0,
    slug: p.slug,
  }));
}

export default function SearchOverlay({ show, onHide }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Reset when opening
  useEffect(() => {
    if (show) {
      setQ("");
      setProducts([]);
      setSuggestions([]);
    }
  }, [show]);

  // Debounced search
  useEffect(() => {
    if (!show) return;
    if (!q || q.trim().length < 2) {
      setProducts([]);
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        let res;
        try {
          res = await api.get("/search", { params: { q } });
        } catch {
          res = await api.get("/products", { params: { search: q } });
        }
        const normalized = normalizeProducts(res.data);
        setProducts(normalized);
        const sug = res.data?.suggestions ?? normalized.slice(0, 10).map(p => p.title).filter(Boolean);
        setSuggestions(Array.isArray(sug) ? sug : []);
      } catch (err) {
        console.error("Search failed:", err);
        setProducts([]);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [q, show]);

  const onSubmit = (e) => {
    e.preventDefault();
    onHide();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {show && (
        <div
          className="position-fixed bg-white"
          style={{
            top: "11%",
            width: "100%",
            maxHeight: "70vh",
            overflowY: "auto",
            zIndex: 1055,
            padding: "0 1.5rem"
          }}
        >
          {/* search bar */}
          <Form onSubmit={onSubmit} className="pb-3 mb-3 border-bottom">
            <InputGroup>
              <InputGroup.Text><FiSearch /></InputGroup.Text>
              <Form.Control
                autoFocus
                type="text"
                placeholder="Search for…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <InputGroup.Text
                as="button"
                type="button"
                onClick={onHide}
                aria-label="Close search"
                style={{ background: "transparent", borderLeft: 0, cursor: "pointer" }}
              >
                <FiX />
              </InputGroup.Text>
            </InputGroup>
          </Form>

          {/* results section */}
          <SearchResults
            q={q}
            loading={loading}
            products={products}
            suggestions={suggestions}
            onHide={onHide}
          />
        </div>
      )}
    </>
  );
}