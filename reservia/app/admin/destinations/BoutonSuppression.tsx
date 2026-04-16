"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function BoutonSuppression({ id, nom }: { id: string; nom: string }) {
  const router = useRouter();
  const [confirmer, setConfirmer] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function supprimer() {
    setChargement(true);
    await fetch(`/api/destinations/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirmer) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Supprimer &quot;{nom}&quot; ?</span>
        <button
          onClick={supprimer}
          disabled={chargement}
          className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {chargement ? "…" : "Confirmer"}
        </button>
        <button
          onClick={() => setConfirmer(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmer(true)}
      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Supprimer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
