import Link from "next/link";
import { requireAdminPage } from "@/lib/supabase/server";
import type { Invitation } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";
import { getTheme } from "@/themes/registry";

export default async function InvitationsPage() {
  const { supabase } = await requireAdminPage();
  const [{ data }, { data: counts }] = await Promise.all([
    supabase.from("invitations").select("id, slug, theme_id, event_date, is_published, data").order("event_date", { ascending: true }),
    supabase.from("rsvps").select("invitation_id"),
  ]);
  const invitations = (data ?? []) as Pick<Invitation, "id" | "slug" | "theme_id" | "event_date" | "is_published" | "data">[];
  const rsvpCount = new Map<string, number>();
  (counts ?? []).forEach((r: { invitation_id: string }) => rsvpCount.set(r.invitation_id, (rsvpCount.get(r.invitation_id) ?? 0) + 1));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif-display text-3xl">Undangan</h1>
        <Link href="/admin/undangan/baru" className="rounded-full bg-moss px-5 py-2 text-sm text-paper">Buat undangan</Link>
      </div>

      {invitations.length === 0 ? (
        <p className="mt-16 text-center text-ink-soft">Belum ada undangan. Buat dari menu Pesanan agar data pemesan terisi otomatis, atau mulai dari kosong.</p>
      ) : (
        <ul className="mt-8 divide-y divide-line rounded-xl border border-line bg-paper">
          {invitations.map((inv) => (
            <li key={inv.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-semibold">
                  {inv.data.bride?.nickname} & {inv.data.groom?.nickname}
                  {!inv.is_published && <span className="ml-2 rounded-full bg-blush px-2 py-0.5 text-xs font-normal">Draf</span>}
                </p>
                <p className="mt-0.5 flex flex-wrap gap-x-4 text-sm text-ink-soft">
                  <span>/{inv.slug}</span>
                  <span>{getTheme(inv.theme_id)?.name ?? inv.theme_id}</span>
                  <span>{formatDateShort(inv.event_date.slice(0, 10))}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Link href={`/admin/undangan/${inv.id}/tamu`} className="rounded-full border border-line px-3 py-1.5">
                  Tamu & RSVP ({rsvpCount.get(inv.id) ?? 0})
                </Link>
                <Link href={`/admin/undangan/${inv.id}`} className="rounded-full border border-line px-3 py-1.5">Ubah</Link>
                {inv.is_published && (
                  <Link href={`/${inv.slug}`} target="_blank" className="rounded-full bg-ink px-3 py-1.5 text-paper">Buka</Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
