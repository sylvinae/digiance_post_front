import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

interface ApiError {
  code: string;
  description: string;
}

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    navigate("/login");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "https://localhost:7052/api/user/register",
        {
          email,
          password,
          username,
        }
      );

      if (response.status === 200) {
        window.alert("Signup successful! You can now log in.");
        handleSignupSuccess();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errorPayload = err.response.data as ApiError[];

        const newErrors: { [key: string]: string } = {};

        errorPayload.forEach((error) => {
          if (error.description.toLowerCase().includes("email")) {
            newErrors.email = error.description;
          } else if (error.description.toLowerCase().includes("username")) {
            newErrors.username = error.description;
          } else if (error.description.toLowerCase().includes("password")) {
            newErrors.password = error.description;
          }
        });

        setErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email || !password || !username) {
      setErrors((prev) => ({
        ...prev,
        email: "",
        username: "",
        password: "",
      }));
    }
  }, [email, password, username]);

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={4}>
          <Card className="shadow rounded-3 p-2">
            <Card.Body>
              <Form onSubmit={handleSignup}>
                <div className="text-center mb-4">
                  <h4 className="pt-1">Post Tracker - Sign Up</h4>
                </div>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Control
                    className="p-2"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="username"
                    isInvalid={!!errors.username}
                  />
                  {errors.username && (
                    <Form.Text className="text-danger">
                      {errors.username}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    className="p-2"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                    isInvalid={!!errors.email}
                  />
                  {errors.email && (
                    <Form.Text className="text-danger">
                      {errors.email}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Control
                    className="p-2"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    isInvalid={!!errors.password}
                  />
                  {errors.password && (
                    <Form.Text className="text-danger">
                      {errors.password}
                    </Form.Text>
                  )}
                </Form.Group>

                <div className="d-grid gap-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <a href="/login" className="text-muted small">
                    Already have an account? Login
                  </a>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
