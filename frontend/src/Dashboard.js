import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ session, onLogout }) {
  const navigate = useNavigate();
  const { role, email } = session;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3>{role === "ADMIN" ? "Admin Dashboard" : "User Dashboard"}</h3>
      <p className="mb-3">Welcome {email || "back"}! You are signed in as {role.toLowerCase()}.</p>
      {role === "ADMIN" ? (
        <p className="text-muted">Admin features coming soon: manage events, schedules, and bookings.</p>
      ) : (
        <p className="text-muted">User features coming soon: browse events and book tickets.</p>
      )}
      <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
