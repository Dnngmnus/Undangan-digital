# Undangan Digital — Next.js 16 + Supabase

Platform undangan pernikahan digital: katalog tema untuk customer, pemesanan via WhatsApp, dan dashboard admin untuk membuat undangan, mengirim link per tamu, serta merekap RSVP.

## Fitur

| Area | Fitur |
|---|---|
| **Landing** (`/`) | Bar promo + hitung mundur, hero 3 ponsel, 12 fitur ber-ikon, katalog 3 tab **Tema Motion / Tema Foto / Tema Non Foto** (39 tema: 7 Motion + 28 Foto + 4 Non Foto, sampul dirender live dan bergerak, tombol jeda animasi), harga coret + badge diskon, add-on, testimoni, cara pesan, FAQ, tombol WhatsApp melayang |
| **Demo tema** (`/tema/[id]?to=Nama`) | Undangan contoh lengkap per tema, RSVP berjalan lokal (tanpa DB) |
| **Pemesanan** (`/order`) | Pilih tema, paket, dan add-on → total dihitung ulang di server → simpan ke DB → WhatsApp admin terbuka dengan ringkasan, add-on, total, dan kode pesanan |
| **Undangan** (`/[slug]?to=Nama`) | Gerbang "Buka undangan" + nama tamu, musik latar (pustaka lagu `public/music` atau upload per undangan), countdown, simpan ke Google Calendar, Maps, love story, galeri + lightbox, amplop digital (salin rekening), RSVP & ucapan, navigasi bawah, layout 2 kolom di desktop, meta OG untuk preview WhatsApp |
| **Admin** (`/admin`) | Login, daftar pesanan (add-on & total) + ubah status, kelola testimoni, buat undangan dari pesanan (data terisi otomatis), editor dengan pratinjau sampul live, upload foto/musik ke Supabase Storage, generator link + teks WA per tamu, rekap RSVP + ekspor CSV |

## Arsitektur

```
src/
├── app/
│   ├── page.tsx                 # katalog / landing
│   ├── [slug]/page.tsx          # undangan publik
│   ├── tema/[id]/page.tsx       # demo tema
│   ├── order/page.tsx           # form pemesanan
│   ├── actions/                 # server actions publik (order, rsvp)
│   └── admin/                   # login + (panel)/… dashboard, actions.ts
├── components/
│   ├── invitation/              # renderer undangan (dipakai SEMUA tema)
│   │   └── Motion.tsx           # komponen gerak: Ken Burns, partikel, reel, tumpukan foto, marquee
│   ├── store/                   # komponen katalog
│   └── admin/                   # editor, upload, tools tamu
├── themes/registry.ts           # ← definisi tema
├── lib/                         # types, supabase client, utils, data demo, paket
└── proxy.ts                     # proteksi /admin (Next 16: pengganti middleware)
supabase/schema.sql              # tabel, RLS, bucket storage
```

**Sistem tema berbasis token.** Satu renderer (`components/invitation`) dipakai semua tema; tema hanya berisi palet, 3 font (script/display/body), jenis ornamen SVG (`botanical | deco | kawung | line | boho | wave`), dan layout sampul (`arch | frame | full | split`). Token dipasang sebagai CSS variable dan dipetakan ke utility Tailwind (`bg-iv-bg`, `text-iv-primary`, `font-script`, …).

**Konten undangan** disimpan sebagai `jsonb` (`invitations.data`, tipe `InvitationData` di `src/lib/types.ts`) sehingga menambah field tidak butuh migrasi.

## Mengatur promo, harga, dan add-on

Semua ada di `src/lib/catalog.ts`:

- `PACKAGES` — harga normal (`originalPrice`, tampil dicoret) dan harga promo (`price`).
- `ADDONS` — daftar add-on beserta harga. Total pesanan selalu dihitung ulang di server.
- `PROMO` — `active: false` mematikan bar promo, harga coret, dan badge diskon sekaligus. Akhir promo default = hari terakhir bulan berjalan pukul 23.59 WIB; isi `endsAt` (ISO string) untuk tanggal tetap.

## Testimoni

Dikelola di **Admin → Testimoni**: unggah screenshot chat atau tulis kutipan customer, lalu tampilkan/sembunyikan. Section testimoni di landing **tidak muncul selama belum ada testimoni**. Gunakan hanya ulasan asli dan minta izin customer sebelum ditampilkan.

## Menambah tema baru

Tambahkan satu objek ke `THEMES` di `src/themes/registry.ts`:

```ts
{
  id: "batik-sogan",            // dipakai di URL & database
  name: "Batik Sogan",
  category: "Tradisional",
  description: "…",
  palette: { bg: "#…", surface: "#…", ink: "#…", muted: "#…", primary: "#…", onPrimary: "#…", accent: "#…" },
  fonts: { script: "Great Vibes", display: "Cinzel", body: "Marcellus" }, // nama Google Fonts
  ornament: "kawung",
  cover: "frame",
  kind: "non-foto",              // opsional; default "foto"
}
```

Tema `non-foto` otomatis masuk tab **Tema Non Foto** dan di undangan semua foto disembunyikan (mempelai tampil sebagai monogram, galeri foto tidak dirender, video YouTube tetap tampil).

Tema langsung muncul di katalog, form order, dan editor admin. Untuk variasi visual baru (ornamen/layout sampul), tambahkan case di `Ornament.tsx` / `CoverArt.tsx`.

## Tema Motion (foto bergerak)

Tema motion adalah tema foto biasa yang diberi `motion` dan salah satu dari tiga sampul bergerak. Tidak butuh video: cukup foto cover + galeri.

| `cover` | Yang bergerak |
|---|---|
| `cinema` | Slideshow 4 foto layar penuh, crossfade + zoom perlahan (Ken Burns), nama muncul huruf demi huruf |
| `reel` | Tiga kolom foto bergulir naik-turun di belakang kartu nama kaca |
| `stack` | Tumpukan polaroid, kartu teratas terbang keluar lalu pindah ke belakang |

`motion.fx` menambahkan partikel di sampul dan di seluruh undangan: `petals` (kelopak), `leaves` (daun), `sparkle` (kilau), `bokeh` (cahaya lembut).

Di dalam undangan, tema motion juga mendapat: hero bergerak yang sama dengan sampul, tombol buka berdenyut, gerbang zoom-keluar, mempelai masuk dari kiri/kanan, kartu acara zoom-in, dan galeri berjalan (marquee) di atas galeri lightbox.

```ts
{
  id: "sinema-emas",
  name: "Sinema Emas",
  category: "Elegan",
  description: "…",
  palette: { … }, fonts: { … },
  ornament: "deco",
  cover: "cinema",              // cinema | reel | stack
  motion: { fx: "sparkle" },    // petals | leaves | sparkle | bokeh
}
```

Catatan teknis:

- Semua gerak murni CSS (`@keyframes mo-*` di `globals.css`), tanpa JS dan tanpa library, jadi sampul tetap Server Component dan thumbnail katalog memakai sampul aslinya.
- Slideshow memakai foto `coverImage` lalu `gallery` (tanpa duplikat, diulang bila kurang). Makin banyak foto, makin bervariasi; minimal 4 foto ideal. Satu foto saja tetap jalan (di-zoom perlahan).
- Thumbnail di luar layar dijeda otomatis (`PhoneFrame`), dan pengunjung bisa menekan **Jeda animasi** di katalog.
- Pengguna dengan pengaturan *reduce motion* melihat versi diam: foto pertama, tanpa partikel.
- Posisi partikel dibuat dari pengacak bilangan bulat deterministik agar tidak terjadi hydration mismatch.

## Setup

```bash
npm install
cp .env.example .env.local   # isi variabel
npm run dev                  # http://localhost:3000
```

Katalog dan demo tema **sudah berjalan tanpa Supabase**. Untuk pesanan, undangan, RSVP, dan dashboard:

1. Buat project di [supabase.com](https://supabase.com).
2. SQL Editor → jalankan seluruh isi `supabase/schema.sql`. Aman dijalankan ulang, termasuk untuk meng-upgrade database versi sebelumnya (kolom `addons`/`total` dan tabel `testimonials` ditambahkan otomatis).
3. Authentication → Users → *Add user* (email + password). Matikan *Allow new users to sign up* di Authentication → Sign In / Providers.
4. Daftarkan user tersebut sebagai admin:
   ```sql
   insert into public.admins (user_id) values ('<UUID user dari langkah 3>');
   ```
5. Isi `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADMIN_WA`, `NEXT_PUBLIC_SITE_URL`), lalu restart.

> Variabel `NEXT_PUBLIC_*` di-inline saat build — pastikan sudah terisi di environment build (mis. Vercel) sebelum `next build`.

## Alur kerja admin

1. Customer memesan di `/order` → pesanan masuk ke **Pesanan** dan WhatsApp admin.
2. Admin klik **Buat undangan** → nama mempelai, tema, dan tanggal terisi dari pesanan.
3. Lengkapi data, upload foto, centang **Publikasikan**, simpan.
4. Buka **Tamu & RSVP** → tempel daftar nama tamu → kirim link personal lewat WhatsApp.
5. Pantau konfirmasi & ucapan, unduh CSV untuk customer.

## Keamanan

- Row Level Security: publik hanya bisa membaca undangan yang dipublikasikan, mengirim RSVP ke undangan publik, dan membuat pesanan berstatus `baru`. Semua operasi lain hanya untuk user di tabel `admins` (`public.is_admin()`).
- Setiap server action admin memverifikasi ulang `is_admin()` di server; `proxy.ts` hanya lapisan redirect.
- Validasi input di server action + check constraint di database; honeypot anti-bot di form order & RSVP.
- Undangan diberi `noindex` agar tidak muncul di mesin pencari.

## Deploy (Vercel)

1. Push ke GitHub, import di Vercel.
2. Isi Environment Variables sama seperti `.env.local`, dengan `NEXT_PUBLIC_SITE_URL` = domain produksi.
3. Deploy. Tambahkan domain di Supabase → Authentication → URL Configuration.

## Catatan pengembangan

- Next.js 16 (Turbopack), React 19, Tailwind CSS v4, TypeScript 5.
- Foto dirender dengan `<img>` biasa karena sumbernya bebas (Storage, Drive, CDN). Jika semua foto lewat Supabase Storage, bisa diganti `next/image` + `remotePatterns`.
- Data demo memakai `picsum.photos`; ganti dengan foto contoh milik sendiri di `src/lib/demo-data.ts` untuk katalog produksi.

## Deploy ke STB / server sendiri

Push ke GitHub → GitHub Actions build otomatis (`.github/workflows/release.yml`) → di STB cukup:

```bash
sudo bash install-stb.sh USERNAME/NAMA-REPO
```

Panduan lengkap (upload ke GitHub, IP lokal, variabel, Cloudflare Tunnel, troubleshooting): [`deploy/README-STB.md`](deploy/README-STB.md).

Ubah harga/nama toko dari PC Windows lalu update ke STB dengan satu perintah: [`deploy/TUTORIAL-WINDOWS.md`](deploy/TUTORIAL-WINDOWS.md).

Setup database (Supabase), alur memproses pesanan sampai undangan terkirim, dan pustaka lagu: [`deploy/TUTORIAL-ADMIN.md`](deploy/TUTORIAL-ADMIN.md).
