import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const phoneRoutes = Router();

const listQuerySchema = z.object({
  brand: z.string().optional(),
  condition: z.enum(["NEW", "REFURBISHED"]).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  search: z.string().optional(),
  inStock: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

phoneRoutes.get("/", async (req, res, next) => {
  try {
    const query = listQuerySchema.parse(req.query);
    const where: Record<string, unknown> = { isActive: true };

    if (query.brand) {
      where.brand = { slug: query.brand };
    }
    if (query.condition) {
      where.condition = query.condition;
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
      where.OR = [
        { model: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [total, phones] = await Promise.all([
      prisma.phone.count({ where }),
      prisma.phone.findMany({
        where,
        include: { brand: true },
        orderBy: [{ createdAt: "desc" }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    res.json({
      data: phones,
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

phoneRoutes.get("/:id", async (req, res, next) => {
  try {
    const phone = await prisma.phone.findUnique({
      where: { id: req.params.id },
      include: { brand: true },
    });
    if (!phone || !phone.isActive) {
      throw new AppError("Téléphone introuvable", 404);
    }
    res.json({ data: phone });
  } catch (err) {
    next(err);
  }
});