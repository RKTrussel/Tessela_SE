import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";

const CartItem = ({ item, onQuantityChange, onDelete, onSelect }) => {
  return (
    <tr>
      <td className="text-center">
        <Form.Check
          type="checkbox"
          checked={item.selected}
          onChange={() => onSelect(item.product_id)}   // ✅ use product_id
        />
      </td>
      <td>
        <div className="d-flex align-items-center">
          <Image
            src={item.image || "https://via.placeholder.com/80"}
            rounded
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
            className="me-3"
          />
          <div>
            <p className="mb-1 fw-bold">{item.name}</p>
            <small className="text-muted">{item.variation}</small>
          </div>
        </div>
      </td>
      <td>₱{item.price}</td>
      <td>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => onQuantityChange(item.product_id, -1)}
        >
          −
        </Button>
        <span className="mx-2">{item.quantity}</span>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => onQuantityChange(item.product_id, 1)}
        >
          +
        </Button>
      </td>
      <td>₱{item.price * item.quantity}</td>
      <td>
        <Button
          variant="link"
          className="text-danger p-0"
          onClick={() => onDelete(item.product_id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default CartItem;