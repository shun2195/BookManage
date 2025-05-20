import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔗 API backend đang dùng
const API = "https://bookmanage-backend-ywce.onrender.com";

function LoginForm({ onLoginSuccess, onSwitchToRegister, onClose }) {
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
      localStorage.setItem("email", email);

      toast.success("✅ Đăng nhập thành công!");
      onLoginSuccess();

    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg === "Tài khoản đã bị khóa") {
        toast.error("🔒 Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
      } else if (msg === "Sai mật khẩu" || msg === "Tài khoản không tồn tại") {
        toast.error("❌ Sai tài khoản hoặc mật khẩu.");
      } else {
        toast.error("❌ Đăng nhập thất bại. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
      style={{ zIndex: 9999 }}
      onClick={onClose} // ✅ bấm ra ngoài để thoát
    >
      <div
        className="bg-white p-4 rounded shadow position-relative"
        style={{ width: "400px" }}
        onClick={(e) => e.stopPropagation()} // ❗ ngăn sự kiện click vào form
      >
        {/* Nút đóng ❌ */}
        <button
          className="btn-close position-absolute top-0 end-0 m-2"
          onClick={onClose}
        ></button>

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
    </div>
  );
}

export default LoginForm;
