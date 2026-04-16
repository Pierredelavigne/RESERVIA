import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Marque */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              Reservia
            </div>
            <p className="text-sm leading-relaxed">
              Découvrez les plus belles destinations du monde et réservez votre prochain voyage en quelques clics.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Mon compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Mon espace</h3>
            <ul className="space-y-2 text-sm">
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

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          © {new Date().getFullYear()} Reservia. Projet scolaire — tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
