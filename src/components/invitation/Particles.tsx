import type { OrnamentKind } from "@/themes/registry";

type Shape = "petal" | "leaf" | "truntum" | "sparkle";

/** Jenis partikel mengikuti ornamen tema; tema minimalis tanpa partikel. */
const SHAPE: Partial<Record<OrnamentKind, Shape>> = {
  floral: "petal",
  botanical: "petal",
  watercolor: "petal",
  boho: "petal",
  tropical: "leaf",
  janur: "leaf",
  truntum: "truntum",
  deco: "sparkle",
  islamic: "sparkle",
  gunungan: "sparkle",
  parang: "sparkle",
  kawung: "sparkle",
  megamendung: "sparkle",
};

function Glyph({ shape }: { shape: Shape }) {
  switch (shape) {
    case "petal":
      return <path d="M10 0 C17 6 17 15 10 20 C3 15 3 6 10 0Z" fill="currentColor" />;
    case "leaf":
      return (
        <g fill="currentColor">
          <path d="M2 18 C2 8 8 2 18 2 C18 12 12 18 2 18Z" />
          <path d="M3 17 L16 4" stroke="var(--bg)" strokeWidth={0.8} opacity={0.6} />
        </g>
      );
    case "truntum":
      return (
        <g fill="currentColor">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return <circle key={i} cx={10 + Math.cos(a) * 6} cy={10 + Math.sin(a) * 6} r={2} />;
          })}
          <circle cx={10} cy={10} r={1.6} />
        </g>
      );
    case "sparkle":
    default:
      return <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="currentColor" />;
  }
}

/** Pseudo-acak deterministik: hasil server = klien (tanpa hydration mismatch). */
function rand(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function Particles({ kind, count = 12 }: { kind: OrnamentKind; count?: number }) {
  const shape = SHAPE[kind];
  if (!shape) return null;

  return (
    <div aria-hidden className="iv-particles pointer-events-none fixed inset-0 z-[51] overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const size = 10 + rand(i, 1) * 12; // 10–22px
        const style = {
          left: `${rand(i, 2) * 100}%`,
          width: size,
          height: size,
          animationDuration: `${11 + rand(i, 3) * 10}s`,
          animationDelay: `${-rand(i, 4) * 20}s`, // negatif: sudah tersebar sejak awal, tidak menunggu
          "--dx": `${(rand(i, 5) - 0.5) * 160}px`,
          "--rot": `${(rand(i, 6) > 0.5 ? 1 : -1) * (180 + rand(i, 7) * 360)}deg`,
          "--o": `${0.35 + rand(i, 8) * 0.45}`,
        } as React.CSSProperties;
        return (
          <svg key={i} viewBox="0 0 20 20" className={`iv-particle ${i % 3 === 0 ? "text-iv-primary" : "text-iv-accent"}`} style={style}>
            <Glyph shape={shape} />
          </svg>
        );
      })}
    </div>
  );
}
