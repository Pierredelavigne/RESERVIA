import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// — Mocks —
vi.mock("@/lib/prisma", () => ({
  prisma: {
    destination: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ authOptions: {} }));

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { GET, POST } from "@/app/api/destinations/route";
import {
  GET as GET_ONE,
  PUT,
  DELETE,
} from "@/app/api/destinations/[id]/route";

const mockPrisma = prisma as unknown as {
  destination: Record<string, ReturnType<typeof vi.fn>>;
};
const mockGetSession = getServerSession as ReturnType<typeof vi.fn>;

// Destination de test
const destFixture = {
  id: "dest-001",
  name: "Santorini",
  country: "Grèce",
  shortDescription: "Villages blancs au-dessus de la mer Égée",
  description: "Une île volcanique magnifique avec des couchers de soleil exceptionnels.",
  basePrice: 180,
  imageUrl: "https://images.unsplash.com/photo-123",
  gallery: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeReq(method: string, body?: unknown, url = "http://localhost/api/destinations") {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

beforeEach(() => vi.clearAllMocks());

// ─── GET /api/destinations ────────────────────────────────────────────────────
describe("GET /api/destinations", () => {
  it("retourne 200 avec la liste paginée", async () => {
    mockPrisma.destination.findMany.mockResolvedValue([destFixture]);
    mockPrisma.destination.count.mockResolvedValue(1);

    const res = await GET(makeReq("GET"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.destinations).toHaveLength(1);
    expect(json.total).toBe(1);
    expect(json.pages).toBe(1);
  });

  it("retourne 200 avec une liste vide si aucune destination", async () => {
    mockPrisma.destination.findMany.mockResolvedValue([]);
    mockPrisma.destination.count.mockResolvedValue(0);

    const res = await GET(makeReq("GET"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.destinations).toHaveLength(0);
    expect(json.total).toBe(0);
  });
});

// ─── POST /api/destinations ───────────────────────────────────────────────────
describe("POST /api/destinations", () => {
  const payload = {
    name: "Kyoto",
    country: "Japon",
    shortDescription: "L'ancienne capitale impériale aux mille temples",
    description: "Kyoto est le cœur culturel du Japon avec ses nombreux temples et jardins zen.",
    basePrice: 220,
    imageUrl: "https://images.unsplash.com/photo-456",
    gallery: [],
  };

  it("retourne 403 si non admin", async () => {
    mockGetSession.mockResolvedValue({ user: { role: "USER" } });

    const res = await POST(makeReq("POST", payload));
    expect(res.status).toBe(403);
  });

  it("retourne 403 si non connecté", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await POST(makeReq("POST", payload));
    expect(res.status).toBe(403);
  });

  it("retourne 201 si admin avec payload valide", async () => {
    mockGetSession.mockResolvedValue({ user: { role: "ADMIN" } });
    mockPrisma.destination.create.mockResolvedValue({ ...destFixture, ...payload });

    const res = await POST(makeReq("POST", payload));
    expect(res.status).toBe(201);
  });

  it("retourne 400 si payload invalide (prix manquant)", async () => {
    mockGetSession.mockResolvedValue({ user: { role: "ADMIN" } });

    const res = await POST(makeReq("POST", { ...payload, basePrice: undefined }));
    expect(res.status).toBe(400);
  });
});

// ─── GET /api/destinations/[id] ───────────────────────────────────────────────
describe("GET /api/destinations/[id]", () => {
  it("retourne 200 avec la destination trouvée", async () => {
    mockPrisma.destination.findUnique.mockResolvedValue(destFixture);

    const res = await GET_ONE(makeReq("GET"), {
      params: Promise.resolve({ id: "dest-001" }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.name).toBe("Santorini");
  });

  it("retourne 404 si destination introuvable", async () => {
    mockPrisma.destination.findUnique.mockResolvedValue(null);

    const res = await GET_ONE(makeReq("GET"), {
      params: Promise.resolve({ id: "inconnu" }),
    });
    expect(res.status).toBe(404);
  });
});

// ─── PUT /api/destinations/[id] ───────────────────────────────────────────────
describe("PUT /api/destinations/[id]", () => {
  it("retourne 403 si non admin", async () => {
    mockGetSession.mockResolvedValue({ user: { role: "USER" } });

    const res = await PUT(makeReq("PUT", { basePrice: 200 }), {
      params: Promise.resolve({ id: "dest-001" }),
    });
    expect(res.status).toBe(403);
  });

  it("retourne 200 si admin avec payload valide", async () => {
    mockGetSession.mockResolvedValue({ user: { role: "ADMIN" } });
    mockPrisma.destination.update.mockResolvedValue({ ...destFixture, basePrice: 200 });

    const res = await PUT(makeReq("PUT", { basePrice: 200 }), {
      params: Promise.resolve({ id: "dest-001" }),
    });
    expect(res.status).toBe(200);
  });
});

// ─── DELETE /api/destinations/[id] ────────────────────────────────────────────
describe("DELETE /api/destinations/[id]", () => {
  it("retourne 403 si non admin", async () => {
    mockGetSession.mockResolvedValue({ user: { role: "USER" } });

    const res = await DELETE(makeReq("DELETE"), {
      params: Promise.resolve({ id: "dest-001" }),
    });
    expect(res.status).toBe(403);
  });

  it("retourne 204 si admin", async () => {
    mockGetSession.mockResolvedValue({ user: { role: "ADMIN" } });
    mockPrisma.destination.delete.mockResolvedValue(destFixture);

    const res = await DELETE(makeReq("DELETE"), {
      params: Promise.resolve({ id: "dest-001" }),
    });
    expect(res.status).toBe(204);
  });
});
