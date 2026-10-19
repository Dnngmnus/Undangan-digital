"use client";

import { useEffect, useRef, useState } from "react";
import type { Theme } from "@/themes/registry";
import { themeKind, themeVars } from "@/themes/registry";
import type { InvitationData, Person, Rsvp, WeddingEvent } from "@/lib/types";
import { formatDateDots, formatDateLong, youtubeEmbed } from "@/lib/utils";
import { CoverArt } from "./CoverArt";
import { Corners, Divider, PatternBg } from "./Ornament";
import { BottomNav, CopyButton, Countdown, Gallery, MusicToggle, useReveal } from "./interactive";
import { FxLayer, KenBurns, MarqueeRows, ScrollHint, motionPhotos } from "./Motion";
import { RsvpWishes } from "./RsvpWishes";

type Props = {
  theme: Theme;
  data: InvitationData;
  eventDate: string; // ISO datetime untuk countdown
  guestName: string;
  invitationId: string | null; // null = preview/demo
  wishes: Rsvp[];
  brandName: string;
};

const TZ: Record<string, string> = { WIB: "Asia/Jakarta", WITA: "Asia/Makassar", WIT: "Asia/Jayapura" };

/** Link "Simpan ke Google Calendar" untuk satu acara. */
function calendarUrl(ev: WeddingEvent, couple: string) {
  const d = ev.date.replace(/-/g, "");
  const t = (s?: string) => (s && /^\d{1,2}[.:]\d{2}$/.test(s) ? s.replace(/[.:]/, "").padStart(4, "0") + "00" : null);
  const start = t(ev.timeStart) ?? "080000";
  const end = t(ev.timeEnd) ?? String(Math.min(23, +start.slice(0, 2) + 2)).padStart(2, "0") + start.slice(2);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `${ev.title} ${couple}`,
    dates: `${d}T${start}/${d}T${end}`,
    ctz: TZ[ev.timezone] ?? "Asia/Jakarta",
    location: `${ev.venue}, ${ev.address}`,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/** Tema Non Foto: hilangkan semua foto agar seluruh section otomatis tampil versi tipografis. */
function stripPhotos(d: InvitationData): InvitationData {
  return {
    ...d,
    coverImage: undefined,
    gallery: [],
    bride: { ...d.bride, photo: undefined },
    groom: { ...d.groom, photo: undefined },
    stories: d.stories.map((st) => ({ ...st, image: undefined })),
  };
}

function SectionTitle({ title, theme, children }: { title: string; theme: Theme; children?: React.ReactNode }) {
  return (
    <div className="reveal mb-8 text-center">
      <h2 className="font-script text-5xl leading-tight text-iv-primary">{title}</h2>
      <Divider kind={theme.ornament} className="mt-1 text-iv-accent" />
      {children && <p className="mx-auto mt-3 max-w-xs font-body text-sm leading-relaxed text-iv-muted">{children}</p>}
    </div>
  );
}

function PersonCard({ p, theme, reveal = "" }: { p: Person; theme: Theme; reveal?: string }) {
  return (
    <div className={`reveal ${reveal} text-center`}>
      <div className="relative mx-auto w-40">
        <div className={`absolute -inset-2 border border-iv-accent ${theme.cover === "arch" ? "arch-mask" : "rounded-full"}`} />
        {p.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo} alt={p.nickname} className={`aspect-[3/4] w-full object-cover ${theme.cover === "arch" ? "arch-mask" : "rounded-full !aspect-square"}`} />
        ) : (
          <div className={`flex aspect-square w-full items-center justify-center bg-iv-surface font-script text-5xl text-iv-primary ${theme.cover === "arch" ? "arch-mask" : "rounded-full"}`}>
            {p.nickname.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="mt-6 font-script text-5xl text-iv-primary">{p.nickname}</h3>
      <p className="mt-2 font-display text-lg text-iv-ink">{p.fullName}</p>
      <p className="mx-auto mt-2 max-w-[17rem] font-body text-sm leading-relaxed text-iv-muted">{p.parents}</p>
      {p.instagram && (
        <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-full border border-iv-accent px-4 py-1 font-body text-xs text-iv-primary">
          @{p.instagram}
        </a>
      )}
    </div>
  );
}

export function InvitationView({ theme, data: rawData, eventDate, guestName, invitationId, wishes, brandName }: Props) {
  const data = themeKind(theme) === "non-foto" ? stripPhotos(rawData) : rawData;
  const video = data.video ? youtubeEmbed(data.video) : null;
  const coverPhoto = data.coverImage || data.gallery[0];
  const [opened, setOpened] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  useReveal(mainRef, opened);

  const [first, second] = data.groomFirst ? [data.groom, data.bride] : [data.bride, data.groom];
  const couple = `${first.nickname} & ${second.nickname}`;
  const dateIso = eventDate.slice(0, 10);

  // kunci scroll selama gerbang tertutup
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  function open() {
    setLeaving(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    setTimeout(() => setOpened(true), 1000);
  }

  function toggleMusic() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  }

  const nav = [
    { id: "mempelai", label: "Mempelai" },
    { id: "acara", label: "Acara" },
    (data.gallery.length > 0 || video) && { id: "galeri", label: "Galeri" },
    (data.gifts.length > 0 || data.giftAddress) && { id: "hadiah", label: "Hadiah" },
    { id: "ucapan", label: "Ucapan" },
  ].filter(Boolean) as { id: string; label: string }[];

  const section = "relative overflow-hidden px-6 py-20";

  return (
    <div style={themeVars(theme)} className="min-h-screen bg-iv-bg font-body text-iv-ink">
      {data.music && <audio ref={audioRef} src={data.music} loop preload="none" />}

      {/* ---------------- Gerbang / sampul ---------------- */}
      {!opened && (
        <div className={`fixed inset-0 z-50 ${leaving ? (theme.motion ? "gate-leaving-motion" : "gate-leaving") : ""}`}>
          <CoverArt theme={theme} data={data} dateLabel={formatDateDots(dateIso)}>
            <div className="mt-8">
              <p className="font-body text-xs text-iv-muted">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="mt-1 font-display text-2xl text-iv-ink">{guestName || "Tamu Undangan"}</p>
              <button type="button" onClick={open} disabled={leaving} className={`mt-5 rounded-full bg-iv-primary px-7 py-3 font-body text-sm text-iv-on-primary shadow-md ${theme.motion ? "mo-pulse" : ""}`}>
                Buka undangan
              </button>
            </div>
          </CoverArt>
        </div>
      )}

      {/* Tema motion: partikel (kelopak/kilau/daun) melayang di atas seluruh halaman setelah undangan dibuka */}
      {theme.motion && opened && <FxLayer fx={theme.motion.fx} count={10} fixed />}

      <div className="lg:flex">
        {/* -------- Panel kiri desktop: sampul tetap -------- */}
        <aside className="relative hidden h-screen flex-1 overflow-hidden lg:sticky lg:top-0 lg:block" aria-hidden>
          {coverPhoto ? (
            <>
              {theme.motion ? (
                <KenBurns photos={motionPhotos(data, 4)} step={7} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPhoto} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {theme.motion && <FxLayer fx={theme.motion.fx} count={14} />}
            </>
          ) : (
            <div className="absolute inset-0 bg-iv-surface">
              <PatternBg kind={theme.ornament} opacity={0.12} />
              <Corners kind={theme.ornament} className="!h-40 !w-40 text-iv-accent" />
            </div>
          )}
          <div className={`absolute bottom-16 left-16 ${coverPhoto ? "text-white" : "text-iv-primary"}`}>
            <p className="font-display text-sm tracking-[0.3em] opacity-80">The Wedding of</p>
            <p className="mt-2 font-script text-7xl">{couple}</p>
            <p className="mt-2 font-display text-lg tracking-widest">{formatDateDots(dateIso)}</p>
          </div>
        </aside>

        {/* -------- Kolom undangan -------- */}
        <main ref={mainRef} className="relative mx-auto w-full max-w-[30rem] pb-24 lg:mx-0 lg:w-[30rem] lg:shrink-0">
          {/* Hero */}
          {theme.motion ? (
            // Tema motion: hero memakai sampul bergerak yang sama; dirender saat gerbang mulai terbuka agar animasi teks terlihat
            <section className="relative h-[100svh] overflow-hidden">
              {(leaving || opened) && <CoverArt theme={theme} data={data} dateLabel={formatDateDots(dateIso)} />}
              <ScrollHint />
            </section>
          ) : (
          <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
            <PatternBg kind={theme.ornament} />
            <Corners kind={theme.ornament} className="text-iv-accent" />
            <p className="reveal font-display text-sm tracking-[0.3em] text-iv-muted">The Wedding of</p>
            <h1 className="reveal mt-4 font-script text-7xl leading-[1.05] text-iv-primary">
              {first.nickname}
              <span className="block font-display text-3xl italic text-iv-accent">&</span>
              {second.nickname}
            </h1>
            <p className="reveal mt-6 font-display text-xl tracking-widest">{formatDateDots(dateIso)}</p>
          </section>
          )}

          {/* Kutipan */}
          {data.quote && (
            <section className={`${section} bg-iv-surface text-center`}>
              <Divider kind={theme.ornament} className="reveal text-iv-accent" />
              <blockquote className="reveal mx-auto mt-6 max-w-sm font-display text-lg italic leading-relaxed">“{data.quote.text}”</blockquote>
              {data.quote.source && <p className="reveal mt-4 font-body text-sm text-iv-primary">{data.quote.source}</p>}
            </section>
          )}

          {/* Mempelai */}
          <section id="mempelai" className={section}>
            <SectionTitle title="Bride & Groom" theme={theme}>{data.opening}</SectionTitle>
            <PersonCard p={first} theme={theme} reveal={theme.motion ? "reveal-left" : ""} />
            <p className="reveal my-10 text-center font-script text-6xl text-iv-accent">&</p>
            <PersonCard p={second} theme={theme} reveal={theme.motion ? "reveal-right" : ""} />
          </section>

          {/* Countdown */}
          <section className={`${section} bg-iv-surface text-center`}>
            <SectionTitle title="Menghitung Hari" theme={theme} />
            <div className="reveal"><Countdown target={eventDate} /></div>
            {data.events[0] && (
              <a href={calendarUrl(data.events[0], couple)} target="_blank" rel="noopener noreferrer" className="reveal mt-6 inline-block rounded-full border border-iv-primary px-5 py-2 font-body text-sm text-iv-primary">
                Simpan ke kalender
              </a>
            )}
          </section>

          {/* Acara */}
          <section id="acara" className={section}>
            <SectionTitle title="Rangkaian Acara" theme={theme}>Dengan memohon rahmat Tuhan, acara akan dilaksanakan pada:</SectionTitle>
            <div className="space-y-6">
              {data.events.map((ev, i) => (
                <article key={i} className={`reveal ${theme.motion ? "reveal-zoom" : ""} relative overflow-hidden rounded-2xl border border-iv-accent/50 bg-iv-surface px-6 py-8 text-center`}>
                  <Corners kind={theme.ornament} className="!h-16 !w-16 text-iv-accent/70" />
                  <h3 className="font-script text-4xl text-iv-primary">{ev.title}</h3>
                  <p className="mt-3 font-display text-lg capitalize">{formatDateLong(ev.date)}</p>
                  <p className="mt-1 font-body text-sm">
                    Pukul {ev.timeStart}{ev.timeEnd ? ` – ${ev.timeEnd}` : ""} {ev.timezone}
                  </p>
                  <div className="mx-auto my-4 h-px w-12 bg-iv-accent" />
                  <p className="font-display text-base font-semibold">{ev.venue}</p>
                  <p className="mx-auto mt-1 max-w-xs font-body text-sm leading-relaxed text-iv-muted">{ev.address}</p>
                  {ev.mapsUrl && (
                    <a href={ev.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-full bg-iv-primary px-5 py-2 font-body text-sm text-iv-on-primary">
                      Buka Google Maps
                    </a>
                  )}
                </article>
              ))}
            </div>
            {data.liveStreamUrl && (
              <a href={data.liveStreamUrl} target="_blank" rel="noopener noreferrer" className="reveal mt-6 block rounded-xl border border-iv-primary py-3 text-center font-body text-sm text-iv-primary">
                Tonton siaran langsung
              </a>
            )}
          </section>

          {/* Love story */}
          {data.stories.length > 0 && (
            <section id="cerita" className={`${section} bg-iv-surface`}>
              <SectionTitle title="Kisah Kami" theme={theme} />
              <ol className="relative ml-3 border-l border-iv-accent/60">
                {data.stories.map((s, i) => (
                  <li key={i} className="reveal relative mb-10 pl-6 last:mb-0">
                    <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-iv-surface bg-iv-primary" />
                    {s.date && <p className="font-body text-xs text-iv-muted">{s.date}</p>}
                    <h3 className="font-display text-xl text-iv-primary">{s.title}</h3>
                    {s.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt="" loading="lazy" className="mt-3 w-full rounded-lg object-cover" />
                    )}
                    <p className="mt-2 font-body text-sm leading-relaxed">{s.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Galeri */}
          {(data.gallery.length > 0 || video) && (
            <section id="galeri" className={section}>
              <SectionTitle title="Galeri" theme={theme} />
              {video && (
                <div className="reveal mb-4 aspect-video overflow-hidden rounded-lg border border-iv-accent/50">
                  <iframe
                    src={video}
                    title="Video prewedding"
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {theme.motion && <MarqueeRows images={data.gallery} />}
              {data.gallery.length > 0 && <Gallery images={data.gallery} />}
            </section>
          )}

          {/* Hadiah */}
          {(data.gifts.length > 0 || data.giftAddress) && (
            <section id="hadiah" className={`${section} bg-iv-surface`}>
              <SectionTitle title="Tanda Kasih" theme={theme}>
                Doa restu Anda adalah karunia terbesar bagi kami. Bila ingin memberi tanda kasih, dapat melalui:
              </SectionTitle>
              <div className="space-y-4">
                {data.gifts.map((g, i) => (
                  <div key={i} className="reveal rounded-xl border border-iv-accent/50 bg-iv-bg p-5 text-center">
                    <p className="font-display text-lg font-semibold text-iv-primary">{g.bank}</p>
                    <p className="mt-2 font-body text-xl tracking-wider tabular-nums">{g.accountNumber}</p>
                    <p className="mt-1 font-body text-sm text-iv-muted">a.n. {g.accountName}</p>
                    <div className="mt-4"><CopyButton value={g.accountNumber} label="Salin nomor" /></div>
                  </div>
                ))}
                {data.giftAddress && (
                  <div className="reveal rounded-xl border border-iv-accent/50 bg-iv-bg p-5 text-center">
                    <p className="font-display text-lg font-semibold text-iv-primary">Kirim kado</p>
                    <p className="mt-2 font-body text-sm">{data.giftAddress.recipient}</p>
                    <p className="mt-1 font-body text-sm leading-relaxed text-iv-muted">{data.giftAddress.address}</p>
                    <div className="mt-4"><CopyButton value={`${data.giftAddress.recipient}, ${data.giftAddress.address}`} label="Salin alamat" /></div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* RSVP & ucapan */}
          <section id="ucapan" className={section}>
            <SectionTitle title="Ucapan & Doa" theme={theme}>Mohon konfirmasi kehadiran dan kirimkan doa terbaik untuk kami.</SectionTitle>
            <RsvpWishes invitationId={invitationId} guestName={guestName} initial={wishes} />
          </section>

          {/* Penutup */}
          <section className={`${section} bg-iv-surface pb-28 text-center`}>
            <PatternBg kind={theme.ornament} />
            <Corners kind={theme.ornament} className="text-iv-accent" />
            <p className="reveal mx-auto max-w-sm font-body text-sm leading-relaxed">{data.closing}</p>
            <p className="reveal mt-6 font-body text-sm text-iv-muted">Kami yang berbahagia,</p>
            <p className="reveal mt-2 font-script text-6xl text-iv-primary">{couple}</p>
            <p className="mt-16 font-body text-[11px] text-iv-muted">Dibuat dengan {brandName}</p>
          </section>
        </main>
      </div>

      {opened && (
        <>
          <BottomNav items={nav} />
          {data.music && <MusicToggle playing={playing} onToggle={toggleMusic} />}
        </>
      )}
    </div>
  );
}
