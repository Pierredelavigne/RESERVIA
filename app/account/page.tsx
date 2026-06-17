import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Mail, Shield, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { reservations: true } },
    },
  });

  if (!user) return null;

  const dateInscription = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Informations personnelles
        </h2>

        <dl className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wide">Nom</dt>
              <dd className="text-sm font-medium text-gray-900 mt-0.5">{user.name}</dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wide">Email</dt>
              <dd className="text-sm font-medium text-gray-900 mt-0.5">{user.email}</dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wide">Rôle</dt>
              <dd className="mt-0.5">
                <span
                  className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
                </span>
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wide">Membre depuis</dt>
              <dd className="text-sm font-medium text-gray-900 mt-0.5">{dateInscription}</dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Stats rapides */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <p className="text-sm text-gray-600">
          Vous avez effectué{" "}
          <span className="font-bold text-blue-600">
            {user._count.reservations} réservation{user._count.reservations > 1 ? "s" : ""}
          </span>{" "}
          sur Reservia.
        </p>
      </div>
    </div>
  );
}
