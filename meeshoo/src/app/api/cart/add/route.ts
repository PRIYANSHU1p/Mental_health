import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, quantity = 1 } = body ?? {};
  if (!productId || quantity < 1) return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });

  // Use or create a guest cart by reading header cookie manually and setting on response
  let guestId = req.cookies.get("guestId")?.value ?? crypto.randomUUID();

  let cart = await prisma.cart.findFirst({ where: { guestId }, include: { items: true } });
  if (!cart) {
    await prisma.cart.create({ data: { guestId } });
    cart = await prisma.cart.findFirst({ where: { guestId }, include: { items: true } });
  }

  if (!cart) return NextResponse.json({ ok: false, error: "Cart error" }, { status: 500 });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });

  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        unitPriceCents: product.priceCents,
      },
    });
  }

  const res = NextResponse.json({ ok: true });
  if (!req.cookies.get("guestId")?.value) {
    res.cookies.set("guestId", guestId, { httpOnly: true, sameSite: "lax", path: "/" });
  }
  return res;
}