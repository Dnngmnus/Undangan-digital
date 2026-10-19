import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Bundle mandiri (.next/standalone) tanpa node_modules penuh — ringan untuk STB/VPS kecil.
  output: "standalone",
  // Foto undangan dirender dengan <img> biasa (sumbernya bebas: Supabase Storage, Drive, CDN),
  // jadi optimasi gambar Next tidak dipakai. Mematikannya juga membuat `sharp` (binary native)
  // tidak dibutuhkan, sehingga hasil build di GitHub (x86) bisa langsung jalan di STB ARM64.
  images: { unoptimized: true },
  outputFileTracingExcludes: {
    "*": ["node_modules/sharp/**", "node_modules/@img/**"],
  },
};

export default nextConfig;
