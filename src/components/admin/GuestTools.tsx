"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteRsvp } from "@/app/admin/actions";
import type { Rsvp } from "@/lib/types";

const DEFAULT_TEMPLATE = `Assalamu'alaikum Wr. Wb.
Kepada Yth. {nama}

Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.

Detail acara dapat dilihat melalui link berikut:
{link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
{mempelai}`;

type Props = { baseUrl: string; couple: string; invitationId: string; rsvps: Rsvp[] };

export function GuestTools({ baseUrl, couple, invitationId, rsvps }: Props) {
  const [names, setNames] = useState("");
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const guests = useMemo(
    () =>
      names
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean)
        .map((name) => {
          const link = `${baseUrl}?to=${encodeURIComponent(name)}`;
          const text = template.replaceAll("{nama}", name).replaceAll("{link}", link).replaceAll("{mempelai}", couple);
          return { name, link, text };
        }),
    [names, template, baseUrl, couple],
  );

  async function copy(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  function exportCsv() {
    const esc = (v: string | number | null) => `"${String(v ?? "").replaceAll('"', '""')}"`;
    const rows = [["Nama", "Kehadiran", "Jumlah", "Ucapan", "Waktu"], ...rsvps.map((r) => [r.name, r.attendance, r.guests, r.message, new Date(r.created_at).toLocaleString("id-ID")])];
    // BOM agar Excel membaca UTF-8 dengan benar
    const blob = new Blob(["﻿" + rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rsvp-${couple.replace(/\W+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const totals = rsvps.reduce(
    (t, r) => ({ ...t, [r.attendance]: t[r.attendance] + 1, people: t.people + (r.attendance === "hadir" ? r.guests : 0) }),
    { hadir: 0, tidak: 0, ragu: 0, people: 0 },
  );

  return (
    <div className="space-y-14">
      {/* ---------------- Link tamu ---------------- */}
      <section>
        <h2 className="font-serif-display text-2xl">Link per tamu</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Tempel daftar nama tamu, satu per baris. Setiap nama mendapat link sendiri dan teks pengantar siap kirim. Placeholder yang tersedia: {"{nama}"}, {"{link}"}, {"{mempelai}"}.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">Nama tamu</span>
            <textarea rows={10} value={names} onChange={(e) => setNames(e.target.value)} placeholder={"Bapak Budi & Keluarga\nIbu Sari\nRekan Kantor"} className="field" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">Teks pengantar</span>
            <textarea rows={10} value={template} onChange={(e) => setTemplate(e.target.value)} className="field" />
          </label>
        </div>

        {guests.length > 0 && (
          <>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-soft">{guests.length} tamu</p>
              <button type="button" onClick={() => copy("all", guests.map((g) => `${g.name}\n${g.link}`).join("\n\n"))} className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm">
                {copied === "all" ? "Tersalin" : "Salin semua link"}
              </button>
            </div>
            <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-paper">
              {guests.map((g, i) => (
                <li key={i} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">{g.name}</p>
                    <p className="truncate text-xs text-ink-soft">{g.link}</p>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <button type="button" onClick={() => copy(`t${i}`, g.text)} className="rounded-full border border-line px-3 py-1">
                      {copied === `t${i}` ? "Tersalin" : "Salin teks"}
                    </button>
                    <a href={`https://wa.me/?text=${encodeURIComponent(g.text)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-moss px-3 py-1 text-paper">
                      Kirim WA
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* ---------------- RSVP ---------------- */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif-display text-2xl">RSVP & ucapan</h2>
            <p className="mt-2 text-sm text-ink-soft">
              {totals.hadir} hadir ({totals.people} orang), {totals.ragu} masih ragu, {totals.tidak} tidak hadir.
            </p>
          </div>
          <button type="button" onClick={exportCsv} disabled={!rsvps.length} className="rounded-full bg-ink px-4 py-2 text-sm text-paper disabled:opacity-50">
            Unduh CSV
          </button>
        </div>

        {rsvps.length === 0 ? (
          <p className="mt-8 text-ink-soft">Belum ada RSVP. Konfirmasi tamu akan muncul di sini begitu mereka mengisi formulir di undangan.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-line text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Kehadiran</th>
                  <th className="px-4 py-3 font-medium">Jumlah</th>
                  <th className="px-4 py-3 font-medium">Ucapan</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rsvps.map((r) => (
                  <tr key={r.id} className="align-top">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 capitalize">{r.attendance}</td>
                    <td className="px-4 py-3">{r.guests}</td>
                    <td className="max-w-sm px-4 py-3 text-ink-soft">{r.message}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => { if (confirm(`Hapus ucapan dari ${r.name}?`)) start(() => deleteRsvp(r.id, invitationId)); }}
                        className="text-xs text-red-700 underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
