import { useState, useEffect } from "react";
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
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified") === "1") {
      setVerified(true);
    }
  }, [location]);

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
        if (data.token) {
          localStorage.setItem("token", data.token); 
        }

        const role = String(data?.role ?? data?.user?.role ?? "").trim().toLowerCase();
        login({ ...data, role }); // store normalized role in context

        const from = location.state?.from?.pathname;
        const target = role === "admin" ? "/dashboard" : (from || "/");
        console.log("navigate target:", target, "role:", role);
        navigate(target, { replace: true });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 403 && err.response.data.error?.includes("verify")) {
          setError("Please verify your email before logging in. Check your inbox.");
        } else if (err.response.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(err.response.data.error || "Login failed. Please try again.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <Card className="p-3">
      <h5 className="mb-3">Log in to your account</h5>
      {verified && <Alert variant="success">✅ Your email has been verified. You can now log in!</Alert>}
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