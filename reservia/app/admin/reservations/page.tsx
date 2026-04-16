import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, User } from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      destination: { select: { name: true, country: true } },
    },
  });

  const confirmedCount = reservations.filter((r) => r.status === "CONFIRMED").length;
  const totalRevenu = reservations
    .filter((r) => r.status === "CONFIRMED")
    .reduce((acc, r) => acc + r.totalPrice, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Réservations{" "}
          <span className="text-sm font-normal text-gray-400">
            ({reservations.length} au total — {confirmedCount} confirmées)
          </span>
        </h2>
        <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
          {totalRevenu} € confirmés
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Destination</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Dates</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Personnes</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Total</th>
              <th className="text-center px-4 py-3 font-medium text-gray-500">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{r.user.name}</p>
                      <p className="text-xs text-gray-400">{r.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <div>
                      <p>{r.destination.name}</p>
                      <p className="text-xs text-gray-400">{r.destination.country}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-gray-600 hidden md:table-cell">
                  {r.peopleCount}
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">
                  {r.totalPrice} €
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.status === "CONFIRMED" ? "Confirmée" : "Annulée"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
