import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { InvitationView } from "@/components/invitation/InvitationView";
import { env } from "@/lib/env";
import { getSupabase } from "@/lib/supabase/server";
import type { Invitation, Rsvp } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";
import { getThemeOrDefault, googleFontsHref } from "@/themes/registry";

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<{ to?: string }> };

// cache(): generateMetadata & page berbagi satu query per request
const getInvitation = cache(async (slug: string) => {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from("invitations").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  return data as Invitation | null;
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const inv = await getInvitation(slug);
  if (!inv) return { title: "Undangan tidak ditemukan" };
  const { bride, groom, coverImage, gallery } = inv.data;
  const title = `Pernikahan ${bride.nickname} & ${groom.nickname}`;
  const description = `${formatDateShort(inv.event_date.slice(0, 10))} — Anda diundang. Buka untuk detail acara.`;
  const image = coverImage || gallery?.[0];
  return {
    title,
    description,
    robots: { index: false, follow: false }, // undangan bersifat pribadi
    openGraph: { title, description, images: image ? [image] : undefined, type: "website" },
  };
}

export default async function InvitationPage({ params, searchParams }: Params) {
  const [{ slug }, { to }] = await Promise.all([params, searchParams]);
  const inv = await getInvitation(slug);
  if (!inv) notFound();

  const supabase = await getSupabase();
  const { data: wishes } = await supabase!
    .from("rsvps")
    .select("*")
    .eq("invitation_id", inv.id)
    .order("created_at", { ascending: false })
    .limit(200);

  const theme = getThemeOrDefault(inv.theme_id);
  const guest = (to ?? "").slice(0, 80);

  return (
    <>
      {/* React 19 meng-hoist <link> ke <head>; hanya font tema ini yang dimuat */}
      <link rel="stylesheet" href={googleFontsHref([theme])} precedence="default" />
      <InvitationView
        theme={theme}
        data={inv.data}
        eventDate={inv.event_date}
        guestName={guest}
        invitationId={inv.id}
        wishes={(wishes ?? []) as Rsvp[]}
        brandName={env.brandName}
      />
    </>
  );
}
