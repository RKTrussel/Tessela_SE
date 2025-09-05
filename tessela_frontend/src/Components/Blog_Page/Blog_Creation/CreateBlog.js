import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from '../../../api';

export default function CreateBlog({ onSave }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [images, setImages] = useState([]);
  const [date] = useState(new Date().toLocaleDateString());
  const [content, setContent] = useState("");

  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
  if (quillRef.current && !quillRef.current.__quill) {
    const quill = new Quill(quillRef.current, {
      theme: "snow",
      placeholder: "Write your blog content here...",
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link", "image"],
            ["clean"],
          ],
          handlers: {
            image: function () {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.click();

              input.onchange = async () => {
                const file = input.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("image", file);

                  try {
                    const res = await api.post("/upload-image", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });

                    const { url } = res.data;
                    if (url) {
                      const range = this.quill.getSelection();
                      this.quill.insertEmbed(range.index, "image", url);
                    }
                  } catch (error) {
                    console.error("Image upload failed:", error);
                  }
                }
              };
            },
          },
        },
      },
    });

    quillRef.current.__quill = quill;

    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
    });
  }
}, []);

  // Handle drag & drop images
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { url } = res.data;
      if (url) {
        setImages((prev) => [...prev, url]);
      }
    } catch (error) {
      console.error("Drag-drop upload failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      title,
      author,
      date,
      images,
      content,
    };

    try {
      const res = await api.post("/blogs", newPost); // ✅ send to backend
      if (onSave) onSave(res.data);

      // Reset form
      setTitle("");
      setAuthor("");
      setImages([]);
      setContent("");
      quillInstance.current.root.innerHTML = "";
    } catch (error) {
      console.error("Blog save failed:", error);
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

              {/* Drag & Drop Images */}
              <Form.Group
                className="mb-3 p-3 border rounded text-center bg-light"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Form.Label>Drag & Drop Images Here</Form.Label>
                <div className="mt-2">
                  {images.length > 0 &&
                    images.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="uploaded"
                        style={{
                          maxHeight: "100px",
                          marginRight: "10px",
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

              <Button variant="success" type="submit">
                Save Post
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
