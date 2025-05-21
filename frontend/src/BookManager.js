import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API = "https://bookmanage-backend-ywce.onrender.com";

function BookManager() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", year: "", category: "", cover: null });
  const [borrowedIds, setBorrowedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const [showBorrowPopup, setShowBorrowPopup] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [showFormPopup, setShowFormPopup] = useState(false);

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

  const loadBorrowedBooks = async () => {
    try {
      const res = await axios.get(`${API}/my-borrows`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data.filter(b => b.status === "Đang mượn").map(b => b.bookId._id);
      setBorrowedIds(ids);
    } catch {}
  };

  useEffect(() => {
    loadBooks();
    if (role === "user") loadBorrowedBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cover") {
      setForm({ ...form, cover: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));

    try {
      if (editingId) {
        await axios.put(`${API}/books/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("📘 Cập nhật thành công!");
        setEditingId(null);
      } else {
        await axios.post(`${API}/books`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("📗 Thêm sách mới thành công!");
      }
      setForm({ title: "", author: "", year: "", category: "", cover: null });
      setShowFormPopup(false);
      loadBooks();
    } catch {
      toast.error("❌ Thao tác thất bại!");
    }
  };

  const handleEdit = (book) => {
    setForm({ ...book, cover: null });
    setEditingId(book._id);
    setShowFormPopup(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sách này?")) return;
    try {
      await axios.delete(`${API}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Đã xoá sách");
      loadBooks();
    } catch {
      toast.error("❌ Xoá thất bại!");
    }
  };

  const handleBorrowClick = (bookId) => {
    setSelectedBookId(bookId);
    setShowBorrowPopup(true);
  };

  const handleBorrowSubmit = async () => {
    if (!returnDate) {
      toast.warn("📅 Vui lòng chọn ngày trả sách");
      return;
    }
    try {
      await axios.post(`${API}/borrow`, { bookId: selectedBookId, returnDate }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Mượn sách thành công");
      setShowBorrowPopup(false);
      setReturnDate(null);
      setSelectedBookId(null);
      loadBorrowedBooks();
    } catch (err) {
      const msg = err.response?.data?.message || "Thao tác thất bại";
      toast.error(`❌ ${msg}`);
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

      {role === "admin" && (
        <button className="btn btn-success mb-3" onClick={() => setShowFormPopup(true)}>➕ Thêm sách</button>
      )}

      {/* Bộ lọc */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input type="text" className="form-control" placeholder="🔍 Tìm theo tiêu đề..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}>
            <option value="">📂 Tất cả thể loại</option>
            {uniqueCategories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="col-md-4 text-end">
          <button className="btn btn-outline-success" onClick={exportToExcel}>📤 Xuất Excel</button>
        </div>
      </div>

      {/* Danh sách sách */}
      <table className="table table-striped table-bordered align-middle text-center">
        <thead className="table-dark">
          <tr>
            <th>Ảnh bìa</th>
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
              <td>
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt="Ảnh bìa" width="60" height="80" style={{ objectFit: "cover", borderRadius: "4px" }} />
                ) : (
                  <span className="text-muted">Không có</span>
                )}
              </td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>{book.category}</td>
              <td>
                {role === "admin" && (
                  <>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(book)}>Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>Xoá</button>
                  </>
                )}
                {role === "user" && (
                  <button className="btn btn-sm btn-outline-primary" disabled={borrowedIds.includes(book._id)} onClick={() => handleBorrowClick(book._id)}>
                    {borrowedIds.includes(book._id) ? "Đã mượn" : "📥 Mượn"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`} style={{ cursor: "pointer" }} onClick={() => setCurrentPage(i + 1)}>
              <span className="page-link">{i + 1}</span>
            </li>
          ))}
        </ul>
      </nav>

      <ToastContainer />

      {/* Popup thêm/sửa sách */}
      {showFormPopup && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? "Cập nhật sách" : "Thêm sách mới"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
                </div>
                <div className="modal-body">
                  <input name="title" className="form-control mb-2" placeholder="Tiêu đề" value={form.title} onChange={handleChange} required />
                  <input name="author" className="form-control mb-2" placeholder="Tác giả" value={form.author} onChange={handleChange} required />
                  <input name="year" className="form-control mb-2" placeholder="Năm" value={form.year} onChange={handleChange} required />
                  <input name="category" className="form-control mb-2" placeholder="Thể loại" value={form.category} onChange={handleChange} required />
                  <input type="file" name="cover" className="form-control mb-2" onChange={handleChange} accept="image/*" />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">{editingId ? "Cập nhật" : "Thêm"}</button>
                  <button className="btn btn-secondary" onClick={() => setShowFormPopup(false)}>Đóng</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Popup mượn sách */}
      {showBorrowPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
            <h5 className="mb-3">📅 Chọn ngày trả sách</h5>
            <DatePicker selected={returnDate} onChange={(date) => setReturnDate(date)} className="form-control mb-3" dateFormat="dd/MM/yyyy" minDate={new Date()} placeholderText="Chọn ngày" />
            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={() => setShowBorrowPopup(false)}>Hủy</button>
              <button className="btn btn-success" onClick={handleBorrowSubmit}>✅ Mượn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookManager;
