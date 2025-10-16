import React, { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      console.log(form); // Log form data for debugging
      const res = await axios.post("http://localhost:5000/register", form);
      alert("Registered successfully. Please login.");
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>🆕 Register</h2>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
      />
      <br />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterPage;
