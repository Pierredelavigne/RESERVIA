import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingDestinationDetail() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Fil d'Ariane */}
      <Skeleton className="h-4 w-64 mb-6" />

      {/* Titre + prix */}
      <div className="flex justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-12 w-32" />
      </div>

      {/* Galerie */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
        <Skeleton className="col-span-2 row-span-2 h-72 md:h-96 rounded-none" />
        <Skeleton className="h-36 md:h-48 rounded-none" />
        <Skeleton className="h-36 md:h-48 rounded-none" />
        <Skeleton className="h-36 md:h-48 rounded-none" />
        <Skeleton className="h-36 md:h-48 rounded-none" />
      </div>

      {/* Corps */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
