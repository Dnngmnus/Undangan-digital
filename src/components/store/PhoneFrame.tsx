"use client";

import { useEffect, useRef, useState } from "react";

const BASE_W = 390; // lebar viewport ponsel acuan
const BASE_H = 780;

/**
 * Merender children pada kanvas 390×780 lalu menskalakannya agar pas di lebar wadah.
 * Dipakai untuk thumbnail tema: yang tampil adalah sampul asli, bukan screenshot.
 */
export function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / BASE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`rounded-[2.2rem] bg-ink p-2 shadow-[0_24px_48px_-24px_rgba(30,38,35,0.55)] ${className}`}>
      <div ref={ref} className="relative overflow-hidden rounded-[1.7rem]" style={{ aspectRatio: `${BASE_W} / ${BASE_H}` }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
