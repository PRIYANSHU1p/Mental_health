import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const cookieStore = await cookies();
  let guestId = cookieStore.get("guestId")?.value;

  if (!guestId) {
    // Create empty cart
    guestId = crypto.randomUUID();
    await prisma.cart.create({ data: { guestId } });
    // Cookie will be set during add-to-cart or checkout API, not here
  }

  const cart = await prisma.cart.findFirst({
    where: { guestId },
    include: { items: { include: { product: { include: { images: true } } } } },
  });

  if (!cart) redirect("/");

  const totalCents = cart.items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Your cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-3">
          {cart.items.length === 0 && <div className="text-gray-600">Your cart is empty.</div>}
          {cart.items.map((item) => {
            const product = item.product;
            const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
            const price = (item.unitPriceCents / 100).toFixed(2);
            return (
              <div key={item.id} className="flex gap-4 border rounded p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image?.url ?? "/placeholder.png"} alt={product.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <Link href={`/products/${product.slug}`} className="font-medium">{product.name}</Link>
                  <div className="text-sm text-gray-600">${price} × {item.quantity}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border rounded p-4 h-fit">
          <div className="flex items-center justify-between">
            <div className="font-medium">Subtotal</div>
            <div>${(totalCents / 100).toFixed(2)}</div>
          </div>
          <form action={async () => { 'use server'; }} className="mt-4">
            <button className="w-full bg-pink-600 text-white px-4 py-2 rounded">Checkout</button>
          </form>
        </div>
      </div>
    </div>
  );
}