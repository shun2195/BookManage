import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://bookmanage-backend-ywce.onrender.com";

function BorrowManager() {
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      const res = await axios.get(`${API}/borrows`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch {
      toast.error("❌ Không thể tải danh sách mượn sách");
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Xác nhận đánh dấu đã trả sách?")) return;
    try {
      await axios.put(`${API}/return/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Đã đánh dấu trả sách");
      load();
    } catch {
      toast.error("❌ Thao tác thất bại");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-3 text-primary">📋 Quản lý mượn – trả sách</h4>
      <table className="table table-bordered table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th>Người mượn</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Người đánh dấu</th>
            <th>Ngày đánh dấu</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.userId?.name}<br /><small className="text-muted">{r.userId?.email}</small></td>
              <td>{r.bookId?.title}</td>
              <td>{new Date(r.borrowDate).toLocaleDateString("vi-VN")}</td>
              <td>{r.returnDate ? new Date(r.returnDate).toLocaleDateString("vi-VN") : "—"}</td>
              <td>{r.returnedBy?.name || "—"}</td>
              <td>{r.returnedAt ? new Date(r.returnedAt).toLocaleDateString("vi-VN") : "—"}</td>
              <td>
                <span className={`badge bg-${r.status === "Đã trả" ? "success" : r.status === "Quá hạn" ? "danger" : "warning text-dark"}`}>
                  {r.status}
                </span>
              </td>
              <td>
                {r.status === "Đang mượn" && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleReturn(r._id)}
                  >
                    ✅ Trả sách
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default BorrowManager;
