import { useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // install react-bootstrap-icons if needed

export default function Login({ onSwitch, onLogin, onForgot }) {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Please fill all fields.");
    onLogin?.(form);
  };

  return (
    <Card className="p-3">
      <h5 className="mb-3">Log in to your account</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
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
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
        </Form.Group>

        {/* Forgot Password link + Remember me */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            variant="link"
            size="sm"
            className="p-0"
            onClick={() => onForgot ? onForgot(form.email) : void 0}
          >
            Forgot Password?
          </Button>
          <Form.Check
            type="checkbox"
            id="remember"
            label="Keep me signed in"
            name="remember"
            checked={form.remember}
            onChange={onChange}
          />
        </div>

        <Button type="submit" className="w-100">LOGIN</Button>

        {/* Terms and Privacy */}
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