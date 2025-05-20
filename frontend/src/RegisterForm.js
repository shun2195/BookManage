import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://bookmanage-backend-ywce.onrender.com";

function RegisterForm({ onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Gửi dữ liệu đăng ký
      await axios.post(`${API}/register`, form);
      toast.success("✅ Đăng ký thành công! Mời bạn đăng nhập.");
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err) {
      toast.error("❌ Đăng ký thất bại. Email có thể đã tồn tại.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-4 text-center text-success">📝 Đăng ký tài khoản</h3>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          className="form-control mb-3"
          placeholder="Họ tên (tùy chọn)"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-success w-100">Đăng ký</button>
        <div className="text-center mt-3">
          <button type="button" className="btn btn-link" onClick={onSwitchToLogin}>
            🔙 Quay lại đăng nhập
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default RegisterForm;
