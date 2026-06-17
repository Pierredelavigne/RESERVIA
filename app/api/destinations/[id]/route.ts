import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { destinationUpdateSchema } from "@/lib/validations/destination";

// GET /api/destinations/[id] — public
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      return NextResponse.json(
        { message: "Destination introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch {
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/destinations/[id] — admin uniquement
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès interdit" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = destinationUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(destination);
  } catch (err: unknown) {
    // Destination introuvable (Prisma P2025)
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Destination introuvable" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/destinations/[id] — admin uniquement
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès interdit" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.destination.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Destination introuvable" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
