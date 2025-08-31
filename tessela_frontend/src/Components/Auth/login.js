import { useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import api from '../../api.js';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: ""});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Please fill all fields.");

    try {
      const { data, status } = await api.post("/login", form);
      if (status === 200) {
        const role = String(data?.role ?? data?.user?.role ?? "").trim().toLowerCase();
        login({ ...data, role }); // store normalized role

        const from = location.state?.from?.pathname;
        const target = role === "admin" ? "/dashboard" : (from || "/");
        console.log("navigate target:", target, "role:", role);
        navigate(target, { replace: true });
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <Card className="p-3">
      <h5 className="mb-3">Log in to your account</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" required />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
            <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)} type="button">
              {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Button type="submit" className="w-100">LOGIN</Button>

        <div className="text-center mt-3">
          <small>
            By creating your account or signing in, you agree to our{" "}
            <a href="/terms">Terms and Conditions</a> &{" "}
            <a href="/privacy">Privacy Policy</a>.
          </small>
        </div>
      </Form>
    </Card>
  );
}