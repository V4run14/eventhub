import React, { useState } from "react";
import axios from "axios";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post("http://localhost:8080/users/register", { email, password, role });
      setMessage(`Registration successful! Account created as ${role.toLowerCase()}.`);
      setEmail("");
      setPassword("");
      setRole("USER");
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setMessage(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-3">Register</h3>
      <form onSubmit={handleRegister}>
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

        <div className="form-group mb-3">
          <label>Account Type</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default RegisterForm;
