import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let folder = "uploads/others";

    if (ext.match(/\.(pdf|doc|docx)$/)) {
      folder = "uploads/files";
    } else if (ext.match(/\.(jpg|jpeg|png)$/)) {
      folder = "uploads/images";
    } else if (ext.match(/\.(mp3|wav|ogg)$/)) {
      folder = "uploads/recordings";
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = "-" + path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + baseName + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("audio/") ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true); // Cho phép file
  } else {
    cb(new Error("File type not supported"), false); // Từ chối file không hợp lệ
  }
};

// Middleware upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});