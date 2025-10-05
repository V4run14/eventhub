import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <div className="container mt-5">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <Link className="navbar-brand" to="/">Event Booking</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              {!token && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </>
              )}
              {token && (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" replace /> : <h2>Welcome to Event Booking System</h2>}
          />
          <Route
            path="/register"
            element={!token ? <RegisterForm /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/login"
            element={!token ? <LoginForm onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard"
            element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;