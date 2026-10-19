import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/store/Shell";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };
// Data admin selalu per-request (cookie session); jangan pernah di-prerender.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Wordmark />
          <nav className="flex items-center gap-5 text-sm" aria-label="Admin">
            <Link href="/admin" className="text-ink-soft hover:text-ink">Pesanan</Link>
            <Link href="/admin/undangan" className="text-ink-soft hover:text-ink">Undangan</Link>
            <Link href="/admin/testimoni" className="text-ink-soft hover:text-ink">Testimoni</Link>
            <Link href="/" target="_blank" className="text-ink-soft hover:text-ink">Lihat situs</Link>
            <form action={logout}>
              <button type="submit" className="rounded-full border border-line px-3 py-1 text-ink-soft hover:text-ink">Keluar</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
