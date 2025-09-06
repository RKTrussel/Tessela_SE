import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";

export default function CampaignDirectory({ onOpen }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const pageSize = 8;

  const load = async (signal) => {
    try {
      setLoading(true);
      setErr(null);
      const res = await api.get("/campaigns", {
        params: { q: q || undefined, status: status !== "all" ? status : undefined },
        signal, // ✅ axios v1 cancellation
      });
      const data = res?.data;
      setItems(Array.isArray(data) ? data : data?.data || []);
      setPage(1);
    } catch (e) {
      // axios v1 cancel markers
      if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to load campaigns";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  // debounce q/status changes
  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => load(ctrl.signal), 300);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q, status]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((c) => {
      const okStatus = status === "all" ? true : c.status === status;
      const okQ =
        !needle ||
        (c.name && c.name.toLowerCase().includes(needle)) ||
        (c.description && c.description.toLowerCase().includes(needle));
      return okStatus && okQ;
    });
  }, [items, q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{ color: "red" }}>{err}</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <h1>Donation Campaigns</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Search campaigns…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 8 }}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>
        <button onClick={() => load()}>Refresh</button>
      </div>

      {filtered.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {slice.map((c) => (
              <div key={c.campaign_id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
                <Thumb imagePath={c.images?.[0]?.image_path} alt={c.name} />
                <h3 style={{ margin: "10px 0 6px" }}>{c.name}</h3>
                <p style={{ margin: "0 0 6px", color: "#555" }}>
                  {fmtDate(c.start_date)} – {fmtDate(c.end_date)} · {c.status}
                </p>
                <ProgressWithText raised={c.raised} goal={c.goalAmount} />
                <p style={{ marginTop: 8 }}>{trim(c.description, 120)}</p>
                <button onClick={() => (window.location.href = `/donate/${c.campaign_id}`)}>
                    View / Donate
                    </button>

              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginTop: 16 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              Prev
            </button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* --- helpers --- */
function Thumb({ imagePath, alt }) {
  if (!imagePath) return null;

  // derive http://127.0.0.1:8000 from your api baseURL "http://127.0.0.1:8000/api"
  const API_ORIGIN = (api.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const src = `${API_ORIGIN}/storage/${imagePath}`;

  return (
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }}
      loading="lazy"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}


function ProgressWithText({ raised, goal }) {
  const percent = pct(raised ?? 0, goal ?? 0);
  return (
    <>
      <ProgressBar percent={percent} />
      <small>₱{fmtMoney(raised || 0)} / ₱{fmtMoney(goal || 0)}</small>
    </>
  );
}

function fmtMoney(n) {
  return Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}
function pct(raised, goal) {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((Number(raised) / Number(goal)) * 100));
}
function trim(txt = "", n = 120) {
  const s = String(txt);
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
function ProgressBar({ percent }) {
  return (
    <div style={{ background: "#eee", borderRadius: 8, overflow: "hidden", margin: "6px 0" }}>
      <div style={{ width: percent + "%", background: "green", height: 10 }} />
    </div>
  );
}
