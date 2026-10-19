#!/usr/bin/env bash
# Build lalu kemas jadi satu file siap pasang: undangan-release.tar.gz
# Dipakai oleh GitHub Actions, deploy/update-stb.sh, dan bisa dijalankan manual
# (Linux/macOS, atau Windows lewat Git Bash).
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${NEXT_PUBLIC_SUPABASE_URL:-}" ] && ! grep -qs "^NEXT_PUBLIC_SUPABASE_URL=." .env.production .env.local; then
  echo "! Supabase belum diisi: build dalam mode demo (katalog & demo tema jalan, pesanan/RSVP/admin nonaktif)."
fi

# npm ci hanya bila node_modules belum ada atau package-lock.json berubah (hemat ±1 menit)
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  echo "==> Memasang dependensi (npm ci)…"
  npm ci
else
  echo "==> Dependensi sudah terpasang, lewati npm ci"
fi

echo "==> Build…"
NEXT_TELEMETRY_DISABLED=1 npm run build

rm -rf release && mkdir -p release
cp -r .next/standalone/. release/
mkdir -p release/.next
cp -r .next/static release/.next/static
if [ -d public ]; then cp -r public release/public; fi
# jangan bawa file env dari mesin build (nilainya sudah ditanam saat build)
rm -f release/.env release/.env.local release/.env.production
# sharp (optimasi gambar) tidak dipakai; binary-nya spesifik OS jadi dibuang
rm -rf release/node_modules/sharp release/node_modules/@img

# pastikan tidak ada binary native: paket harus jalan di x86 maupun ARM64 (STB)
if find release -name "*.node" | grep -q .; then
  echo "✗ Ditemukan binary native di release:" >&2
  find release -name "*.node" >&2
  exit 1
fi

tar -czf undangan-release.tar.gz -C release .
rm -rf release
echo "✓ undangan-release.tar.gz ($(du -h undangan-release.tar.gz | cut -f1))"
