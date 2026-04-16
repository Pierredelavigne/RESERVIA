import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingAccount() {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <Skeleton className="h-5 w-48 mb-5" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-4 w-4 shrink-0 mt-1" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  );
}
