"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteInvitation, saveInvitation } from "@/app/admin/actions";
import { CoverArt } from "@/components/invitation/CoverArt";
import { PhoneFrame } from "@/components/store/PhoneFrame";
import type { GiftAccount, InvitationData, Person, StoryItem, WeddingEvent } from "@/lib/types";
import { formatDateDots, slugify, youtubeEmbed } from "@/lib/utils";
import { THEMES, getThemeOrDefault, themeKind, themeVars } from "@/themes/registry";
import { MediaField, uploadMedia } from "./MediaField";

export type EditorInitial = {
  id: string | null;
  slug: string;
  theme_id: string;
  is_published: boolean;
  order_id: string | null;
  data: InvitationData;
};

const EMPTY_EVENT: WeddingEvent = { title: "", date: "", timeStart: "", timeEnd: "", timezone: "WIB", venue: "", address: "", mapsUrl: "" };
const EMPTY_STORY: StoryItem = { title: "", date: "", text: "" };
const EMPTY_GIFT: GiftAccount = { bank: "", accountNumber: "", accountName: "" };

/* ---------- helper kecil untuk field ---------- */
function Text({ label, value, onChange, textarea, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-ink-soft">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="field" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field" />
      )}
    </label>
  );
}

function Section({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group rounded-xl border border-line bg-paper">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold">
        {title}
        <span className="text-moss transition-transform group-open:rotate-45" aria-hidden>+</span>
      </summary>
      <div className="space-y-4 border-t border-line px-5 py-5">{children}</div>
    </details>
  );
}

/** Daftar dinamis generik (acara, cerita, rekening). */
function ListEditor<T>({ items, onChange, empty, addLabel, render }: { items: T[]; onChange: (v: T[]) => void; empty: T; addLabel: string; render: (item: T, set: (patch: Partial<T>) => void, i: number) => React.ReactNode }) {
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="relative space-y-3 rounded-lg border border-line bg-porcelain/60 p-4">
          <div className="flex justify-end gap-2 text-xs">
            {i > 0 && (
              <button type="button" onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }} className="text-ink-soft underline">Naikkan</button>
            )}
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-700 underline">Hapus</button>
          </div>
          {render(it, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))), i)}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { ...empty }])} className="rounded-full border border-dashed border-ink-soft px-4 py-1.5 text-sm">
        {addLabel}
      </button>
    </div>
  );
}

/* ================================================================== */
export function InvitationEditor({ initial }: { initial: EditorInitial }) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [themeId, setThemeId] = useState(initial.theme_id);
  const [published, setPublished] = useState(initial.is_published);
  const [d, setD] = useState<InvitationData>(initial.data);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [pending, start] = useTransition();

  const theme = getThemeOrDefault(themeId);
  const folder = slug || "draft";

  const set = <K extends keyof InvitationData>(k: K, v: InvitationData[K]) => setD((x) => ({ ...x, [k]: v }));
  const setPerson = (who: "bride" | "groom", patch: Partial<Person>) => {
    const next = { ...d, [who]: { ...d[who], ...patch } };
    setD(next);
    // slug otomatis dari nama panggilan sampai admin mengubahnya manual
    if (!slugTouched && "nickname" in patch) setSlug(slugify(`${next.bride.nickname} ${next.groom.nickname}`));
  };

  async function addGalleryFiles(files: FileList | null) {
    if (!files?.length) return;
    setGalleryBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await uploadMedia(f, `${folder}/galeri`));
      set("gallery", [...d.gallery, ...urls]);
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    } finally {
      setGalleryBusy(false);
    }
  }

  function save() {
    setMsg(null);
    start(async () => {
      const res = await saveInvitation({ id: initial.id, slug, theme_id: themeId, is_published: published, order_id: initial.order_id, data: d });
      if (res.error) return setMsg({ type: "err", text: res.error });
      setMsg({ type: "ok", text: "Tersimpan." });
      if (!initial.id && res.id) router.replace(`/admin/undangan/${res.id}`);
      else router.refresh();
    });
  }

  const firstDate = d.events[0]?.date;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
      <div className="space-y-4">
        <Section title="Pengaturan" open>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">Tema</span>
              <select value={themeId} onChange={(e) => setThemeId(e.target.value)} className="field">
                {THEMES.map((t) => <option key={t.id} value={t.id}>{t.name} ({themeKind(t) === "non-foto" ? "Non Foto" : t.category})</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">Slug (alamat undangan)</span>
              <input value={slug} onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} className="field" placeholder="laras-bima" />
            </label>
          </div>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-moss" />
            <span className="text-sm">Publikasikan (undangan bisa dibuka tamu)</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={Boolean(d.groomFirst)} onChange={(e) => set("groomFirst", e.target.checked)} className="h-4 w-4 accent-moss" />
            <span className="text-sm">Tampilkan mempelai pria lebih dulu</span>
          </label>
        </Section>

        {(["bride", "groom"] as const).map((who) => (
          <Section key={who} title={who === "bride" ? "Mempelai wanita" : "Mempelai pria"} open={!initial.id}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Nama panggilan" value={d[who].nickname} onChange={(v) => setPerson(who, { nickname: v })} />
              <Text label="Instagram (tanpa @)" value={d[who].instagram ?? ""} onChange={(v) => setPerson(who, { instagram: v.replace(/^@/, "") })} />
            </div>
            <Text label="Nama lengkap & gelar" value={d[who].fullName} onChange={(v) => setPerson(who, { fullName: v })} />
            <Text label="Keterangan orang tua" value={d[who].parents} onChange={(v) => setPerson(who, { parents: v })} placeholder={who === "bride" ? "Putri pertama dari Bapak … & Ibu …" : "Putra kedua dari Bapak … & Ibu …"} />
            <MediaField label="Foto" folder={`${folder}/mempelai`} value={d[who].photo ?? ""} onChange={(v) => setPerson(who, { photo: v })} />
          </Section>
        ))}

        <Section title="Acara">
          <ListEditor
            items={d.events}
            onChange={(v) => set("events", v)}
            empty={{ ...EMPTY_EVENT, date: firstDate ?? "" }}
            addLabel="Tambah acara"
            render={(ev, s) => (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Text label="Nama acara" value={ev.title} onChange={(v) => s({ title: v })} placeholder="Akad Nikah" />
                  <Text label="Tanggal" type="date" value={ev.date} onChange={(v) => s({ date: v })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Text label="Mulai" value={ev.timeStart} onChange={(v) => s({ timeStart: v })} placeholder="08.00" />
                  <Text label="Selesai" value={ev.timeEnd ?? ""} onChange={(v) => s({ timeEnd: v })} placeholder="Selesai" />
                  <label className="block">
                    <span className="mb-1 block text-sm text-ink-soft">Zona</span>
                    <select value={ev.timezone} onChange={(e) => s({ timezone: e.target.value })} className="field">
                      <option>WIB</option><option>WITA</option><option>WIT</option>
                    </select>
                  </label>
                </div>
                <Text label="Tempat" value={ev.venue} onChange={(v) => s({ venue: v })} />
                <Text label="Alamat" value={ev.address} onChange={(v) => s({ address: v })} textarea />
                <Text label="Link Google Maps" value={ev.mapsUrl ?? ""} onChange={(v) => s({ mapsUrl: v })} placeholder="https://maps.app.goo.gl/…" />
              </>
            )}
          />
          <Text label="Link live streaming (opsional)" value={d.liveStreamUrl ?? ""} onChange={(v) => set("liveStreamUrl", v)} />
        </Section>

        <Section title="Teks pembuka, kutipan, penutup">
          <Text label="Salam pembuka" value={d.opening ?? ""} onChange={(v) => set("opening", v)} textarea />
          <Text label="Kutipan / ayat" value={d.quote?.text ?? ""} onChange={(v) => set("quote", { ...d.quote, text: v })} textarea />
          <Text label="Sumber kutipan" value={d.quote?.source ?? ""} onChange={(v) => set("quote", { text: d.quote?.text ?? "", source: v })} placeholder="QS. Ar-Rum: 21" />
          <Text label="Kalimat penutup" value={d.closing ?? ""} onChange={(v) => set("closing", v)} textarea />
        </Section>

        <Section title="Kisah cinta">
          <ListEditor
            items={d.stories}
            onChange={(v) => set("stories", v)}
            empty={EMPTY_STORY}
            addLabel="Tambah cerita"
            render={(st, s) => (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Text label="Judul" value={st.title} onChange={(v) => s({ title: v })} placeholder="Pertama bertemu" />
                  <Text label="Waktu" value={st.date ?? ""} onChange={(v) => s({ date: v })} placeholder="Agustus 2019" />
                </div>
                <Text label="Cerita" value={st.text} onChange={(v) => s({ text: v })} textarea />
                <MediaField label="Foto (opsional)" folder={`${folder}/cerita`} value={st.image ?? ""} onChange={(v) => s({ image: v })} />
              </>
            )}
          />
        </Section>

        <Section title={`Foto & musik (${d.gallery.length} foto galeri)`}>
          <MediaField label="Foto sampul" folder={`${folder}/sampul`} value={d.coverImage ?? ""} onChange={(v) => set("coverImage", v)} />
          <div>
            <span className="mb-1 block text-sm text-ink-soft">Galeri</span>
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {d.gallery.map((src, i) => (
                <li key={src + i} className="group relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="aspect-square w-full rounded object-cover" />
                  <button type="button" onClick={() => set("gallery", d.gallery.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-ink/80 px-1.5 text-xs text-paper" aria-label={`Hapus foto ${i + 1}`}>✕</button>
                </li>
              ))}
              <li>
                <label className="flex aspect-square cursor-pointer items-center justify-center rounded border border-dashed border-ink-soft text-center text-xs text-ink-soft">
                  {galleryBusy ? "Mengunggah…" : "Tambah foto"}
                  <input type="file" accept="image/*" multiple className="hidden" disabled={galleryBusy} onChange={(e) => { addGalleryFiles(e.target.files); e.target.value = ""; }} />
                </label>
              </li>
            </ul>
            <details className="mt-2 text-sm">
              <summary className="cursor-pointer text-ink-soft">Tempel URL foto (satu per baris)</summary>
              <textarea rows={4} value={d.gallery.join("\n")} onChange={(e) => set("gallery", e.target.value.split("\n"))} className="field mt-2 font-mono text-xs" />
            </details>
          </div>
          <MediaField label="Musik latar (mp3)" accept="audio/*" folder={`${folder}/musik`} value={d.music ?? ""} onChange={(v) => set("music", v)} />
          <Text label="Video prewedding (link YouTube)" value={d.video ?? ""} onChange={(v) => set("video", v)} placeholder="https://youtu.be/…" />
          {d.video && !youtubeEmbed(d.video) && <p className="text-xs text-red-700">Link belum dikenali sebagai video YouTube.</p>}
          {themeKind(theme) === "non-foto" && (
            <p className="rounded-lg bg-blush/50 px-3 py-2 text-sm">Tema {theme.name} adalah tema Non Foto: foto mempelai, sampul, dan galeri tidak ditampilkan di undangan. Video tetap tampil.</p>
          )}
        </Section>

        <Section title="Amplop digital">
          <ListEditor
            items={d.gifts}
            onChange={(v) => set("gifts", v)}
            empty={EMPTY_GIFT}
            addLabel="Tambah rekening / e-wallet"
            render={(g, s) => (
              <div className="grid gap-3 sm:grid-cols-3">
                <Text label="Bank / e-wallet" value={g.bank} onChange={(v) => s({ bank: v })} placeholder="BCA" />
                <Text label="Nomor" value={g.accountNumber} onChange={(v) => s({ accountNumber: v.replace(/\s/g, "") })} />
                <Text label="Atas nama" value={g.accountName} onChange={(v) => s({ accountName: v })} />
              </div>
            )}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Text label="Penerima kado fisik" value={d.giftAddress?.recipient ?? ""} onChange={(v) => set("giftAddress", { address: d.giftAddress?.address ?? "", recipient: v })} />
            <Text label="Alamat kirim kado" value={d.giftAddress?.address ?? ""} onChange={(v) => set("giftAddress", { recipient: d.giftAddress?.recipient ?? "", address: v })} />
          </div>
        </Section>
      </div>

      {/* ---------- Panel kanan: pratinjau + simpan ---------- */}
      <aside>
        <div className="space-y-4 lg:sticky lg:top-6">
          <div className="mx-auto w-52 lg:w-full">
            <PhoneFrame>
              <div style={themeVars(theme)} className="h-full w-full">
                <CoverArt theme={theme} data={d} dateLabel={firstDate ? formatDateDots(firstDate) : "– . – . –"} />
              </div>
            </PhoneFrame>
          </div>
          {msg && <p role="status" className={`rounded-lg px-3 py-2 text-sm ${msg.type === "ok" ? "bg-moss/10 text-moss" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
          <button type="button" onClick={save} disabled={pending || galleryBusy} className="w-full rounded-full bg-moss py-3 text-paper disabled:opacity-60">
            {pending ? "Menyimpan…" : initial.id ? "Simpan perubahan" : "Simpan undangan"}
          </button>
          {initial.id && (
            <div className="flex flex-col gap-2 text-center text-sm">
              <Link href={`/${initial.slug}?to=Tamu%20Undangan`} target="_blank" className="rounded-full border border-line py-2">Buka undangan</Link>
              <Link href={`/admin/undangan/${initial.id}/tamu`} className="rounded-full border border-line py-2">Tamu & RSVP</Link>
              <button
                type="button"
                onClick={() => { if (confirm("Hapus undangan ini beserta semua RSVP-nya? Tindakan ini tidak bisa dibatalkan.")) start(() => deleteInvitation(initial.id!)); }}
                className="py-2 text-red-700 underline underline-offset-4"
              >
                Hapus undangan
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
