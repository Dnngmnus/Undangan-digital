#!/usr/bin/env bash
# Pasang / update Undangan Digital di STB (Armbian/Debian ARM64) atau server Debian/Ubuntu.
#
# Dari GitHub Release (hasil workflow .github/workflows/release.yml):
#   sudo bash install-stb.sh USERNAME/NAMA-REPO
# Repo private: sertakan token (fine-grained, izin "Contents: Read"):
#   sudo GH_TOKEN=github_pat_xxx bash install-stb.sh USERNAME/NAMA-REPO
# Dari file lokal:
#   sudo bash install-stb.sh ./undangan-release.tar.gz
#
# Opsi (env): HOST=0.0.0.0 (default, bisa diakses dari LAN) | HOST=127.0.0.1 (untuk Cloudflare Tunnel)
#             PORT=3000
set -euo pipefail

SRC="${1:-}"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-3000}"
APP_DIR=/opt/undangan
APP_USER=undangan
SERVICE=/etc/systemd/system/undangan.service

info() { printf '\033[1;32m==>\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Jalankan dengan sudo."
[ -n "$SRC" ] || die "Pemakaian: sudo bash install-stb.sh USERNAME/NAMA-REPO  (atau path ke undangan-release.tar.gz)"

case "$(uname -m)" in
  aarch64|x86_64) ;;
  *) die "Arsitektur $(uname -m) tidak didukung. Pasang Armbian/Debian 64-bit (aarch64)." ;;
esac

# --- Jam sistem: STB tidak punya baterai RTC; jam salah membuat login Supabase gagal ---
timedatectl set-ntp true 2>/dev/null || true

# --- Node.js >= 20.9 (dibutuhkan Next.js 16) ---
need_node=1
if command -v node >/dev/null; then
  v=$(node -p 'process.versions.node.split(".").map(Number).reduce((a,n,i)=>a+n*[1e6,1e3,1][i],0)')
  [ "$v" -ge 20009000 ] && need_node=0
fi
if [ "$need_node" -eq 1 ]; then
  info "Memasang Node.js 22…"
  apt-get update -qq
  apt-get install -y -qq curl ca-certificates >/dev/null
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
info "Node $(node -v)"

# --- Ambil paket rilis ---
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
PKG="$TMP/release.tar.gz"

if [ -f "$SRC" ]; then
  cp "$SRC" "$PKG"
elif [[ "$SRC" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  info "Mengunduh rilis terbaru dari github.com/$SRC…"
  if [ -n "${GH_TOKEN:-}" ]; then
    # repo private: cari id aset lewat API, lalu unduh dengan token
    api=$(curl -fsSL -H "Authorization: Bearer $GH_TOKEN" "https://api.github.com/repos/$SRC/releases/tags/latest") \
      || die "Rilis 'latest' tidak ditemukan. Cek tab Actions di GitHub, pastikan workflow sudah sukses, dan token punya akses repo."
    asset=$(printf '%s' "$api" | grep -o '"url": *"[^"]*/releases/assets/[0-9]*"' | head -1 | sed 's/.*"\(https[^"]*\)"/\1/')
    [ -n "$asset" ] || die "Aset undangan-release.tar.gz tidak ada di rilis 'latest'."
    curl -fsSL -H "Authorization: Bearer $GH_TOKEN" -H "Accept: application/octet-stream" -o "$PKG" "$asset"
  else
    curl -fsSL -o "$PKG" "https://github.com/$SRC/releases/download/latest/undangan-release.tar.gz" \
      || die "Gagal mengunduh. Repo private? Ulangi dengan GH_TOKEN=… Atau workflow di tab Actions belum sukses."
  fi
else
  die "'$SRC' bukan file maupun format USERNAME/NAMA-REPO."
fi
tar -tzf "$PKG" server.js >/dev/null 2>&1 || tar -tzf "$PKG" ./server.js >/dev/null 2>&1 || die "Paket rusak atau bukan undangan-release.tar.gz."

# --- User & folder ---
id "$APP_USER" >/dev/null 2>&1 || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin "$APP_USER"
mkdir -p "$APP_DIR"

systemctl stop undangan 2>/dev/null || true
# hapus versi lama, pertahankan .env.production bila ada
find "$APP_DIR" -mindepth 1 -maxdepth 1 ! -name .env.production -exec rm -rf {} +
tar -xzf "$PKG" -C "$APP_DIR"
mkdir -p "$APP_DIR/.next/cache"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# --- systemd service ---
cat > "$SERVICE" <<EOF
[Unit]
Description=Undangan Digital (Next.js)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
ExecStart=$(command -v node) server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=$PORT
Environment=HOSTNAME=$HOST
Environment=NODE_OPTIONS=--max-old-space-size=384
EnvironmentFile=-$APP_DIR/.env.production
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=$APP_DIR/.next/cache
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now undangan >/dev/null
systemctl restart undangan

# --- Cek ---
info "Menunggu server siap…"
for _ in $(seq 1 30); do
  if curl -fs -o /dev/null "http://127.0.0.1:$PORT/"; then
    ip=$(hostname -I 2>/dev/null | awk '{print $1}')
    info "Berjalan!"
    echo "    Di STB      : http://127.0.0.1:$PORT"
    [ "$HOST" = "0.0.0.0" ] && [ -n "$ip" ] && echo "    Dari HP/PC  : http://$ip:$PORT   (harus satu jaringan WiFi/LAN)"
    echo "    Log         : journalctl -u undangan -f"
    exit 0
  fi
  sleep 1
done
die "Server tidak merespons. Lihat log: journalctl -u undangan -n 50 --no-pager"
