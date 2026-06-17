"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GaleriePhotosProps {
  imageUrl: string;
  gallery: string[];
  nom: string;
}

export default function GaleriePhotos({ imageUrl, gallery, nom }: GaleriePhotosProps) {
  const toutes = [imageUrl, ...gallery];
  const [lightbox, setLightbox] = useState<number | null>(null);

  const precedent = () =>
    setLightbox((i) => (i !== null ? (i - 1 + toutes.length) % toutes.length : null));
  const suivant = () =>
    setLightbox((i) => (i !== null ? (i + 1) % toutes.length : null));

  return (
    <>
      {/* Grille photos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
        {/* Grande photo principale */}
        <div
          className="col-span-2 row-span-2 relative h-72 md:h-96 cursor-pointer"
          onClick={() => setLightbox(0)}
        >
          <Image
            src={toutes[0]}
            alt={nom}
            fill
            priority
            className="object-cover hover:brightness-90 transition"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Miniatures */}
        {toutes.slice(1, 5).map((src, i) => (
          <div
            key={i}
            className="relative h-36 md:h-48 cursor-pointer"
            onClick={() => setLightbox(i + 1)}
          >
            <Image
              src={src}
              alt={`${nom} — photo ${i + 2}`}
              fill
              className="object-cover hover:brightness-90 transition"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Indicateur "voir plus" sur la dernière miniature */}
            {i === 3 && toutes.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                +{toutes.length - 5} photos
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={(e) => { e.stopPropagation(); precedent(); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div
            className="relative w-full max-w-4xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={toutes[lightbox]}
              alt={`${nom} — photo ${lightbox + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={(e) => { e.stopPropagation(); suivant(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <span className="absolute bottom-4 text-white/60 text-sm">
            {lightbox + 1} / {toutes.length}
          </span>
        </div>
      )}
    </>
  );
}
