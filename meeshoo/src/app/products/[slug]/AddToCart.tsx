"use client";

import { useState, useTransition } from "react";

export default function AddToCart({ productId }: { productId: string }) {
  const [pending, start] = useTransition();
  const [ok, setOk] = useState<boolean | null>(null);

  async function add() {
    setOk(null);
    start(async () => {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setOk(res.ok);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={add} disabled={pending} className="bg-pink-600 text-white px-5 py-2.5 rounded-md">
        {pending ? "Adding..." : "Add to cart"}
      </button>
      {ok === true && <span className="text-sm text-green-600">Added</span>}
      {ok === false && <span className="text-sm text-red-600">Failed</span>}
    </div>
  );
}