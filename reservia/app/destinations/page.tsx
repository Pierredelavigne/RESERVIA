import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import DestinationCard from "@/components/ui/DestinationCard";
import FiltresDestinations from "./FiltresDestinations";
import Pagination from "./Pagination";

export const metadata: Metadata = {
  title: "Destinations — Reservia",
  description: "Explorez toutes nos destinations et trouvez votre prochain voyage.",
};

const LIMITE = 9;

// Liste des pays pour les filtres — cache 60s (ISR)
const getPays = unstable_cache(
  async () => {
    const resultats = await prisma.destination.findMany({
      select: { country: true },
      distinct: ["country"],
      orderBy: { country: "asc" },
    });
    return resultats.map((r) => r.country);
  },
  ["pays-destinations"],
  { revalidate: 60, tags: ["destinations"] }
);

// Fetch destinations avec filtres — cache 60s par combinaison de paramètres
const getDestinations = unstable_cache(
  async (
    search: string,
    country: string,
    minPrice: number,
    maxPrice: number,
    page: number
  ) => {
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
        skip: (page - 1) * LIMITE,
        take: LIMITE,
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

    return { destinations, total, pages: Math.ceil(total / LIMITE) };
  },
  ["liste-destinations"],
  { revalidate: 60, tags: ["destinations"] }
);

interface PageProps {
  searchParams: Promise<{
    search?: string;
    country?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function DestinationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const country = params.country ?? "";
  const minPrice = parseFloat(params.minPrice ?? "0") || 0;
  const maxPrice = parseFloat(params.maxPrice ?? "0") || 0;
  const page = Math.max(1, parseInt(params.page ?? "1"));

  const [{ destinations, total, pages }, pays] = await Promise.all([
    getDestinations(search, country, minPrice, maxPrice, page),
    getPays(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
        <p className="text-gray-500 mt-1">
          {total} destination{total > 1 ? "s" : ""} disponible{total > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Panneau filtres */}
        <aside className="lg:w-64 shrink-0">
          <Suspense>
            <FiltresDestinations pays={pays} />
          </Suspense>
        </aside>

        {/* Grille résultats */}
        <div className="flex-1">
          {destinations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-gray-400 text-lg">Aucune destination ne correspond à vos critères.</p>
              <p className="text-gray-400 text-sm mt-2">Essayez d&apos;élargir votre recherche.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {destinations.map((dest) => (
                  <DestinationCard key={dest.id} {...dest} />
                ))}
              </div>
              <Suspense>
                <Pagination page={page} pages={pages} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
