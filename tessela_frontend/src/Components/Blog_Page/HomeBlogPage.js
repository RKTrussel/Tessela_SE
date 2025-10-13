import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Modal } from "react-bootstrap";
import api from "../../api";
import Navbar from "../Shopping_Page/Navbar/Navbar";
import SecondNavbar from "../Shopping_Page/Navbar/SecondNavbar";
import BlogDetail from "./BlogDetails";
import UserCreateBlog from "./Blog_Creation/UserCreateBlog";
import "./HomeBlogPage.css";

export default function HomeBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = { search };
        const response = await api.get("/blogs", { params });
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [search]);

  return (
    <>
      <Navbar />
      <SecondNavbar />

      {selectedPost ? (
        <BlogDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
      ) : (
        <Container className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h2 className="journal-title mb-0">BLOGS</h2>
            <Button
              variant="outline-primary"
              className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg"
              style={{ width: "60px", height: "60px", fontSize: "24px" }}
              onClick={() => setShowAddModal(true)}
            >
              ✍️
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p>Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: "48px" }}>📝</div>
              No posts found
              <div className="mt-2">
                <Button variant="outline-primary" onClick={() => setSearch("")}>
                  Reload
                </Button>
              </div>
            </div>
          ) : (
            <Row className="g-4">
              {blogs.map((post) => (
                <Col md={4} sm={6} xs={12} key={post.blog_id}>
                  <Card className="blog-card">
                    <div className="blog-img-wrapper">
                      <Card.Img
                        variant="top"
                        src={post.images[0]?.url}
                        alt={post.title}
                        className="blog-img"
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="blog-title">{post.title}</Card.Title>
                      <Card.Text className="blog-excerpt">
                        {stripHtml(post.excerpt) ||
                          stripHtml(post.content).substring(0, 100) + "..."}
                      </Card.Text>
                      <Button
                        variant="link"
                        className="read-more"
                        onClick={() => setSelectedPost(post)}
                      >
                        Read more →
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create a New Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserCreateBlog
            onSave={(newBlog) => {
              if (newBlog.blog?.status === "published") {
                setBlogs((prev) => [newBlog.blog, ...prev]);
              }
              setToastMsg("Your blog has been submitted! Your account is under review.");
              setShowAddModal(false);
              setTimeout(() => setToastMsg(""), 5000);
            }}
          />
        </Modal.Body>
      </Modal>
      

      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#198754",
            color: "white",
            padding: "12px 18px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          {toastMsg}
        </div>
      )}

      <footer className="bg-dark text-light text-center py-3 mt-4">
        <p className="mb-0">© 2025 My Blog. All rights reserved.</p>
      </footer>
    </>
  );
}