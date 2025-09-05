import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Navbar from "../Shopping_Page/Navbar/Navbar";
import SecondNavbar from "../Shopping_Page/Navbar/SecondNavbar";
import BlogDetail from "./BlogDetails";

export default function HomeBlogPage() {
  // Dummy posts data
  const posts = [
    {
        id: 1,
        title: "My Travel Journey",
        content: "This was one of the most amazing trips of my life...\n\nThe scenery was breathtaking!",
        author: "Charles Lwanga",
        date: "Sept 5, 2025",
        images: [
            "https://picsum.photos/800/400?random=1", // main banner
            "https://picsum.photos/600/300?random=2",
            "https://picsum.photos/600/300?random=3",
            "https://picsum.photos/600/300?random=4"
        ]
    },
    {
      id: 2,
      title: "Top 10 Travel Destinations",
      excerpt: "From the beaches of Bali to the streets of Paris...",
      content:
        "Traveling opens up new perspectives and experiences. Here are the top 10 travel destinations that should be on your bucket list: Paris, Tokyo, New York, Rome, Bali, Sydney, Cape Town, Barcelona, Dubai, and Istanbul...",
      author: "Jane Doe",
      date: "Sept 3, 2025",
      image: "https://picsum.photos/800/400?random=2",
    },
  ];

  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <>
        <Navbar />
        <SecondNavbar />
      {/* Switch between Home & Detail */}
      {selectedPost ? (
        <BlogDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
      ) : (
        <Container className="mt-4">
          <Row>
            <Col md={8}>
              {posts.map((post) => (
              <Card className="mb-4 shadow-sm" key={post.id}>
                <Card.Img 
                  variant="top" 
                  src={post.image || (post.images && post.images[0])} 
                />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.excerpt || post.content.substring(0, 100) + "..."}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => setSelectedPost(post)}
                  >
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            ))}
            </Col>

            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Categories</Card.Title>
                  <ul className="list-unstyled">
                    <li><a href="#">Technology</a></li>
                    <li><a href="#">Travel</a></li>
                    <li><a href="#">Food</a></li>
                    <li><a href="#">Lifestyle</a></li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-4">
        <p className="mb-0">© 2025 My Blog. All rights reserved.</p>
      </footer>
    </>
  );
}
