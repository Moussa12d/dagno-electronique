import { Router } from "express";
import { uploadSingle, uploadMultiple } from "../../middlewares/upload.js";
import { AppError } from "../../utils/AppError.js";
import rateLimit from "express-rate-limit";

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // 20 uploads max par minute
  message: { error: "Trop d'uploads, réessayez dans une minute." },
});

export const adminUploadRoutes = Router();
// Upload d'une seule image
adminUploadRoutes.post("/", uploadLimiter, (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) throw new AppError("Aucun fichier reçu", 400);

    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({
      data: {
        url,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  });
});

// Upload de plusieurs images (max 10)
adminUploadRoutes.post("/multiple", uploadLimiter, (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) return next(err);
    const files = (req.files as Express.Multer.File[]) ?? [];
    if (files.length === 0) throw new AppError("Aucun fichier reçu", 400);

    const urls = files.map((f) => ({
      url: `/uploads/${f.filename}`,
      filename: f.filename,
      size: f.size,
      mimetype: f.mimetype,
    }));

    res.status(201).json({ data: urls });
  });
});