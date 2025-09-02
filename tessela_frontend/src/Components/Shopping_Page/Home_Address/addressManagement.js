import { useEffect, useState } from "react";
import api from "../../../api";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export default function AddressManagement() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [account, setAccount] = useState(null);
    const hasDefault = addresses.some(a => a.is_default);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address_line1: "",
        city: "",
        province: "",
        postal_code: "",
        is_default: false,
    });
    const [editingId, setEditingId] = useState(null);

    const loadAddresses = async () => {
        try {
        setLoading(true);
        const { data } = await api.get("/addresses");
        setAddresses(data);
        } catch (err) {
        setError("Failed to load addresses");
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        api.get("/me")
        .then(res => {
            setAccount(res.data);
        })
        .catch(err => {
            console.error("Failed to load account info:", err);
        });
    }, []);

    useEffect(() => {
        if (account) {
            setFormData((prev) => ({
            ...prev,
            name: account.name,
            email: account.email,
            }));
        }
    }, [account]);

    useEffect(() => {
        loadAddresses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        setSaving(true);
        try {
        if (editingId) {
            await api.put(`/addresses/${editingId}`, formData);
            setMsg("Address updated!");
        } else {
            await api.post("/addresses", formData);
            setMsg("Address added!");
        }
        setFormData({
            name: "",
            phone: "",
            email: "",
            address_line1: "",
            city: "",
            province: "",
            postal_code: "",
            is_default: false,
        });
        setEditingId(null);
        loadAddresses();
        } catch (err) {
        console.error(err);
        setError("Failed to save address");
        } finally {
        setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
        await api.delete(`/addresses/${id}`);
        setMsg("Address deleted");
        loadAddresses();
        } catch (err) {
        console.error(err);
        setError("Failed to delete address");
        }
    };

    const startEdit = (addr) => {
        setFormData(addr);
        setEditingId(addr.address_id);
    };

    return (
        <Container className="mt-4">
        <h3>My Addresses</h3>
        {msg && <Alert variant="success">{msg}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
            <div className="text-center my-5">
            <Spinner animation="border" />
            </div>
        ) : (
            <Row>
            {addresses.map((addr) => (
                <Col md={6} key={addr.address_id} className="mb-3">
                <Card>
                    <Card.Body>
                    <Card.Title>
                        {addr.name}{" "}
                        {addr.is_default && (
                        <span className="badge bg-primary">Default</span>
                        )}
                    </Card.Title>
                    <Card.Text>
                        {addr.phone}
                        <br />
                        {addr.email}
                        <br />
                        {addr.address_line1}, {addr.city}, {addr.province},{" "}
                        {addr.postal_code}
                    </Card.Text>
                    <div className="d-flex gap-2">
                        <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => startEdit(addr)}
                        >
                        Edit
                        </Button>
                        <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(addr.address_id)}
                        >
                        Delete
                        </Button>
                    </div>
                    </Card.Body>
                </Card>
                </Col>
            ))}
            </Row>
        )}

        <Card className="mt-4">
            <Card.Header>
            {editingId ? "Edit Address" : "Add New Address"}
            </Card.Header>
            <Card.Body>
            <Form onSubmit={handleSubmit}>
                <Row>
                <Col md={6} className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={account?.name || ""}
                        readOnly
                    />
                </Col>
                <Col md={6} className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                    />    
                </Col>
                <Col md={6} className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                            type="email"
                            value={account?.email || ""}
                            readOnly 
                        />
                </Col>
                <Col md={12} className="mb-3">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                    value={formData.address_line1}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        address_line1: e.target.value,
                        })
                    }
                    required
                    />
                </Col>
                <Col md={4} className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                    value={formData.city}
                    onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                    }
                    required
                    />
                </Col>
                <Col md={4} className="mb-3">
                    <Form.Label>Province</Form.Label>
                    <Form.Control
                    value={formData.province}
                    onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value })
                    }
                    required
                    />
                </Col>
                <Col md={4} className="mb-3">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                    value={formData.postal_code}
                    onChange={(e) =>
                        setFormData({ ...formData, postal_code: e.target.value })
                    }
                    required
                    />
                </Col>
                <Col md={12}>
                    <Form.Check
                        type="checkbox"
                        label="Set as default address"
                        checked={formData.is_default}
                        onChange={(e) =>
                            setFormData({ ...formData, is_default: e.target.checked })
                        }
                        disabled={
                            (hasDefault && !editingId) ||          // adding new when default exists
                            (editingId && !formData.is_default)    // editing non-default address
                        }
                    />
                </Col>
                </Row>
                <Button type="submit" className="mt-3" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Address" : "Add Address"}
                </Button>
            </Form>
            </Card.Body>
        </Card>
        </Container>
    );
}