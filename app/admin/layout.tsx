import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { LayoutDashboard, MapPin, Calendar } from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-500 mt-1 text-sm">Connecté en tant que {session.user.email}</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
          Admin
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <nav className="md:w-52 shrink-0">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link
                href="/admin/destinations"
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                Destinations
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reservations"
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                Réservations
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
