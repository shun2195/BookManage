const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/bookdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Tạo schema User
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String,
}));

(async () => {
  try {
    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Tạo tài khoản mẫu
    await User.create({
      email: "admin@example.com",
      password: hashedPassword,
    });

    console.log("✅ Đã tạo tài khoản admin@example.com / 123456");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi tạo tài khoản:", err);
    process.exit(1);
  }
})();
