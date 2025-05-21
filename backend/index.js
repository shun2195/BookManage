const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

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
  coverUrl: String,
}));

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }, // user, admin, mod, guest, superadmin
  avatarUrl: { type: String, default: "" },
  isLocked: { type: Boolean, default: false },
  lockedAt: Date // lưu thời điểm bị khóa

}));

const BorrowRecord = mongoose.model("BorrowRecord", new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  borrowDate: { type: Date, default: Date.now },
  returnDate: Date,
  returnedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin hoặc người dùng tự đánh dấu
  returnedAt: Date,
  status: {
    type: String,
    enum: ["Đang mượn", "Đã trả", "Quá hạn"],
    default: "Đang mượn"
  }
}));

const multer = require("multer");
const path = require("path");

// Cấu hình lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });
// ======= Tạo admin và mod nếu chưa có =======
(async () => {
  const usersToCreate = [
    { email: "admin@example.com", password: "admin123", name: "Admin", role: "admin" },
    { email: "mod@example.com", password: "mod123", name: "Mod Kiểm duyệt", role: "mod" },
  ];

  for (const user of usersToCreate) {
    const exists = await User.findOne({ email: user.email });
    if (!exists) {
      const hashed = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: hashed });
      console.log(`✅ Đã tạo: ${user.email} / ${user.password}`);
    }
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

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới được thực hiện chức năng này" });
  }
  next();
};

const isSuperAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (user.role === "superadmin") return next();
  return res.status(403).json({ message: "Chỉ superadmin mới có quyền" });
};

const isModOrAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (user.role === "admin" || user.role === "mod") return next();
  return res.status(403).json({ message: "Chỉ mod hoặc admin mới có quyền" });
};

// ======= API =======


// ========📚 API sách=========
// 📚 Lấy danh sách sách (ai cũng xem được)
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});
// ➕ Thêm sách mới — chỉ admin
app.post("/books", upload.single("cover"), async (req, res) => {
  const { title, author, year, category } = req.body;
  const coverUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";
  const book = new Book({ title, author, year, category, coverUrl });
  await book.save();
  res.json(book);
});

// ❌ Xoá sách — chỉ admin
app.put("/books/:id", upload.single("cover"), async (req, res) => {
  const { title, author, year, category } = req.body;
  const update = { title, author, year, category };
  if (req.file) update.coverUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  const updated = await Book.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(updated);
});
app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá sách" });
});

// ========🔁 API mượn - trả==========
// ➕ Người dùng mượn sách:
app.post("/borrow", authMiddleware, async (req, res) => {
  const { bookId, returnDate } = req.body;

  const alreadyBorrowed = await BorrowRecord.findOne({
    userId: req.user.userId,
    bookId,
    status: "Đang mượn"
  });

  if (alreadyBorrowed) {
    return res.status(400).json({ message: "Bạn đã mượn sách này và chưa trả." });
  }

  const newRecord = new BorrowRecord({
    userId: req.user.userId,
    bookId,
    returnDate: returnDate ? new Date(returnDate) : null
  });

  await newRecord.save();
  res.json({ message: "Đã mượn sách thành công" });
});

// Trả sách
app.put("/return/:id", authMiddleware, async (req, res) => {
  const record = await BorrowRecord.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Không tìm thấy bản ghi" });

  record.status = "Đã trả";
  record.returnDate = new Date();
  await record.save();

  res.json({ message: "Đã trả sách thành công" });
});

//  👁️ Admin xem tất cả danh sách mượn trả
app.get("/borrows", authMiddleware, isAdmin, async (req, res) => {
  const { userId, bookId } = req.query;
  const query = {};
  if (userId) query.userId = userId;
  if (bookId) query.bookId = bookId;

  const records = await BorrowRecord.find(query)
    .populate("userId", "name email")
    .populate("bookId", "title")
    .populate("returnedBy", "name")
    .sort({ borrowDate: -1 });

  res.json(records);
});

//👤 Người dùng xem lịch sử của mình:
app.get("/my-borrows", authMiddleware, async (req, res) => {
  const records = await BorrowRecord.find({ userId: req.user.userId })
    .populate("bookId", "title author");
  res.json(records);
});



// 🔒 Khoá / mở khoá người dùng - chỉ admin
app.put("/users/:id/lock", authMiddleware, isAdmin, async (req, res) => {
  const { isLocked } = req.body;

  await User.findByIdAndUpdate(req.params.id, {
    isLocked,
    lockedAt: isLocked ? new Date() : null,
  });

  res.json({ message: isLocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản" });
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

// 🔐 Đăng nhập — kiểm tra isLocked
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Tài khoản không tồn tại" });

  if (user.isLocked) return res.status(403).json({ message: "Tài khoản đã bị khóa" });

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

// 👥 Danh sách người dùng (chỉ admin)
app.get("/users", authMiddleware, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// 👤 Admin cập nhật vai trò người dùng
app.put("/users/:id/role", authMiddleware, isAdmin, async (req, res) => {
  const { role } = req.body;
  const validRoles = ["admin", "mod", "user", "guest", "superadmin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Vai trò không hợp lệ" });
  }

  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: "Đã cập nhật vai trò người dùng" });
});

// Upload avatar
app.post("/users/upload-avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user.userId, { avatarUrl: url });
  res.json({ avatarUrl: url });
});
//API tổng số sách đang được mượn
app.get("/stats/borrowed-count", authMiddleware, isAdmin, async (req, res) => {
  const count = await BorrowRecord.countDocuments({ status: "Đang mượn" });
  res.json({ totalBorrowed: count });
});
//API top sách được mượn nhiều nhất
app.get("/stats/top-borrowed", authMiddleware, isAdmin, async (req, res) => {
  const top = await BorrowRecord.aggregate([
    { $group: { _id: "$bookId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book"
      }
    },
    { $unwind: "$book" },
    {
      $project: {
        _id: 0,
        title: "$book.title",
        author: "$book.author",
        count: 1
      }
    }
  ]);
  res.json(top);
});
//  Xem danh sách các admin
app.get("/system/admins", authMiddleware, isSuperAdmin, async (req, res) => {
  const admins = await User.find({ role: "admin" }).select("-password");
  res.json(admins);
});

app.patch("/cron/check-overdue", async (req, res) => {
  const now = new Date();
  const records = await BorrowRecord.find({
    status: "Đang mượn",
    returnDate: { $lt: now },
  });

  for (const record of records) {
    record.status = "Quá hạn";
    await record.save();
  }

  res.json({ message: `Đã đánh dấu ${records.length} sách quá hạn.` });
});
// Mở khóa tài khoản tự động
app.patch("/cron/unlock-users", async (req, res) => {
  const unlockDate = new Date();
  unlockDate.setDate(unlockDate.getDate() - 7); // sau 7 ngày sẽ tự mở

  const unlocked = await User.updateMany(
    { isLocked: true, lockedAt: { $lte: unlockDate } },
    { isLocked: false, lockedAt: null }
  );

  res.json({ message: `Đã mở khóa ${unlocked.modifiedCount} tài khoản.` });
});
// Gia hạn sách
app.patch("/borrow/:id/extend", authMiddleware, async (req, res) => {
  const { extraDays } = req.body;
  const record = await BorrowRecord.findById(req.params.id);

  if (!record || record.status !== "Đang mượn") {
    return res.status(400).json({ message: "Không thể gia hạn bản ghi này." });
  }

  const newDate = new Date(record.returnDate || Date.now());
  newDate.setDate(newDate.getDate() + extraDays);

  record.returnDate = newDate;
  await record.save();

  res.json({ message: "Đã gia hạn thêm " + extraDays + " ngày", returnDate: newDate });
});

// ✅ Khởi động server
app.listen(5000, () => console.log("✅ Backend running at http://localhost:5000"));
