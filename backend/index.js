const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// ======= Kết nối MongoDB =======
mongoose.connect("mongodb+srv://nik2192005:Nhung123@cluster0.0wm9yn7.mongodb.net/bookdb?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ======= Mô hình =======
const Book = mongoose.model("Book", new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  category: String,
}));

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }
}));

// ======= Tạo admin nếu chưa có =======
(async () => {
  const adminEmail = "admin@example.com";
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin Quản trị",
      email: adminEmail,
      password: hashed,
      role: "admin"
    });
    console.log("✅ Tài khoản admin đã được tạo: admin@example.com / admin123");
  } else {
    console.log("ℹ️ Tài khoản admin đã tồn tại.");
  }
})();

// ======= API =======

// 📚 Danh sách sách
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// ➕ Thêm sách mới
app.post("/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// 🟢 Đăng ký tài khoản
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, "secret_key", { expiresIn: "1h" });

  res.json({
    message: "Đăng ký thành công",
    token,
    role: newUser.role,
    name: newUser.name
  });
});

// 🔐 Đăng nhập
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Tài khoản không tồn tại" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu" });

  const token = jwt.sign({ userId: user._id }, "secret_key", { expiresIn: "1h" });

  res.json({
    token,
    role: user.role,
    name: user.name
  });
});

// ✅ Khởi động server
app.listen(5000, () => console.log("✅ Backend running at http://localhost:5000"));
