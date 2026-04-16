import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validations/reservation";

// POST /api/reservations — crée une réservation (utilisateur connecté)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const result = reservationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { destinationId, startDate, endDate, peopleCount } = result.data;

    // Vérifier que la destination existe
    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
      select: { basePrice: true },
    });

    if (!destination) {
      return NextResponse.json(
        { message: "Destination introuvable" },
        { status: 404 }
      );
    }

    // Calcul du prix total : basePrice × personnes × nuits
    const nuits = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = destination.basePrice * peopleCount * nuits;

    const reservation = await prisma.reservation.create({
      data: {
        userId: session.user.id,
        destinationId,
        startDate,
        endDate,
        peopleCount,
        totalPrice,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
