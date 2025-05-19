import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔗 Sử dụng API thật trên Render
const API = "https://bookmanage-backend-ywce.onrender.com";

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("✅ Đăng nhập thành công!");
      onLoginSuccess(); // Gọi hàm chuyển sang App
    } catch (err) {
      toast.error("❌ Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4 text-center text-primary">🔐 Đăng nhập hệ thống</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default LoginForm;
