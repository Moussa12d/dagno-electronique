import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export interface AuthPayload {
  userId: string;
  role: "CLIENT" | "ADMIN";
}

// Étend le type Request pour y attacher l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Token d'authentification manquant", 401);
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, env.jwt.accessSecret) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError("Token invalide ou expiré", 401));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new AppError("Authentification requise", 401));
  }
  if (req.user.role !== "ADMIN") {
    return next(new AppError("Accès réservé à l'administrateur", 403));
  }
  next();
}