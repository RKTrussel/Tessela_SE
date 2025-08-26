import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Pagination from "react-bootstrap/Pagination";

export default function ProductsTable({
  rows,
  loading,
  error,
  page,
  lastPage,
  onPrev,
  onNext,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Product(s)</th>
            <th>Sales</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Content Quality</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-5">Loading…</td></tr>
          ) : error ? (
            <tr><td colSpan={6} className="text-center py-5 text-danger">{error}</td></tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-5 text-muted">
                <div><div style={{ fontSize: "48px" }}>📦</div>No Product Found</div>
              </td>
            </tr>
          ) : (
            rows.map((p) => {
              const quality = Number(p.content_quality ?? 0);
              const variant = quality >= 80 ? "success" : quality >= 50 ? "warning" : "danger";
              return (
                <tr key={p.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={p.images?.[0]?.url || "https://via.placeholder.com/56x56?text=No+Img"}
                        alt={p.name}
                        width={56}
                        height={56}
                        style={{ objectFit: "cover", borderRadius: 6 }}
                      />
                      <div>
                        <div className="fw-semibold">{p.name}</div>
                        <div className="text-muted small">
                          #{p.id} • {p.category} • {p.barcode_value}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>—</td>
                  <td>₱{Number(p.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>{p.stock}</td>
                  <td style={{ minWidth: 180 }}>
                    <div className="mb-1 text-end">{quality}%</div>
                    <ProgressBar now={quality} variant={variant} />
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => onEdit(p.id)}
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={deletingId === p.id}
                      onClick={() => onDelete(p.id)}
                    >
                      {deletingId === p.id ? "Deleting..." : "Delete"}
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {rows.length > 0 && (
        <div className="d-flex justify-content-end">
          <Pagination className="mb-0">
            <Pagination.Prev disabled={page <= 1} onClick={onPrev} />
            <Pagination.Item active>{page}</Pagination.Item>
            <Pagination.Next disabled={page >= lastPage} onClick={onNext} />
          </Pagination>
        </div>
      )}
    </>
  );
}
