const multer = require('multer');
const path = require('path');
// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|webp|svg/;
    const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extName) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  };
  
  const upload = multer({ storage , fileFilter , limits: { fileSize: 50 * 1024 * 1024 },});

  module.exports = upload;


