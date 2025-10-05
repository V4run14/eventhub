import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:8080/users/login", { email, password });
      const { token, role, email: returnedEmail } = res.data || {};
      if (token && role) {
        if (onLoginSuccess) {
          onLoginSuccess({ token, role, email: returnedEmail || email });
        }
        setMessage(`Logged in as ${role === "ADMIN" ? "Admin" : "User"}. Redirecting...`);
        navigate("/dashboard");
      } else {
        setMessage("Unexpected response from server");
      }
    } catch (err) {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-3">Login</h3>
      <form onSubmit={handleLogin}>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">Login</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default LoginForm;
