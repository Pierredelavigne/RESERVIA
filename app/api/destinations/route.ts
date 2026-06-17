import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { destinationSchema } from "@/lib/validations/destination";

// GET /api/destinations — public, supporte ?search=&country=&minPrice=&maxPrice=&page=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const country = searchParams.get("country") ?? "";
    const rawMin = parseFloat(searchParams.get("minPrice") ?? "0");
    const rawMax = parseFloat(searchParams.get("maxPrice") ?? "0");
    const minPrice = Number.isFinite(rawMin) && rawMin > 0 ? rawMin : 0;
    const maxPrice = Number.isFinite(rawMax) && rawMax > 0 ? rawMax : 0;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = 9;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { country: { contains: search, mode: "insensitive" as const } },
          { shortDescription: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(country && { country: { equals: country, mode: "insensitive" as const } }),
      ...(minPrice > 0 && { basePrice: { gte: minPrice } }),
      ...(maxPrice > 0 && { basePrice: { lte: maxPrice } }),
    };

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          country: true,
          shortDescription: true,
          basePrice: true,
          imageUrl: true,
        },
      }),
      prisma.destination.count({ where }),
    ]);

    return NextResponse.json({
      destinations,
      total,
      pages: Math.ceil(total / limit),
      page,
    });
  } catch {
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST /api/destinations — admin uniquement
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès interdit" }, { status: 403 });
    }

    const body = await req.json();
    const result = destinationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.create({
      data: result.data,
    });

    return NextResponse.json(destination, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
