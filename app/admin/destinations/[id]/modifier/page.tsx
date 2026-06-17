import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import FormulaireDestination from "@/components/features/FormulaireDestination";

export const metadata: Metadata = {
  title: "Modifier la destination — Admin",
};

export default async function ModifierDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const destination = await prisma.destination.findUnique({
    where: { id },
  });

  if (!destination) notFound();

  const gallery = Array.isArray(destination.gallery)
    ? (destination.gallery as string[])
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Modifier : {destination.name}
      </h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <FormulaireDestination
          destinationId={id}
          valeurDefaut={{
            name: destination.name,
            country: destination.country,
            shortDescription: destination.shortDescription,
            description: destination.description,
            basePrice: destination.basePrice,
            imageUrl: destination.imageUrl,
            gallery,
          }}
        />
      </div>
    </div>
  );
}
