import Link from "next/link";
import { Search, MapPin, Star, Shield, Headphones } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DestinationCard from "@/components/ui/DestinationCard";

export const revalidate = 3600;

async function getDestinationsPopulaires() {
  return prisma.destination.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      country: true,
      shortDescription: true,
      basePrice: true,
      imageUrl: true,
    },
  });
}

export default async function HomePage() {
  const destinations = await getDestinationsPopulaires();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-sky-200 mb-6">
            <MapPin className="w-3.5 h-3.5" />
            8 destinations dans le monde entier
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            Votre prochain voyage
            <span className="block bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              commence ici
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Explorez des destinations d&apos;exception et réservez votre séjour de rêve en quelques clics.
          </p>

          {/* Barre de recherche */}
          <form
            action="/destinations"
            method="GET"
            className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder="Destination, pays, activité…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold px-6 py-2.5 text-sm hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-sky-500/30 whitespace-nowrap"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* ── Indicateurs de confiance ─────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Star, label: "Destinations sélectionnées", value: "8 destinations", color: "text-amber-500" },
            { icon: Shield, label: "Réservation sécurisée", value: "100 % sécurisé", color: "text-emerald-500" },
            { icon: Headphones, label: "Support disponible", value: "7j/7 disponible", color: "text-sky-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-900 text-sm">{value}</p>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Destinations populaires ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sky-600 font-semibold text-sm tracking-wide uppercase mb-1">
              À la une
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Destinations populaires
            </h2>
            <p className="text-slate-500 mt-1.5">Nos coups de cœur du moment</p>
          </div>
          <Link
            href="/destinations"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        {destinations.length === 0 ? (
          <p className="text-center text-slate-400 py-20">
            Aucune destination disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} {...dest} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/destinations"
            className="inline-flex text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            Voir toutes les destinations →
          </Link>
        </div>
      </section>

      {/* ── Call to action ────────────────────────────────────────────── */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-16">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white px-8 py-16 text-center relative overflow-hidden">
          {/* Déco */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Prêt à partir ?
            </h2>
            <p className="text-sky-100 text-lg mb-8 max-w-md mx-auto">
              Créez un compte gratuitement et commencez à réserver dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="rounded-xl bg-white text-sky-600 font-bold px-8 py-3.5 text-sm hover:bg-sky-50 transition-colors shadow-lg"
              >
                Créer un compte
              </Link>
              <Link
                href="/destinations"
                className="rounded-xl border-2 border-white/40 text-white font-semibold px-8 py-3.5 text-sm hover:bg-white/10 transition-colors"
              >
                Explorer les destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
