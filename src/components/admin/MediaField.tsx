"use client";

import { useRef, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";

const BUCKET = "media";
const MAX_MB = 8;

/** Upload ke Supabase Storage (bucket "media"), kembalikan URL publik. */
export async function uploadMedia(file: File, folder: string) {
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`Ukuran maksimal ${MAX_MB} MB`);
  const supabase = getBrowserSupabase();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
};

/** Input URL + tombol upload. URL bisa diisi manual (Google Drive/CDN) atau hasil upload. */
export function MediaField({ label, value, onChange, folder, accept = "image/*" }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const isImage = accept.startsWith("image");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    setErr(null);
    try {
      onChange(await uploadMedia(f, folder));
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm text-ink-soft">{label}</span>
      <div className="flex gap-2">
        {isImage && value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
        )}
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" className="field min-w-0 flex-1" />
        <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="shrink-0 rounded-lg border border-line bg-porcelain px-3 text-sm disabled:opacity-60">
          {busy ? "Mengunggah…" : "Unggah"}
        </button>
        <input ref={ref} type="file" accept={accept} onChange={onFile} className="hidden" />
      </div>
      {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
    </div>
  );
}
