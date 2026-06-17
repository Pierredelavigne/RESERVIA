"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function BoutonSuppression({ id, nom }: { id: string; nom: string }) {
  const router = useRouter();
  const [confirmer, setConfirmer] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function supprimer() {
    setChargement(true);
    setErreur(null);
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErreur(data.message ?? "Erreur lors de la suppression");
        return;
      }
      router.refresh();
    } catch {
      setErreur("Erreur réseau, veuillez réessayer");
    } finally {
      setChargement(false);
    }
  }

  if (confirmer) {
    return (
      <div className="flex flex-col gap-1">
        {erreur && <p className="text-xs text-red-600">{erreur}</p>}
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
