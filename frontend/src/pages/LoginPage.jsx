import React, { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", form);
      alert("Login successful");
      localStorage.setItem("studentId", res.data.user._id);
      window.location.href = "/timetable";
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>🔐 Login</h2>
      <input name="username" placeholder="Username" onChange={handleChange} /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
