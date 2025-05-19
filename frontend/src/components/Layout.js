import React from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // hoặc navigate("/") nếu dùng react-router
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <header className="bg-primary text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h3 className="m-0">
            📚 <span className="fw-bold">Quản lý sách</span>
          </h3>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <main className="container my-4">{children}</main>

      {/* ===== Footer ===== */}
      <footer className="bg-light text-center py-3 border-top">
        <small>
          © 2025 Nhóm Nhung - Trúc | Website quản lý sách với React + Node.js
        </small>
      </footer>
    </div>
  );
}
