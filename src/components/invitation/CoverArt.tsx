import type { Theme } from "@/themes/registry";
import type { InvitationData } from "@/lib/types";
import { Corner, Corners, Divider, PatternBg } from "./Ornament";
import { FxLayer, KenBurns, PhotoStack, ReelColumns, SplitText, cssVars, motionPhotos } from "./Motion";

type Props = {
  theme: Theme;
  data: InvitationData;
  dateLabel: string; // "04 . 04 . 2026"
  /** Slot bawah: blok "Kepada Yth." + tombol buka (gerbang), kosong di thumbnail. */
  children?: React.ReactNode;
};

/** Komposisi sampul sesuai `theme.cover`. Tanpa state — aman untuk Server Component. */
export function CoverArt(props: Props) {
  // @container: ukuran teks/foto mengikuti lebar wadah (thumbnail 390px vs layar desktop), bukan viewport
  return (
    <div className="@container h-full w-full">
      <CoverLayout {...props} />
    </div>
  );
}

function CoverLayout({ theme, data, dateLabel, children }: Props) {
  const [first, second] = data.groomFirst ? [data.groom, data.bride] : [data.bride, data.groom];
  const photo = data.coverImage || data.gallery[0];
  const tone = theme.photoTone === "mono" ? "grayscale" : "";

  switch (theme.cover) {
    case "arch":
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-iv-bg px-8 py-10 text-center text-iv-ink">
          <PatternBg kind={theme.ornament} />
          <Corners kind={theme.ornament} className="text-iv-accent" />
          <p className="font-display text-sm tracking-[0.3em] text-iv-muted">The Wedding of</p>
          <div className="relative mt-5 w-44 @md:w-52">
            <div className="arch-mask absolute -inset-2 border border-iv-accent" />
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="arch-mask aspect-[3/4] w-full object-cover" />
            ) : (
              <div className="arch-mask aspect-[3/4] w-full bg-iv-surface" />
            )}
          </div>
          <h1 className="mt-6 font-script text-5xl leading-tight text-iv-primary @md:text-6xl">
            {first.nickname} <span className="text-iv-accent">&</span> {second.nickname}
          </h1>
          <p className="mt-2 font-display text-lg tracking-widest">{dateLabel}</p>
          {children}
        </div>
      );

    case "frame":
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-iv-bg p-5 text-center text-iv-ink">
          <PatternBg kind={theme.ornament} opacity={0.08} />
          <div className="relative flex h-full w-full flex-col items-center justify-center border border-iv-accent/70 bg-iv-surface/40 px-6 py-10 outline outline-1 outline-offset-4 outline-iv-accent/40">
            <Corners kind={theme.ornament} className="text-iv-primary" />
            <p className="font-display text-sm tracking-[0.3em] text-iv-muted">The Wedding of</p>
            <Divider kind={theme.ornament} className="mt-4 text-iv-primary" />
            <h1 className="mt-6 font-script text-6xl leading-none text-iv-primary @md:text-7xl">{first.nickname}</h1>
            <span className="my-2 font-display text-2xl italic text-iv-accent">&</span>
            <h1 className="font-script text-6xl leading-none text-iv-primary @md:text-7xl">{second.nickname}</h1>
            <Divider kind={theme.ornament} className="mt-6 text-iv-primary" />
            <p className="mt-3 font-display text-lg tracking-widest">{dateLabel}</p>
            {children}
          </div>
        </div>
      );

    case "full":
      return (
        <div className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-iv-bg text-center text-iv-ink">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className={`absolute inset-0 h-full w-full object-cover ${tone}`} />
          )}
          {/* gradien ke warna latar tema agar teks tetap terbaca di foto apa pun */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-25% via-iv-bg/75 via-60% to-iv-bg" />
          <Corner kind={theme.ornament} position="tl" className="text-iv-accent" />
          <Corner kind={theme.ornament} position="tr" className="text-iv-accent" />
          <div className="relative px-8 pb-12 pt-40">
            <p className="font-display text-sm tracking-[0.3em] text-iv-muted">The Wedding of</p>
            <h1 className="mt-3 font-script text-6xl leading-tight text-iv-primary @md:text-7xl">
              {first.nickname} <span className="text-iv-accent">&</span> {second.nickname}
            </h1>
            <Divider kind={theme.ornament} className="mt-2 text-iv-accent" />
            <p className="mt-2 font-display text-lg tracking-widest">{dateLabel}</p>
            {children}
          </div>
        </div>
      );

    case "circle":
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-iv-bg px-8 py-10 text-center text-iv-ink">
          <PatternBg kind={theme.ornament} />
          <Corners kind={theme.ornament} className="text-iv-accent" />
          <p className="font-display text-sm tracking-[0.3em] text-iv-muted">The Wedding of</p>
          <div className="relative mt-6 w-48 @md:w-56">
            {/* cincin ganda: garis tipis aksen + garis putus-putus primer */}
            <div className="absolute -inset-3 rounded-full border border-iv-accent" />
            <div className="absolute -inset-5 rounded-full border border-dashed border-iv-primary/50" />
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="aspect-square w-full rounded-full object-cover" />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-full bg-iv-surface font-script text-7xl text-iv-primary">
                {first.nickname.charAt(0)}
                <span className="mx-1 text-4xl text-iv-accent">&</span>
                {second.nickname.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="mt-9 font-script text-5xl leading-tight text-iv-primary @md:text-6xl">
            {first.nickname} <span className="text-iv-accent">&</span> {second.nickname}
          </h1>
          <Divider kind={theme.ornament} className="mt-1 text-iv-accent" />
          <p className="mt-1 font-display text-lg tracking-widest">{dateLabel}</p>
          {children}
        </div>
      );

    case "polaroid":
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-iv-bg px-8 py-10 text-center text-iv-ink">
          <PatternBg kind={theme.ornament} />
          <Corners kind={theme.ornament} className="text-iv-accent" />
          <p className="font-display text-sm tracking-[0.3em] text-iv-muted">The Wedding of</p>
          <div className="relative mt-6 w-52 -rotate-3 bg-white p-3 pb-4 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.45)] @md:w-60">
            {/* selotip di atas foto */}
            <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-iv-accent/60" />
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="aspect-[4/5] w-full object-cover" />
            ) : (
              <div className="aspect-[4/5] w-full bg-iv-surface" />
            )}
            <p className="mt-3 font-script text-3xl leading-none text-[#2b2b2b]">
              {first.nickname} & {second.nickname}
            </p>
          </div>
          <p className="mt-7 font-display text-lg tracking-widest">{dateLabel}</p>
          {children}
        </div>
      );

    case "magazine":
      return (
        <div className={`relative flex h-full w-full flex-col overflow-hidden ${photo ? "bg-black" : "bg-iv-primary"} text-white`}>
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className={`absolute inset-0 h-full w-full object-cover ${tone}`} />
          )}
          {/* gelap di atas untuk judul, terang ke warna tema di bawah untuk blok tamu */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/10 via-45% to-transparent" />
          <Corner kind={theme.ornament} position="tr" className="text-iv-accent" />
          <Corner kind={theme.ornament} position="br" className="text-iv-accent" />
          <div className="relative px-7 pt-12 text-left">
            <p className="font-body text-xs tracking-[0.4em] opacity-85">THE WEDDING OF</p>
            <h1 className="mt-3 font-display text-[3.4rem] uppercase leading-[0.92] @md:text-7xl">
              {first.nickname}
              <span className="block font-script text-5xl normal-case text-iv-accent @md:text-6xl">&</span>
              {second.nickname}
            </h1>
            <p className="mt-4 inline-block bg-iv-primary px-3 py-1 font-body text-xs tracking-[0.3em] text-iv-on-primary">{dateLabel}</p>
          </div>
          {children && (
            <div className="relative mt-auto rounded-t-3xl bg-iv-bg/95 px-7 pb-10 pt-2 text-center text-iv-ink backdrop-blur">{children}</div>
          )}
        </div>
      );

    /* ---------------- Tema Motion ---------------- */
    case "cinema":
      return (
        <div className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-iv-primary text-center text-white">
          <KenBurns photos={motionPhotos(data, 4)} tone={tone} />
          {/* gelap di atas & bawah agar teks putih terbaca di foto apa pun */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/5 via-40% to-black/80" />
          {theme.motion && <FxLayer fx={theme.motion.fx} count={10} />}
          <div className="relative px-7 pb-10 pt-24">
            <p className="mo-rise font-body text-xs tracking-[0.45em] opacity-90" style={cssVars({ "--d": "0.2s" })}>
              THE WEDDING OF
            </p>
            <h1 className="mt-4 font-script text-6xl leading-[1.05] @md:text-7xl">
              <SplitText text={first.nickname} delay={0.5} />
              <span className="mo-rise block font-display text-2xl italic text-iv-accent" style={cssVars({ "--d": "1.1s" })}>&</span>
              <SplitText text={second.nickname} delay={1.3} />
            </h1>
            <p className="mo-rise mt-4 font-display text-lg tracking-[0.3em]" style={cssVars({ "--d": "2s" })}>{dateLabel}</p>
            {children && (
              <div className="mo-rise mt-6 rounded-2xl border border-iv-accent/40 bg-iv-bg/85 px-5 pb-5 pt-1 text-iv-ink backdrop-blur-md" style={cssVars({ "--d": "2.4s" })}>
                {children}
              </div>
            )}
          </div>
        </div>
      );

    case "reel":
      return (
        <div className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-iv-bg text-center text-iv-ink">
          <ReelColumns data={data} tone={tone} />
          <div className="absolute inset-0 bg-gradient-to-b from-iv-bg/60 via-iv-bg/10 to-iv-bg/70" />
          {theme.motion && <FxLayer fx={theme.motion.fx} count={9} />}
          <div className="mo-rise relative mx-5 rounded-[2rem] border border-iv-accent/50 bg-iv-bg/85 px-6 py-8 shadow-xl backdrop-blur-md" style={cssVars({ "--d": "0.2s" })}>
            <p className="font-display text-sm tracking-[0.3em] text-iv-muted">The Wedding of</p>
            <h1 className="mt-3 font-script text-6xl leading-[1.05] text-iv-primary @md:text-7xl">
              <SplitText text={first.nickname} delay={0.6} />
              <span className="block font-display text-2xl italic text-iv-accent">&</span>
              <SplitText text={second.nickname} delay={1.2} />
            </h1>
            <Divider kind={theme.ornament} className="mt-2 text-iv-accent" />
            <p className="mt-2 font-display text-lg tracking-widest">{dateLabel}</p>
            {children}
          </div>
        </div>
      );

    case "stack":
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-iv-bg px-8 py-10 text-center text-iv-ink">
          <PatternBg kind={theme.ornament} />
          <Corners kind={theme.ornament} className="text-iv-accent" />
          {theme.motion && <FxLayer fx={theme.motion.fx} count={9} />}
          <p className="relative font-display text-sm tracking-[0.3em] text-iv-muted">The Wedding of</p>
          <PhotoStack data={data} caption={`${first.nickname} & ${second.nickname}`} tone={tone} />
          <p className="relative mt-7 font-display text-lg tracking-widest">{dateLabel}</p>
          <div className="relative">{children}</div>
        </div>
      );

    case "split":
    default:
      return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-iv-bg text-iv-ink">
          <div className="relative h-[52%] shrink-0">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className={`h-full w-full object-cover ${tone}`} />
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center px-8 py-8 text-left">
            <p className="font-body text-xs tracking-[0.35em] text-iv-muted">THE WEDDING OF</p>
            <h1 className="mt-3 font-display text-6xl leading-[0.95] @md:text-7xl">
              {first.nickname}
              <br />& {second.nickname}
            </h1>
            <div className="mt-4 h-px w-16 bg-iv-ink" />
            <p className="mt-4 font-body text-sm tracking-[0.25em]">{dateLabel}</p>
            {children}
          </div>
        </div>
      );
  }
}
