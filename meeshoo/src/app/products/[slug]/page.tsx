import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCart from "./AddToCart";

interface Props { params: Promise<{ slug: string }> }

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true, reviews: { include: { user: true } } },
  });
  if (!product) return notFound();

  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const price = (product.priceCents / 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="aspect-square bg-gray-100 relative rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={primary?.url ?? "/placeholder.png"} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {product.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.id} src={img.url} alt="thumbnail" className="aspect-square object-cover rounded" />
            ))}
          </div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        {product.category && (
          <div className="text-sm text-gray-500 mt-1">{product.category.name}</div>
        )}
        <div className="text-3xl font-bold mt-4">${price}</div>
        <p className="mt-4 text-gray-700 whitespace-pre-line">{product.description}</p>
        <div className="mt-6">
          <AddToCart productId={product.id} />
        </div>
        {product.reviews.length > 0 && (
          <div className="mt-8">
            <h2 className="font-medium mb-2">Reviews</h2>
            <div className="space-y-3">
              {product.reviews.map((r) => (
                <div key={r.id} className="border rounded p-3">
                  <div className="text-sm text-gray-500">{r.user?.name ?? "User"} • {new Date(r.createdAt).toLocaleDateString()}</div>
                  <div className="mt-1">{r.comment}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}