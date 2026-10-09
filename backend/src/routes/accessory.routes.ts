import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const accessoryRoutes = Router();

const listQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  inStock: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

accessoryRoutes.get("/", async (req, res, next) => {
  try {
    const query = listQuerySchema.parse(req.query);
    const where: Record<string, unknown> = { isActive: true };

    if (query.category) {
      where.category = { slug: query.category };
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        (where.price as Record<string, number>).gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        (where.price as Record<string, number>).lte = query.maxPrice;
      }
    }
    if (query.inStock === "true") {
      where.stock = { gt: 0 };
    }
    if (query.search) {
      where.name = { contains: query.search, mode: "insensitive" };
    }

    const [total, accessories] = await Promise.all([
      prisma.accessory.count({ where }),
      prisma.accessory.findMany({
        where,
        include: { category: true },
        orderBy: [{ createdAt: "desc" }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    res.json({
      data: accessories,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

accessoryRoutes.get("/categories", async (_req, res, next) => {
  try {
    const categories = await prisma.accessoryCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { accessories: true } } },
    });
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
});

accessoryRoutes.get("/:id", async (req, res, next) => {
  try {
    const accessory = await prisma.accessory.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });
    if (!accessory || !accessory.isActive) {
      throw new AppError("Accessoire introuvable", 404);
    }
    res.json({ data: accessory });
  } catch (err) {
    next(err);
  }
});