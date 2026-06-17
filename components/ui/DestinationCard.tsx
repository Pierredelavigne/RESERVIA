import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface DestinationCardProps {
  id: string;
  name: string;
  country: string;
  shortDescription: string;
  basePrice: number;
  imageUrl: string;
}

export default function DestinationCard({
  id,
  name,
  country,
  shortDescription,
  basePrice,
  imageUrl,
}: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${id}`}
      data-testid="destination-card"
      className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image avec overlay gradient */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient overlay bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badge pays */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-full shadow-sm">
          <MapPin className="w-3 h-3 text-sky-500" />
          {country}
        </div>

        {/* Prix en overlay bas */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
          <span className="font-bold text-slate-900 text-sm">{basePrice} €</span>
          <span className="text-slate-400 text-xs"> / nuit</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 p-4 gap-1.5">
        <h3 className="font-semibold text-slate-900 text-lg leading-tight group-hover:text-sky-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {shortDescription}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-medium text-sky-600 group-hover:underline">
            Voir la destination →
          </span>
        </div>
      </div>
    </Link>
  );
}
