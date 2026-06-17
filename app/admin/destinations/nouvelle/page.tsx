import type { Metadata } from "next";
import FormulaireDestination from "@/components/features/FormulaireDestination";

export const metadata: Metadata = {
  title: "Nouvelle destination — Admin",
};

export default function NouvelleDestinationPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Nouvelle destination</h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <FormulaireDestination />
      </div>
    </div>
  );
}
