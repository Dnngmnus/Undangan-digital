import Link from "next/link";
import { Catalog } from "@/components/store/Catalog";
import { FeatureGrid } from "@/components/store/FeatureGrid";
import { FloatingWa } from "@/components/store/FloatingWa";
import { HeroFan } from "@/components/store/HeroFan";
import { PromoBar } from "@/components/store/PromoBar";
import { Footer, Header } from "@/components/store/Shell";
import { Testimonials } from "@/components/store/Testimonials";
import { ADDONS, PACKAGES, PROMO, TURNAROUND, discountPercent, maxSaving, promoEndsAt } from "@/lib/catalog";
import { getDemoInvitation } from "@/lib/demo-data";
import { env } from "@/lib/env";
import { getPublishedTestimonials } from "@/lib/supabase/public";
import { formatDateDots, rupiah, waLink } from "@/lib/utils";
import { THEMES, catalogTab, googleFontsHref, themeKind } from "@/themes/registry";

// Tanggal demo & akhir promo dihitung relatif hari ini; testimoni baru muncul dalam ≤1 jam.
export const revalidate = 3600;

const STEPS = [
  { t: "Pilih tema", d: "Buka demo, cek tampilannya di ponsel, lalu tekan Pesan." },
  { t: "Isi formulir", d: "Pilih paket dan add-on. Ringkasan pesanan langsung terkirim ke WhatsApp admin." },
  { t: "Bayar & kirim data", d: "Transfer sesuai tagihan, lalu kirim foto dan detail acara lewat chat." },
  { t: "Undangan jadi", d: `Dalam ${TURNAROUND} kamu menerima link undangan dan daftar link per tamu.` },
];

const FAQ = [
  { q: "Bagaimana cara memesan?", a: "Pilih tema di katalog, buka demonya, lalu tekan Pesan. Isi formulir singkat dan kirim ringkasannya ke WhatsApp admin." },
  { q: "Bagaimana cara pembayarannya?", a: "Pembayaran penuh lewat transfer bank setelah admin mengirim tagihan. Kirim bukti transfer di chat yang sama." },
  { q: "Berapa lama undangan selesai?", a: `Paling lambat ${TURNAROUND} setelah data lengkap dan pembayaran diterima. Butuh lebih cepat? Ambil add-on Express.` },
  { q: "Apa itu Tema Motion?", a: "Tema yang sampulnya hidup: foto berganti dengan zoom perlahan atau bergulir, kelopak/kilau melayang, dan ada animasi saat undangan dibuka. Tidak perlu video, cukup foto biasa. Harga paket sama dengan tema lain." },
  { q: "Foto belum siap, bisa pesan dulu?", a: "Bisa. Foto boleh menyusul setelah pemesanan. Kalau tidak ingin memakai foto, pilih dari Tema Non Foto." },
  { q: "Apakah isi undangan bisa diubah?", a: "Semua teks bisa diubah, dan section yang tidak dipakai bisa dihilangkan. Paket Eksklusif mendapat revisi tanpa batas." },
  { q: "Bagaimana cara mengirim ke tamu?", a: "Kamu menerima daftar link per nama tamu beserta teks pengantar yang tinggal ditempel ke WhatsApp." },
  { q: "Apakah bisa refund?", a: "Pembayaran yang sudah diterima tidak dapat dikembalikan. Pastikan tema dan paket sudah sesuai lewat demo sebelum memesan." },
];

export default async function HomePage() {
  const demo = getDemoInvitation();
  const dateLabel = formatDateDots(demo.eventDate.slice(0, 10));
  const testimonials = await getPublishedTestimonials();
  const endsAt = promoEndsAt();
  const endsLabel = endsAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", timeZone: "Asia/Jakarta" });
  const cheapest = Math.min(...PACKAGES.map((p) => p.price));
  const nonFoto = THEMES.filter((t) => themeKind(t) === "non-foto").length;
  const motion = THEMES.filter((t) => catalogTab(t) === "motion").length;
  const promoWa = waLink(env.adminWa, `Halo ${env.brandName}, saya mau klaim ${PROMO.name} untuk undangan digital.`);

  return (
    <>
      <link rel="stylesheet" href={googleFontsHref(THEMES)} precedence="default" />
      {PROMO.active && <PromoBar name={PROMO.name} saving={rupiah(maxSaving)} endsAt={endsAt.toISOString()} waUrl={promoWa} />}
      <Header />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="overflow-hidden bg-moss-deep text-paper">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pb-24 md:pt-20">
            <div>
              {PROMO.active && (
                <p className="inline-block rounded-full bg-marigold px-3 py-1 text-sm font-semibold text-ink">
                  Diskon sampai {Math.max(...PACKAGES.map(discountPercent))}% hingga {endsLabel}
                </p>
              )}
              <Link href="#katalog" className="mt-4 inline-flex items-center gap-2 rounded-full border border-paper/30 px-3 py-1 text-sm text-paper/90 hover:border-marigold">
                <span className="h-2 w-2 animate-pulse rounded-full bg-marigold" aria-hidden />
                Baru: Tema Motion, foto bergerak di sampul
              </Link>
              <h1 className="mt-5 font-serif-display text-4xl leading-[1.08] sm:text-5xl lg:text-[3.6rem]">
                Undangan pernikahan digital yang sampai ke setiap tamu, lengkap dengan namanya.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">
                Bikin sekali, kirim ke ratusan tamu. Tamu konfirmasi hadir, menulis ucapan, dan mengirim amplop digital dari satu link.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={promoWa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-marigold px-6 py-3.5 font-semibold text-ink">
                  Klaim diskon {rupiah(maxSaving)}
                </a>
                <Link href="#katalog" className="rounded-full border border-paper/50 px-6 py-3.5 font-semibold">Lihat katalog</Link>
              </div>

              <ul className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-sm">
                {[
                  [`${THEMES.length} tema`, `${motion} bergerak · ${nonFoto} tanpa foto`],
                  [TURNAROUND, "waktu pengerjaan"],
                  [`${rupiah(cheapest).replace(".000", "rb")}`, "harga mulai"],
                ].map(([a, b]) => (
                  <li key={b} className="rounded-xl bg-paper/10 px-3 py-3">
                    <span className="block whitespace-nowrap font-serif-display text-base text-marigold sm:text-xl">{a}</span>
                    <span className="text-xs text-paper/70 sm:text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <HeroFan data={demo.data} dateLabel={dateLabel} />
          </div>
        </section>

        {/* ---------------- Fitur ---------------- */}
        <section id="fitur" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-center font-serif-display text-3xl sm:text-4xl">Isi setiap undangan</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-ink-soft">Semua yang dibutuhkan tamu, dari sampul sampai amplop digital, ada dalam satu link.</p>
            <div className="mt-10"><FeatureGrid /></div>
          </div>
        </section>

        {/* ---------------- Katalog ---------------- */}
        <section id="katalog" className="scroll-mt-20 bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-center font-serif-display text-3xl sm:text-4xl">Katalog tema</h2>
            <p className="mx-auto mb-8 mt-3 max-w-lg text-center text-ink-soft">
              Yang tampil adalah sampul asli setiap tema, termasuk gerakannya. Tekan salah satunya untuk membuka undangan contoh secara lengkap.
            </p>
            <Catalog data={demo.data} dateLabel={dateLabel} />
          </div>
        </section>

        {/* ---------------- Harga ---------------- */}
        <section id="harga" className="scroll-mt-20 bg-moss-deep text-paper">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-center font-serif-display text-3xl sm:text-4xl">Pilih paket undanganmu</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-paper/75">
              Semua paket bisa memakai tema mana pun.{PROMO.active && ` Harga promo berlaku sampai ${endsLabel}.`}
            </p>
            <div className="mt-12 grid gap-5 md:grid-cols-3 md:items-stretch">
              {PACKAGES.map((p) => {
                const featured = p.id === "premium";
                return (
                  <div key={p.id} className={`relative flex flex-col rounded-3xl bg-paper p-7 text-ink ${featured ? "ring-4 ring-marigold md:-my-3 md:py-10" : ""}`}>
                    {featured && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-marigold px-4 py-1 text-xs font-bold">
                        Paling banyak dipilih
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-display text-2xl">{p.name}</h3>
                      {PROMO.active && <span className="rounded-full bg-blush px-2.5 py-0.5 text-xs font-bold">-{discountPercent(p)}%</span>}
                    </div>
                    {PROMO.active && <p className="mt-4 text-ink-soft line-through">{rupiah(p.originalPrice)}</p>}
                    <p className={`${PROMO.active ? "mt-0.5" : "mt-4"} text-4xl font-bold tracking-tight`}>{rupiah(p.price)}</p>
                    <p className="mt-1 text-sm text-ink-soft">{p.activePeriod}</p>
                    <ul className="mt-6 space-y-2.5 text-sm">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden>
                            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8">
                      <Link
                        href={`/order?paket=${p.id}`}
                        className={`block rounded-full py-3 text-center text-sm font-semibold ${featured ? "bg-marigold text-ink" : "bg-ink text-paper"}`}
                      >
                        Pesan paket {p.name}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------- Add-on ---------------- */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-center font-serif-display text-3xl sm:text-4xl">Tambahan opsional</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-ink-soft">Bisa dipilih langsung saat mengisi formulir pemesanan.</p>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            {ADDONS.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-paper p-5">
                <div>
                  <h3 className="font-semibold">{a.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{a.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-marigold-soft px-3 py-1 text-sm font-semibold">+{rupiah(a.price)}</span>
              </li>
            ))}
          </ul>
        </section>

        <Testimonials items={testimonials} />

        {/* ---------------- Cara pesan (berurutan → bernomor) ---------------- */}
        <section id="cara-pesan" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 className="text-center font-serif-display text-3xl sm:text-4xl">Cara pesan</h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss font-serif-display text-xl text-paper">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section id="faq" className="scroll-mt-20 bg-paper">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <h2 className="text-center font-serif-display text-3xl sm:text-4xl">Pertanyaan umum</h2>
            <div className="mt-10 divide-y divide-line border-y border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {f.q}
                    <span className="text-xl text-moss transition-transform group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CTA penutup ---------------- */}
        <section className="bg-marigold">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="max-w-xl font-serif-display text-3xl sm:text-4xl">Bikin sekali, kirimnya berkali-kali.</h2>
              <p className="mt-2 text-ink/75">Mulai {rupiah(cheapest)}{PROMO.active && `, harga promo sampai ${endsLabel}`}.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/order" className="rounded-full bg-ink px-6 py-3.5 font-semibold text-paper">Pesan sekarang</Link>
              <Link href="#katalog" className="rounded-full border border-ink px-6 py-3.5 font-semibold">Lihat katalog</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWa href={waLink(env.adminWa, `Halo ${env.brandName}, saya mau tanya soal undangan digital.`)} />
    </>
  );
}
