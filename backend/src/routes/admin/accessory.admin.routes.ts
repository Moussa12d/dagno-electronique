import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { requireAuth, requireAdmin } from "../../middlewares/auth.js";

export const adminAccessoryRoutes = Router();

adminAccessoryRoutes.use(requireAuth, requireAdmin);

const createSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

const updateSchema = createSchema.partial();

adminAccessoryRoutes.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 50);
    const search = req.query.search as string | undefined;

    const where: Record<string, unknown> = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const [total, accessories] = await Promise.all([
      prisma.accessory.count({ where }),
      prisma.accessory.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({
      data: accessories,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

adminAccessoryRoutes.post("/", async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);

    const category = await prisma.accessoryCategory.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new AppError("Catégorie introuvable", 404);

    const accessory = await prisma.accessory.create({
      data,
      include: { category: true },
    });

    res.status(201).json({ data: accessory });
  } catch (err) {
    next(err);
  }
});

adminAccessoryRoutes.patch("/:id", async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);

    const existing = await prisma.accessory.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError("Accessoire introuvable", 404);

    const accessory = await prisma.accessory.update({
      where: { id: req.params.id },
      data,
      include: { category: true },
    });

    res.json({ data: accessory });
  } catch (err) {
    next(err);
  }
});

adminAccessoryRoutes.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.accessory.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError("Accessoire introuvable", 404);

    await prisma.accessory.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});