import { PrismaClient, PhoneCondition, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed DAGNO ELECTRONIQUE...");

  // ============================================
  // NETTOYAGE (pour pouvoir relancer le seed sans doublons)
  // ============================================
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.repairTicket.deleteMany();
  await prisma.repairType.deleteMany();
  await prisma.accessory.deleteMany();
  await prisma.accessoryCategory.deleteMany();
  await prisma.phone.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Base nettoyée");

  // ============================================
  // UTILISATEURS
  // ============================================
  const adminPassword = await bcrypt.hash("Admin@2026", 10);
  const clientPassword = await bcrypt.hash("Client@2026", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@dagno.ml",
      passwordHash: adminPassword,
      firstName: "Amadou",
      lastName: "Dagno",
      phone: "+223 70 00 00 01",
      address: "Hamdallaye ACI 2000",
      city: "Bamako",
      role: Role.ADMIN,
    },
  });

  const client = await prisma.user.create({
    data: {
      email: "client@dagno.ml",
      passwordHash: clientPassword,
      firstName: "Fatoumata",
      lastName: "Traoré",
      phone: "+223 76 12 34 56",
      address: "Badalabougou Est",
      city: "Bamako",
      role: Role.CLIENT,
    },
  });

  console.log(`✓ Utilisateurs créés : ${admin.email}, ${client.email}`);

  // ============================================
  // MARQUES
  // ============================================
  const brandsData = [
    { name: "Apple", slug: "apple" },
    { name: "Samsung", slug: "samsung" },
    { name: "Xiaomi", slug: "xiaomi" },
    { name: "Tecno", slug: "tecno" },
    { name: "Infinix", slug: "infinix" },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandsData) {
    const created = await prisma.brand.create({ data: b });
    brands[b.slug] = created.id;
  }

  console.log(`✓ ${brandsData.length} marques créées`);

  // ============================================
  // TELEPHONES (prix en FCFA, marché de Bamako)
  // ============================================
  const phonesData = [
    // Apple
    { brandSlug: "apple", model: "iPhone 15 Pro Max", storage: "256 Go", color: "Titane naturel", condition: PhoneCondition.NEW, price: 950000, stock: 3, warrantyMonths: 12 },
    { brandSlug: "apple", model: "iPhone 15", storage: "128 Go", color: "Noir", condition: PhoneCondition.NEW, price: 650000, stock: 5, warrantyMonths: 12 },
    { brandSlug: "apple", model: "iPhone 14", storage: "128 Go", color: "Bleu", condition: PhoneCondition.NEW, price: 520000, stock: 4, warrantyMonths: 12 },
    { brandSlug: "apple", model: "iPhone 13", storage: "128 Go", color: "Minuit", condition: PhoneCondition.REFURBISHED, price: 320000, stock: 8, warrantyMonths: 6 },
    { brandSlug: "apple", model: "iPhone 12", storage: "64 Go", color: "Blanc", condition: PhoneCondition.REFURBISHED, price: 235000, stock: 6, warrantyMonths: 6 },
    { brandSlug: "apple", model: "iPhone 11", storage: "64 Go", color: "Noir", condition: PhoneCondition.REFURBISHED, price: 175000, stock: 10, warrantyMonths: 6 },
    { brandSlug: "apple", model: "iPhone XR", storage: "64 Go", color: "Rouge", condition: PhoneCondition.REFURBISHED, price: 135000, stock: 7, warrantyMonths: 3 },

    // Samsung
    { brandSlug: "samsung", model: "Galaxy S24 Ultra", storage: "256 Go", color: "Titane gris", condition: PhoneCondition.NEW, price: 850000, stock: 2, warrantyMonths: 12 },
    { brandSlug: "samsung", model: "Galaxy S23", storage: "128 Go", color: "Noir", condition: PhoneCondition.NEW, price: 480000, stock: 4, warrantyMonths: 12 },
    { brandSlug: "samsung", model: "Galaxy A55", storage: "128 Go", color: "Bleu", condition: PhoneCondition.NEW, price: 195000, stock: 12, warrantyMonths: 12 },
    { brandSlug: "samsung", model: "Galaxy A35", storage: "128 Go", color: "Noir", condition: PhoneCondition.NEW, price: 145000, stock: 15, warrantyMonths: 12 },
    { brandSlug: "samsung", model: "Galaxy A15", storage: "128 Go", color: "Bleu clair", condition: PhoneCondition.NEW, price: 95000, stock: 20, warrantyMonths: 12 },
    { brandSlug: "samsung", model: "Galaxy A54", storage: "128 Go", color: "Blanc", condition: PhoneCondition.REFURBISHED, price: 135000, stock: 6, warrantyMonths: 6 },
    { brandSlug: "samsung", model: "Galaxy Note 20", storage: "256 Go", color: "Bronze", condition: PhoneCondition.REFURBISHED, price: 210000, stock: 3, warrantyMonths: 6 },

    // Xiaomi
    { brandSlug: "xiaomi", model: "Redmi Note 13 Pro", storage: "256 Go", color: "Noir", condition: PhoneCondition.NEW, price: 175000, stock: 10, warrantyMonths: 12 },
    { brandSlug: "xiaomi", model: "Redmi Note 13", storage: "128 Go", color: "Bleu", condition: PhoneCondition.NEW, price: 125000, stock: 18, warrantyMonths: 12 },
    { brandSlug: "xiaomi", model: "Redmi 13C", storage: "128 Go", color: "Vert", condition: PhoneCondition.NEW, price: 75000, stock: 25, warrantyMonths: 12 },
    { brandSlug: "xiaomi", model: "Redmi Note 12", storage: "128 Go", color: "Gris", condition: PhoneCondition.REFURBISHED, price: 95000, stock: 8, warrantyMonths: 6 },
    { brandSlug: "xiaomi", model: "Poco X6 Pro", storage: "256 Go", color: "Noir", condition: PhoneCondition.NEW, price: 210000, stock: 5, warrantyMonths: 12 },

    // Tecno
    { brandSlug: "tecno", model: "Camon 20 Pro", storage: "256 Go", color: "Noir", condition: PhoneCondition.NEW, price: 145000, stock: 8, warrantyMonths: 12 },
    { brandSlug: "tecno", model: "Spark 20 Pro", storage: "256 Go", color: "Bleu", condition: PhoneCondition.NEW, price: 115000, stock: 15, warrantyMonths: 12 },
    { brandSlug: "tecno", model: "Spark 20", storage: "128 Go", color: "Noir", condition: PhoneCondition.NEW, price: 80000, stock: 22, warrantyMonths: 12 },
    { brandSlug: "tecno", model: "Pop 8", storage: "128 Go", color: "Or", condition: PhoneCondition.NEW, price: 55000, stock: 30, warrantyMonths: 12 },
    { brandSlug: "tecno", model: "Spark 10", storage: "128 Go", color: "Bleu", condition: PhoneCondition.REFURBISHED, price: 55000, stock: 6, warrantyMonths: 3 },

    // Infinix
    { brandSlug: "infinix", model: "Note 40 Pro", storage: "256 Go", color: "Noir", condition: PhoneCondition.NEW, price: 155000, stock: 7, warrantyMonths: 12 },
    { brandSlug: "infinix", model: "Hot 40i", storage: "128 Go", color: "Vert", condition: PhoneCondition.NEW, price: 70000, stock: 20, warrantyMonths: 12 },
    { brandSlug: "infinix", model: "Smart 8", storage: "128 Go", color: "Noir", condition: PhoneCondition.NEW, price: 50000, stock: 28, warrantyMonths: 12 },
    { brandSlug: "infinix", model: "Zero 30", storage: "256 Go", color: "Or", condition: PhoneCondition.NEW, price: 195000, stock: 4, warrantyMonths: 12 },
    { brandSlug: "infinix", model: "Hot 30", storage: "128 Go", color: "Bleu", condition: PhoneCondition.REFURBISHED, price: 50000, stock: 5, warrantyMonths: 3 },
  ];

  for (const p of phonesData) {
    await prisma.phone.create({
      data: {
        brandId: brands[p.brandSlug],
        model: p.model,
        storage: p.storage,
        color: p.color,
        condition: p.condition,
        price: p.price,
        stock: p.stock,
        warrantyMonths: p.warrantyMonths,
        description: `${p.model} ${p.storage} — ${p.color}. ${p.condition === PhoneCondition.NEW ? "Neuf, scellé, garantie officielle DAGNO ELECTRONIQUE." : "Reconditionné grade A, testé sur 30 points de contrôle."}`,
        images: [],
        isActive: true,
      },
    });
  }

  console.log(`✓ ${phonesData.length} téléphones créés`);

  // ============================================
  // CATEGORIES D'ACCESSOIRES
  // ============================================
  const categoriesData = [
    { name: "Coques & protections", slug: "coques-protections" },
    { name: "Chargeurs & câbles", slug: "chargeurs-cables" },
    { name: "Écouteurs & casques", slug: "ecouteurs-casques" },
    { name: "Protections d'écran", slug: "protections-ecran" },
    { name: "Power banks", slug: "power-banks" },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const created = await prisma.accessoryCategory.create({ data: c });
    categories[c.slug] = created.id;
  }

  console.log(`✓ ${categoriesData.length} catégories d'accessoires créées`);

  // ============================================
  // ACCESSOIRES (prix FCFA)
  // ============================================
  const accessoriesData = [
    // Coques & protections
    { cat: "coques-protections", name: "Coque silicone iPhone 15 Pro Max", price: 8000, stock: 20 },
    { cat: "coques-protections", name: "Coque silicone iPhone 13/14", price: 5000, stock: 30 },
    { cat: "coques-protections", name: "Coque transparente Samsung A15", price: 3500, stock: 40 },
    { cat: "coques-protections", name: "Coque renforcée Samsung S24 Ultra", price: 10000, stock: 15 },
    { cat: "coques-protections", name: "Coque antichoc Xiaomi Redmi Note 13", price: 4500, stock: 25 },
    { cat: "coques-protections", name: "Housse universelle 6.5 pouces", price: 2500, stock: 50 },
    { cat: "coques-protections", name: "Étui à rabat Tecno Spark 20", price: 5000, stock: 18 },

    // Chargeurs & câbles
    { cat: "chargeurs-cables", name: "Chargeur rapide 20W USB-C", price: 7500, stock: 35 },
    { cat: "chargeurs-cables", name: "Chargeur rapide 33W Xiaomi", price: 9000, stock: 20 },
    { cat: "chargeurs-cables", name: "Chargeur 45W Samsung Super Fast", price: 12000, stock: 15 },
    { cat: "chargeurs-cables", name: "Câble Lightning 1m certifié", price: 4000, stock: 40 },
    { cat: "chargeurs-cables", name: "Câble USB-C vers USB-C 1m", price: 3500, stock: 50 },
    { cat: "chargeurs-cables", name: "Câble micro-USB 1m", price: 2000, stock: 60 },
    { cat: "chargeurs-cables", name: "Chargeur voiture double USB 24W", price: 6000, stock: 22 },
    { cat: "chargeurs-cables", name: "Chargeur sans fil 15W", price: 15000, stock: 10 },

    // Écouteurs & casques
    { cat: "ecouteurs-casques", name: "Écouteurs filaires jack 3.5mm", price: 2500, stock: 45 },
    { cat: "ecouteurs-casques", name: "Écouteurs Bluetooth TWS", price: 12000, stock: 30 },
    { cat: "ecouteurs-casques", name: "AirPods Pro 2 (clone grade A)", price: 25000, stock: 12 },
    { cat: "ecouteurs-casques", name: "Casque Bluetooth JBL Tune 510BT", price: 35000, stock: 8 },
    { cat: "ecouteurs-casques", name: "Casque Bluetooth Sony WH-CH510", price: 45000, stock: 5 },
    { cat: "ecouteurs-casques", name: "Écouteurs sport Bluetooth oreillette", price: 8000, stock: 25 },

    // Protections d'écran
    { cat: "protections-ecran", name: "Verre trempé iPhone 15 Pro Max", price: 5000, stock: 30 },
    { cat: "protections-ecran", name: "Verre trempé iPhone 11/12/13", price: 3500, stock: 50 },
    { cat: "protections-ecran", name: "Verre trempé Samsung A15/A35", price: 3000, stock: 60 },
    { cat: "protections-ecran", name: "Verre trempé Samsung S24 Ultra", price: 6000, stock: 20 },
    { cat: "protections-ecran", name: "Verre trempé Xiaomi Redmi Note 13", price: 3000, stock: 35 },
    { cat: "protections-ecran", name: "Film hydrogel universel", price: 2500, stock: 80 },
    { cat: "protections-ecran", name: "Verre trempé Tecno Spark 20", price: 2500, stock: 40 },
    { cat: "protections-ecran", name: "Verre trempé Infinix Hot 40i", price: 2500, stock: 30 },

    // Power banks
    { cat: "power-banks", name: "Power bank 10000 mAh", price: 12000, stock: 20 },
    { cat: "power-banks", name: "Power bank 20000 mAh", price: 20000, stock: 15 },
    { cat: "power-banks", name: "Power bank 30000 mAh charge rapide", price: 30000, stock: 8 },
    { cat: "power-banks", name: "Power bank solaire 20000 mAh", price: 25000, stock: 6 },
    { cat: "power-banks", name: "Mini power bank 5000 mAh", price: 7000, stock: 25 },

    // Extra pour arriver à ~40
    { cat: "chargeurs-cables", name: "Adaptateur Lightning vers jack", price: 5000, stock: 18 },
    { cat: "chargeurs-cables", name: "Adaptateur USB-C vers jack", price: 4000, stock: 22 },
    { cat: "ecouteurs-casques", name: "Support téléphone voiture magnétique", price: 6000, stock: 20 },
    { cat: "coques-protections", name: "Pop socket décoratif", price: 1500, stock: 100 },
    { cat: "coques-protections", name: "Anneau de support téléphone", price: 2000, stock: 50 },
  ];

  for (const a of accessoriesData) {
    await prisma.accessory.create({
      data: {
        categoryId: categories[a.cat],
        name: a.name,
        description: `${a.name} — disponible en boutique DAGNO ELECTRONIQUE, Bamako.`,
        price: a.price,
        stock: a.stock,
        images: [],
        isActive: true,
      },
    });
  }

  console.log(`✓ ${accessoriesData.length} accessoires créés`);

  // ============================================
  // TYPES DE REPARATION (prix FCFA Bamako)
  // ============================================
  const repairTypesData = [
    { name: "Remplacement d'écran", slug: "remplacement-ecran", basePrice: 25000, estimatedDuration: "1h à 2h", description: "Écran cassé, tactile ne répond plus, affichage défaillant." },
    { name: "Remplacement de batterie", slug: "remplacement-batterie", basePrice: 12000, estimatedDuration: "45 min", description: "Batterie qui se décharge trop vite ou gonflée." },
    { name: "Réparation connecteur de charge", slug: "reparation-connecteur", basePrice: 8000, estimatedDuration: "1h", description: "Téléphone qui ne charge plus, câble qui bouge." },
    { name: "Désoxydation", slug: "desoxydation", basePrice: 10000, estimatedDuration: "24h", description: "Téléphone tombé dans l'eau, nettoyage complet en bain à ultrasons." },
    { name: "Remplacement caméra arrière", slug: "remplacement-camera-arriere", basePrice: 18000, estimatedDuration: "1h 30", description: "Caméra cassée, floue, vitre brisée." },
    { name: "Remplacement caméra avant", slug: "remplacement-camera-avant", basePrice: 12000, estimatedDuration: "1h", description: "Selfie flou, caméra avant ne fonctionne plus." },
    { name: "Remplacement haut-parleur", slug: "remplacement-haut-parleur", basePrice: 10000, estimatedDuration: "1h", description: "Son grésillant, aucun son en appel." },
    { name: "Remplacement micro", slug: "remplacement-micro", basePrice: 10000, estimatedDuration: "1h", description: "On ne vous entend pas au téléphone." },
    { name: "Réparation logicielle / flashage", slug: "reparation-logicielle", basePrice: 7500, estimatedDuration: "2h", description: "Téléphone bloqué, virus, écran de démarrage figé." },
    { name: "Déblocage réseau", slug: "deblocage-reseau", basePrice: 15000, estimatedDuration: "24h", description: "Déblocage opérateur, puce refusée." },
  ];

  for (const r of repairTypesData) {
    await prisma.repairType.create({
      data: {
        name: r.name,
        slug: r.slug,
        description: r.description,
        basePrice: r.basePrice,
        estimatedDuration: r.estimatedDuration,
        isActive: true,
      },
    });
  }

  console.log(`✓ ${repairTypesData.length} types de réparation créés`);

  console.log("✅ Seed terminé avec succès.");
  console.log("");
  console.log("Comptes de test :");
  console.log("  Admin  : admin@dagno.ml / Admin@2026");
  console.log("  Client : client@dagno.ml / Client@2026");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });