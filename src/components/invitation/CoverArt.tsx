import type { Theme } from "@/themes/registry";
import type { InvitationData } from "@/lib/types";
import { Corners, Divider, PatternBg } from "./Ornament";

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
            <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          {/* gradien ke warna latar tema agar teks tetap terbaca di foto apa pun */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-25% via-iv-bg/75 via-60% to-iv-bg" />
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

    case "split":
    default:
      return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-iv-bg text-iv-ink">
          <div className="relative h-[52%] shrink-0">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="h-full w-full object-cover grayscale" />
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
