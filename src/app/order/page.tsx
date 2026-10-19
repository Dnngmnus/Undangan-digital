import type { Metadata } from "next";
import { Footer, Header } from "@/components/store/Shell";
import { OrderForm } from "@/components/store/OrderForm";
import { getPackage } from "@/lib/catalog";
import { getDemoInvitation } from "@/lib/demo-data";
import { formatDateDots } from "@/lib/utils";
import { THEMES, getTheme, googleFontsHref } from "@/themes/registry";

export const metadata: Metadata = { title: "Pesan undangan" };

type Props = { searchParams: Promise<{ tema?: string; paket?: string }> };

export default async function OrderPage({ searchParams }: Props) {
  const { tema, paket } = await searchParams;
  const demo = getDemoInvitation();

  return (
    <>
      <link rel="stylesheet" href={googleFontsHref(THEMES)} precedence="default" />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <h1 className="font-serif-display text-3xl sm:text-4xl">Pesan undangan</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Isi data singkat di bawah. Setelah dikirim, WhatsApp terbuka dengan ringkasan pesanan untuk admin.
          Foto dan detail acara bisa dikirim belakangan lewat chat.
        </p>
        <div className="mt-10">
          <OrderForm
            initialTheme={getTheme(tema ?? "")?.id ?? THEMES[0].id}
            initialPackage={getPackage(paket ?? "")?.id ?? "premium"}
            demo={demo.data}
            dateLabel={formatDateDots(demo.eventDate.slice(0, 10))}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
