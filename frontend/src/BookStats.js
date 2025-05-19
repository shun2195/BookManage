import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API = "https://bookmanage-backend-ywce.onrender.com";

function BookStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API}/books`);
      const raw = res.data;
      const counts = {};

      raw.forEach(book => {
        counts[book.category] = (counts[book.category] || 0) + 1;
      });

      const chartData = Object.entries(counts).map(([category, count]) => ({
        category,
        count,
      }));

      setStats(chartData);
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-info">📊 Thống kê số sách theo thể loại</h3>
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
  );
}

export default BookStats;
