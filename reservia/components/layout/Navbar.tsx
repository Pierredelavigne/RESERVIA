"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOuvert, setMenuOuvert] = useState(false);

  const lienActif = (href: string) =>
    pathname === href ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <MapPin className="w-6 h-6" />
            Reservia
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/destinations" className={`text-sm transition-colors ${lienActif("/destinations")}`}>
              Destinations
            </Link>

            {session ? (
              <>
                <Link href="/account" className={`text-sm transition-colors ${lienActif("/account")}`}>
                  Mon compte
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className={`text-sm transition-colors ${lienActif("/admin")}`}>
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="text-sm rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 transition-colors"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label="Menu"
          >
            {menuOuvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOuvert && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <Link
              href="/destinations"
              className="block text-sm text-gray-600 hover:text-gray-900 py-1"
              onClick={() => setMenuOuvert(false)}
            >
              Destinations
            </Link>
            {session ? (
              <>
                <Link
                  href="/account"
                  className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                  onClick={() => setMenuOuvert(false)}
                >
                  Mon compte
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                    onClick={() => setMenuOuvert(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                  onClick={() => setMenuOuvert(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="block text-sm text-blue-600 font-medium py-1"
                  onClick={() => setMenuOuvert(false)}
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
