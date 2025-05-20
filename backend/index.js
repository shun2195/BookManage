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
    console.log("✅ Đã tạo tài khoản admin: admin@example.com / admin123");
  } else {
    console.log("ℹ️ Admin đã tồn tại.");
  }
})();

// ======= Middleware xác thực =======
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Thiếu token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// ======= API =======

// 📚 Lấy danh sách sách (ai cũng xem được)
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// ➕ Thêm sách mới — chỉ admin
app.post("/books", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không có quyền thêm sách" });
  }

  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// ❌ Xoá sách — chỉ admin
app.delete("/books/:id", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không có quyền xoá sách" });
  }

  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá sách" });
});

// 🟢 Đăng ký
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

// 🔁 Đổi mật khẩu
app.post("/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  res.json({ message: "Đổi mật khẩu thành công" });
});

// ✅ Khởi động server
app.listen(5000, () => console.log("✅ Backend running at http://localhost:5000"));
