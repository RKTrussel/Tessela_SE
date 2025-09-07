import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image, Carousel, Form, ListGroup, Spinner } from "react-bootstrap";
import api from "../../api";
import './BlogDetails.css';

export default function BlogDetail({ post, onBack }) {
  const safePost = post ?? {};
  const blogId = safePost.blog_id;

  const [likes, setLikes] = useState(safePost.likes_count ?? 0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [cmtContent, setCmtContent] = useState("");
  const [cmtLoading, setCmtLoading] = useState(true);
  const [cmtSubmitting, setCmtSubmitting] = useState(false);
  const [cmtError, setCmtError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!blogId) {
        setCmtLoading(false);
        return;
      }
      try {
        setCmtLoading(true);
        const [cmtRes, blogRes] = await Promise.allSettled([
          api.get(`/blogs/${blogId}/comments`),
          api.get(`/blogs/${blogId}`),
        ]);

        if (isMounted && cmtRes.status === "fulfilled") {
          setComments(cmtRes.value.data || []);
        }
        if (isMounted && blogRes.status === "fulfilled") {
          const data = blogRes.value.data || {};
          if (typeof data.likes_count === "number") setLikes(data.likes_count);
          if (typeof data.liked === "boolean") setLiked(data.liked);
        }
      } finally {
        if (isMounted) setCmtLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [blogId]);

  const handleLike = async () => {
    if (likeLoading || !blogId) return;
    setLikeLoading(true);
    setLiked((prev) => !prev);
    setLikes((prev) => prev + (liked ? -1 : 1));
    try {
      const { data } = await api.post(`/blogs/${blogId}/like`);
      if (typeof data.likes_count === "number") setLikes(data.likes_count);
      if (typeof data.liked === "boolean") setLiked(data.liked);
    } catch {
      setLiked((prev) => !prev);
      setLikes((prev) => prev + (liked ? 1 : -1));
    } finally {
      setLikeLoading(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    setCmtError("");
    if (!cmtContent.trim()) {
      setCmtError("Comment cannot be empty.");
      return;
    }
    if (!blogId) return;

    setCmtSubmitting(true);
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      comment_id: tempId,
      author: "You",
      content: cmtContent,
      created_at: new Date().toISOString(),
      _optimistic: true,
    };
    setComments((prev) => [optimistic, ...prev]);

    try {
      const { data } = await api.post(`/blogs/${blogId}/comments`, {
        content: cmtContent,
      });
      setComments((prev) => [
        data,
        ...prev.filter((c) => c.comment_id !== tempId),
      ]);
      setCmtContent("");
    } catch {
      setCmtError("Failed to post comment. Please try again.");
      setComments((prev) => prev.filter((c) => c.comment_id !== tempId));
    } finally {
      setCmtSubmitting(false);
    }
  };

  if (!post) return <p>No post selected.</p>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1 className="display-4 fw-bold text-center" style={{fontFamily: "Merriweather"}}>{post.title}</h1>
          {/* Hero image */}
          {post.images?.length > 0 && (
            <Image
              src={post.images[0]?.url}
              alt={post.title}
              className="blog-hero-img mb-4"
            />
          )}

          {/* Title + Meta */}
          
          <p className="blog-meta">
            By <strong>{post.author}</strong> • {post.date}
          </p>

          {/* Like + Back */}
          <div className="d-flex gap-3 align-items-center mb-4 justify-content-center">
            <Button
              variant={liked ? "danger" : "outline-danger"}
              onClick={handleLike}
              disabled={likeLoading}
            >
              {likeLoading ? (
                <Spinner size="sm" animation="border" />
              ) : liked ? (
                "♥ Liked"
              ) : (
                "♡ Like"
              )}
            </Button>
            <span className="text-muted">
              {likes} {likes === 1 ? "like" : "likes"}
            </span>
            <Button variant="secondary" onClick={onBack}>
              ← Back to Home
            </Button>
          </div>

          {/* Article Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Extra images carousel */}
          {post.images?.length > 1 && (
            <Carousel className="mb-4 shadow-lg">
              {post.images.slice(1).map((img, index) => (
                <Carousel.Item key={index}>
                  <Image
                    src={img?.url}
                    alt={`gallery-${index}`}
                    rounded
                    className="d-block mx-auto carousel-img"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}

          {/* Comments Section */}
          <h4 className="mt-5 mb-3">Comments</h4>
          <Form onSubmit={submitComment} className="mb-3">
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write a comment…"
                value={cmtContent}
                onChange={(e) => setCmtContent(e.target.value)}
                disabled={cmtSubmitting}
              />
            </Form.Group>
            {cmtError && <div className="text-danger mb-2">{cmtError}</div>}
            <Button type="submit" disabled={cmtSubmitting}>
              {cmtSubmitting ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Post Comment"
              )}
            </Button>
          </Form>

          {cmtLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-muted">No comments yet. Be the first!</p>
          ) : (
            <ListGroup variant="flush" className="mb-5">
              {comments.map((c) => (
                <ListGroup.Item
                  key={c.comment_id ?? c.id}
                  className="px-0 border-0 border-bottom"
                >
                  <div className="d-flex justify-content-between">
                    <strong>{c.author}</strong>
                    <small className="text-muted">
                      {new Date(c.created_at).toLocaleString()}
                      {c._optimistic && " • sending…"}
                    </small>
                  </div>
                  <div className="mt-1" style={{ whiteSpace: "pre-wrap" }}>
                    {c.content}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
}