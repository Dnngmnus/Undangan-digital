import "server-only";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Supabase client untuk Server Component / Server Action / Route Handler.
 * Mengembalikan null bila env belum diisi supaya halaman publik tetap bisa render.
 */
export async function getSupabase() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component (read-only cookies) — refresh session ditangani proxy.ts
        }
      },
    },
  });
}

/** Untuk halaman admin: alihkan ke login bila belum login / bukan admin / DB belum dikonfigurasi. */
export async function requireAdminPage() {
  try {
    return await requireAdmin();
  } catch (e) {
    unstable_rethrow(e); // teruskan sinyal internal Next (dynamic rendering, redirect, dll)
    redirect("/admin/login");
  }
}

/** Memastikan request berasal dari admin; dipakai di setiap server action admin. */
export async function requireAdmin() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) throw new Error("Akun ini bukan admin");

  return { supabase, user };
}
