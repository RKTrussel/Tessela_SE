import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Image, Carousel, Form, ListGroup, Spinner } from "react-bootstrap";
import api from "../../api";
import "./BlogDetails.css";

export default function BlogDetail({ post: propPost, onBack }) {
  const { blogId: routeId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(propPost ?? null);
  const [loadingPost, setLoadingPost] = useState(!propPost);

  const [likes, setLikes] = useState(propPost?.likes_count ?? 0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [cmtContent, setCmtContent] = useState("");
  const [cmtLoading, setCmtLoading] = useState(true);
  const [cmtSubmitting, setCmtSubmitting] = useState(false);
  const [cmtError, setCmtError] = useState("");

  const blogId = propPost?.blog_id ?? routeId;

  // 🔹 Fetch blog data if loaded via route
  useEffect(() => {
    let isMounted = true;
    const fetchPost = async () => {
      if (propPost || !blogId) return;
      try {
        setLoadingPost(true);
        const { data } = await api.get(`/blogs/${blogId}`);
        if (isMounted) setPost(data);
        if (typeof data.likes_count === "number") setLikes(data.likes_count);
        if (typeof data.liked === "boolean") setLiked(data.liked);
      } catch (error) {
        console.error("Failed to load blog:", error);
      } finally {
        if (isMounted) setLoadingPost(false);
      }
    };
    fetchPost();
    return () => (isMounted = false);
  }, [blogId, propPost]);

  // 🔹 Fetch comments
  useEffect(() => {
    let isMounted = true;
    const loadComments = async () => {
      if (!blogId) {
        setCmtLoading(false);
        return;
      }
      try {
        setCmtLoading(true);
        const { data } = await api.get(`/blogs/${blogId}/comments`);
        if (isMounted) setComments(data || []);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        if (isMounted) setCmtLoading(false);
      }
    };
    loadComments();
    return () => (isMounted = false);
  }, [blogId]);

  // 🔹 Like handler
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

  // 🔹 Comment submit
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

  // 🔹 Handle loading / missing post
  if (loadingPost)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );

  if (!post) return <p className="text-center mt-5">Blog not found.</p>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1
            className="display-4 fw-bold text-center"
            style={{ fontFamily: "Merriweather" }}
          >
            {post.title}
          </h1>

          {/* Hero Image */}
          {post.images?.length > 0 && (
            <Image
              src={post.images[0]?.url}
              alt={post.title}
              className="blog-hero-img mb-4"
            />
          )}

          <p className="blog-meta">
            By <strong>{post.author}</strong> •{" "}
            {new Date(post.date).toLocaleDateString()}
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
            <Button
              variant="secondary"
              onClick={() => {
                const currentPath = window.location.pathname;
                if (currentPath.startsWith("/blogs/")) {
                  // Example: /blogs/1, /blogs/23, etc. — go back
                  navigate(-1);
                } else if (currentPath === "/blog") {
                  // On the blog listing page — just reset (reload)
                  window.location.reload();
                } else if (onBack) {
                  // If inline (like HomeBlogPage), use provided onBack handler
                  onBack();
                } else {
                  // Default fallback
                  navigate(-1);
                }
              }}
            >
              ← Back
            </Button>
          </div>

          {/* Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Extra Images Carousel */}
          {post.images?.length > 1 && (
            <Carousel className="mb-4 shadow-lg" variant="dark">
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

          {/* Comments */}
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