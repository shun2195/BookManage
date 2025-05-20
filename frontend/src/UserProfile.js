import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://bookmanage-backend-ywce.onrender.com";

function UserProfile() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const [avatarUrl, setAvatarUrl] = useState(
    localStorage.getItem("avatarUrl") ||
    `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(name || "User")}`
  );
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    if (!file) {
      toast.warning("📷 Hãy chọn ảnh trước khi tải lên");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post(`${API}/users/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      localStorage.setItem("avatarUrl", res.data.avatarUrl);
      setAvatarUrl(res.data.avatarUrl);
      toast.success("✅ Cập nhật avatar thành công!");
    } catch {
      toast.error("❌ Upload thất bại");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h3 className="text-success mb-4">👤 Trang cá nhân</h3>
      <div className="card shadow-sm p-4 text-center">
        <img
          src={avatarUrl}
          alt="avatar"
          className="rounded-circle mb-3"
          width="120"
          height="120"
        />
        <h5 className="mb-2">{name || "Chưa đặt tên"}</h5>
        <p className="mb-1"><strong>Email:</strong> {email}</p>
        <p><strong>Vai trò:</strong> {role}</p>

        {/* Upload */}
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control mb-2"
          />
          <button onClick={handleUpload} className="btn btn-outline-primary">
            📤 Tải ảnh đại diện mới
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UserProfile;
