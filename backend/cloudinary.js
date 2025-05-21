// cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dotlbin8d",
  api_key: "435742649524788",
  api_secret: "Lju1lOwPJVl4WFovWnzbS4OvkNk",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "book_covers", // tên thư mục trên Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 600, height: 800, crop: "limit" }],
  },
});

const upload = require("multer")({ storage });

module.exports = { cloudinary, upload };
