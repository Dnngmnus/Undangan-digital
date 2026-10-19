// `||` (bukan `??`): variabel yang di-set tapi kosong (mis. GitHub Variables belum diisi)
// harus jatuh ke nilai default, bukan string kosong.
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  adminWa: process.env.NEXT_PUBLIC_ADMIN_WA || "6281234567890",
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || "Abati Invitation",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

/** Katalog & preview tetap jalan tanpa Supabase; fitur DB dimatikan bila belum dikonfigurasi. */
export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
