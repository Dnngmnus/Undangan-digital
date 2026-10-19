import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";
import type { Testimonial } from "@/lib/types";

/**
 * Klien anonim tanpa cookie untuk data publik di halaman yang di-cache (ISR).
 * Memakai cookies() di sini akan membuat landing page jadi dinamis per request.
 */
function publicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(env.supabaseUrl, env.supabaseAnonKey, { auth: { persistSession: false } });
}

export async function getPublishedTestimonials(limit = 12): Promise<Testimonial[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Testimonial[];
}
