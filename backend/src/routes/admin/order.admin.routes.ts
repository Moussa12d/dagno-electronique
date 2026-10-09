import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { requireAuth, requireAdmin } from "../../middlewares/auth.js";

export const adminOrderRoutes = Router();

adminOrderRoutes.use(requireAuth, requireAdmin);

adminOrderRoutes.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 50);
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({
      data: orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

const updateOrderSchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "DELIVERED", "PAID_ON_DELIVERY", "CANCELLED"])
    .optional(),
  notes: z.string().optional(),
});

adminOrderRoutes.patch("/:id", async (req, res, next) => {
  try {
    const data = updateOrderSchema.parse(req.body);

    const existing = await prisma.order.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError("Commande introuvable", 404);

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data,
      include: { items: true },
    });

    res.json({ data: order });
  } catch (err) {
    next(err);
  }
});