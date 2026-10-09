import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { requireAuth, requireAdmin } from "../../middlewares/auth.js";

export const adminRepairRoutes = Router();

adminRepairRoutes.use(requireAuth, requireAdmin);

// Liste des tickets avec filtres
adminRepairRoutes.get("/tickets", async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 50);
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: "insensitive" } },
        { clientName: { contains: search, mode: "insensitive" } },
        { clientPhone: { contains: search } },
      ];
    }

    const [total, tickets] = await Promise.all([
      prisma.repairTicket.count({ where }),
      prisma.repairTicket.findMany({
        where,
        include: { repairType: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({
      data: tickets,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// Mise à jour d'un ticket (statut, prix devisé, créneau)
const updateTicketSchema = z.object({
  status: z
    .enum(["PENDING", "DIAGNOSING", "IN_PROGRESS", "DONE", "CANCELLED"])
    .optional(),
  quotedPrice: z.number().int().nonnegative().nullable().optional(),
  appointmentAt: z.string().datetime().nullable().optional(),
  description: z.string().optional(),
});

adminRepairRoutes.patch("/tickets/:id", async (req, res, next) => {
  try {
    const data = updateTicketSchema.parse(req.body);

    const existing = await prisma.repairTicket.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError("Ticket introuvable", 404);

    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.quotedPrice !== undefined) updateData.quotedPrice = data.quotedPrice;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.appointmentAt !== undefined) {
      updateData.appointmentAt = data.appointmentAt
        ? new Date(data.appointmentAt)
        : null;
    }

    const ticket = await prisma.repairTicket.update({
      where: { id: req.params.id },
      data: updateData,
      include: { repairType: true },
    });

    res.json({ data: ticket });
  } catch (err) {
    next(err);
  }
});

// CRUD sur les types de réparation
const repairTypeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  basePrice: z.number().int().nonnegative(),
  estimatedDuration: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

adminRepairRoutes.post("/types", async (req, res, next) => {
  try {
    const data = repairTypeSchema.parse(req.body);
    const type = await prisma.repairType.create({ data });
    res.status(201).json({ data: type });
  } catch (err) {
    next(err);
  }
});

adminRepairRoutes.patch("/types/:id", async (req, res, next) => {
  try {
    const data = repairTypeSchema.partial().parse(req.body);
    const existing = await prisma.repairType.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError("Type de réparation introuvable", 404);

    const type = await prisma.repairType.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ data: type });
  } catch (err) {
    next(err);
  }
});

adminRepairRoutes.delete("/types/:id", async (req, res, next) => {
  try {
    const existing = await prisma.repairType.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError("Type de réparation introuvable", 404);

    await prisma.repairType.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});