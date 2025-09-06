import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const MyCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    try {
      const { data } = await api.get("/campaigns", {
        params: { search: search || undefined },
      });
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line
  }, [search]);

  const handleCloseCampaign = async (id) => {
    try {
      await api.patch(`/campaigns/${id}/status`, { status: "closed" });
      fetchCampaigns();
    } catch (err) {
      console.error("Failed to close campaign:", err);
    }
  };

  return (
    <Container fluid>
      <Row className="my-4">
        <Col>
          <h4>My Campaigns</h4>
        </Col>
        <Col className="text-end">
          <Button onClick={() => navigate("/dashboard/myCampaign/addCampaign")}>
            + Add Campaign
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <input
            type="text"
            className="form-control"
            placeholder="Search campaign"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={8} className="d-flex justify-content-end">
          <Button variant="outline-secondary" onClick={() => setSearch("")}>
            Reset
          </Button>
        </Col>
      </Row>

      {/* Campaigns Table */}
      <Row>
        <Col>
          <Table bordered responsive className="bg-white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Campaign</th>
                <th>Goal</th>
                <th>Raised</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center">Loading...</td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted">
                    <div>
                      <div style={{ fontSize: "48px" }}>📢</div>
                      No Campaigns Found
                      <div className="mt-2">
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => {
                  const raised = c.raisedAmount ?? 0;
                  const percent = Math.min((raised / c.goalAmount) * 100, 100);

                  return (
                    <tr key={c.campaign_id}>
                      <td>#{c.campaign_id}</td>
                      <td>{c.name}</td>
                      <td>₱{c.goalAmount}</td>
                      <td>₱{raised}</td>
                      <td className="text-center align-middle">
                        <div style={{ margin: "0 auto" }}>
                          <ProgressBar
                            now={percent}
                            label={`${Math.round(percent)}%`}
                            variant={percent >= 100 ? "success" : "info"}
                          />
                        </div>
                      </td>
                      <td>{c.status}</td>
                      <td>{new Date(c.created_at).toLocaleString()}</td>
                      <td className="d-flex gap-2">
                        {c.status === "active" && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleCloseCampaign(c.campaign_id)}
                          >
                            Close
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default MyCampaign;