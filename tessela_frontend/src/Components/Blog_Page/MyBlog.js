import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Spinner,
} from "react-bootstrap";
import api from "../../api";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

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
    } catch (err) {
      console.error("Failed to reject blog", err);
      alert("Failed to reject blog.");
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
                <th>Status</th>
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
                    <td>{b.status}</td>
                    <td>{new Date(b.created_at).toLocaleString()}</td>
                    <td className="d-flex gap-2">
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
    </Container>
  );
};

export default MyBlog;