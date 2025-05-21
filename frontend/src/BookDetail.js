import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./LoginForm";

const API = "https://bookmanage-backend-ywce.onrender.com";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: "", comment: "" });
  const [showLogin, setShowLogin] = useState(false);

  const userId = localStorage.getItem("email");

  // Load chi tiết sách và đánh giá
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookRes = await axios.get(`${API}/books/${id}`);
        setBook(bookRes.data);

        const reviewRes = await axios.get(`${API}/reviews/${id}`);
        setReviews(reviewRes.data);

        setLoading(false);
      } catch {
        toast.error("Không thể tải chi tiết sách");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBorrow = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    setShowLogin(true);
    return;
  }

  try {
    await axios.post(`${API}/borrow`, { bookId: id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("📚 Đã mượn sách thành công!");
  } catch {
    toast.error("❌ Mượn sách thất bại hoặc đã mượn rồi.");
  }
};


  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/reviews`, {
        bookId: id,
        userId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success("✅ Đã gửi đánh giá");
      setReviewForm({ rating: "", comment: "" });

      const res = await axios.get(`${API}/reviews/${id}`);
      setReviews(res.data);
    } catch {
      toast.error("❌ Gửi đánh giá thất bại");
    }
  };

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

          <button className="btn btn-success mt-2 ms-2" onClick={handleBorrow}>📚 Mượn sách</button>
        </div>
      </div>

      <hr />

      <div className="mt-4">
        <h5>📝 Đánh giá sách</h5>
        <form onSubmit={handleReviewSubmit} className="row g-2">
          <div className="col-md-2">
            <select
              name="rating"
              className="form-select"
              value={reviewForm.rating}
              onChange={handleReviewChange}
              required
            >
              <option value="">Sao</option>
              <option value="1">⭐</option>
              <option value="2">⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
            </select>
          </div>
          <div className="col-md-8">
            <input
              type="text"
              name="comment"
              className="form-control"
              placeholder="Nhận xét..."
              value={reviewForm.comment}
              onChange={handleReviewChange}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Gửi</button>
          </div>
        </form>
      </div>

      <div className="mt-4">
        <h5>📣 Nhận xét từ người đọc</h5>
        {reviews.length === 0 ? (
          <p className="text-muted">Chưa có đánh giá nào.</p>
        ) : (
          <ul className="list-group">
            {reviews.map((r, index) => (
              <li key={index} className="list-group-item">
                <div>
                  <strong>{r.userId}</strong> – <span className="text-warning">{"⭐".repeat(r.rating)}</span>
                </div>
                <div>{r.comment}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default BookDetail;
