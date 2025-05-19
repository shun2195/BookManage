const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb+srv://nik2192005:Nhung123@cluster0.0wm9yn7.mongodb.net/bookdb?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Mô hình Book
const Book = mongoose.model("Book", new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  category: String,
}));

// Mô hình User (dùng cho đăng nhập)
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String,
}));

// ==================== API ====================

// Lấy danh sách sách
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Thêm sách mới
app.post("/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// API đăng nhập
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Tài khoản không tồn tại" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu" });

  const token = jwt.sign({ userId: user._id }, "secret_key", { expiresIn: "1h" });
  res.json({ token });
});

// Khởi động server
app.listen(5000, () => console.log("✅ Backend running at http://localhost:5000"));
