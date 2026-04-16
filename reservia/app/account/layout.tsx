import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { User, Calendar } from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mon compte</h1>
        <p className="text-gray-500 mt-1">Bonjour, {session.user.name}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar navigation */}
        <nav className="md:w-52 shrink-0">
          <ul className="space-y-1">
            <li>
              <Link
                href="/account"
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4 text-gray-400" />
                Mes informations
              </Link>
            </li>
            <li>
              <Link
                href="/account/reservations"
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                Mes réservations
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contenu */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
