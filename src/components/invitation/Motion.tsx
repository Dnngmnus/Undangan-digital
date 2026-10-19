import type { CSSProperties } from "react";
import type { InvitationData } from "@/lib/types";
import type { MotionFx } from "@/themes/registry";

/**
 * Komponen gerak untuk Tema Motion.
 * Semuanya murni CSS (keyframes di globals.css) — tanpa state/JS — sehingga:
 *  - aman dipakai di Server Component (CoverArt) dan di thumbnail katalog,
 *  - ringan di ponsel, dan otomatis berhenti bila pengguna memilih "reduce motion".
 */

/** Helper agar CSS variable (--x) lolos type-check di atribut style. */
export const cssVars = (o: Record<string, string | number>) => o as CSSProperties;

/** Foto untuk animasi: cover + galeri tanpa duplikat, diulang sampai berjumlah `n`. Kosong bila tidak ada foto. */
export function motionPhotos(data: InvitationData, n: number): string[] {
  const pool = [...new Set([data.coverImage, ...data.gallery].filter((x): x is string => !!x))];
  if (pool.length === 0) return [];
  return Array.from({ length: n }, (_, i) => pool[i % pool.length]);
}

/* ------------------------------------------------------------------ */
/* Ken Burns: slideshow 4 foto, crossfade + zoom perlahan              */
/* ------------------------------------------------------------------ */
const KB_DRIFT: [string, string][] = [["-2%", "-1.5%"], ["2%", "-1%"], ["-1.5%", "1.5%"], ["1.5%", "1%"]];

export function KenBurns({ photos, step = 6, tone = "" }: { photos: string[]; step?: number; tone?: string }) {
  if (photos.length === 0) return null;
  const layers = photos.slice(0, 4);
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* lapisan dasar: foto pertama selalu terlihat sebelum animasi mulai / bila animasi dimatikan */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={layers[0]} alt="" className={`absolute inset-0 h-full w-full object-cover ${tone}`} />
      {layers.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt=""
          loading={i === 0 ? "eager" : "lazy"}
          className={`mo-kb absolute inset-0 h-full w-full object-cover ${tone}`}
          style={{
            ...cssVars({ "--dx": KB_DRIFT[i % 4][0], "--dy": KB_DRIFT[i % 4][1] }),
            animationDuration: `${step * 4}s`,
            animationDelay: `${i * step}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Partikel melayang: kelopak, daun, kilau, bokeh                      */
/* ------------------------------------------------------------------ */
// Pengacak deterministik (aritmetika bilangan bulat) → HTML server & klien identik, tanpa hydration mismatch.
const lcg = (seed: number) => () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;

const FX_SIZE: Record<MotionFx, [number, number]> = {
  petals: [9, 15],
  leaves: [11, 18],
  sparkle: [3, 7],
  bokeh: [22, 56],
};

export function FxLayer({ fx, count = 12, fixed = false }: { fx: MotionFx; count?: number; fixed?: boolean }) {
  const rnd = lcg(11 + count);
  const [min, max] = FX_SIZE[fx];
  const items = Array.from({ length: count }, () => ({
    left: rnd() * 96,
    size: min + rnd() * (max - min),
    dur: (fx === "sparkle" ? 7 : 11) + rnd() * 9,
    delay: -rnd() * 20,
    drift: (rnd() - 0.5) * 140,
    rot: rnd() * 360,
  }));
  return (
    <div className={`pointer-events-none inset-0 overflow-hidden ${fixed ? "fixed z-30" : "absolute"}`} aria-hidden>
      {items.map((p, i) => (
        // pembungkus setinggi layar yang bergerak; isi (span) menempel di atas dan berputar sendiri
        <div
          key={i}
          className={`mo-fx mo-fx-${fx}`}
          style={{
            left: `${p.left.toFixed(1)}%`,
            width: `${p.size.toFixed(1)}px`,
            animationDuration: `${p.dur.toFixed(1)}s`,
            animationDelay: `${p.delay.toFixed(1)}s`,
            ...cssVars({ "--drift": `${p.drift.toFixed(0)}px`, "--rot": `${p.rot.toFixed(0)}deg` }),
          }}
        >
          <span className="mo-fx-dot" style={{ height: `${p.size.toFixed(1)}px` }} />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reel: tiga kolom foto bergulir berlawanan arah                      */
/* ------------------------------------------------------------------ */
export function ReelColumns({ data, tone = "" }: { data: InvitationData; tone?: string }) {
  const pool = motionPhotos(data, 9);
  if (pool.length === 0) return null;
  return (
    <div className="absolute -inset-[12%] flex -rotate-6 gap-2" aria-hidden>
      {[0, 1, 2].map((c) => {
        // satu salinan harus lebih tinggi dari layar di semua fase, jadi 3 foto dilipatgandakan jadi 6
        const base = pool.slice(c * 3, c * 3 + 3);
        const imgs = [...base, ...base];
        return (
          <div key={c} className="relative flex-1 overflow-hidden">
            {/* dua salinan + pb-2 (= gap) agar loop -50% mulus tanpa loncatan */}
            <div className={`mo-reel flex flex-col gap-2 pb-2 ${c === 1 ? "mo-reel-rev" : ""}`} style={{ animationDuration: `${28 + c * 7}s` }}>
              {[...imgs, ...imgs].map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" loading="lazy" className={`aspect-[3/4] w-full rounded-xl object-cover ${tone}`} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stack: tumpukan polaroid, kartu teratas terbang keluar bergantian   */
/* ------------------------------------------------------------------ */
export function PhotoStack({ data, caption, step = 3.2, tone = "" }: { data: InvitationData; caption: string; step?: number; tone?: string }) {
  const photos = motionPhotos(data, 4);
  const cycle = step * 4;
  // fase awal tiap kartu agar saat dimuat tampak sudah bertumpuk: atas, ke-2, ke-3, ke-4
  const phase = [0, 0.75, 0.5, 0.25];
  return (
    <div className="relative isolate mt-6 h-[20rem] w-52 @md:h-[23rem] @md:w-60" aria-hidden>
      {phase.map((p, k) => (
        <div
          key={k}
          className="mo-card absolute inset-x-0 top-0 bg-white p-3 pb-4 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.45)]"
          style={{ animationDuration: `${cycle}s`, animationDelay: `${(-p * cycle).toFixed(2)}s` }}
        >
          {photos[k] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photos[k]} alt="" loading={k === 0 ? "eager" : "lazy"} className={`aspect-square w-full object-cover ${tone}`} />
          ) : (
            <div className="aspect-square w-full bg-iv-surface" />
          )}
          <p className="mt-3 text-center font-script text-3xl leading-none text-[#2b2b2b]">{caption}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Teks muncul huruf demi huruf                                        */
/* ------------------------------------------------------------------ */
export function SplitText({ text, delay = 0, step = 0.07, className = "" }: { text: string; delay?: number; step?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden className="mo-char" style={{ animationDelay: `${(delay + i * step).toFixed(2)}s` }}>
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Galeri berjalan (dua baris, arah berlawanan)                        */
/* ------------------------------------------------------------------ */
export function MarqueeRows({ images }: { images: string[] }) {
  if (images.length < 2) return null;
  const rows = [images.filter((_, i) => i % 2 === 0), images.filter((_, i) => i % 2 === 1)];
  return (
    <div className="reveal -mx-6 mb-6 space-y-3 overflow-hidden" aria-hidden>
      {rows.map((row, r) => {
        // ulangi sampai cukup panjang menutupi layar, lalu gandakan untuk loop -50%
        const loop = Array.from({ length: row.length * Math.ceil(8 / row.length) }, (_, i) => row[i % row.length]);
        return (
          <div key={r} className="overflow-hidden">
            <div className={`mo-marquee flex w-max gap-3 pr-3 ${r === 1 ? "mo-marquee-rev" : ""}`} style={{ animationDuration: `${26 + r * 8}s` }}>
              {[...loop, ...loop].map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" loading="lazy" className="h-40 w-32 shrink-0 rounded-xl object-cover" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Petunjuk "geser ke bawah" di hero. */
export function ScrollHint() {
  return (
    <div className="mo-bounce pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-1 text-iv-primary" aria-hidden>
      <span className="font-body text-[10px] tracking-[0.35em]">GESER</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
