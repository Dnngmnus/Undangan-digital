import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Masuk admin", robots: { index: false } };

export default function LoginPage() {
  if (isSupabaseConfigured) return <LoginForm />;

  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <h1 className="font-serif-display text-2xl">Dashboard belum aktif</h1>
      <p className="mt-3 text-ink-soft">Katalog dan demo tema sudah berjalan. Untuk mengaktifkan pesanan, RSVP, dan dashboard:</p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-ink-soft">
        <li>Buat project di supabase.com, lalu jalankan <code className="rounded bg-paper px-1">supabase/schema.sql</code> di SQL Editor.</li>
        <li>Salin <code className="rounded bg-paper px-1">.env.example</code> menjadi <code className="rounded bg-paper px-1">.env.local</code>, isi URL dan anon key.</li>
        <li>Buat user di Authentication, lalu daftarkan UUID-nya ke tabel <code className="rounded bg-paper px-1">admins</code>.</li>
        <li>Restart server.</li>
      </ol>
    </main>
  );
}
