import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { requireAuth, requireAdmin } from "../../middlewares/auth.js";

export const adminPhoneRoutes = Router();

adminPhoneRoutes.use(requireAuth, requireAdmin);

const createSchema = z.object({
  brandId: z.string().min(1),
  model: z.string().min(1),
  storage: z.string().optional(),
  color: z.string().optional(),
  condition: z.enum(["NEW", "REFURBISHED"]).default("NEW"),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
  description: z.string().optional(),
  images: z.array(z.string()).default([]),
  warrantyMonths: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

const updateSchema = createSchema.partial();

// Liste complète (y compris inactifs), avec pagination
adminPhoneRoutes.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 50);
    const search = req.query.search as string | undefined;

    const where: Record<string, unknown> = {};
    if (search) {
      where.model = { contains: search, mode: "insensitive" };
    }

    const [total, phones] = await Promise.all([
      prisma.phone.count({ where }),
      prisma.phone.findMany({
        where,
        include: { brand: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({
      data: phones,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// Création
adminPhoneRoutes.post("/", async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);

    const brand = await prisma.brand.findUnique({ where: { id: data.brandId } });
    if (!brand) throw new AppError("Marque introuvable", 404);

    const phone = await prisma.phone.create({
      data,
      include: { brand: true },
    });

    res.status(201).json({ data: phone });
  } catch (err) {
    next(err);
  }
});

// Modification
adminPhoneRoutes.patch("/:id", async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);

    const existing = await prisma.phone.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError("Téléphone introuvable", 404);

    const phone = await prisma.phone.update({
      where: { id: req.params.id },
      data,
      include: { brand: true },
    });

    res.json({ data: phone });
  } catch (err) {
    next(err);
  }
});

// Suppression
adminPhoneRoutes.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.phone.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError("Téléphone introuvable", 404);

    await prisma.phone.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});