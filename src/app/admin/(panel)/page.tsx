import Link from "next/link";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { getAddon, getPackage } from "@/lib/catalog";
import { requireAdminPage } from "@/lib/supabase/server";
import type { Order, OrderStatus } from "@/lib/types";
import { formatDateShort, rupiah, waLink } from "@/lib/utils";
import { getTheme } from "@/themes/registry";

type Props = { searchParams: Promise<{ status?: string }> };

const TABS: { id: OrderStatus | "semua"; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "baru", label: "Baru" },
  { id: "diproses", label: "Diproses" },
  { id: "menunggu_bayar", label: "Menunggu bayar" },
  { id: "selesai", label: "Selesai" },
  { id: "batal", label: "Batal" },
];

export default async function OrdersPage({ searchParams }: Props) {
  const { status = "semua" } = await searchParams;
  const { supabase } = await requireAdminPage();

  let q = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (status !== "semua") q = q.eq("status", status);
  const { data } = await q;
  const orders = (data ?? []) as Order[];

  return (
    <>
      <h1 className="font-serif-display text-3xl">Pesanan</h1>
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filter status">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.id === "semua" ? "/admin" : `/admin?status=${t.id}`}
            className={`rounded-full border px-3 py-1 text-sm ${status === t.id ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-soft"}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="mt-16 text-center text-ink-soft">Belum ada pesanan dengan status ini. Pesanan baru muncul di sini setelah pelanggan mengisi formulir di halaman /order.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-line text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Kode</th>
                <th className="px-4 py-3 font-medium">Pemesan</th>
                <th className="px-4 py-3 font-medium">Mempelai</th>
                <th className="px-4 py-3 font-medium">Tema, paket & total</th>
                <th className="px-4 py-3 font-medium">Tanggal acara</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id} className="align-top">
                  <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    {o.customer_name}
                    <a href={waLink(o.whatsapp, `Halo ${o.customer_name}, terima kasih sudah memesan.`)} target="_blank" rel="noopener noreferrer" className="block text-xs text-moss underline underline-offset-2">
                      {o.whatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {o.bride_name} & {o.groom_name}
                    {o.notes && <p className="mt-1 max-w-xs text-xs text-ink-soft">{o.notes}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {getTheme(o.theme_id)?.name ?? o.theme_id}
                    <span className="block text-xs text-ink-soft">{getPackage(o.package)?.name ?? o.package}</span>
                    {o.addons?.length > 0 && (
                      <span className="block text-xs text-ink-soft">+ {o.addons.map((id) => getAddon(id)?.name ?? id).join(", ")}</span>
                    )}
                    {o.total != null && <span className="mt-1 block font-semibold">{rupiah(o.total)}</span>}
                  </td>
                  <td className="px-4 py-3">{o.event_date ? formatDateShort(o.event_date) : "–"}</td>
                  <td className="px-4 py-3"><StatusSelect id={o.id} status={o.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/undangan/baru?order=${o.id}`} className="whitespace-nowrap rounded-full bg-moss px-3 py-1.5 text-xs text-paper">
                      Buat undangan
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
