"use client";

import { useEffect, useState } from "react";
import { CoverArt } from "@/components/invitation/CoverArt";
import type { InvitationData } from "@/lib/types";
import { THEMES, themeVars, type Theme } from "@/themes/registry";
import { PhoneFrame } from "./PhoneFrame";

const pick = (ids: string[]) => ids.map((id) => THEMES.find((t) => t.id === id)).filter(Boolean) as Theme[];
const LEFT = pick(["royal-navy"])[0];
const RIGHT = pick(["dusty-rose"])[0];
const CENTER = pick(["sage-botani", "jawa-klasik", "emerald-night", "sakura-blush", "champagne"]);

function Cover({ t, data, dateLabel }: { t: Theme; data: InvitationData; dateLabel: string }) {
  return (
    <div style={themeVars(t)} className="h-full w-full">
      <CoverArt theme={t} data={data} dateLabel={dateLabel} />
    </div>
  );
}

/** Tiga ponsel berjajar; ponsel tengah berganti tema (satu-satunya animasi otomatis di halaman). */
export function HeroFan({ data, dateLabel }: { data: InvitationData; dateLabel: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % CENTER.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto h-[24rem] w-full max-w-[26rem] sm:h-[30rem]" aria-label={`Contoh tema ${CENTER[i].name}`} role="img">
      <div className="absolute left-0 top-10 w-[38%] -rotate-[9deg] opacity-90 sm:top-12">
        <PhoneFrame><Cover t={LEFT} data={data} dateLabel={dateLabel} /></PhoneFrame>
      </div>
      <div className="absolute right-0 top-10 w-[38%] rotate-[9deg] opacity-90 sm:top-12">
        <PhoneFrame><Cover t={RIGHT} data={data} dateLabel={dateLabel} /></PhoneFrame>
      </div>
      <div className="absolute left-1/2 top-0 z-10 w-[46%] -translate-x-1/2">
        <PhoneFrame className="ring-4 ring-marigold/80">
          {CENTER.map((t, idx) => (
            <div key={t.id} className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}>
              <Cover t={t} data={data} dateLabel={dateLabel} />
            </div>
          ))}
        </PhoneFrame>
        <p className="mt-3 text-center text-sm text-paper/80">{CENTER[i].name}</p>
      </div>
    </div>
  );
}
