"use client";
import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export function getBrowserSupabase() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
