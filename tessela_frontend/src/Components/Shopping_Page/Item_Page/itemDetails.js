import { useEffect, useMemo, useState } from 'react';
import api from '../../../api';
import Col from 'react-bootstrap/Col';

function currency(n) {
  if (n == null || isNaN(n)) return 'N/A';
  return Number(n).toFixed(2);
}

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
            data: e?.response?.data
        });
        setError(e?.response?.data?.message || e.message || 'Failed to add item to cart.');
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
        if (response.data?.stock > 0) {
          setQuantity(1);
        } else {
          setQuantity(1);
        }
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

  const price = product?.price ?? null;
  const regularPrice = price != null ? Number(price) * 1.1 : null;

  const addDisabled =
    adding || !itemId || maxQty === 0 || !quantity || quantity < 1;

  return (
    <Col xs={12} md={6} lg={4}>
      <h2>{product?.name || 'Product name not available'}</h2>
      <h4 className="text-muted">
        {product?.description || 'No description available'}
      </h4>

      <p><strong>The Anniversary Sale</strong></p>
      <p>
        <span style={{ fontWeight: 'bold' }}>
          Sale price ₱{currency(price)}
        </span>
        <br />
        <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>
          Regular price ₱{regularPrice != null ? currency(regularPrice) : 'N/A'}
        </span>
      </p>

      <p>SKU: {product?.barcode_value || 'N/A'}</p>
      <p>
        <strong>
          {maxQty > 0 ? `Only ${maxQty} units left` : 'Out of stock'}
        </strong>
      </p>

      <div className="d-flex align-items-center mb-2">
        <button
          className="btn btn-outline-secondary btn-sm me-2"
          onClick={() => setQtyClamped(quantity - 1)}
          disabled={quantity <= 1 || maxQty === 0}
          aria-label="decrease quantity"
        >
          -
        </button>
        <span style={{ minWidth: 24, textAlign: 'center' }}>{quantity}</span>
        <button
          className="btn btn-outline-secondary btn-sm ms-2"
          onClick={() => setQtyClamped(quantity + 1)}
          disabled={maxQty === 0 || (maxQty && quantity >= maxQty)}
          aria-label="increase quantity"
        >
          +
        </button>
      </div>

      <button
        className="btn btn-primary mb-3"
        onClick={addToCart}
        disabled={addDisabled}
      >
        {adding ? 'Adding…' : 'Add to shopping bag'}
      </button>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
    </Col>
  );
}

export default ItemDetails;