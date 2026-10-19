import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InvitationView } from "@/components/invitation/InvitationView";
import { DEMO_WISHES, getDemoInvitation } from "@/lib/demo-data";
import { env } from "@/lib/env";
import { getMusicLibrary } from "@/lib/music";
import { getTheme, googleFontsHref } from "@/themes/registry";

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ to?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const theme = getTheme((await params).id);
  return { title: theme ? `Demo tema ${theme.name}` : "Tema tidak ditemukan" };
}

export default async function ThemePreviewPage({ params, searchParams }: Params) {
  const [{ id }, { to }] = await Promise.all([params, searchParams]);
  const theme = getTheme(id);
  if (!theme) notFound();
  const demo = getDemoInvitation();
  // demo memakai lagu pertama di pustaka (public/music) bila ada
  const [track] = await getMusicLibrary();
  if (track) demo.data.music = track.url;

  return (
    <>
      <link rel="stylesheet" href={googleFontsHref([theme])} precedence="default" />
      {/* Bilah preview: di atas gerbang undangan */}
      <div className="fixed inset-x-0 top-0 z-[55] flex items-center justify-between gap-3 bg-ink/90 px-4 py-2 text-sm text-paper backdrop-blur">
        <Link href="/#katalog" className="underline-offset-4 hover:underline">Kembali ke katalog</Link>
        <span className="hidden sm:inline">Demo tema {theme.name}</span>
        <Link href={`/order?tema=${theme.id}`} className="rounded-full bg-marigold px-4 py-1.5 font-semibold text-ink">
          Pesan tema ini
        </Link>
      </div>
      <InvitationView
        theme={theme}
        data={demo.data}
        eventDate={demo.eventDate}
        guestName={(to ?? "Nama Tamu").slice(0, 80)}
        invitationId={null}
        wishes={DEMO_WISHES}
        brandName={env.brandName}
      />
    </>
  );
}
