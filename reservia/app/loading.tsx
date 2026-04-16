import { DestinationCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="h-12 bg-white/20 rounded-xl max-w-xl mx-auto animate-pulse" />
          <div className="h-6 bg-white/10 rounded-lg max-w-md mx-auto animate-pulse" />
          <div className="h-12 bg-white/10 rounded-xl max-w-sm mx-auto animate-pulse mt-6" />
        </div>
      </div>

      {/* Grille skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-8 bg-gray-200 rounded-lg w-56 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
