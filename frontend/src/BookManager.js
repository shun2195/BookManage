import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API = "https://bookmanage-backend-ywce.onrender.com";

function BookManager() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", year: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const loadBooks = async () => {
    try {
      const res = await axios.get(`${API}/books`);
      setBooks(res.data);
    } catch (error) {
      toast.error("❌ Không thể tải danh sách sách");
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/books/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("📘 Cập nhật thành công!");
        setEditingId(null);
      } else {
        await axios.post(`${API}/books`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("📗 Thêm sách mới thành công!");
      }
      setForm({ title: "", author: "", year: "", category: "" });
      loadBooks();
    } catch (error) {
      toast.error("❌ Thao tác thất bại!");
    }
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sách này?")) return;
    try {
      await axios.delete(`${API}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("🗑️ Đã xoá sách");
      loadBooks();
    } catch (error) {
      toast.error("❌ Xoá thất bại!");
    }
  };

  const uniqueCategories = [...new Set(books.map((book) => book.category))];

  const exportToExcel = () => {
    const exportData = filteredBooks.map(book => ({
      "Tiêu đề": book.title,
      "Tác giả": book.author,
      "Năm": book.year,
      "Thể loại": book.category,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách sách");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "DanhSachSach.xlsx");
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory === "" || book.category === filterCategory)
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">📚 Quản lý sách</h2>

      {/* Form thêm/sửa — chỉ admin */}
      {role === "admin" && (
        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-3">
            <input name="title" className="form-control" placeholder="Tiêu đề" value={form.title} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input name="author" className="form-control" placeholder="Tác giả" value={form.author} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input name="year" className="form-control" placeholder="Năm" value={form.year} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input name="category" className="form-control" placeholder="Thể loại" value={form.category} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100">{editingId ? "Cập nhật" : "Thêm"}</button>
          </div>
        </form>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">📂 Tất cả thể loại</option>
            {uniqueCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 text-end">
          <button className="btn btn-outline-success" onClick={exportToExcel}>
            📤 Xuất Excel
          </button>
        </div>
      </div>

      {/* Danh sách sách */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Năm</th>
            <th>Thể loại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBooks.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>{book.category}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(book)}>Sửa</button>
                {role === "admin" && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>Xoá</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav className="d-flex justify-content-center mt-3">
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

      <ToastContainer />
    </div>
  );
}

export default BookManager;
