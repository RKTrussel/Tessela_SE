import React, { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import api from "../../api";

/* ---------- helpers ---------- */
const fmtMoney = (n) =>
  Number(n || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

/* ============================== */
/*           COMPONENT            */
/* ============================== */
export default function MyCampaign() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [closing, setClosing] = useState({}); // per-row loading map
  const navigate = useNavigate();

  /* ---------- progress hydrator (batch -> per-campaign fallback) ---------- */
  const hydrateProgress = useCallback(async (list) => {
    if (!list?.length) return;
    const ids = list.map((c) => c.campaign_id);

    try {
      // Optional batch endpoint; if not present, fallback below will handle it
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
      // Fallback: fetch each campaign's donations/progress
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
          _progress: byId[c.campaign_id] ? byId[c.campaign_id] : c._progress,
        }))
      );
    }
  }, []);

  /* ---------- fetch campaigns (uses ?q= to match your controller) ---------- */
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/campaigns", {
        params: { q: search || undefined }, // <— your index() expects 'q'
      });

      const list = Array.isArray(data) ? data : data?.items || [];

      // Pre-seed progress from API if present
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
      console.error("Failed to fetch campaigns:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to fetch campaigns"
      );
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [search, hydrateProgress]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  /* ---------- close campaign (NO PATCH; use PUT, fallback to POST /close if you add it) ---------- */
  const requestCloseCampaign = useCallback(async (id) => {
    // Primary: PUT /campaigns/{id} with {status:'closed'}
    try {
      return await api.put(`/campaigns/${id}`, { status: "closed" });
    } catch (e1) {
      // Optional: if you later add an action route
      if (e1?.response?.status === 404 || e1?.response?.status === 405) {
        return await api.post(`/campaigns/${id}/close`);
      }
      throw e1;
    }
  }, []);

  const handleCloseCampaign = useCallback(
    async (id) => {
      if (!window.confirm("Close this campaign? This will stop new donations.")) return;

      setClosing((m) => ({ ...m, [id]: true }));
      setError(null);

      // Optimistic UI
      setCampaigns((prev) =>
        prev.map((c) => (c.campaign_id === id ? { ...c, status: "closed" } : c))
      );

      try {
        await requestCloseCampaign(id);
        await fetchCampaigns(); // refresh to ensure server truth
      } catch (err) {
        console.error("Failed to close campaign:", err);
        // Rollback
        setCampaigns((prev) =>
          prev.map((c) => (c.campaign_id === id ? { ...c, status: "active" } : c))
        );
        setError(
          err?.response?.data?.message || err?.message || "Failed to close campaign"
        );
      } finally {
        setClosing((m) => ({ ...m, [id]: false }));
      }
    },
    [fetchCampaigns, requestCloseCampaign]
  );

  /* ---------- render ---------- */
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
          <Col>
            <Alert variant="danger" className="py-2 mb-0">
              {error}
            </Alert>
          </Col>
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
                    <div>
                      <div style={{ fontSize: 48 }}>📢</div>
                      No Campaigns Found
                    </div>
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => {
                  const raised = Number(c?._progress?.raised ?? c.raisedAmount ?? 0);
                  const goal = Number(c?._progress?.goal ?? c.goalAmount ?? 0);
                  const percent =
                    goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

                  return (
                    <tr key={c.campaign_id}>
                      <td>#{c.campaign_id}</td>
                      <td>{c.name}</td>
                      <td>₱{fmtMoney(goal)}</td>
                      <td>₱{fmtMoney(raised)}</td>
                      <td>
                        <div className="d-flex flex-column">
                          <ProgressBar
                            now={percent}
                            label={`${percent}%`}
                            variant={percent >= 100 ? "success" : "info"}
                          />
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
                            disabled={!!closing[c.campaign_id]}
                            onClick={() => handleCloseCampaign(c.campaign_id)}
                          >
                            {closing[c.campaign_id] ? (
                              <>
                                <Spinner size="sm" animation="border" className="me-1" />
                                Closing…
                              </>
                            ) : (
                              "Close"
                            )}
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
}