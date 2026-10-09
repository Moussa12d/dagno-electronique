import { Router } from "express";
import { prisma } from "../config/prisma.js";

export const brandRoutes = Router();

brandRoutes.get("/", async (_req, res, next) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { phones: true } },
      },
    });
    res.json({ data: brands });
  } catch (err) {
    next(err);
  }
});