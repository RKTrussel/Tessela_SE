import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/blogs", {
        params: { search: search || undefined },
      });
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [search]);

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  return (
    <Container fluid>
      <Row className="my-4">
        <Col>
          <h4>My Blogs</h4>
        </Col>
        <Col className="text-end">
          <Button onClick={() => navigate("/dashboard/myBlog/addBlogs")}>
            + Add Blog
          </Button>
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
                ) : blogs.length === 0 ? (
                    <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                        <div>
                        <div style={{ fontSize: "48px" }}>📝</div>
                        No Blogs Found
                        <div className="mt-2">
                        </div>
                        </div>
                    </td>
                    </tr>
                ) : (
                    blogs.map((b) => (
                    <tr key={b.blog_id}>
                        <td>#{b.blog_id}</td>
                        <td>{b.title}</td>
                        <td>{b.author}</td>
                        <td>{b.status || "draft"}</td>
                        <td>{new Date(b.created_at).toLocaleString()}</td>
                        <td className="d-flex gap-2">
                        <Button
                            size="sm"
                            variant="info"
                            onClick={() => navigate(`/dashboard/myBlog/edit/${b.blog_id}`)}
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteBlog(b.blog_id)}
                        >
                            Delete
                        </Button>
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