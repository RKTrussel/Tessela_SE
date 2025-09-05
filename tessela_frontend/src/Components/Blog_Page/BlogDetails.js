import React from "react";
import { Container, Row, Col, Button, Image, Carousel } from "react-bootstrap";

export default function BlogDetail({ post, onBack }) {
  if (!post) return <p>No post selected.</p>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Headline Image (first image only) */}
          {post.images && post.images.length > 0 && (
            <Image
              src={post.images[0]}
              alt={post.title}
              fluid
              rounded
              className="mb-4 shadow-lg"
            />
          )}

          {/* Blog Title (left aligned) */}
          <h1 className="fw-bold text-start">{post.title}</h1>
          <p className="text-muted text-start">
            By <strong>{post.author}</strong> • {post.date}
          </p>

          {/* Blog Content (center aligned) */}
          <div className="text-center mb-4">
            <p
              className="fs-5"
              style={{ lineHeight: "1.8", whiteSpace: "pre-line" }}
            >
              {post.content}
            </p>
          </div>

          {/* Gallery Carousel (after content) */}
          {post.images && post.images.length > 1 && (
            <Carousel className="mb-4 shadow-lg">
              {post.images.slice(1).map((img, index) => (
                <Carousel.Item key={index}>
                  <Image
                    src={img}
                    alt={`gallery-${index}`}
                    fluid
                    rounded
                    className="d-block mx-auto"
                  />
                  {post.captions && post.captions[index + 1] && (
                    <Carousel.Caption>
                      <p className="bg-dark bg-opacity-50 p-2 rounded">
                        {post.captions[index + 1]}
                      </p>
                    </Carousel.Caption>
                  )}
                </Carousel.Item>
              ))}
            </Carousel>
          )}

          {/* Back Button (left aligned) */}
          <div className="text-start mt-3">
            <Button variant="secondary" onClick={onBack}>
              ← Back to Home
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
