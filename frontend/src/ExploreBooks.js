import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://bookmanage-backend-ywce.onrender.com";

function ExploreBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get(`${API}/books`)
      .then(res => setBooks(res.data))
      .catch(() => alert("Không thể tải danh sách sách"));
  }, []);

  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filter || book.category === filter)
  );

  const categories = [...new Set(books.map(b => b.category))];

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-3">📚 Khám phá sách</h3>

      {/* Tìm kiếm và lọc */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">📂 Tất cả thể loại</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hiển thị sách */}
      <div className="row">
        {filtered.map((book) => (
          <div className="col-md-4 mb-4" key={book._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">
                  <strong>Tác giả:</strong> {book.author}<br />
                  <strong>Năm:</strong> {book.year}<br />
                  <strong>Thể loại:</strong> {book.category}
                </p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-muted">Không tìm thấy sách phù hợp.</p>}
      </div>
    </div>
  );
}

export default ExploreBooks;
