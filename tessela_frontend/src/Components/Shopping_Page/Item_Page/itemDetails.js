import { useEffect, useMemo, useState } from 'react';
import api from '../../../api';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function ItemDetails({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const itemId = useMemo(() => {
    if (!product) return null;
    return product.product_id ?? null;
  }, [product]);

  const maxQty = product?.stock > 0 ? Number(product.stock) : 0;

  const setQtyClamped = (next) => {
    if (!maxQty) return setQuantity(1);
    const q = Math.max(1, Math.min(next, maxQty));
    setQuantity(q);
  };

  const addToCart = async () => {
    if (!itemId) {
      setError('Missing item id.');
      return;
    }
    if (!quantity || quantity < 1) {
      setError('Please select a valid quantity.');
      return;
    }
    if (maxQty && quantity > maxQty) {
      setError(`Only ${maxQty} left in stock.`);
      return;
    }

    setAdding(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api.post('/cart/add', { product_id: itemId, quantity });
      setMessage(res?.data?.message || 'Item added to cart!');
    } catch (e) {
      console.error('Add to cart failed', {
        status: e?.response?.status,
        data: e?.response?.data,
      });
      setError(
        e?.response?.data?.message || e.message || 'Failed to add item to cart.'
      );
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/products/${id}`);
        if (!active) return;
        setProduct(response.data);
        setQuantity(1);
      } catch (e) {
        console.error('Error fetching product details:', e);
        if (!active) return;
        setError('Unable to load product.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div>Loading...</div>;

  const addDisabled =
    adding || !itemId || maxQty === 0 || !quantity || quantity < 1;

  return (
    <Col xs={12} md={6} lg={3}>
      <Card className="border-0">
        <Card.Body>
          <h2 className="fw-bold mb-2">{product?.name || 'Unnamed Product'}</h2>
          <p className="text-muted">{product?.description || 'No description available'}</p>

          <p className="text-primary fw-semibold mb-2">The Anniversary Sale</p>
          <hr />
          <h3 className="fw-bold text-success mb-3">
            ₱{product?.price || 'N/A'}
          </h3>

          <p className="mb-1"><small className="text-muted">SKU: {product?.barcode_value || 'N/A'}</small></p>
          <p className="fw-semibold">
            {maxQty > 0 ? `Only ${maxQty} units left` : 'Out of stock'}
          </p>

          {/* Quantity Controls */}
          <div className="d-flex align-items-center mb-3">
            <button
              className="btn btn-outline-dark btn-sm rounded-circle"
              onClick={() => setQtyClamped(quantity - 1)}
              disabled={quantity <= 1 || maxQty === 0}
              aria-label="decrease quantity"
            >
              −
            </button>
            <span
              className="mx-3 fw-semibold"
              style={{ minWidth: 32, textAlign: 'center', fontSize: '1.1rem' }}
            >
              {quantity}
            </span>
            <button
              className="btn btn-outline-dark btn-sm rounded-circle"
              onClick={() => setQtyClamped(quantity + 1)}
              disabled={maxQty === 0 || (maxQty && quantity >= maxQty)}
              aria-label="increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to cart button */}
          <button
            className="btn btn-primary w-100 mb-3 fw-semibold"
            onClick={addToCart}
            disabled={addDisabled}
          >
            {adding ? 'Adding…' : 'Add to Cart'}
          </button>

          {/* Feedback messages */}
          {message && <div className="alert alert-success py-2">{message}</div>}
          {error && <div className="alert alert-danger py-2">{error}</div>}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ItemDetails;
