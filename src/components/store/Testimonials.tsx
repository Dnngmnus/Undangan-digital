import type { Testimonial } from "@/lib/types";
import { getTheme } from "@/themes/registry";

/** Testimoni asli dari dashboard admin. Section tidak dirender bila belum ada isinya. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-blush-soft">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-serif-display text-3xl sm:text-4xl">Kata mereka</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-ink-soft">Kiriman langsung dari pasangan yang sudah memakai undangan kami.</p>
        {/* CSS columns: screenshot chat panjang dan kutipan pendek tersusun rapat */}
        <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
          {items.map((t) => (
            <li key={t.id} className="break-inside-avoid rounded-2xl bg-paper p-4 shadow-sm">
              {t.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.image} alt={`Testimoni ${t.couple}`} loading="lazy" className="w-full rounded-xl" />
              )}
              {t.message && <p className={`${t.image ? "mt-3" : ""} leading-relaxed`}>“{t.message}”</p>}
              <p className="mt-3 text-sm font-semibold">{t.couple}</p>
              {t.theme_id && getTheme(t.theme_id) && <p className="text-xs text-ink-soft">Tema {getTheme(t.theme_id)!.name}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
