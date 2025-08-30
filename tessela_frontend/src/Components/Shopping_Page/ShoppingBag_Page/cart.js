import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import CartItem from "./cartItem";
import api from "../../../api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from backend
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
                i.image_url                              
                ?? i.image                               // single image column case
                ?? i.images?.[0]?.url                    // hasMany images with url accessor
                ?? null,
            selected: Boolean(i.selected),
        }));

        setCartItems(items);
    } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]); // keep it an array so reduce() is safe
    }
    };

    const handleQuantityChange = async (id, change) => {
    try {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;
        const newQuantity = Math.max(1, (item.quantity || 1) + change);

        // Use a SET endpoint (not ADD) so you don't double-count
        await api.put(`/cart/items/${id}`, { quantity: newQuantity });
        fetchCart();
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
    };

    const handleDelete = async (id) => {
    try {
        await api.delete(`/cart/items/${id}`);
        fetchCart();
    } catch (error) {
        console.error('Error removing item:', error);
    }
    };

    // total with a guard in case something goes off the rails
    const safeItems = Array.isArray(cartItems) ? cartItems : [];
    const totalPrice = safeItems.reduce((sum, i) => sum + (Number(i.price)||0) * (Number(i.quantity)||0), 0);

    const handleClearCart = async () => {
        try {
        await api.post("/cart/clear");
        fetchCart();
        } catch (error) {
        console.error("Error clearing cart:", error);
        }
    };

    const handleSelect = (id) => {
        setCartItems((prevItems) =>
        prevItems.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
        )
        );
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
            disabled={cartItems.filter((item) => item.selected).length === 0}
            >
            Checkout ({cartItems.filter((item) => item.selected).length})
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