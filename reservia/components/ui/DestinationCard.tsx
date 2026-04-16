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
      className="group flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{country}</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{name}</h3>
        <p className="text-sm text-gray-500 flex-1 line-clamp-2">{shortDescription}</p>
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">À partir de</span>
          <span className="font-bold text-blue-600 text-lg">{basePrice} €<span className="text-xs font-normal text-gray-400"> / nuit</span></span>
        </div>
      </div>
    </Link>
  );
}
