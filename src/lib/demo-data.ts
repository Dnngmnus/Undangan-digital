import type { InvitationData, Rsvp } from "./types";

/** Tanggal acara demo selalu ~3 bulan ke depan supaya countdown tetap jalan. */
function futureDate(daysAhead: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  // bulatkan ke hari Sabtu terdekat
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const img = (seed: string, w = 800, h = 1000) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export function getDemoInvitation(): { eventDate: string; data: InvitationData } {
  const date = futureDate(90);
  return {
    eventDate: `${date}T08:00:00+07:00`,
    data: {
      bride: {
        nickname: "Laras",
        fullName: "Larasati Ayu Pramesti, S.Ds.",
        parents: "Putri pertama dari Bapak Hendra Pramono & Ibu Wulan Sari",
        instagram: "larasati",
        photo: img("bride-portrait", 600, 800),
      },
      groom: {
        nickname: "Bima",
        fullName: "Bima Aditya Nugraha, S.T.",
        parents: "Putra kedua dari Bapak Agus Nugroho & Ibu Retno Handayani",
        instagram: "bimaaditya",
        photo: img("groom-portrait", 600, 800),
      },
      coverImage: img("wedding-couple-cover", 900, 1400),
      opening:
        "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.",
      quote: {
        text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
        source: "QS. Ar-Rum: 21",
      },
      events: [
        {
          title: "Akad Nikah",
          date,
          timeStart: "08.00",
          timeEnd: "10.00",
          timezone: "WIB",
          venue: "Masjid Agung An-Nur",
          address: "Jl. Pahlawan No. 1, Kota Kediri, Jawa Timur",
          mapsUrl: "https://maps.google.com/?q=Masjid+Agung+Kediri",
        },
        {
          title: "Resepsi",
          date,
          timeStart: "11.00",
          timeEnd: "14.00",
          timezone: "WIB",
          venue: "Gedung Serbaguna Bhagawanta",
          address: "Jl. Dhoho No. 45, Kota Kediri, Jawa Timur",
          mapsUrl: "https://maps.google.com/?q=Kediri",
        },
      ],
      stories: [
        { title: "Pertama bertemu", date: "Agustus 2019", text: "Kami dikenalkan seorang teman saat kerja bakti kampung. Laras membawa es teh, Bima membawa cangkul yang salah." },
        { title: "Menjalin hubungan", date: "Februari 2021", text: "Setelah dua tahun berteman dan banyak obrolan panjang lewat telepon, kami memutuskan berjalan bersama." },
        { title: "Lamaran", date: "Mei 2026", text: "Disaksikan kedua keluarga, Bima datang melamar. Hari itu kami sepakat menuju satu tujuan yang sama." },
      ],
      gallery: Array.from({ length: 8 }, (_, i) => img(`wedding-gallery-${i + 1}`, i % 3 === 0 ? 1000 : 800, i % 3 === 0 ? 700 : 1000)),
      gifts: [
        { bank: "BCA", accountNumber: "1234567890", accountName: "Larasati Ayu Pramesti" },
        { bank: "Mandiri", accountNumber: "1380012345678", accountName: "Bima Aditya Nugraha" },
      ],
      giftAddress: { recipient: "Larasati Ayu Pramesti", address: "Jl. Mawar No. 12, Kel. Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur 64114" },
      closing:
        "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    },
  };
}

export const DEMO_WISHES: Rsvp[] = [
  { id: "d1", invitation_id: "demo", name: "Dewi & Keluarga", attendance: "hadir", guests: 3, message: "Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah!", created_at: new Date(Date.now() - 3600_000).toISOString() },
  { id: "d2", invitation_id: "demo", name: "Raka", attendance: "ragu", guests: 1, message: "Barakallahu lakuma. Semoga lancar sampai hari H.", created_at: new Date(Date.now() - 86400_000).toISOString() },
  { id: "d3", invitation_id: "demo", name: "Tim Kantor", attendance: "tidak", guests: 0, message: "Maaf belum bisa hadir, doa terbaik dari kami semua.", created_at: new Date(Date.now() - 3 * 86400_000).toISOString() },
];
