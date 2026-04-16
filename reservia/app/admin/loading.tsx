import { Skeleton, TableRowSkeleton } from "@/components/ui/Skeleton";

export default function LoadingAdmin() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5">
            <Skeleton className="h-9 w-9 mb-3" />
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <Skeleton className="h-4 w-32" />
        </div>
        <table className="w-full">
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={5} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
