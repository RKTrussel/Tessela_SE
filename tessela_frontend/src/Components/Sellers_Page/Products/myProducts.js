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
  const [productId, setProductId] = useState(null); // Store product id for editing
  const [loadingEdit, setLoadingEdit] = useState(false);
  const navigate = useNavigate();
  const rows = resp.data || [];

  const onEdit = (id) => {
    // Fetch product details to populate the form inside the modal
    setProductId(id);  // Store product ID for later use

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
        setEditModalOpen(true);  // Open modal after product is loaded
      } catch (err) {
        console.error("Failed to load product.");
      }
    };

    fetchProduct();  // Call the function to load product details
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;
    try {
      setDeletingId(id);  // Start deleting process
      await remove(id);   // Remove the product
      fetchProducts(page); // Reload current page to reflect changes
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    } finally {
      setDeletingId(null); // End deleting process
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
    const files = Array.from(e.target.files); // Convert the FileList object into an array
    setFormData((prevData) => ({
      ...prevData,
      images: files, // Store the images as an array
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    // Append all your fields
    form.append("name", formData.name);
    form.append("weaving_type", formData.weaving_type);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("stock", formData.stock);
    form.append("condition", formData.condition);

    // Append _method to spoof PUT
    form.append("_method", "PUT");

    // Append images if present
    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((img) => {
        form.append("images[]", img);
      });
    }

    setLoadingEdit(true);
    try {
      const response = await api.post(`/products/${productId}`, form, {
        headers: {
          // "Content-Type: multipart/form-data" not supported on PUT; use _method='PUT' in FormData instead
          "Content-Type": "multipart/form-data", 
        },
      });
      console.log("Updated Product Response:", response.data);
      alert("Product updated successfully!");
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

      {/* Add Product Button */}
      <ProductsToolbar onAdd={() => navigate("/dashboard/myProduct/addProduct")} />

      {/* Filters Component */}
      <ProductsFilters
        search={filter.search}
        weaving_type={filter.weaving_type}
        onChange={(n) => setFilter({ ...filter, ...n })}
        onApply={apply}
        onReset={reset}
        disabled={loading}
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {err && (
        <Alert variant="danger">
          <strong>Error:</strong> {err}
        </Alert>
      )}

      {/* Products Table */}
      {!loading && !err && (
        <ProductsTable
          rows={rows}
          loading={loading}
          error={err}
          page={page}
          lastPage={resp.last_page}
          onPrev={() => fetchProducts(page - 1)}
          onNext={() => fetchProducts(page + 1)}
          onEdit={onEdit} // Edit handler passed here
          onDelete={onDelete}
          deletingId={deletingId}
        />
      )}

      {/* Modal for Editing Product */}
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
