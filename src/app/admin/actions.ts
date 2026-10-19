"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase, requireAdmin } from "@/lib/supabase/server";
import type { InvitationData, OrderStatus } from "@/lib/types";
import { getTheme } from "@/themes/registry";

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */
export async function login(_prev: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  const supabase = await getSupabase();
  if (!supabase) return { error: "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu." };

  const { error } = await supabase.auth.signInWithPassword({
    email: String(fd.get("email") ?? ""),
    password: String(fd.get("password") ?? ""),
  });
  if (error) return { error: "Email atau password salah." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Akun ini belum terdaftar sebagai admin (tabel public.admins)." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await getSupabase();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* Pesanan                                                             */
/* ------------------------------------------------------------------ */
const STATUSES: OrderStatus[] = ["baru", "diproses", "menunggu_bayar", "selesai", "batal"];

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (!STATUSES.includes(status)) throw new Error("Status tidak valid");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

/* ------------------------------------------------------------------ */
/* Undangan                                                            */
/* ------------------------------------------------------------------ */
export type SaveInvitationInput = {
  id: string | null;
  slug: string;
  theme_id: string;
  is_published: boolean;
  order_id: string | null;
  data: InvitationData;
};

const TZ_OFFSET: Record<string, string> = { WIB: "+07:00", WITA: "+08:00", WIT: "+09:00" };

/** event_date (untuk countdown) diturunkan dari acara pertama agar tidak perlu diisi dua kali. */
function deriveEventDate(data: InvitationData) {
  const ev = data.events[0];
  if (!ev?.date || !/^\d{4}-\d{2}-\d{2}$/.test(ev.date)) return null;
  const m = /^(\d{1,2})[.:](\d{2})$/.exec(ev.timeStart ?? "");
  const time = m ? `${m[1].padStart(2, "0")}:${m[2]}:00` : "08:00:00";
  return `${ev.date}T${time}${TZ_OFFSET[ev.timezone] ?? "+07:00"}`;
}

function validate(input: SaveInvitationInput): string | null {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(input.slug)) return "Slug hanya huruf kecil, angka, dan tanda hubung (contoh: laras-bima).";
  if (["admin", "order", "tema", "api"].includes(input.slug)) return "Slug ini dipakai sistem, gunakan yang lain.";
  if (!getTheme(input.theme_id)) return "Tema tidak dikenal.";
  const d = input.data;
  if (!d.bride?.nickname || !d.groom?.nickname) return "Nama panggilan kedua mempelai wajib diisi.";
  if (!d.events?.length) return "Tambahkan minimal satu acara.";
  if (!deriveEventDate(d)) return "Tanggal acara pertama belum diisi.";
  if (JSON.stringify(d).length > 200_000) return "Data terlalu besar.";
  return null;
}

export async function saveInvitation(input: SaveInvitationInput): Promise<{ error?: string; id?: string }> {
  const err = validate(input);
  if (err) return { error: err };
  const { supabase } = await requireAdmin();

  // buang baris kosong dari list dinamis
  const data: InvitationData = {
    ...input.data,
    gallery: input.data.gallery.map((s) => s.trim()).filter(Boolean),
    gifts: input.data.gifts.filter((g) => g.bank && g.accountNumber),
    stories: input.data.stories.filter((s) => s.title || s.text),
  };

  const row = {
    slug: input.slug,
    theme_id: input.theme_id,
    is_published: input.is_published,
    order_id: input.order_id,
    event_date: deriveEventDate(data)!,
    data,
  };

  const q = input.id
    ? supabase.from("invitations").update(row).eq("id", input.id).select("id").single()
    : supabase.from("invitations").insert(row).select("id").single();
  const { data: saved, error } = await q;

  if (error) {
    if (error.code === "23505") return { error: "Slug sudah dipakai undangan lain." };
    return { error: error.message };
  }
  revalidatePath("/admin/undangan");
  revalidatePath(`/${input.slug}`);
  return { id: saved.id };
}

export async function deleteInvitation(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("invitations").delete().eq("id", id);
  revalidatePath("/admin/undangan");
  redirect("/admin/undangan");
}

export async function deleteRsvp(id: string, invitationId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("rsvps").delete().eq("id", id);
  revalidatePath(`/admin/undangan/${invitationId}/tamu`);
}

/* ------------------------------------------------------------------ */
/* Testimoni                                                           */
/* ------------------------------------------------------------------ */
export async function addTestimonial(input: { couple: string; message: string; image: string; theme_id: string }): Promise<{ error?: string }> {
  const couple = input.couple.trim();
  const message = input.message.trim();
  const image = input.image.trim();
  if (couple.length < 2) return { error: "Isi nama pasangan." };
  if (!message && !image) return { error: "Isi kutipan atau unggah screenshot." };
  if (message.length > 600) return { error: "Kutipan maksimal 600 karakter." };
  if (image && !/^https:\/\//.test(image)) return { error: "URL gambar harus diawali https://" };

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("testimonials").insert({
    couple,
    message: message || null,
    image: image || null,
    theme_id: getTheme(input.theme_id) ? input.theme_id : null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/testimoni");
  revalidatePath("/");
  return {};
}

export async function setTestimonialPublished(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("testimonials").update({ is_published: published }).eq("id", id);
  revalidatePath("/admin/testimoni");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/testimoni");
  revalidatePath("/");
}
