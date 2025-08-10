import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: { where: { isPrimary: true }, take: 1 }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => {
          const imageUrl = p.images[0]?.url ?? "/placeholder.png";
          const price = (p.priceCents / 100).toFixed(2);
          return (
            <Link key={p.id} href={`/products/${p.slug}`} className="border rounded-lg overflow-hidden hover:shadow">
              <div className="bg-gray-100 aspect-square relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-sm text-gray-600">${price}</div>
                {p.category && (
                  <div className="text-xs text-gray-500 mt-1">{p.category.name}</div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}