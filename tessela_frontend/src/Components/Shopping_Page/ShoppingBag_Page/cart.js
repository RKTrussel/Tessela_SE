import { useState, useEffect } from "react";
import { Button, Container, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import CartItem from "./cartItem";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");

      const rawItems =
        Array.isArray(data) ? data :
        Array.isArray(data.items) ? data.items :
        Array.isArray(data.cart?.items) ? data.cart.items :
        [];

      const items = rawItems.map((i) => ({
        product_id: i.product_id ?? i.id,
        name: i.name ?? i.title ?? "—",
        price: Number(i.price ?? 0),
        quantity: Number(i.quantity ?? i.qty ?? 1),
        image: i.image_url ?? i.image ?? i.images?.[0]?.url ?? null,
        selected: Boolean(i.selected),
      }));

      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    }
  };

  const handleQuantityChange = async (productId, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
    try {
      const item = cartItems.find((i) => i.product_id === productId);
      if (!item) return;
      const newQuantity = Math.max(1, (item.quantity || 1) + change);
      await api.put(`/cart/items/${productId}`, { quantity: newQuantity });
    } catch (error) {
      console.error("Error updating quantity:", error);
      fetchCart();
    }
  };

  const handleDelete = async (productId) => {
    setCartItems((prev) => prev.filter((i) => i.product_id !== productId));
    try {
      await api.delete(`/cart/items/${productId}`);
    } catch (error) {
      console.error("Error removing item:", error);
      fetchCart();
    }
  };

  const handleClearCart = async () => {
    setCartItems([]);
    try {
      await api.post("/cart/clear");
    } catch (error) {
      console.error("Error clearing cart:", error);
      fetchCart();
    }
  };

  const handleSelect = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const selectedItems = cartItems.filter((i) => i.selected);
  const totalPrice = selectedItems.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
    0
  );

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    sessionStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
    navigate("/checkout");
  };

  return (
    <Container className="mt-4 mb-5">
      <h3 className="fw-bold mb-4">🛒 Shopping Cart</h3>

      {cartItems.length === 0 ? (
        <Alert variant="info">Your cart is empty. Add some products!</Alert>
      ) : (
        <>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <Button
              variant="outline-danger"
              onClick={handleClearCart}
              disabled={cartItems.length === 0}
            >
              🗑 Clear Cart
            </Button>

            <Button
              variant="success"
              className="px-4"
              disabled={selectedItems.length === 0}
              onClick={handleCheckout}
            >
              ✅ Checkout ({selectedItems.length}) — ₱{totalPrice.toLocaleString()}
            </Button>
          </div>

          <Table striped bordered hover responsive className="bg-white shadow-sm rounded">
            <thead className="table-light">
              <tr>
                <th className="text-center">Select</th>
                <th>Product</th>
                <th className="text-center">Unit Price</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Total</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onDelete={handleDelete}
                  onSelect={handleSelect}
                />
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default Cart;