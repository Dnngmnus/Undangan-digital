"use client";

import { useEffect, useState } from "react";

/** Bar promo dengan hitung mundur ke akhir promo. */
export function PromoBar({ name, saving, endsAt, waUrl }: { name: string; saving: string; endsAt: string; waUrl: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(endsAt).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (left === 0) return null;
  const s = Math.floor((left ?? 0) / 1000);
  const parts = [
    [Math.floor(s / 86400), "h"],
    [Math.floor((s % 86400) / 3600), "j"],
    [Math.floor((s % 3600) / 60), "m"],
    [s % 60, "d"],
  ] as const;

  return (
    <div className="bg-marigold text-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-sm">
        <p>
          <strong>{name}:</strong> hemat sampai {saving}, berakhir dalam{" "}
          <span className="inline-flex gap-1 font-semibold tabular-nums" aria-live="off">
            {left === null
              ? "–"
              : parts.map(([v, u]) => (
                  <span key={u}>
                    {String(v).padStart(2, "0")}
                    <span className="font-normal">{u}</span>
                  </span>
                ))}
          </span>
        </p>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-3 py-0.5 text-xs font-semibold text-paper">
          Klaim diskon
        </a>
      </div>
    </div>
  );
}
