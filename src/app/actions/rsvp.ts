"use server";

import { getSupabase } from "@/lib/supabase/server";
import type { Attendance, Rsvp } from "@/lib/types";

export type RsvpInput = {
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
  website?: string; // honeypot: bot biasanya mengisi semua field
};

export type RsvpResult = { ok: true; rsvp: Rsvp } | { ok: false; error: string };

const ATTENDANCE: Attendance[] = ["hadir", "tidak", "ragu"];

export async function submitRsvp(invitationId: string, input: RsvpInput): Promise<RsvpResult> {
  if (input.website) return { ok: false, error: "Gagal mengirim." };

  const name = input.name?.trim() ?? "";
  const message = input.message?.trim() ?? "";
  if (name.length < 2 || name.length > 80) return { ok: false, error: "Nama minimal 2 karakter." };
  if (!ATTENDANCE.includes(input.attendance)) return { ok: false, error: "Pilih konfirmasi kehadiran." };
  if (message.length > 1000) return { ok: false, error: "Ucapan maksimal 1000 karakter." };
  const guests = input.attendance === "tidak" ? 0 : Math.min(10, Math.max(1, Math.floor(Number(input.guests) || 1)));

  const supabase = await getSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };

  const { data, error } = await supabase
    .from("rsvps")
    .insert({ invitation_id: invitationId, name, attendance: input.attendance, guests, message: message || null })
    .select()
    .single();

  if (error) return { ok: false, error: "Gagal menyimpan. Coba lagi beberapa saat." };
  return { ok: true, rsvp: data as Rsvp };
}
