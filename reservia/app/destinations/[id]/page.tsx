import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, Users, Calendar } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import GaleriePhotos from "./GaleriePhotos";

// ISR : regénération toutes les heures
export const revalidate = 3600;

// Pré-génère les pages pour toutes les destinations existantes au build
export async function generateStaticParams() {
  const destinations = await prisma.destination.findMany({
    select: { id: true },
  });
  return destinations.map((d) => ({ id: d.id }));
}

async function getDestination(id: string) {
  return prisma.destination.findUnique({ where: { id } });
}

// Métadonnées dynamiques pour le SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const destination = await getDestination(id);
  if (!destination) return { title: "Destination introuvable" };

  return {
    title: `${destination.name} — Reservia`,
    description: destination.shortDescription,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) notFound();

  const gallery = Array.isArray(destination.gallery)
    ? (destination.gallery as string[])
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/destinations" className="hover:text-gray-900 transition-colors">
          Destinations
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{destination.name}</span>
      </nav>

      {/* Titre */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{destination.name}</h1>
          <div className="flex items-center gap-1.5 mt-2 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{destination.country}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">À partir de</p>
          <p className="text-3xl font-bold text-blue-600">
            {destination.basePrice} €
            <span className="text-sm font-normal text-gray-400"> / nuit</span>
          </p>
        </div>
      </div>

      {/* Galerie */}
      <GaleriePhotos
        imageUrl={destination.imageUrl}
        gallery={gallery}
        nom={destination.name}
      />

      {/* Contenu principal */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              À propos de cette destination
            </h2>
            <p className="text-gray-600 leading-relaxed">{destination.description}</p>
          </div>

          {/* Points forts */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Points forts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Star className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-gray-700">Destination de prestige</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Users className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-gray-700">Groupes & familles</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm text-gray-700">Disponible toute l&apos;année</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc réservation */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-lg font-semibold text-gray-900 mb-1">
              {destination.basePrice} €
              <span className="text-sm font-normal text-gray-400"> / nuit / personne</span>
            </p>
            <p className="text-sm text-gray-500 mb-5">{destination.shortDescription}</p>

            <Link
              href={`/destinations/${destination.id}/reserver`}
              className="block w-full text-center rounded-xl bg-blue-600 text-white font-semibold px-4 py-3 hover:bg-blue-500 transition-colors"
            >
              Réserver maintenant
            </Link>

            <p className="mt-3 text-xs text-center text-gray-400">
              Aucun frais avant la confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
