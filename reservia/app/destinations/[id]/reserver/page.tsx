import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FormulaireReservation from "./FormulaireReservation";

export const metadata: Metadata = {
  title: "Réserver — Reservia",
};

export default async function ReserverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const destination = await prisma.destination.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      country: true,
      shortDescription: true,
      basePrice: true,
      imageUrl: true,
    },
  });

  if (!destination) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/destinations" className="hover:text-gray-900 transition-colors">
          Destinations
        </Link>
        <span>/</span>
        <Link href={`/destinations/${id}`} className="hover:text-gray-900 transition-colors">
          {destination.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Réserver</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Réserver votre séjour
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Récapitulatif destination */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-fit">
          <div className="relative h-44">
            <Image
              src={destination.imageUrl}
              alt={destination.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              {destination.country}
            </div>
            <h2 className="font-semibold text-gray-900 text-lg">{destination.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{destination.shortDescription}</p>
            <p className="mt-3 text-blue-600 font-bold">
              {destination.basePrice} €
              <span className="text-xs font-normal text-gray-400"> / nuit / personne</span>
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div>
          <FormulaireReservation
            destinationId={destination.id}
            nomDestination={destination.name}
            basePrice={destination.basePrice}
          />
        </div>
      </div>
    </div>
  );
}
