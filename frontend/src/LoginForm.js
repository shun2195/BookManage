import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔗 API backend đang dùng
const API = "https://bookmanage-backend-ywce.onrender.com";

function LoginForm({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("❌ Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      const res = await axios.post(`${API}/login`, { email, password });

      // Lưu thông tin người dùng
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", email); // dùng lại trong các chức năng khác

      toast.success("✅ Đăng nhập thành công!");
      onLoginSuccess(); // callback để chuyển trang hoặc load lại app

    } catch (err) {
      toast.error("❌ Sai tài khoản hoặc mật khẩu.");
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
        <button type="submit" className="btn btn-primary w-100">
          Đăng nhập
        </button>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link"
            onClick={onSwitchToRegister}
          >
            📝 Chưa có tài khoản? Đăng ký
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default LoginForm;
