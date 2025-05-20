import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://bookmanage-backend-ywce.onrender.com";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      toast.error("❌ Không thể tải danh sách người dùng");
    }
  };

  useEffect(() => {
    if (role === "admin") loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`${API}/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("✅ Đã cập nhật vai trò");
      loadUsers();
    } catch (error) {
      toast.error("❌ Cập nhật vai trò thất bại");
    }
  };

  const handleLockToggle = async (userId, isLocked) => {
    try {
      await axios.put(`${API}/users/${userId}/lock`, { isLocked }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(isLocked ? "🚫 Tài khoản đã bị khóa" : "✅ Tài khoản đã được mở khóa");
      loadUsers();
    } catch (error) {
      toast.error("❌ Thao tác thất bại");
    }
  };

  const filteredUsers = users.filter(u =>
    (filterRole === "all" || u.role === filterRole) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) ||
     u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  if (role !== "admin") {
    return <div className="container mt-5 text-danger">🚫 Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-primary">👥 Quản lý người dùng</h3>

      {/* Bộ lọc & tìm kiếm */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <input
            className="form-control"
            placeholder="🔍 Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
            <option value="mod">mod</option>
            <option value="user">user</option>
            <option value="guest">guest</option>
          </select>
        </div>
      </div>

      {/* Bảng người dùng */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Đổi vai</th>
            <th>Khoá</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className={`badge bg-${u.role === "admin" ? "danger" : u.role === "mod" ? "info" : u.role === "superadmin" ? "warning text-dark" : "secondary"}`}>
                  {u.role}
                </span>
              </td>
              <td>
                {u.isLocked ? (
                  <span className="badge bg-danger">Đã khoá</span>
                ) : (
                  <span className="badge bg-success">Hoạt động</span>
                )}
              </td>
              <td>
                <select
                  className="form-select"
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                >
                  <option value="superadmin">superadmin</option>
                  <option value="admin">admin</option>
                  <option value="mod">mod</option>
                  <option value="user">user</option>
                  <option value="guest">guest</option>
                </select>
              </td>
              <td>
                <button
                  className={`btn btn-sm ${u.isLocked ? "btn-success" : "btn-danger"}`}
                  onClick={() => handleLockToggle(u._id, !u.isLocked)}
                >
                  {u.isLocked ? "Mở khoá" : "Khoá"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}

export default UserManager;
