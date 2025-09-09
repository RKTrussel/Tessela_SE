import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import CampaignProgress from "../../Campaign/CampaignProgress";

const SellerDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get("/campaigns");
        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchCampaigns();
    fetchBlogs();
  }, []);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
      {/* To Do List Summary */}
      <div className="p-4 bg-white rounded shadow-sm mb-5">
        <h5 className="mb-4 text-muted text-uppercase">To Do List</h5>
        <Row className="text-center">
          <Col md={6}>
            <Button
              variant="outline-light"
              className="w-100 py-3 rounded"
              onClick={() =>
                navigate("/dashboard/myOrder", { state: { status: "pending" } })
              }
            >
              <h4 className="text-primary mb-1">0</h4>
              <small className="text-muted">To-Process Shipment</small>
            </Button>
          </Col>
          <Col md={6}>
            <Button
              variant="outline-light"
              className="w-100 py-3 rounded"
              onClick={() =>
                navigate("/dashboard/myOrder", { state: { status: "processed" } })
              }
            >
              <h4 className="text-success mb-1">0</h4>
              <small className="text-muted">Processed Shipment</small>
            </Button>
          </Col>
        </Row>
      </div>

      {/* Admin Campaign Section */}
      <div className="p-4 bg-white rounded shadow-sm mb-5">
        <h5 className="mb-4 text-muted text-uppercase">Campaigns</h5>
        {loadingCampaigns ? (
          <Spinner animation="border" size="sm" />
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => {
            const raised = campaign.raisedAmount ?? 0;
            const percent = Math.min((raised / campaign.goalAmount) * 100, 100);

            return (
              <div key={campaign.campaign_id} className="mb-4">
                <h6>{campaign.name}</h6>
                <CampaignProgress progress={percent} />
              </div>
            );
          })
        ) : (
          <p className="text-muted fst-italic">No campaigns yet.</p>
        )}
      </div>

      {/* Blogs Section */}
      <div className="p-4 bg-white rounded shadow-sm">
        <h5 className="mb-4 text-muted text-uppercase">Blogs</h5>
        {loadingBlogs ? (
          <Spinner animation="border" size="sm" />
        ) : blogs.length > 0 ? (
          <Row className="g-3">
            {blogs.slice(0, 3).map((blog) => (
              <Col md={4} key={blog.blog_id}>
                <Card
                  className="h-100 shadow-sm"
                  onClick={() => navigate(`/blogs/${blog.blog_id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {blog.images && blog.images.length > 0 && (
                    <Card.Img
                      variant="top"
                      src={blog.images[0].url}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title className="h6">{blog.title}</Card.Title>
                    <Card.Text className="text-muted small">
                      {blog.author} · {new Date(blog.date).toLocaleDateString()}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted fst-italic">No blog posts yet.</p>
        )}
      </div>
    </Container>
  );
};

export default SellerDashboard;