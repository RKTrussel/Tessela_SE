import { useState } from 'react';
import './LRComponent.css';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginRegisterComponent = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const evaluatePasswordStrength = (pwd) => {
    if (!pwd) return '';
  
    // Weak: 1-7 characters OR doesn't satisfy conditions for Medium or Strong.
    if (pwd.length < 8) return 'Weak';
  
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
  
    // Medium: Minimum 8 characters, with numbers and upper+lowercase letters.
    if (pwd.length >= 8 && hasLower && hasUpper && hasNumber) {
      // Strong: Minimum 10 characters, with numbers, upper+lowercase letters, and special characters.
      const hasSpecial = /[!@#$%^&*_]/.test(pwd);
      if (pwd.length >= 10 && hasSpecial) return 'Strong';
      return 'Medium';
    }
  
    return 'Weak';
  };
  
  const handlePasswordChange = (e) => {
    const newPwd = e.target.value;
    setPassword(newPwd);
    if (isRegistering) {
      setPasswordStrength(evaluatePasswordStrength(newPwd));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegistering) {
      if (!validateEmail(email)) {
        setError('Invalid email address');
        setLoading(false);
        return;
      }

      if (passwordStrength === 'Weak') {
        setError('Password is weak. Please choose a stronger password.');
        setLoading(false);
        return;
      }
    }


    try {
      if (isRegistering) {
        // Registration logic
        await axios.post('http://localhost:8000/api/register', {
          name,
          email,
          contact,
          password,
        });
        alert('Registration successful! You can now log in.');
        setIsRegistering(false);

      } else {
        // Login logic
        const response = await axios.post('http://localhost:8000/api/login', {
          name,
          password,
        });

        const { user } = response.data;
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('userRole', user.role); 
        localStorage.setItem('userId', user.id); 
        localStorage.setItem('userName', user.name); 
        localStorage.setItem('userEmail', user.email); 
        localStorage.setItem('userPhone', user.contact); 
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userId', user.id);

        // Redirect based on user role
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/productlist');
        }
      }
    } catch (error) {
      setError(isRegistering ? 'Registration failed' : 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="header text-center mb-3">
        <h2>{isRegistering ? 'Sign Up' : 'Login'}</h2>
      </div>
      <div className="header text-center mb-1">
        <p>{isRegistering ? 'Please fill in the information below:' : 'Enter your email and password to login:'}</p>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        {isRegistering && (
          <>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
               {error && !validateEmail(email) && (
                <small className="text-danger">Invalid email address</small>
              )}
            </Form.Group>

            <Form.Group controlId="formContact" className="mb-3">
              <Form.Label>Contact Info</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your contact information"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </Form.Group>
          </>
        )}

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {isRegistering && password && (
            <small
              className={`password-strength text-${
                passwordStrength === 'Strong'
                  ? 'success'
                  : passwordStrength === 'Medium'
                  ? 'warning'
                  : 'danger'
              }`}
            >
              Password Strength: {passwordStrength}
            </small>
          )}
        </Form.Group>

        <div className="d-grid mb-3">
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                {isRegistering ? 'Signing Up...' : 'Logging in...'}
              </>
            ) : isRegistering ? 'Sign Up' : 'Login'}
          </Button>
        </div>
      </Form>

      {error && <p className="error-message text-danger">{error}</p>}

      <div className="text-center mt-3">
        <Button
          variant="link"
          onClick={() => setIsRegistering((prev) => !prev)}
          disabled={loading}
        >
          {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Sign Up'}
        </Button>
      </div>
    </div>
  );
};

export default LoginRegisterComponent;