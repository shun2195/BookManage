import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔗 API backend đang dùng
const API = "https://bookmanage-backend-ywce.onrender.com";

function LoginForm({ onLoginSuccess, onSwitchToRegister, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("❌ Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      const res = await axios.post(`${API}/login`, { email, password });

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

  const handleResetPassword = async () => {
    if (!email || !password) {
      toast.error("❌ Nhập email và mật khẩu mới.");
      return;
    }
    try {
      await axios.post(`${API}/change-password`, {
        email,
        currentPassword: password, // dùng lại vì API yêu cầu
        newPassword: password,
      });
      toast.success("✅ Mật khẩu đã cập nhật!");
      setShowForgot(false);
    } catch {
      toast.error("❌ Không thể đổi mật khẩu. Kiểm tra lại email.");
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded shadow position-relative"
        style={{ width: "400px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng ❌ */}
        <button
          className="btn-close position-absolute top-0 end-0 m-2"
          onClick={onClose}
        ></button>

        {showForgot ? (
          <>
            <h4 className="text-center text-danger mb-3">🔐 Đặt lại mật khẩu</h4>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Nhập email đã đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="btn btn-warning w-100 mb-2" onClick={handleResetPassword}>
              Cập nhật mật khẩu
            </button>
            <div className="text-center">
              <button className="btn btn-link" onClick={() => setShowForgot(false)}>
                ⬅ Quay lại đăng nhập
              </button>
            </div>
          </>
        ) : (
          <>
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
            </form>
            <div className="text-center mt-3">
              <button className="btn btn-link" onClick={onSwitchToRegister}>
                📝 Chưa có tài khoản? Đăng ký
              </button>
              <button className="btn btn-link" onClick={() => setShowForgot(true)}>
                ❓ Quên mật khẩu?
              </button>
            </div>
          </>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default LoginForm;
