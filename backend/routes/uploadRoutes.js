const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadPDF } = require("../controllers/uploadController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("pdf"), uploadPDF);

router.get("/uploaded-files", (req, res) => {
  const uploadDir = path.join(__dirname, "../uploads");
  const files = [];

  const fs = require("fs");
  if (fs.existsSync(uploadDir)) {
    fs.readdirSync(uploadDir).forEach((file) => {
      files.push({ name: file, _id: file }); 
    });
  }

  res.json(files);
});

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;