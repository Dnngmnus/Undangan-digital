const ID_LOCALE = "id-ID";

export function formatDateLong(iso: string) {
  // Parse "YYYY-MM-DD" sebagai tanggal lokal agar tidak bergeser zona waktu.
  const d = parseLocalDate(iso);
  return d.toLocaleDateString(ID_LOCALE, { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateDots(iso: string) {
  const d = parseLocalDate(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())} . ${p(d.getMonth() + 1)} . ${d.getFullYear()}`;
}

export function formatDateShort(iso: string) {
  return parseLocalDate(iso).toLocaleDateString(ID_LOCALE, { day: "2-digit", month: "long", year: "numeric" });
}

export function parseLocalDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(iso);
}

export function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  const units: [number, string][] = [
    [31536000, "tahun"], [2592000, "bulan"], [604800, "minggu"],
    [86400, "hari"], [3600, "jam"], [60, "menit"],
  ];
  for (const [sec, label] of units) {
    const v = Math.floor(diff / sec);
    if (v >= 1) return `${v} ${label} lalu`;
  }
  return "baru saja";
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalisasi nomor WA Indonesia: 0812… / +62 812… → 62812… */
export function normalizeWa(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function rupiah(n: number) {
  return "Rp" + n.toLocaleString(ID_LOCALE);
}

/** URL YouTube apa pun (watch, youtu.be, shorts, embed) → URL embed privacy-enhanced. */
export function youtubeEmbed(url: string): string | null {
  const m = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/.exec(url);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` : null;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
