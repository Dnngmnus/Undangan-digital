"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Reveal: tambahkan .is-visible ke setiap .reveal yang masuk viewport */
/* ------------------------------------------------------------------ */
export function useReveal(root: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !root.current) return;
    const els = root.current.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root, enabled]);
}

/* ------------------------------------------------------------------ */
/* Countdown                                                           */
/* ------------------------------------------------------------------ */
export function Countdown({ target }: { target: string }) {
  // null sampai mount → hindari hydration mismatch (waktu server ≠ klien)
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, t - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const s = Math.floor((left ?? 0) / 1000);
  const units = [
    { v: Math.floor(s / 86400), l: "Hari" },
    { v: Math.floor((s % 86400) / 3600), l: "Jam" },
    { v: Math.floor((s % 3600) / 60), l: "Menit" },
    { v: s % 60, l: "Detik" },
  ];

  if (left === 0) {
    return <p className="font-display text-xl text-iv-primary">Hari bahagia telah tiba</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-2" role="timer" aria-live="off">
      {units.map((u) => (
        <div key={u.l} className="rounded-lg border border-iv-accent/50 bg-iv-surface py-3">
          <div className="font-display text-3xl tabular-nums text-iv-primary">
            {left === null ? "–" : String(u.v).padStart(2, "0")}
          </div>
          <div className="mt-1 font-body text-xs text-iv-muted">{u.l}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Galeri + lightbox                                                   */
/* ------------------------------------------------------------------ */
export function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  return (
    <>
      {/* masonry sederhana via CSS columns: foto potret & lanskap tetap proporsional */}
      <div className="columns-2 gap-2 [&>*]:mb-2">
        {images.map((src, i) => (
          <button key={src + i} type="button" onClick={() => setOpen(i)} className="reveal block w-full overflow-hidden rounded-md" aria-label={`Buka foto ${i + 1}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="w-full transition-transform duration-500 hover:scale-105" />
          </button>
        ))}
      </div>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label="Galeri foto" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[open]} alt="" className="max-h-[85vh] max-w-full rounded" onClick={(e) => e.stopPropagation()} />
          <button type="button" onClick={close} className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-white" aria-label="Tutup">✕</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-2xl text-white" aria-label="Sebelumnya">‹</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-2xl text-white" aria-label="Berikutnya">›</button>
          <p className="absolute bottom-4 text-sm text-white/70">{open + 1} / {images.length}</p>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tombol salin                                                        */
/* ------------------------------------------------------------------ */
export function CopyButton({ value, label = "Salin" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // fallback untuk browser in-app (Instagram/WA) yang memblokir Clipboard API
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }
  return (
    <button type="button" onClick={copy} className="rounded-full bg-iv-primary px-4 py-1.5 font-body text-sm text-iv-on-primary">
      {done ? "Tersalin" : label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Musik latar                                                         */
/* ------------------------------------------------------------------ */
export function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Jeda musik" : "Putar musik"}
      className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-iv-accent bg-iv-surface text-iv-primary shadow-lg"
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${playing ? "spin-slow" : ""}`} fill="currentColor" aria-hidden>
        {playing ? (
          <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
        ) : (
          <path d="M8 5v14l11-7z" />
        )}
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Navigasi bawah                                                      */
/* ------------------------------------------------------------------ */
const NAV_ICONS: Record<string, string> = {
  mempelai: "M12 21s-7-4.4-9.3-9A5.3 5.3 0 0 1 12 6.3 5.3 5.3 0 0 1 21.3 12C19 16.6 12 21 12 21Z",
  acara: "M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z",
  galeri: "M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15.5 9.5h.01",
  hadiah: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1Zm0 0c1.5-3 5-3 5-1s-3 1-5 1Z",
  ucapan: "M4 5h16v11H8l-4 4z",
};

export function BottomNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const lock = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (lock.current) return;
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(vis.target.id);
      },
      { threshold: [0.25, 0.5] },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  function go(id: string) {
    lock.current = true;
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => (lock.current = false), 900);
  }

  return (
    <nav aria-label="Navigasi undangan" className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[calc(100%-1.5rem)] max-w-[26rem] justify-around rounded-full border border-iv-accent/40 bg-iv-surface/90 px-2 py-1.5 shadow-lg backdrop-blur lg:inset-x-auto lg:right-3 lg:w-[28.5rem]">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => go(it.id)}
          aria-current={active === it.id ? "true" : undefined}
          className={`flex flex-col items-center rounded-full px-2 py-1 font-body text-[10px] transition-colors ${active === it.id ? "text-iv-primary" : "text-iv-muted"}`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={NAV_ICONS[it.id] ?? NAV_ICONS.ucapan} />
          </svg>
          {it.label}
        </button>
      ))}
    </nav>
  );
}
