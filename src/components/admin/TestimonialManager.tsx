"use client";

import { useState, useTransition } from "react";
import { addTestimonial, deleteTestimonial, setTestimonialPublished } from "@/app/admin/actions";
import type { Testimonial } from "@/lib/types";
import { THEMES, getTheme } from "@/themes/registry";
import { MediaField } from "./MediaField";

export function TestimonialManager({ items }: { items: Testimonial[] }) {
  const [couple, setCouple] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [themeId, setThemeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await addTestimonial({ couple, message, image, theme_id: themeId });
      if (res.error) return setError(res.error);
      setCouple(""); setMessage(""); setImage(""); setThemeId("");
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[22rem_1fr]">
      <form onSubmit={submit} className="space-y-4 self-start rounded-xl border border-line bg-paper p-5">
        <h2 className="font-semibold">Tambah testimoni</h2>
        <p className="text-sm text-ink-soft">Gunakan ulasan asli dari customer dan minta izin mereka sebelum ditampilkan.</p>
        <label className="block">
          <span className="mb-1 block text-sm text-ink-soft">Nama pasangan</span>
          <input value={couple} onChange={(e) => setCouple(e.target.value)} placeholder="Laras & Bima" className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-ink-soft">Kutipan (opsional bila ada screenshot)</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={600} className="field" />
        </label>
        <MediaField label="Screenshot chat (opsional)" folder="testimoni" value={image} onChange={setImage} />
        <label className="block">
          <span className="mb-1 block text-sm text-ink-soft">Tema yang dipakai (opsional)</span>
          <select value={themeId} onChange={(e) => setThemeId(e.target.value)} className="field">
            <option value="">–</option>
            {THEMES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" disabled={pending} className="w-full rounded-full bg-moss py-2.5 text-paper disabled:opacity-60">
          {pending ? "Menyimpan…" : "Simpan testimoni"}
        </button>
      </form>

      <div>
        {items.length === 0 ? (
          <p className="py-16 text-center text-ink-soft">Belum ada testimoni. Section testimoni di halaman depan muncul otomatis setelah testimoni pertama disimpan.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {items.map((t) => (
              <li key={t.id} className={`rounded-xl border border-line bg-paper p-4 ${t.is_published ? "" : "opacity-60"}`}>
                {t.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.image} alt="" className="mb-3 max-h-64 w-full rounded-lg object-cover object-top" />
                )}
                {t.message && <p className="text-sm">“{t.message}”</p>}
                <p className="mt-2 text-sm font-semibold">{t.couple}</p>
                {t.theme_id && <p className="text-xs text-ink-soft">Tema {getTheme(t.theme_id)?.name ?? t.theme_id}</p>}
                <div className="mt-3 flex gap-3 text-xs">
                  <button type="button" disabled={pending} onClick={() => start(() => setTestimonialPublished(t.id, !t.is_published))} className="underline">
                    {t.is_published ? "Sembunyikan" : "Tampilkan"}
                  </button>
                  <button type="button" disabled={pending} onClick={() => { if (confirm(`Hapus testimoni ${t.couple}?`)) start(() => deleteTestimonial(t.id)); }} className="text-red-700 underline">
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
