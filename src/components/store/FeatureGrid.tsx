/* Ikon garis 24×24, stroke currentColor. */
const ICONS: Record<string, React.ReactNode> = {
  phone: <path d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c1-3.5 3.8-5 7-5s6 1.5 7 5" />,
  music: <path d="M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />,
  image: <path d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15.5 9h.01" />,
  chat: <path d="M4 5h16v11H9l-5 4zM8 9h8M8 12h5" />,
  pin: <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  gift: <path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1Zm0 0c1.5-3 5-3 5-1s-3 1-5 1Z" />,
  book: <path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v14c-3-1-5-1-8 1-3-2-5-2-8-1zM12 6v14" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2" />,
  heart: <path d="M12 20s-7-4.4-9.3-9A5.3 5.3 0 0 1 12 5.3 5.3 5.3 0 0 1 21.3 11C19 15.6 12 20 12 20Z" />,
  calendar: <path d="M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm4 8 2 2 4-4" />,
  send: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />,
};

const FEATURES = [
  { icon: "phone", t: "Rapi di semua layar", d: "Nyaman dibuka di ponsel, tablet, dan laptop." },
  { icon: "user", t: "Nama tamu personal", d: "Setiap tamu disapa dengan namanya di sampul." },
  { icon: "music", t: "Musik latar", d: "Lagu pilihan langsung berputar saat undangan dibuka." },
  { icon: "image", t: "Galeri foto & video", d: "Foto prewedding dan video YouTube dalam satu halaman." },
  { icon: "chat", t: "RSVP & ucapan", d: "Tamu konfirmasi hadir dan menulis doa, langsung terekap." },
  { icon: "pin", t: "Petunjuk lokasi", d: "Tombol Google Maps untuk akad dan resepsi." },
  { icon: "gift", t: "Amplop digital", d: "Rekening dan e-wallet dengan tombol salin, plus alamat kado." },
  { icon: "book", t: "Kutipan ayat", d: "Ayat atau kutipan favorit sebagai pembuka." },
  { icon: "clock", t: "Hitung mundur", d: "Countdown hari, jam, menit menuju hari H." },
  { icon: "heart", t: "Kisah cinta", d: "Linimasa perjalanan kalian dari awal bertemu." },
  { icon: "calendar", t: "Simpan ke kalender", d: "Tamu bisa menyimpan acara ke Google Calendar." },
  { icon: "send", t: "Alat kirim undangan", d: "Daftar link per tamu dan teks WhatsApp siap kirim." },
];

// Warna chip berputar agar grid terasa hidup tanpa jadi acak
const TINTS = ["bg-marigold-soft text-[#8a5a10]", "bg-blush-soft text-[#8f3f4a]", "bg-sage-soft text-moss"];

export function FeatureGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {FEATURES.map((f, i) => (
        <li key={f.t} className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${TINTS[i % TINTS.length]}`}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {ICONS[f.icon]}
            </svg>
          </span>
          <h3 className="mt-3 font-semibold leading-snug">{f.t}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{f.d}</p>
        </li>
      ))}
    </ul>
  );
}
