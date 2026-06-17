import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    reservation: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    destination: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ authOptions: {} }));

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { POST } from "@/app/api/reservations/route";
import { PATCH } from "@/app/api/reservations/[id]/route";

const mockPrisma = prisma as unknown as {
  reservation: Record<string, ReturnType<typeof vi.fn>>;
  destination: Record<string, ReturnType<typeof vi.fn>>;
};
const mockGetSession = getServerSession as ReturnType<typeof vi.fn>;

const sessionUser = { user: { id: "user-001", role: "USER" } };
const sessionAdmin = { user: { id: "admin-001", role: "ADMIN" } };

const demain = new Date();
demain.setDate(demain.getDate() + 1);
const dans5Jours = new Date();
dans5Jours.setDate(dans5Jours.getDate() + 5);

const payloadValide = {
  destinationId: "dest-001",
  startDate: demain.toISOString(),
  endDate: dans5Jours.toISOString(),
  peopleCount: 2,
};

function makeReq(method: string, body?: unknown, url = "http://localhost/api/reservations") {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

beforeEach(() => vi.clearAllMocks());

// ─── POST /api/reservations ───────────────────────────────────────────────────
describe("POST /api/reservations", () => {
  it("retourne 401 si non connecté", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await POST(makeReq("POST", payloadValide));
    expect(res.status).toBe(401);
  });

  it("retourne 404 si destination introuvable", async () => {
    mockGetSession.mockResolvedValue(sessionUser);
    mockPrisma.destination.findUnique.mockResolvedValue(null);

    const res = await POST(makeReq("POST", payloadValide));
    expect(res.status).toBe(404);
  });

  it("retourne 201 et calcule le prix correctement", async () => {
    mockGetSession.mockResolvedValue(sessionUser);
    mockPrisma.destination.findUnique.mockResolvedValue({ basePrice: 100 });

    // 4 nuits × 2 personnes × 100€ = 800€
    const nuits = Math.ceil(
      (dans5Jours.getTime() - demain.getTime()) / (1000 * 60 * 60 * 24)
    );
    const prixAttendu = 100 * 2 * nuits;

    mockPrisma.reservation.create.mockImplementation(({ data }: { data: { totalPrice: number } }) =>
      Promise.resolve({ id: "resa-001", ...data })
    );

    const res = await POST(makeReq("POST", payloadValide));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.totalPrice).toBe(prixAttendu);
  });

  it("retourne 400 si startDate manquante", async () => {
    mockGetSession.mockResolvedValue(sessionUser);

    const res = await POST(
      makeReq("POST", { ...payloadValide, startDate: undefined })
    );
    expect(res.status).toBe(400);
  });

  it("retourne 400 si peopleCount = 0", async () => {
    mockGetSession.mockResolvedValue(sessionUser);

    const res = await POST(makeReq("POST", { ...payloadValide, peopleCount: 0 }));
    expect(res.status).toBe(400);
  });
});

// ─── PATCH /api/reservations/[id] ─────────────────────────────────────────────
describe("PATCH /api/reservations/[id]", () => {
  it("retourne 401 si non connecté", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await PATCH(makeReq("PATCH"), {
      params: Promise.resolve({ id: "resa-001" }),
    });
    expect(res.status).toBe(401);
  });

  it("retourne 404 si réservation introuvable", async () => {
    mockGetSession.mockResolvedValue(sessionUser);
    mockPrisma.reservation.findUnique.mockResolvedValue(null);

    const res = await PATCH(makeReq("PATCH"), {
      params: Promise.resolve({ id: "inconnu" }),
    });
    expect(res.status).toBe(404);
  });

  it("retourne 403 si l'utilisateur n'est pas propriétaire", async () => {
    mockGetSession.mockResolvedValue(sessionUser);
    mockPrisma.reservation.findUnique.mockResolvedValue({
      userId: "autre-user",
      status: "CONFIRMED",
    });

    const res = await PATCH(makeReq("PATCH"), {
      params: Promise.resolve({ id: "resa-001" }),
    });
    expect(res.status).toBe(403);
  });

  it("retourne 409 si déjà annulée", async () => {
    mockGetSession.mockResolvedValue(sessionUser);
    mockPrisma.reservation.findUnique.mockResolvedValue({
      userId: "user-001",
      status: "CANCELLED",
    });

    const res = await PATCH(makeReq("PATCH"), {
      params: Promise.resolve({ id: "resa-001" }),
    });
    expect(res.status).toBe(409);
  });

  it("retourne 200 si propriétaire et réservation confirmée", async () => {
    mockGetSession.mockResolvedValue(sessionUser);
    mockPrisma.reservation.findUnique.mockResolvedValue({
      userId: "user-001",
      status: "CONFIRMED",
    });
    mockPrisma.reservation.update.mockResolvedValue({
      id: "resa-001",
      status: "CANCELLED",
    });

    const res = await PATCH(makeReq("PATCH"), {
      params: Promise.resolve({ id: "resa-001" }),
    });
    expect(res.status).toBe(200);
  });

  it("un admin peut annuler la réservation d'un autre utilisateur", async () => {
    mockGetSession.mockResolvedValue(sessionAdmin);
    mockPrisma.reservation.findUnique.mockResolvedValue({
      userId: "user-001",
      status: "CONFIRMED",
    });
    mockPrisma.reservation.update.mockResolvedValue({
      id: "resa-001",
      status: "CANCELLED",
    });

    const res = await PATCH(makeReq("PATCH"), {
      params: Promise.resolve({ id: "resa-001" }),
    });
    expect(res.status).toBe(200);
  });
});
