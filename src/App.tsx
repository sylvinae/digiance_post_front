import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import axios from "axios";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import Homepage from "./Pages/Homepage";
import Spinner from "react-bootstrap/Spinner";

interface UserData {
  username: string;
  email: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get<{
          isAuthenticated: boolean;
          user?: UserData;
        }>("https://localhost:7052/api/user/check-auth", {
          withCredentials: true,
        });

        setIsLoggedIn(response.data.isAuthenticated);

        if (response.data.isAuthenticated && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
      } finally {
        setInitializing(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://localhost:7052/api/User/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  if (initializing) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="vh-100">
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Homepage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
