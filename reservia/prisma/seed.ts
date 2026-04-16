import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const destinations = [
  {
    name: "Santorini",
    country: "Grèce",
    shortDescription: "Villages blancs suspendus au-dessus de la mer Égée",
    description:
      "Santorini est une île volcanique des Cyclades, connue pour ses maisons blanches aux toits bleus, ses couchers de soleil exceptionnels depuis Oia et ses plages de sable noir. Un cadre romantique et pittoresque par excellence.",
    basePrice: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800",
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
    ],
  },
  {
    name: "Kyoto",
    country: "Japon",
    shortDescription: "L'ancienne capitale impériale aux mille temples",
    description:
      "Kyoto est le cœur culturel du Japon, avec ses 1 600 temples bouddhistes, ses jardins zen, ses geishas dans le quartier de Gion et ses forêts de bambous à Arashiyama. La ville offre un voyage hors du temps.",
    basePrice: 220,
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      "https://images.unsplash.com/photo-1506355683963-d5a2f6f72f1c?w=800",
    ],
  },
  {
    name: "Marrakech",
    country: "Maroc",
    shortDescription: "La ville ocre aux souks envoûtants",
    description:
      "Marrakech vous plonge dans un univers de couleurs, de saveurs et de sons. La place Jemaa el-Fna, les souks labyrinthiques, les riads ornés de zellige et les jardins de la Majorelle en font une destination inoubliable.",
    basePrice: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1548018560-c7196aca8d48?w=800",
      "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800",
      "https://images.unsplash.com/photo-1580746738099-b2c8a6526f55?w=800",
    ],
  },
  {
    name: "Patagonie",
    country: "Argentine",
    shortDescription: "Le bout du monde entre glaciers et steppes infinies",
    description:
      "La Patagonie argentine est un territoire sauvage et grandiose : les pics acérés du Fitz Roy, les glaciers de Los Glaciares, les pingouins de Puerto Madryn et les pampas balayées par le vent offrent des paysages à couper le souffle.",
    basePrice: 260,
    imageUrl:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
  },
  {
    name: "Bali",
    country: "Indonésie",
    shortDescription: "L'île des dieux entre rizières et temples sacrés",
    description:
      "Bali conjugue spiritualité, nature luxuriante et art de vivre balinais. Des rizières en terrasses d'Ubud aux temples de Tanah Lot, en passant par les plages de Seminyak et les falaises de Uluwatu, chaque coin est une carte postale.",
    basePrice: 130,
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
    ],
  },
  {
    name: "Islande",
    country: "Islande",
    shortDescription: "Aurores boréales, geysers et paysages lunaires",
    description:
      "L'Islande est une terre de contrastes spectaculaires : geysers, cascades de Skógafoss, champs de lave, baleines au large d'Husavik et aurores boréales en hiver. La Ring Road longe des panoramas d'une beauté saisissante.",
    basePrice: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800",
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800",
      "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800",
    ],
  },
  {
    name: "Amalfi",
    country: "Italie",
    shortDescription: "Falaises dorées et villages accrochés à la mer Tyrrhénienne",
    description:
      "La côte amalfitaine est classée au patrimoine mondial de l'UNESCO. Entre Positano, Ravello et Amalfi, les routes sinueuses dévoilent des panoramas sur la Méditerranée, des jardins en terrasses et une gastronomie incomparable.",
    basePrice: 160,
    imageUrl:
      "https://images.unsplash.com/photo-1534445538923-ab38f09f9501?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
      "https://images.unsplash.com/photo-1570213490059-a83a2a75a4e4?w=800",
    ],
  },
  {
    name: "Petra",
    country: "Jordanie",
    shortDescription: "La cité rose sculptée dans la roche",
    description:
      "Petra, la capitale nabatéenne taillée dans le grès rose, est l'une des merveilles du monde. Le Siq, le Trésor (Al-Khazneh), les monastères et les tombeaux royaux composent un site archéologique d'une ampleur et d'une beauté uniques.",
    basePrice: 110,
    imageUrl:
      "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?w=800",
      "https://images.unsplash.com/photo-1548011241-46c4fab2d5c2?w=800",
      "https://images.unsplash.com/photo-1565127771579-d0b2e6e1cde2?w=800",
    ],
  },
];

async function main() {
  console.log("Nettoyage de la base...");
  await prisma.reservation.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log("Création des destinations...");
  for (const dest of destinations) {
    await prisma.destination.create({ data: dest });
  }

  console.log("Création des utilisateurs...");
  const hashedPassword = await bcrypt.hash("password123", 12);

  await prisma.user.create({
    data: {
      name: "Admin Reservia",
      email: "admin@reservia.fr",
      password: await bcrypt.hash("admin1234", 12),
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Marie Dupont",
      email: "marie@example.fr",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Seed terminé — 8 destinations, 1 admin, 1 utilisateur.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
