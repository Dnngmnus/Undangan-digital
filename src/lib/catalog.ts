export type Package = {
  id: "basic" | "premium" | "eksklusif";
  name: string;
  /** Harga normal (ditampilkan dicoret saat promo aktif). */
  originalPrice: number;
  price: number;
  activePeriod: string;
  features: string[];
};

/** Paket berlaku untuk semua tema — yang membedakan hanya fitur. */
export const PACKAGES: Package[] = [
  {
    id: "basic",
    name: "Basic",
    originalPrice: 150_000,
    price: 79_000,
    activePeriod: "Aktif 3 bulan",
    features: ["Semua tema katalog", "Nama tamu tanpa batas", "Countdown & Google Maps", "RSVP & ucapan", "Kutipan ayat"],
  },
  {
    id: "premium",
    name: "Premium",
    originalPrice: 250_000,
    price: 149_000,
    activePeriod: "Aktif 1 tahun",
    features: ["Semua fitur Basic", "Galeri hingga 20 foto", "Video prewedding (YouTube)", "Musik latar pilihan", "Love story", "Amplop digital", "Simpan ke kalender"],
  },
  {
    id: "eksklusif",
    name: "Eksklusif",
    originalPrice: 450_000,
    price: 249_000,
    activePeriod: "Aktif selamanya",
    features: ["Semua fitur Premium", "Revisi tanpa batas", "Link live streaming", "Daftar link tamu siap kirim", "Rekap RSVP (CSV)", "Prioritas pengerjaan"],
  },
];

export function getPackage(id: string) {
  return PACKAGES.find((p) => p.id === id);
}

/* ------------------------------------------------------------------ */
/* Add-on berbayar                                                     */
/* ------------------------------------------------------------------ */
export type Addon = { id: string; name: string; description: string; price: number };

export const ADDONS: Addon[] = [
  { id: "express", name: "Express hari yang sama", description: "Undangan jadi di hari yang sama bila data masuk sebelum pukul 12.00.", price: 50_000 },
  { id: "foto-10", name: "Tambahan 10 foto galeri", description: "Untuk galeri yang lebih panjang dari batas paket.", price: 30_000 },
  { id: "font", name: "Font custom", description: "Ganti huruf judul dengan font pilihanmu.", price: 50_000 },
  { id: "warna", name: "Warna custom", description: "Sesuaikan warna tema dengan dekorasi atau seragam keluarga.", price: 50_000 },
];

export const getAddon = (id: string) => ADDONS.find((a) => a.id === id);

/** Waktu pengerjaan standar (dipakai di hero, FAQ, dan cara pesan). */
export const TURNAROUND = "2×24 jam";

/* ------------------------------------------------------------------ */
/* Promo — ubah di sini, atau set PROMO.active = false untuk mematikan */
/* ------------------------------------------------------------------ */
export const PROMO = {
  active: true,
  name: "Promo Gajian",
  /** Akhir promo default: hari terakhir bulan berjalan pukul 23.59 WIB. Ganti dengan ISO string bila perlu tanggal tetap. */
  endsAt: null as string | null,
};

export function promoEndsAt(now = new Date()): Date {
  if (PROMO.endsAt) return new Date(PROMO.endsAt);
  // hari terakhir bulan ini, 23:59:59 WIB (UTC+7)
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  return new Date(Date.UTC(y, m + 1, 0, 16, 59, 59)); // 23:59:59 WIB = 16:59:59 UTC
}

/** Selisih terbesar harga normal vs promo, untuk teks "hemat s.d. Rp…". */
export const maxSaving = Math.max(...PACKAGES.map((p) => p.originalPrice - p.price));

export function discountPercent(p: Package) {
  return Math.round((1 - p.price / p.originalPrice) * 100);
}
