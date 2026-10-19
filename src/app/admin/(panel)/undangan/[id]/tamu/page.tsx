import Link from "next/link";
import { notFound } from "next/navigation";
import { GuestTools } from "@/components/admin/GuestTools";
import { env } from "@/lib/env";
import { requireAdminPage } from "@/lib/supabase/server";
import type { Invitation, Rsvp } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export default async function GuestsPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdminPage();
  const [{ data: inv }, { data: rsvps }] = await Promise.all([
    supabase.from("invitations").select("*").eq("id", id).maybeSingle(),
    supabase.from("rsvps").select("*").eq("invitation_id", id).order("created_at", { ascending: false }),
  ]);
  if (!inv) notFound();
  const invitation = inv as Invitation;
  const couple = `${invitation.data.bride.nickname} & ${invitation.data.groom.nickname}`;

  return (
    <>
      <Link href={`/admin/undangan/${id}`} className="text-sm text-ink-soft underline underline-offset-4">Kembali ke editor</Link>
      <h1 className="mb-2 mt-4 font-serif-display text-3xl">{couple}</h1>
      {!invitation.is_published && (
        <p className="mb-8 rounded-lg bg-blush/50 px-4 py-3 text-sm">Undangan ini masih draf. Publikasikan dulu dari editor sebelum link dikirim ke tamu.</p>
      )}
      <div className="mt-8">
        <GuestTools baseUrl={`${env.siteUrl}/${invitation.slug}`} couple={couple} invitationId={id} rsvps={(rsvps ?? []) as Rsvp[]} />
      </div>
    </>
  );
}
