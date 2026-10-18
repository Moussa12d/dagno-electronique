const { PrismaClient } = require("@prisma/client");

async function main() {
  console.log("=== Test de connexion à la base ===");
  console.log("DATABASE_URL =", process.env.DATABASE_URL);

  const prisma = new PrismaClient();

  try {
    const count = await prisma.phone.count();
    console.log("✅ Connexion réussie.");
    console.log("Nombre de téléphones :", count);
  } catch (e) {
    console.error("❌ ERREUR :", e.message);
    console.error("Code :", e.code);
  } finally {
    await prisma.$disconnect();
  }
}

main();