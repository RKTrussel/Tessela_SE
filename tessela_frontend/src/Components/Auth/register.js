import { useState } from "react";
import { Form, Button, Card, Alert, InputGroup, Row, Col } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import api from '../../api.js';
import { Navigate } from "react-router-dom";

export default function Register({ onSwitch, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    birthday: { day: "", month: "", year: "" },
    gender: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (["day", "month", "year"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        birthday: { ...prev.birthday, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    
    if (!form.email || !form.password || !form.name || !form.gender) {
      return setError("Please fill all required fields.");
    }
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    
    const submitForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      birthday: `${form.birthday.year}-${form.birthday.month.padStart(2, '0')}-${form.birthday.day.padStart(2, '0')}`,
      gender: form.gender.trim(),
    }
    try {
      const response = await api.post("/register", submitForm);
      if (response.status === 201) {
        setSuccess(true);
        onRegister?.(form);
          // redirect to login tab after success
        setTimeout(() => {
          onSwitch(); // parent switches to login
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
      if (error.response.status === 422) {
        // Laravel validation errors
        console.log("Validation errors:", error.response.data.errors);
        setError(error.response.data.message || "Validation error. Please check your input.");
        return;
      } else {
        // Other errors (500, 401, etc.)
        console.error("Server error:", error.response.data);
      }
    } else {
      console.error("Network error:", error.message);
    }
  }
  };

  return (
    <Card className="p-3">
      <h5 className="mb-3 text-center">Create an Account</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Registration successful! You can now log in.</Alert>}
      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Email Address *</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password *</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Create a password"
              required
              minLength={6}
            />
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gender</Form.Label>
          <div>
            <Form.Check
              inline
              type="radio"
              label="Male"
              name="gender"
              value="Male"
              checked={form.gender === "Male"}
              onChange={onChange}
            />
            <Form.Check
              inline
              type="radio"
              label="Female"
              name="gender"
              value="Female"
              checked={form.gender === "Female"}
              onChange={onChange}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Jane Doe"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Birthday</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="number"
                name="day"
                placeholder="DD"
                value={form.birthday.day}
                onChange={onChange}
                min="1"
                max="31"
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name="month"
                placeholder="MM"
                value={form.birthday.month}
                onChange={onChange}
                min="1"
                max="12"
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name="year"
                placeholder="YYYY"
                value={form.birthday.year}
                onChange={onChange}
              />
            </Col>
          </Row>
        </Form.Group>

        <Button type="submit" className="w-100 mt-2">CONFIRM</Button>

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