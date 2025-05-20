import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API = "https://bookmanage-backend-ywce.onrender.com";

function BookStats() {
  const [stats, setStats] = useState([]);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [topBooks, setTopBooks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Thống kê theo thể loại
        const res = await axios.get(`${API}/books`);
        const raw = res.data;
        const counts = {};
        raw.forEach((book) => {
          counts[book.category] = (counts[book.category] || 0) + 1;
        });
        const chartData = Object.entries(counts).map(([category, count]) => ({
          category,
          count,
        }));
        setStats(chartData);

        // 2. Tổng số sách đang mượn
        const borrowRes = await axios.get(`${API}/stats/borrowed-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBorrowedCount(borrowRes.data.totalBorrowed);

        // 3. Top sách mượn nhiều nhất
        const top = await axios.get(`${API}/stats/top-borrowed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopBooks(top.data);
      } catch (err) {
        alert("❌ Không thể tải dữ liệu thống kê");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-info">📊 Thống kê sách</h3>

      <div className="mb-4">
        <h5>📦 Số sách đang được mượn: <strong>{borrowedCount}</strong></h5>
      </div>

      <div className="mb-5">
        <h5 className="mb-3">📚 Số sách theo thể loại</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h5 className="mb-3">⭐ Top sách được mượn nhiều nhất</h5>
        <ul className="list-group">
          {topBooks.map((b, i) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={i}
            >
              <div>
                <strong>{b.title}</strong> — {b.author}
              </div>
              <span className="badge bg-primary rounded-pill">{b.count} lượt</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BookStats;
