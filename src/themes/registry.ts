/**
 * Registry tema. Menambah tema baru = menambah satu objek di THEMES.
 * Semua tema dirender oleh komponen yang sama (src/components/invitation),
 * perbedaannya hanya di token: palet, font, ornamen, dan layout cover.
 */

export type OrnamentKind = "botanical" | "deco" | "kawung" | "line" | "boho" | "wave" | "floral" | "islamic" | "tropical" | "megamendung" | "watercolor" | "gunungan" | "parang" | "truntum" | "janur";
export type CoverLayout = "arch" | "frame" | "full" | "split" | "circle" | "polaroid" | "magazine" | "monogram";
export type ThemeCategory = "Floral" | "Elegan" | "Minimalis" | "Jawa" | "Tradisional" | "Rustic" | "Gelap";

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
  /** "mono": foto sampul ditampilkan hitam-putih (tema monokrom). */
  photoTone?: "mono";
  /** "jawa": judul bagian memakai bahasa Jawa (krama). */
  labels?: "jawa";
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
    category: "Jawa",
    description: "Cokelat sogan dan emas dengan motif kawung. Cocok untuk adat Jawa.",
    palette: { bg: "#2A1C14", surface: "#3A281D", ink: "#F1E3C6", muted: "#C2AD86", primary: "#C08E36", onPrimary: "#2A1C14", accent: "#D9B46A" },
    fonts: { script: "Alex Brush", display: "Cinzel", body: "Marcellus" },
    ornament: "kawung",
    cover: "frame",
    kind: "non-foto",
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
    photoTone: "mono",
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
    category: "Jawa",
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
  },
  {
    id: "melati-putih",
    name: "Melati Putih",
    category: "Jawa",
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
    photoTone: "mono",
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
  {
    id: "rose-garden",
    name: "Rose Garden",
    category: "Floral",
    description: "Mawar merah muda dan bingkai foto bulat bercincin ganda.",
    palette: { bg: "#FBF1EE", surface: "#FFF8F6", ink: "#4A2A2C", muted: "#92706F", primary: "#B4505E", onPrimary: "#FFF8F6", accent: "#E2A3A0" },
    fonts: { script: "Great Vibes", display: "Cormorant Garamond", body: "Lora" },
    ornament: "floral",
    cover: "circle",
  },
  {
    id: "peony-cream",
    name: "Peony Cream",
    category: "Floral",
    description: "Bunga peony di atas krem, foto gaya polaroid.",
    palette: { bg: "#F7EFE4", surface: "#FFFBF5", ink: "#4D3B2E", muted: "#8F7B69", primary: "#C26A5A", onPrimary: "#FFFBF5", accent: "#E9B8A0" },
    fonts: { script: "Sacramento", display: "Playfair Display", body: "Lora" },
    ornament: "floral",
    cover: "polaroid",
  },
  {
    id: "lilac-garden",
    name: "Lilac Garden",
    category: "Floral",
    description: "Ungu lilac dan bunga kecil, bingkai lengkung.",
    palette: { bg: "#F3EEF7", surface: "#FCFAFE", ink: "#3D3050", muted: "#7C6F90", primary: "#8A6BB0", onPrimary: "#FCFAFE", accent: "#D2B9E6" },
    fonts: { script: "Parisienne", display: "Cormorant Garamond", body: "Lora" },
    ornament: "floral",
    cover: "arch",
  },
  {
    id: "biru-cat-air",
    name: "Biru Cat Air",
    category: "Floral",
    description: "Sapuan cat air biru muda, foto polaroid.",
    palette: { bg: "#F2F6FA", surface: "#FFFFFF", ink: "#23344A", muted: "#66778F", primary: "#4A74A8", onPrimary: "#FFFFFF", accent: "#A9C3E0" },
    fonts: { script: "Parisienne", display: "Cormorant Garamond", body: "Lora" },
    ornament: "watercolor",
    cover: "polaroid",
  },
  {
    id: "blush-cat-air",
    name: "Blush Cat Air",
    category: "Floral",
    description: "Cat air merah muda lembut, foto bulat.",
    palette: { bg: "#FCF3F1", surface: "#FFFFFF", ink: "#4B3035", muted: "#93747A", primary: "#B96D7A", onPrimary: "#FFFFFF", accent: "#F0C2C3" },
    fonts: { script: "Great Vibes", display: "Playfair Display", body: "Lora" },
    ornament: "watercolor",
    cover: "circle",
  },
  {
    id: "nur-emerald",
    name: "Nur Emerald",
    category: "Elegan",
    description: "Hijau zamrud dan emas dengan bintang segi delapan. Nuansa islami.",
    palette: { bg: "#F3F1E8", surface: "#FFFEF8", ink: "#1F3A30", muted: "#5E7468", primary: "#1F6B4F", onPrimary: "#FFFEF8", accent: "#C2A14E" },
    fonts: { script: "Great Vibes", display: "Cinzel", body: "Marcellus" },
    ornament: "islamic",
    cover: "arch",
    badge: "Terlaris",
  },
  {
    id: "masjid-biru",
    name: "Masjid Biru",
    category: "Gelap",
    description: "Biru malam dan emas dengan pola geometri islami.",
    palette: { bg: "#13233F", surface: "#1B2F52", ink: "#EEF1F6", muted: "#A9B4C8", primary: "#D6B56E", onPrimary: "#13233F", accent: "#8FA6CF" },
    fonts: { script: "Pinyon Script", display: "Cinzel", body: "Marcellus" },
    ornament: "islamic",
    cover: "circle",
  },
  {
    id: "gold-luxe",
    name: "Gold Luxe",
    category: "Elegan",
    description: "Hitam dan emas bergaya sampul majalah. Mewah dan berani.",
    palette: { bg: "#141210", surface: "#1E1B17", ink: "#F2EAD8", muted: "#B8AC93", primary: "#D4AF61", onPrimary: "#141210", accent: "#C9A55A" },
    fonts: { script: "Pinyon Script", display: "Cinzel", body: "Marcellus" },
    ornament: "deco",
    cover: "magazine",
  },
  {
    id: "noir-editorial",
    name: "Noir Editorial",
    category: "Minimalis",
    description: "Hitam-putih bergaya majalah fashion.",
    palette: { bg: "#F5F4F0", surface: "#FFFFFF", ink: "#161616", muted: "#6A6A6A", primary: "#161616", onPrimary: "#FFFFFF", accent: "#D9C3A0" },
    fonts: { script: "Italiana", display: "Italiana", body: "Josefin Sans" },
    ornament: "line",
    cover: "magazine",
    photoTone: "mono",
  },
  {
    id: "tropis-bali",
    name: "Tropis Bali",
    category: "Rustic",
    description: "Daun monstera dan palem. Cocok untuk pernikahan di Bali atau pantai.",
    palette: { bg: "#EFF3EA", surface: "#FAFCF7", ink: "#1F3B2C", muted: "#5E7A66", primary: "#2E6B47", onPrimary: "#FAFCF7", accent: "#E2B15B" },
    fonts: { script: "Sacramento", display: "DM Serif Display", body: "Josefin Sans" },
    ornament: "tropical",
    cover: "full",
  },
  {
    id: "monstera-night",
    name: "Monstera Night",
    category: "Gelap",
    description: "Hijau tropis gelap bergaya majalah.",
    palette: { bg: "#10241C", surface: "#173226", ink: "#EAF1EA", muted: "#A3B9AA", primary: "#C9B37A", onPrimary: "#10241C", accent: "#8FC4A0" },
    fonts: { script: "Italiana", display: "Playfair Display", body: "Josefin Sans" },
    ornament: "tropical",
    cover: "magazine",
  },
  {
    id: "mega-mendung",
    name: "Mega Mendung",
    category: "Tradisional",
    description: "Motif awan batik Cirebon dalam biru indigo.",
    palette: { bg: "#E9EEF6", surface: "#F8FAFD", ink: "#1C2B4A", muted: "#5A6A8A", primary: "#2B4A8A", onPrimary: "#F8FAFD", accent: "#B0473A" },
    fonts: { script: "Alex Brush", display: "Cinzel", body: "Marcellus" },
    ornament: "megamendung",
    cover: "circle",
  },
  {
    id: "mendung-merah",
    name: "Mendung Merah",
    category: "Tradisional",
    description: "Mega mendung merah bata dan biru, bingkai lengkung.",
    palette: { bg: "#F6ECE6", surface: "#FFF8F4", ink: "#4A1E1A", muted: "#8C5F58", primary: "#9E2F28", onPrimary: "#FFF8F4", accent: "#2F4A7A" },
    fonts: { script: "Pinyon Script", display: "Cinzel", body: "Marcellus" },
    ornament: "megamendung",
    cover: "arch",
  },
  {
    id: "senja-polaroid",
    name: "Senja Polaroid",
    category: "Rustic",
    description: "Warna senja dan lengkung boho, foto polaroid.",
    palette: { bg: "#F2E3D3", surface: "#FBF4EC", ink: "#4A2F22", muted: "#8B6A57", primary: "#9C5B3B", onPrimary: "#FBF4EC", accent: "#D9A673" },
    fonts: { script: "Sacramento", display: "DM Serif Display", body: "Josefin Sans" },
    ornament: "boho",
    cover: "polaroid",
  },
  {
    id: "kayon-indigo",
    name: "Kayon Indigo",
    category: "Jawa",
    description: "Gunungan wayang emas di atas biru indigo, sampul monogram. Tanpa foto.",
    palette: { bg: "#1B2447", surface: "#243059", ink: "#F1EBDD", muted: "#B5AEC4", primary: "#D9B566", onPrimary: "#1B2447", accent: "#A9B6E0" },
    fonts: { script: "Pinyon Script", display: "Cinzel", body: "Marcellus" },
    ornament: "gunungan",
    cover: "monogram",
    kind: "non-foto",
    labels: "jawa",
    badge: "Baru",
  },
  {
    id: "truntum-gading",
    name: "Truntum Gading",
    category: "Jawa",
    description: "Motif truntum di atas gading, sampul monogram. Tanpa foto.",
    palette: { bg: "#F6F0E1", surface: "#FFFBF2", ink: "#3E2C1E", muted: "#8A7660", primary: "#8B5E2B", onPrimary: "#FFFBF2", accent: "#C7A15A" },
    fonts: { script: "Alex Brush", display: "Cinzel", body: "Marcellus" },
    ornament: "truntum",
    cover: "monogram",
    kind: "non-foto",
    labels: "jawa",
  },
  {
    id: "keraton-beludru",
    name: "Keraton Beludru",
    category: "Jawa",
    description: "Hitam beludru, emas, dan aksen merah. Gunungan dan monogram ala keraton.",
    palette: { bg: "#16120E", surface: "#211B15", ink: "#F3E7CF", muted: "#BFAE8E", primary: "#D2A548", onPrimary: "#16120E", accent: "#B5473F" },
    fonts: { script: "Pinyon Script", display: "Cinzel", body: "Marcellus" },
    ornament: "gunungan",
    cover: "monogram",
    labels: "jawa",
    badge: "Baru",
  },
  {
    id: "wayang-ungu",
    name: "Wayang Ungu",
    category: "Jawa",
    description: "Ungu tua dan emas dengan gunungan wayang, foto bulat.",
    palette: { bg: "#2B1838", surface: "#3A2249", ink: "#F3E6F0", muted: "#C4A9C8", primary: "#E0BA6A", onPrimary: "#2B1838", accent: "#B58AC9" },
    fonts: { script: "Great Vibes", display: "Cinzel", body: "Marcellus" },
    ornament: "gunungan",
    cover: "circle",
    labels: "jawa",
  },
  {
    id: "sekar-truntum",
    name: "Sekar Truntum",
    category: "Jawa",
    description: "Merah muda dan emas bermotif truntum, lambang cinta yang tumbuh kembali.",
    palette: { bg: "#F7E9E6", surface: "#FFF7F5", ink: "#4E2B2E", muted: "#94706F", primary: "#A8545F", onPrimary: "#FFF7F5", accent: "#C9A15E" },
    fonts: { script: "Great Vibes", display: "Cinzel", body: "Lora" },
    ornament: "truntum",
    cover: "arch",
    labels: "jawa",
    badge: "Baru",
  },
  {
    id: "truntum-toska",
    name: "Truntum Toska",
    category: "Jawa",
    description: "Toska dan emas dengan taburan truntum, foto penuh layar.",
    palette: { bg: "#E5F0EE", surface: "#F6FBFA", ink: "#163C3A", muted: "#5C7E7B", primary: "#1F6D69", onPrimary: "#F6FBFA", accent: "#C9A45A" },
    fonts: { script: "Pinyon Script", display: "Cinzel", body: "Marcellus" },
    ornament: "truntum",
    cover: "full",
    labels: "jawa",
  },
  {
    id: "parang-ijo",
    name: "Parang Ijo Botol",
    category: "Jawa",
    description: "Hijau botol dan emas bermotif parang, foto bulat.",
    palette: { bg: "#12352B", surface: "#18443A", ink: "#F0E9D6", muted: "#AFC2B5", primary: "#D7B46A", onPrimary: "#12352B", accent: "#8FB79F" },
    fonts: { script: "Pinyon Script", display: "Cinzel", body: "Marcellus" },
    ornament: "parang",
    cover: "circle",
    labels: "jawa",
  },
  {
    id: "janur-kuning",
    name: "Janur Kuning",
    category: "Jawa",
    description: "Kuning janur dan hijau daun, untaian janur menggantung. Ceria untuk adat Jawa.",
    palette: { bg: "#F8F1D9", surface: "#FFFBEA", ink: "#3A3A1C", muted: "#7C7B57", primary: "#6F7F2A", onPrimary: "#FFFBEA", accent: "#D7B23B" },
    fonts: { script: "Sacramento", display: "Cormorant Garamond", body: "Lora" },
    ornament: "janur",
    cover: "arch",
    labels: "jawa",
  },
];

export const CATEGORIES: ThemeCategory[] = ["Jawa", "Floral", "Elegan", "Minimalis", "Tradisional", "Rustic", "Gelap"];

/** Teks tetap undangan, mengikuti `theme.labels`. Isi (nama, acara, ucapan) tetap dari data. */
export type ThemeText = {
  weddingOf: string;
  to: string;
  open: string;
  couple: string;
  countdown: string;
  events: string;
  story: string;
  gallery: string;
  gift: string;
  wishes: string;
  hosts: string;
};

const TEXT_ID: ThemeText = {
  weddingOf: "The Wedding of",
  to: "Kepada Yth. Bapak/Ibu/Saudara/i",
  open: "Buka undangan",
  couple: "Bride & Groom",
  countdown: "Menghitung Hari",
  events: "Rangkaian Acara",
  story: "Kisah Kami",
  gallery: "Galeri",
  gift: "Tanda Kasih",
  wishes: "Ucapan & Doa",
  hosts: "Kami yang berbahagia,",
};

const TEXT_JAWA: ThemeText = {
  weddingOf: "Pawiwahan",
  to: "Katur dhumateng Bapak/Ibu/Sedherek",
  open: "Buka undangan",
  couple: "Temanten",
  countdown: "Ngetang Dinten",
  events: "Rantaman Adicara",
  story: "Lelampahan Tresna",
  gallery: "Kenangan",
  gift: "Pisungsung",
  wishes: "Pangestu lan Donga",
  hosts: "Ingkang kagungan kersa,",
};

export function themeText(t: Theme): ThemeText {
  return t.labels === "jawa" ? TEXT_JAWA : TEXT_ID;
}

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
