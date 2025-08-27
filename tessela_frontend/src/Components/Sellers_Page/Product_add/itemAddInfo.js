import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

import useItemAddInfo from "./hooks/useItemAddInfo";

export default function ItemAddInfo() {
  const { state, set, refs, handlers, ui } = useItemAddInfo();
  const { images, submitted, active, form } = state;
  const { setSubmitted } = set;
  const { basicRef, salesRef, othersRef , barcodeRef } = refs;
  const { onChange, onImages, submit, scrollTo } = handlers;
  const { sectionStyle, STICKY_OFFSET } = ui;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={10}>
          {submitted && (
            <Alert
              variant="success"
              onClose={() => setSubmitted(false)}
              dismissible
            >
              Dummy save complete. Check the console for the payload.
            </Alert>
          )}

          {/* Sticky, scrollable tab-like nav */}
          <div
            style={{
              position: "sticky",
              top: STICKY_OFFSET,
              zIndex: 1020,
              background: "var(--bs-body-bg)",
              borderBottom: "1px solid var(--bs-border-color)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <Nav
                variant="tabs"
                activeKey={active}
                className="my-0 flex-nowrap"
                onSelect={(k) => {
                  if (k === "basic") scrollTo(basicRef, "basic");
                  if (k === "sales") scrollTo(salesRef, "sales");
                  if (k === "others") scrollTo(othersRef, "others");
                }}
              >
                <Nav.Item>
                  <Nav.Link eventKey="basic">Basic information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="sales">Sales Information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="others">Others</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>

          <Form onSubmit={submit}>
            {/* Basic Info Section */}
            <section ref={basicRef} style={sectionStyle}>
              <Card className="p-3 my-2">
                <h5 className="mb-3">Basic information</h5>
                <h6 className="mb-3">Product Images</h6>
                <Form.Group controlId="images" className="mb-2">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImages}
                  />
                  <Form.Text>1:1 images.</Form.Text>
                </Form.Group>

                {images.length > 0 && (
                  <Row xs={3} sm={4} md={6} className="g-2 mt-1">
                    {images.map((img, i) => (
                      <Col key={i}>
                        <div className="border rounded overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`preview-${i}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card>

              <Form.Group className="mb-3">
                <Form.Label>Product Name *</Form.Label>
                <Form.Control name="name" value={form.name} onChange={onChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  required
                >
                  <option value="">Please set category</option>
                  <option>Inabel</option>
                  <option>Ikat</option>
                  <option>Kalinga</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Barcode</Form.Label>
                <div>
                  <svg ref={barcodeRef}></svg>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </section>

            {/* Sales Section */}
            <section ref={salesRef} className="mt-4" style={sectionStyle}>
              <h5 className="mb-3">Sales Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price *</Form.Label>
                    <Form.Control
                      name="price"
                      value={form.price}
                      onChange={onChange}
                      type="number"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock *</Form.Label>
                    <Form.Control
                      name="stock"
                      value={form.stock}
                      onChange={onChange}
                      type="number"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </section>

            {/* Others Section */}
            <section ref={othersRef} className="mt-3" style={sectionStyle}>
              <h5 className="mb-3">Others</h5>
              <Form.Group className="mb-3">
                <Form.Label>Condition *</Form.Label>
                <Form.Select
                  name="condition"
                  value={form.condition || ""}
                  onChange={onChange}
                  required
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </Form.Select>
              </Form.Group>
            </section>

            {/* Buttons INSIDE the form */}
            <div className="d-flex gap-2 my-3" style={{ justifyContent: "flex-end" }}>
              <Button variant="light" type="button">Cancel</Button>
              <Button type="submit" variant="danger">Save and Publish</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}