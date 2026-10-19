"use server";

import { getAddon, getPackage } from "@/lib/catalog";
import { env } from "@/lib/env";
import { getSupabase } from "@/lib/supabase/server";
import { formatDateShort, normalizeWa, rupiah, waLink } from "@/lib/utils";
import { getTheme } from "@/themes/registry";

export type OrderState = { error?: string; waUrl?: string; code?: string };

/**
 * Simpan pesanan (bila DB aktif) lalu kembalikan link WhatsApp berisi ringkasan.
 * Dipakai dengan useActionState di halaman /order.
 */
export async function createOrder(_prev: OrderState, fd: FormData): Promise<OrderState> {
  const get = (k: string) => String(fd.get(k) ?? "").trim();
  if (get("company")) return { error: "Gagal mengirim." }; // honeypot

  const theme = getTheme(get("theme"));
  const pkg = getPackage(get("package"));
  const customer = get("customer");
  const wa = normalizeWa(get("whatsapp"));
  const bride = get("bride");
  const groom = get("groom");
  const date = get("date");
  const notes = get("notes");

  if (!theme) return { error: "Pilih tema terlebih dahulu." };
  if (!pkg) return { error: "Pilih paket terlebih dahulu." };
  if (customer.length < 2) return { error: "Isi nama pemesan." };
  if (!/^[0-9]{9,15}$/.test(wa)) return { error: "Nomor WhatsApp tidak valid. Contoh: 081234567890." };
  if (!bride || !groom) return { error: "Isi nama panggilan kedua mempelai." };
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Format tanggal tidak valid." };

  // Add-on & total dihitung ulang di server — harga dari klien tidak dipercaya
  const addons = [...new Set(fd.getAll("addons").map(String))].map(getAddon).filter((a) => a !== undefined);
  const total = pkg.price + addons.reduce((sum, a) => sum + a.price, 0);

  // id dibuat di server: anon tidak punya akses SELECT ke tabel orders (RLS)
  const id = crypto.randomUUID();
  const code = id.slice(0, 8).toUpperCase();

  const supabase = await getSupabase();
  if (supabase) {
    const { error } = await supabase.from("orders").insert({
      id,
      theme_id: theme.id,
      package: pkg.id,
      customer_name: customer.slice(0, 100),
      whatsapp: wa,
      bride_name: bride.slice(0, 60),
      groom_name: groom.slice(0, 60),
      event_date: date || null,
      notes: notes.slice(0, 2000) || null,
      addons: addons.map((a) => a.id),
      total,
    });
    if (error) return { error: "Pesanan gagal disimpan. Silakan coba lagi atau chat admin langsung." };
  }

  const lines = [
    `Halo ${env.brandName}, saya mau pesan undangan digital.`,
    "",
    `Kode pesanan: #${code}`,
    `Tema: ${theme.name}`,
    `Paket: ${pkg.name} (${rupiah(pkg.price)})`,
    `Nama pemesan: ${customer}`,
    `Mempelai: ${bride} & ${groom}`,
    date ? `Tanggal acara: ${formatDateShort(date)}` : null,
    addons.length ? `Add-on: ${addons.map((a) => `${a.name} (+${rupiah(a.price)})`).join(", ")}` : null,
    `Total: ${rupiah(total)}`,
    notes ? `Catatan: ${notes}` : null,
    "",
    `Demo tema: ${env.siteUrl}/tema/${theme.id}`,
  ].filter((l) => l !== null);

  return { waUrl: waLink(env.adminWa, lines.join("\n")), code };
}
