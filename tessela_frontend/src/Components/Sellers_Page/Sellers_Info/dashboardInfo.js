import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import CampaignProgress from "../../Campaign/CampaignProgress";

const SellerDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /* ---------- helpers ---------- */
  const hydrateProgress = useCallback(async (list) => {
    if (!list?.length) return;
    const ids = list.map((c) => c.campaign_id);

    try {
      // Try batch progress
      const { data } = await api.get("/campaigns/progress", {
        params: { ids: ids.join(",") },
      });

      const dict = Array.isArray(data)
        ? data.reduce((acc, x) => {
            acc[x.campaign_id] = {
              raised: Number(x.raised || 0),
              goal: Number(x.goal || 0),
            };
            return acc;
          }, {})
        : data;

      setCampaigns((prev) =>
        prev.map((c) => ({
          ...c,
          _progress: dict?.[c.campaign_id]
            ? {
                raised: Number(dict[c.campaign_id].raised || 0),
                goal: Number(
                  dict[c.campaign_id].goal || c.goalAmount || c.goal || 0
                ),
              }
            : c._progress,
        }))
      );
    } catch (_batchErr) {
      // fallback per campaign
      const results = await Promise.allSettled(
        ids.map((id) => api.get(`/campaigns/${id}/donations`))
      );
      const byId = {};
      results.forEach((res, i) => {
        const id = ids[i];
        if (res.status === "fulfilled") {
          const p = res.value?.data?.progress;
          if (p)
            byId[id] = {
              raised: Number(p.raised || 0),
              goal: Number(p.goal || 0),
            };
        }
      });
      setCampaigns((prev) =>
        prev.map((c) => ({
          ...c,
          _progress: byId[c.campaign_id]
            ? byId[c.campaign_id]
            : c._progress,
        }))
      );
    }
  }, []);

  /* ---------- fetch campaigns ---------- */
  const fetchCampaigns = useCallback(async () => {
    setLoadingCampaigns(true);
    setError(null);
    try {
      const { data } = await api.get("/campaigns");
      const list = Array.isArray(data) ? data : data?.items || [];

      const seeded = list.map((c) => ({
        ...c,
        _progress: {
          raised: Number(c.raisedAmount ?? c.totalRaised ?? 0),
          goal: Number(c.goalAmount ?? c.goal ?? 0),
        },
      }));

      setCampaigns(seeded);
      await hydrateProgress(seeded);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError(err?.message || "Failed to fetch campaigns");
    } finally {
      setLoadingCampaigns(false);
    }
  }, [hydrateProgress]);

  const fetchBlogs = useCallback(async () => {
    setLoadingBlogs(true);
    try {
      const { data } = await api.get("/blogs");
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoadingBlogs(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
    fetchBlogs();
  }, [fetchCampaigns, fetchBlogs]);

  /* ---------- render ---------- */
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

      {/* Campaigns Section */}
      <div className="p-4 bg-white rounded shadow-sm mb-5">
        <h5 className="mb-4 text-muted text-uppercase">Campaigns</h5>

        {loadingCampaigns ? (
          <Spinner animation="border" size="sm" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : campaigns.length > 0 ? (
          campaigns.map((c) => {
            const raised = Number(c?._progress?.raised ?? 0);
            const goal = Number(c?._progress?.goal ?? 0);
            const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

            return (
              <div key={c.campaign_id} className="mb-4">
                <h6>{c.name}</h6>
                <CampaignProgress progress={percent} />
                <small className="text-muted">
                  ₱{raised.toLocaleString()} raised of ₱{goal.toLocaleString()} ({percent}%)
                </small>
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