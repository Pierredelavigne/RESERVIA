"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorDestinations({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <AlertTriangle className="w-10 h-10 text-red-300 mx-auto mb-4" />
      <p className="font-semibold text-gray-800 mb-2">Impossible de charger les destinations</p>
      <p className="text-sm text-gray-400 mb-6">Vérifiez votre connexion ou réessayez.</p>
      <button
        onClick={reset}
        className="rounded-xl bg-blue-600 text-white font-semibold px-6 py-2.5 text-sm hover:bg-blue-500 transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
