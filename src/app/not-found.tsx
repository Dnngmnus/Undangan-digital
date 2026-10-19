import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif-display text-3xl">Undangan tidak ditemukan</h1>
      <p className="mt-3 max-w-sm text-ink-soft">
        Link mungkin salah ketik atau undangan belum dipublikasikan. Periksa kembali link dari pengirim.
      </p>
      <Link href="/" className="mt-8 rounded-full bg-moss px-6 py-3 text-paper">Lihat katalog tema</Link>
    </main>
  );
}
