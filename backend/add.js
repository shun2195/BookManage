const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/bookdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Book = mongoose.model("Book", new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  category: String,
}));

async function addBook() {
  const newBook = new Book({
    title: "Lập trình NodeJS",
    author: "Minh",
    year: 2024,
    category: "Công nghệ"
  });
  await newBook.save();
  console.log("✅ Đã thêm sách!");
  process.exit();
}

addBook();
