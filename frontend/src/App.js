import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("session");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.warn("Failed to parse saved session", err);
      }
    }
    const legacyToken = localStorage.getItem("token");
    if (legacyToken) {
      return { token: legacyToken, role: "USER" };
    }
    return null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    } else {
      localStorage.removeItem("session");
    }
    localStorage.removeItem("token");
  }, [session]);

  const handleLoginSuccess = (newSession) => {
    setSession(newSession);
  };

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <Router>
      <div className="container mt-5">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <Link className="navbar-brand" to="/">Event Booking</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              {!session && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </>
              )}
              {session && (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    {session.role === "ADMIN" ? "Admin Dashboard" : "Dashboard"}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={session ? <Navigate to="/dashboard" replace /> : <h2>Welcome to Event Booking System</h2>}
          />
          <Route
            path="/register"
            element={!session ? <RegisterForm /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/login"
            element={!session ? (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          />
          <Route
            path="/dashboard"
            element={session ? (
              <Dashboard session={session} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
