import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <MapPin className="w-14 h-14 text-gray-200 mb-6" />
      <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
      <p className="text-xl font-semibold text-gray-700 mb-2">Page introuvable</p>
      <p className="text-gray-400 mb-8 max-w-sm">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-blue-600 text-white font-semibold px-6 py-3 text-sm hover:bg-blue-500 transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
