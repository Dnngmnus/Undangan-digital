"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CoverArt } from "@/components/invitation/CoverArt";
import type { InvitationData } from "@/lib/types";
import { CATEGORIES, THEMES, themeKind, themeVars, type ThemeCategory, type ThemeKind } from "@/themes/registry";
import { PhoneFrame } from "./PhoneFrame";

const KINDS: { id: ThemeKind; label: string; hint: string }[] = [
  { id: "foto", label: "Tema Foto", hint: "Menampilkan foto prewedding di sampul, mempelai, dan galeri." },
  { id: "non-foto", label: "Tema Non Foto", hint: "Tanpa foto sama sekali. Cocok bila belum prewedding atau ingin tampilan tipografis." },
];

export function Catalog({ data, dateLabel }: { data: InvitationData; dateLabel: string }) {
  const [kind, setKind] = useState<ThemeKind>("foto");
  const [cat, setCat] = useState<ThemeCategory | "Semua">("Semua");
  const [q, setQ] = useState("");

  const inKind = useMemo(() => THEMES.filter((t) => themeKind(t) === kind), [kind]);
  const cats = useMemo(() => CATEGORIES.filter((c) => inKind.some((t) => t.category === c)), [inKind]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return inKind.filter(
      (t) =>
        (cat === "Semua" || t.category === cat) &&
        (!term || t.name.toLowerCase().includes(term) || t.description.toLowerCase().includes(term)),
    );
  }, [inKind, cat, q]);

  function switchKind(k: ThemeKind) {
    setKind(k);
    setCat("Semua");
  }

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${active ? "border-moss bg-moss text-paper" : "border-line bg-paper text-ink-soft hover:border-ink-soft"}`;

  return (
    <div>
      {/* Tab utama: Foto / Non Foto */}
      <div role="tablist" aria-label="Jenis tema" className="mx-auto grid max-w-md grid-cols-2 rounded-full bg-porcelain p-1.5">
        {KINDS.map((k) => {
          const n = THEMES.filter((t) => themeKind(t) === k.id).length;
          return (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={kind === k.id}
              onClick={() => switchKind(k.id)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${kind === k.id ? "bg-ink text-paper shadow" : "text-ink-soft hover:text-ink"}`}
            >
              {k.label} <span className="font-normal opacity-70">({n})</span>
            </button>
          );
        })}
      </div>
      <p className="mx-auto mt-3 max-w-md text-center text-sm text-ink-soft">{KINDS.find((k) => k.id === kind)!.hint}</p>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
          {(["Semua", ...cats] as const).map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={chip(cat === c)} aria-pressed={cat === c}>
              {c}
            </button>
          ))}
        </div>
        <label className="relative md:w-64">
          <span className="sr-only">Cari tema</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari tema atau warna"
            className="w-full rounded-full border border-line bg-paper px-4 py-2 text-sm placeholder:text-ink-soft/60 focus:border-moss focus:outline-none"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          Tidak ada tema yang cocok.{" "}
          <button type="button" className="underline underline-offset-4" onClick={() => { setQ(""); setCat("Semua"); }}>Tampilkan semua</button>
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {list.map((t) => (
            <li key={t.id} className="group flex flex-col">
              <Link href={`/tema/${t.id}`} className="relative block" aria-label={`Lihat demo ${t.name}`}>
                <PhoneFrame className="transition-transform duration-300 group-hover:-translate-y-1">
                  <div style={themeVars(t)} className="h-full w-full">
                    <CoverArt theme={t} data={data} dateLabel={dateLabel} />
                  </div>
                </PhoneFrame>
                {t.badge && (
                  <span className={`absolute -right-1 -top-2 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow ${t.badge === "Baru" ? "bg-blush text-ink" : "bg-marigold text-ink"}`}>
                    {t.badge}
                  </span>
                )}
              </Link>

              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif-display text-lg leading-tight">{t.name}</h3>
                  <p className="text-xs text-ink-soft">{t.category}</p>
                </div>
                <div className="flex -space-x-1 pt-1" aria-hidden>
                  {[t.palette.bg, t.palette.primary, t.palette.accent].map((c) => (
                    <span key={c} className="h-4 w-4 rounded-full border border-paper" style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div className="mt-auto flex gap-2 pt-4">
                <Link href={`/tema/${t.id}`} className="flex-1 rounded-full border border-ink py-2 text-center text-xs sm:text-sm">Lihat demo</Link>
                <Link href={`/order?tema=${t.id}`} className="flex-1 rounded-full bg-moss py-2 text-center text-xs font-semibold text-paper sm:text-sm">Pesan</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
