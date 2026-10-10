import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export const authRoutes = Router();

const registerSchema = z.object({
  email: z.string().email("Email invalide").optional(),
  password: z.string().min(6, "Mot de passe : 6 caractères minimum"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(8, "Numéro de téléphone requis"),
  address: z.string().optional(),
});

authRoutes.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const email = data.email
      ? data.email.toLowerCase()
      : `${data.phone.replace(/\D/g, "")}@dagno.local`;

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      throw new AppError("Un compte existe déjà avec ce numéro", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      env.jwt.accessSecret,
      { expiresIn: env.jwt.accessExpiresIn }
    );

    res.status(201).json({ data: { user, accessToken } });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  identifier: z.string().min(1, "Email ou téléphone requis"),
  password: z.string().min(1),
});

authRoutes.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const identifier = data.identifier.trim().toLowerCase();
    const isEmail = identifier.includes("@");

    let user;
    if (isEmail) {
      user = await prisma.user.findUnique({ where: { email: identifier } });
    } else {
      user = await prisma.user.findFirst({
        where: { phone: { contains: identifier.replace(/\s/g, "") } },
      });
    }

    if (!user) {
      throw new AppError("Identifiants incorrects", 401);
    }

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) {
      throw new AppError("Identifiants incorrects", 401);
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      env.jwt.accessSecret,
      { expiresIn: env.jwt.accessExpiresIn }
    );

    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
});