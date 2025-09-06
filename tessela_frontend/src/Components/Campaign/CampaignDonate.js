import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";

export default function CampaignDonate({ campaignId }) {
  const [campaign, setCampaign] = useState(null);
  const [progress, setProgress] = useState({ raised: 0, goal: 0 });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        ? cRes.data.find((x) => x.campaign_id == campaignId)
        : cRes.data;
      setCampaign(c);
      setProgress(dRes.data?.progress || { raised: 0, goal: c?.goalAmount || 0 });
      setDonations(dRes.data?.donations || []);
    } catch (e) {
      setError(
        e?.response?.data?.message || e?.message || "Failed to load campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [campaignId]);

  const pct = useMemo(() => {
    const { raised, goal } = progress;
    if (!goal || goal <= 0) return 0;
    return Math.min(100, Math.round((Number(raised) / Number(goal)) * 100));
  }, [progress]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!campaign) return <div>Campaign not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>{campaign.name}</h1>
      <p>{campaign.description}</p>
      <p>
        From {fmtDate(campaign.start_date)} to {fmtDate(campaign.end_date)} ·{" "}
        {campaign.status}
      </p>

      <div>
        <ProgressBar percent={pct} />
        <p>
          ₱{fmtMoney(progress.raised)} raised of ₱{fmtMoney(campaign.goalAmount)} goal
        </p>
      </div>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}>
        <DonateForm campaignId={campaignId} onDone={fetchAll} />
        <RecentDonations donations={donations} />
      </div>
    </div>
  );
}

function DonateForm({ campaignId, onDone }) {
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState("");
  const [forceFail, setForceFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await api.post(`/campaigns/${campaignId}/donations`, {
        amount: Number(amount),
        message,
        force_fail: forceFail,
      });
      setResult(data);
      onDone();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ border: "1px solid #ccc", padding: 16 }}>
      <h2>Donate</h2>
      <label>
        Amount (PHP)
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="0.01"
        />
      </label>
      <br />
      <label>
        Message
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={forceFail}
          onChange={(e) => setForceFail(e.target.checked)}
        />{" "}
        Simulate failure (dev)
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? "Processing…" : "Donate"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <p>
          {result.payment_status === "paid"
            ? `Thank you! Ref: ${result.payment_ref}`
            : `Status: ${result.payment_status}`}
        </p>
      )}
    </form>
  );
}

function RecentDonations({ donations }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16 }}>
      <h2>Recent Donations</h2>
      {donations.length === 0 ? (
        <p>No donations yet.</p>
      ) : (
        <ul>
          {donations.map((d) => (
            <li key={d.donation_id}>
              ₱{fmtMoney(d.amount)} – {fmtDate(d.created_at)}
              {d.message && <div>“{d.message}”</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div style={{ background: "#eee", borderRadius: 8, overflow: "hidden" }}>
      <div
        style={{
          width: percent + "%",
          background: "green",
          height: 12,
        }}
      />
      <small>{percent}% funded</small>
    </div>
  );
}

// Helpers
function fmtMoney(n) {
  return Number(n || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}