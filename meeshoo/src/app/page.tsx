import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white p-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Shop the latest on Meeshoo</h1>
        <p className="mt-3 text-white/90 max-w-2xl">Discover trending products across fashion, electronics, home & kitchen, and more. Fast checkout and secure payments.</p>
        <div className="mt-6 flex gap-4">
          <Link href="/products" className="bg-white text-black font-medium px-5 py-2.5 rounded-md">Browse products</Link>
          <Link href="/account" className="border border-white/60 px-5 py-2.5 rounded-md">Sign in</Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured</h2>
          <Link href="/products" className="text-sm text-pink-600">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Placeholder cards to be replaced by DB data */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 aspect-square" />
              <div className="p-3">
                <div className="font-medium">Product {i + 1}</div>
                <div className="text-sm text-gray-600">$99.99</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
