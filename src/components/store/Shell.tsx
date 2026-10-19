import Link from "next/link";
import { env } from "@/lib/env";

export function Wordmark() {
  // Monogram daun + nama brand; satu-satunya "logo" di storefront.
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${env.brandName} beranda`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 text-moss" aria-hidden>
        <path d="M16 29C7 22 5 13 16 3c11 10 9 19 0 26Z" fill="currentColor" />
        <path d="M16 27V9" stroke="#fafbf8" strokeWidth="1.4" />
        <path d="M16 15l-4-3M16 20l5-4" stroke="#fafbf8" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="font-serif-display text-lg">{env.brandName}</span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-porcelain/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Wordmark />
        <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex" aria-label="Utama">
          <Link href="/#fitur" className="hover:text-ink">Fitur</Link>
          <Link href="/#katalog" className="hover:text-ink">Katalog</Link>
          <Link href="/#harga" className="hover:text-ink">Harga</Link>
          <Link href="/#cara-pesan" className="hover:text-ink">Cara pesan</Link>
          <Link href="/#faq" className="hover:text-ink">FAQ</Link>
        </nav>
        {/* Chat admin dipindah ke tombol WhatsApp melayang; header fokus ke aksi utama */}
        <Link href="/order" className="rounded-full bg-moss px-4 py-2 text-sm font-semibold text-paper">
          Pesan sekarang
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Wordmark />
        <p>Undangan pernikahan digital, dibuat dan dikirim dari Indonesia.</p>
        <p>© {new Date().getFullYear()} {env.brandName}</p>
      </div>
    </footer>
  );
}
