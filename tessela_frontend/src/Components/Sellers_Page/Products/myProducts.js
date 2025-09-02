import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import useProducts from "./useProduct";
import ProductsToolbar from "./ProductsToolbar";
import ProductsFilters from "./ProductsFilters";
import ProductsTable from "./ProductsTable";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import api from "../../../api";

export default function MyProducts() {
  const {
    state: { filter, page, loading, err, resp },
    setFilter,
    apply,
    reset,
    remove,
    fetchProducts,
  } = useProducts();

  const [deletingId, setDeletingId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    weaving_type: "",
    description: "",
    price: "",
    stock: "",
    condition: "New",
    images: [],
  });
  const [productId, setProductId] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const navigate = useNavigate();
  const rows = resp.data || [];

  const onEdit = (id) => {
    setProductId(id);

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setFormData({
          name: response.data.name,
          weaving_type: response.data.weaving_type,
          description: response.data.description,
          price: response.data.price,
          stock: response.data.stock,
          condition: response.data.condition,
          barcode_value: response.data.barcode_value,
          images: [],
        });
        setEditModalOpen(true);
      } catch (err) {
        console.error("Failed to load product.");
      }
    };

    fetchProduct();
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;
    try {
      setDeletingId(id);
      await remove(id);
      fetchProducts(page); // Reload current page
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append("name", formData.name);
    form.append("weaving_type", formData.weaving_type);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("stock", formData.stock);
    form.append("condition", formData.condition);
    form.append("_method", "PUT");

    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((img) => {
        form.append("images[]", img);
      });
    }

    setLoadingEdit(true);
    try {
      const response = await api.post(`/products/${productId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Updated Product Response:", response.data);
      alert(`Product updated successfully! ID: ${response.data.product_id}`);
    } catch (err) {
      console.error("Failed to update product", err.response?.data || err);
      alert("Failed to update product.");
    } finally {
      fetchProducts(page);
      setLoadingEdit(false);
    }
  };

  return (
    <Container fluid className="p-3">
      <h4 className="mb-3">My Products</h4>

      <ProductsToolbar onAdd={() => navigate("/dashboard/myProduct/addProduct")} />

      <ProductsFilters
        search={filter.search}
        weaving_type={filter.weaving_type}
        onChange={(n) => setFilter({ ...filter, ...n })}
        onApply={apply}
        onReset={reset}
        disabled={loading}
      />

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading products...</p>
        </div>
      )}

      {err && (
        <Alert variant="danger">
          <strong>Error:</strong> {err}
        </Alert>
      )}

      {!loading && !err && (
        <ProductsTable
          rows={rows}
          loading={loading}
          error={err}
          page={page}
          lastPage={resp.last_page}
          onPrev={() => fetchProducts(page - 1)}
          onNext={() => fetchProducts(page + 1)}
          onEdit={onEdit}
          onDelete={onDelete}
          deletingId={deletingId}
        />
      )}

      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="weaving_type">
              <Form.Label>Weaving Type</Form.Label>
              <Form.Control
                type="text"
                name="weaving_type"
                value={formData.weaving_type}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="condition">
              <Form.Label>Condition</Form.Label>
              <Form.Control
                as="select"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="images">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
              />
            </Form.Group>

            <Button className="mt-2" variant="primary" type="submit" disabled={loadingEdit}>
              {loadingEdit ? "Updating..." : "Update Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}