import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", year: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  const loadBooks = async () => {
    const res = await axios.get("http://localhost:5000/books");
    setBooks(res.data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/books/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:5000/books", form);
    }
    setForm({ title: "", author: "", year: "", category: "" });
    loadBooks();
  };

  const handleEdit = book => {
    setForm(book);
    setEditingId(book._id);
  };

  const handleDelete = async id => {
    await axios.delete(`http://localhost:5000/books/${id}`);
    loadBooks();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Quản lý sách</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Tiêu đề" value={form.title} onChange={handleChange} />
        <input name="author" placeholder="Tác giả" value={form.author} onChange={handleChange} />
        <input name="year" placeholder="Năm" value={form.year} onChange={handleChange} />
        <input name="category" placeholder="Thể loại" value={form.category} onChange={handleChange} />
        <button type="submit">{editingId ? "Cập nhật" : "Thêm"}</button>
      </form>

      <ul>
        {books.map(book => (
          <li key={book._id}>
            <b>{book.title}</b> - {book.author} ({book.year}) [{book.category}]
            <button onClick={() => handleEdit(book)}>Sửa</button>
            <button onClick={() => handleDelete(book._id)}>Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
