import { useState } from "react";
import api from "../../api";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddCampaign = () => {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const defaultEnd = thirtyDaysLater.toISOString().split("T")[0];

  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    goalAmount: "",
    start_date: today,
    end_date: defaultEnd,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCampaignData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setCampaignData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(campaignData).forEach(([key, value]) => {
        if (key === "images" && value.length > 0) {
          value.forEach((img) => formData.append("images[]", img));
        } else {
          formData.append(key, value);
        }
      });

      await api.post("/campaigns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/dashboard/myCampaign");
    } catch (error) {
      console.error("Error adding campaign:", error);
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm p-4">
            <h2 className="mb-4">Create New Campaign</h2>

            <Form onSubmit={handleSubmit}>
              {/* Campaign Name */}
              <Form.Group className="mb-3">
                <Form.Label>Campaign Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter campaign name"
                  name="name"
                  value={campaignData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe your campaign..."
                  name="description"
                  value={campaignData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Goal Amount */}
              <Form.Group className="mb-3">
                <Form.Label>Goal Amount (₱)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter goal amount"
                  name="goalAmount"
                  value={campaignData.goalAmount}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </Form.Group>

              {/* Dates */}
              <Row className="mb-3">
                <Col>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={campaignData.start_date}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={campaignData.end_date}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>

              {/* Images */}
              <Form.Group className="mb-3">
                <Form.Label>Upload Images</Form.Label>
                <Form.Control
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                />
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {campaignData.images.length > 0 &&
                    campaignData.images.map((file, idx) => (
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

              {/* Buttons */}
              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/dashboard/myCampaign")}
                  type="button"
                >
                  Cancel
                </Button>
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Create Campaign"
                  )}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCampaign;