import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard({ session, onLogout }) {
  const navigate = useNavigate();
  const { role, email } = session;
  const isAdmin = role === "ADMIN";

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3>{isAdmin ? "Admin Dashboard" : "User Dashboard"}</h3>
      <p className="mb-3">Welcome {email || "back"}! You are signed in as {role.toLowerCase()}.</p>

      <div className="mb-4">
        <p className="fw-semibold">Quick Actions</p>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-outline-primary" to="/events">
            View Events
          </Link>
          {isAdmin && (
            <Link className="btn btn-outline-success" to="/events/new">
              Create Event
            </Link>
          )}
        </div>
      </div>

      <p className="text-muted">
        {isAdmin
          ? "Manage local events, publish Ticketmaster listings, and keep your audience informed."
          : "Browse upcoming events and stay tuned for booking options."}
      </p>

      <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;