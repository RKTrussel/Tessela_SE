import React from "react";
import { ListGroup } from "react-bootstrap";
import { fmtDate, fmtMoneyNoDecimals } from "./utils";

export default function RecentDonations({ donations }) {
  if (!donations?.length) {
    return <div className="text-muted fst-italic">No donations yet.</div>;
  }
  return (
    <ListGroup variant="flush" className="mt-2">
      {donations.map((d) => (
        <ListGroup.Item key={d.donation_id} className="py-2">
          <div className="d-flex justify-content-between">
            <div>
              <span className="fw-bold text-success">₱{fmtMoneyNoDecimals(d.amount)}</span>
              <div className="text-muted small">{fmtDate(d.created_at)}</div>
              {d.message && (
                <div className="mt-1 fst-italic text-dark">“{d.message}”</div>
              )}
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}