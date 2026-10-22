import { Router } from "express";
import { uploadSingle, uploadMultiple } from "../../middlewares/upload.js";
import { imgbbApiKey, IMGBB_UPLOAD_URL } from "../../config/imgbb.js";
import { AppError } from "../../utils/AppError.js";

export const adminUploadRoutes = Router();

interface ImgbbResponse {
  success: boolean;
  data?: { url: string; display_url: string; delete_url: string; };
  error?: { message: string; };
}

// Fonction pour uploader vers ImgBB
async function uploadToImgBB(buffer: Buffer, filename: string): Promise<{ url: string }> {
  if (!imgbbApiKey) {
    console.error("[ImgBB] ERREUR: La clé API n'est pas définie dans les variables d'environnement.");
    throw new AppError("Configuration serveur incorrecte (clé ImgBB manquante)", 500);
  }

  const base64 = buffer.toString("base64");
  const formData = new URLSearchParams();
  formData.append("image", base64);
  formData.append("name", filename);

  try {
    const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${imgbbApiKey}`, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const result = (await response.json()) as ImgbbResponse;
    if (!result.success || !result.data) {
      console.error("[ImgBB] Réponse d'erreur:", result);
      throw new AppError(result.error?.message ?? "Erreur ImgBB", 500);
    }
    return { url: result.data.url };
  } catch (err: any) {
    console.error("[ImgBB] Erreur réseau:", err.message);
    throw new AppError("Impossible de contacter le service d'images", 500);
  }
}

// Route pour un seul fichier (avec gestion d'erreur Multer)
adminUploadRoutes.post("/", (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error("[Multer] Erreur:", err.message);
      return next(new AppError(err.message, 400));
    }
    if (!req.file) return next(new AppError("Aucun fichier reçu", 400));

    try {
      const result = await uploadToImgBB(req.file.buffer, req.file.originalname);
      res.status(201).json({ data: { url: result.url, filename: req.file.originalname } });
    } catch (e) {
      next(e);
    }
  });
});

// Route pour plusieurs fichiers (avec gestion d'erreur Multer)
adminUploadRoutes.post("/multiple", (req, res, next) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.error("[Multer] Erreur:", err.message);
      return next(new AppError(err.message, 400));
    }
    const files = (req.files as Express.Multer.File[]) ?? [];
    if (files.length === 0) return next(new AppError("Aucun fichier reçu", 400));

    try {
      const results = await Promise.all(files.map(f => uploadToImgBB(f.buffer, f.originalname)));
      res.status(201).json({ data: results.map((r, i) => ({ url: r.url, filename: files[i].originalname })) });
    } catch (e) {
      next(e);
    }
  });
});