import { Router } from "express";
import { uploadSingle, uploadMultiple } from "../../middlewares/upload.js";
import { imgbbApiKey, IMGBB_UPLOAD_URL } from "../../config/imgbb.js";
import { AppError } from "../../utils/AppError.js";

export const adminUploadRoutes = Router();

interface ImgbbResponse {
  success: boolean;
  data?: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  error?: {
    message: string;
  };
}

async function uploadToImgBB(
  buffer: Buffer,
  filename: string
): Promise<{ url: string; displayUrl: string }> {
  if (!imgbbApiKey) {
    throw new AppError("Clé API ImgBB non configurée", 500);
  }

  // Encoder l'image en base64
  const base64 = buffer.toString("base64");

  // Construire le corps de la requête avec URLSearchParams
  const formData = new URLSearchParams();
  formData.append("image", base64);
  formData.append("name", filename);

  // L'API ImgBB attend la clé API dans l'URL
  const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${imgbbApiKey}`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const result = (await response.json()) as ImgbbResponse;

  if (!result.success || !result.data) {
    console.error("[ImgBB] Erreur:", result);
    throw new AppError(
      result.error?.message ?? "Erreur lors de l'upload vers ImgBB",
      500
    );
  }

  return {
    url: result.data.url,
    displayUrl: result.data.display_url,
  };
}

adminUploadRoutes.post("/", (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) return next(err);
    if (!req.file) throw new AppError("Aucun fichier reçu", 400);

    try {
      const result = await uploadToImgBB(
        req.file.buffer,
        req.file.originalname
      );
      res.status(201).json({
        data: {
          url: result.url,
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (e) {
      next(e);
    }
  });
});

adminUploadRoutes.post("/multiple", (req, res, next) => {
  uploadMultiple(req, res, async (err) => {
    if (err) return next(err);
    const files = (req.files as Express.Multer.File[]) ?? [];
    if (files.length === 0) throw new AppError("Aucun fichier reçu", 400);

    try {
      const results = await Promise.all(
        files.map((f) => uploadToImgBB(f.buffer, f.originalname))
      );
      res.status(201).json({
        data: results.map((r, i) => ({
          url: r.url,
          filename: files[i].originalname,
          size: files[i].size,
          mimetype: files[i].mimetype,
        })),
      });
    } catch (e) {
      next(e);
    }
  });
});