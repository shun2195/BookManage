import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://bookmanage-backend-ywce.onrender.com";
const BOOKS_PER_PAGE = 24;

function ExploreBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get(`${API}/books`)
      .then(res => setBooks(res.data))
      .catch(() => alert("Không thể tải danh sách sách"));
  }, []);

  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filter || book.category === filter)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  );

  const categories = [...new Set(books.map(b => b.category))];

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">📚 Khám phá sách</h3>

      <div className="row align-items-center mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
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

      <div
        className="mb-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "16px"
        }}
      >
        {paginated.map((book) => (
          <div key={book._id} className="border shadow-sm rounded h-100">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                className="w-100"
                alt="Ảnh bìa"
                style={{ aspectRatio: "2 / 3", objectFit: "contain", backgroundColor: "#f8f9fa", padding: "6px" }}
              />
            ) : (
              <div
                className="d-flex justify-content-center align-items-center bg-light text-muted"
                style={{ aspectRatio: "2 / 3" }}
              >
                Không có ảnh bìa
              </div>
            )}
            <div className="px-2 py-2">
              <h6
                className="text-truncate mb-1"
                title={book.title}
                style={{ fontWeight: 600, fontSize: "14px" }}
              >
                {book.title}
              </h6>
              <p className="text-muted mb-1" style={{ fontSize: "12px" }}>
                Tác giả: {book.author}
              </p>
              <p className="text-muted mb-1" style={{ fontSize: "12px" }}>
                Năm: {book.year}
              </p>
              <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                Thể loại: {book.category}
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-muted">Không tìm thấy sách phù hợp.</p>}
      </div>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setCurrentPage(i + 1)}
              >
                <span className="page-link">{i + 1}</span>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default ExploreBooks;