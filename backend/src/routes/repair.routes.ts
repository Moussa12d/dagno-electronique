import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const repairRoutes = Router();

// Liste des types de réparation
repairRoutes.get("/types", async (_req, res, next) => {
  try {
    const types = await prisma.repairType.findMany({
      where: { isActive: true },
      orderBy: { basePrice: "asc" },
    });
    res.json({ data: types });
  } catch (err) {
    next(err);
  }
});

// Création d'un ticket de réparation
const createTicketSchema = z.object({
  clientName: z.string().min(2, "Nom trop court"),
  clientPhone: z.string().min(8, "Numéro de téléphone invalide"),
  phoneModel: z.string().min(2, "Modèle trop court"),
  repairTypeId: z.string().min(1),
  description: z.string().optional(),
  appointmentAt: z.string().datetime().optional(),
});

function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `REP-${year}-${random}`;
}

repairRoutes.post("/tickets", async (req, res, next) => {
  try {
    const data = createTicketSchema.parse(req.body);

    const repairType = await prisma.repairType.findUnique({
      where: { id: data.repairTypeId },
    });
    if (!repairType || !repairType.isActive) {
      throw new AppError("Type de réparation introuvable", 404);
    }

    const ticket = await prisma.repairTicket.create({
      data: {
        ticketNumber: generateTicketNumber(),
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        phoneModel: data.phoneModel,
        repairTypeId: data.repairTypeId,
        description: data.description,
        appointmentAt: data.appointmentAt
          ? new Date(data.appointmentAt)
          : undefined,
      },
      include: { repairType: true },
    });

    res.status(201).json({ data: ticket });
  } catch (err) {
    next(err);
  }
});

// Suivi public d'un ticket
repairRoutes.get("/tickets/:ticketNumber", async (req, res, next) => {
  try {
    const ticket = await prisma.repairTicket.findUnique({
      where: { ticketNumber: req.params.ticketNumber },
      include: { repairType: true },
    });
    if (!ticket) {
      throw new AppError("Ticket introuvable", 404);
    }
    res.json({ data: ticket });
  } catch (err) {
    next(err);
  }
});