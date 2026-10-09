import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.resolve(env.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Nom unique : timestamp + extension d'origine
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const ALLOWED_MIME = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
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
}).array("files", 10); // 10 images max