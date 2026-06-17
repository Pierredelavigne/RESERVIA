import Link from "next/link";
import { Compass, Globe, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Marque */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
                <Compass className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white font-extrabold text-xl">Reservia</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-slate-500">
              Découvrez les plus belles destinations du monde et réservez votre prochain voyage en quelques clics.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Globe, Mail, Phone].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5">Explorer</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-white transition-colors">
                  Toutes les destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5">Mon espace</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link href="/account/reservations" className="hover:text-white transition-colors">
                  Mes réservations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Reservia. Projet scolaire.</p>
          <p>Fait avec ❤️ et Next.js</p>
        </div>
      </div>
    </footer>
  );
}
