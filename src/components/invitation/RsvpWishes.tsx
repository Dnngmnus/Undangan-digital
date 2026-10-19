"use client";

import { useMemo, useState, useTransition } from "react";
import { submitRsvp } from "@/app/actions/rsvp";
import type { Attendance, Rsvp } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

const LABEL: Record<Attendance, string> = { hadir: "Hadir", tidak: "Tidak hadir", ragu: "Masih ragu" };
const PAGE = 6;

type Props = {
  /** null = mode demo: data hanya disimpan di state, tidak ke database */
  invitationId: string | null;
  guestName: string;
  initial: Rsvp[];
};

export function RsvpWishes({ invitationId, guestName, initial }: Props) {
  const [wishes, setWishes] = useState(initial);
  const [shown, setShown] = useState(PAGE);
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  const counts = useMemo(
    () => wishes.reduce((acc, w) => ({ ...acc, [w.attendance]: acc[w.attendance] + 1 }), { hadir: 0, tidak: 0, ragu: 0 } as Record<Attendance, number>),
    [wishes],
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const input = {
      name: String(fd.get("name") ?? ""),
      attendance,
      guests: Number(fd.get("guests") ?? 1),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };
    setError(null);

    start(async () => {
      if (!invitationId) {
        // mode demo / preview tema
        if (input.name.trim().length < 2) return setError("Nama minimal 2 karakter.");
        const fake: Rsvp = { id: crypto.randomUUID(), invitation_id: "demo", name: input.name.trim(), attendance, guests: input.guests, message: input.message.trim() || null, created_at: new Date().toISOString() };
        setWishes((w) => [fake, ...w]);
        setSent(true);
        return;
      }
      const res = await submitRsvp(invitationId, input);
      if (!res.ok) return setError(res.error);
      setWishes((w) => [res.rsvp, ...w]);
      setSent(true);
      form.reset();
    });
  }

  const field = "w-full rounded-md border border-iv-accent/50 bg-iv-surface px-3 py-2.5 font-body text-sm text-iv-ink placeholder:text-iv-muted/70 focus:border-iv-primary focus:outline-none";

  return (
    <div className="space-y-8">
      {sent ? (
        <div className="reveal is-visible rounded-xl border border-iv-accent/50 bg-iv-surface p-6 text-center" role="status">
          <p className="font-display text-xl text-iv-primary">Terima kasih</p>
          <p className="mt-2 font-body text-sm text-iv-muted">Konfirmasi dan ucapan Anda sudah kami terima.</p>
          <button type="button" onClick={() => setSent(false)} className="mt-4 font-body text-sm text-iv-primary underline underline-offset-4">
            Kirim ucapan lain
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="reveal space-y-3 rounded-xl border border-iv-accent/50 bg-iv-surface/60 p-5">
          <label className="block">
            <span className="mb-1 block font-body text-xs text-iv-muted">Nama</span>
            <input name="name" required minLength={2} maxLength={80} defaultValue={guestName} className={field} />
          </label>

          <fieldset>
            <legend className="mb-1 font-body text-xs text-iv-muted">Konfirmasi kehadiran</legend>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(LABEL) as Attendance[]).map((a) => (
                <label key={a} className={`cursor-pointer rounded-md border px-2 py-2 text-center font-body text-xs transition-colors ${attendance === a ? "border-iv-primary bg-iv-primary text-iv-on-primary" : "border-iv-accent/50 text-iv-ink"}`}>
                  <input type="radio" name="attendance" value={a} checked={attendance === a} onChange={() => setAttendance(a)} className="sr-only" />
                  {LABEL[a]}
                </label>
              ))}
            </div>
          </fieldset>

          {attendance !== "tidak" && (
            <label className="block">
              <span className="mb-1 block font-body text-xs text-iv-muted">Jumlah tamu</span>
              <select name="guests" defaultValue={1} className={field}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} orang</option>)}
              </select>
            </label>
          )}

          <label className="block">
            <span className="mb-1 block font-body text-xs text-iv-muted">Ucapan & doa</span>
            <textarea name="message" rows={3} maxLength={1000} placeholder="Tulis ucapan untuk kedua mempelai" className={field} />
          </label>

          {/* honeypot — tersembunyi dari manusia */}
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

          {error && <p className="font-body text-sm text-red-600" role="alert">{error}</p>}

          <button type="submit" disabled={pending} className="w-full rounded-md bg-iv-primary py-3 font-body text-sm text-iv-on-primary disabled:opacity-60">
            {pending ? "Mengirim…" : "Kirim ucapan"}
          </button>
        </form>
      )}

      <div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {(Object.keys(LABEL) as Attendance[]).map((a) => (
            <div key={a} className="rounded-md bg-iv-surface py-2">
              <div className="font-display text-2xl text-iv-primary">{counts[a]}</div>
              <div className="font-body text-[11px] text-iv-muted">{LABEL[a]}</div>
            </div>
          ))}
        </div>

        <ul className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {wishes.length === 0 && (
            <li className="py-6 text-center font-body text-sm text-iv-muted">Jadilah yang pertama mengirim ucapan.</li>
          )}
          {wishes.slice(0, shown).map((w) => (
            <li key={w.id} className="rounded-lg border border-iv-accent/30 bg-iv-surface p-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-body text-sm font-semibold text-iv-ink">{w.name}</p>
                <span className="shrink-0 rounded-full border border-iv-accent/50 px-2 py-0.5 font-body text-[10px] text-iv-muted">{LABEL[w.attendance]}</span>
              </div>
              {w.message && <p className="mt-1 whitespace-pre-line font-body text-sm text-iv-ink/90">{w.message}</p>}
              <p suppressHydrationWarning className="mt-1 font-body text-[11px] text-iv-muted">{timeAgo(w.created_at)}</p>
            </li>
          ))}
        </ul>
        {shown < wishes.length && (
          <button type="button" onClick={() => setShown((s) => s + PAGE)} className="mt-3 w-full font-body text-sm text-iv-primary underline underline-offset-4">
            Tampilkan ucapan lain
          </button>
        )}
      </div>
    </div>
  );
}
