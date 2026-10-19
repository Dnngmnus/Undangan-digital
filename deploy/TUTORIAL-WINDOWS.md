# Tutorial: ubah harga/nama toko di PC Windows lalu update ke STB

Alurnya: **edit file di PC → jalankan 1 perintah → otomatis build, kirim, dan pasang di STB.**
Kalau ada salah ketik, proses berhenti di tahap build dan STB **tidak tersentuh** (situs tetap jalan versi lama).

---

## A. Persiapan (sekali saja)

### 1. Pasang Node.js
1. Buka https://nodejs.org → unduh versi **LTS** (Windows Installer `.msi`).
2. Jalankan, klik *Next* sampai selesai (biarkan semua opsi default).

### 2. Pasang Git for Windows (berisi Git Bash, scp, ssh)
1. Buka https://git-scm.com/download/win → unduh *64-bit Git for Windows Setup*.
2. Jalankan, klik *Next* sampai selesai (opsi default sudah benar).

### 3. Pasang VS Code (editor)
1. Buka https://code.visualstudio.com → unduh → pasang.
2. Jangan edit file proyek dengan Notepad: rawan menambah `.txt` di nama file atau merusak format.

### 4. Siapkan folder proyek
1. Ekstrak `undangan-digital.zip`.
2. Pindahkan isinya ke **`C:\undangan`**, sehingga ada `C:\undangan\package.json`.
   Hindari folder Desktop/Documents yang tersinkron OneDrive, dan path yang mengandung spasi.

### 5. Buat file konfigurasi `.env.production`
1. Buka VS Code → *File → Open Folder* → pilih `C:\undangan`.
2. Klik kanan area daftar file (kiri) → *New File* → ketik nama **`.env.production`** → Enter.
3. Isi, sesuaikan, lalu simpan (Ctrl+S):
   ```
   NEXT_PUBLIC_BRAND_NAME=Nama Toko Kamu
   NEXT_PUBLIC_ADMIN_WA=6281234567890
   NEXT_PUBLIC_SITE_URL=http://192.168.0.101:3000

   # Isi nanti setelah Supabase siap:
   # NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
   - `NEXT_PUBLIC_ADMIN_WA`: format **62**, tanpa `+`, tanpa spasi atau tanda hubung.
   - `NEXT_PUBLIC_SITE_URL`: alamat situs. Untuk sekarang IP STB; nanti diganti domain.

### 6. Buka Git Bash di folder proyek
- **Cara 1:** di VS Code menu *Terminal → New Terminal* → klik panah ⌄ di samping tanda `+` → pilih **Git Bash**.
- **Cara 2:** buka `C:\undangan` di File Explorer → klik kanan area kosong → *Show more options* → **Open Git Bash here**.

Cek pemasangan (harus muncul nomor versi, misal `v22.x.x` / `v24.x.x`):
```bash
node -v
```

### 7. Update pertama ke STB
```bash
bash deploy/update-stb.sh ardhea@192.168.0.101
```
Yang akan terjadi:
1. **Build paket.** Pertama kali ±3–5 menit (mengunduh dependensi), berikutnya ±1 menit.
2. **Kirim ke STB.**
   - Pertanyaan *Are you sure you want to continue connecting (yes/no)?* → ketik `yes` → Enter (hanya pertama kali).
   - Masukkan **password STB**. Ketikan tidak terlihat, itu normal.
3. **Pasang di STB.** Masukkan **password STB** lagi, lalu password **sudo** (biasanya sama).
4. Muncul `✓ Selesai.` → buka `http://192.168.0.101:3000` di HP/PC.

Alamat STB tersimpan, jadi selanjutnya cukup `bash deploy/update-stb.sh`.

---

## B. Setiap kali ada perubahan

1. Buka `C:\undangan` di VS Code.
2. Edit file yang perlu diubah (lihat tabel di bawah), lalu **Ctrl+S**.
3. Di terminal Git Bash:
   ```bash
   bash deploy/update-stb.sh
   ```
4. Buka situs di browser, tekan **Ctrl+F5** (refresh penuh).

### Apa diubah di mana

| Yang diubah | File | Bagian |
|---|---|---|
| Nama toko, nomor WA admin | `.env.production` | `NEXT_PUBLIC_BRAND_NAME`, `NEXT_PUBLIC_ADMIN_WA` |
| Harga paket, harga coret, fitur, masa aktif | `src/lib/catalog.ts` | `PACKAGES` |
| Add-on | `src/lib/catalog.ts` | `ADDONS` |
| Promo: nama, nyala/mati, tanggal akhir | `src/lib/catalog.ts` | `PROMO` |
| Lama pengerjaan ("2×24 jam") | `src/lib/catalog.ts` | `TURNAROUND` |
| FAQ & cara pesan | `src/app/page.tsx` | `FAQ`, `STEPS` |
| Judul & kalimat di bagian atas halaman | `src/app/page.tsx` | bagian `Hero` |

Tips: di VS Code tekan **Ctrl+P**, ketik nama file (mis. `catalog`), Enter.

### Contoh di `src/lib/catalog.ts`

**Ganti harga:**
```ts
  {
    id: "premium",            // ← jangan diubah (dipakai sistem)
    name: "Premium",          // nama yang tampil
    originalPrice: 250_000,   // harga coret
    price: 129_000,           // harga jual
    activePeriod: "Aktif 1 tahun",
    features: ["Semua fitur Basic", "Galeri hingga 20 foto", "Musik latar pilihan"],
  },
```
`129_000` sama dengan `129000`; garis bawah hanya pemisah ribuan agar mudah dibaca.

**Matikan promo** (bar promo, harga coret, dan badge diskon hilang sekaligus):
```ts
export const PROMO = {
  active: false,
```

**Promo dengan tanggal akhir tertentu** (default: akhir bulan berjalan):
```ts
  endsAt: "2026-11-15T23:59:00+07:00" as string | null,
```

**Tambah add-on:** salin satu baris, ubah isinya. `id` harus unik, huruf kecil tanpa spasi:
```ts
  { id: "qris", name: "QRIS amplop digital", description: "Tamu bisa kirim hadiah lewat scan QRIS.", price: 25_000 },
```

### Aturan penulisan supaya tidak error
- Teks selalu di antara tanda kutip: `"Aktif 1 tahun"`.
- Setiap item diakhiri koma `,`.
- Angka tanpa kutip dan tanpa titik: `129_000` ✓, `"129.000"` ✗.
- Jangan mengubah `id` paket (`basic`, `premium`, `eksklusif`): pesanan lama di database merujuk ke id ini.

---

## C. Kalau ada masalah

| Pesan | Solusi |
|---|---|
| `node: command not found` | Tutup lalu buka lagi Git Bash setelah memasang Node.js. Masih gagal? Restart PC. |
| Build berhenti dengan `Type error` / `Expected ","` / `Unexpected token` | Ada salah ketik. Pesan error menyebut **nama file dan nomor baris**: buka, perbaiki (biasanya koma/kutip), simpan, ulangi. STB tidak tersentuh. |
| `npm ERR! EPERM` / `operation not permitted` | Tutup VS Code dan jalankan dari Git Bash biasa; pastikan folder **bukan** di OneDrive. |
| `Permission denied, please try again` | Password STB salah ketik. |
| `Connection timed out` / `No route to host` | PC dan STB beda jaringan, atau IP STB berubah: cek di STB dengan `hostname -I`, lalu `bash deploy/update-stb.sh ardhea@IP_BARU`. |
| `$'\r': command not found` | Skrip tersimpan dengan format Windows. Di VS Code buka file `.sh` tersebut → klik tulisan **CRLF** di pojok kanan bawah → pilih **LF** → simpan. |
| Situs belum berubah | Tekan Ctrl+F5. Masih sama? Pastikan file sudah disimpan (titik putih di tab VS Code = belum disimpan). |

---

## D. Opsional: tanpa ketik password berulang

Di Git Bash (sekali saja):
```bash
ssh-keygen -t ed25519                     # tekan Enter terus sampai selesai
cat ~/.ssh/id_ed25519.pub | ssh ardhea@192.168.0.101 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```
Setelah itu kirim file tidak minta password lagi; hanya password **sudo** yang tetap ditanya.

---

## E. Simpan cadangan di GitHub

Setelah mengubah file, upload juga file yang berubah ke repo GitHub (*Add file → Upload files*,
dengan struktur folder yang sama) supaya ada cadangan. File `.env.production` **tidak perlu** diupload.
