import React, { useState, useRef, useEffect } from "react";

export default function Layout({ children, onNavigate }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "User";

  // ✅ Nếu người dùng đã upload avatar, dùng ảnh đó
  const avatar =
    localStorage.getItem("avatarUrl") ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* ===== Header ===== */}
      <header className="bg-primary text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Left: Logo + Navigation */}
          <div className="d-flex align-items-center gap-4">
            <h4 className="m-0 fw-bold">📚 NhungTruc</h4>
            <nav className="d-flex gap-3">
              <span style={{ cursor: "pointer" }} onClick={() => onNavigate("books")}>
                📘 Quản lý sách
              </span>
              <span style={{ cursor: "pointer" }} onClick={() => onNavigate("stats")}>
                📊 Thống kê
              </span>
              {role === "admin" && (
                <>
                  <span style={{ cursor: "pointer" }} onClick={() => onNavigate("usermanager")}>
                    👥 Người dùng
                  </span>
                  <span style={{ cursor: "pointer" }} onClick={() => onNavigate("borrowmanager")}>
                    📋 Mượn – Trả sách
                  </span>
                </>
              )}
              {role === "mod" && (
                <span style={{ cursor: "pointer" }} onClick={() => onNavigate("moderation")}>
                  🛠 Kiểm duyệt sách
                </span>
              )}
              {role === "superadmin" && (
                <span style={{ cursor: "pointer" }} onClick={() => onNavigate("system")}>
                  ⚙️ Quản lý hệ thống
                </span>
              )}
              {role === "user" && (
                <span style={{ cursor: "pointer" }} onClick={() => onNavigate("myborrows")}>
                  📖 Sách đang mượn
                </span>
              )}
            </nav>
          </div>

          {/* Right: Avatar dropdown */}
          <div className="position-relative" ref={menuRef}>
            <img
              src={avatar}
              alt="avatar"
              className="rounded-circle"
              style={{
                width: 40,
                height: 40,
                cursor: "pointer",
                objectFit: "cover",
                border: "1px solid #ccc"
              }}
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <ul
                className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm text-dark"
                style={{ listStyle: "none", minWidth: "180px", zIndex: 999 }}
              >
                <li className="px-3 py-2 border-bottom text-muted">
                  Vai trò: <strong>{role || "?"}</strong>
                </li>
                <li
                  className="px-3 py-2 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowMenu(false);
                    onNavigate("profile");
                  }}
                >
                  👤 Trang cá nhân
                </li>
                {role === "admin" && (
                  <li
                    className="px-3 py-2 border-bottom"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowMenu(false);
                      onNavigate("usermanager");
                    }}
                  >
                    👥 Quản lý người dùng
                  </li>
                )}
                <li
                  className="px-3 py-2 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowMenu(false);
                    onNavigate("changepassword");
                  }}
                >
                  🔐 Đổi mật khẩu
                </li>
                <li
                  className="px-3 py-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  🚪 Đăng xuất
                </li>
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <main className="container my-4">{children}</main>

      {/* ===== Footer ===== */}
      <footer className="bg-light text-center py-3 border-top">
        <small>© 2025 Nhung - Trúc | Website quản lý sách</small>
      </footer>
    </div>
  );
}
