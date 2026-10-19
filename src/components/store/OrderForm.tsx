"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createOrder, type OrderState } from "@/app/actions/order";
import { CoverArt } from "@/components/invitation/CoverArt";
import { ADDONS, PACKAGES, PROMO, getPackage } from "@/lib/catalog";
import type { InvitationData } from "@/lib/types";
import { rupiah } from "@/lib/utils";
import { THEMES, catalogTab, getThemeOrDefault, themeVars } from "@/themes/registry";
import { PhoneFrame } from "./PhoneFrame";

type Props = { initialTheme: string; initialPackage: string; demo: InvitationData; dateLabel: string };

export function OrderForm({ initialTheme, initialPackage, demo, dateLabel }: Props) {
  const [themeId, setThemeId] = useState(initialTheme);
  const [pkgId, setPkgId] = useState(initialPackage);
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [state, action, pending] = useActionState<OrderState, FormData>(createOrder, {});

  const theme = getThemeOrDefault(themeId);
  const pkg = getPackage(pkgId) ?? PACKAGES[1];
  const chosenAddons = ADDONS.filter((a) => addons.includes(a.id));
  // Total hanya untuk tampilan; server menghitung ulang dari id paket & add-on
  const total = pkg.price + chosenAddons.reduce((s, a) => s + a.price, 0);
  const toggleAddon = (id: string) => setAddons((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]));
  // pratinjau sampul ikut berubah sesuai nama yang diketik
  const preview: InvitationData = {
    ...demo,
    bride: { ...demo.bride, nickname: bride || demo.bride.nickname },
    groom: { ...demo.groom, nickname: groom || demo.groom.nickname },
  };

  useEffect(() => {
    if (state.waUrl) window.location.href = state.waUrl;
  }, [state.waUrl]);

  if (state.waUrl) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-paper p-8 text-center" role="status">
        <h2 className="font-serif-display text-2xl">Pesanan #{state.code} tercatat</h2>
        <p className="mt-3 text-ink-soft">
          WhatsApp akan terbuka dengan ringkasan pesanan. Kirim pesannya agar admin bisa memproses undanganmu.
        </p>
        <a href={state.waUrl} className="mt-6 inline-block rounded-full bg-moss px-6 py-3 text-paper">Buka WhatsApp</a>
        <p className="mt-4 text-sm"><Link href="/" className="underline underline-offset-4">Kembali ke katalog</Link></p>
      </div>
    );
  }

  const input = "w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm focus:border-moss focus:outline-none";

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_17rem]">
      <form
        className="space-y-8"
        onSubmit={(e) => {
          // dispatch manual (bukan prop `action`) supaya field tidak di-reset saat validasi gagal
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => action(fd));
        }}
      >
        <fieldset>
          <legend className="font-semibold">Tema</legend>
          <select name="theme" value={themeId} onChange={(e) => setThemeId(e.target.value)} className={`${input} mt-2`}>
            {(["motion", "foto", "non-foto"] as const).map((k) => (
              <optgroup key={k} label={k === "motion" ? "Tema Motion (foto bergerak)" : k === "foto" ? "Tema Foto" : "Tema Non Foto"}>
                {THEMES.filter((t) => catalogTab(t) === k).map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                ))}
              </optgroup>
            ))}
          </select>
          <Link href={`/tema/${themeId}`} target="_blank" className="mt-2 inline-block text-sm text-moss underline underline-offset-4">
            Buka demo tema ini
          </Link>
        </fieldset>

        <fieldset>
          <legend className="font-semibold">Paket</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {PACKAGES.map((p) => (
              <label key={p.id} className={`cursor-pointer rounded-xl border p-4 transition-colors ${pkgId === p.id ? "border-moss bg-moss/5 ring-1 ring-moss" : "border-line bg-paper"}`}>
                <input type="radio" name="package" value={p.id} checked={pkgId === p.id} onChange={() => setPkgId(p.id)} className="sr-only" />
                <span className="block font-semibold">{p.name}</span>
                {PROMO.active && <span className="mt-1 block text-xs text-ink-soft line-through">{rupiah(p.originalPrice)}</span>}
                <span className="block font-semibold text-moss">{rupiah(p.price)}</span>
                <span className="block text-xs text-ink-soft">{p.activePeriod}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-semibold">Add-on <span className="font-normal text-ink-soft">(opsional)</span></legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {ADDONS.map((a) => {
              const on = addons.includes(a.id);
              return (
                <label key={a.id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${on ? "border-moss bg-moss/5 ring-1 ring-moss" : "border-line bg-paper"}`}>
                  <input type="checkbox" name="addons" value={a.id} checked={on} onChange={() => toggleAddon(a.id)} className="mt-1 h-4 w-4 shrink-0 accent-moss" />
                  <span>
                    <span className="block font-semibold">{a.name} <span className="font-normal text-moss">+{rupiah(a.price)}</span></span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{a.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-semibold">Data pemesan & mempelai</legend>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm text-ink-soft">Nama pemesan</span>
            <input name="customer" required minLength={2} maxLength={100} autoComplete="name" className={input} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm text-ink-soft">Nomor WhatsApp</span>
            <input name="whatsapp" required inputMode="tel" autoComplete="tel" placeholder="081234567890" className={input} />
          </label>
          <label>
            <span className="mb-1 block text-sm text-ink-soft">Nama panggilan mempelai wanita</span>
            <input name="bride" required maxLength={60} value={bride} onChange={(e) => setBride(e.target.value)} className={input} />
          </label>
          <label>
            <span className="mb-1 block text-sm text-ink-soft">Nama panggilan mempelai pria</span>
            <input name="groom" required maxLength={60} value={groom} onChange={(e) => setGroom(e.target.value)} className={input} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm text-ink-soft">Tanggal acara (opsional)</span>
            <input name="date" type="date" className={input} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm text-ink-soft">Catatan untuk admin (opsional)</span>
            <textarea name="notes" rows={3} maxLength={2000} placeholder="Contoh: ingin musik lagu tertentu, adat Jawa, dua lokasi acara" className={input} />
          </label>
          <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </fieldset>

        <div className="rounded-2xl bg-moss-deep p-5 text-paper">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt>Paket {pkg.name}</dt>
              <dd>{PROMO.active && <span className="mr-2 text-paper/50 line-through">{rupiah(pkg.originalPrice)}</span>}{rupiah(pkg.price)}</dd>
            </div>
            {chosenAddons.map((a) => (
              <div key={a.id} className="flex justify-between gap-4 text-paper/80">
                <dt>{a.name}</dt>
                <dd>+{rupiah(a.price)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex items-baseline justify-between border-t border-paper/20 pt-3">
            <span className="font-semibold">Total</span>
            <span className="font-serif-display text-2xl text-marigold">{rupiah(total)}</span>
          </div>
          {PROMO.active && pkg.originalPrice > pkg.price && (
            <p className="mt-1 text-right text-xs text-paper/70">Kamu hemat {rupiah(pkg.originalPrice - pkg.price)}</p>
          )}
        </div>

        {state.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p>}

        <button type="submit" disabled={pending} className="w-full rounded-full bg-moss py-3.5 font-semibold text-paper disabled:opacity-60 sm:w-auto sm:px-10">
          {pending ? "Mengirim pesanan…" : "Kirim pesanan ke WhatsApp"}
        </button>
      </form>

      <aside className="order-first md:order-none">
        <div className="md:sticky md:top-24">
          <div className="mx-auto w-48 md:w-full">
            <PhoneFrame>
              <div style={themeVars(theme)} className="h-full w-full">
                <CoverArt theme={theme} data={preview} dateLabel={dateLabel} />
              </div>
            </PhoneFrame>
          </div>
          <p className="mt-3 text-center text-sm text-ink-soft">Pratinjau sampul {theme.name}</p>
        </div>
      </aside>
    </div>
  );
}
