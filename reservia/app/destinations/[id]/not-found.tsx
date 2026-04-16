import Link from "next/link";
import { MapPin } from "lucide-react";

export default function DestinationNonTrouvee() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <MapPin className="w-12 h-12 text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Destination introuvable
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Cette destination n&apos;existe pas ou a été supprimée.
      </p>
      <Link
        href="/destinations"
        className="rounded-xl bg-blue-600 text-white font-semibold px-6 py-3 text-sm hover:bg-blue-500 transition-colors"
      >
        Voir toutes les destinations
      </Link>
    </div>
  );
}
