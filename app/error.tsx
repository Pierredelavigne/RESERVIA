"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <AlertTriangle className="w-12 h-12 text-red-300 mb-5" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Une erreur est survenue
      </h2>
      <p className="text-gray-400 mb-8 max-w-sm text-sm">
        Quelque chose s&apos;est mal passé. Réessayez ou revenez plus tard.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-blue-600 text-white font-semibold px-6 py-3 text-sm hover:bg-blue-500 transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
