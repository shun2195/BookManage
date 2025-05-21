import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = "https://bookmanage-backend-ywce.onrender.com";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/books/${id}`)
      .then(res => {
        setBook(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Không thể tải chi tiết sách");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container mt-4">Đang tải...</div>;
  if (!book) return <div className="container mt-4 text-danger">Sách không tồn tại.</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt="Ảnh bìa"
              className="img-fluid shadow"
              style={{ aspectRatio: "2 / 3", objectFit: "contain", backgroundColor: "#f8f9fa", padding: "8px" }}
            />
          ) : (
            <div className="bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: 320 }}>
              Không có ảnh bìa
            </div>
          )}
        </div>

        <div className="col-md-8">
          <h3>{book.title}</h3>
          <p><strong>Tác giả:</strong> {book.author}</p>
          <p><strong>Năm xuất bản:</strong> {book.year}</p>
          <p><strong>Thể loại:</strong> {book.category}</p>
          <p><strong>Mô tả:</strong> {book.description || "Chưa có mô tả cho sách này."}</p>

          {book.fileUrl && (
            <a href={book.fileUrl} className="btn btn-outline-primary mt-2" target="_blank" rel="noopener noreferrer">
              📥 Tải file PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;