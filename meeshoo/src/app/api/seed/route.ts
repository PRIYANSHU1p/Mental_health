import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const existing = await prisma.category.findFirst();
    if (existing) {
      return NextResponse.json({ ok: true, message: "Already seeded" });
    }

    const categories = await prisma.category.createMany({
      data: [
        { name: "Fashion", slug: "fashion" },
        { name: "Electronics", slug: "electronics" },
        { name: "Home & Kitchen", slug: "home-kitchen" },
      ],
    });

    const fashion = await prisma.category.findUnique({ where: { slug: "fashion" } });
    const electronics = await prisma.category.findUnique({ where: { slug: "electronics" } });
    const home = await prisma.category.findUnique({ where: { slug: "home-kitchen" } });

    const productsData = [
      {
        name: "Classic Tee",
        slug: "classic-tee",
        description: "Comfortable cotton t-shirt",
        priceCents: 1999,
        stock: 50,
        categoryId: fashion?.id,
        images: { create: [{ url: "/placeholder/tee.jpg", isPrimary: true }] },
      },
      {
        name: "Wireless Earbuds",
        slug: "wireless-earbuds",
        description: "Bluetooth noise-cancelling earbuds",
        priceCents: 7999,
        stock: 40,
        categoryId: electronics?.id,
        images: { create: [{ url: "/placeholder/earbuds.jpg", isPrimary: true }] },
      },
      {
        name: "Ceramic Mug",
        slug: "ceramic-mug",
        description: "Dishwasher-safe 350ml mug",
        priceCents: 1299,
        stock: 100,
        categoryId: home?.id,
        images: { create: [{ url: "/placeholder/mug.jpg", isPrimary: true }] },
      },
    ];

    for (const p of productsData) {
      await prisma.product.create({ data: p as any });
    }

    return NextResponse.json({ ok: true, categories: categories.count, products: productsData.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Seed failed" }, { status: 500 });
  }
}