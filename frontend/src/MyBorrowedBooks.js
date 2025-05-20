import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://bookmanage-backend-ywce.onrender.com";

function MyBorrowedBooks() {
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      const res = await axios.get(`${API}/my-borrows`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch {
      toast.error("❌ Không thể tải dữ liệu mượn sách");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-3 text-primary">📖 Sách đã mượn của bạn</h4>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Người đánh dấu</th>
            <th>Ngày đánh dấu</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.bookId?.title}</td>
              <td>{r.bookId?.author}</td>
              <td>{new Date(r.borrowDate).toLocaleDateString("vi-VN")}</td>
              <td>{r.returnDate ? new Date(r.returnDate).toLocaleDateString("vi-VN") : "—"}</td>
              <td>
                <span className={`badge bg-${r.status === "Đã trả" ? "success" : r.status === "Quá hạn" ? "danger" : "warning text-dark"}`}>
                  {r.status}
                </span>
              </td>
              <td>{r.returnedBy?.name || "—"}</td>
              <td>{r.returnedAt ? new Date(r.returnedAt).toLocaleDateString("vi-VN") : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default MyBorrowedBooks;
