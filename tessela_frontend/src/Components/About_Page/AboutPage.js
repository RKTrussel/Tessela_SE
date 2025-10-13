import React, { useState, useEffect } from "react";
import Navbar from "../Shopping_Page/Navbar/Navbar";
import SecondNavbar from "../Shopping_Page/Navbar/SecondNavbar";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios";

const AboutPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from /api/me if token exists
    const token = localStorage.getItem("token"); // or sessionStorage, depending on your app

    if (token) {
      axios
        .get("http://localhost:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            name: res.data.name || "",
            email: res.data.email || "",
          }));
        })
        .catch((err) => console.error("Failed to fetch user:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:8000/api/contact", formData);
        setSubmitted(true);
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Something went wrong. Please try again later.");
    }
    };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <>
      <Navbar />
      <SecondNavbar />
      <div className="about-page">
        {/* Header Section */}
        <div className="about-header text-center text-white py-5">
          <Container>
            <h1 className="fw-bold display-5 mb-3">About Our Platform</h1>
            <p className="lead mx-auto header-text">
              Empowering Indigenous Weavers Through Technology, Storytelling, and Community Support
            </p>
          </Container>
        </div>

        {/* About Section */}
        <Container className="py-5">
          <Row className="justify-content-center text-center mb-5">
            <Col md={8}>
              <h2 className="fw-bold text-warning mb-3">
                Preserving Heritage in a Digital Age
              </h2>
              <p className="text-muted">
                The <strong>Weave Heritage Alliance (WHA)</strong> is a non-government organization
                dedicated to safeguarding the Philippines’ indigenous weaving traditions.
                Established in 2020, WHA empowers local artisans through community-based
                training, fair trade access, and digital innovation.
                <br />
                <br />
                Our initiatives connect cultural heritage with modern sustainability —
                supporting weaving cooperatives, preserving ancestral techniques, and ensuring
                every crafted thread continues to tell the story of its people.
              </p>
            </Col>
          </Row>

          {/* Mission & Vision */}
          <Row className="g-4 text-center">
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100 mission-card">
                <Card.Body>
                  <Card.Title className="fw-semibold text-warning">Our Mission</Card.Title>
                  <Card.Text className="text-muted">
                    To empower indigenous weaving communities by providing global
                    access, sustainable income, and opportunities for cultural
                    education through digital technology.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-0 shadow-sm h-100 vision-card">
                <Card.Body>
                  <Card.Title className="fw-semibold text-danger">Our Vision</Card.Title>
                  <Card.Text className="text-muted">
                    A connected world where indigenous craftsmanship thrives,
                    traditions are celebrated, and cultural diversity inspires innovation.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Contact Section */}
        <div className="contact-section py-5">
          <Container>
            <Row className="justify-content-center text-center mb-4">
              <Col md={8}>
                <h2 className="fw-bold text-dark mb-2">Contact Us</h2>
                <p className="text-muted">
                  Have questions, collaborations, or ideas to support indigenous
                  weavers? We’d love to hear from you.
                </p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <Card className="shadow-lg border-0 rounded-4 contact-card">
                  <Card.Body className="p-4">
                    {!submitted ? (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                          <Form.Label className="fw-semibold">Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            readOnly
                            disabled
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                          <Form.Label className="fw-semibold">Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            disabled
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formMessage">
                          <Form.Label className="fw-semibold">Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Write your message here..."
                            required
                          />
                        </Form.Group>

                        <div className="d-grid">
                          <Button variant="warning" type="submit" className="fw-semibold send-btn">
                            Send Message
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      <div className="text-center py-5">
                        <h5 className="text-success fw-semibold">
                          ✅ Thank you! Your message has been sent.
                        </h5>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Footer */}
        <footer className="footer text-center text-white py-4 mt-5">
          <p className="mb-0">
            © {new Date().getFullYear()} Indigenous Weaving Platform — Preserving
            Culture Through Code.
          </p>
        </footer>
      </div>
    </>
  );
};

export default AboutPage;