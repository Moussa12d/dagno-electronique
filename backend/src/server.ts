import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import {
  strictLimiter,
  publicLimiter,
  checkBlocked,
} from "./middlewares/rateLimit.js";
import { phoneRoutes } from "./routes/phone.routes.js";
import { brandRoutes } from "./routes/brand.routes.js";
import { accessoryRoutes } from "./routes/accessory.routes.js";
import { repairRoutes } from "./routes/repair.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { adminRoutes } from "./routes/admin/index.js";
import { orderRoutes } from "./routes/order.routes.js";
import { meRoutes } from "./routes/me.routes.js";

const app = express();

app.set("trust proxy", 1);

// 1. Sécurité de base
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// 2. CORS — on accepte seulement nos origines connues
const allowedOrigins = env.corsOrigin.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Origine non autorisée par CORS"));
    },
    credentials: true,
  })
);

// 3. Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 4. Logs
app.use(morgan("dev"));

// 5. Fichiers statiques
app.use("/uploads", express.static(path.resolve(env.uploadDir)));

// 6. Route de santé (pas de limiteur)
app.get("/api/v1/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "DAGNO ELECTRONIQUE API",
    timestamp: new Date().toISOString(),
  });
});

// 7. Vérification des IP bloquées (avant les limiteurs)
app.use("/api/v1/auth", checkBlocked);

// 8. Limiteur STRICT sur l'authentification (3/min, blocage 5 min)
app.use("/api/v1/auth/login", strictLimiter);
app.use("/api/v1/auth/register", strictLimiter);

// 9. Limiteur général sur toutes les routes API
app.use("/api/v1", publicLimiter);

// 10. Routes métier
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/phones", phoneRoutes);
app.use("/api/v1/accessories", accessoryRoutes);
app.use("/api/v1/repairs", repairRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/me", meRoutes);

// 11. 404 et erreurs
app.use(notFound);
app.use(errorHandler);

// 12. Démarrage
app.listen(env.port, () => {
  console.log("");
  console.log("========================================");
  console.log("  DAGNO ELECTRONIQUE — API");
  console.log("========================================");
  console.log(`  Serveur démarré sur http://localhost:${env.port}`);
  console.log(`  Environnement : ${env.nodeEnv}`);
  console.log(`  Uploads servis depuis : ${path.resolve(env.uploadDir)}`);
  console.log(`  CORS autorisés : ${allowedOrigins.join(", ")}`);
  console.log(`  Santé : http://localhost:${env.port}/api/v1/health`);
  console.log("========================================");
  console.log("");
});