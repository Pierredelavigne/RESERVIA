"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, User, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOuvert, setMenuOuvert] = useState(false);

  const estActif = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-sm">
              <Compass className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-slate-900">Reservia</span>
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/destinations"
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                estActif("/destinations")
                  ? "bg-sky-50 text-sky-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Destinations
            </Link>

            {session ? (
              <div className="flex items-center gap-1 ml-2">
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                      estActif("/admin")
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                    pathname.startsWith("/account")
                      ? "bg-sky-50 text-sky-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <User className="w-4 h-4" />
                  {session.user.name?.split(" ")[0] ?? "Mon compte"}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm px-4 py-2 rounded-lg font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href="/login"
                  className="text-sm px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="text-sm rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2.5 text-white font-semibold hover:from-sky-600 hover:to-cyan-600 transition-all shadow-sm hover:shadow-md"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label="Menu"
          >
            {menuOuvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOuvert && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-1">
            <Link
              href="/destinations"
              className="block text-sm font-medium text-slate-700 px-3 py-2.5 rounded-lg hover:bg-slate-50"
              onClick={() => setMenuOuvert(false)}
            >
              Destinations
            </Link>
            {session ? (
              <>
                <Link
                  href="/account"
                  className="block text-sm font-medium text-slate-700 px-3 py-2.5 rounded-lg hover:bg-slate-50"
                  onClick={() => setMenuOuvert(false)}
                >
                  Mon compte
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block text-sm font-medium text-slate-700 px-3 py-2.5 rounded-lg hover:bg-slate-50"
                    onClick={() => setMenuOuvert(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left text-sm font-medium text-slate-500 px-3 py-2.5 rounded-lg hover:bg-slate-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-sm font-medium text-slate-700 px-3 py-2.5 rounded-lg hover:bg-slate-50"
                  onClick={() => setMenuOuvert(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="block text-sm font-semibold text-sky-600 px-3 py-2.5 rounded-lg hover:bg-sky-50"
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
