// Struktur konten undangan (disimpan di kolom jsonb `invitations.data`).

export type Person = {
  nickname: string; // "Ajeng"
  fullName: string; // "Rahajeng Mellytria Noor Subagyo, S.Tr.Kes."
  parents: string; // "Putri kedua dari Bapak ... & Ibu ..."
  instagram?: string; // username tanpa @
  photo?: string; // URL foto
};

export type WeddingEvent = {
  title: string; // "Akad Nikah"
  date: string; // ISO date "2026-04-04"
  timeStart: string; // "07.00"
  timeEnd?: string; // "09.00" | "Selesai"
  timezone: string; // "WIB"
  venue: string;
  address: string;
  mapsUrl?: string;
};

export type StoryItem = {
  title: string;
  date?: string;
  text: string;
  image?: string;
};

export type GiftAccount = {
  bank: string; // "BCA", "Mandiri", "DANA", ...
  accountNumber: string;
  accountName: string;
};

export type InvitationData = {
  bride: Person;
  groom: Person;
  /** Urutan tampil: true = mempelai pria dulu (default: wanita dulu, seperti referensi). */
  groomFirst?: boolean;
  coverImage?: string;
  opening?: string; // salam pembuka
  quote?: { text: string; source?: string };
  events: WeddingEvent[];
  stories: StoryItem[];
  gallery: string[];
  gifts: GiftAccount[];
  giftAddress?: { recipient: string; address: string };
  music?: string; // URL mp3
  video?: string; // URL YouTube video prewedding
  closing?: string;
  liveStreamUrl?: string;
};

export type Invitation = {
  id: string;
  slug: string;
  theme_id: string;
  event_date: string;
  data: InvitationData;
  is_published: boolean;
  order_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Attendance = "hadir" | "tidak" | "ragu";

export type Rsvp = {
  id: string;
  invitation_id: string;
  name: string;
  attendance: Attendance;
  guests: number;
  message: string | null;
  created_at: string;
};

export type OrderStatus = "baru" | "diproses" | "menunggu_bayar" | "selesai" | "batal";

export type Order = {
  id: string;
  theme_id: string;
  package: string;
  customer_name: string;
  whatsapp: string;
  bride_name: string;
  groom_name: string;
  event_date: string | null;
  notes: string | null;
  status: OrderStatus;
  addons: string[];
  total: number | null;
  created_at: string;
};

export type Testimonial = {
  id: string;
  couple: string;
  message: string | null;
  image: string | null;
  theme_id: string | null;
  is_published: boolean;
  created_at: string;
};
