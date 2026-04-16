import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import BoutonSuppression from "./BoutonSuppression";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      country: true,
      basePrice: true,
      imageUrl: true,
      _count: { select: { reservations: true } },
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Destinations{" "}
          <span className="text-sm font-normal text-gray-400">
            ({destinations.length})
          </span>
        </h2>
        <Link
          href="/admin/destinations/nouvelle"
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 text-white font-semibold px-4 py-2 text-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Destination</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Pays</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Prix / nuit</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Réservations</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {destinations.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={d.imageUrl}
                        alt={d.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <span className="font-medium text-gray-900">{d.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{d.country}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900 hidden md:table-cell">
                  {d.basePrice} €
                </td>
                <td className="px-4 py-3 text-right text-gray-500 hidden md:table-cell">
                  {d._count.reservations}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/destinations/${d.id}/modifier`}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <BoutonSuppression id={d.id} nom={d.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
