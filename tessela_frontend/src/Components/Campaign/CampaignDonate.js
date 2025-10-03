import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import ProgressBar from "react-bootstrap/ProgressBar";
import Carousel from "react-bootstrap/Carousel";

import DonateForm from "./DonateForm";
import RecentDonations from "./RecentDonations";
import { fmtDate, fmtMoneyNoDecimals, statusColor } from "./utils";

export default function CampaignDonate({ campaignId }) {
  const [campaign, setCampaign] = useState(null);
  const [progress, setProgress] = useState({ raised: 0, goal: 0 });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const ctrl = new AbortController();
      const [cRes, dRes] = await Promise.all([
        api.get(`/campaigns/${campaignId}`, { signal: ctrl.signal }),
        api.get(`/campaigns/${campaignId}/donations`, { signal: ctrl.signal }),
      ]);

      const c = Array.isArray(cRes.data)
        ? cRes.data.find((x) => x.campaign_id === campaignId)
        : cRes.data;

      setCampaign(c || null);
      setProgress(dRes.data?.progress || { raised: 0, goal: c?.goalAmount || 0 });
      setDonations(dRes.data?.donations || []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, [campaignId]);

  const pct = useMemo(() => {
    const { raised, goal } = progress;
    if (!goal || goal <= 0) return 0;
    return Math.min(100, Math.round((Number(raised) / Number(goal)) * 100));
  }, [progress]);

  if (loading) {
    return (
      <Container className="py-4">
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Loading…</span>
        </div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger"><strong>Oops!</strong> {error}</Alert>
      </Container>
    );
  }
  if (!campaign) {
    return (
      <Container className="py-4">
        <Alert variant="secondary">Campaign not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 1000 }}>
      <Row className="mb-3">
        <Col>
          <h1 className="h3 mb-1">{campaign.name}</h1>
          <div className="text-muted">
            Recipient: <strong>{campaign.recipient}</strong>
          </div>
          <div className="text-muted">
            From {fmtDate(campaign.start_date)} to {fmtDate(campaign.end_date)} ·{" "}
            <Badge bg={statusColor(campaign.status)} className="text-uppercase">
              {campaign.status}
            </Badge>
          </div>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={7}>
          <Card className="shadow-sm mb-4">
            {campaign.images?.length > 0 && (
              campaign.images.length === 1 ? (
                <Card.Img
                  variant="top"
                  src={`${(api.defaults.baseURL || "").replace(/\/api\/?$/, "")}/storage/${campaign.images[0].image_path}`}
                  alt={campaign.name}
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              ) : (
                <Carousel interval={4000} fade>
                  {campaign.images.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        src={`${(api.defaults.baseURL || "").replace(/\/api\/?$/, "")}/storage/${img.image_path}`}
                        alt={`${campaign.name} ${idx + 1}`}
                        className="d-block w-100"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )
            )}
            <Card.Body>
              <Card.Text>{campaign.description}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <div className="mb-2">
                <ProgressBar now={pct} animated={pct > 0 && pct < 100} />
              </div>
              <div className="d-flex justify-content-between small mb-3">
                <span>₱{fmtMoneyNoDecimals(progress.raised)} raised</span>
                <span className="text-muted">{pct}% funded</span>
                <span>Goal: ₱{fmtMoneyNoDecimals(campaign.goalAmount)}</span>
              </div>

              <DonateForm campaignId={campaignId} onDone={fetchAll} goal={campaign.goalAmount} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="h5">Recent Donations</Card.Title>
              <RecentDonations donations={donations} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}