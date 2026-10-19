# Tutorial Admin: aktifkan database, proses pesanan, dan pustaka lagu

1. [Aktifkan Supabase](#1-aktifkan-supabase-sekali-saja-15-menit) (sekali saja, ±15 menit)
2. [Alur saat ada pesanan](#2-alur-saat-ada-pesanan)
3. [Pustaka lagu](#3-pustaka-lagu)
4. [Link demo untuk calon customer](#4-link-demo-untuk-calon-customer)

---

## 1. Aktifkan Supabase (sekali saja, ±15 menit)

Supabase adalah database gratis tempat pesanan, undangan, RSVP, testimoni, dan foto disimpan.
Tanpa ini situs berjalan dalam **mode demo** (katalog dan demo tema saja).

### 1.1 Buat project
1. Daftar di https://supabase.com (bisa login dengan akun GitHub).
2. Klik **New project**:
   - **Name**: bebas, misal `undangan`
   - **Database Password**: klik *Generate*, lalu **simpan** di tempat aman
   - **Region**: **Southeast Asia (Singapore)**, terdekat ke Indonesia
3. Klik **Create new project**, tunggu ±2 menit sampai selesai disiapkan.

### 1.2 Buat tabel
1. Menu kiri **SQL Editor** → **New query**.
2. Buka file `supabase/schema.sql` dari folder proyek di VS Code → Ctrl+A → Ctrl+C.
3. Tempel di SQL Editor → klik **Run**.
4. Harus muncul *Success. No rows returned*. File ini aman dijalankan ulang kapan saja.

### 1.3 Buat akun admin
1. Menu **Authentication** → **Users** → **Add user** → **Create new user**.
2. Isi email dan password untuk login dashboard, **centang Auto Confirm User** → **Create user**.
3. Klik baris user tersebut → salin **User UID** (format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
4. Kembali ke **SQL Editor** → **New query** → jalankan (ganti UID-nya):
   ```sql
   insert into public.admins (user_id) values ('TEMPEL-USER-UID-DI-SINI');
   ```
5. Menu **Authentication** → **Sign In / Providers** → matikan **Allow new users to sign up** → **Save**.
   Ini mencegah orang lain mendaftar sendiri.

### 1.4 Ambil URL dan kunci
1. Klik tombol **Connect** di bagian atas dashboard → salin **Project URL** (`https://xxxx.supabase.co`).
2. Menu **Project Settings** → **API Keys** → salin **Publishable key** (`sb_publishable_...`).
   Project lama yang hanya punya *anon key* (`eyJ...`) juga bisa dipakai.
   **Jangan pernah** memakai *secret key* / *service_role* di file ini.

### 1.5 Masukkan ke proyek dan update STB
1. Di VS Code buka `C:\undangan\.env.production`, tambahkan:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
   ```
2. Simpan, lalu di Git Bash: `bash deploy/update-stb.sh`
3. Buka `http://192.168.0.101:3000/admin` → login dengan email dan password dari langkah 1.3.

> Project gratis Supabase dijeda otomatis bila tidak ada aktivitas selama seminggu.
> Kalau situs tiba-tiba tidak bisa menyimpan pesanan, buka dashboard Supabase lalu klik **Restore project**.

---

## 2. Alur saat ada pesanan

```
Customer isi form ──► WA masuk + tercatat di Admin → Pesanan (status Baru)
      │
      ├─ Kirim tagihan & minta data ─────────► status: Menunggu bayar
      ├─ Customer bayar & kirim data ────────► status: Diproses → klik "Buat undangan"
      ├─ Isi editor, Publikasikan, cek hasil
      └─ Kirim link + daftar link tamu ──────► status: Selesai
```

### 2.1 Pesanan masuk
- WhatsApp admin menerima pesan otomatis berisi **kode pesanan**, tema, paket, add-on, dan total.
- Pesanan yang sama tercatat di **Admin → Pesanan** dengan status **Baru**.

### 2.2 Kirim tagihan dan minta data
Ubah status menjadi **Menunggu bayar**, lalu balas customer. Template pesan minta data:

```
Terima kasih sudah memesan 🙏 Mohon lengkapi data berikut:

MEMPELAI (wanita & pria)
- Nama panggilan
- Nama lengkap + gelar
- Putra/putri ke-… dari Bapak … & Ibu …
- Username Instagram (opsional)
- 1 foto masing-masing (potret)

ACARA (untuk akad & resepsi)
- Hari, tanggal, jam mulai–selesai
- Nama tempat + alamat lengkap
- Link Google Maps

FOTO & LAGU
- 1 foto sampul + foto galeri (maks sesuai paket)
- Lagu pilihan (judul, atau kirim file MP3)
- Link video YouTube (opsional)

AMPLOP DIGITAL (opsional)
- Bank/e-wallet, nomor, atas nama
- Alamat kirim kado

KISAH CINTA (opsional)
- 2–4 momen: judul, waktu, cerita singkat

DAFTAR TAMU
- Nama-nama tamu, satu nama per baris
```

### 2.3 Buat undangan
1. Setelah pembayaran masuk, ubah status menjadi **Diproses**.
2. Klik **Buat undangan** pada pesanan tersebut. Nama mempelai, tema, dan tanggal sudah terisi dari pesanan.
3. Lengkapi tiap bagian editor (klik judul bagian untuk membuka):

   | Bagian | Isi |
   |---|---|
   | Pengaturan | Tema (bisa diganti), **slug** = alamat undangan, mis. `laras-bima` → `…/laras-bima` |
   | Mempelai wanita / pria | Nama, gelar, orang tua, Instagram, foto (tombol **Unggah**) |
   | Acara | Akad, resepsi, dll. Tombol *Tambah acara* untuk acara lain (mis. Ngunduh Mantu) |
   | Teks pembuka, kutipan, penutup | Bisa dibiarkan default |
   | Kisah cinta | Opsional |
   | Foto & musik | Foto sampul, galeri (bisa pilih banyak sekaligus), **lagu dari pustaka**, video YouTube |
   | Amplop digital | Rekening/e-wallet dan alamat kado |

4. Pratinjau sampul di kanan berubah langsung sesuai isian.
5. Centang **Publikasikan** → **Simpan undangan** → klik **Buka undangan** untuk memeriksa hasilnya di HP.

> Tema **Non Foto** tidak menampilkan foto apa pun walaupun foto diunggah. Hanya video yang tetap tampil.

### 2.4 Kirim ke customer
1. Klik **Tamu & RSVP**.
2. Tempel daftar tamu dari customer (satu nama per baris). Teks pengantar bisa diedit.
3. Pilih salah satu:
   - **Salin semua link** → kirim ke customer, biar customer yang menyebar; atau
   - **Kirim WA** per tamu (membuka WhatsApp dengan teks siap kirim).
4. Ubah status pesanan menjadi **Selesai**.

### 2.5 Revisi dan setelah acara
- **Revisi**: Admin → **Undangan** → **Ubah** → edit → **Simpan perubahan**. Link tidak berubah, tamu langsung melihat versi baru.
- **Rekap RSVP**: Tamu & RSVP → **Unduh CSV** (bisa dibuka di Excel), kirim ke customer.
- **Ucapan tidak pantas**: Tamu & RSVP → **Hapus** pada baris tersebut.
- **Testimoni**: minta izin customer, lalu tambahkan di Admin → **Testimoni** (screenshot chat atau kutipan).

---

## 3. Pustaka lagu

Lagu di pustaka muncul sebagai pilihan dropdown di editor. Lagu pertama juga dipakai di semua halaman demo tema.

### 3.1 Menambah lagu
1. Taruh file MP3 di **`C:\undangan\public\music\`**.
2. **Nama file = judul yang tampil di dropdown.**
   Contoh: `Akad - Piano Instrumental.mp3` tampil sebagai *Akad - Piano Instrumental*.
   Garis bawah `_` otomatis jadi spasi.
3. Urutan mengikuti abjad nama file. Supaya lagu tertentu menjadi musik demo, beri awalan angka: `01 Akad Piano.mp3`.
4. Jalankan `bash deploy/update-stb.sh`. Lagu baru langsung tersedia di editor.

### 3.2 Ukuran file
- Usahakan **≤ 5 MB per lagu** (MP3 128 kbps, ±4 menit), supaya undangan cepat terbuka di HP tamu.
- Upload ke GitHub lewat web dibatasi 25 MB per file.

### 3.3 Sumber lagu
- Lagu bebas royalti untuk usaha, misalnya dari **Pixabay Music** atau **YouTube Audio Library**
  (YouTube Studio → Audio Library), aman dimasukkan ke pustaka. Tetap baca ketentuan lisensi di halaman masing-masing.
- Lagu rilisan artis/label dilindungi hak cipta. Jangan dimasukkan ke pustaka bawaan
  (pustaka dipakai di semua demo yang bisa dibuka siapa pun).
- Kalau customer meminta lagu tertentu, pakai kolom **"Atau URL / unggah MP3 khusus undangan ini"** di editor.
  File tersimpan di Supabase Storage khusus undangan itu, tidak ikut pustaka.

---

## 4. Link demo untuk calon customer

Setiap tema punya demo lengkap. Tambahkan `?to=Nama` agar sampul menyapa calon customer:

```
http://192.168.0.101:3000/tema/nur-emerald?to=Kak%20Sari
```

Daftar id tema ada di `src/themes/registry.ts` (baris `id: "..."`), atau klik **Lihat demo** di katalog lalu salin alamatnya.
Spasi pada nama ditulis `%20`.
