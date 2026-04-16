import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DestinationCard from "@/components/ui/DestinationCard";

// ISR : regénération toutes les heures — contenu semi-statique, SEO critique
export const revalidate = 3600;

async function getDestinationsPopulaires() {
  return prisma.destination.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      country: true,
      shortDescription: true,
      basePrice: true,
      imageUrl: true,
    },
  });
}

export default async function HomePage() {
  const destinations = await getDestinationsPopulaires();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Votre prochain voyage commence ici
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Explorez des centaines de destinations uniques et réservez votre
            séjour de rêve en quelques clics.
          </p>

          {/* Barre de recherche */}
          <form
            action="/destinations"
            method="GET"
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Destination, pays…"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-white text-blue-700 font-semibold px-6 py-3 text-sm hover:bg-blue-50 transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* Destinations populaires */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Destinations populaires
            </h2>
            <p className="text-gray-500 mt-1">Nos coups de cœur du moment</p>
          </div>
          <Link
            href="/destinations"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        {destinations.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            Aucune destination disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} {...dest} />
            ))}
          </div>
        )}
      </section>

      {/* Call to action */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Prêt à partir ?
          </h2>
          <p className="text-gray-500 mb-8">
            Créez un compte gratuitement et commencez à réserver dès
            aujourd&apos;hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 text-white font-semibold px-8 py-3 text-sm hover:bg-blue-500 transition-colors"
            >
              Créer un compte
            </Link>
            <Link
              href="/destinations"
              className="rounded-xl border border-gray-300 text-gray-700 font-semibold px-8 py-3 text-sm hover:bg-gray-100 transition-colors"
            >
              Explorer les destinations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
