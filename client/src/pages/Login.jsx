import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form.email, form.password);
      login(data.token, data);
      toast.success("Login successful!");
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="brand-title">Group Mate</h1>
        <h2 className="page-title">Log in</h2>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit">Log in</button>
        </form>

        <p className="dead-text">
          Didn’t have an account? <Link to="/signup">Create a new one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
