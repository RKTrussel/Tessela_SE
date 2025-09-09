import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

export default function RelatedProducts({ productId, limit = 8 }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await api.get(`/products/${productId}/related`, { params: { limit } });
        if (!active) return;
        setItems(res.data?.products ?? []);
      } catch (e) {
        if (!active) return;
        setErr('Unable to load related products.');
      } finally {
        if (active) setLoading(false);
      }
    };
    if (productId) load();
    return () => { active = false; };
  }, [productId, limit]);

  if (loading) {
    return <div className="d-flex align-items-center gap-2"><Spinner size="sm" /> <span>Loading related items…</span></div>;
  }
  if (err) return <Alert variant="danger" className="py-2">{err}</Alert>;
  if (!items.length) return null;

  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">You may also like</h5>
      <Row className="g-3">
        {items.map(p => (
          <Col key={p.product_id} xs={6} sm={4} md={3} lg={2}>
            <Card className="h-100 border-0 shadow-sm">
              <Link to={`/product/${p.product_id}`} className="text-decoration-none text-dark">
                <Card.Img
                  variant="top"
                  src={p.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'}
                  alt={p.name}
                  style={{ objectFit: 'cover', height: 160 }}
                />
                <Card.Body className="py-2">
                  <div className="fw-semibold text-truncate" title={p.name}>{p.name}</div>
                  <div>₱{p.price}</div>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}