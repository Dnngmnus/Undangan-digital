# Deploy ke STB HG680P (Armbian/Debian ARM64)

GitHub Actions yang build (STB tidak sanggup `next build` dengan RAM 1–2 GB), STB cukup mengunduh hasilnya.
Kebutuhan runtime di STB: ±130 MB RAM, ±20 MB disk.

```
push ke GitHub ──► Actions: build ──► Release "latest" (undangan-release.tar.gz) ──► STB: install-stb.sh
```

## 1. Upload ke GitHub

Buat repo baru di github.com (boleh **public** atau **private**), lalu dari folder proyek:

```bash
git init
git add .
git commit -m "Undangan digital"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Buka tab **Actions** di repo: workflow *Build release* jalan otomatis (±2 menit). Setelah centang hijau,
tab **Releases** berisi `undangan-release.tar.gz`.

> Upload lewat drag & drop di web juga bisa, tapi pastikan folder `.github` ikut ter-upload
> (di macOS/Windows folder berawalan titik sering tersembunyi). Tanpa folder itu, build otomatis tidak jalan.

## 2. Pasang di STB (coba via IP lokal)

```bash
curl -fsSL -o install-stb.sh https://raw.githubusercontent.com/USERNAME/NAMA-REPO/main/deploy/install-stb.sh
sudo bash install-stb.sh USERNAME/NAMA-REPO
```

Repo **private**: buat token di GitHub → Settings → Developer settings → Fine-grained tokens,
akses hanya repo ini, izin *Contents: Read-only*. Lalu:

```bash
curl -fsSL -H "Authorization: Bearer github_pat_xxx" -o install-stb.sh \
  https://raw.githubusercontent.com/USERNAME/NAMA-REPO/main/deploy/install-stb.sh
sudo GH_TOKEN=github_pat_xxx bash install-stb.sh USERNAME/NAMA-REPO
```

Skrip otomatis: memasang Node.js 22 bila belum ada, mengaktifkan sinkron jam (NTP), membuat user `undangan`,
memasang ke `/opt/undangan`, membuat service systemd, lalu menampilkan alamat seperti:

```
Dari HP/PC  : http://192.168.1.50:3000
```

Buka alamat itu dari HP/laptop yang **terhubung ke WiFi/LAN yang sama**.

## 3. Isi konfigurasi (Supabase, nomor WA, domain)

Repo → Settings → Secrets and variables → Actions → tab **Variables** → *New repository variable*:

| Nama | Contoh |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcd.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi…` |
| `NEXT_PUBLIC_ADMIN_WA` | `6281234567890` |
| `NEXT_PUBLIC_BRAND_NAME` | `Abati Invitation` |
| `NEXT_PUBLIC_SITE_URL` | uji lokal: `http://192.168.1.50:3000` · produksi: `https://undangan.domainmu.com` |

Nilai ini ditanam saat build, jadi setelah mengubahnya: tab Actions → *Build release* → **Run workflow**,
lalu di STB jalankan ulang `sudo bash install-stb.sh USERNAME/NAMA-REPO`.

Tanpa variabel Supabase, situs jalan dalam mode demo: katalog, demo tema, dan form order (langsung ke WA) berfungsi;
penyimpanan pesanan, RSVP, dan dashboard admin nonaktif.

## 4. Update versi

Push perubahan ke `main` → tunggu Actions selesai → di STB:

```bash
sudo bash install-stb.sh USERNAME/NAMA-REPO
```

## 5. Nanti: buka ke internet (Cloudflare Tunnel)

1. Pasang ulang dengan hanya mendengarkan localhost: `sudo HOST=127.0.0.1 bash install-stb.sh USERNAME/NAMA-REPO`
2. Cloudflare Zero Trust → Networks → Tunnels → Create tunnel → Debian arm64 → jalankan perintah
   `cloudflared service install <TOKEN>` di STB.
3. Public Hostname: `undangan.domainmu.com` → `HTTP` → `127.0.0.1:3000`.
4. Ubah variabel `NEXT_PUBLIC_SITE_URL` ke domain itu, build ulang, update STB.
5. Supabase → Authentication → URL Configuration → Site URL = domain itu.

## Perintah berguna

```bash
systemctl status undangan          # status
journalctl -u undangan -f          # log langsung
sudo systemctl restart undangan    # restart
hostname -I                        # IP lokal STB
```

## Troubleshooting

| Gejala | Penyebab & solusi |
|---|---|
| `Arsitektur armv7l tidak didukung` | OS 32-bit. Pasang Armbian **arm64**. |
| `Gagal mengunduh` | Workflow di tab Actions belum hijau, atau repo private tanpa `GH_TOKEN`. |
| Dari HP tidak bisa dibuka, di STB bisa | HP beda jaringan, atau firewall: `sudo ufw allow 3000/tcp` (bila ufw aktif). |
| Login admin langsung keluar | Jam STB salah: `timedatectl` → pastikan *System clock synchronized: yes*. |
| Ubah variabel tidak berpengaruh | Belum Run workflow ulang + jalankan ulang install-stb.sh. |
| Service mati, log `heap out of memory` | Aktifkan zram: `sudo apt install zram-tools`. |
