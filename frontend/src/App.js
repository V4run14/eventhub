import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import EventListPage from "./events/EventListPage";
import EventDetailsPage from "./events/EventDetailsPage";
import EventFormPage from "./events/EventFormPage";

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

  const isAuthenticated = Boolean(session);
  const isAdmin = session?.role === "ADMIN";

  return (
    <Router>
      <div className="container mt-5">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <Link className="navbar-brand" to="/">Event Booking</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              {!isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/events">Events</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      {isAdmin ? "Admin Dashboard" : "Dashboard"}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <h2>Welcome to Event Booking System</h2>}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? (
              <Dashboard session={session} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )}
          />
          <Route
            path="/events"
            element={isAuthenticated ? (
              <EventListPage session={session} />
            ) : (
              <Navigate to="/login" replace />
            )}
          />
          <Route
            path="/events/new"
            element={isAuthenticated && isAdmin ? (
              <EventFormPage session={session} />
            ) : (
              <Navigate to={isAuthenticated ? "/events" : "/login"} replace />
            )}
          />
          <Route
            path="/events/:id/edit"
            element={isAuthenticated && isAdmin ? (
              <EventFormPage session={session} />
            ) : (
              <Navigate to={isAuthenticated ? "/events" : "/login"} replace />
            )}
          />
          <Route
            path="/events/:id"
            element={isAuthenticated ? (
              <EventDetailsPage session={session} />
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