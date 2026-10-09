import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Erreurs de validation Zod
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: "Données invalides",
      details: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Erreurs applicatives
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  // Erreur inconnue
  console.error("[Erreur non gérée]", err);
  return res.status(500).json({
    error: "Erreur interne du serveur",
  });
}