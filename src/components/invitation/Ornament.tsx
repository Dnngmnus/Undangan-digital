import type { OrnamentKind } from "@/themes/registry";

/* ------------------------------------------------------------------ */
/* Geometri daun: daun ditempatkan sepanjang kurva Bezier kuadratik,   */
/* tiap daun diputar mengikuti arah garis singgung kurva.              */
/* ------------------------------------------------------------------ */
type Pt = [number, number];

function quad(p0: Pt, p1: Pt, p2: Pt, t: number): { p: Pt; angle: number } {
  const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0];
  const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1];
  const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return { p: [x, y], angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

function Sprig({ p0, p1, p2, count, size = 1 }: { p0: Pt; p1: Pt; p2: Pt; count: number; size?: number }) {
  const leaves = Array.from({ length: count }, (_, i) => {
    const t = 0.12 + (i / count) * 0.85;
    const { p, angle } = quad(p0, p1, p2, t);
    const side = i % 2 === 0 ? 1 : -1;
    const s = size * (1 - t * 0.45); // daun mengecil ke ujung
    return { p, angle: angle + side * 42, s, side };
  });
  return (
    <g>
      <path d={`M${p0} Q${p1} ${p2}`} fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" />
      {leaves.map(({ p, angle, s, side }, i) => (
        <ellipse
          key={i}
          cx={p[0] + Math.cos(((angle) * Math.PI) / 180) * 7 * s}
          cy={p[1] + Math.sin(((angle) * Math.PI) / 180) * 7 * s}
          rx={8 * s}
          ry={3.2 * s}
          transform={`rotate(${angle} ${p[0] + Math.cos((angle * Math.PI) / 180) * 7 * s} ${p[1] + Math.sin((angle * Math.PI) / 180) * 7 * s})`}
          fill="currentColor"
          opacity={side > 0 ? 0.85 : 0.55}
        />
      ))}
    </g>
  );
}

function KawungMotif({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // Empat elips "buah kolang-kaling" mengelilingi titik pusat — motif kawung.
  return (
    <g>
      {[0, 90, 180, 270].map((a) => (
        <ellipse
          key={a}
          cx={cx}
          cy={cy - r * 0.55}
          rx={r * 0.32}
          ry={r * 0.48}
          transform={`rotate(${a + 45} ${cx} ${cy})`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.09} fill="currentColor" />
    </g>
  );
}


/* ------------------------------------------------------------------ */
/* Motif tambahan                                                      */
/* ------------------------------------------------------------------ */

/** Bunga mekar: kelopak elips mengelilingi pusat. */
function Flower({ cx, cy, r, petals = 6, rot = 0 }: { cx: number; cy: number; r: number; petals?: number; rot?: number }) {
  return (
    <g>
      {Array.from({ length: petals }, (_, i) => {
        const a = rot + (360 / petals) * i;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy - r * 0.55}
            rx={r * 0.32}
            ry={r * 0.55}
            transform={`rotate(${a} ${cx} ${cy})`}
            fill="currentColor"
            opacity={0.55}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.22} fill="currentColor" />
    </g>
  );
}

/** Bintang segi-8 (dua persegi bertumpuk 45°) — motif geometri islami. */
function Star8({ cx, cy, r, filled = false }: { cx: number; cy: number; r: number; filled?: boolean }) {
  const sq = (rot: number) =>
    [0, 1, 2, 3]
      .map((i) => {
        const a = ((rot + i * 90) * Math.PI) / 180;
        return `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;
      })
      .join(" ");
  return (
    <g fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1} strokeLinejoin="round">
      <polygon points={sq(45)} opacity={filled ? 0.35 : 1} />
      <polygon points={sq(0)} opacity={filled ? 0.35 : 1} />
      <circle cx={cx} cy={cy} r={r * 0.28} fill="currentColor" stroke="none" />
    </g>
  );
}

/** Daun lebar dengan tulang daun (monstera/pisang), pangkal di (x,y). */
function Leaf({ x, y, len, angle, width = 0.42 }: { x: number; y: number; len: number; angle: number; width?: number }) {
  const w = len * width;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 0 C${len * 0.25} ${-w} ${len * 0.8} ${-w} ${len} 0 C${len * 0.8} ${w} ${len * 0.25} ${w} 0 0Z`} fill="currentColor" opacity={0.6} />
      <path d={`M0 0 L${len} 0`} stroke="currentColor" strokeWidth={0.9} opacity={0.9} />
      {[0.3, 0.5, 0.7].map((t) => (
        <g key={t} stroke="currentColor" strokeWidth={0.6} opacity={0.8}>
          <path d={`M${len * t} 0 l${len * 0.12} ${-w * 0.6}`} />
          <path d={`M${len * t} 0 l${len * 0.12} ${w * 0.6}`} />
        </g>
      ))}
    </g>
  );
}

/** Awan mega mendung: garis awan berlapis (3 lapis menyempit ke dalam). */
function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const outline = "M0 22 a11 11 0 0 1 12 -12 a14 14 0 0 1 26 -4 a11 11 0 0 1 20 8 a9 9 0 0 1 0 18 z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="currentColor" strokeLinejoin="round">
      {[1, 0.78, 0.56].map((k, i) => (
        <path key={k} d={outline} transform={`translate(${29 * (1 - k)} ${18 * (1 - k)}) scale(${k})`} strokeWidth={1.4 / k} opacity={1 - i * 0.22} />
      ))}
    </g>
  );
}

/** Noda cat air: lingkaran buram berlapis. */
function Blobs({ items }: { items: [number, number, number, number][] }) {
  return (
    <g filter="url(#iv-wc-blur)">
      {items.map(([cx, cy, r, o], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" opacity={o} />
      ))}
    </g>
  );
}

const BlurDef = () => (
  <defs>
    <filter id="iv-wc-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
  </defs>
);


/* ------------------------------------------------------------------ */
/* Motif Jawa                                                          */
/* ------------------------------------------------------------------ */

/** Gunungan / kayon wayang: siluet runcing, pohon hayat di dalam, gapura di kaki. h = tinggi total. */
export function Gunungan({ cx, y, h }: { cx: number; y: number; h: number }) {
  const s = h / 100; // desain asli 60×100
  return (
    <g transform={`translate(${cx - 30 * s} ${y}) scale(${s})`} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M30 0 C40 18 58 40 58 64 C58 78 52 86 46 90 L46 100 L14 100 L14 90 C8 86 2 78 2 64 C2 40 20 18 30 0Z"
        fill="currentColor"
        fillOpacity={0.14}
        strokeWidth={1.4}
      />
      <path d="M30 6 C38 22 52 42 52 63 C52 74 47 81 42 84 M30 6 C22 22 8 42 8 63 C8 74 13 81 18 84" fill="none" strokeWidth={0.7} opacity={0.7} />
      {/* pohon hayat: batang + cabang melengkung simetris */}
      <path d="M30 84 V24" fill="none" strokeWidth={1.2} />
      {[
        [70, 14, 60],
        [56, 12, 46],
        [42, 9, 34],
      ].map(([y0, w, y1]) => (
        <g key={y0} fill="none" strokeWidth={1}>
          <path d={`M30 ${y0} C${30 + w} ${y0 - 3} ${30 + w + 2} ${y1 + 4} ${30 + w - 3} ${y1}`} />
          <path d={`M30 ${y0} C${30 - w} ${y0 - 3} ${30 - w - 2} ${y1 + 4} ${30 - w + 3} ${y1}`} />
          <circle cx={30 + w - 3} cy={y1 - 2} r={1.6} fill="currentColor" stroke="none" />
          <circle cx={30 - w + 3} cy={y1 - 2} r={1.6} fill="currentColor" stroke="none" />
        </g>
      ))}
      <circle cx={30} cy={20} r={2.2} fill="currentColor" stroke="none" />
      {/* gapura */}
      <path d="M21 100 V88 H39 V100 M25 100 V93 Q30 88 35 93 V100" fill="none" strokeWidth={1} />
    </g>
  );
}

/** Lung-lungan: sulur melingkar khas ukiran Jawa. */
function Curl({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <path
      d="M0 0 C10 -8 26 -6 28 6 C30 16 18 20 14 13 C11 8 17 4 20 8"
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2 / s}
      strokeLinecap="round"
    />
  );
}

/** Bunga truntum: delapan kelopak titik mengelilingi pusat (motif batik pernikahan Jawa). */
function Truntum({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g fill="currentColor">
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={r * 0.32} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.42} fill="none" stroke="currentColor" strokeWidth={r * 0.12} />
      <circle cx={cx} cy={cy} r={r * 0.14} />
    </g>
  );
}

/** Garis parang: lengkung S diagonal dari (0,L) ke (L,0). */
function ParangBand({ L, w = 1.2 }: { L: number; w?: number }) {
  const h = L / 2;
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round">
      <path d={`M0 ${L} Q${L * 0.12} ${h} ${h} ${h} T${L} 0`} strokeWidth={w} />
      <path d={`M${L * 0.12} ${L} Q${L * 0.24} ${h + L * 0.1} ${h + L * 0.06} ${h + L * 0.06} T${L} ${L * 0.12}`} strokeWidth={w * 0.6} opacity={0.6} />
    </g>
  );
}

/** Janur: untaian lipatan daun kelapa muda yang menggantung. */
function Janur({ x, y, len }: { x: number; y: number; len: number }) {
  const n = Math.floor(len / 7);
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M0 0 V${len}`} strokeWidth={0.6} opacity={0.5} />
      {Array.from({ length: n }, (_, i) => {
        const yy = 4 + i * 7;
        const w = 6 - (i / n) * 3;
        return <path key={i} d={`M${-w} ${yy} L0 ${yy + 4} L${w} ${yy}`} strokeWidth={1.3} />;
      })}
      <path d={`M0 ${len} c-4 4 -2 10 3 9`} strokeWidth={1} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Corner: ornamen sudut 120×120, diputar via prop `position`          */
/* ------------------------------------------------------------------ */
type Position = "tl" | "tr" | "bl" | "br";
const ROTATE: Record<Position, string> = { tl: "", tr: "scale(-1,1)", bl: "scale(1,-1)", br: "scale(-1,-1)" };
const SWAY_DELAY: Record<Position, string> = { tl: "0s", tr: "-1.8s", bl: "-3.6s", br: "-5.4s" };
const PLACE: Record<Position, string> = { tl: "top-0 left-0", tr: "top-0 right-0", bl: "bottom-0 left-0", br: "bottom-0 right-0" };

function CornerShape({ kind }: { kind: OrnamentKind }) {
  switch (kind) {
    case "botanical":
      return (
        <>
          <Sprig p0={[2, 2]} p1={[60, 8]} p2={[118, 46]} count={9} />
          <Sprig p0={[2, 2]} p1={[8, 60]} p2={[46, 118]} count={9} />
          <Sprig p0={[10, 10]} p1={[40, 30]} p2={[64, 70]} count={5} size={0.75} />
        </>
      );
    case "deco":
      return (
        <g fill="none" stroke="currentColor" strokeWidth={1}>
          <path d="M3 117V3h114" />
          <path d="M11 117V11h106" opacity={0.6} />
          {[22, 34, 46].map((r) => (
            <path key={r} d={`M${11 + r} 11A${r} ${r} 0 0 1 11 ${11 + r}`} />
          ))}
          {[15, 30, 45, 60, 75].map((a) => (
            <line key={a} x1={11} y1={11} x2={11 + Math.cos((a * Math.PI) / 180) * 46} y2={11 + Math.sin((a * Math.PI) / 180) * 46} opacity={0.5} />
          ))}
          <path d="M64 11l5-5 5 5-5 5z M11 64l5 5-5 5-5-5z" fill="currentColor" stroke="none" />
        </g>
      );
    case "kawung":
      return (
        <g>
          <KawungMotif cx={30} cy={30} r={26} />
          <KawungMotif cx={78} cy={18} r={14} />
          <KawungMotif cx={18} cy={78} r={14} />
          <path d="M3 117V3h114" fill="none" stroke="currentColor" strokeWidth={1} opacity={0.6} />
        </g>
      );
    case "boho":
      return (
        <g fill="none" stroke="currentColor" strokeWidth={1.2}>
          {[18, 30, 42, 54].map((r, i) => (
            <path key={r} d={`M${r} 0A${r} ${r} 0 0 1 0 ${r}`} opacity={1 - i * 0.18} />
          ))}
          <Sprig p0={[60, 6]} p1={[86, 10]} p2={[112, 26]} count={5} size={0.7} />
          <circle cx={70} cy={60} r={2} fill="currentColor" />
          <circle cx={60} cy={76} r={1.5} fill="currentColor" />
        </g>
      );
    case "wave":
      return (
        <g fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round">
          {[10, 22, 34].map((y, i) => (
            <path key={y} d={`M0 ${y} q15 -8 30 0 t30 0 t30 0`} opacity={1 - i * 0.25} />
          ))}
          <circle cx={100} cy={52} r={3} />
        </g>
      );
    case "floral":
      return (
        <>
          <Sprig p0={[2, 2]} p1={[50, 6]} p2={[112, 30]} count={7} size={0.85} />
          <Sprig p0={[2, 2]} p1={[6, 50]} p2={[30, 112]} count={7} size={0.85} />
          <Flower cx={26} cy={26} r={22} petals={6} />
          <Flower cx={70} cy={16} r={12} petals={5} rot={20} />
          <Flower cx={16} cy={70} r={12} petals={5} rot={40} />
          <Flower cx={52} cy={48} r={7} petals={5} />
        </>
      );
    case "islamic":
      return (
        <g>
          <path d="M3 117V3h114" fill="none" stroke="currentColor" strokeWidth={1} />
          <path d="M10 117V10h107" fill="none" stroke="currentColor" strokeWidth={0.6} opacity={0.6} />
          <Star8 cx={34} cy={34} r={20} />
          <Star8 cx={34} cy={34} r={11} filled />
          <Star8 cx={80} cy={18} r={8} />
          <Star8 cx={18} cy={80} r={8} />
          <Star8 cx={108} cy={18} r={4} filled />
          <Star8 cx={18} cy={108} r={4} filled />
        </g>
      );
    case "tropical":
      return (
        <g>
          <Leaf x={0} y={0} len={92} angle={18} />
          <Leaf x={0} y={0} len={92} angle={72} />
          <Leaf x={0} y={0} len={70} angle={45} width={0.5} />
          <Sprig p0={[4, 4]} p1={[70, 2]} p2={[118, 16]} count={10} size={1.1} />
        </g>
      );
    case "megamendung":
      return (
        <g>
          <Cloud x={2} y={4} s={1.15} />
          <Cloud x={6} y={46} s={0.85} />
          <Cloud x={58} y={0} s={0.7} />
        </g>
      );
    case "watercolor":
      return (
        <>
          <BlurDef />
          <Blobs items={[[24, 22, 26, 0.35], [56, 14, 16, 0.25], [14, 58, 18, 0.25], [40, 44, 12, 0.3]]} />
          <Sprig p0={[6, 6]} p1={[50, 20]} p2={[96, 18]} count={6} size={0.75} />
          <Sprig p0={[6, 6]} p1={[20, 50]} p2={[18, 96]} count={6} size={0.75} />
        </>
      );
    case "gunungan":
      return (
        <g>
          {/* sulur lung-lungan di sepanjang dua sisi + gunungan kecil di sudut */}
          <path d="M3 117V3h114" fill="none" stroke="currentColor" strokeWidth={0.8} opacity={0.6} />
          {[16, 46, 76].map((x, i) => <Curl key={`h${x}`} x={x} y={12} s={0.9 - i * 0.15} />)}
          {[16, 46, 76].map((yy, i) => <Curl key={`v${yy}`} x={12} y={yy} s={0.9 - i * 0.15} rot={90} />)}
          <Gunungan cx={36} y={20} h={44} />
        </g>
      );
    case "parang":
      return (
        <g>
          {[40, 66, 92, 118].map((L, i) => <ParangBand key={L} L={L} w={1.3 - i * 0.2} />)}
          {[[18, 18], [32, 30], [44, 44]].map(([cx, cy]) => (
            <path key={cx} d={`M${cx} ${cy - 3}l3 3-3 3-3-3z`} fill="currentColor" />
          ))}
        </g>
      );
    case "truntum":
      return (
        <g>
          <Truntum cx={22} cy={22} r={9} />
          <Truntum cx={56} cy={14} r={6} />
          <Truntum cx={14} cy={56} r={6} />
          <Truntum cx={46} cy={44} r={4.5} />
          <Truntum cx={84} cy={10} r={3.5} />
          <Truntum cx={10} cy={84} r={3.5} />
          <Curl x={64} y={30} s={0.8} />
          <Curl x={30} y={64} s={0.8} rot={90} />
        </g>
      );
    case "janur":
      return (
        <g>
          <path d="M0 6 Q60 18 120 6" fill="none" stroke="currentColor" strokeWidth={1} />
          <Janur x={14} y={8} len={70} />
          <Janur x={38} y={12} len={52} />
          <Janur x={62} y={13} len={38} />
          <Janur x={86} y={12} len={26} />
        </g>
      );
    case "line":
    default:
      return (
        <g fill="none" stroke="currentColor" strokeWidth={1}>
          <path d="M6 90V6h84" />
          <circle cx={6} cy={6} r={2.5} fill="currentColor" />
        </g>
      );
  }
}

export function Corner({ kind, position, className = "" }: { kind: OrnamentKind; position: Position; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      className={`pointer-events-none absolute ${PLACE[position]} h-24 w-24 @md:h-28 @md:w-28 ${className}`}
      style={{ transform: ROTATE[position] }}
    >
      {/* delay berbeda per sudut agar keempatnya tidak bergoyang serempak */}
      <g className="iv-sway" style={{ animationDelay: SWAY_DELAY[position] }}>
        <CornerShape kind={kind} />
      </g>
    </svg>
  );
}

export function Corners({ kind, className = "" }: { kind: OrnamentKind; className?: string }) {
  return (
    <>
      {(["tl", "tr", "bl", "br"] as Position[]).map((p) => (
        <Corner key={p} kind={kind} position={p} className={className} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Divider antar judul section                                         */
/* ------------------------------------------------------------------ */
export function Divider({ kind, className = "" }: { kind: OrnamentKind; className?: string }) {
  let center: React.ReactNode;
  switch (kind) {
    case "botanical":
      center = (
        <>
          <Sprig p0={[100, 12]} p1={[82, 6]} p2={[64, 12]} count={4} size={0.7} />
          <Sprig p0={[100, 12]} p1={[118, 6]} p2={[136, 12]} count={4} size={0.7} />
        </>
      );
      break;
    case "deco":
      center = <path d="M100 4l8 8-8 8-8-8z M100 8l4 4-4 4-4-4z" fill="currentColor" fillRule="evenodd" />;
      break;
    case "kawung":
      center = <KawungMotif cx={100} cy={12} r={11} />;
      break;
    case "boho":
      center = (
        <g fill="none" stroke="currentColor">
          {[5, 9, 13].map((r) => <path key={r} d={`M${100 - r} 18a${r} ${r} 0 0 1 ${r * 2} 0`} />)}
        </g>
      );
      break;
    case "wave":
      center = <path d="M76 12q6-6 12 0t12 0t12 0t12 0" fill="none" stroke="currentColor" strokeWidth={1.2} />;
      break;
    case "floral":
      center = (
        <>
          <Flower cx={100} cy={12} r={10} petals={6} />
          <Flower cx={80} cy={12} r={5} petals={5} />
          <Flower cx={120} cy={12} r={5} petals={5} />
        </>
      );
      break;
    case "islamic":
      center = <Star8 cx={100} cy={12} r={9} />;
      break;
    case "tropical":
      center = (
        <>
          <Leaf x={100} y={14} len={30} angle={-160} width={0.35} />
          <Leaf x={100} y={14} len={30} angle={-20} width={0.35} />
        </>
      );
      break;
    case "megamendung":
      center = <Cloud x={84} y={0} s={0.5} />;
      break;
    case "watercolor":
      center = (
        <>
          <BlurDef />
          <Blobs items={[[100, 12, 9, 0.4]]} />
          <circle cx={100} cy={12} r={2.5} fill="currentColor" />
        </>
      );
      break;
    case "gunungan":
      center = (
        <>
          <Curl x={64} y={14} s={0.7} />
          <Curl x={136} y={14} s={0.7} rot={180} />
          <Gunungan cx={100} y={0} h={24} />
        </>
      );
      break;
    case "parang":
      center = (
        <g transform="translate(88 0)">
          <ParangBand L={24} />
        </g>
      );
      break;
    case "truntum":
      center = (
        <>
          <Truntum cx={100} cy={12} r={6} />
          <Truntum cx={82} cy={12} r={3} />
          <Truntum cx={118} cy={12} r={3} />
        </>
      );
      break;
    case "janur":
      center = (
        <>
          <Janur x={92} y={0} len={20} />
          <Janur x={108} y={0} len={20} />
          <path d="M84 2 Q100 8 116 2" fill="none" stroke="currentColor" />
        </>
      );
      break;
    default:
      center = <circle cx={100} cy={12} r={2.5} fill="currentColor" />;
  }
  return (
    <svg aria-hidden viewBox="0 0 200 24" className={`mx-auto h-6 w-48 ${className}`}>
      <line x1={4} y1={12} x2={kind === "line" ? 92 : 62} y2={12} stroke="currentColor" strokeWidth={0.8} opacity={0.6} />
      <line x1={kind === "line" ? 108 : 138} y1={12} x2={196} y2={12} stroke="currentColor" strokeWidth={0.8} opacity={0.6} />
      {center}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Pola latar halus (hanya untuk ornamen bertekstur)                   */
/* ------------------------------------------------------------------ */
export function PatternBg({ kind, opacity = 0.06 }: { kind: OrnamentKind; opacity?: number }) {
  if (!["kawung", "deco", "wave", "islamic", "megamendung", "parang", "truntum"].includes(kind)) return null;
  const size: Record<string, [number, number]> = { wave: [60, 24], megamendung: [96, 60], islamic: [40, 40], parang: [36, 36], truntum: [44, 44] };
  const [pw, ph] = size[kind] ?? [48, 48];
  const id = `pat-${kind}`;
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity }}>
      <defs>
        <pattern id={id} width={pw} height={ph} patternUnits="userSpaceOnUse">
          {kind === "kawung" && <KawungMotif cx={24} cy={24} r={22} />}
          {kind === "deco" && (
            <g fill="none" stroke="currentColor" strokeWidth={0.8}>
              <path d="M0 48A24 24 0 0 1 48 48M8 48A16 16 0 0 1 40 48M16 48A8 8 0 0 1 32 48" />
            </g>
          )}
          {kind === "wave" && <path d="M0 12q15-8 30 0t30 0" fill="none" stroke="currentColor" />}
          {kind === "islamic" && <Star8 cx={20} cy={20} r={14} />}
          {kind === "megamendung" && <Cloud x={8} y={10} s={0.9} />}
          {kind === "parang" && <ParangBand L={36} w={1} />}
          {kind === "truntum" && (
            <>
              <Truntum cx={11} cy={11} r={4} />
              <Truntum cx={33} cy={33} r={4} />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Emblem: motif tunggal di atas monogram sampul                       */
/* ------------------------------------------------------------------ */
export function Emblem({ kind, className = "" }: { kind: OrnamentKind; className?: string }) {
  if (kind === "gunungan") {
    return (
      <svg aria-hidden viewBox="0 0 80 104" className={`iv-float mx-auto h-28 w-auto ${className}`}>
        <Gunungan cx={40} y={2} h={100} />
      </svg>
    );
  }
  if (kind === "truntum") {
    return (
      <svg aria-hidden viewBox="0 0 80 80" className={`iv-float mx-auto h-20 w-auto ${className}`}>
        <Truntum cx={40} cy={40} r={22} />
      </svg>
    );
  }
  if (kind === "janur") {
    return (
      <svg aria-hidden viewBox="0 0 80 80" className={`iv-float mx-auto h-24 w-auto ${className}`}>
        <path d="M6 6 Q40 22 74 6" fill="none" stroke="currentColor" strokeWidth={1.2} />
        <Janur x={22} y={10} len={56} />
        <Janur x={40} y={14} len={62} />
        <Janur x={58} y={10} len={56} />
      </svg>
    );
  }
  return <Divider kind={kind} className={className} />;
}
