import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const API = "https://bookmanage-backend-ywce.onrender.com";

function SystemManager() {
  const [admins, setAdmins] = useState([]);
  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      const res = await axios.get(`${API}/system/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch {
      toast.error("❌ Không thể tải danh sách admin");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-3 text-danger">⚙️ Quản trị hệ thống (Superadmin)</h4>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className="badge bg-danger">{u.role}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default SystemManager;
