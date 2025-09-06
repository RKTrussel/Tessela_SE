import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Table, Button, ProgressBar, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const fmtMoney = (n) =>
  Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

const MyCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/campaigns", {
        params: { search: search || undefined },
      });

      // Normalize array
      const list = Array.isArray(data) ? data : (data?.items || []);
      // Pre-seed raised/goal from API if present (handles backends that already include raisedAmount)
      const seeded = list.map((c) => ({
        ...c,
        _progress: {
          raised: c.raisedAmount ?? c.totalRaised ?? 0,
          goal: c.goalAmount ?? c.goal ?? 0,
        },
      }));

      setCampaigns(seeded);

      // Fetch up-to-date progress for all campaigns (batch if available; fallback per-campaign)
      await hydrateProgress(seeded);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to fetch campaigns");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Try batch progress first, else fallback to per-campaign
  const hydrateProgress = async (list) => {
    if (!list?.length) return;
    const ids = list.map((c) => c.campaign_id);

    try {
      // OPTIONAL batch endpoint: /campaigns/progress?ids=1,2,3
      const { data } = await api.get("/campaigns/progress", {
        params: { ids: ids.join(",") },
      });
      // Expect shape: { [campaign_id]: { raised, goal } } OR [{campaign_id, raised, goal}]
      const dict = Array.isArray(data)
        ? data.reduce((acc, x) => {
            acc[x.campaign_id] = { raised: Number(x.raised || 0), goal: Number(x.goal || 0) };
            return acc;
          }, {})
        : data;

      setCampaigns((prev) =>
        prev.map((c) => ({
          ...c,
          _progress: dict?.[c.campaign_id]
            ? {
                raised: Number(dict[c.campaign_id].raised || 0),
                goal: Number(dict[c.campaign_id].goal || c.goalAmount || 0),
              }
            : c._progress, // keep seeded if batch didn't include it
        }))
      );
    } catch (batchErr) {
      // Fallback: fetch each campaign's donations/progress
      console.info("Batch progress not available; falling back per-campaign.", batchErr?.message);
      const results = await Promise.allSettled(
        ids.map((id) => api.get(`/campaigns/${id}/donations`))
      );
      const byId = {};
      results.forEach((res, i) => {
        const id = ids[i];
        if (res.status === "fulfilled") {
          const p = res.value?.data?.progress;
          if (p) byId[id] = { raised: Number(p.raised || 0), goal: Number(p.goal || 0) };
        }
      });
      setCampaigns((prev) =>
        prev.map((c) => ({
          ...c,
          _progress: byId[c.campaign_id]
            ? byId[c.campaign_id]
            : c._progress, // keep what we have
        }))
      );
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCloseCampaign = async (id) => {
    try {
      await api.patch(`/campaigns/${id}/status`, { status: "closed" });
      fetchCampaigns();
    } catch (err) {
      console.error("Failed to close campaign:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to close campaign");
    }
  };

  return (
    <Container fluid>
      <Row className="my-4">
        <Col><h4>My Campaigns</h4></Col>
        <Col className="text-end">
          <Button onClick={() => navigate("/dashboard/myCampaign/addCampaign")}>
            + Add Campaign
          </Button>
        </Col>
      </Row>

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
        <Col md={8} className="d-flex justify-content-end gap-2">
          <Button variant="outline-secondary" onClick={() => setSearch("")}>
            Reset
          </Button>
        </Col>
      </Row>

      {error && (
        <Row className="mb-2">
          <Col><div className="text-danger">{error}</div></Col>
        </Row>
      )}

      <Row>
        <Col>
          <Table bordered responsive className="bg-white align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Campaign</th>
                <th>Goal</th>
                <th>Raised</th>
                <th style={{ width: 220 }}>Progress</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    <Spinner animation="border" size="sm" /> Loading…
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted">
                    <div><div style={{ fontSize: 48 }}>📢</div>No Campaigns Found</div>
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => {
                  const raised = Number(c?._progress?.raised ?? c.raisedAmount ?? 0);
                  const goal = Number(c?._progress?.goal ?? c.goalAmount ?? 0);
                  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

                  return (
                    <tr key={c.campaign_id}>
                      <td>#{c.campaign_id}</td>
                      <td>{c.name}</td>
                      <td>₱{fmtMoney(goal)}</td>
                      <td>₱{fmtMoney(raised)}</td>
                      <td>
                        <div className="d-flex flex-column">
                          <ProgressBar now={percent} label={`${percent}%`} variant={percent >= 100 ? "success" : "info"} />
                          <small className="text-muted mt-1">{percent}% funded</small>
                        </div>
                      </td>
                      <td>{c.status}</td>
                      <td>{fmtDateTime(c.created_at)}</td>
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