import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://bookmanage-backend-ywce.onrender.com";

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("🧪 Component ChangePassword đã được render");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !token) {
      toast.error("⚠️ Bạn chưa đăng nhập.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("❌ Mật khẩu mới không khớp.");
      return;
    }

    try {
      await axios.post(
        `${API}/change-password`,
        {
          email,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Đổi mật khẩu thành công!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(
        `❌ Đổi mật khẩu thất bại: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h3 className="text-warning mb-4">🔐 Đổi mật khẩu</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="currentPassword"
          className="form-control mb-3"
          placeholder="Mật khẩu hiện tại"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          className="form-control mb-3"
          placeholder="Mật khẩu mới"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          className="form-control mb-3"
          placeholder="Xác nhận mật khẩu mới"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-warning w-100">
          Cập nhật mật khẩu
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default ChangePassword;
