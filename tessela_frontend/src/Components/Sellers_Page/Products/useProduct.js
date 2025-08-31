import { useCallback, useEffect, useState } from "react";
import api from "../../../api";

export default function useProducts() {
  const [filter, setFilter] = useState({ search: "", weaving_type: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [resp, setResp] = useState({ data: [], current_page: 1, last_page: 1 });

  const fetchProducts = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/products", {
        params: {
          page: p,
          per_page: 10,
          ...(filter.search ? { search: filter.search } : {}),
          ...(filter.weaving_type ? { weaving_type: filter.weaving_type } : {}),
        },
      });
      setResp(res.data);
      setPage(res.data.current_page);
    } catch (e) {
      console.error(e);
      setErr("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const apply = () => fetchProducts(1);

  const reset = () => {
    setFilter({ search: "", weaving_type: "" });
    fetchProducts(1);
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts(page);
  };

  return {
    state: { filter, page, loading, err, resp },
    setFilter,
    fetchProducts,
    apply,
    reset,
    remove,
    setPage,
  };
}