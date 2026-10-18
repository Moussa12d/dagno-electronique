import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

// Stockage en mémoire des IP bloquées : { ip: dateExpiration }
const blockedIPs = new Map<string, number>();

// Nettoyage périodique des IP expirées (toutes les minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, expiry] of blockedIPs.entries()) {
    if (expiry < now) blockedIPs.delete(ip);
  }
}, 60 * 1000);

// ============================================
// Middleware qui bloque les IP déjà bloquées
// ============================================
export function checkBlocked(req: Request, res: Response, next: NextFunction) {
  const ip = ipKeyGenerator(req.ip ?? "unknown");
  const expiry = blockedIPs.get(ip);

  if (expiry && expiry > Date.now()) {
    const secondsLeft = Math.ceil((expiry - Date.now()) / 1000);
    return res.status(429).json({
      error: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil(
        secondsLeft / 60
      )} minutes.`,
      retryAfter: secondsLeft,
    });
  }

  next();
}

// ============================================
// Limiteur STRICT : 3 tentatives / minute
// + blocage 5 minutes si dépassement
// ============================================
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  message: {
    error: "Trop de tentatives. Veuillez réessayer dans 5 minutes.",
  },
  statusCode: 429,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
  skipSuccessfulRequests: true,
  handler: (req, res, _next, _options) => {
    const ip = ipKeyGenerator(req.ip ?? "unknown");
    blockedIPs.set(ip, Date.now() + 5 * 60 * 1000);
    res.status(429).json({
      error: "Trop de tentatives. Veuillez réessayer dans 5 minutes.",
      retryAfter: 300,
    });
  },
});

// ============================================
// Limiteur PUBLIC : 60 requêtes / minute
// ============================================
export const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  message: {
    error: "Trop de requêtes. Veuillez ralentir.",
  },
  statusCode: 429,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
});