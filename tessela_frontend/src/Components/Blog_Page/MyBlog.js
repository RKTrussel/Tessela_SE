import { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from "../../api";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    images: [],
    status: "draft",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [blogId, setBlogId] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const quillRef = useRef(null);
  const quillInstance = useRef(null);

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

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await api.get(`/blogs/${id}`);
      setBlogId(id);
      setFormData({
        title: data.title,
        author: data.author,
        content: data.content || "",   // ✅ make sure content is synced
        images: [],
        status: data.status || "draft",
      });
      setExistingImages(data.images || []);
      setEditModalOpen(true);

      // set content in Quill when modal opens
      setTimeout(() => {
        if (quillInstance.current) {
          quillInstance.current.root.innerHTML = data.content || "";
        }
      }, 200);
    } catch (err) {
      console.error("Failed to load blog", err);
      alert("Failed to load blog for editing.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("author", formData.author);
      form.append("content", formData.content);
      form.append("status", formData.status);

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((img) => {
          if (img instanceof File) {
            form.append("images[]", img);
          }
        });
      }

      // 📝 Debug log — see what’s being submitted
      console.log("Submitting blog update:", {
        id: blogId,
        title: formData.title,
        author: formData.author,
        content: formData.content.substring(0, 50) + "...", // show preview only
        status: formData.status,
        images: formData.images,
      });

      await api.post(`/blogs/${blogId}?_method=PUT`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      await fetchBlogs(); // ✅ wait for refresh
      setEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update blog", err);
      alert("Failed to update blog.");
    } finally {
      setLoadingEdit(false);
    }
  };

  // initialize Quill when modal opens
  useEffect(() => {
    if (editModalOpen && quillRef.current && !quillRef.current.__quill) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: "Edit your blog content...",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      quillRef.current.__quill = quill;
      quillInstance.current = quill;

      quill.on("text-change", () => {
        setFormData((prev) => ({ ...prev, content: quill.root.innerHTML }));
      });
    }
  }, [editModalOpen]);

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
                    <td>
                      <Form.Select
                        size="sm"
                        value={b.status}
                        onChange={async (e) => {
                          try {
                            const newStatus = e.target.value;
                            const form = new FormData();
                            form.append("status", newStatus);

                            await api.post(`/blogs/${b.blog_id}?_method=PUT`, form, {
                              headers: { "Content-Type": "multipart/form-data" },
                            });

                            fetchBlogs(); // ✅ reload with latest status
                          } catch (err) {
                            console.error("Failed to update status", err);
                            alert("Could not update status");
                          }
                        }}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </Form.Select>
                    </td>
                    <td>{new Date(b.created_at).toLocaleString()}</td>
                    <td className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => handleEdit(b.blog_id)}
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

      {/* Edit Modal */}
      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            {/* Title */}
            <Form.Group className="mb-3">
              <Form.Label>Blog Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </Form.Group>

            {/* Author */}
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                required
              />
            </Form.Group>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-3">
                <Form.Label>Existing Images</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {existingImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt="existing"
                      style={{ maxHeight: "100px", borderRadius: "8px" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <Form.Group className="mb-3">
              <Form.Label>Upload New Images</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    images: Array.from(e.target.files),
                  }))
                }
              />
              <div className="mt-2 d-flex flex-wrap gap-2">
                {formData.images.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    style={{ maxHeight: "100px", borderRadius: "8px" }}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Quill Editor */}
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <div
                ref={quillRef}
                style={{
                  minHeight: "200px",
                  marginBottom: "20px",
                  backgroundColor: "#fff",
                }}
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={loadingEdit}>
              {loadingEdit ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyBlog;