#!/usr/bin/env bash
# Build lalu kemas jadi satu file siap pasang: undangan-release.tar.gz
# Dipakai oleh GitHub Actions (.github/workflows/release.yml) dan bisa juga dijalankan di PC.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${NEXT_PUBLIC_SUPABASE_URL:-}" ] && [ ! -f .env.local ] && [ ! -f .env.production ]; then
  echo "! Supabase belum diisi: build dalam mode demo (katalog & demo tema jalan, pesanan/RSVP/admin nonaktif)."
fi

npm ci
npm run build

rm -rf release && mkdir -p release
cp -r .next/standalone/. release/
mkdir -p release/.next
cp -r .next/static release/.next/static
if [ -d public ]; then cp -r public release/public; fi
# jangan ikut membawa file env dari mesin build
rm -f release/.env release/.env.local release/.env.production

# pastikan tidak ada binary native (harus jalan di x86 maupun ARM64)
if find release -name "*.node" | grep -q .; then
  echo "✗ Ditemukan binary native di release:" >&2
  find release -name "*.node" >&2
  exit 1
fi

tar -czf undangan-release.tar.gz -C release .
rm -rf release
echo "✓ undangan-release.tar.gz ($(du -h undangan-release.tar.gz | cut -f1))"
