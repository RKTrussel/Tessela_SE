import { useEffect, useMemo, useState, useCallback } from 'react';
import api from '../../../api';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import StarRating from './starRating';

export default function Reviews({ productId }) {
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState(null);
    const [postError, setPostError] = useState(null);
    const [data, setData] = useState({ average: 0, count: 0, reviews: [] });

    // form state
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const canSubmit = useMemo(() => rating >= 1 && rating <= 5 && comment.trim().length >= 5, [rating, comment]);

    const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const res = await api.get(`/products/${productId}/reviews`);
        setData(res.data ?? { average: 0, count: 0, reviews: [] });
    } catch (e) {
        setError('Unable to load reviews right now.');
    } finally {
        setLoading(false);
    }
    }, [productId]); // stable reference

    useEffect(() => {
    if (!productId) return;
    fetchReviews();
    }, [productId, fetchReviews]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setPosting(true);
        setPostError(null);
        try {
        // optimistic append
        const tempId = `temp-${Date.now()}`;
        const optimistic = {
        review_id: tempId,
        author: 'You',
        rating,
        comment: comment.trim(),
        created_at: new Date().toISOString(),
        _optimistic: true,
        };
        setData((prev) => ({
            ...prev,
            count: prev.count + 1,
            average: (prev.average * prev.count + rating) / (prev.count + 1),
            reviews: [optimistic, ...prev.reviews],
        }));

        const res = await api.post(`/products/${productId}/reviews`, { rating, comment: comment.trim() });
        const created = res?.data ?? null;

        // replace optimistic with real, or just refetch for truth
        if (created && created.review_id) {
            setData((prev) => ({
                ...prev,
                reviews: prev.reviews.map((r) =>
                r.review_id === tempId ? created : r
                ),
            }));
        } else {
            // fallback to a full refresh to be safe
            fetchReviews();
        }

        // reset form
        setRating(0);
        setComment('');
        } catch (e) {
        console.error('Failed to post review', {
            status: e?.response?.status,
            data: e?.response?.data,
        });
        setPostError(e?.response?.data?.message || e.message || 'Failed to submit your review.');
        // rollback optimistic add
        setData((prev) => ({
            ...prev,
            count: Math.max(0, prev.count - 1),
            // recompute average safely
            average:
            prev.count > 1
                ? (prev.average * (prev.count + 1) - rating) / (prev.count)
                : 0,
            reviews: prev.reviews.filter((r) => !r._optimistic),
        }));
        } finally {
        setPosting(false);
        }
    };

  return (
    <Card className="border-0">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="fw-bold mb-0">Customer Reviews</h4>
          <div className="text-end">
            <div className="d-flex align-items-center gap-2">
              <StarRating value={Math.round(data.average)} readOnly size={18} />
              <span className="fw-semibold">{data.average?.toFixed?.(1) ?? '0.0'}</span>
              <span className="text-muted">({data.count} {data.count === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Loading reviews…</span>
          </div>
        ) : error ? (
          <Alert variant="danger" className="py-2">{error}</Alert>
        ) : (
          <>
            {/* Write a review */}
            <Card className="mb-3 border-0 bg-light">
              <Card.Body>
                <Form onSubmit={submitReview}>
                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold">Your rating</Form.Label>
                    <div>
                      <StarRating value={rating} onChange={setRating} size={24} idPrefix="input-star" />
                    </div>
                    <Form.Text>Click a star to rate (1–5).</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold">Your review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="What did you like or dislike?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>
                  {postError && <Alert variant="danger" className="py-2 my-2">{postError}</Alert>}
                  <div className="d-grid d-md-flex gap-2">
                    <Button type="submit" variant="primary" disabled={!canSubmit || posting}>
                      {posting ? 'Submitting…' : 'Submit Review'}
                    </Button>
                    {!canSubmit && (
                      <div className="text-muted small align-self-center">
                        Add a rating and at least 5 characters.
                      </div>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Reviews list */}
            {data.reviews.length === 0 ? (
              <p className="text-muted mb-0">No reviews yet. Be the first to review this item.</p>
            ) : (
              <ListGroup variant="flush">
                {data.reviews.map((r) => (
                  <ListGroup.Item key={r.review_id} className="px-0">
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <StarRating value={r.rating} readOnly size={16} />
                          <span className="fw-semibold">{r.author ?? 'Anonymous'}</span>
                        </div>
                        <div className="mt-1">{r.comment}</div>
                      </div>
                      <small className="text-muted ms-3" title={r.created_at}>
                        {new Date(r.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}