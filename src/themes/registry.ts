/**
 * Registry tema. Menambah tema baru = menambah satu objek di THEMES.
 * Semua tema dirender oleh komponen yang sama (src/components/invitation),
 * perbedaannya hanya di token: palet, font, ornamen, dan layout cover.
 */

export type OrnamentKind = "botanical" | "deco" | "kawung" | "line" | "boho" | "wave";
export type CoverLayout = "arch" | "frame" | "full" | "split";
export type ThemeCategory = "Floral" | "Elegan" | "Minimalis" | "Tradisional" | "Rustic" | "Gelap";

export type Theme = {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;
  palette: {
    bg: string;
    surface: string;
    ink: string;
    muted: string;
    primary: string;
    onPrimary: string;
    accent: string;
  };
  fonts: { script: string; display: string; body: string };
  ornament: OrnamentKind;
  cover: CoverLayout;
  /** "non-foto": undangan tanpa foto sama sekali (mempelai pakai monogram, galeri disembunyikan). Default "foto". */
  kind?: ThemeKind;
  badge?: "Baru" | "Terlaris";
};

export type ThemeKind = "foto" | "non-foto";
export const themeKind = (t: Theme): ThemeKind => t.kind ?? "foto";

export const THEMES: Theme[] = [
  {
    id: "sage-botani",
    name: "Sage Botani",
    category: "Floral",
    description: "Hijau sage dan ranting daun, bingkai foto berbentuk lengkung.",
    palette: { bg: "#EEF1E8", surface: "#FBFCF8", ink: "#2F3B2F", muted: "#6B7A66", primary: "#5F7D55", onPrimary: "#FBFCF8", accent: "#C2A169" },
    fonts: { script: "Pinyon Script", display: "Cormorant Garamond", body: "Lora" },
    ornament: "botanical",
    cover: "arch",
    badge: "Terlaris",
  },
  {
    id: "royal-navy",
    name: "Royal Navy",
    category: "Elegan",
    description: "Biru malam dengan garis emas art deco. Formal dan megah.",
    palette: { bg: "#0F2038", surface: "#162B4A", ink: "#F2E8D2", muted: "#B6AC94", primary: "#C9A45C", onPrimary: "#0F2038", accent: "#E2C98B" },
    fonts: { script: "Great Vibes", display: "Cinzel", body: "Marcellus" },
    ornament: "deco",
    cover: "frame",
    kind: "non-foto",
  },
  {
    id: "dusty-rose",
    name: "Dusty Rose",
    category: "Floral",
    description: "Merah muda pudar, foto penuh layar, tipografi klasik.",
    palette: { bg: "#F6ECEA", surface: "#FFF9F8", ink: "#4A2E33", muted: "#8C6B70", primary: "#A9636F", onPrimary: "#FFF9F8", accent: "#D9A9A0" },
    fonts: { script: "Parisienne", display: "Playfair Display", body: "Lora" },
    ornament: "line",
    cover: "full",
  },
  {
    id: "jawa-klasik",
    name: "Jawa Klasik",
    category: "Tradisional",
    description: "Cokelat sogan dan emas dengan motif kawung. Cocok untuk adat Jawa.",
    palette: { bg: "#2A1C14", surface: "#3A281D", ink: "#F1E3C6", muted: "#C2AD86", primary: "#C08E36", onPrimary: "#2A1C14", accent: "#D9B46A" },
    fonts: { script: "Alex Brush", display: "Cinzel", body: "Marcellus" },
    ornament: "kawung",
    cover: "frame",
    kind: "non-foto",
    badge: "Baru",
  },
  {
    id: "terracotta-boho",
    name: "Boho Senja",
    category: "Rustic",
    description: "Warna tanah liat dan lengkung matahari terbenam. Santai dan hangat.",
    palette: { bg: "#F3E4D7", surface: "#FBF3EC", ink: "#4B2C20", muted: "#8A6352", primary: "#A9563A", onPrimary: "#FBF3EC", accent: "#D79B6B" },
    fonts: { script: "Sacramento", display: "DM Serif Display", body: "Josefin Sans" },
    ornament: "boho",
    cover: "arch",
  },
  {
    id: "emerald-night",
    name: "Emerald Night",
    category: "Gelap",
    description: "Hijau zamrud gelap, daun emas. Untuk resepsi malam hari.",
    palette: { bg: "#0D2822", surface: "#13362E", ink: "#EDE6D6", muted: "#A9B8A9", primary: "#D4B06A", onPrimary: "#0D2822", accent: "#7FA88E" },
    fonts: { script: "Great Vibes", display: "Playfair Display", body: "Lora" },
    ornament: "botanical",
    cover: "arch",
    badge: "Baru",
  },
  {
    id: "monokrom",
    name: "Monokrom",
    category: "Minimalis",
    description: "Hitam-putih, tata letak editorial, tanpa ornamen berlebih.",
    palette: { bg: "#FFFFFF", surface: "#F3F3F1", ink: "#1A1A1A", muted: "#6E6E6E", primary: "#1A1A1A", onPrimary: "#FFFFFF", accent: "#9A9A9A" },
    fonts: { script: "Italiana", display: "Italiana", body: "Josefin Sans" },
    ornament: "line",
    cover: "split",
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    category: "Floral",
    description: "Ungu lavender lembut dengan ranting bunga tipis.",
    palette: { bg: "#EEEAF4", surface: "#FBF9FE", ink: "#3B3352", muted: "#7A7191", primary: "#7B6AA0", onPrimary: "#FBF9FE", accent: "#C8B6E2" },
    fonts: { script: "Parisienne", display: "Cormorant Garamond", body: "Lora" },
    ornament: "botanical",
    cover: "full",
  },
  {
    id: "pantai-biru",
    name: "Pantai Biru",
    category: "Minimalis",
    description: "Biru laut dan pasir. Untuk pernikahan outdoor atau di pantai.",
    palette: { bg: "#E6F0F1", surface: "#FFFFFF", ink: "#1E3D45", muted: "#5E7E85", primary: "#2A6F7B", onPrimary: "#FFFFFF", accent: "#E3B577" },
    fonts: { script: "Sacramento", display: "Marcellus", body: "Josefin Sans" },
    ornament: "wave",
    cover: "arch",
  },
  {
    id: "marun-kebaya",
    name: "Marun Kebaya",
    category: "Tradisional",
    description: "Merah marun dan emas, motif kawung. Nuansa kebaya dan pelaminan.",
    palette: { bg: "#4A1420", surface: "#5C1B2A", ink: "#F6E7D4", muted: "#D8B9A3", primary: "#D8A848", onPrimary: "#4A1420", accent: "#E8C27A" },
    fonts: { script: "Pinyon Script", display: "Cinzel", body: "Marcellus" },
    ornament: "kawung",
    cover: "arch",
  },
  {
    id: "kraft-rustic",
    name: "Kraft Rustic",
    category: "Rustic",
    description: "Kertas kraft dan dedaunan kering, kesan buatan tangan.",
    palette: { bg: "#E8DAC5", surface: "#F3EADB", ink: "#3E2F22", muted: "#7B6650", primary: "#7A5A3A", onPrimary: "#F3EADB", accent: "#A88A5A" },
    fonts: { script: "Alex Brush", display: "DM Serif Display", body: "Lora" },
    ornament: "botanical",
    cover: "frame",
  },
  {
    id: "ivory-gold",
    name: "Ivory Gold",
    category: "Elegan",
    description: "Gading dan emas dengan bingkai art deco. Klasik dan islami.",
    palette: { bg: "#F7F2E6", surface: "#FFFDF7", ink: "#3A3122", muted: "#857A63", primary: "#A8823A", onPrimary: "#FFFDF7", accent: "#D6BC82" },
    fonts: { script: "Great Vibes", display: "Cormorant Garamond", body: "Marcellus" },
    ornament: "deco",
    cover: "frame",
    kind: "non-foto",
  },
  {
    id: "sakura-blush",
    name: "Sakura Blush",
    category: "Floral",
    description: "Merah muda sakura dan ranting bunga, lembut dan romantis.",
    palette: { bg: "#FBEFF1", surface: "#FFFAFB", ink: "#4E2F38", muted: "#94707A", primary: "#C0607A", onPrimary: "#FFFAFB", accent: "#E7A9B8" },
    fonts: { script: "Great Vibes", display: "Cormorant Garamond", body: "Lora" },
    ornament: "botanical",
    cover: "arch",
    badge: "Baru",
  },
  {
    id: "melati-putih",
    name: "Melati Putih",
    category: "Tradisional",
    description: "Putih gading dan hijau daun pandan dengan motif kawung. Tanpa foto.",
    palette: { bg: "#F4F3EA", surface: "#FFFFFA", ink: "#24372B", muted: "#66786B", primary: "#2F5D45", onPrimary: "#FFFFFA", accent: "#B49A5A" },
    fonts: { script: "Pinyon Script", display: "Cinzel", body: "Marcellus" },
    ornament: "kawung",
    cover: "frame",
    kind: "non-foto",
  },
  {
    id: "champagne",
    name: "Champagne",
    category: "Elegan",
    description: "Krem sampanye dan garis art deco, foto penuh layar.",
    palette: { bg: "#F3EADC", surface: "#FBF6EE", ink: "#3D3326", muted: "#857762", primary: "#9A7440", onPrimary: "#FBF6EE", accent: "#CDB386" },
    fonts: { script: "Pinyon Script", display: "Playfair Display", body: "Lora" },
    ornament: "deco",
    cover: "full",
  },
  {
    id: "kobalt",
    name: "Kobalt",
    category: "Minimalis",
    description: "Biru kobalt dan putih, tata letak editorial yang tegas.",
    palette: { bg: "#F5F7FC", surface: "#FFFFFF", ink: "#14214D", muted: "#5A668C", primary: "#2441A8", onPrimary: "#FFFFFF", accent: "#9AAAE0" },
    fonts: { script: "Italiana", display: "Italiana", body: "Josefin Sans" },
    ornament: "line",
    cover: "split",
  },
  {
    id: "olive-garden",
    name: "Olive Garden",
    category: "Rustic",
    description: "Hijau zaitun dan ranting kering, cocok untuk garden party.",
    palette: { bg: "#ECEBDD", surface: "#F8F7EE", ink: "#33351F", muted: "#73755A", primary: "#5E6230", onPrimary: "#F8F7EE", accent: "#B8A36A" },
    fonts: { script: "Alex Brush", display: "Cormorant Garamond", body: "Lora" },
    ornament: "botanical",
    cover: "arch",
  },
  {
    id: "midnight-plum",
    name: "Midnight Plum",
    category: "Gelap",
    description: "Ungu plum pekat dengan aksen emas mawar. Megah untuk malam hari.",
    palette: { bg: "#2A1630", surface: "#3A2141", ink: "#F3E6EE", muted: "#C3A9BA", primary: "#E0B07E", onPrimary: "#2A1630", accent: "#B98AA8" },
    fonts: { script: "Parisienne", display: "Playfair Display", body: "Lora" },
    ornament: "deco",
    cover: "full",
  },
];

export const CATEGORIES: ThemeCategory[] = ["Floral", "Elegan", "Minimalis", "Tradisional", "Rustic", "Gelap"];

export function getTheme(id: string): Theme | undefined {
  return THEMES.find((t) => t.id === id);
}

/** Fallback aman bila theme_id di DB sudah tidak ada di registry. */
export function getThemeOrDefault(id: string): Theme {
  return getTheme(id) ?? THEMES[0];
}

/** URL Google Fonts untuk sekumpulan tema (dedupe family). */
export function googleFontsHref(themes: Theme[]) {
  const families = new Set<string>();
  themes.forEach((t) => Object.values(t.fonts).forEach((f) => families.add(f)));
  const weights: Record<string, string> = {
    "Cormorant Garamond": ":ital,wght@0,400;0,600;1,400",
    "Playfair Display": ":ital,wght@0,400;0,600;1,400",
    Lora: ":ital,wght@0,400;0,600;1,400",
    "Josefin Sans": ":wght@300;400;600",
    Cinzel: ":wght@400;600",
  };
  const q = [...families]
    .map((f) => `family=${f.replace(/ /g, "+")}${weights[f] ?? ""}`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}

/** CSS custom properties yang dipasang di root undangan. */
export function themeVars(t: Theme): React.CSSProperties {
  return {
    "--bg": t.palette.bg,
    "--surface": t.palette.surface,
    "--ink": t.palette.ink,
    "--muted": t.palette.muted,
    "--primary": t.palette.primary,
    "--on-primary": t.palette.onPrimary,
    "--accent": t.palette.accent,
    "--tf-script": `"${t.fonts.script}", cursive`,
    "--tf-display": `"${t.fonts.display}", serif`,
    "--tf-body": `"${t.fonts.body}", serif`,
  } as React.CSSProperties;
}
