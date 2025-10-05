import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ token, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3>Dashboard</h3>
      {token ? (
        <>
          <p>Welcome back! You are logged in.</p>
          <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please login to access your dashboard.</p>
      )}
    </div>
  );
}

export default Dashboard;