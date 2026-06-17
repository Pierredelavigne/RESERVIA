import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BoutonAnnulation from "./BoutonAnnulation";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

interface PageProps {
  searchParams: Promise<{ confirmation?: string }>;
}

export default async function ReservationsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  const reservations = await prisma.reservation.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      destination: {
        select: {
          id: true,
          name: true,
          country: true,
          imageUrl: true,
        },
      },
    },
  });

  return (
    <div className="space-y-5">
      {/* Bandeau de confirmation après réservation */}
      {params.confirmation === "1" && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Votre réservation a bien été confirmée !</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Mes réservations{" "}
          <span className="text-sm font-normal text-gray-400">
            ({reservations.length})
          </span>
        </h2>
        <Link
          href="/destinations"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          Nouvelle réservation →
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune réservation pour le moment</p>
          <Link
            href="/destinations"
            className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Explorer les destinations →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => {
            const annulee = r.status === "CANCELLED";
            const nuits = Math.ceil(
              (r.endDate.getTime() - r.startDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <li
                key={r.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row ${
                  annulee ? "border-gray-200 opacity-60" : "border-gray-200"
                }`}
              >
                {/* Image destination */}
                <div className="relative w-full sm:w-40 h-36 sm:h-auto shrink-0">
                  <Image
                    src={r.destination.imageUrl}
                    alt={r.destination.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>

                {/* Détails */}
                <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/destinations/${r.destination.id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {r.destination.name}
                      </Link>
                      <span
                        className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          annulee
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {annulee ? "Annulée" : "Confirmée"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {r.destination.country}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {formatDate(r.startDate)} → {formatDate(r.endDate)}
                      </span>
                      <span className="text-gray-400">({nuits} nuit{nuits > 1 ? "s" : ""})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {r.peopleCount} personne{r.peopleCount > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">{r.totalPrice} €</span>
                    {!annulee && <BoutonAnnulation id={r.id} />}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
