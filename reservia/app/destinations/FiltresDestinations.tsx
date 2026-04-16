"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface FiltresDestinationsProps {
  pays: string[];
}

export default function FiltresDestinations({ pays }: FiltresDestinationsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const creerUrl = useCallback(
    (nom: string, valeur: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (valeur) {
        params.set(nom, valeur);
      } else {
        params.delete(nom);
      }
      // Réinitialiser la page à 1 si on change un filtre
      if (nom !== "page") params.set("page", "1");
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const handleChange = (nom: string, valeur: string) => {
    router.push(creerUrl(nom, valeur), { scroll: false });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center gap-2 text-gray-700 font-semibold">
        <SlidersHorizontal className="w-4 h-4" />
        Filtres
      </div>

      {/* Recherche texte */}
      <div>
        <label htmlFor="search" className="block text-xs font-medium text-gray-500 mb-1.5">
          Recherche
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="search"
            type="text"
            defaultValue={searchParams.get("search") ?? ""}
            placeholder="Destination, pays…"
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filtre pays */}
      <div>
        <label htmlFor="country" className="block text-xs font-medium text-gray-500 mb-1.5">
          Pays
        </label>
        <select
          id="country"
          value={searchParams.get("country") ?? ""}
          onChange={(e) => handleChange("country", e.target.value)}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les pays</option>
          {pays.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre prix */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="minPrice" className="block text-xs font-medium text-gray-500 mb-1.5">
            Prix min (€)
          </label>
          <input
            id="minPrice"
            type="number"
            min={0}
            defaultValue={searchParams.get("minPrice") ?? ""}
            placeholder="0"
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-xs font-medium text-gray-500 mb-1.5">
            Prix max (€)
          </label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            defaultValue={searchParams.get("maxPrice") ?? ""}
            placeholder="∞"
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Réinitialiser */}
      {(searchParams.get("search") || searchParams.get("country") || searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
        <button
          onClick={() => router.push(pathname)}
          className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
