import { InvitationEditor } from "@/components/admin/InvitationEditor";
import { getMusicLibrary } from "@/lib/music";
import { requireAdminPage } from "@/lib/supabase/server";
import type { InvitationData, Order } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { THEMES, googleFontsHref } from "@/themes/registry";

type Props = { searchParams: Promise<{ order?: string }> };

const person = (nickname = "") => ({ nickname, fullName: "", parents: "", instagram: "", photo: "" });

export default async function NewInvitationPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  const { supabase } = await requireAdminPage();
  const music = await getMusicLibrary();

  // Prefill dari pesanan bila dibuka lewat tombol "Buat undangan"
  let order: Order | null = null;
  if (orderId) {
    const { data } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
    order = data as Order | null;
  }

  const data: InvitationData = {
    bride: person(order?.bride_name),
    groom: person(order?.groom_name),
    opening: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.",
    quote: { text: "", source: "" },
    events: [
      { title: "Akad Nikah", date: order?.event_date ?? "", timeStart: "08.00", timeEnd: "10.00", timezone: "WIB", venue: "", address: "", mapsUrl: "" },
      { title: "Resepsi", date: order?.event_date ?? "", timeStart: "11.00", timeEnd: "Selesai", timezone: "WIB", venue: "", address: "", mapsUrl: "" },
    ],
    stories: [],
    gallery: [],
    gifts: [],
    closing: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
  };

  return (
    <>
      <link rel="stylesheet" href={googleFontsHref(THEMES)} precedence="default" />
      <h1 className="mb-8 font-serif-display text-3xl">
        Buat undangan{order && <span className="text-ink-soft"> untuk pesanan #{order.id.slice(0, 8).toUpperCase()}</span>}
      </h1>
      <InvitationEditor
        music={music}
        initial={{
          id: null,
          slug: order ? slugify(`${order.bride_name} ${order.groom_name}`) : "",
          theme_id: order?.theme_id ?? THEMES[0].id,
          is_published: false,
          order_id: order?.id ?? null,
          data,
        }}
      />
    </>
  );
}
