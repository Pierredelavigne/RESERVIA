import Link from "next/link";
import { MapPin, Calendar, Users, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [destinations, reservations, users] = await Promise.all([
    prisma.destination.count(),
    prisma.reservation.count(),
    prisma.user.count(),
  ]);

  const chiffreAffaires = await prisma.reservation.aggregate({
    _sum: { totalPrice: true },
    where: { status: "CONFIRMED" },
  });

  const stats = [
    {
      label: "Destinations",
      valeur: destinations,
      icone: MapPin,
      couleur: "text-blue-600",
      fond: "bg-blue-50",
      lien: "/admin/destinations",
    },
    {
      label: "Réservations",
      valeur: reservations,
      icone: Calendar,
      couleur: "text-green-600",
      fond: "bg-green-50",
      lien: "/admin/reservations",
    },
    {
      label: "Utilisateurs",
      valeur: users,
      icone: Users,
      couleur: "text-purple-600",
      fond: "bg-purple-50",
      lien: null,
    },
    {
      label: "Chiffre d'affaires",
      valeur: `${chiffreAffaires._sum.totalPrice ?? 0} €`,
      icone: TrendingUp,
      couleur: "text-orange-600",
      fond: "bg-orange-50",
      lien: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
          >
            <div className={`inline-flex p-2 rounded-lg ${s.fond} mb-3`}>
              <s.icone className={`w-5 h-5 ${s.couleur}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.valeur}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/destinations/nouvelle"
          className="rounded-xl bg-blue-600 text-white font-semibold px-5 py-2.5 text-sm hover:bg-blue-500 transition-colors"
        >
          + Nouvelle destination
        </Link>
        <Link
          href="/admin/reservations"
          className="rounded-xl border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 text-sm hover:bg-gray-50 transition-colors"
        >
          Voir les réservations
        </Link>
      </div>
    </div>
  );
}
