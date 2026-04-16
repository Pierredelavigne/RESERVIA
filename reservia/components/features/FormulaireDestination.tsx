"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import {
  destinationSchema,
  type DestinationInput,
} from "@/lib/validations/destination";

interface FormulaireDestinationProps {
  valeurDefaut?: Partial<DestinationInput>;
  destinationId?: string; // présent = mode édition
}

export default function FormulaireDestination({
  valeurDefaut,
  destinationId,
}: FormulaireDestinationProps) {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);
  const modeEdition = !!destinationId;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DestinationInput>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      gallery: [],
      ...valeurDefaut,
    },
  });

  const { fields, append, remove } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
    name: "gallery" as never,
  });

  async function onSubmit(data: DestinationInput) {
    setErreur(null);

    const url = modeEdition
      ? `/api/destinations/${destinationId}`
      : "/api/destinations";
    const methode = modeEdition ? "PUT" : "POST";

    const res = await fetch(url, {
      method: methode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      setErreur(json.message ?? "Une erreur est survenue");
      return;
    }

    router.push("/admin/destinations");
    router.refresh();
  }

  const champ = (
    id: keyof DestinationInput,
    label: string,
    props?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        {...register(id)}
        {...props}
        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors[id] && (
        <p className="mt-1 text-xs text-red-600">{errors[id]?.message as string}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {erreur && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erreur}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {champ("name", "Nom de la destination")}
        {champ("country", "Pays")}
      </div>

      {champ("shortDescription", "Description courte (max 200 car.)", { maxLength: 200 })}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Description complète
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={4}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {champ("basePrice", "Prix de base (€ / nuit / personne)", {
          type: "number",
          min: 0,
          step: "0.01",
        })}
        {champ("imageUrl", "URL de l'image principale")}
      </div>

      {/* Galerie */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Galerie de photos
          </label>
          <button
            type="button"
            onClick={() => append("" as unknown as never)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter une URL
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`gallery.${index}` as const)}
                placeholder="https://images.unsplash.com/…"
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-xs text-gray-400">Aucune photo de galerie ajoutée.</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 text-white font-semibold px-6 py-2.5 text-sm hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Enregistrement…"
            : modeEdition
            ? "Enregistrer les modifications"
            : "Créer la destination"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 text-sm hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
