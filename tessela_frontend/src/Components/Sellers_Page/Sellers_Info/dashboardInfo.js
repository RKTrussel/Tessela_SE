import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import CampaignProgress from "../../Campaign/CampaignProgress";

const SellerDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get("/campaigns"); // Fetch campaigns from API
        setCampaigns(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa' }}>

      {/* To Do List Summary */}
      <div className="p-4 bg-white rounded shadow-sm mb-5">
        <h5 className="mb-4 text-muted text-uppercase">To Do List</h5>
        <Row className="text-center">
          <Col md={6}>
            <Button
              variant="outline-light"
              className="w-100 py-3 rounded"
              onClick={() => navigate("/dashboard/myOrder", { state: { status: "pending" } })}
            >
              <h4 className="text-primary mb-1">0</h4>
              <small className="text-muted">To-Process Shipment</small>
            </Button>
          </Col>
          <Col md={6}>
            <Button
              variant="outline-light"
              className="w-100 py-3 rounded"
              onClick={() => navigate("/dashboard/myOrder", { state: { status: "processed" } })}
            >
              <h4 className="text-success mb-1">0</h4>
              <small className="text-muted">Processed Shipment</small>
            </Button>
          </Col>
        </Row>
      </div>

      {/* Admin Campaign Section */}
      <div className="p-4 bg-white rounded shadow-sm">
        <h5 className="mb-4 text-muted text-uppercase">Campaigns</h5>
        {loading ? (
          <p>Loading campaigns...</p>
        ) : (
          <div>
            {campaigns.map((campaign) => {
              const raised = campaign.raisedAmount ?? 0; // fallback to 0 if undefined
              const percent = Math.min((raised / campaign.goalAmount) * 100, 100);

              return (
                <div key={campaign.campaign_id} className="mb-4">
                  <h6>{campaign.name}</h6>
                  <CampaignProgress progress={percent} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

export default SellerDashboard;