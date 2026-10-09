import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middlewares/auth.js";

export const meRoutes = Router();

meRoutes.use(requireAuth);

// Mon profil
meRoutes.get("/", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        role: true,
        createdAt: true,
      },
    });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// Mes tickets de réparation
meRoutes.get("/repair-tickets", async (req, res, next) => {
  try {
    const tickets = await prisma.repairTicket.findMany({
      where: { userId: req.user!.userId },
      include: { repairType: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: tickets });
  } catch (err) {
    next(err);
  }
});
