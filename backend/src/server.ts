import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { phoneRoutes } from "./routes/phone.routes.js";
import { brandRoutes } from "./routes/brand.routes.js";
import { accessoryRoutes } from "./routes/accessory.routes.js";
import { repairRoutes } from "./routes/repair.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { adminRoutes } from "./routes/admin/index.js";
import { orderRoutes } from "./routes/order.routes.js";
import { meRoutes } from "./routes/me.routes.js";

const app = express();

// 1. Sécurité et parsing
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 2. Fichiers statiques — TOUJOURS AVANT les routes et avant notFound
app.use("/uploads", express.static(path.resolve(env.uploadDir)));

// 3. Route de santé
app.get("/api/v1/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "DAGNO ELECTRONIQUE API",
    timestamp: new Date().toISOString(),
  });
});

// 4. Routes métier
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/phones", phoneRoutes);
app.use("/api/v1/accessories", accessoryRoutes);
app.use("/api/v1/repairs", repairRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/me", meRoutes);
// 5. 404 et gestion d'erreurs — TOUJOURS EN DERNIER
app.use(notFound);
app.use(errorHandler);

// 6. Démarrage
app.listen(env.port, () => {
  console.log("");
  console.log("========================================");
  console.log("  DAGNO ELECTRONIQUE — API");
  console.log("========================================");
  console.log(`  Serveur démarré sur http://localhost:${env.port}`);
  console.log(`  Environnement : ${env.nodeEnv}`);
  console.log(`  Uploads servis depuis : ${path.resolve(env.uploadDir)}`);
  console.log(`  Santé : http://localhost:${env.port}/api/v1/health`);
  console.log("========================================");
  console.log("");
});