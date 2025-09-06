import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from '../../../api';
import { useNavigate } from "react-router-dom";

export default function CreateBlog({ onSave }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [images, setImages] = useState([]);
  const [date] = useState(new Date().toLocaleDateString());
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (quillRef.current && !quillRef.current.__quill) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: "Write your blog content here...",
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
        setContent(quill.root.innerHTML);
      });
    }
  }, []);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      uploadedImages.push(files[i]);
    }
    setImages(uploadedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("date", date);
      formData.append("content", content);

      images.forEach((img) => {
        formData.append("images[]", img); // ✅ multiple images like campaign
      });

      const res = await api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onSave) onSave(res.data);

      // Reset form
      setTitle("");
      setAuthor("");
      setImages([]);
      setContent("");
      quillInstance.current.root.innerHTML = "";
      setLoading(false);
      navigate("/dashboard/myBlog"); // redirect after saving
    } catch (error) {
      console.error("Blog save failed:", error);
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm p-4">
            <h2 className="mb-4">Create New Blog Post</h2>

            <Form onSubmit={handleSubmit}>
              {/* Title */}
              <Form.Group className="mb-3">
                <Form.Label>Blog Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Author */}
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Image Upload */}
              <Form.Group className="mb-3">
                <Form.Label>Upload Images</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {images.length > 0 &&
                    images.map((file, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        style={{
                          maxHeight: "100px",
                          borderRadius: "8px",
                        }}
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

              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={() => navigate('/dashboard/myBlogs')}>
                  Cancel
                </Button>
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : 'Save Post'}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}