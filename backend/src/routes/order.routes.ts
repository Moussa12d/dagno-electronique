import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { requireAuth } from "../middlewares/auth.js";

export const orderRoutes = Router();

orderRoutes.use(requireAuth);

// Créer une commande
const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  deliveryAddress: z.string().min(5),
  city: z.string().default("Bamako"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        phoneId: z.string().optional(),
        accessoryId: z.string().optional(),
        quantity: z.number().int().positive().default(1),
      })
    )
    .min(1, "Le panier est vide"),
});

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `CMD-${year}-${random}`;
}

orderRoutes.post("/", async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const userId = req.user!.userId;

    // Récupérer les infos produits et vérifier le stock
    const orderItems: {
      phoneId?: string;
      accessoryId?: string;
      itemName: string;
      quantity: number;
      unitPrice: number;
    }[] = [];

    let total = 0;

    for (const item of data.items) {
      if (item.phoneId) {
        const phone = await prisma.phone.findUnique({
          where: { id: item.phoneId },
          include: { brand: true },
        });
        if (!phone || !phone.isActive) {
          throw new AppError(`Téléphone introuvable`, 404);
        }
        if (phone.stock < item.quantity) {
          throw new AppError(
            `Stock insuffisant pour ${phone.brand.name} ${phone.model}`,
            400
          );
        }
        const itemName = `${phone.brand.name} ${phone.model}${phone.storage ? " " + phone.storage : ""}`;
        orderItems.push({
          phoneId: phone.id,
          itemName,
          quantity: item.quantity,
          unitPrice: phone.price,
        });
        total += phone.price * item.quantity;
      } else if (item.accessoryId) {
        const accessory = await prisma.accessory.findUnique({
          where: { id: item.accessoryId },
        });
        if (!accessory || !accessory.isActive) {
          throw new AppError(`Accessoire introuvable`, 404);
        }
        if (accessory.stock < item.quantity) {
          throw new AppError(
            `Stock insuffisant pour ${accessory.name}`,
            400
          );
        }
        orderItems.push({
          accessoryId: accessory.id,
          itemName: accessory.name,
          quantity: item.quantity,
          unitPrice: accessory.price,
        });
        total += accessory.price * item.quantity;
      } else {
        throw new AppError("Article invalide", 400);
      }
    }

    // Créer la commande en transaction : décrémenter le stock + créer la commande
    const order = await prisma.$transaction(async (tx) => {
      // Décrémenter les stocks
      for (const item of orderItems) {
        if (item.phoneId) {
          await tx.phone.update({
            where: { id: item.phoneId },
            data: { stock: { decrement: item.quantity } },
          });
        } else if (item.accessoryId) {
          await tx.accessory.update({
            where: { id: item.accessoryId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          deliveryAddress: data.deliveryAddress,
          city: data.city,
          notes: data.notes,
          total,
          status: "PENDING",
          items: {
            create: orderItems.map((item) => ({
              phoneId: item.phoneId,
              accessoryId: item.accessoryId,
              itemName: item.itemName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: { items: true },
      });
    });

    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
});

// Lister mes commandes
orderRoutes.get("/me", async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
});

// Détail d'une commande
orderRoutes.get("/me/:id", async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId },
      include: { items: true },
    });
    if (!order) throw new AppError("Commande introuvable", 404);
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
});