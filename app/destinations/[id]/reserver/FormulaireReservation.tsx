"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Calendar, Users, CreditCard } from "lucide-react";
import { z } from "zod";

// Schéma formulaire — tout en strings (les inputs HTML renvoient toujours des strings)
const formulaireSchema = z
  .object({
    destinationId: z.string(),
    startDate: z.string().min(1, "Date de début requise"),
    endDate: z.string().min(1, "Date de fin requise"),
    peopleCount: z.string().min(1, "Nombre de personnes requis"),
  })
  .refine(
    (d) => !d.startDate || new Date(d.startDate) >= new Date(new Date().toDateString()),
    { message: "La date de début ne peut pas être dans le passé", path: ["startDate"] }
  )
  .refine(
    (d) => !d.startDate || !d.endDate || new Date(d.endDate) > new Date(d.startDate),
    { message: "La date de fin doit être après la date de début", path: ["endDate"] }
  );

type FormulaireInput = z.infer<typeof formulaireSchema>;

interface FormulaireReservationProps {
  destinationId: string;
  nomDestination: string;
  basePrice: number;
}

export default function FormulaireReservation({
  destinationId,
  nomDestination,
  basePrice,
}: FormulaireReservationProps) {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireInput>({
    resolver: zodResolver(formulaireSchema),
    defaultValues: { destinationId, peopleCount: "1" },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const peopleCount = watch("peopleCount");

  // Calcul du récapitulatif en temps réel
  const recapitulatif = useMemo(() => {
    if (!startDate || !endDate) return null;
    const debut = new Date(startDate);
    const fin = new Date(endDate);
    if (isNaN(debut.getTime()) || isNaN(fin.getTime()) || fin <= debut) return null;
    const nuits = Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24));
    const personnes = parseInt(String(peopleCount)) || 1;
    const total = basePrice * personnes * nuits;
    return { nuits, personnes, total };
  }, [startDate, endDate, peopleCount, basePrice]);

  const aujourd_hui = new Date().toISOString().split("T")[0];

  async function onSubmit(data: FormulaireInput) {
    setErreur(null);

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      setErreur(json.message ?? "Une erreur est survenue");
      return;
    }

    router.push("/account/reservations?confirmation=1");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <input type="hidden" {...register("destinationId")} />

      {erreur && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erreur}
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1.5">
            <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
            Date d&apos;arrivée
          </label>
          <input
            id="startDate"
            type="date"
            min={aujourd_hui}
            {...register("startDate")}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1.5">
            <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
            Date de départ
          </label>
          <input
            id="endDate"
            type="date"
            min={aujourd_hui}
            {...register("endDate")}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Nombre de personnes */}
      <div>
        <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700 mb-1.5">
          <Users className="inline w-4 h-4 mr-1 text-gray-400" />
          Nombre de personnes
        </label>
        <input
          id="peopleCount"
          type="number"
          min={1}
          max={20}
          {...register("peopleCount")}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.peopleCount && (
          <p className="mt-1 text-xs text-red-600">{errors.peopleCount.message}</p>
        )}
      </div>

      {/* Récapitulatif prix */}
      {recapitulatif && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            Récapitulatif
          </p>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{basePrice} € × {recapitulatif.personnes} personne{recapitulatif.personnes > 1 ? "s" : ""} × {recapitulatif.nuits} nuit{recapitulatif.nuits > 1 ? "s" : ""}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-blue-100">
            <span>Total</span>
            <span className="text-blue-600">{recapitulatif.total} €</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !recapitulatif}
        className="w-full rounded-xl bg-blue-600 text-white font-semibold px-4 py-3 hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Confirmation en cours…" : `Confirmer la réservation${recapitulatif ? ` — ${recapitulatif.total} €` : ""}`}
      </button>
    </form>
  );
}
