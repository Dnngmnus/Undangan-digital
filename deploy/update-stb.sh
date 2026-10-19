#!/usr/bin/env bash
# Build di PC, kirim ke STB, dan pasang — satu perintah.
# Jalankan dari Git Bash (Windows), atau terminal Linux/macOS:
#
#   bash deploy/update-stb.sh ardhea@192.168.0.101
#
# Alamat STB disimpan di deploy/.stb setelah pemakaian pertama, jadi berikutnya cukup:
#
#   bash deploy/update-stb.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SAVED=deploy/.stb
TARGET="${1:-}"
if [ -z "$TARGET" ] && [ -f "$SAVED" ]; then TARGET=$(tr -d '\r\n' < "$SAVED"); fi
if [ -z "$TARGET" ]; then
  echo "Pemakaian: bash deploy/update-stb.sh USER@IP_STB   (contoh: ardhea@192.168.0.101)" >&2
  exit 1
fi
case "$TARGET" in *@*) ;; *) echo "✗ Format harus USER@IP_STB, contoh: ardhea@192.168.0.101" >&2; exit 1 ;; esac
echo "$TARGET" > "$SAVED"

step() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

step "1/3 Build paket"
bash deploy/pack.sh

step "2/3 Mengirim ke $TARGET  (masukkan password STB bila diminta)"
scp undangan-release.tar.gz deploy/install-stb.sh "$TARGET":/tmp/

step "3/3 Memasang di STB  (masukkan password sudo bila diminta)"
# sed: buang CR seandainya install-stb.sh tersimpan dengan line ending Windows
ssh -t "$TARGET" "sed -i 's/\r\$//' /tmp/install-stb.sh && sudo bash /tmp/install-stb.sh /tmp/undangan-release.tar.gz"

printf '\n\033[1;32m✓ Selesai.\033[0m Buka http://%s:3000 dari HP/PC (refresh dengan Ctrl+F5).\n' "${TARGET#*@}"
