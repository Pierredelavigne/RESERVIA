"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pages: number;
}

export default function Pagination({ page, pages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pages <= 1) return null;

  const creerUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <Link
        href={creerUrl(page - 1)}
        aria-disabled={page <= 1}
        className={`p-2 rounded-lg border border-gray-200 transition-colors ${
          page <= 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={creerUrl(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-colors ${
            p === page
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-200 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={creerUrl(page + 1)}
        aria-disabled={page >= pages}
        className={`p-2 rounded-lg border border-gray-200 transition-colors ${
          page >= pages
            ? "pointer-events-none opacity-40"
            : "hover:bg-gray-100"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
