import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", year: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // Load danh sách sách từ backend
  const loadBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/books");
      setBooks(res.data);
    } catch (error) {
      toast.error("❌ Không thể tải danh sách sách");
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Thêm hoặc cập nhật sách
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/books/${editingId}`, form);
        toast.success("📘 Cập nhật thành công!");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/books", form);
        toast.success("📗 Thêm sách mới thành công!");
      }
      setForm({ title: "", author: "", year: "", category: "" });
      loadBooks();
    } catch (error) {
      toast.error("❌ Thao tác thất bại!");
    }
  };

  // Gán dữ liệu sách để sửa
  const handleEdit = (book) => {
    setForm(book);
    setEditingId(book._id);
  };

  // Xoá sách
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sách này?")) return;
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      toast.info("🗑️ Đã xoá sách");
      loadBooks();
    } catch (error) {
      toast.error("❌ Xoá thất bại!");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">📚 Quản lý sách</h2>

      {/* Form nhập sách */}
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

      {/* Ô tìm kiếm */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng danh sách sách */}
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
          {books
            .filter((book) => book.title.toLowerCase().includes(search.toLowerCase()))
            .map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.year}</td>
                <td>{book.category}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(book)}>Sửa</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>Xoá</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}

export default App;
