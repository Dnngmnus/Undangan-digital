import { notFound } from "next/navigation";
import { InvitationEditor } from "@/components/admin/InvitationEditor";
import { getMusicLibrary } from "@/lib/music";
import { requireAdminPage } from "@/lib/supabase/server";
import type { Invitation } from "@/lib/types";
import { THEMES, googleFontsHref } from "@/themes/registry";

type Props = { params: Promise<{ id: string }> };

export default async function EditInvitationPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdminPage();
  const music = await getMusicLibrary();
  const { data } = await supabase.from("invitations").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const inv = data as Invitation;

  return (
    <>
      <link rel="stylesheet" href={googleFontsHref(THEMES)} precedence="default" />
      <h1 className="mb-8 font-serif-display text-3xl">
        {inv.data.bride.nickname} & {inv.data.groom.nickname}
      </h1>
      <InvitationEditor
        music={music}
        initial={{
          id: inv.id,
          slug: inv.slug,
          theme_id: inv.theme_id,
          is_published: inv.is_published,
          order_id: inv.order_id,
          // default untuk field list agar editor tidak crash pada data lama
          data: {
            ...inv.data,
            stories: inv.data.stories ?? [],
            gallery: inv.data.gallery ?? [],
            gifts: inv.data.gifts ?? [],
            events: inv.data.events ?? [],
          },
        }}
      />
    </>
  );
}
