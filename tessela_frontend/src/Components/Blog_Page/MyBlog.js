import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import api from "../../api";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/admin/blogs");
      const filtered = search
        ? data.filter((b) =>
            b.title.toLowerCase().includes(search.toLowerCase())
          )
        : data;
      setBlogs(filtered);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError("Failed to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [search]);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/blogs/${id}/approve`);
      fetchBlogs(); // reload after success
      alert("Blog approved and author notified by email.");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to approve blog", err);
      alert("Failed to approve blog.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this blog?")) return;
    try {
      await api.patch(`/blogs/${id}/reject`);
      fetchBlogs(); // reload after success
      alert("Blog rejected and author notified by email.");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to reject blog", err);
      alert("Failed to reject blog.");
    }
  };

  const handleView = async (id) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      const { data } = await api.get(`/blogs/${id}`); // make sure you have API endpoint GET /blogs/{id}
      setSelectedBlog(data);
    } catch (err) {
      console.error("Failed to load blog", err);
      setSelectedBlog({ title: "Error", content: "Failed to load blog" });
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="my-4">
        <Col>
          <h4>Review Blogs</h4>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <input
            type="text"
            className="form-control"
            placeholder="Search blog"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={8} className="d-flex justify-content-end">
          <Button variant="outline-secondary" onClick={() => setSearch("")}>
            Reset
          </Button>
        </Col>
      </Row>

      {/* Blogs Table */}
      <Row>
        <Col>
          <Table bordered responsive className="bg-white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <Spinner animation="border" size="sm" /> Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center text-danger">
                    {error}
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <div>
                      <div style={{ fontSize: "48px" }}>📝</div>
                      No Blogs Found
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b.blog_id}>
                    <td>#{b.blog_id}</td>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{new Date(b.created_at).toLocaleString()}</td>
                    <td className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => handleView(b.blog_id)}
                      >
                        View
                      </Button>
                      {b.status === "draft" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(b.blog_id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(b.blog_id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {b.status === "published" && (
                        <span className="text-success">✔ Published</span>
                      )}
                      {b.status === "rejected" && (
                        <span className="text-danger">✖ Rejected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Blog Preview Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedBlog?.title || "Blog Preview"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <div>
              <p><strong>Author:</strong> {selectedBlog?.author}</p>

              {/* Blog images (supports single or multiple) */}
              {selectedBlog?.images?.length > 0 && (
                <div className="mb-3">
                  {selectedBlog.images.length === 1 ? (
                    <div className="text-center">
                      <img
                        src={selectedBlog.images[0].url}
                        alt={selectedBlog.title}
                        style={{
                          maxHeight: "300px",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      id="blog-carousel"
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {selectedBlog.images.map((img, idx) => (
                          <div
                            key={img.blog_images_id}
                            className={`carousel-item ${idx === 0 ? "active" : ""}`}
                          >
                            <img
                              src={img.url}
                              alt={`${selectedBlog.title} ${idx + 1}`}
                              className="d-block w-100"
                              style={{
                                maxHeight: "300px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#blog-carousel"
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#blog-carousel"
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Blog content */}
              <div dangerouslySetInnerHTML={{ __html: selectedBlog?.content }} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedBlog && selectedBlog.status === "draft" && (
            <>
              <Button
                variant="success"
                onClick={() => handleApprove(selectedBlog.blog_id)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => handleReject(selectedBlog.blog_id)}
              >
                Reject
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyBlog;