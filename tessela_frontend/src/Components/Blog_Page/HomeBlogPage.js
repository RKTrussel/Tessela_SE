import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import api from "../../api"; // Assuming you already have api setup for axios
import Navbar from "../Shopping_Page/Navbar/Navbar";
import SecondNavbar from "../Shopping_Page/Navbar/SecondNavbar";
import BlogDetail from "./BlogDetails";

export default function MyBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [search, setSearch] = useState(""); // Optional search filter

  // Fetch blog posts without sorting
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = { search };

        // Fetch blogs without sorting
        const response = await api.get('/blogs', { params });
        setBlogs(response.data); // Assuming response contains a list of blogs
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [search]);  // Refetch blogs when `search` changes

  return (
    <>
      <Navbar />
      <SecondNavbar />

      {selectedPost ? (
        <BlogDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
      ) : (
        <Container className="mt-4">
          <Row>
            <Col md={8}>
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
                blogs.map((post) => (
                  <Card className="mb-4 shadow-sm" key={post.blog_id}>
                    <Card.Img
                      variant="top"
                      src={post.images[0]?.url} // The URL is already included from the backend
                      className="card-img-top mb-3"
                      alt={post.title}
                    />
                    <Card.Body>
                      <Card.Title>{post.title}</Card.Title>
                      <Card.Text>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              post.excerpt ||
                              post.content.substring(0, 100) + "...",
                          }}
                        />
                      </Card.Text>
                      <Button variant="primary" onClick={() => setSelectedPost(post)}>
                        Read More
                      </Button>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Col>
          </Row>
        </Container>
      )}

      <footer className="bg-dark text-light text-center py-3 mt-4">
        <p className="mb-0">© 2025 My Blog. All rights reserved.</p>
      </footer>
    </>
  );
}
