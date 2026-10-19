"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import type { OrderStatus } from "@/lib/types";

const OPTIONS: { v: OrderStatus; l: string }[] = [
  { v: "baru", l: "Baru" },
  { v: "diproses", l: "Diproses" },
  { v: "menunggu_bayar", l: "Menunggu bayar" },
  { v: "selesai", l: "Selesai" },
  { v: "batal", l: "Batal" },
];

export function StatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const [pending, start] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      aria-label="Ubah status pesanan"
      onChange={(e) => start(() => updateOrderStatus(id, e.target.value as OrderStatus))}
      className="rounded-md border border-line bg-porcelain px-2 py-1 text-sm disabled:opacity-60"
    >
      {OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}
