import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import CartItem from "./cartItem";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');

      const rawItems =
        Array.isArray(data) ? data :
        Array.isArray(data.items) ? data.items :
        Array.isArray(data.cart?.items) ? data.cart.items :
        [];

      const items = rawItems.map(i => ({
        id: i.product_id ?? i.id,
        name: i.name ?? i.title ?? '—',
        price: Number(i.price ?? 0),
        quantity: Number(i.quantity ?? i.qty ?? 1),
        image:
          i.image_url ??
          i.image ??
          i.images?.[0]?.url ??
          null,
        selected: Boolean(i.selected),
      }));

      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    }
  };

  // 🔹 Update quantity (+ / −)
  const handleQuantityChange = async (id, change) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
    try {
      const item = cartItems.find(i => i.id === id);
      if (!item) return;
      const newQuantity = Math.max(1, (item.quantity || 1) + change);
      await api.put(`/cart/items/${id}`, { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
      fetchCart(); // fallback sync
    }
  };

  // 🔹 Delete single item
  const handleDelete = async (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
    try {
      await api.delete(`/cart/items/${id}`);
    } catch (error) {
      console.error('Error removing item:', error);
      fetchCart();
    }
  };

  // 🔹 Clear all items
  const handleClearCart = async () => {
    setCartItems([]);
    try {
      await api.post("/cart/clear");
    } catch (error) {
      console.error("Error clearing cart:", error);
      fetchCart();
    }
  };

  // 🔹 Select items for checkout
  const handleSelect = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // 🔹 Checkout
  const selectedItems = cartItems.filter(i => i.selected);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
    0
  );

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    sessionStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    navigate('/checkout');
  };

  return (
    <Container className="mt-4">
      <h3>Shopping Cart</h3>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <Button
          variant="danger"
          onClick={handleClearCart}
          disabled={cartItems.length === 0}
        >
          Clear Cart
        </Button>

        <Button
          variant="primary"
          disabled={selectedItems.length === 0}
          onClick={handleCheckout}
        >
          Checkout ({selectedItems.length})
        </Button>
      </div>

      <Table bordered responsive hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Product</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          ))}
        </tbody>
      </Table>

      <h5 className="text-end">Total: ₱{totalPrice}</h5>
    </Container>
  );
};

export default Cart;