import React from "react";

function UserProfile() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  return (
    <div className="container mt-4">
      <h3 className="text-success mb-4">👤 Trang cá nhân</h3>
      <div className="card p-3 shadow-sm">
        <p><strong>Họ tên:</strong> {name || "Chưa có"}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Vai trò:</strong> {role}</p>
      </div>
    </div>
  );
}

export default UserProfile;
