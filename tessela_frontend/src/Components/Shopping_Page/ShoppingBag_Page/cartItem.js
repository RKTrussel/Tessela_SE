import { Button, Image, Form } from "react-bootstrap";

const CartItem = ({ item, onQuantityChange, onDelete, onSelect }) => {
  return (
    <tr>
      <td className="text-center">
        <Form.Check
          type="checkbox"
          checked={item.selected}
          onChange={() => onSelect(item.product_id)}
        />
      </td>
      <td>
        <div className="d-flex align-items-center">
          <Image
            src={item.image || "https://via.placeholder.com/80"}
            rounded
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
            className="me-3 border"
          />
          <div>
            <p className="mb-1 fw-semibold">{item.name}</p>
            {item.variation && (
              <small className="text-muted">{item.variation}</small>
            )}
          </div>
        </div>
      </td>
      <td className="text-center fw-bold text-success">₱{item.price}</td>
      <td className="text-center">
        <Button
          variant="outline-secondary"
          size="sm"
          className="me-1"
          onClick={() => onQuantityChange(item.product_id, -1)}
        >
          −
        </Button>
        <span className="mx-2 fw-semibold">{item.quantity}</span>
        <Button
          variant="outline-secondary"
          size="sm"
          className="ms-1"
          onClick={() => onQuantityChange(item.product_id, 1)}
        >
          +
        </Button>
      </td>
      <td className="text-center fw-bold">
        ₱{(item.price * item.quantity).toLocaleString()}
      </td>
      <td className="text-center">
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(item.product_id)}
        >
          🗑 Remove
        </Button>
      </td>
    </tr>
  );
};

export default CartItem;