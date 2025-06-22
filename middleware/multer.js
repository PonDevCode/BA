const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu file tạm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // thư mục lưu ảnh tạm
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const index = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname.slice(index) ); 
  },
});

const upload = multer({ storage });

module.exports = upload;
