import multer from "multer";
import { AppError } from "../utils/AppError.js";

const ALLOWED_MIME = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

// Stockage en mémoire (pas sur disque) pour envoyer à ImgBB
const storage = multer.memoryStorage();

export const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(
        new AppError(
          "Format de fichier non autorisé. Utilisez JPG, PNG, WEBP ou GIF.",
          400
        )
      );
    }
    cb(null, true);
  },
}).single("file");

export const uploadMultiple = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(
        new AppError(
          "Format de fichier non autorisé. Utilisez JPG, PNG, WEBP ou GIF.",
          400
        )
      );
    }
    cb(null, true);
  },
}).array("files", 10);