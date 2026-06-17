import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/reservations/[id] — annuler une réservation
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    if (!reservation) {
      return NextResponse.json(
        { message: "Réservation introuvable" },
        { status: 404 }
      );
    }

    // Un user ne peut annuler que ses propres réservations (l'admin peut tout)
    if (
      reservation.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ message: "Accès interdit" }, { status: 403 });
    }

    if (reservation.status === "CANCELLED") {
      return NextResponse.json(
        { message: "Cette réservation est déjà annulée" },
        { status: 409 }
      );
    }

    const mise_a_jour = await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(mise_a_jour);
  } catch {
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
