const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

function fileFilter(req, file, cb) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/svg",
    "application/pdf",
  ];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and PDF allowed"), false);
  }
  cb(null, true);
}

module.exports = multer({ storage, fileFilter });
