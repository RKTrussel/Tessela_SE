import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useProducts from "./useProduct";
import ProductsToolbar from "./ProductsToolbar";
import ProductsFilters from "./ProductsFilters";
import ProductsTable from "./ProductsTable";

export default function MyProducts() {
  const {
    state: { filter, page, loading, err, resp },
    setFilter,
    apply,
    reset,
    remove,
    setPage,
    fetchProducts,
  } = useProducts();

  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const rows = resp.data || [];

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;
    try {
      setDeletingId(id);
      await remove(id);
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container fluid className="p-3">
      <h4 className="mb-3">My Products</h4>

      <ProductsToolbar onAdd={() => navigate("/dashboard/myProduct")} />

      <ProductsFilters
        search={filter.search}
        category={filter.category}
        onChange={(n) => setFilter({ ...filter, ...n })}
        onApply={apply}
        onReset={reset}
        disabled={loading}
      />

      <ProductsTable
        rows={rows}
        loading={loading}
        error={err}
        page={page}
        lastPage={resp.last_page}
        onPrev={() => fetchProducts(page - 1)}
        onNext={() => fetchProducts(page + 1)}
        onEdit={(id) => navigate(`/dashboard/myProduct/${id}/edit`)}
        onDelete={onDelete}
        deletingId={deletingId}
      />
    </Container>
  );
}