"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function BoutonAnnulation({ id }: { id: string }) {
  const router = useRouter();
  const [confirmer, setConfirmer] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function annuler() {
    setChargement(true);

    await fetch(`/api/reservations/${id}`, { method: "PATCH" });

    router.refresh();
  }

  if (confirmer) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Confirmer l&apos;annulation ?</span>
        <button
          onClick={annuler}
          disabled={chargement}
          className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {chargement ? "…" : "Oui"}
        </button>
        <button
          onClick={() => setConfirmer(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Non
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmer(true)}
      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
    >
      <X className="w-3.5 h-3.5" />
      Annuler
    </button>
  );
}
