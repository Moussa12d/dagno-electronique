import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { requireAuth, requireAdmin } from "../../middlewares/auth.js";
import { adminPhoneRoutes } from "./phone.admin.routes.js";
import { adminAccessoryRoutes } from "./accessory.admin.routes.js";
import { adminRepairRoutes } from "./repair.admin.routes.js";
import { adminOrderRoutes } from "./order.admin.routes.js";
import { adminUploadRoutes } from "./upload.admin.routes.js";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireAdmin);
adminRoutes.use("/uploads", adminUploadRoutes);

// Marques (création rapide côté admin)
const brandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().optional(),
});

adminRoutes.post("/brands", async (req, res, next) => {
  try {
    const data = brandSchema.parse(req.body);
    const brand = await prisma.brand.create({ data });
    res.status(201).json({ data: brand });
  } catch (err) {
    next(err);
  }
});

// Catégories d'accessoires (création rapide côté admin)
const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
});

adminRoutes.post("/accessory-categories", async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await prisma.accessoryCategory.create({ data });
    res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
});

adminRoutes.use("/phones", adminPhoneRoutes);
adminRoutes.use("/accessories", adminAccessoryRoutes);
adminRoutes.use("/repairs", adminRepairRoutes);
adminRoutes.use("/orders", adminOrderRoutes);