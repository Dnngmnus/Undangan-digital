"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CoverArt } from "@/components/invitation/CoverArt";
import type { InvitationData } from "@/lib/types";
import { CATEGORIES, THEMES, catalogTab, motionTags, themeVars, type CatalogTab, type ThemeCategory } from "@/themes/registry";
import { PhoneFrame } from "./PhoneFrame";

const TABS: { id: CatalogTab; label: string; hint: string }[] = [
  { id: "motion", label: "Tema Motion", hint: "Foto bergerak sendiri, kelopak atau kilau melayang, dan animasi saat undangan dibuka. Paling berkesan di layar ponsel tamu." },
  { id: "foto", label: "Tema Foto", hint: "Menampilkan foto prewedding di sampul, mempelai, dan galeri." },
  { id: "non-foto", label: "Tema Non Foto", hint: "Tanpa foto sama sekali. Cocok bila belum prewedding atau ingin tampilan tipografis." },
];

const HOW = [
  { n: "1", t: "Pilih tema", d: "Yang bergerak di bawah adalah sampul aslinya." },
  { n: "2", t: "Tekan Lihat demo", d: "Buka undangan lengkap seperti yang diterima tamu." },
  { n: "3", t: "Tekan Pesan", d: "Isi formulir singkat, lanjut lewat WhatsApp." },
];

export function Catalog({ data, dateLabel }: { data: InvitationData; dateLabel: string }) {
  const [tab, setTab] = useState<CatalogTab>("motion");
  const [cat, setCat] = useState<ThemeCategory | "Semua">("Semua");
  const [q, setQ] = useState("");
  const [paused, setPaused] = useState(false);

  const inTab = useMemo(() => THEMES.filter((t) => catalogTab(t) === tab), [tab]);
  const cats = useMemo(() => CATEGORIES.filter((c) => inTab.some((t) => t.category === c)), [inTab]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return inTab.filter(
      (t) =>
        (cat === "Semua" || t.category === cat) &&
        (!term || t.name.toLowerCase().includes(term) || t.description.toLowerCase().includes(term)),
    );
  }, [inTab, cat, q]);

  function switchTab(k: CatalogTab) {
    setTab(k);
    setCat("Semua");
  }

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${active ? "border-moss bg-moss text-paper" : "border-line bg-paper text-ink-soft hover:border-ink-soft"}`;

  return (
    <div>
      {/* Cara pakai katalog, 3 langkah */}
      <ol className="mx-auto mb-8 grid max-w-3xl gap-3 sm:grid-cols-3">
        {HOW.map((h) => (
          <li key={h.n} className="flex items-start gap-3 rounded-2xl bg-porcelain px-4 py-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss text-xs font-semibold text-paper">{h.n}</span>
            <span className="text-sm leading-snug">
              <span className="block font-semibold">{h.t}</span>
              <span className="text-ink-soft">{h.d}</span>
            </span>
          </li>
        ))}
      </ol>

      {/* Tab utama: Motion / Foto / Non Foto */}
      <div role="tablist" aria-label="Jenis tema" className="mx-auto grid max-w-xl grid-cols-3 rounded-full bg-porcelain p-1.5">
        {TABS.map((k) => {
          const n = THEMES.filter((t) => catalogTab(t) === k.id).length;
          const active = tab === k.id;
          return (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => switchTab(k.id)}
              className={`flex items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${active ? "bg-ink text-paper shadow" : "text-ink-soft hover:text-ink"}`}
            >
              {k.id === "motion" && <span className={`h-2 w-2 rounded-full ${active ? "bg-marigold" : "bg-moss"} animate-pulse`} aria-hidden />}
              <span>{k.label}</span>
              <span className="hidden font-normal opacity-70 sm:inline">({n})</span>
            </button>
          );
        })}
      </div>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink-soft">{TABS.find((k) => k.id === tab)!.hint}</p>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gaya">
          {(["Semua", ...cats] as const).map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={chip(cat === c)} aria-pressed={cat === c}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {tab === "motion" && (
            <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="shrink-0 rounded-full border border-line bg-paper px-3.5 py-2 text-sm text-ink-soft hover:border-ink-soft">
              {paused ? "▶ Putar animasi" : "❚❚ Jeda animasi"}
            </button>
          )}
          <label className="relative md:w-56">
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
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          Tidak ada tema yang cocok.{" "}
          <button type="button" className="underline underline-offset-4" onClick={() => { setQ(""); setCat("Semua"); }}>Tampilkan semua</button>
        </p>
      ) : (
        <ul className={`mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 ${paused ? "mo-paused" : ""}`}>
          {list.map((t) => {
            const tags = motionTags(t);
            return (
              <li key={t.id} className="group flex flex-col">
                <Link href={`/tema/${t.id}`} className="relative block" aria-label={`Lihat demo ${t.name}`}>
                  <PhoneFrame className="transition-transform duration-300 group-hover:-translate-y-1">
                    <div style={themeVars(t)} className="h-full w-full">
                      <CoverArt theme={t} data={data} dateLabel={dateLabel} />
                    </div>
                  </PhoneFrame>
                  {t.motion ? (
                    <span className="absolute -left-1 -top-2 flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-paper shadow">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-marigold" aria-hidden />
                      Bergerak
                    </span>
                  ) : null}
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

                {tags.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Efek gerak">
                    {tags.map((g) => (
                      <li key={g} className="rounded-full bg-sage-soft px-2 py-0.5 text-[11px] leading-tight text-moss-deep">{g}</li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex gap-2 pt-4">
                  <Link href={`/tema/${t.id}`} className="flex-1 rounded-full border border-ink py-2 text-center text-xs sm:text-sm">Lihat demo</Link>
                  <Link href={`/order?tema=${t.id}`} className="flex-1 rounded-full bg-moss py-2 text-center text-xs font-semibold text-paper sm:text-sm">Pesan</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
