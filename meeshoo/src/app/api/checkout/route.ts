import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const guestId = req.cookies.get("guestId")?.value;
  if (!guestId) return NextResponse.json({ ok: false, error: "No cart" }, { status: 400 });

  const cart = await prisma.cart.findFirst({ where: { guestId }, include: { items: { include: { product: true } } } });
  if (!cart || cart.items.length === 0) return NextResponse.json({ ok: false, error: "Empty cart" }, { status: 400 });

  const totalCents = cart.items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      email: "guest@example.com",
      totalCents,
      items: {
        create: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPriceCents: i.unitPriceCents })),
      },
    },
    include: { items: true },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return NextResponse.json({ ok: true, orderId: order.id });
}